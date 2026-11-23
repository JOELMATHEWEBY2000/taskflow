
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./TaskForm.css";

function TaskForm() {
    const navigate = useNavigate();
    const location = useLocation();

    // If a task is passed from Dashboard, this form works in Edit mode.
    const existingTask = location.state?.task;

    const [formData, setFormData] = useState({
        title: existingTask?.title || "",
        description: existingTask?.description || "",
        status: existingTask?.status || "Pending",
        priority: existingTask?.priority || "Medium",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const isEditing = Boolean(existingTask);

    // Handle form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Submit task to FastAPI
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.title.trim()) {
            setError("Please enter a task title.");
            return;
        }

        if (formData.title.trim().length < 3) {
            setError("Task title must contain at least 3 characters.");
            return;
        }

        const payload = {
            ...formData,
            title: formData.title.trim(),
            description: formData.description.trim(),
        };

        try {
            setLoading(true);

            if (isEditing) {
                await api.put(`/tasks/${existingTask.id}`, payload);
            } else {
                await api.post("/tasks/", payload);
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Task submission error:", err);

            const detail = err.response?.data?.detail;

            setError(
                typeof detail === "string"
                    ? detail
                    : "Unable to save the task. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="taskform-page">
            <div className="taskform-container">

                {/* HEADER */}
                <div className="taskform-header">
                    <div>
                        <span className="taskform-label">
                            TASK MANAGEMENT
                        </span>

                        <h1>
                            {isEditing ? "Edit Task" : "Create New Task"}
                        </h1>

                        <p>
                            {isEditing
                                ? "Update your task details below."
                                : "Add a new task and keep your work organized."}
                        </p>
                    </div>

                    <div className="taskform-header-icon">
                        ✓
                    </div>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="taskform-card">

                    <div className="taskform-section-title">
                        <h2>Task Information</h2>
                        <p>Enter the details for your task.</p>
                    </div>

                    {error && (
                        <div className="taskform-error">
                            {error}
                        </div>
                    )}

                    {/* TITLE */}
                    <div className="taskform-group">
                        <label htmlFor="title">
                            Task Title <span>*</span>
                        </label>

                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g. Complete project documentation"
                            value={formData.title}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />

                        <small>
                            Give your task a clear and meaningful title.
                        </small>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="taskform-group">
                        <label htmlFor="description">
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe what needs to be completed..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                        />

                        <small>
                            Add additional information about this task.
                        </small>
                    </div>

                    {/* STATUS AND PRIORITY */}
                    <div className="taskform-row">

                        <div className="taskform-group">
                            <label htmlFor="status">
                                Task Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="taskform-group">
                            <label htmlFor="priority">
                                Priority Level
                            </label>

                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                    </div>

                    {/* BUTTONS */}
                    <div className="taskform-actions">

                        <button
                            type="button"
                            className="taskform-cancel"
                            onClick={() => navigate("/dashboard")}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="taskform-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                    ? "Update Task"
                                    : "Create Task"}
                        </button>

                    </div>

                </form>

                <div className="taskform-footer">
                    TaskFlow · Organize your work, achieve your goals.
                </div>

            </div>
        </div>
    );
}

export default TaskForm;
