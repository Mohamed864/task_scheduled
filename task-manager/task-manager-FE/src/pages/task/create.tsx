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

    // Debounce lookup
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
        <div className="container my-4">
            <h2>Create New Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        className={`form-control ${
                            errors.title ? "is-invalid" : ""
                        }`}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    {errors.title && (
                        <div className="invalid-feedback">{errors.title}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label>Due Date</label>
                    <DatePicker
                        className={`form-control ${
                            errors.due_date ? "is-invalid" : ""
                        }`}
                        selected={dueDate}
                        onChange={(date) => setDueDate(date as Date)}
                        dateFormat="yyyy-MM-dd"
                    />
                    {errors.due_date && (
                        <div className="invalid-feedback">
                            {errors.due_date}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="mb-3 position-relative">
                    <label htmlFor="assignee_email">Assignee Email</label>
                    <input
                        type="text"
                        id="assignee_email"
                        className={`form-control ${
                            errors.assignee_email ? "is-invalid" : ""
                        }`}
                        value={assigneeEmail}
                        onChange={(e) => setAssigneeEmail(e.target.value)}
                        required
                    />
                    {emailSuggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 z-2">
                            {emailSuggestions.map((email) => (
                                <li
                                    key={email}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => setAssigneeEmail(email)}
                                >
                                    {email}
                                </li>
                            ))}
                        </ul>
                    )}
                    {errors.assignee_email && (
                        <div className="invalid-feedback">
                            {errors.assignee_email}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Task"}
                </button>
            </form>
        </div>
    );
};

export default CreateTask;
