import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navigation: React.FC = () => {
    const { token, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsOpen(false);
    };

    return (
        <>
            <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between relative">
                <Link
                    to="/tasks"
                    className="text-xl font-bold text-blue-600 hover:text-blue-700"
                >
                    TaskManager
                </Link>

                <button
                    className="md:hidden text-gray-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className="hidden md:flex items-center justify-between flex-1 ml-8">
                    {token && (
                        <ul className="flex space-x-6">
                            <li>
                                <Link
                                    to="/tasks"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                >
                                    Tasks
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/tasks/create"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                >
                                    New Task
                                </Link>
                            </li>
                        </ul>
                    )}

                    <ul className="flex items-center space-x-4 ml-auto">
                        {token ? (
                            <>
                                <li className="text-gray-600 text-sm">
                                    {user?.email}
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-gray-600 hover:text-blue-600 transition"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-20">
                        <ul className="flex flex-col space-y-3 p-4 border-t">
                            {token && (
                                <>
                                    <li>
                                        <Link
                                            to="/tasks"
                                            className="block text-gray-700 hover:text-blue-600 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Tasks
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/tasks/create"
                                            className="block text-gray-700 hover:text-blue-600 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            New Task
                                        </Link>
                                    </li>
                                </>
                            )}

                            {token ? (
                                <>
                                    <li className="text-gray-600 text-sm">
                                        {user?.email}
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/login"
                                            className="block px-4 py-2 text-gray-600 hover:text-blue-600 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/register"
                                            className="block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            <main className="p-6">
                <Outlet />
            </main>
        </>
    );
};

export default Navigation;
