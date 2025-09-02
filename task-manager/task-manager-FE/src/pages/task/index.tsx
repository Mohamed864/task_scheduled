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

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [newAssignee, setNewAssignee] = useState("");
    const [modalError, setModalError] = useState("");

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

    const handleReassign = async () => {
        if (!selectedTaskId) return;
        try {
            await taskService.reassign(selectedTaskId, newAssignee);
            setModalOpen(false);
            setNewAssignee("");
            fetchTasks();
        } catch (err: any) {
            setModalError(err.response?.data?.message || "Failed to reassign");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h2>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <select
                        aria-label="Task Statuses"
                        name="Statuses"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                        aria-label="Task priority"
                        name="priority"
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <p className="text-gray-600">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p className="text-gray-500 text-center">No tasks found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        Due
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        Priority
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task) => (
                                    <tr
                                        key={task.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-2 text-gray-800">
                                            {task.title}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600">
                                            {task.due_date}
                                        </td>
                                        <td className="px-4 py-2 capitalize">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    task.priority === "high"
                                                        ? "bg-red-100 text-red-700"
                                                        : task.priority ===
                                                          "medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            {task.status}
                                        </td>
                                        <td className="px-4 py-2 flex flex-wrap gap-2">
                                            <Link
                                                to={`/tasks/edit/${task.id}`}
                                                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
                                                onClick={async () => {
                                                    await taskService.toggleComplete(
                                                        task.id
                                                    );
                                                    fetchTasks();
                                                }}
                                            >
                                                Toggle Complete
                                            </button>
                                            <button
                                                className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                                onClick={() => {
                                                    setSelectedTaskId(task.id);
                                                    setModalOpen(true);
                                                }}
                                            >
                                                Reassign
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Reassign Task
                                    </h3>
                                    {modalError && (
                                        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
                                            {modalError}
                                        </div>
                                    )}
                                    <input
                                        type="email"
                                        placeholder="Assignee Email"
                                        className="w-full border px-3 py-2 mb-4 rounded"
                                        value={newAssignee}
                                        onChange={(e) =>
                                            setNewAssignee(e.target.value)
                                        }
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => setModalOpen(false)}
                                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReassign}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
