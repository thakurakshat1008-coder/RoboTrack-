import express, { Request, Response } from 'express';
import { db } from './db.ts';
import { User, UserRole } from '../src/types/index.ts';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// Helper to extract author or fallback to logged-in user from headers
function getAuthor(req: Request): User {
  const role = (req.headers['x-user-role'] as UserRole) || 'engineer';
  const name = (req.headers['x-user-name'] as string) || 'Dr. Elena Rostova';
  const email = (req.headers['x-user-email'] as string) || 'elena.rostova@robotrack.io';
  return {
    id: 'usr-active',
    name,
    email,
    role,
    organization: 'RoboTrack Autonomous Labs'
  };
}

// Permission checking middleware
function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: () => void) => {
    const user = getAuthor(req);
    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({ 
        error: `Access Denied: Role "${user.role}" does not have permission for this action. Requires one of: [${allowedRoles.join(', ')}].` 
      });
      return;
    }
    next();
  };
}

// --- HEALTH & STATS ---
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'RoboTrack Mission Control API', version: '2.4.0-stable' });
});

apiRouter.get('/stats', (_req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// --- AUTH / USER MANAGEMENT ---
apiRouter.get('/users', (_req, res) => {
  res.json(db.getUsers());
});

apiRouter.post('/auth/login', (req, res) => {
  const { email, role } = req.body;
  const users = db.getUsers();
  let user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    user = {
      id: `usr-${Date.now().toString(36)}`,
      name: email ? email.split('@')[0] : 'Engineer',
      email: email || 'engineer@robotrack.io',
      role: role || 'engineer',
      organization: 'RoboTrack Robotics Laboratory'
    };
    db.updateUser(user);
  } else if (role && user.role !== role) {
    user.role = role;
    db.updateUser(user);
  }
  
  db.logActivity({
    userName: user.name,
    userRole: user.role,
    action: 'User Session Authenticated',
    category: 'auth',
    details: `User logged in with role "${user.role}".`
  });

  res.json({ token: `rtk-${user.id}-${Date.now()}`, user });
});

// --- ROBOTS ---
apiRouter.get('/robots', (_req, res) => {
  res.json(db.getRobots());
});

apiRouter.get('/robots/:id', (req, res) => {
  const robot = db.getRobotById(req.params.id);
  if (!robot) {
    res.status(404).json({ error: 'Robot not found' });
    return;
  }
  res.json(robot);
});

apiRouter.post('/robots', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  try {
    const created = db.createRobot(req.body, author);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create robot' });
  }
});

apiRouter.put('/robots/:id', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  const updated = db.updateRobot(req.params.id, req.body, author);
  if (!updated) {
    res.status(404).json({ error: 'Robot not found' });
    return;
  }
  res.json(updated);
});

apiRouter.delete('/robots/:id', requireRole(['owner', 'admin']), (req, res) => {
  const author = getAuthor(req);
  const success = db.deleteRobot(req.params.id, author);
  if (!success) {
    res.status(404).json({ error: 'Robot not found' });
    return;
  }
  res.json({ message: 'Robot decommissioned successfully' });
});

// --- MISSIONS ---
apiRouter.get('/missions', (_req, res) => {
  res.json(db.getMissions());
});

apiRouter.post('/missions', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  try {
    const created = db.createMission(req.body, author);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create mission' });
  }
});

apiRouter.put('/missions/:id/status', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  const { status, notes } = req.body;
  const updated = db.updateMissionStatus(req.params.id, status, author, notes);
  if (!updated) {
    res.status(404).json({ error: 'Mission not found' });
    return;
  }
  res.json(updated);
});

// --- TELEMETRY ---
apiRouter.get('/telemetry/:robotId/sample', (req, res) => {
  const reading = db.generateSimulatedReading(req.params.robotId);
  res.json({
    mode: 'simulation',
    disclaimer: 'SIMULATION MODE: Values generated using kinematic & thermal drift models. Not a physical hardware link.',
    reading
  });
});

// Real hardware ingestion endpoint
apiRouter.post('/hardware/telemetry', (req, res) => {
  const { robotId, apiKey, reading } = req.body;
  if (!robotId || !reading) {
    res.status(400).json({ error: 'Missing robotId or reading payload' });
    return;
  }

  // Update robot battery and status if provided
  if (reading.batteryPercentage !== undefined) {
    const robot = db.getRobotById(robotId);
    if (robot) {
      robot.batteryLevel = reading.batteryPercentage;
      robot.status = 'Online';
    }
  }

  res.json({ 
    success: true, 
    status: 'received', 
    timestamp: new Date().toISOString(),
    ingestedCount: 1 
  });
});

// --- TESTING LAB ---
apiRouter.get('/testing', (_req, res) => {
  res.json(db.getTestingSessions());
});

apiRouter.post('/testing', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  try {
    const session = db.createTestingSession(req.body, author);
    res.status(201).json(session);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create testing session' });
  }
});

// --- INVENTORY ---
apiRouter.get('/inventory', (_req, res) => {
  res.json(db.getInventory());
});

apiRouter.post('/inventory', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  try {
    const item = db.createInventoryItem(req.body, author);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to add inventory item' });
  }
});

apiRouter.patch('/inventory/:id/stock', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  const { delta } = req.body;
  const updated = db.updateInventoryQuantity(req.params.id, delta, author);
  if (!updated) {
    res.status(404).json({ error: 'Inventory item not found' });
    return;
  }
  res.json(updated);
});

// --- MAINTENANCE ---
apiRouter.get('/maintenance', (_req, res) => {
  res.json(db.getMaintenanceTasks());
});

apiRouter.post('/maintenance', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  try {
    const task = db.createMaintenanceTask(req.body, author);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create maintenance task' });
  }
});

apiRouter.put('/maintenance/:id/status', requireRole(['owner', 'admin', 'engineer']), (req, res) => {
  const author = getAuthor(req);
  const { status } = req.body;
  const task = db.updateMaintenanceTaskStatus(req.params.id, status, author);
  if (!task) {
    res.status(404).json({ error: 'Maintenance task not found' });
    return;
  }
  res.json(task);
});

// --- ACTIVITY LOGS ---
apiRouter.get('/activity-logs', (_req, res) => {
  res.json(db.getActivityLogs());
});
