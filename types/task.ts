
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  skills?: string[];
}

export interface TaskApplicant {
  id: string;
  userId: string;
  name: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  skills: string[];
  amount: number;
  lastDate: string;
  createdBy: string;
  createdAt: string;
  status: 'open' | 'closed' | 'completed';
  applicants: TaskApplicant[];
}

export interface TaskApplication {
  taskId: string;
  userId: string;
  task: Task;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}
