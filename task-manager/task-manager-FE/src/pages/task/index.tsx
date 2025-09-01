import React, { useState, useEffect } from "react";
import { taskService } from "../../services/taskService";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Task {
    id: number;
    title: string;
    due_date: string;
    priority: string;
    status: string;
}

const TaskList: React.FC = () => {
    const { token } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string>("");

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;

            const res = await taskService.list(params);
            setTasks(res.data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (token) fetchTasks();
    }, [token, statusFilter, priorityFilter]);

    return (
        <div className="container my-4">
            <h2>Tasks</h2>
            <div className="d-flex mb-3">
                <select
                    className="form-select me-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    {["Done", "Missed/Late", "Due Today", "Upcoming"].map(
                        (s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        )
                    )}
                </select>
                <select
                    className="form-select"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    {["low", "medium", "high"].map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Loading tasks...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Due</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.due_date}</td>
                                <td>{task.priority}</td>
                                <td>{task.status}</td>
                                <td>
                                    <Link
                                        to={`/tasks/edit/${task.id}`}
                                        className="btn btn-sm btn-primary me-2"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={async () => {
                                            await taskService.toggleComplete(
                                                task.id
                                            );
                                            fetchTasks();
                                        }}
                                    >
                                        Toggle Complete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TaskList;
