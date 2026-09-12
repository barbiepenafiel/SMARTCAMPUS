require('./env');
const mysql = require('mysql2/promise');
const { createPool } = require('./postgres');

const tables = ['USERS', 'LOCATION', 'DEVICE', 'DEVICE_LOG', 'DEVICE_CONNECTION', 'ALERT', 'activity_logs'];
const quote = name => '"' + name.replaceAll('"', '""') + '"';

async function importMysql({ targetPool } = {}) {
  const offset = process.env.MYSQL_DATETIME_OFFSET;
  if (!/^[+-]\d{2}:\d{2}$/.test(offset || '')) {
    throw new Error('Set MYSQL_DATETIME_OFFSET to the timezone of your old MySQL DATETIME values (for example +08:00 for Manila or +00:00 for UTC).');
  }
  const pool = targetPool || createPool();
  let source, target;
  try {
    source = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME, dateStrings: true, connectTimeout: 10000,
    });
    await source.query("SET time_zone = '+00:00'");
    await source.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
    await source.query('START TRANSACTION WITH CONSISTENT SNAPSHOT, READ ONLY');
    target = await pool.connect();
    await target.query('BEGIN');
    await target.query(`LOCK TABLE ${tables.map(quote).join(', ')} IN ACCESS EXCLUSIVE MODE`);
    for (const table of tables) {
      const { rows } = await target.query(`SELECT count(*) AS n FROM ${quote(table)}`);
      if (Number(rows[0].n)) throw new Error(`Import stopped: ${table} already contains records. No data was overwritten.`);
    }
    for (const table of tables) {
      const [columns] = await source.query('SHOW COLUMNS FROM ??', [table]);
      const { rows: targetColumns } = await target.query(
        'SELECT column_name FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2', ['public', table]);
      const names = new Set(targetColumns.map(c => c.column_name));
      const unsupported = columns.filter(c => !names.has(c.Field));
      if (unsupported.length) throw new Error(`Import stopped: ${table} has unmapped columns: ${unsupported.map(c => c.Field).join(', ')}. Source data is unchanged.`);
      const primary = columns.find(c => c.Key === 'PRI');
      if (!primary) throw new Error(`No primary key found for ${table}.`);
      let lastId = 0, copied = 0;
      while (true) {
        const [rows] = await source.query('SELECT * FROM ?? WHERE ?? > ? ORDER BY ?? LIMIT 500', [table, primary.Field, lastId, primary.Field]);
        if (!rows.length) break;
        const params = [];
        const tuples = rows.map(row => '(' + columns.map(column => {
          let value = row[column.Field];
          if (value !== null && /^(datetime|timestamp)/i.test(column.Type)) {
            const zone = /^timestamp/i.test(column.Type) ? '+00:00' : offset;
            value = `${value.replace(' ', 'T')}${zone}`;
          }
          params.push(value);
          return '$' + params.length;
        }).join(', ') + ')');
        await target.query(`INSERT INTO ${quote(table)} (${columns.map(c => quote(c.Field)).join(', ')}) VALUES ${tuples.join(', ')}`, params);
        copied += rows.length;
        lastId = rows.at(-1)[primary.Field];
      }
      const [sourceCount] = await source.query('SELECT COUNT(*) AS n FROM ??', [table]);
      const { rows: destinationCount } = await target.query(`SELECT COUNT(*) AS n FROM ${quote(table)}`);
      if (Number(sourceCount[0].n) !== Number(destinationCount[0].n)) throw new Error(`Row count mismatch for ${table}.`);
      await target.query(`SELECT setval(pg_get_serial_sequence($1, $2), COALESCE(MAX(${quote(primary.Field)}), 1), COUNT(*) > 0) FROM ${quote(table)}`, [quote(table), primary.Field]);
      console.log(`${table}: ${copied} rows validated (pending commit).`);
    }
    await target.query('COMMIT');
    console.log('Import committed. Original MySQL data was not modified.');
  } catch (error) {
    if (target) await target.query('ROLLBACK');
    throw error;
  } finally {
    if (source) { await source.rollback(); await source.end(); }
    if (target) target.release();
    await pool.end();
  }
}

if (require.main === module) importMysql().catch(error => {
  console.error('Import failed:', error.code || error.message);
  process.exitCode = 1;
});
module.exports = { importMysql };
