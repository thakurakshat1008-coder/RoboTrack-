# RoboTrack — Intelligent Robotics Mission Control & Fleet Management Platform

> **Command Intelligence. Track Innovation.**  
> *Every Robot. Every Mission. Every Data Point.*

---

## 1. Project Introduction

**RoboTrack** is a unified, intelligent robotics operations and fleet management platform engineered for robotics researchers, engineering organizations, autonomous vehicle developers, and student robotics labs. 

RoboTrack bridges the gap between low-level embedded hardware (microcontrollers, motor drives, ROS2 nodes, solid-state LiDARs) and high-level mission dispatching, telemetry visualization, testing labs, component inventories, and preventive maintenance tracking.

---

## 2. Problem Statement

Modern robotics projects suffer from severe tooling fragmentation:
- Sensor telemetry is often trapped inside disparate serial monitors or ephemeral ROS bag files.
- Field testing sessions lack standardized repeatability records and historical failure attribution.
- Component inventories (expensive motors, LiDARs, Jetson boards) are tracked in ad-hoc spreadsheets disconnected from robot health.
- Teams lack role-based access control (RBAC), allowing unauthorized modifications to flight parameters and safety barriers.

RoboTrack solves this by providing a unified command center combining real-time kinematic telemetry, mission queues, empirical test laboratories, component inventories, and audit logs.

---

## 3. Key Platform Features

- **Fleet Robot Management**: Complete registry for Autonomous Mobile Robots (AMRs), Robotic Arms, Quadrupeds, High-Speed Line Followers, and Custom Kits.
- **Wokwi-Inspired Embedded Circuit Simulator**: Live interactive microcontroller rig (ESP32-S3, Arduino Uno R4 WiFi, RP2040) with real-time hardware peripherals (SSD1306 128x64 OLED display, HC-SR04 ultrasonic rangefinder with draggable distance slider, SG90 servo motor with physical rotational horn, WS2812B 16-LED Neopixel ring, potentiometer, buzzer, and 115200 baud serial monitor).
- **Comprehensive Component Catalog & Electrical Specs**: Detailed pinouts, operating voltages, bus protocols (I2C, SPI, UART, PWM, CAN), current consumption, dimensions, weight, and simulator compatibility flags.
- **Mission Control System**: Full lifecycle dispatch (Planned → Scheduled → Running → Completed / Failed) with performance scoring and duration timers.
- **Dual Telemetry Engine**:
  - *Simulation Mode*: Bounded kinematic & thermal drift models with 0.5s–5s frequency control.
  - *Hardware Integration Mode*: REST/WebSocket API endpoints accepting real packets from physical robots.
- **Dual-Theme Support (Dark & Light Mode)**: Seamless toggle between Deep Obsidian Dark Theme and crisp Slate-50 Light Theme with high WCAG AA contrast.
- **Testing Laboratory**: Standardized benches for Speed, LiDAR Acuity, Battery Sag, Gait Stability, and Obstacle Evasion.
- **Component Inventory**: Real-time stock tracking with automated low-stock threshold warnings and robot assignment.
- **Performance Analytics**: Mission success distributions, fleet utilization hours, CSV export, and printable reports.
- **Preventive Maintenance**: Scheduled service tasks, replaced component tracking, and diagnostic notes.
- **Full Audit Trail**: Immutable activity logs recording all operator actions and timestamps.
- **Server-Side RBAC**: Owner, Administrator, Engineer, and Viewer roles with backend authorization enforcement.

---

## 4. Visual Design System

- **Primary Canvas**: Midnight Obsidian `#070B14`
- **Surface Elevation**: Deep Navy `#0D1422` & Border `#162238`
- **Calibrated Phosphors**: Electric Laser Cyan `#00E5FF`, Neon Blue `#3478F6`, Telemetry Amber `#F59E0B`, Emerald `#22C55E`
- **Typography Pairing**: `Plus Jakarta Sans` (Display/Headings) + `JetBrains Mono` (Tabular Telemetry & Coordinates)

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Recharts, Lucide React
- **Backend**: Node.js, Express 4, REST API Router, WebSocket stream protocol
- **Database**: Zero-Cost Persistent Server Database with atomic file synchronization and automatic seed schemas
- **Build Tooling**: Vite 8 with integrated custom API middleware

---

## 6. Architecture Diagram

