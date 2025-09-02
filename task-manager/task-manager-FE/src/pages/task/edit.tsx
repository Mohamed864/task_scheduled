import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { taskService } from "../../services/taskService";

const EditTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const taskId = Number(id);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState("");
    const [assigneeEmail, setAssigneeEmail] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTask() {
            try {
                const res = await taskService.get(taskId);
                const task = res.data.data;
                setTitle(task.title);
                setDescription(task.description || "");
                setDueDate(new Date(task.due_date));
                setPriority(task.priority);
                setAssigneeEmail(task.assignee_email);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadTask();
    }, [taskId]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            await taskService.update(taskId, {
                title,
                description,
                due_date: dueDate?.toISOString().split("T")[0] || "",
                priority,
            });
            if (assigneeEmail) {
                await taskService.reassign(taskId, assigneeEmail);
            }
            navigate("/tasks");
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                    Edit Task
                </h2>

                <form onSubmit={handleSave} className="space-y-5">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.title
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        {errors.title && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date
                        </label>
                        <DatePicker
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.due_date
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            selected={dueDate}
                            onChange={(d) => setDueDate(d as Date)}
                            dateFormat="yyyy-MM-dd"
                        />
                        {errors.due_date && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.due_date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="priority"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Priority
                        </label>
                        <select
                            id="priority"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="assignee_email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Assignee Email
                        </label>
                        <input
                            id="assignee_email"
                            type="text"
                            className={`w-full px-4 py-2 rounded-lg border ${
                                errors.assignee_email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            value={assigneeEmail}
                            onChange={(e) => setAssigneeEmail(e.target.value)}
                        />
                        {errors.assignee_email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.assignee_email}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="w-full sm:w-auto px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                            onClick={() => navigate("/tasks")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTask;
