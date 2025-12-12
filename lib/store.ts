import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Column, Task } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
    tasks: Task[];
    columns: Column[];
    setTasks: (tasks: Task[]) => void;
    setColumns: (columns: Column[]) => void;
    addTask: (columnId: string, taskData: string | Partial<Task> & { content: string }) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    addColumn: (title: string) => void;
    deleteColumn: (id: string) => void;
    updateColumn: (id: string, title: string) => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            columns: [
                { id: 'todo', title: 'To Do' },
                { id: 'in-progress', title: 'In Progress' },
                { id: 'done', title: 'Done' },
            ],
            setTasks: (tasks) => set({ tasks }),
            setColumns: (columns) => set({ columns }),
            addTask: (columnId, taskData) =>
                set((state) => ({
                    tasks: [
                        ...state.tasks,
                        {
                            id: uuidv4(),
                            columnId,
                            content: typeof taskData === 'string' ? taskData : taskData.content,
                            description: typeof taskData === 'string' ? undefined : taskData.description,
                            priority: typeof taskData === 'string' ? 'Medium' : taskData.priority || 'Medium',
                            dueDate: typeof taskData === 'string' ? undefined : taskData.dueDate,
                            createdAt: new Date(),
                        },
                    ],
                })),
            updateTask: (id, updates) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates } : task
                    ),
                })),
            deleteTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                })),
            addColumn: (title) =>
                set((state) => ({
                    columns: [...state.columns, { id: uuidv4(), title }],
                })),
            deleteColumn: (id) =>
                set((state) => ({
                    columns: state.columns.filter((col) => col.id !== id),
                    tasks: state.tasks.filter((task) => task.columnId !== id),
                })),
            updateColumn: (id, title) =>
                set((state) => ({
                    columns: state.columns.map((col) =>
                        col.id === id ? { ...col, title } : col
                    ),
                })),
        }),
        {
            name: 'task-store',
        }
    )
);
