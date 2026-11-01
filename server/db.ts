import fs from 'fs';
import path from 'path';
import { 
  Robot, 
  Mission, 
  TestingSession, 
  InventoryItem, 
  MaintenanceTask, 
  ActivityLog, 
  User, 
  WorkspaceStats,
  TelemetryReading
} from '../src/types/index.ts';

interface DatabaseSchema {
  users: User[];
  robots: Robot[];
  missions: Mission[];
  testingSessions: TestingSession[];
  inventoryItems: InventoryItem[];
  maintenanceTasks: MaintenanceTask[];
  activityLogs: ActivityLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'robotrack_db.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr-1',
      name: 'Dr. Elena Rostova',
      email: 'thakur.akshat101@gmail.com',
      role: 'owner',
      avatarUrl: '',
      organization: 'RoboTrack Autonomous Labs'
    },
    {
      id: 'usr-2',
      name: 'Marcus Vance',
      email: 'marcus@robotrack.io',
      role: 'admin',
      avatarUrl: '',
      organization: 'RoboTrack Autonomous Labs'
    },
    {
      id: 'usr-3',
      name: 'Kenji Sato',
      email: 'kenji.s@robotrack.io',
      role: 'engineer',
      avatarUrl: '',
      organization: 'Kinematics Division'
    },
    {
      id: 'usr-4',
      name: 'Sarah Lin',
      email: 'sarah.lin@robotrack.io',
      role: 'viewer',
      avatarUrl: '',
      organization: 'Safety & Compliance'
    }
  ],
  robots: [
    {
      id: 'rbt-001',
      code: 'RBT-ARES',
      name: 'Ares-IV Autonomous Scout',
      type: 'Autonomous Mobile Robot',
      status: 'Online',
      description: 'Heavy-payload 4-wheel drive rough-terrain exploration rover with solid-state LiDAR and RTK-GPS.',
      manufacturer: 'RoboTrack Dynamics',
      controller: 'NVIDIA Jetson AGX Orin + STM32H7',
      sensors: ['3D Flash LiDAR', 'Intel RealSense D435i', 'RTK-GPS', 'IMU 9-DOF', 'Ultrasonic Array'],
      communicationProtocol: 'ROS2 Humble / Micro-XRCE-DDS / 5G SA',
      registrationDate: '2026-02-14',
      batteryLevel: 94,
      firmwareVersion: 'v4.2.1-lts',
      ipAddress: '192.168.10.42',
      location: 'Chamber Beta - Test Track',
      totalMissions: 38,
      operationalHours: 247.5
    },
    {
      id: 'rbt-002',
      code: 'RBT-TITAN',
      name: 'Titan-6 Precision Manipulator',
      type: 'Robotic Arm',
      status: 'Testing',
      description: '6-degree-of-freedom robotic manipulator arm for semiconductor assembly and pick-and-place testing.',
      manufacturer: 'Kinematic Robotics Ltd.',
      controller: 'EtherCAT Master / BeagleBone Black Industrial',
      sensors: ['Harmonic Drive Encoders', '6-Axis Force Torque Sensor', 'Pneumatic Pressure Sensor'],
      communicationProtocol: 'EtherCAT / ROS2 Control',
      registrationDate: '2026-03-01',
      batteryLevel: 100, // Tethered power
      firmwareVersion: 'v3.8.0',
      ipAddress: '192.168.10.15',
      location: 'Cleanroom Lab 2',
      totalMissions: 22,
      operationalHours: 184.0
    },
    {
      id: 'rbt-003',
      code: 'RBT-VANGUARD',
      name: 'Vanguard-Q1 Quadruped Explorer',
      type: 'Quadruped',
      status: 'Online',
      description: 'Agile 12-DOF quadruped robot designed for stair navigation and hazardous industrial inspection.',
      manufacturer: 'CyberMech Robotics',
      controller: 'Raspberry Pi 5 + Teensy 4.1 Field Bus',
      sensors: ['Dual Stereo Depth Cameras', 'Foot Contact Force Sensors', 'IMU Bosch BNO085'],
      communicationProtocol: 'WebSockets / ROS2 Zenoh',
      registrationDate: '2026-04-10',
      batteryLevel: 82,
      firmwareVersion: 'v2.1.4',
      ipAddress: '192.168.10.88',
      location: 'Structural Obstacle Yard',
      totalMissions: 19,
      operationalHours: 92.3
    },
    {
      id: 'rbt-004',
      code: 'RBT-VECTOR',
      name: 'Vector-L High-Speed Line Follower',
      type: 'Line-Following Robot',
      status: 'Offline',
      description: 'Ultra-low-latency optical sensor tracking racer for competitive high-speed path optimization.',
      manufacturer: 'AeroLine Pro Labs',
      controller: 'ESP32-S3 Dual-Core Xtensa',
      sensors: ['16-Channel Optical Line Sensor Bar', 'Wheel Speed Encoders'],
      communicationProtocol: 'ESP-NOW / Bluetooth LE 5.3',
      registrationDate: '2026-05-18',
      batteryLevel: 45,
      firmwareVersion: 'v1.4.2',
      ipAddress: '192.168.10.104',
      location: 'Bay 4 Storage Rack',
      totalMissions: 44,
      operationalHours: 65.2
    },
    {
      id: 'rbt-005',
      code: 'RBT-AEGIS',
      name: 'Aegis-2 Obstacle Rover',
      type: 'Obstacle-Avoiding Robot',
      status: 'Maintenance',
      description: 'Autonomous safety-certified logistics rover with 360-degree bumper collision detection.',
      manufacturer: 'RoboTrack Dynamics',
      controller: 'NVIDIA Jetson Orin Nano + Arduino Giga',
      sensors: ['2D 360-degree RPLiDAR A3', 'Ultrasonic Ping Sensor Array', 'Optical Flow Cam'],
      communicationProtocol: 'MQTT / TLS 1.3 / Wi-Fi 6',
      registrationDate: '2026-06-05',
      batteryLevel: 68,
      firmwareVersion: 'v3.1.0',
      ipAddress: '192.168.10.63',
      location: 'Maintenance Workshop A',
      totalMissions: 31,
      operationalHours: 156.8
    },
    {
      id: 'rbt-006',
      code: 'RBT-NOVA',
      name: 'Nova-X Educational Kit',
      type: 'Educational Kit',
      status: 'Online',
      description: 'Modular robotics development platform for students, researchers, and rapid prototyping.',
      manufacturer: 'OpenRobotics Academy',
      controller: 'Raspberry Pi 4B 4GB',
      sensors: ['Monocular Camera', 'Ultrasonic Sensor', 'Wheel Odometry'],
      communicationProtocol: 'REST API / WebSockets',
      registrationDate: '2026-08-20',
      batteryLevel: 88,
      firmwareVersion: 'v2.0.1',
      ipAddress: '192.168.10.112',
      location: 'Student Prototyping Bay',
      totalMissions: 15,
      operationalHours: 48.0
    }
  ],
  missions: [
    {
      id: 'msn-101',
      code: 'MSN-2026-081',
      name: 'Autonomous Perimeter Scanning Phase 2',
      robotId: 'rbt-001',
      robotName: 'Ares-IV Autonomous Scout',
      priority: 'High',
      status: 'Running',
      objective: 'Execute high-resolution 3D point cloud sweep of the western boundary and verify geofence barriers.',
      scheduledStart: '2026-11-01T06:00:00Z',
      startTime: '2026-11-01T06:02:14Z',
      durationSeconds: 2040,
      performanceScore: 97.4,
      notes: 'Operating in nominal simulation test run. LiDAR data density 1.2M pts/sec.',
      createdBy: 'Dr. Elena Rostova'
    },
    {
      id: 'msn-102',
      code: 'MSN-2026-079',
      name: 'Pick-and-Place Precision Repeatability Run',
      robotId: 'rbt-002',
      robotName: 'Titan-6 Precision Manipulator',
      priority: 'Normal',
      status: 'Completed',
      objective: 'Verify 500-cycle pick-and-place accuracy tolerance under 0.05mm variance.',
      scheduledStart: '2026-10-31T14:00:00Z',
      startTime: '2026-10-31T14:05:00Z',
      endTime: '2026-10-31T16:15:30Z',
      durationSeconds: 7830,
      performanceScore: 99.2,
      notes: 'Completed without deviation. Zero joint backlash detected.',
      createdBy: 'Kenji Sato'
    },
    {
      id: 'msn-103',
      code: 'MSN-2026-080',
      name: 'Multi-Surface Stair Climb Calibration',
      robotId: 'rbt-003',
      robotName: 'Vanguard-Q1 Quadruped Explorer',
      priority: 'High',
      status: 'Completed',
      objective: 'Test kinematic gait stabilization over 15-degree incline and steel mesh risers.',
      scheduledStart: '2026-10-31T18:00:00Z',
      startTime: '2026-10-31T18:03:00Z',
      endTime: '2026-10-31T19:30:00Z',
      durationSeconds: 5220,
      performanceScore: 94.8,
      notes: 'Foot force sensors calibrated successfully.',
      createdBy: 'Dr. Elena Rostova'
    },
    {
      id: 'msn-104',
      code: 'MSN-2026-082',
      name: 'Dynamic Collision Avoidance Run',
      robotId: 'rbt-005',
      robotName: 'Aegis-2 Obstacle Rover',
      priority: 'Critical',
      status: 'Planned',
      objective: 'Validate emergency stopping distance under 350ms with unexpected dynamic obstacles.',
      scheduledStart: '2026-11-02T09:00:00Z',
      notes: 'Scheduled for immediate deployment once scheduled maintenance completes.',
      createdBy: 'Marcus Vance'
    },
    {
      id: 'msn-105',
      code: 'MSN-2026-075',
      name: 'Warehouse Floor Mapping Baseline',
      robotId: 'rbt-001',
      robotName: 'Ares-IV Autonomous Scout',
      priority: 'Normal',
      status: 'Completed',
      objective: 'Generate 2D occupancy grid of primary warehouse hall with loop-closure verification.',
      scheduledStart: '2026-10-28T10:00:00Z',
      startTime: '2026-10-28T10:01:00Z',
      endTime: '2026-10-28T11:45:00Z',
      durationSeconds: 6240,
      performanceScore: 98.6,
      notes: 'Map saved to server database. Resolution 0.02m/pixel.',
      createdBy: 'Kenji Sato'
    }
  ],
  testingSessions: [
    {
      id: 'tst-001',
      testName: 'High-Torque Speed & Brake Deceleration Test',
      robotId: 'rbt-001',
      robotName: 'Ares-IV Autonomous Scout',
      testType: 'Speed Testing',
      date: '2026-10-30',
      testObjective: 'Measure maximum linear velocity and stopping distance on dry asphalt.',
      testDurationSeconds: 1800,
      status: 'Passed',
      results: 'Max velocity 3.42 m/s achieved. Braking distance 0.42 m within target range.',
      observations: 'Traction control intervention was smooth. Motor thermal rise was +8.2°C.',
      conductedBy: 'Dr. Elena Rostova'
    },
    {
      id: 'tst-002',
      testName: 'LiDAR Refraction & Transparent Surface Bench',
      robotId: 'rbt-001',
      robotName: 'Ares-IV Autonomous Scout',
      testType: 'Sensor Testing',
      date: '2026-10-29',
      testObjective: 'Validate point return rates through polycarbonate partitions.',
      testDurationSeconds: 2400,
      status: 'Passed',
      results: 'Point cloud density maintained 91% return efficiency.',
      observations: 'Dual-pulse mode resolved ghost reflections effectively.',
      conductedBy: 'Kenji Sato'
    },
    {
      id: 'tst-003',
      testName: 'Discharge Curve Under Continuous 400W Load',
      robotId: 'rbt-003',
      robotName: 'Vanguard-Q1 Quadruped Explorer',
      testType: 'Battery Testing',
      date: '2026-10-27',
      testObjective: 'Measure cell balancing and voltage sag during continuous trot gait.',
      testDurationSeconds: 4500,
      status: 'Passed',
      results: 'Battery lasted 72.4 minutes under continuous load. Minimum cell delta was 14mV.',
      observations: 'Cutoff voltage safety triggered cleanly at 21.6V.',
      conductedBy: 'Dr. Elena Rostova'
    },
    {
      id: 'tst-004',
      testName: 'Obstacle Evasion Latency in Low Light (<5 Lux)',
      robotId: 'rbt-005',
      robotName: 'Aegis-2 Obstacle Rover',
      testType: 'Obstacle Detection Testing',
      date: '2026-10-25',
      testObjective: 'Verify sensor fusion fallback when optical cameras lose daylight contrast.',
      testDurationSeconds: 1200,
      status: 'Warning',
      results: 'Ultrasonic array detected obstacles at 1.8m, but 2D LiDAR exhibited intermittent timeout.',
      observations: 'Recommended firmware sensor fusion filter tuning. Task logged to maintenance.',
      conductedBy: 'Marcus Vance'
    }
  ],
  inventoryItems: [
    {
      id: 'inv-001',
      sku: 'MTR-BLDC-48V',
      name: 'High-Torque Brushless Hub Motor 48V 350W',
      category: 'Motors',
      quantity: 8,
      minThreshold: 4,
      unitPriceUsd: 145.0,
      manufacturer: 'T-Motor Robotics',
      specifications: '48V DC, 350W rated, integrated 12-bit magnetic encoder, IP67 waterproof.',
      location: 'Bin A-14, Motor Bay',
      lastRestocked: '2026-10-15',
      operatingVoltage: '36V - 52V DC (Nominal 48V)',
      busProtocol: 'Hall Sensor 3-Phase + UVW + Encoder ABZ',
      currentDraw: '7.3A rated, 24A peak',
      dimensions: '165 × 165 × 72 mm',
      weight: '2150 g',
      pinout: ['Phase U (Yellow)', 'Phase V (Green)', 'Phase W (Blue)', 'Hall 5V', 'Hall GND', 'Hall A', 'Hall B', 'Hall C'],
      packageType: 'Direct Drive Sealed Hub Housing',
      tolerance: '±0.05 Nm / 0.087° encoder precision',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/TMOTOR-U8.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-002',
      sku: 'SNS-LDR-360',
      name: 'Ouster OS1-32 Rev 7 3D LiDAR Sensor',
      category: 'Sensors',
      quantity: 2,
      minThreshold: 2,
      unitPriceUsd: 3800.0,
      manufacturer: 'Ouster Inc.',
      specifications: '32-beam 3D solid-state LiDAR, 120m range, 10/20Hz frame rate, Gigabit Ethernet.',
      location: 'Secure Cabinet C-02',
      assignedRobotId: 'rbt-001',
      assignedRobotName: 'Ares-IV Autonomous Scout',
      lastRestocked: '2026-09-20',
      operatingVoltage: '9V - 34V DC (Nominal 12V / 24V)',
      busProtocol: '1000BASE-T Gigabit Ethernet / UDP PTP 1588v2',
      currentDraw: '1.2A @ 12V (14W)',
      dimensions: '85 × 85 × 73 mm',
      weight: '445 g',
      pinout: ['1: VCC+', '2: VCC-', '3: ETH_TX+', '4: ETH_TX-', '5: ETH_RX+', '6: ETH_RX-', '7: SYNC_PULSE_IN', '8: MULTIPURPOSE_IO'],
      packageType: 'IP68 & IP69K Anodized Aluminum Enclosure',
      tolerance: '±1.5 cm distance accuracy / 0.1° angular resolution',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/OUSTER-OS1-32.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-003',
      sku: 'CTL-JET-AGX',
      name: 'NVIDIA Jetson AGX Orin Developer Kit 64GB',
      category: 'Controllers',
      quantity: 3,
      minThreshold: 2,
      unitPriceUsd: 1999.0,
      manufacturer: 'NVIDIA Corp.',
      specifications: '275 TOPS AI inference, 64GB 256-bit LPDDR5, 2048-core NVIDIA Ampere GPU.',
      location: 'Electronics Bench 4',
      assignedRobotId: 'rbt-001',
      assignedRobotName: 'Ares-IV Autonomous Scout',
      lastRestocked: '2026-10-01',
      operatingVoltage: '9V - 20V DC (Standard 19V Barrel)',
      busProtocol: 'PCIe Gen4, USB 3.2, Dual CAN 2.0B, I2C, SPI, UART, MIPI-CSI',
      currentDraw: '15W (Efficiency mode) to 60W (Max-N)',
      dimensions: '110 × 110 × 71.6 mm',
      weight: '650 g',
      pinout: ['40-pin Expansion Header (3.3V GPIO, I2C1, I2C2, SPI1, UART1, PWM1-2)'],
      packageType: 'Carrier Board + Heatsink Module',
      tolerance: 'Automotive ISO 26262 functional safety ready',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/JETSON-AGX-ORIN.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-004',
      sku: 'BAT-LIFE-24V',
      name: 'LiFePO4 Deep-Cycle Battery Pack 24V 25Ah',
      category: 'Batteries',
      quantity: 1, // LOW STOCK
      minThreshold: 3,
      unitPriceUsd: 320.0,
      manufacturer: 'PowerTech Pro',
      specifications: '25.6V nominal, 640Wh capacity, integrated smart CAN-bus BMS with thermal sensors.',
      location: 'Battery Charging Dock 1',
      assignedRobotId: 'rbt-003',
      assignedRobotName: 'Vanguard-Q1 Quadruped Explorer',
      lastRestocked: '2026-08-14',
      operatingVoltage: '20.0V (Cutoff) - 29.2V (Full Charge)',
      busProtocol: 'CAN 2.0B 250kbps (BMS State of Charge & Cell Voltage Broadcast)',
      currentDraw: '50A continuous discharge, 120A pulse (5s)',
      dimensions: '260 × 168 × 178 mm',
      weight: '5800 g',
      pinout: ['M8 Terminal (+)', 'M8 Terminal (-)', 'CAN_H', 'CAN_L', 'BMS_ALARM_OUT'],
      packageType: 'ABS Flame Retardant Sealed Enclosure',
      tolerance: '±15mV cell balance delta',
      inStock: false,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/POWERTECH-24V25AH.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-005',
      sku: 'WHL-MCN-150',
      name: 'Heavy-Duty 152mm Omnidirectional Mecanum Wheel Set',
      category: 'Wheels',
      quantity: 12,
      minThreshold: 4,
      unitPriceUsd: 85.0,
      manufacturer: 'Nexus Industrial',
      specifications: '152mm diameter, aluminum alloy body, 15 polyurethane rollers, 50kg load rating per wheel.',
      location: 'Rack D-08',
      lastRestocked: '2026-10-18',
      operatingVoltage: 'Passive Mechanical',
      busProtocol: 'Keyway Hub Shaft Mount 12mm / 14mm',
      currentDraw: '0A (Mechanical)',
      dimensions: 'Ø 152 mm × 55 mm width',
      weight: '820 g per wheel',
      pinout: ['6x M5 Bolt Circle Ø 47.5mm'],
      packageType: 'Cold-forged 6061-T6 Aluminum',
      tolerance: 'Runout < 0.2mm',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/MECANUM-152.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-006',
      sku: 'COM-5G-MOD',
      name: 'Quectel RM520N-GL 5G Sub-6GHz M.2 Module',
      category: 'Communication Modules',
      quantity: 4,
      minThreshold: 2,
      unitPriceUsd: 185.0,
      manufacturer: 'Quectel',
      specifications: '5G NR NSA/SA, Sub-6 GHz, LTE-A Cat 20, GNSS positioning, 3.4 Gbps downlink.',
      location: 'Bin B-03',
      lastRestocked: '2026-09-12',
      operatingVoltage: '3.135V - 4.4V (Nominal 3.7V)',
      busProtocol: 'PCIe 2.0 / USB 3.1 / Dual SIM Interface / PCM',
      currentDraw: '65mA idle, 1.8A max burst transmission',
      dimensions: '52.0 × 30.0 × 2.3 mm (M.2 Key B)',
      weight: '8.4 g',
      pinout: ['75-pin M.2 Key-B standard pinout'],
      packageType: 'M.2 Form Factor Shielded Card',
      tolerance: 'Industrial temp grade -40°C to +85°C',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/QUECTEL-RM520N.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-007',
      sku: 'SNS-US-HC04',
      name: 'HC-SR04 Ultrasonic Distance Sensor Module',
      category: 'Sensors',
      quantity: 18,
      minThreshold: 5,
      unitPriceUsd: 3.50,
      manufacturer: 'ElecFreaks Robotics',
      specifications: 'Dual transducer ultrasonic ranger, 2cm to 400cm distance, 15° measuring angle.',
      location: 'Bin C-01 (Sensor Drawers)',
      lastRestocked: '2026-10-22',
      operatingVoltage: '5.0V DC',
      busProtocol: 'TTL Digital Pulse (Trig / Echo)',
      currentDraw: '15mA active',
      dimensions: '45 × 20 × 15 mm',
      weight: '8.5 g',
      pinout: ['1: VCC (5V)', '2: TRIG (Trigger Input)', '3: ECHO (Pulse Output)', '4: GND'],
      packageType: 'Through-hole Dual Piezo Transducer Board',
      tolerance: '±3 mm resolution',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/HC-SR04.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-008',
      sku: 'ACT-SRV-SG90',
      name: 'TowerPro SG90 9g Micro Precision Servo 180°',
      category: 'Motors',
      quantity: 24,
      minThreshold: 6,
      unitPriceUsd: 4.20,
      manufacturer: 'TowerPro',
      specifications: 'Micro analog servo motor, 1.8 kg·cm stall torque at 4.8V, 0.10 sec/60° rotational speed.',
      location: 'Bin A-02, Actuator Bay',
      lastRestocked: '2026-10-12',
      operatingVoltage: '4.8V - 6.0V DC',
      busProtocol: 'Standard 50Hz PWM (1ms - 2ms pulse width for 0° - 180°)',
      currentDraw: '10mA idle, 220mA moving, 650mA stall',
      dimensions: '22.2 × 11.8 × 31 mm',
      weight: '9.0 g',
      pinout: ['Brown: GND', 'Red: VCC (5V)', 'Orange: PWM Signal'],
      packageType: 'POM Gearbox with Horn Set',
      tolerance: '±1° mechanical repeatability',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/SG90-SERVO.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-009',
      sku: 'DSP-OLED-128',
      name: 'SSD1306 0.96" Monochrome I2C OLED Display',
      category: 'Other Components',
      quantity: 14,
      minThreshold: 4,
      unitPriceUsd: 6.80,
      manufacturer: 'Solomon Systech',
      specifications: '128x64 self-illuminating graphical OLED display, high contrast, 160° viewing angle.',
      location: 'Bin C-05',
      lastRestocked: '2026-10-05',
      operatingVoltage: '3.3V - 5.0V DC (Internal charge pump)',
      busProtocol: 'I2C Interface (Default slave address 0x3C or 0x3D)',
      currentDraw: '20mA typical (with all pixels 50% lit)',
      dimensions: '27.3 × 27.8 × 4.1 mm',
      weight: '4.2 g',
      pinout: ['1: GND', '2: VCC (3.3V-5V)', '3: SCL (I2C Clock)', '4: SDA (I2C Data)'],
      packageType: 'COB Breakout with 4-Pin 2.54mm Header',
      tolerance: 'Dot Pitch 0.23 × 0.23 mm',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/SSD1306.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-010',
      sku: 'LED-NEO-RING',
      name: 'WS2812B 16-LED Addressable Neopixel Ring',
      category: 'Other Components',
      quantity: 10,
      minThreshold: 3,
      unitPriceUsd: 8.50,
      manufacturer: 'WorldSemi Microelectronics',
      specifications: 'Full color 24-bit 5050 RGB LEDs with integrated constant current PWM driver in ring array.',
      location: 'Bin C-09',
      lastRestocked: '2026-09-28',
      operatingVoltage: '5.0V DC',
      busProtocol: 'NZR Single Wire 800kHz High-Speed Serial',
      currentDraw: '18mA per color (max 60mA per LED at full white)',
      dimensions: 'Outer Ø 44.5mm, Inner Ø 31.7mm',
      weight: '6.0 g',
      pinout: ['1: VCC (5V)', '2: GND', '3: DI (Data Input)', '4: DO (Data Output to next ring)'],
      packageType: 'FR-4 Circular PCB Assembly',
      tolerance: 'True 16.7M color depth',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/WS2812B.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-011',
      sku: 'CTL-ESP-S3',
      name: 'Espressif ESP32-S3-WROOM-1 DevKit 16MB',
      category: 'Controllers',
      quantity: 15,
      minThreshold: 5,
      unitPriceUsd: 9.90,
      manufacturer: 'Espressif Systems',
      specifications: 'Xtensa 32-bit LX7 dual-core 240MHz, 512KB SRAM, 16MB Flash, 8MB PSRAM, Wi-Fi 4 + BLE 5.0.',
      location: 'Electronics Bench 2',
      lastRestocked: '2026-10-24',
      operatingVoltage: '3.0V - 3.6V (5V via USB-C onboard LDO)',
      busProtocol: '44x GPIO, 4x SPI, 3x UART, 2x I2C, I2S, RMT, PWM, USB-OTG',
      currentDraw: '40mA base, 355mA Wi-Fi transmission burst, 7µA Deep Sleep',
      dimensions: '48.26 × 25.4 × 3.5 mm',
      weight: '12.0 g',
      pinout: ['44-pin dual row header (GPIO 0-48, 3V3, 5V, GND, EN, BOOT)'],
      packageType: 'Dual-Row Breadboard Friendly Development Board',
      tolerance: 'Hardware Vector Instructions for Neural Acceleration',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/ESP32-S3.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-012',
      sku: 'CTL-RPI-5',
      name: 'Raspberry Pi 5 Single Board Computer 8GB RAM',
      category: 'Controllers',
      quantity: 5,
      minThreshold: 2,
      unitPriceUsd: 80.00,
      manufacturer: 'Raspberry Pi Ltd.',
      specifications: 'Broadcom BCM2712 Quad-Core Cortex-A76 @ 2.4GHz, VideoCore VII GPU, dual 4Kp60 HDMI.',
      location: 'Electronics Bench 1',
      assignedRobotId: 'rbt-003',
      assignedRobotName: 'Vanguard-Q1 Quadruped Explorer',
      lastRestocked: '2026-10-10',
      operatingVoltage: '5.1V / 5.0A DC via USB-C PD (27W standard)',
      busProtocol: 'PCIe 2.0 ×1, Gigabit Ethernet, 2× USB 3.0, 2× USB 2.0, 40-pin GPIO',
      currentDraw: '2.7W idle, 12W peak continuous',
      dimensions: '88 × 56 × 17 mm',
      weight: '46 g',
      pinout: ['40-pin standard Pi HAT header'],
      packageType: 'SBC Board with Active Cooler Header',
      tolerance: 'Linux kernel 6.6 64-bit real-time PREEMPT_RT capable',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/RPI5.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-013',
      sku: 'SNS-IMU-BNO',
      name: 'Bosch BNO085 9-DOF Absolute Orientation IMU',
      category: 'Sensors',
      quantity: 7,
      minThreshold: 3,
      unitPriceUsd: 32.00,
      manufacturer: 'Bosch Sensortec',
      specifications: 'Triaxial 16-bit accelerometer, triaxial 16-bit gyroscope, triaxial geomagnetic sensor with ARM Cortex-M0+ fusion processor.',
      location: 'Bin C-03',
      lastRestocked: '2026-10-14',
      operatingVoltage: '2.4V - 3.6V (3.3V standard)',
      busProtocol: 'I2C (up to 400kHz), SPI (up to 3MHz), UART-RVC (simplified heading)',
      currentDraw: '3.2mA in full fusion 100Hz orientation mode',
      dimensions: '20.5 × 14.5 × 2.8 mm',
      weight: '2.8 g',
      pinout: ['1: VIN', '2: 3V3', '3: GND', '4: SCL', '5: SDA', '6: INT', '7: RST', '8: BOOT'],
      packageType: 'SMD Breakout Board with pullups',
      tolerance: 'Static heading accuracy 2.0°, dynamic rotation vector latency 2.0ms',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/BNO085.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-014',
      sku: 'FRM-ARM-6DOF',
      name: 'Aerospace CNC Aluminum 6-DOF Robot Arm Kit',
      category: 'Frames',
      quantity: 3,
      minThreshold: 1,
      unitPriceUsd: 420.00,
      manufacturer: 'Kinematic Robotics Ltd.',
      specifications: 'Full 6-axis articulated arm structural linkages with bearing pivots and harmonic mount flanges.',
      location: 'Mechanical Bay Rack 1',
      assignedRobotId: 'rbt-002',
      assignedRobotName: 'Titan-6 Precision Manipulator',
      lastRestocked: '2026-09-18',
      operatingVoltage: 'Passive Structural Frame',
      busProtocol: 'Standard 35mm Servo & Harmonic Flange Mounts',
      currentDraw: '0A (Mechanical)',
      dimensions: '580mm reach fully extended',
      weight: '3400 g (unloaded)',
      pinout: ['Internal Cable Routing Channel Ø 16mm'],
      packageType: 'Anodized 7075-T6 Billet Aluminum',
      tolerance: 'Payload capacity 2.5 kg at full reach',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/ARM-6DOF-FRAME.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-015',
      sku: 'CTL-ODR-56V',
      name: 'ODrive v3.6 High-Performance Dual BLDC FOC Controller 56V',
      category: 'Controllers',
      quantity: 6,
      minThreshold: 2,
      unitPriceUsd: 179.00,
      manufacturer: 'ODrive Robotics',
      specifications: 'Dual axis field-oriented control (FOC) for brushless motors, 120A peak current per motor, 24kHz PWM frequency.',
      location: 'Electronics Bench 3',
      lastRestocked: '2026-10-28',
      operatingVoltage: '12V - 56V DC (Nominal 48V)',
      busProtocol: 'CAN 2.0B, USB 2.0 Full-Speed, UART (ASCII / Native Protocol), Step/Dir',
      currentDraw: '100mA idle, up to 120A peak motor phase drive',
      dimensions: '140 × 50 × 24 mm',
      weight: '160 g',
      pinout: ['M0 Phase (A,B,C)', 'M1 Phase (A,B,C)', 'CAN_H', 'CAN_L', 'AUX Brake Resistor', 'Encoder 0 (A,B,Z)', 'Encoder 1 (A,B,Z)'],
      packageType: 'Aluminum Thermal Baseplate Heatsink',
      tolerance: 'Current measurement resolution 0.03A / Velocity loop 8 kHz',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/ODRIVE-V36.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-016',
      sku: 'ACT-DNX-XM430',
      name: 'Dynamixel XM430-W350-T Smart Robotic Actuator RS-485',
      category: 'Motors',
      quantity: 12,
      minThreshold: 4,
      unitPriceUsd: 285.00,
      manufacturer: 'ROBOTIS',
      specifications: 'Networked daisy-chain smart servo actuator with 4.1 N·m stall torque at 12V and contactless 12-bit magnetic absolute encoder.',
      location: 'Bin A-08, Precision Servos',
      assignedRobotId: 'rbt-002',
      assignedRobotName: 'Titan-6 Precision Manipulator',
      lastRestocked: '2026-10-16',
      operatingVoltage: '10.0V - 14.8V DC (Nominal 12.0V)',
      busProtocol: 'Half-Duplex Multi-drop Asynchronous Serial RS-485 (Up to 4.5 Mbps)',
      currentDraw: '40mA standby, 1.4A nominal running, 2.3A stall peak',
      dimensions: '28.5 × 46.5 × 34.0 mm',
      weight: '82 g',
      pinout: ['1: GND', '2: VDD (12V)', '3: D+ (RS485)', '4: D- (RS485)'],
      packageType: 'Full Metal Gearbox with Aluminum Heat Sink Housing',
      tolerance: '0.088° resolution (4096 pulses/rev)',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/DYNAMIXEL-XM430.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-017',
      sku: 'CAM-FLR-BFS',
      name: 'FLIR Blackfly S USB3 Machine Vision Global Shutter Camera',
      category: 'Sensors',
      quantity: 4,
      minThreshold: 2,
      unitPriceUsd: 495.00,
      manufacturer: 'Teledyne FLIR',
      specifications: 'Sony Pregius IMX264 5.0 MP CMOS global shutter sensor, 2448 × 2048 @ 35 FPS, C-Mount optical thread.',
      location: 'Secure Cabinet C-03',
      assignedRobotId: 'rbt-001',
      assignedRobotName: 'Ares-IV Autonomous Scout',
      lastRestocked: '2026-10-02',
      operatingVoltage: '5.0V DC (via USB 3.0 Type-C or GPIO Header)',
      busProtocol: 'USB3 Vision / GenICam / IEEE 1588 Precision Time Protocol',
      currentDraw: '600mA @ 5V (3.0W nominal)',
      dimensions: '29 × 29 × 30 mm',
      weight: '36 g',
      pinout: ['USB 3.0 Micro-B / 6-Pin Hirose Opto-isolated GPIO (Trigger In, Strobe Out)'],
      packageType: 'Machined Aluminum Ruggedized Cube Enclosure',
      tolerance: 'Dynamic Range 71.3 dB / Absolute sensitivity threshold 4.39 photons',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/FLIR-BFS-U3.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-018',
      sku: 'SNS-LDR-GARMIN',
      name: 'Garmin LIDAR-Lite v3 High-Speed Optical Rangefinder',
      category: 'Sensors',
      quantity: 9,
      minThreshold: 3,
      unitPriceUsd: 129.99,
      manufacturer: 'Garmin International',
      specifications: 'Compact 40-meter optical distance measurement sensor, 905nm single-beam laser, up to 500Hz sampling rate.',
      location: 'Bin C-07',
      lastRestocked: '2026-10-20',
      operatingVoltage: '4.75V - 5.5V DC',
      busProtocol: 'I2C (7-bit address 0x62) / PWM Pulse-Width Readout',
      currentDraw: '105mA continuous scanning (135mA peak transmit)',
      dimensions: '40 × 48 × 20 mm',
      weight: '22 g',
      pinout: ['1: 5V DC', '2: Power Enable', '3: Mode Select', '4: I2C SCL', '5: I2C SDA', '6: Ground'],
      packageType: 'IPX7 Water Resistant Composite Housing',
      tolerance: '±2.5 cm accuracy for distances > 1m / Resolution 1 cm',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/GARMIN-LIDAR-LITE-V3.pdf',
      simulatorCompatible: true
    },
    {
      id: 'inv-019',
      sku: 'PWR-VCR-4812',
      name: 'Vicor Maxi 48V-to-12V 25A Isolated DC-DC Power Module',
      category: 'Other Components',
      quantity: 5,
      minThreshold: 2,
      unitPriceUsd: 210.00,
      manufacturer: 'Vicor Corporation',
      specifications: '300W high-efficiency isolated DC-DC buck converter, 36V-75V input range, regulated 12.0V 25A output rail.',
      location: 'Power Station Bay 2',
      lastRestocked: '2026-09-25',
      operatingVoltage: '36V - 75V DC Input, 12V Output',
      busProtocol: 'Remote Sense + External Voltage Trim + Logic Inhibit / Enable',
      currentDraw: '90% conversion efficiency at 25A continuous load',
      dimensions: '117 × 56 × 12.7 mm (Full Brick Module)',
      weight: '220 g',
      pinout: ['+IN', '-IN', '+OUT', '-OUT', 'TRIM', 'SC (Secondary Control)', 'PR (Parallel Bus)'],
      packageType: 'Baseplate Heat Transfer Potting Compound',
      tolerance: 'Line regulation 0.05% / Ripple < 50mV peak-to-peak',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/VICOR-MAXI-4812.pdf',
      simulatorCompatible: false
    },
    {
      id: 'inv-020',
      sku: 'FRM-CF-T700',
      name: 'Toray T700 Carbon-Fiber Monocoque Robot Chassis Frame',
      category: 'Frames',
      quantity: 4,
      minThreshold: 2,
      unitPriceUsd: 680.00,
      manufacturer: 'AeroCarbon Composites',
      specifications: 'Autoclave-cured 3K twill carbon-fiber monocoque tub with titanium bulkhead corner inserts and integrated wiring conduits.',
      location: 'Frame Racks Bay A',
      assignedRobotId: 'rbt-001',
      assignedRobotName: 'Ares-IV Autonomous Scout',
      lastRestocked: '2026-10-08',
      operatingVoltage: 'Passive Structural Grounding Plane (< 0.1 Ω bonding)',
      busProtocol: 'DIN-Rail & 20mm V-Slot Extrusion Modular Mounts',
      currentDraw: '0A (Mechanical)',
      dimensions: '520 × 340 × 160 mm',
      weight: '1850 g',
      pinout: ['Structural Earth Bonding Lug M6'],
      packageType: 'Hermetic IP67 Sealed Double Gasket Enclosure',
      tolerance: 'Torsional stiffness 1850 N·m/deg / Payload rating 60 kg',
      inStock: true,
      datasheetUrl: 'https://docs.robotrack.io/datasheets/TORAY-T700-FRAME.pdf',
      simulatorCompatible: false
    }
  ],
  maintenanceTasks: [
    {
      id: 'mnt-001',
      taskTitle: 'Ultrasonic Array Re-calibration & LiDAR Alignment',
      robotId: 'rbt-005',
      robotName: 'Aegis-2 Obstacle Rover',
      assignedTo: 'Kenji Sato',
      priority: 'High',
      status: 'In Progress',
      scheduledDate: '2026-11-01',
      replacedComponents: ['Ultrasonic Transducer Mod A'],
      notes: 'Investigating low-light timeout reported during testing session TST-004.'
    },
    {
      id: 'mnt-002',
      taskTitle: '6-DOF Harmonic Drive Gear Lubrication',
      robotId: 'rbt-002',
      robotName: 'Titan-6 Precision Manipulator',
      assignedTo: 'Marcus Vance',
      priority: 'Medium',
      status: 'Pending',
      scheduledDate: '2026-11-04',
      notes: 'Scheduled 200-hour preventative maintenance cycle.'
    },
    {
      id: 'mnt-003',
      taskTitle: 'Firmware Upgrade to ROS2 Humble Patch 4.2.1',
      robotId: 'rbt-001',
      robotName: 'Ares-IV Autonomous Scout',
      assignedTo: 'Dr. Elena Rostova',
      priority: 'Low',
      status: 'Completed',
      scheduledDate: '2026-10-28',
      completedDate: '2026-10-28',
      notes: 'Successfully flashed and validated RTK-GPS drift correction.'
    }
  ],
  activityLogs: [
    {
      id: 'act-101',
      timestamp: '2026-11-01T06:02:14Z',
      userName: 'Dr. Elena Rostova',
      userRole: 'owner',
      action: 'Mission Started',
      category: 'mission',
      details: 'Started Mission MSN-2026-081 (Autonomous Perimeter Scanning) on Ares-IV Scout.'
    },
    {
      id: 'act-102',
      timestamp: '2026-11-01T05:45:00Z',
      userName: 'Kenji Sato',
      userRole: 'engineer',
      action: 'Maintenance Task Updated',
      category: 'maintenance',
      details: 'Updated Task MNT-001 to "In Progress" with replaced ultrasonic sensor.'
    },
    {
      id: 'act-103',
      timestamp: '2026-10-31T16:15:30Z',
      userName: 'Kenji Sato',
      userRole: 'engineer',
      action: 'Mission Completed',
      category: 'mission',
      details: 'Completed Mission MSN-2026-079 (Pick-and-Place Precision) with score 99.2%.'
    },
    {
      id: 'act-104',
      timestamp: '2026-10-30T14:20:10Z',
      userName: 'Dr. Elena Rostova',
      userRole: 'owner',
      action: 'Testing Session Recorded',
      category: 'testing',
      details: 'Conducted High-Torque Speed & Brake Deceleration Test (Passed, max speed 3.42 m/s).'
    },
    {
      id: 'act-105',
      timestamp: '2026-10-29T11:05:00Z',
      userName: 'Marcus Vance',
      userRole: 'admin',
      action: 'Component Added to Inventory',
      category: 'inventory',
      details: 'Added 8 units of High-Torque Brushless Hub Motor 48V (SKU: MTR-BLDC-48V).'
    }
  ]
};

class RoboTrackDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || INITIAL_DATA.users,
          robots: parsed.robots || INITIAL_DATA.robots,
          missions: parsed.missions || INITIAL_DATA.missions,
          testingSessions: parsed.testingSessions || INITIAL_DATA.testingSessions,
          inventoryItems: parsed.inventoryItems || INITIAL_DATA.inventoryItems,
          maintenanceTasks: parsed.maintenanceTasks || INITIAL_DATA.maintenanceTasks,
          activityLogs: parsed.activityLogs || INITIAL_DATA.activityLogs,
        };
      }
    } catch (err) {
      console.warn('Could not read existing database, falling back to initial data:', err);
    }

    // Initialize with seed data
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- STATS ---
  public getStats(): WorkspaceStats {
    const totalRobots = this.data.robots.length;
    const activeRobots = this.data.robots.filter(r => r.status === 'Online' || r.status === 'Testing').length;
    const completedMissions = this.data.missions.filter(m => m.status === 'Completed').length;
    const runningTests = this.data.testingSessions.filter(t => t.status === 'In Progress').length;
    const pendingMaintenance = this.data.maintenanceTasks.filter(m => m.status === 'Pending' || m.status === 'In Progress').length;
    
    const finishedMissions = this.data.missions.filter(m => m.status === 'Completed' || m.status === 'Failed');
    const averageMissionSuccess = finishedMissions.length > 0 
      ? Math.round((this.data.missions.filter(m => m.status === 'Completed').length / finishedMissions.length) * 100) 
      : 96;

    return {
      totalRobots,
      activeRobots,
      completedMissions,
      runningTests,
      pendingMaintenance,
      averageMissionSuccess
    };
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public updateUser(user: User): User {
    const idx = this.data.users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      this.data.users[idx] = user;
    } else {
      this.data.users.push(user);
    }
    this.saveData(this.data);
    return user;
  }

  // --- ROBOTS ---
  public getRobots(): Robot[] {
    return this.data.robots;
  }

  public getRobotById(id: string): Robot | undefined {
    return this.data.robots.find(r => r.id === id);
  }

  public createRobot(robot: Omit<Robot, 'id'>, author: User): Robot {
    const id = `rbt-${Date.now().toString(36)}`;
    const newRobot: Robot = { ...robot, id };
    this.data.robots.unshift(newRobot);
    
    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Robot Registered',
      category: 'robot',
      details: `Registered new robot "${newRobot.name}" (${newRobot.code}) of type ${newRobot.type}.`
    });

    this.saveData(this.data);
    return newRobot;
  }

  public updateRobot(id: string, updates: Partial<Robot>, author: User): Robot | null {
    const idx = this.data.robots.findIndex(r => r.id === id);
    if (idx === -1) return null;

    this.data.robots[idx] = { ...this.data.robots[idx], ...updates };
    
    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Robot Updated',
      category: 'robot',
      details: `Updated parameters for robot "${this.data.robots[idx].name}" (${this.data.robots[idx].code}).`
    });

    this.saveData(this.data);
    return this.data.robots[idx];
  }

  public deleteRobot(id: string, author: User): boolean {
    const idx = this.data.robots.findIndex(r => r.id === id);
    if (idx === -1) return false;

    const removed = this.data.robots[idx];
    this.data.robots.splice(idx, 1);

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Robot Decommissioned',
      category: 'robot',
      details: `Removed robot "${removed.name}" (${removed.code}) from active registry.`
    });

    this.saveData(this.data);
    return true;
  }

  // --- MISSIONS ---
  public getMissions(): Mission[] {
    return this.data.missions;
  }

  public createMission(mission: Omit<Mission, 'id'>, author: User): Mission {
    const id = `msn-${Date.now().toString(36)}`;
    const robot = this.getRobotById(mission.robotId);
    const newMission: Mission = {
      ...mission,
      id,
      robotName: robot?.name || 'Unassigned',
      createdBy: author.name
    };
    this.data.missions.unshift(newMission);

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Mission Created',
      category: 'mission',
      details: `Created mission "${newMission.name}" (${newMission.code}) assigned to ${newMission.robotName}.`
    });

    this.saveData(this.data);
    return newMission;
  }

  public updateMissionStatus(id: string, status: Mission['status'], author: User, notes?: string): Mission | null {
    const idx = this.data.missions.findIndex(m => m.id === id);
    if (idx === -1) return null;

    const m = this.data.missions[idx];
    m.status = status;
    if (notes) m.notes = notes;
    
    if (status === 'Running' && !m.startTime) {
      m.startTime = new Date().toISOString();
    }
    if ((status === 'Completed' || status === 'Failed' || status === 'Cancelled') && !m.endTime) {
      m.endTime = new Date().toISOString();
      if (m.startTime) {
        m.durationSeconds = Math.round((new Date(m.endTime).getTime() - new Date(m.startTime).getTime()) / 1000);
      }
      if (status === 'Completed' && !m.performanceScore) {
        m.performanceScore = Math.floor(Math.random() * 8 + 92);
      }
    }

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: `Mission ${status}`,
      category: 'mission',
      details: `Updated mission "${m.name}" (${m.code}) status to "${status}".`
    });

    this.saveData(this.data);
    return m;
  }

  // --- TESTING SESSIONS ---
  public getTestingSessions(): TestingSession[] {
    return this.data.testingSessions;
  }

  public createTestingSession(session: Omit<TestingSession, 'id'>, author: User): TestingSession {
    const id = `tst-${Date.now().toString(36)}`;
    const robot = this.getRobotById(session.robotId);
    const newSession: TestingSession = {
      ...session,
      id,
      robotName: robot?.name || 'Unassigned',
      conductedBy: author.name
    };
    this.data.testingSessions.unshift(newSession);

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Testing Session Logged',
      category: 'testing',
      details: `Recorded "${newSession.testName}" (${newSession.testType}) for ${newSession.robotName} with outcome: ${newSession.status}.`
    });

    this.saveData(this.data);
    return newSession;
  }

  // --- INVENTORY ---
  public getInventory(): InventoryItem[] {
    return this.data.inventoryItems;
  }

  public createInventoryItem(item: Omit<InventoryItem, 'id'>, author: User): InventoryItem {
    const id = `inv-${Date.now().toString(36)}`;
    const newItem: InventoryItem = { ...item, id };
    this.data.inventoryItems.unshift(newItem);

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Inventory Added',
      category: 'inventory',
      details: `Added ${newItem.quantity}x ${newItem.name} (${newItem.sku}) to warehouse stock.`
    });

    this.saveData(this.data);
    return newItem;
  }

  public updateInventoryQuantity(id: string, delta: number, author: User): InventoryItem | null {
    const idx = this.data.inventoryItems.findIndex(i => i.id === id);
    if (idx === -1) return null;

    const item = this.data.inventoryItems[idx];
    item.quantity = Math.max(0, item.quantity + delta);
    item.lastRestocked = new Date().toISOString().split('T')[0];

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Stock Adjusted',
      category: 'inventory',
      details: `Adjusted quantity of ${item.name} (${item.sku}) by ${delta > 0 ? `+${delta}` : delta}. New total: ${item.quantity}.`
    });

    this.saveData(this.data);
    return item;
  }

  // --- MAINTENANCE ---
  public getMaintenanceTasks(): MaintenanceTask[] {
    return this.data.maintenanceTasks;
  }

  public createMaintenanceTask(task: Omit<MaintenanceTask, 'id'>, author: User): MaintenanceTask {
    const id = `mnt-${Date.now().toString(36)}`;
    const robot = this.getRobotById(task.robotId);
    const newTask: MaintenanceTask = {
      ...task,
      id,
      robotName: robot?.name || 'Unassigned'
    };
    this.data.maintenanceTasks.unshift(newTask);

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: 'Maintenance Task Scheduled',
      category: 'maintenance',
      details: `Scheduled "${newTask.taskTitle}" for ${newTask.robotName} assigned to ${newTask.assignedTo}.`
    });

    this.saveData(this.data);
    return newTask;
  }

  public updateMaintenanceTaskStatus(id: string, status: MaintenanceTask['status'], author: User): MaintenanceTask | null {
    const idx = this.data.maintenanceTasks.findIndex(m => m.id === id);
    if (idx === -1) return null;

    const task = this.data.maintenanceTasks[idx];
    task.status = status;
    if (status === 'Completed') {
      task.completedDate = new Date().toISOString().split('T')[0];
    }

    this.logActivity({
      userName: author.name,
      userRole: author.role,
      action: `Maintenance ${status}`,
      category: 'maintenance',
      details: `Marked maintenance task "${task.taskTitle}" as ${status}.`
    });

    this.saveData(this.data);
    return task;
  }

  // --- ACTIVITY LOGS ---
  public getActivityLogs(): ActivityLog[] {
    return this.data.activityLogs;
  }

  public logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): void {
    const entry: ActivityLog = {
      id: `act-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...log
    };
    this.data.activityLogs.unshift(entry);
    // Keep max 250 recent entries
    if (this.data.activityLogs.length > 250) {
      this.data.activityLogs.pop();
    }
  }

  // --- TELEMETRY GENERATOR / BUFFER ---
  public generateSimulatedReading(robotId: string): TelemetryReading {
    const robot = this.getRobotById(robotId) || this.data.robots[0];
    const now = new Date().toISOString();
    
    // Generate realistic bounded parameters based on robot type
    const isStationary = robot.type === 'Robotic Arm';
    const speed = isStationary ? 0 : +(Math.random() * 1.8 + 0.8).toFixed(2);
    const temp = +(36.2 + Math.random() * 4.5).toFixed(1);
    const battery = Math.max(10, Math.min(100, +(robot.batteryLevel - Math.random() * 0.1).toFixed(1)));
    const motorLoad = Math.floor(Math.random() * 35 + 25);
    const rpm = isStationary ? Math.floor(Math.random() * 200 + 400) : Math.floor(speed * 420);
    const lidar = +(Math.random() * 8.5 + 1.2).toFixed(2);
    const currentDraw = +(Math.random() * 3.2 + 2.1).toFixed(2);

    return {
      timestamp: now,
      batteryPercentage: battery,
      temperatureCelsius: temp,
      speedMps: speed,
      distanceTraveledM: +(Math.random() * 0.4 + 0.1).toFixed(2),
      motorRpm: rpm,
      motorLoadPercent: motorLoad,
      signalDbm: Math.floor(Math.random() * -12 - 58),
      lidarDistanceM: lidar,
      imuPitch: +(Math.sin(Date.now() / 2000) * 3.2).toFixed(2),
      imuRoll: +(Math.cos(Date.now() / 2000) * 2.1).toFixed(2),
      imuYaw: +((Date.now() / 500) % 360).toFixed(1),
      currentDrawAmps: currentDraw,
      systemHealth: temp > 42 ? 'warning' : 'nominal'
    };
  }
}

export const db = new RoboTrackDatabase();
