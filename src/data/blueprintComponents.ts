export interface BlueprintPin {
  pin: string;
  label: string;
  type: 'power' | 'ground' | 'signal' | 'bus' | 'rf';
  description: string;
}

export interface BlueprintTelemetry {
  rateOrThroughput: string;
  temperature: string;
  loadOrCurrent: string;
  healthPercent: number;
  operationalMode: string;
}

export interface BlueprintComponent {
  id: string;
  name: string;
  code: string;
  subsystem: 'Perception & Vision' | 'Compute & Intelligence' | 'Powertrain & Actuation' | 'Power & Energy' | 'Telemetry & Comms' | 'Chassis & Structural';
  primaryFunction: string;
  operatingVoltage: string;
  currentDraw: string;
  busProtocol: string;
  dimensions: string;
  weight: string;
  tolerance: string;
  location: string;
  colorAccent: string;
  status: 'Operational' | 'Active Sweep' | 'Nominal' | 'Monitoring';
  simulatorCompatible: boolean;
  pinout: BlueprintPin[];
  coords: {
    isometric: { x: number; y: number };
    topDown: { x: number; y: number };
    sideElevation: { x: number; y: number };
  };
  keyFeatures: string[];
  telemetry: BlueprintTelemetry;
}

export const BLUEPRINT_COMPONENTS: BlueprintComponent[] = [
  {
    id: 'bp-lidar',
    name: 'Ouster OS1-32 Rev 7 3D LiDAR Scanner',
    code: 'SNS-LDR-360',
    subsystem: 'Perception & Vision',
    primaryFunction: 'Generates high-density real-time 360° point clouds for volumetric SLAM (Simultaneous Localization and Mapping), traversability terrain analysis, and long-range obstacle avoidance in dark or harsh environments.',
    operatingVoltage: '9V - 34V DC (Nominal 12V / 24V)',
    currentDraw: '1.2A @ 12V (14W nominal)',
    busProtocol: '1000BASE-T Gigabit Ethernet / UDP PTP 1588v2 IEEE Precision Clock',
    dimensions: '85 × 85 × 73 mm (Cylindrical)',
    weight: '445 g',
    tolerance: '±1.5 cm distance accuracy / 0.1° horizontal angular resolution',
    location: 'Upper Sensor Mast Apex (Z: +420mm)',
    colorAccent: '#82B2D8', // Bright Skies Pale Blue
    status: 'Active Sweep',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '655,360 pts/s @ 10 Hz',
      temperature: '38.4 °C',
      loadOrCurrent: '14.2 W (1.18 A @ 12V)',
      healthPercent: 99,
      operationalMode: '360° Volumetric SLAM Sweep'
    },
    keyFeatures: [
      '32 beams optical solid-state array with 120m maximum return range',
      'Hardware-level timestamping via PTP IEEE 1588 time synchronization',
      'Multi-echo return capability to penetrate fog, dust, and rain'
    ],
    pinout: [
      { pin: 'P1', label: 'VCC+', type: 'power', description: 'Main DC power input 9-34V' },
      { pin: 'P2', label: 'VCC-', type: 'ground', description: 'Power ground' },
      { pin: 'P3', label: 'ETH_TX+', type: 'bus', description: 'Gigabit Ethernet transmit positive' },
      { pin: 'P4', label: 'ETH_TX-', type: 'bus', description: 'Gigabit Ethernet transmit negative' },
      { pin: 'P5', label: 'ETH_RX+', type: 'bus', description: 'Gigabit Ethernet receive positive' },
      { pin: 'P6', label: 'ETH_RX-', type: 'bus', description: 'Gigabit Ethernet receive negative' },
      { pin: 'P7', label: 'SYNC_PULSE_IN', type: 'signal', description: 'External GPS 1PPS sync trigger' },
      { pin: 'P8', label: 'MULTIPURPOSE_IO', type: 'signal', description: 'NMEA sentence input / general GPIO' }
    ],
    coords: {
      isometric: { x: 50, y: 19 },
      topDown: { x: 50, y: 46 },
      sideElevation: { x: 50, y: 16 }
    }
  },
  {
    id: 'bp-realsense',
    name: 'Intel RealSense D435i Stereo Depth Rig',
    code: 'CAM-ST-D435I',
    subsystem: 'Perception & Vision',
    primaryFunction: 'Provides dense RGB-D optical depth maps, stereo disparity calculations, and visual odometry with sub-pixel depth resolution for close-quarters object recognition and semantic mapping.',
    operatingVoltage: '5.0V DC (via USB-C)',
    currentDraw: '700mA @ 5V (3.5W peak)',
    busProtocol: 'USB 3.1 Gen 1 Type-C / UVC Video Class',
    dimensions: '90 × 25 × 25 mm',
    weight: '72 g',
    tolerance: 'Depth accuracy <2% @ 2m range / 87° × 58° wide FOV',
    location: 'Forward Gimbal Pylon (Z: +310mm, X: +180mm)',
    colorAccent: '#E8B4A2', // Rose Gold
    status: 'Nominal',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '1920×1080 @ 30 FPS Depth+RGB',
      temperature: '34.1 °C',
      loadOrCurrent: '3.4 W (680 mA @ 5V)',
      healthPercent: 98,
      operationalMode: 'Active IR Stereo Disparity Stream'
    },
    keyFeatures: [
      'Active infrared stereo projector for textureless surface depth capture',
      'Integrated Bosch 6-DOF IMU for low-latency visual-inertial odometry',
      'Global shutter RGB sensor capturing 1920×1080 @ 30fps'
    ],
    pinout: [
      { pin: 'U1', label: 'VBUS', type: 'power', description: '5V USB power bus' },
      { pin: 'U2', label: 'USB_D-', type: 'bus', description: 'USB 2.0 Differential Data -' },
      { pin: 'U3', label: 'USB_D+', type: 'bus', description: 'USB 2.0 Differential Data +' },
      { pin: 'U4', label: 'GND', type: 'ground', description: 'System ground' },
      { pin: 'U5', label: 'SSRX-', type: 'bus', description: 'SuperSpeed USB 3.0 Receive -' },
      { pin: 'U6', label: 'SSRX+', type: 'bus', description: 'SuperSpeed USB 3.0 Receive +' },
      { pin: 'U7', label: 'SSTX-', type: 'bus', description: 'SuperSpeed USB 3.0 Transmit -' },
      { pin: 'U8', label: 'SSTX+', type: 'bus', description: 'SuperSpeed USB 3.0 Transmit +' }
    ],
    coords: {
      isometric: { x: 67, y: 32 },
      topDown: { x: 78, y: 50 },
      sideElevation: { x: 74, y: 31 }
    }
  },
  {
    id: 'bp-jetson',
    name: 'NVIDIA Jetson AGX Orin Edge AI Brain (64GB)',
    code: 'CTL-JET-AGX',
    subsystem: 'Compute & Intelligence',
    primaryFunction: 'The primary central nervous system of the robot. Runs high-throughput CUDA neural networks for multi-camera object detection, real-time SLAM, costmap navigation generation, and trajectory optimization.',
    operatingVoltage: '9V - 20V DC (Nominal 19V)',
    currentDraw: '15W (Eco) to 60W (Full Throttle MAX-N)',
    busProtocol: 'PCIe Gen4 ×8, Dual CAN 2.0B, USB 3.2, I2C, SPI, UART, MIPI CSI-2',
    dimensions: '110 × 110 × 71.6 mm (Carrier Module)',
    weight: '650 g',
    tolerance: '275 TOPS INT8 AI inference / Industrial operating temp -25°C to 85°C',
    location: 'Central Avionics Deck Bay (Center of Gravity)',
    colorAccent: '#849B74', // Sage Green
    status: 'Operational',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '275 TOPS INT8 AI Inference Engine',
      temperature: '46.2 °C',
      loadOrCurrent: '32.5 W (MAX-N Power Profile)',
      healthPercent: 100,
      operationalMode: 'CUDA Neural Costmap Fusion'
    },
    keyFeatures: [
      '2048-core NVIDIA Ampere architecture GPU with 64 Tensor Cores',
      '12-core Arm Cortex-A78AE v8.2 64-bit CPU @ 2.2 GHz',
      'Hardware video encoders: 2x 4K60 (HEVC) + 4x 4K30'
    ],
    pinout: [
      { pin: 'H1', label: '3.3V_OUT', type: 'power', description: 'Regulated 3.3V logic supply' },
      { pin: 'H2', label: '5V_OUT', type: 'power', description: '5V accessory power' },
      { pin: 'H3', label: 'CAN0_TX', type: 'bus', description: 'Chassis powertrain CAN controller transmit' },
      { pin: 'H4', label: 'CAN0_RX', type: 'bus', description: 'Chassis powertrain CAN controller receive' },
      { pin: 'H5', label: 'I2C1_SDA', type: 'bus', description: 'I2C Serial Data line' },
      { pin: 'H6', label: 'I2C1_SCL', type: 'bus', description: 'I2C Serial Clock line' },
      { pin: 'H7', label: 'UART1_TX', type: 'signal', description: 'Telemetry MCU communications link' },
      { pin: 'H8', label: 'GND', type: 'ground', description: 'Chassis reference ground' }
    ],
    coords: {
      isometric: { x: 50, y: 44 },
      topDown: { x: 50, y: 50 },
      sideElevation: { x: 50, y: 43 }
    }
  },
  {
    id: 'bp-esp32',
    name: 'Dual-Core ESP32-S3 Real-Time Motion MCU',
    code: 'MCU-ESP32-S3',
    subsystem: 'Compute & Intelligence',
    primaryFunction: 'Deterministic micro-second motor control co-processor. Generates hardware PWM timing for motor controllers, reads rotary encoders, runs hardware safety watchdogs, and executes emergency halts.',
    operatingVoltage: '3.3V DC (Internal regulator accepts 5V)',
    currentDraw: '180mA nominal (500mA RF burst)',
    busProtocol: 'Hardware MCPWM, SPI, I2C, UART (115200 baud), Wi-Fi 4, BLE 5.0',
    dimensions: '51 × 28 × 12 mm',
    weight: '24 g',
    tolerance: '±1 µs PWM jitter / 240MHz Xtensa Dual-Core 32-bit LX7',
    location: 'Motor Bridge Sub-chassis',
    colorAccent: '#F3DC9B', // Buttercream Pale Lemon
    status: 'Nominal',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '850 µs Cycle Time @ 240 MHz',
      temperature: '31.5 °C',
      loadOrCurrent: '0.62 W (190 mA @ 3.3V)',
      healthPercent: 100,
      operationalMode: 'Deterministic MCPWM Actuation'
    },
    keyFeatures: [
      'Dedicated Motor Control Pulse Width Modulator (MCPWM) peripheral',
      'Dual hardware watchdog timers for fail-safe autonomous lockout',
      'Wokwi simulation verified firmware loop (<1.2ms cycle time)'
    ],
    pinout: [
      { pin: 'GPIO1', label: 'PWM_MTR_FL', type: 'signal', description: 'Front-left brushless PWM command' },
      { pin: 'GPIO2', label: 'PWM_MTR_FR', type: 'signal', description: 'Front-right brushless PWM command' },
      { pin: 'GPIO3', label: 'SERVO_PAN', type: 'signal', description: 'LiDAR/Camera gimbal tilt PWM servo' },
      { pin: 'GPIO4', label: 'I2C_SDA', type: 'bus', description: 'Telemetry display & sensor I2C data' },
      { pin: 'GPIO5', label: 'I2C_SCL', type: 'bus', description: 'Telemetry display & sensor I2C clock' },
      { pin: 'GPIO6', label: 'SONAR_TRIG', type: 'signal', description: 'Ultrasonic burst trigger output' },
      { pin: 'GPIO7', label: 'SONAR_ECHO', type: 'signal', description: 'Ultrasonic return pulse measurement' },
      { pin: 'GND', label: 'GND', type: 'ground', description: 'Logic ground plane' }
    ],
    coords: {
      isometric: { x: 38, y: 49 },
      topDown: { x: 34, y: 52 },
      sideElevation: { x: 38, y: 47 }
    }
  },
  {
    id: 'bp-motor-fl',
    name: 'Front-Left 48V 350W Brushless Hub Drive',
    code: 'MTR-BLDC-FL',
    subsystem: 'Powertrain & Actuation',
    primaryFunction: 'Provides direct-drive high-torque rotational propulsion with integrated 12-bit magnetic encoder feedback for closed-loop RPM and wheel position control.',
    operatingVoltage: '36V - 52V DC (Nominal 48V)',
    currentDraw: '7.3A continuous, 24A peak acceleration',
    busProtocol: '3-Phase Trapeze/FOC + Hall Effect Sensors (U, V, W)',
    dimensions: '165 × 165 × 72 mm',
    weight: '2150 g',
    tolerance: '±0.05 Nm torque repeatability / 0.087° encoder precision',
    location: 'Chassis Corner Front-Left',
    colorAccent: '#EADCC9', // Champagne
    status: 'Nominal',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '420 RPM (3.4 N·m Torque)',
      temperature: '41.2 °C',
      loadOrCurrent: '230 W (4.8 A @ 48V)',
      healthPercent: 97,
      operationalMode: 'Closed-Loop FOC Vector Drive'
    },
    keyFeatures: [
      'Rated for 12.8 Nm maximum stall torque without gearbox wear',
      'IP67 waterproof aluminum alloy stator housing with thermal heatsink',
      'Internal temperature thermistor protection cut-off at 95°C'
    ],
    pinout: [
      { pin: 'U', label: 'PHASE_U', type: 'power', description: 'Brushless Phase U heavy gauge yellow' },
      { pin: 'V', label: 'PHASE_V', type: 'power', description: 'Brushless Phase V heavy gauge green' },
      { pin: 'W', label: 'PHASE_W', type: 'power', description: 'Brushless Phase W heavy gauge blue' },
      { pin: 'H+', label: 'HALL_5V', type: 'power', description: 'Hall sensor 5V DC reference' },
      { pin: 'H-', label: 'HALL_GND', type: 'ground', description: 'Hall sensor ground' },
      { pin: 'HA', label: 'HALL_A', type: 'signal', description: 'Rotor magnetic position sensor A' },
      { pin: 'HB', label: 'HALL_B', type: 'signal', description: 'Rotor magnetic position sensor B' },
      { pin: 'HC', label: 'HALL_C', type: 'signal', description: 'Rotor magnetic position sensor C' }
    ],
    coords: {
      isometric: { x: 26, y: 72 },
      topDown: { x: 20, y: 28 },
      sideElevation: { x: 25, y: 76 }
    }
  },
  {
    id: 'bp-motor-fr',
    name: 'Front-Right 48V 350W Brushless Hub Drive',
    code: 'MTR-BLDC-FR',
    subsystem: 'Powertrain & Actuation',
    primaryFunction: 'Provides front-right direct-drive propulsion, matched with front-left motor for synchronized differential and holonomic vector locomotion.',
    operatingVoltage: '36V - 52V DC (Nominal 48V)',
    currentDraw: '7.3A continuous, 24A peak acceleration',
    busProtocol: '3-Phase FOC + Hall Sensors + ABZ Quad Encoder',
    dimensions: '165 × 165 × 72 mm',
    weight: '2150 g',
    tolerance: '±0.05 Nm torque repeatability',
    location: 'Chassis Corner Front-Right',
    colorAccent: '#EADCC9', // Champagne
    status: 'Nominal',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '420 RPM (3.4 N·m Torque)',
      temperature: '40.8 °C',
      loadOrCurrent: '228 W (4.75 A @ 48V)',
      healthPercent: 98,
      operationalMode: 'Closed-Loop FOC Vector Drive'
    },
    keyFeatures: [
      'Synchronous field-oriented control (FOC) smooth low-speed crawling',
      'Dynamic regenerative braking with energy recovery to LiFePO4 cells',
      'Instantaneous reverse directional vector switching'
    ],
    pinout: [
      { pin: 'U', label: 'PHASE_U', type: 'power', description: 'Brushless Phase U heavy gauge yellow' },
      { pin: 'V', label: 'PHASE_V', type: 'power', description: 'Brushless Phase V heavy gauge green' },
      { pin: 'W', label: 'PHASE_W', type: 'power', description: 'Brushless Phase W heavy gauge blue' },
      { pin: 'HA', label: 'HALL_A', type: 'signal', description: 'Hall sensor rotor position output A' },
      { pin: 'HB', label: 'HALL_B', type: 'signal', description: 'Hall sensor rotor position output B' },
      { pin: 'HC', label: 'HALL_C', type: 'signal', description: 'Hall sensor rotor position output C' }
    ],
    coords: {
      isometric: { x: 74, y: 72 },
      topDown: { x: 80, y: 28 },
      sideElevation: { x: 75, y: 76 }
    }
  },
  {
    id: 'bp-mecanum',
    name: '152mm Omnidirectional Mecanum Wheel Assembly',
    code: 'WHL-MCN-152',
    subsystem: 'Powertrain & Actuation',
    primaryFunction: 'Features 15 polyurethane rollers angled at 45°, converting individual wheel rotations into omnidirectional vectors allowing lateral strafing, diagonal movement, and zero-radius pivot turns.',
    operatingVoltage: 'Passive Mechanical',
    currentDraw: '0 A',
    busProtocol: 'Mechanical Keyway Hub (12mm / 14mm)',
    dimensions: 'Ø 152 mm × 55 mm width',
    weight: '820 g per wheel (4x total: 3.28 kg)',
    tolerance: 'Radial runout < 0.15 mm / 50 kg dynamic load rating per wheel',
    location: 'All 4 Quad Hub Axles',
    colorAccent: '#E8B4A2', // Rose Gold
    status: 'Nominal',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '1.85 m/s Holonomic Velocity',
      temperature: '26.4 °C (Friction Nominal)',
      loadOrCurrent: '42.5 kg Dynamic Load',
      healthPercent: 96,
      operationalMode: '45° Vector Traction Matrix'
    },
    keyFeatures: [
      'High-grade 6061-T6 aluminum machined alloy body with anodized finish',
      'Durometer 85A polyurethane rollers with dual sealed stainless ball bearings',
      'Enables true holonomic movement in tight industrial aisles and labs'
    ],
    pinout: [
      { pin: 'M1', label: 'HUB_KEYWAY', type: 'signal', description: '12mm keyed drive shaft interface' },
      { pin: 'M2', label: 'BOLT_CIRCLE', type: 'signal', description: '6x M5 concentric mounting bolt pattern' }
    ],
    coords: {
      isometric: { x: 22, y: 83 },
      topDown: { x: 16, y: 24 },
      sideElevation: { x: 22, y: 84 }
    }
  },
  {
    id: 'bp-battery',
    name: 'LiFePO4 Deep-Cycle Smart Energy Core 24V 25Ah',
    code: 'BAT-LIFE-24V',
    subsystem: 'Power & Energy',
    primaryFunction: 'Supplies continuous 640Wh energy storage with an intelligent Battery Management System (BMS) that monitors individual cell voltages, state of charge (SOC), health (SOH), and thermal profiles.',
    operatingVoltage: '20.0V (Cutoff) - 29.2V (Full Charge), Nominal 25.6V',
    currentDraw: '50A continuous discharge, 120A pulse (5 seconds)',
    busProtocol: 'CAN 2.0B @ 250 kbps (Standard Robotics BMS Telemetry Frame)',
    dimensions: '260 × 168 × 178 mm',
    weight: '5800 g (5.8 kg)',
    tolerance: '±15mV cell balance delta / Cycle life > 3500 cycles at 80% DOD',
    location: 'Chassis Floor Under-carriage (Lowest Center of Gravity)',
    colorAccent: '#A99DC9', // Lavender Bliss
    status: 'Nominal',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '640 Wh Capacity (84% SOC)',
      temperature: '32.1 °C',
      loadOrCurrent: '12.4 A (25.4 V)',
      healthPercent: 99,
      operationalMode: 'Active CAN-bus Cell Balancing'
    },
    keyFeatures: [
      'Automotive-grade Grade-A prismatics with fire-resistant casing',
      'Hardware short-circuit, over-current, and under-voltage disconnect relays',
      'Live CAN-bus SOC broadcasting to RoboTrack Cloud Telemetry'
    ],
    pinout: [
      { pin: 'B+', label: 'VBAT_POS', type: 'power', description: 'High-current positive copper terminal M8' },
      { pin: 'B-', label: 'VBAT_NEG', type: 'ground', description: 'High-current negative copper terminal M8' },
      { pin: 'C_H', label: 'CAN_HIGH', type: 'bus', description: 'BMS status broadcast CAN differential high' },
      { pin: 'C_L', label: 'CAN_LOW', type: 'bus', description: 'BMS status broadcast CAN differential low' },
      { pin: 'ALM', label: 'BMS_ALARM', type: 'signal', description: 'Opto-isolated safety shutdown trip signal' }
    ],
    coords: {
      isometric: { x: 50, y: 62 },
      topDown: { x: 50, y: 68 },
      sideElevation: { x: 50, y: 60 }
    }
  },
  {
    id: 'bp-imu',
    name: 'Bosch BNO085 9-DOF Absolute Orientation IMU',
    code: 'SNS-IMU-9AXIS',
    subsystem: 'Perception & Vision',
    primaryFunction: 'Provides drift-free 3D quaternions, linear acceleration vectors, and rotational rate measurements by fusing on-chip 3-axis accelerometer, gyroscope, and magnetometer algorithms.',
    operatingVoltage: '3.0V - 3.6V DC (Nominal 3.3V)',
    currentDraw: '2.4mA active streaming mode',
    busProtocol: 'I2C (Fast Mode 400kHz) / SPI (Up to 3MHz) / UART RVC',
    dimensions: '20 × 15 × 3 mm (SMD Carrier PCB)',
    weight: '4.5 g',
    tolerance: 'Static pitch/roll accuracy 0.5° / Dynamic accuracy 1.0°',
    location: 'Avionics Deck True Geometric Center',
    colorAccent: '#82B2D8', // Bright Skies Pale Blue
    status: 'Active Sweep',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '400 Hz 9-DOF Quaternions',
      temperature: '29.3 °C',
      loadOrCurrent: '8 mW (2.4 mA @ 3.3V)',
      healthPercent: 100,
      operationalMode: 'SH-2 Sensor Fusion / Drift-Free'
    },
    keyFeatures: [
      'Hillcrest Labs SH-2 sensor hub running proprietary sensor fusion',
      'Automatic hard-iron and soft-iron magnetic disturbance compensation',
      'Zero-latency linear acceleration subtraction for accurate odometry'
    ],
    pinout: [
      { pin: 'V3', label: 'VIN', type: 'power', description: '3.3V regulated power input' },
      { pin: 'G', label: 'GND', type: 'ground', description: 'Analog & digital ground plane' },
      { pin: 'SDA', label: 'I2C_SDA', type: 'bus', description: 'Bi-directional serial data line' },
      { pin: 'SCL', label: 'I2C_SCL', type: 'bus', description: 'Serial clock sync input' },
      { pin: 'INT', label: 'INT_DRDY', type: 'signal', description: 'Active-low data ready interrupt' },
      { pin: 'RST', label: 'RESET', type: 'signal', description: 'Hardware master reset pin' }
    ],
    coords: {
      isometric: { x: 42, y: 38 },
      topDown: { x: 44, y: 44 },
      sideElevation: { x: 42, y: 39 }
    }
  },
  {
    id: 'bp-sonar',
    name: 'Front Sonar Proximity Transducer Array',
    code: 'SNS-US-ARRAY',
    subsystem: 'Perception & Vision',
    primaryFunction: 'Emits 40kHz ultrasonic pulses to measure obstacle distances in acoustic waves. Detects glass doors, transparent plastics, and dark absorptive surfaces that LiDAR or optical sensors miss.',
    operatingVoltage: '5.0V DC',
    currentDraw: '15mA active pulse',
    busProtocol: 'TTL High-Level Trigger Pulse (10µs) & Echo Time Measurement',
    dimensions: '45 × 20 × 15 mm',
    weight: '8.5 g',
    tolerance: '±3 mm distance resolution / 2cm to 400cm reliable range',
    location: 'Front Bumper Perimeter (X: +240mm)',
    colorAccent: '#F3DC9B', // Buttercream
    status: 'Operational',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '20 Hz Acoustic Ping (40 kHz)',
      temperature: '27.8 °C',
      loadOrCurrent: '75 mW (15 mA @ 5V)',
      healthPercent: 98,
      operationalMode: 'Proximity Failsafe Interlock'
    },
    keyFeatures: [
      'Dual piezoelectric transducer horns (transmitter and receiver)',
      '15° conical sensing corridor avoiding ground false-echo reflections',
      'Immediate hardware safety interrupt trigger when distance < 15cm'
    ],
    pinout: [
      { pin: 'VCC', label: 'VCC', type: 'power', description: '5V DC system rail' },
      { pin: 'TRIG', label: 'TRIGGER', type: 'signal', description: '10 microsecond trigger pulse input' },
      { pin: 'ECHO', label: 'ECHO_OUT', type: 'signal', description: 'Pulse width proportional to echo distance' },
      { pin: 'GND', label: 'GND', type: 'ground', description: 'System reference ground' }
    ],
    coords: {
      isometric: { x: 78, y: 47 },
      topDown: { x: 92, y: 50 },
      sideElevation: { x: 84, y: 46 }
    }
  },
  {
    id: 'bp-5g',
    name: 'Quectel RM520N-GL 5G High-Speed Telemetry Deck',
    code: 'COM-5G-MOD',
    subsystem: 'Telemetry & Comms',
    primaryFunction: 'Links the robot to the RoboTrack Cloud Mission Control via 5G Standalone (SA) and Non-Standalone (NSA) cellular networks. Transmits HD video, telemetry points, and receives mission commands.',
    operatingVoltage: '3.3V - 4.3V (Nominal 3.8V)',
    currentDraw: '65mA idle, up to 2.5A peak during transmission',
    busProtocol: 'PCIe 2.0 / USB 3.0 / Dual SIM / GNSS (GPS, GLONASS, Galileo)',
    dimensions: '52 × 30 × 2.3 mm (M.2 Key-B form factor)',
    weight: '8.7 g',
    tolerance: 'Sub-6GHz up to 2.4 Gbps downlink, 900 Mbps uplink latency <12ms',
    location: 'Rear Avionics Deck Mast',
    colorAccent: '#82B2D8', // Bright Skies Blue
    status: 'Active Sweep',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '52 Mbps Uplink / 9 ms Latency',
      temperature: '39.0 °C',
      loadOrCurrent: '2.8 W (740 mA @ 3.8V)',
      healthPercent: 99,
      operationalMode: 'Encrypted UDP Telemetry Stream'
    },
    keyFeatures: [
      'Integrated multi-band GNSS receiver for cm-accurate RTK positioning',
      'Hardware encryption acceleration (AES-256) for secure flight telemetry',
      'Automatic fallback to 4G LTE-A and Wi-Fi mesh if cell tower degrades'
    ],
    pinout: [
      { pin: 'ANT1', label: 'RF_MAIN', type: 'rf', description: '5G Primary Cellular Transceiver Antenna' },
      { pin: 'ANT2', label: 'RF_DIV', type: 'rf', description: '5G Diversity & MIMO Antenna' },
      { pin: 'ANT3', label: 'GNSS_L1', type: 'rf', description: 'GPS / Galileo Active Antenna' },
      { pin: 'SIM', label: 'UIM_DATA', type: 'bus', description: 'Dual e-SIM card interface' }
    ],
    coords: {
      isometric: { x: 32, y: 31 },
      topDown: { x: 24, y: 48 },
      sideElevation: { x: 30, y: 28 }
    }
  },
  {
    id: 'bp-servo',
    name: 'Pan-Tilt Articulated Gimbal Servo',
    code: 'ACT-SRV-SG90',
    subsystem: 'Powertrain & Actuation',
    primaryFunction: 'Provides precision angular steering and pan-tilt rotation for the RealSense optical sensor and obstacle scan arrays across a 180° sweep arc.',
    operatingVoltage: '4.8V - 6.0V DC',
    currentDraw: '10mA idle, 650mA stall torque',
    busProtocol: 'Standard 50Hz RC PWM (1000µs to 2000µs pulse width)',
    dimensions: '22.8 × 12.2 × 28.5 mm',
    weight: '9.0 g',
    tolerance: '±0.5° positioning resolution / 1.8 kg·cm stall torque',
    location: 'Forward Sensor Mast Pylon',
    colorAccent: '#E8B4A2', // Rose Gold
    status: 'Nominal',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '94° Azimuth (1520 µs PWM)',
      temperature: '33.2 °C',
      loadOrCurrent: '1.1 W (220 mA @ 5V)',
      healthPercent: 97,
      operationalMode: 'Pan-Tilt Articulated Sweep Arc'
    },
    keyFeatures: [
      'Internal metal-reinforced gear train with zero backlash',
      'Analog closed-loop potentiometer feedback loop',
      'Live Wokwi simulator testable with interactive degree steering horn'
    ],
    pinout: [
      { pin: 'RED', label: 'VCC_5V', type: 'power', description: '5V DC servo power supply' },
      { pin: 'BRN', label: 'GND', type: 'ground', description: 'Power ground' },
      { pin: 'ORG', label: 'PWM_SIG', type: 'signal', description: '50Hz analog PWM control signal' }
    ],
    coords: {
      isometric: { x: 61, y: 36 },
      topDown: { x: 70, y: 48 },
      sideElevation: { x: 67, y: 34 }
    }
  },
  {
    id: 'bp-oled',
    name: 'SSD1306 0.96" Monochrome Telemetry OLED HUD',
    code: 'DSP-OLED-096',
    subsystem: 'Compute & Intelligence',
    primaryFunction: 'Direct hardware diagnostics display showing real-time battery voltage, IP address, rover operating mode, and emergency fault codes directly on the robot chassis.',
    operatingVoltage: '3.3V - 5.0V DC',
    currentDraw: '20mA (average display content)',
    busProtocol: 'I2C (Address 0x3C / 0x3D) @ 400kHz',
    dimensions: '27.3 × 27.8 × 4.1 mm',
    weight: '5.2 g',
    tolerance: '128 × 64 pixels self-illuminating / >160° viewing angle',
    location: 'Rear Diagnostic Access Hatch',
    colorAccent: '#A99DC9', // Lavender Bliss
    status: 'Operational',
    simulatorCompatible: true,
    telemetry: {
      rateOrThroughput: '30 Hz Refresh @ I2C 0x3C',
      temperature: '28.1 °C',
      loadOrCurrent: '66 mW (20 mA @ 3.3V)',
      healthPercent: 100,
      operationalMode: 'Onboard Hardware Diagnostics HUD'
    },
    keyFeatures: [
      'Emissive OLED pixels requiring no backlight for high-sunlight visibility',
      'Ultra-low power sleep modes (<10µA) during autonomous patrol standby',
      'Synchronized with live Wokwi simulation canvas'
    ],
    pinout: [
      { pin: 'VCC', label: 'VCC_3V3', type: 'power', description: '3.3V power input' },
      { pin: 'GND', label: 'GND', type: 'ground', description: 'System ground' },
      { pin: 'SCL', label: 'I2C_SCL', type: 'bus', description: 'I2C clock' },
      { pin: 'SDA', label: 'I2C_SDA', type: 'bus', description: 'I2C data line' }
    ],
    coords: {
      isometric: { x: 38, y: 39 },
      topDown: { x: 30, y: 55 },
      sideElevation: { x: 36, y: 38 }
    }
  },
  {
    id: 'bp-chassis',
    name: 'Carbon-Titanium Monocoque Armor & Thermal Rails',
    code: 'CHS-CT-ARMOR',
    subsystem: 'Chassis & Structural',
    primaryFunction: 'Forms the rigid structural spine of the robot. Protects sensitive electronics from impacts, dissipates thermal heat from Jetson and motor drivers, and provides DIN mounting rails.',
    operatingVoltage: 'Passive Structural Grounding Plane',
    currentDraw: '0 A',
    busProtocol: 'Structural Earth Bonding < 0.1 Ohm',
    dimensions: '420 × 280 × 120 mm',
    weight: '3400 g (3.4 kg)',
    tolerance: 'Payload capacity up to 45 kg / Torsional rigidity 1400 Nm/deg',
    location: 'Main Unibody Enclosure',
    colorAccent: '#6E6659', // Soft Greige
    status: 'Nominal',
    simulatorCompatible: false,
    telemetry: {
      rateOrThroughput: '1400 N·m/deg Torsional Rigidity',
      temperature: '28.5 °C (Armor Skin)',
      loadOrCurrent: 'Ground Resistance < 0.05 Ω',
      healthPercent: 100,
      operationalMode: 'IP66 Hermetic Sealed Electronics Bay'
    },
    keyFeatures: [
      'High-rigidity lightweight carbon fiber composite with titanium corner bumpers',
      'Integrated passive heat dissipation channels with thermal vapor chamber',
      'IP66 ingress protection with silicone double-gasket sealed electronics bay'
    ],
    pinout: [
      { pin: 'G1', label: 'CHASSIS_GND', type: 'ground', description: 'ESD and Faraday cage structural bonding' }
    ],
    coords: {
      isometric: { x: 50, y: 54 },
      topDown: { x: 50, y: 50 },
      sideElevation: { x: 50, y: 53 }
    }
  }
];
