import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navigation: React.FC = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
                <Link className="navbar-brand" to="/">
                    TaskManager
                </Link>
                <div className="collapse navbar-collapse">
                    {token ? (
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/tasks">
                                    Tasks
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/tasks/create">
                                    New Task
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <ul className="navbar-nav me-auto">
                            {/* Could add other public links */}
                        </ul>
                    )}
                    <ul className="navbar-nav ms-auto">
                        {token ? (
                            <>
                                <li className="nav-item nav-link disabled">
                                    {user?.email}
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className="btn btn-link nav-link"
                                        to="/login"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className="btn btn-primary nav-link"
                                        to="/register"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </nav>
            <main className="p-4">
                <Outlet />
            </main>
        </>
    );
};

export default Navigation;
