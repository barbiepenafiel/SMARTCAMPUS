const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const output = path.join(root, 'public');
fs.mkdirSync(output, { recursive: true });
// Explicit allowlist: never copy environment files, backend source, logs, or SQL exports.
for (const directory of ['html', 'js', 'css', 'images', 'components']) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}
for (const file of fs.readdirSync(path.join(output, 'html'))) {
  if (!file.endsWith('.html')) continue;
  const target = path.join(output, 'html', file);
  const html = fs.readFileSync(target, 'utf8').replace(/<head>/i, '<head>\n<script src="/runtime-config.js"></script>');
  fs.writeFileSync(target, html);
}
fs.writeFileSync(path.join(output, 'runtime-config.js'), `window.SMARTCAMPUS_CLOUD = true;
document.addEventListener('DOMContentLoaded', () => {
  if (/login|signup|mainpage/.test(location.pathname)) return;
  const notice = document.createElement('div');
  notice.className = 'alert alert-info rounded-0 mb-0 text-center small';
  notice.setAttribute('role', 'status');
  notice.textContent = 'Cloud dashboard: showing the latest saved data. Live network scans run on the campus computer.';
  document.body.prepend(notice);
});
`);
console.log('Vercel public assets prepared.');
