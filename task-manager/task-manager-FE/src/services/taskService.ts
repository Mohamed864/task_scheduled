import api from "./api";

export interface Task {
    id: number;
    title: string;
    description?: string;
    due_date: string;
    priority: string;
    status: string;
    assignee_email: string;
    completed_at?: string;
}

export const taskService = {
    list: (params?: { status?: string; priority?: string }) =>
        api.get<{ data: Task[] }>("/tasks", { params }),
    get: (id: number) => api.get<{ data: Task }>(`/tasks/${id}`),
    create: (payload: Partial<Task> & { assignee_email: string }) =>
        api.post<{ data: Task }>("/tasks", payload),
    update: (id: number, payload: Partial<Task>) =>
        api.patch<{ data: Task }>(`/tasks/${id}`, payload),
    toggleComplete: (id: number) =>
        api.post<{ data: Task }>(`/tasks/${id}/toggle-complete`),
    reassign: (id: number, assignee_email: string) =>
        api.post<{ data: Task }>(`/tasks/${id}/reassign`, { assignee_email }),
    delete: (id: number) => api.delete(`/tasks/${id}`),
};
