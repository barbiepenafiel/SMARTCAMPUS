# 🛡️ SmartCampus SecureNet

> **A Web-Based Device Mapping and Monitoring Dashboard for Network and Security Devices**

SmartCampus SecureNet is a web-based network monitoring and device management system designed for the **IC Building of Davao del Norte State College (DNSC)**.

The system automatically discovers network devices using **ARP (Address Resolution Protocol)** and **ICMP (Internet Control Message Protocol)** and provides IT personnel with real-time information about device connectivity, availability, latency, topology, alerts, and network performance.

---

## 📑 Table of Contents

* [Project Overview](#-project-overview)
* [Key Features](#-key-features)
* [System Users](#-system-users)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Prerequisites](#-prerequisites)
* [Installation](#-installation)
* [Environment Configuration](#-environment-configuration)
* [Database Setup](#-database-setup)
* [Running the Project](#-running-the-project)
* [First-Time Setup](#-first-time-setup)
* [Usage Guide](#-usage-guide)
* [API Reference](#-api-reference)
* [Troubleshooting](#-troubleshooting)
* [Deployment](#-deployment)
* [Security Notes](#-security-notes)
* [Project Information](#-project-information)

---

# 📌 Project Overview

**SmartCampus SecureNet** is a full-stack web application developed to improve the monitoring and management of network infrastructure within the **IC Building of Davao del Norte State College**.

The system uses **ARP scanning** and **ICMP ping** to discover and monitor network devices such as:

* Routers
* Switches
* Access Points
* Computers
* Other connected network devices

It provides a centralized dashboard where authorized users can monitor device status, analyze network performance, view topology, receive actionable alerts, and generate reports.

The system is intended to help network administrators and IT personnel identify connectivity problems more efficiently and maintain better visibility of the campus network environment.

---

# ✨ Key Features

| Feature                          | Description                                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| 🔍 **Device Discovery**          | Automatically discovers network devices using ICMP ping sweeps and ARP table scanning.             |
| 🟢 **Real-Time Monitoring**      | Displays the current online, offline, and warning status of network devices.                       |
| 🗺️ **Network Topology**         | Provides graph, hierarchy, and floor-based visualizations of network devices.                      |
| 📡 **Connectivity Monitoring**   | Tracks device availability and latency through ICMP.                                               |
| 🚨 **Alert Management**          | Generates alerts for downtime, recovery, and abnormal network conditions.                          |
| 📧 **Email Notifications**       | Sends important network alerts to authorized personnel.                                            |
| 📊 **Network Analytics**         | Displays latency trends, uptime percentages, alert summaries, and network performance information. |
| 🗂️ **Device Filtering**         | Allows devices to be filtered by category, date, location, and status.                             |
| 🏷️ **Device Classification**    | Organizes network devices into categories such as routers, switches, and access points.            |
| 👥 **Role-Based Access Control** | Provides separate permissions for Network Administrators and IT Personnel.                         |
| 📝 **Audit Logging**             | Records system activities including user, action, IP address, and timestamp.                       |
| 📄 **Report Generation**         | Provides network monitoring reports and CSV exports.                                               |
| ⚡ **Real-Time Updates**          | Uses Socket.IO to update device information without manually refreshing pages.                     |

---

# 👥 System Users

SmartCampus SecureNet supports two primary user roles.

### Network Administrator

The Network Administrator has full access to the system and can:

* Monitor network devices
* Manage device information
* View network topology
* View network analytics
* Configure system settings
* Manage users
* Review activity logs
* Resolve alerts
* Generate reports
* Configure monitoring settings

### IT Personnel

IT Personnel have monitoring-focused access and can:

* View discovered devices
* Monitor device status
* View network topology
* Check network performance
* View analytics
* Review alerts
* Filter devices
* Generate or view permitted reports

---

# 🛠️ Technology Stack

## Backend

| Component               | Technology                 |
| ----------------------- | -------------------------- |
| Runtime                 | Node.js 22+                |
| Framework               | Express 4.x                |
| Database                | Supabase PostgreSQL        |
| Real-Time Communication | Socket.IO 4.7.5            |
| Authentication          | express-session + bcryptjs |
| Email                   | Nodemailer                 |
| Network Discovery       | ICMP Ping + ARP            |
| System Commands         | Node.js `child_process`    |

## Frontend

| Component             | Technology             |
| --------------------- | ---------------------- |
| UI Framework          | Bootstrap 5.3.3        |
| Charts                | Chart.js 4.4.1         |
| Network Visualization | Vis-Network 9.1.2      |
| Graph Visualization   | Cytoscape 3.30.2       |
| Real-Time Client      | Socket.IO Client 4.7.5 |
| Icons                 | Font Awesome 6.5.1     |
| Fonts                 | IBM Plex Sans / Sora   |

---

# 📁 Project Structure

```text
smartCampus/
│
├── .env
├── .gitignore
├── vercel.json
├── README.md
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── html/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── devices.html
│   ├── topology.html
│   ├── alerts.html
│   ├── reports.html
│   ├── profile.html
│   ├── settings.html
│   ├── users.html
│   └── activity.html
│
├── js/
│   ├── script.js
│   ├── auth.js
│   ├── monitoring.js
│   ├── analytics.js
│   ├── users.js
│   └── activity.js
│
├── css/
│   └── pages/
│
├── components/
│   └── sidebar.html
│
└── images/
    └── ...
```

> **Important:** Never commit the `.env` file because it contains sensitive configuration and credentials.

---

# 📋 Prerequisites

Before installing SmartCampus SecureNet, make sure the following are installed or available:

| Requirement      | Version / Description                     |
| ---------------- | ----------------------------------------- |
| Node.js          | 22+                                       |
| npm              | 9+                                        |
| Git              | Latest recommended version                |
| Supabase         | PostgreSQL database                       |
| Operating System | Windows 10/11 or Linux                    |
| Network Access   | Connection to the network being monitored |

### Windows

The backend uses commands such as:

```bash
ipconfig
arp -a
```

These commands are used to determine network information and discover connected devices.

For accurate network monitoring, the backend should run on a computer connected to the target campus network.

---

# 🚀 Installation

## 1. Clone the Repository

```bash
git clone <repository-url>
```

Enter the project directory:

```bash
cd smartCampus
```

## 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

---

# ⚙️ Environment Configuration

Create the required `.env` configuration files before starting the application.

## Supabase Configuration

Add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_DB_URL=your_postgresql_session_pooler_connection
```

Never expose the `SUPABASE_SECRET_KEY` to frontend JavaScript.

The administrative Supabase client should only be used for authorized backend operations.

---

## Session Configuration

```env
SESSION_SECRET=replace_with_64_character_random_string
SESSION_MAX_AGE_MS=28800000
SESSION_COOKIE_SECURE=false
```

Generate a secure session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For HTTPS production environments:

```env
SESSION_COOKIE_SECURE=true
```

---

## Network Configuration

```env
ROUTER_IP=192.168.254.254
NETWORK_CIDR=
BLACKLISTED_IPS=
```

`NETWORK_CIDR` can be left blank when automatic network detection is available.

Example:

```env
NETWORK_CIDR=192.168.1.0/24
```

Multiple excluded IP addresses can be added to:

```env
BLACKLISTED_IPS=192.168.1.5,192.168.1.10
```

---

## Email Alert Configuration

```env
ALERT_EMAIL_ENABLED=true

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

SMTP_USER=your_sender@gmail.com
SMTP_PASS=your_gmail_app_password

ALERT_EMAIL_FROM=SmartCampus SecureNet
ALERT_EMAIL_TO=it_team@yourinstitution.edu
```

Use a **Google App Password**, not your normal Gmail password.

### Gmail App Password

1. Open your Google Account.
2. Go to **Security**.
3. Enable **2-Step Verification**.
4. Search for **App Passwords**.
5. Create an App Password for your application.
6. Add the generated password to `SMTP_PASS`.

---

## CORS Configuration

For local development:

```env
ALLOWED_ORIGINS=http://localhost:3000
```

For production, replace this with the deployed frontend domain.

---

# 🗄️ Database Setup

SmartCampus SecureNet uses **Supabase PostgreSQL** as its application database.

From the `server` directory, run:

```bash
npm run db:migrate
```

If migrating existing records from the project's previous MySQL database:

```bash
npm run db:import:mysql
```

After migration:

```bash
npm start
```

The migration process creates the required application tables.

Existing MySQL records can be imported while preserving information such as:

* User accounts
* Password hashes
* Device IDs
* Activity logs
* Alerts

Refer to:

```text
server/MIGRATION.md
```

for the complete migration procedure.

---

# ▶️ Running the Project

## Start the Backend

Open a terminal:

```bash
cd server
node server.js
```

The backend should start at:

```text
http://localhost:4000
```

The terminal will display startup information such as the detected gateway and network CIDR.

---

## Start the Frontend

From the project root:

```bash
npx serve .
```

The frontend should normally become available at:

```text
http://localhost:3000
```

Open:

```text
http://localhost:3000/html/login.html
```

---

# 🔑 First-Time Setup

After successfully running the application:

1. Open `html/signup.html`.
2. Register the first user account.
3. Open the Supabase SQL Editor.
4. Assign the first account the Admin role.

Example:

```sql
UPDATE public."USERS"
SET "Role" = 'Admin'
WHERE "Email" = 'your@email.com';
```

5. Log in using the registered account.
6. Open **Settings**.
7. Configure network monitoring and email alert settings.

---

# 📖 Usage Guide

## 📊 Dashboard

The dashboard provides an overview of the network, including:

* Total discovered devices
* Online devices
* Offline devices
* Average latency
* Active alerts
* Latency trends
* Live monitoring information

Real-time information is updated through Socket.IO.

---

## 🖥️ Devices

The Devices page displays discovered network devices.

Users can view information such as:

* IP address
* MAC address
* Device status
* Latency
* Device type
* Building
* Floor
* Room
* Location

Authorized users can also:

* Edit device information
* Ping a device
* Classify devices
* Filter devices
* Delete devices

---

## 🌐 Network Topology

The topology module provides multiple ways to visualize the campus network.

### Graph View

Displays devices and their network relationships using an interactive graph.

### Floor Map

Allows network devices to be positioned according to their physical location in the IC Building.

### Hierarchy View

Organizes devices according to their network or physical hierarchy.

---

## 🚨 Alerts

The Alerts page displays network events such as:

* Device downtime
* Device recovery
* High latency
* Warning conditions

Alerts can contain different severity levels to help IT personnel prioritize actionable network problems.

Authorized users can mark alerts as resolved.

---

## 📈 Reports and Analytics

Analytics can be viewed for different periods:

```text
24 Hours
7 Days
30 Days
```

Available information includes:

* Network overview
* Latency trends
* Device uptime
* Device downtime
* Alert summaries
* Device performance trends

Reports can also be exported when supported.

---

## ⚙️ Settings

**Administrator only**

Administrators can configure:

* Automated scanning
* Scan intervals
* Email alerts
* Monitoring settings

---

## 👥 User Management

**Administrator only**

Administrators can:

* View users
* Create users
* Change user roles
* Delete accounts

---

## 📜 Activity Log

**Administrator only**

The system maintains an audit trail containing information such as:

* User
* Action
* IP address
* Date
* Time
* System event

This helps administrators review important actions performed within the system.

---

# 🔌 API Reference

The backend API runs at:

```text
http://localhost:4000
```

## Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/login`    | Authenticate user     |
| POST   | `/api/auth/register` | Register account      |
| POST   | `/api/auth/logout`   | End current session   |
| GET    | `/api/auth/me`       | Retrieve current user |
| PUT    | `/api/auth/profile`  | Update user profile   |

## Devices

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| GET    | `/api/devices`              | Retrieve devices          |
| DELETE | `/api/devices/:id`          | Delete device             |
| PUT    | `/api/devices/:id/location` | Update device information |
| GET    | `/api/devices/:id/ping`     | Ping a specific device    |

## Monitoring

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/api/monitor/router`   | Perform router/network scan |
| POST   | `/api/monitor/discover` | Trigger device discovery    |
| GET    | `/api/ping?target=IP`   | Ping an IP address          |

## Topology

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | `/api/topology` | Retrieve network topology |

## Alerts

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/alerts`             | Retrieve recent alerts |
| PUT    | `/api/alerts/:id/resolve` | Resolve an alert       |

## Analytics

| Method | Endpoint                                   | Description      |
| ------ | ------------------------------------------ | ---------------- |
| GET    | `/api/analytics/overview?period=24h`       | Network overview |
| GET    | `/api/analytics/latency-trend?period=7d`   | Latency trends   |
| GET    | `/api/analytics/device-uptime?period=30d`  | Device uptime    |
| GET    | `/api/analytics/alerts-summary?period=24h` | Alert summary    |

## Settings

**Administrator only**

| Method | Endpoint                     | Description                  |
| ------ | ---------------------------- | ---------------------------- |
| GET    | `/api/settings/scanning`     | Get scanning status          |
| PUT    | `/api/settings/scanning`     | Enable/disable scanning      |
| GET    | `/api/settings/email-alerts` | Retrieve email configuration |
| POST   | `/api/settings/email-alerts` | Update email alert settings  |

## Users

**Administrator only**

| Method | Endpoint              | Description      |
| ------ | --------------------- | ---------------- |
| GET    | `/api/users`          | Retrieve users   |
| PUT    | `/api/users/:id/role` | Change user role |
| DELETE | `/api/users/:id`      | Delete user      |

## Audit Logs

| Method | Endpoint             | Description            |
| ------ | -------------------- | ---------------------- |
| GET    | `/api/activity-logs` | Retrieve activity logs |

---

# ⚡ Real-Time Events

SmartCampus SecureNet uses **Socket.IO** for real-time communication.

| Event                 | Direction       | Description                |
| --------------------- | --------------- | -------------------------- |
| `topology:update`     | Server → Client | Network topology changed   |
| `devices:update`      | Server → Client | Device information changed |
| `devices:ping_stream` | Server → Client | Live latency information   |
| `alert:new`           | Server → Client | New network alert          |

---

# 🔧 Troubleshooting

## Cannot Connect to Supabase

Check that:

```env
SUPABASE_DB_URL=
```

contains the correct PostgreSQL session-pooler connection string.

Then run:

```bash
cd server
npm run db:migrate
```

Restart the backend afterward.

---

## Gateway Not Detected

Check the gateway on Windows:

```bash
ipconfig
```

Confirm that `ROUTER_IP` matches the correct network gateway.

If automatic network detection fails, configure:

```env
NETWORK_CIDR=192.168.1.0/24
```

---

## No Devices Discovered

Make sure:

* The backend computer is connected to the target network.
* The gateway address is correct.
* ICMP is permitted.
* The server has the required permissions.
* The target devices are reachable.

On Windows, try running the terminal as **Administrator**.

---

## Email Alerts Not Working

Check:

```env
ALERT_EMAIL_ENABLED=true
```

Also verify:

* `SMTP_USER`
* `SMTP_PASS`
* Gmail 2-Step Verification
* Gmail App Password
* Email alert settings in the application

---

## CORS Error

Make sure the backend is running on:

```text
http://localhost:4000
```

Check:

```env
ALLOWED_ORIGINS=http://localhost:3000
```

The value should match the frontend address.

---

## Real-Time Updates Not Working

Check:

* Socket.IO server is running.
* Socket.IO client is connected.
* Browser console does not contain WebSocket errors.
* Port `4000` is not blocked by the firewall.

---

# 🌐 Deployment

## Backend

The backend can be deployed to a VPS or another server capable of accessing the monitored network.

Install PM2:

```bash
npm install -g pm2
```

Start the backend:

```bash
cd smartCampus/server

pm2 start server.js --name smartcampus-backend
pm2 save
pm2 startup
```

For production:

```env
SESSION_COOKIE_SECURE=true
```

The backend should be served through **HTTPS** using a reverse proxy such as nginx or Caddy.

> **Important:** Network discovery requires access to the actual target network. A cloud-hosted backend generally cannot perform ARP discovery of devices inside a private campus LAN unless appropriate network connectivity is provided.

---

## Frontend

The static frontend can be deployed using Vercel.

From the project root:

```bash
npm install -g vercel
vercel --prod
```

After deployment, update:

```env
ALLOWED_ORIGINS=https://your-frontend-domain
```

---

# 🔐 Security Notes

Before deploying SmartCampus SecureNet, follow these security practices:

1. **Never commit `.env` files.**
2. Never expose Supabase secret or administrative keys to the frontend.
3. Use a strong and randomly generated `SESSION_SECRET`.
4. Enable HTTPS in production.
5. Set `SESSION_COOKIE_SECURE=true` when using HTTPS.
6. Restrict `ALLOWED_ORIGINS` to trusted frontend domains.
7. Use role-based authorization for administrative endpoints.
8. Keep passwords hashed using `bcryptjs`.
9. Use Gmail App Passwords instead of normal Gmail passwords.
10. Rotate credentials immediately if they are accidentally committed.
11. Maintain authentication rate limiting.
12. Regularly review activity and audit logs.

To check whether `.env` was previously committed:

```bash
git log --all --full-history -- .env
```

---

# 🎓 Project Information

**Project Title:**
SmartCampus SecureNet: A Web-Based Device Mapping and Monitoring Dashboard for Network and Security Devices

**Institution:**
Davao del Norte State College (DNSC)

**Institute:**
Institute of Computing

**Location:**
Panabo City, Davao del Norte, Philippines

**Target Environment:**
IC Building Network

**Project Type:**
Capstone Project

---

## 🎯 Project Goal

SmartCampus SecureNet aims to provide a centralized and efficient way of discovering, monitoring, visualizing, and managing network devices within the DNSC IC Building.

Through real-time monitoring, device mapping, analytics, alert management, and reporting, the system is designed to help Network Administrators and IT Personnel maintain better visibility of the network environment and respond more efficiently to connectivity issues.

---

<div align="center">

### 🛡️ SmartCampus SecureNet

**Monitor • Visualize • Analyze • Secure**

Davao del Norte State College
Institute of Computing

</div>
