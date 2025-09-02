import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { taskService } from "../../services/taskService";
import { userService } from "../../services/userService";

const CreateTask: React.FC = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);
    const [priority, setPriority] = useState("medium");
    const [assigneeEmail, setAssigneeEmail] = useState("");
    const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    //check on if assigneeEmail exist or not
    useEffect(() => {
        const handler = setTimeout(() => {
            if (assigneeEmail.length > 2) {
                userService
                    .findByEmail(assigneeEmail)
                    .then((res) => {
                        setEmailSuggestions([res.data.data.email]);
                    })
                    .catch(() => {
                        setEmailSuggestions([]);
                    });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [assigneeEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            await taskService.create({
                title,
                description,
                due_date: dueDate?.toISOString().split("T")[0] || "",
                priority,
                assignee_email: assigneeEmail,
            });
            navigate("/tasks");
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                    Create New Task
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            onChange={(date) => setDueDate(date as Date)}
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

                    <div className="relative">
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
                            required
                        />
                        {emailSuggestions.length > 0 && (
                            <ul className="absolute mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-200 z-20">
                                {emailSuggestions.map((email) => (
                                    <li
                                        key={email}
                                        className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                                        onClick={() => setAssigneeEmail(email)}
                                    >
                                        {email}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.assignee_email && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.assignee_email}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Task"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
