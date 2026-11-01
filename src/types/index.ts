export type UserRole = 'owner' | 'admin' | 'engineer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  organization: string;
}

export type RobotType = 
  | 'Autonomous Mobile Robot' 
  | 'Robotic Arm' 
  | 'Quadruped' 
  | 'Robotics Car' 
  | 'Line-Following Robot' 
  | 'Obstacle-Avoiding Robot' 
  | 'Educational Kit' 
  | 'Custom Experimental';

export type RobotStatus = 'Online' | 'Offline' | 'Testing' | 'Maintenance' | 'Archived';

export interface Robot {
  id: string;
  code: string; // e.g. RBT-042
  name: string;
  type: RobotType;
  status: RobotStatus;
  description: string;
  manufacturer: string;
  controller: string; // e.g. Raspberry Pi 5 + STM32F4
  sensors: string[];
  communicationProtocol: string; // e.g. ROS2 / Micro-XRCE / WebSockets
  registrationDate: string;
  batteryLevel: number;
  firmwareVersion: string;
  ipAddress?: string;
  location?: string;
  totalMissions: number;
  operationalHours: number;
}

export type MissionPriority = 'Low' | 'Normal' | 'High' | 'Critical';
export type MissionStatus = 'Planned' | 'Scheduled' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';

export interface Mission {
  id: string;
  code: string; // e.g. MSN-108
  name: string;
  robotId: string;
  robotName?: string;
  priority: MissionPriority;
  status: MissionStatus;
  objective: string;
  scheduledStart: string;
  startTime?: string;
  endTime?: string;
  durationSeconds?: number;
  performanceScore?: number;
  notes?: string;
  createdBy: string;
}

export interface TelemetryReading {
  timestamp: string;
  batteryPercentage: number;
  temperatureCelsius: number;
  speedMps: number;
  distanceTraveledM: number;
  motorRpm: number;
  motorLoadPercent: number;
  signalDbm: number;
  lidarDistanceM: number;
  imuPitch: number;
  imuRoll: number;
  imuYaw: number;
  currentDrawAmps: number;
  systemHealth: 'nominal' | 'warning' | 'critical';
}

export type TestCategory = 
  | 'Speed Testing' 
  | 'Sensor Testing' 
  | 'Battery Testing' 
  | 'Navigation Testing' 
  | 'Stability Testing' 
  | 'Obstacle Detection Testing';

export type TestStatus = 'Passed' | 'Failed' | 'Warning' | 'In Progress';

export interface TestingSession {
  id: string;
  testName: string;
  robotId: string;
  robotName?: string;
  testType: TestCategory;
  date: string;
  testObjective: string;
  testDurationSeconds: number;
  status: TestStatus;
  results: string;
  observations: string;
  conductedBy: string;
}

export type ComponentCategory = 
  | 'Motors' 
  | 'Sensors' 
  | 'Controllers' 
  | 'Batteries' 
  | 'Wheels' 
  | 'Frames' 
  | 'Communication Modules' 
  | 'Other Components';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ComponentCategory;
  quantity: number;
  minThreshold: number;
  unitPriceUsd: number;
  manufacturer: string;
  specifications: string;
  location: string;
  assignedRobotId?: string;
  assignedRobotName?: string;
  lastRestocked: string;
  // Extended hardware properties
  operatingVoltage: string;
  busProtocol: string;
  currentDraw: string;
  dimensions: string;
  weight: string;
  pinout: string[];
  packageType: string;
  tolerance: string;
  inStock: boolean;
  datasheetUrl?: string;
  simulatorCompatible?: boolean;
}

export type MaintenanceStatus = 'Pending' | 'In Progress' | 'Completed';
export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface MaintenanceTask {
  id: string;
  taskTitle: string;
  robotId: string;
  robotName?: string;
  assignedTo: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  completedDate?: string;
  replacedComponents?: string[];
  notes: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'robot' | 'mission' | 'telemetry' | 'testing' | 'inventory' | 'maintenance' | 'auth';
  details: string;
}

export interface WorkspaceStats {
  totalRobots: number;
  activeRobots: number;
  completedMissions: number;
  runningTests: number;
  pendingMaintenance: number;
  averageMissionSuccess: number;
}
