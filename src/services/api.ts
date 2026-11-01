import { 
  Robot, 
  Mission, 
  TestingSession, 
  InventoryItem, 
  MaintenanceTask, 
  ActivityLog, 
  User, 
  WorkspaceStats, 
  TelemetryReading,
  UserRole 
} from '../types/index.ts';

class RoboTrackApiService {
  private currentUser: User = {
    id: 'usr-active',
    name: 'Dr. Elena Rostova',
    email: 'thakur.akshat101@gmail.com',
    role: 'owner',
    organization: 'RoboTrack Autonomous Labs'
  };

  public getCurrentUser(): User {
    const saved = localStorage.getItem('robotrack_session_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return this.currentUser;
  }

  public setCurrentUser(user: User): void {
    this.currentUser = user;
    localStorage.setItem('robotrack_session_user', JSON.stringify(user));
  }

  private getHeaders(): HeadersInit {
    const user = this.getCurrentUser();
    return {
      'Content-Type': 'application/json',
      'x-user-role': user.role,
      'x-user-name': user.name,
      'x-user-email': user.email
    };
  }

  // --- STATS ---
  async getStats(): Promise<WorkspaceStats> {
    try {
      const res = await fetch('/api/stats', { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch {
      return {
        totalRobots: 6,
        activeRobots: 4,
        completedMissions: 3,
        runningTests: 1,
        pendingMaintenance: 2,
        averageMissionSuccess: 97
      };
    }
  }

  // --- AUTH ---
  async login(email: string, role: UserRole = 'engineer'): Promise<{ token: string; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, role })
    });
    if (!res.ok) throw new Error('Authentication failed');
    const data = await res.json();
    this.setCurrentUser(data.user);
    return data;
  }

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/users', { headers: this.getHeaders() });
      return await res.json();
    } catch {
      return [this.currentUser];
    }
  }

  // --- ROBOTS ---
  async getRobots(): Promise<Robot[]> {
    const res = await fetch('/api/robots', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch robots');
    return await res.json();
  }

  async getRobotById(id: string): Promise<Robot> {
    const res = await fetch(`/api/robots/${id}`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Robot not found');
    return await res.json();
  }

  async createRobot(robot: Omit<Robot, 'id'>): Promise<Robot> {
    const res = await fetch('/api/robots', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(robot)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create robot');
    }
    return await res.json();
  }

  async updateRobot(id: string, updates: Partial<Robot>): Promise<Robot> {
    const res = await fetch(`/api/robots/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update robot');
    }
    return await res.json();
  }

  async deleteRobot(id: string): Promise<void> {
    const res = await fetch(`/api/robots/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete robot');
    }
  }

  // --- MISSIONS ---
  async getMissions(): Promise<Mission[]> {
    const res = await fetch('/api/missions', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch missions');
    return await res.json();
  }

  async createMission(mission: Omit<Mission, 'id'>): Promise<Mission> {
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(mission)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create mission');
    }
    return await res.json();
  }

  async updateMissionStatus(id: string, status: Mission['status'], notes?: string): Promise<Mission> {
    const res = await fetch(`/api/missions/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, notes })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update mission status');
    }
    return await res.json();
  }

  // --- TELEMETRY ---
  async getSimulatedTelemetry(robotId: string): Promise<{ mode: string; disclaimer: string; reading: TelemetryReading }> {
    const res = await fetch(`/api/telemetry/${robotId}/sample`, { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    return await res.json();
  }

  // --- TESTING LAB ---
  async getTestingSessions(): Promise<TestingSession[]> {
    const res = await fetch('/api/testing', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch test sessions');
    return await res.json();
  }

  async createTestingSession(session: Omit<TestingSession, 'id'>): Promise<TestingSession> {
    const res = await fetch('/api/testing', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(session)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create test session');
    }
    return await res.json();
  }

  // --- INVENTORY ---
  async getInventory(): Promise<InventoryItem[]> {
    const res = await fetch('/api/inventory', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return await res.json();
  }

  async createInventoryItem(item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(item)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to add inventory item');
    }
    return await res.json();
  }

  async updateStock(id: string, delta: number): Promise<InventoryItem> {
    const res = await fetch(`/api/inventory/${id}/stock`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ delta })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update stock');
    }
    return await res.json();
  }

  // --- MAINTENANCE ---
  async getMaintenanceTasks(): Promise<MaintenanceTask[]> {
    const res = await fetch('/api/maintenance', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch maintenance tasks');
    return await res.json();
  }

  async createMaintenanceTask(task: Omit<MaintenanceTask, 'id'>): Promise<MaintenanceTask> {
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(task)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create maintenance task');
    }
    return await res.json();
  }

  async updateMaintenanceStatus(id: string, status: MaintenanceTask['status']): Promise<MaintenanceTask> {
    const res = await fetch(`/api/maintenance/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update maintenance task');
    }
    return await res.json();
  }

  // --- ACTIVITY LOGS ---
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activity-logs', { headers: this.getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch activity logs');
    return await res.json();
  }
}

export const api = new RoboTrackApiService();
