export type Priority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  columnId: string;
  content: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
};

export type Column = {
  id: string;
  title: string;
};