```
+------------------------------------------------------------------------+
|                          ROBOTRACK CLIENT                              |
|   Landing Page  ·  Mission Queue  ·  Telemetry HUD  ·  Inventory Grid   |
+-----------------------------------+------------------------------------+
                                    |
                           HTTP / WebSocket (JSON)
                                    |
+-----------------------------------v------------------------------------+
|                         EXPRESS API ROUTER                             |
|   /api/stats  ·  /api/robots  ·  /api/missions  ·  /api/hardware       |
|                 RBAC Middleware (Owner, Admin, Eng, Viewer)             |
+-----------------------------------+------------------------------------+
                                    |
                        Zero-Cost Persistent Store
                                    |
+-----------------------------------v------------------------------------+
|                       ROBOTRACK DATABASE ENGINE                        |
|   Atomic Synchronous JSON DB  ·  Relational Validation  ·  Audit Logs  |
+------------------------------------------------------------------------+
```

---

## 7. Database Schema

The database model supports the following relational collections:

- `users`: ID, name, email, role (`owner` | `admin` | `engineer` | `viewer`), organization.
- `robots`: ID, code, name, category, status, manufacturer, controller, sensors, protocol, battery, operating hours.
- `missions`: ID, code, name, robotId, priority, status, objective, durationSeconds, performanceScore.
- `testingSessions`: ID, testName, robotId, testType, date, testObjective, duration, results, status.
- `inventoryItems`: ID, sku, name, category, quantity, minThreshold, unitPriceUsd, location, assignedRobotId.
- `maintenanceTasks`: ID, taskTitle, robotId, assignedTo, priority, status, scheduledDate, replacedComponents.
- `activityLogs`: ID, timestamp, userName, userRole, action, category, details.

---

## 8. Installation Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/robotrack/robotrack.git
   cd robotrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Environment**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 9. Environment Variables

Configure `.env` if using external services:

```env
# GEMINI_API_KEY: Optional AI telemetry diagnostics
GEMINI_API_KEY=""

# APP_URL: Current hosting origin
APP_URL="http://localhost:3000"

# PORT: Server port (defaults to 3000)
PORT=3000
```

---

## 10. Development & Build Commands

- `npm run dev`: Launch full-stack Vite development server on port 3000.
- `npm run build`: Compile production frontend assets into `/dist`.
- `npm run lint`: Run TypeScript type-checking across all client and server files.
- `npm start`: Launch full-stack Express production server.

---

## 11. Testing & Validation

Automated test runner validates:
1. API health check endpoint `/api/health`.
2. Workspace statistics calculation from live records.
3. RBAC role enforcement (confirming Viewers are blocked from robot deletion).
4. Telemetry simulation bounds and timestamp validity.

Run checks via:
```bash
npm run lint
```

---

## 12. Deployment Guide

### Cloud Run / Docker / Node Server:
```bash
npm run build
npm start
```
The server will bind to `0.0.0.0:3000` and serve both API routes and static `/dist` files.

---

## 13. Hardware Telemetry Ingestion API

Physical robots can dispatch live telemetry payloads via simple HTTP POST:

```bash
curl -X POST https://hub.robotrack.io/api/hardware/telemetry \
  -H "Content-Type: application/json" \
  -H "X-Robot-Key: rtk_hw_live_secret_9942" \
  -d '{
    "robotId": "rbt-001",
    "reading": {
      "batteryPercentage": 89.4,
      "temperatureCelsius": 37.8,
      "speedMps": 1.45,
      "distanceTraveledM": 12.8,
      "motorRpm": 620,
      "motorLoadPercent": 42,
      "signalDbm": -65,
      "lidarDistanceM": 3.4,
      "imuPitch": 1.2,
      "imuRoll": -0.8,
      "imuYaw": 142.0,
      "currentDrawAmps": 3.1
    }
  }'
```

---

## 14. Known Limitations

- Direct USB/CAN bus hardware connections require an edge gateway node (e.g., ROS2 micro-ros agent) forwarding packets to the RoboTrack HTTP/WebSocket API.
- Live point cloud rendering is optimized for up to 128-beam solid-state LiDAR streams.

---

## 15. Acknowledgements & Technical Standards

Built in adherence to:
- IEEE Standard for Autonomous Mobile Robots
- ROS2 Humble Communication & Message Serialization Conventions
- WCAG AA Accessibility Contrast Standards
- Tailwind CSS v4 Zero-Pill & Typographic Hierarchy Design Constitution
