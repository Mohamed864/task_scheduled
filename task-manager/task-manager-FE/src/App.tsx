// src/App.tsx

import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import TaskList from "./pages/task/index";
import CreateTask from "./pages/task/create";
import EditTask from "./pages/task/edit";
import Navigation from "./pages/navigation/navigation";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { token } = useAuth();
    return token ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigation />}>
                <Route
                    path="/tasks"
                    element={
                        <RequireAuth>
                            <TaskList />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/tasks/create"
                    element={
                        <RequireAuth>
                            <CreateTask />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/tasks/edit/:id"
                    element={
                        <RequireAuth>
                            <EditTask />
                        </RequireAuth>
                    }
                />
            </Route>
        </Routes>
    );
};

export default App;
