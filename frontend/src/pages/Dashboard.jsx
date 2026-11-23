
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [username, setUsername] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Fetch logged-in user
    const fetchProfile = async () => {
        try {
            const response = await API.get("/auth/me");
            setUsername(response.data.username);
        } catch (error) {
            console.error("Profile loading failed", error);
        }
    };

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            const response = await API.get("/tasks/");
            setTasks(response.data);
        } catch (error) {
            setMessage("Unable to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchTasks();
    }, []);

    // Dashboard statistics
    const totalTasks = tasks.length;

    const pendingTasks = tasks.filter(
        task => task.status === "Pending"
    ).length;

    const progressTasks = tasks.filter(
        task => task.status === "In Progress"
    ).length;

    const completedTasks = tasks.filter(
        task => task.status === "Completed"
    ).length;

    // Search and filter
    const filteredTasks = useMemo(() => {

        return tasks.filter(task => {

            const matchesSearch =
                task.title.toLowerCase().includes(
                    search.toLowerCase()
                ) ||
                (task.description || "").toLowerCase().includes(
                    search.toLowerCase()
                );

            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;

        });

    }, [tasks, search, statusFilter, priorityFilter]);

    // Delete task
    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await API.delete(`/tasks/${id}`);

            setTasks(previous =>
                previous.filter(task => task.id !== id)
            );

            setMessage("Task deleted successfully.");

        } catch (error) {
            setMessage("Unable to delete task.");
        }
    };

    // Edit task
    const handleEdit = (task) => {
        navigate("/tasks/edit", {
            state: { task }
        });
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/login");
    };

    return (

        <div className="pro-dashboard">

            {/* SIDEBAR */}
            <aside className="pro-sidebar">

                <div className="pro-logo">
                    <span className="pro-logo-icon">T</span>
                    <span>TaskFlow</span>
                </div>

                <div className="sidebar-section">
                    <p className="sidebar-heading">WORKSPACE</p>

                    <button
                        className="sidebar-link active"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() => navigate("/tasks/new")}
                    >
                        <span>＋</span>
                        Create Task
                    </button>
                </div>

                <div className="sidebar-bottom">

                    <div className="sidebar-user">
                        <div className="user-avatar">
                            {username ? username[0].toUpperCase() : "U"}
                        </div>

                        <div>
                            <strong>{username || "User"}</strong>
                            <small>Member</small>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="pro-main">

                {/* TOP HEADER */}
                <header className="pro-header">

                    <div>
                        <p className="header-subtitle">WORKSPACE / OVERVIEW</p>
                        <h1>Dashboard</h1>
                    </div>

                    <button
                        className="create-task-button"
                        onClick={() => navigate("/tasks/new")}
                    >
                        + Create New Task
                    </button>

                </header>

                {/* WELCOME */}
                <section className="welcome-banner">

                    <div>
                        <p>YOUR PRODUCTIVITY SPACE</p>

                        <h2>
                            Welcome back, {username || "there"}!
                        </h2>

                        <span>
                            Here's an overview of your tasks and progress.
                        </span>
                    </div>

                    <div className="welcome-icon">✦</div>

                </section>

                {/* STATISTICS */}
                <section className="pro-stats-grid">

                    <div className="pro-stat-card">
                        <div className="stat-top">
                            <span>Total Tasks</span>
                            <span className="stat-icon blue">▦</span>
                        </div>
                        <h2>{totalTasks}</h2>
                        <small>All your tasks</small>
                    </div>

                    <div className="pro-stat-card">
                        <div className="stat-top">
                            <span>Pending</span>
                            <span className="stat-icon orange">◷</span>
                        </div>
                        <h2>{pendingTasks}</h2>
                        <small>Waiting to start</small>
                    </div>

                    <div className="pro-stat-card">
                        <div className="stat-top">
                            <span>In Progress</span>
                            <span className="stat-icon purple">↗</span>
                        </div>
                        <h2>{progressTasks}</h2>
                        <small>Currently working</small>
                    </div>

                    <div className="pro-stat-card">
                        <div className="stat-top">
                            <span>Completed</span>
                            <span className="stat-icon green">✓</span>
                        </div>
                        <h2>{completedTasks}</h2>
                        <small>Successfully finished</small>
                    </div>

                </section>

                {/* TASK SECTION */}
                <section className="pro-task-section">

                    <div className="task-section-header">

                        <div>
                            <h2>My Tasks</h2>
                            <p>Manage and track your daily activities.</p>
                        </div>

                        <span className="task-count">
                            {filteredTasks.length} Tasks
                        </span>

                    </div>

                    {/* SEARCH AND FILTER */}
                    <div className="pro-filters">

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>

                    </div>

                    {message && (
                        <p className="dashboard-message">{message}</p>
                    )}

                    {/* TASK TABLE */}
                    <div className="pro-table-wrapper">

                        <table className="pro-task-table">

                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {loading ? (

                                    <tr>
                                        <td colSpan="4" className="empty-state">
                                            Loading tasks...
                                        </td>
                                    </tr>

                                ) : filteredTasks.length === 0 ? (

                                    <tr>
                                        <td colSpan="4" className="empty-state">
                                            No tasks found. Create your first task!
                                        </td>
                                    </tr>

                                ) : (

                                    filteredTasks.map(task => (

                                        <tr key={task.id}>

                                            <td>
                                                <div className="task-title-cell">
                                                    <strong>{task.title}</strong>
                                                    <small>
                                                        {task.description || "No description"}
                                                    </small>
                                                </div>
                                            </td>

                                            <td>
                                                <span className={`status-badge ${task.status === "Completed" ? "status-completed" : task.status === "In Progress" ? "status-progress" : "status-pending"}`}>
                                                    {task.status}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                                                    {task.priority}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="table-actions">

                                                    <button
                                                        className="edit-action"
                                                        onClick={() => handleEdit(task)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-action"
                                                        onClick={() => handleDelete(task.id)}
                                                    >
                                                        Delete
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                <footer className="pro-footer">
                    © 2026 TaskFlow. Built for better productivity.
                </footer>

            </main>

        </div>
    );
}

export default Dashboard;
