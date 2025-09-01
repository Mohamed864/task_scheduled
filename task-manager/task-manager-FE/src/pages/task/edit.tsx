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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container my-4">
            <h2>Edit Task</h2>
            <form onSubmit={handleSave}>
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
                        onChange={(d) => setDueDate(d as Date)}
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
                <div className="mb-3">
                    <label htmlFor="assignee_email">Assignee Email</label>
                    <input
                        type="text"
                        id="assignee_email"
                        className={`form-control ${
                            errors.assignee_email ? "is-invalid" : ""
                        }`}
                        value={assigneeEmail}
                        onChange={(e) => setAssigneeEmail(e.target.value)}
                    />
                    {errors.assignee_email && (
                        <div className="invalid-feedback">
                            {errors.assignee_email}
                        </div>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    Save
                </button>{" "}
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/tasks")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditTask;
