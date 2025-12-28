import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Admin/Home";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

import NotFoundPage from "./pages/Admin/pages/NotFoundPage";
import UserProfilePage from "./pages/Admin/pages/UserProfilePage";
import FileManagerPage from "./pages/Admin/pages/FileManagerPage";
import PrivateRoute from "./pages/Auth/PrivateRoute";

function App() {
    return (
        <Routes>

            {/* 🔒 Захищена адмін-зона */}
            <Route element={
                <PrivateRoute>
                    <AdminLayout />
                </PrivateRoute>
            }>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/files" element={<FileManagerPage />} />
                <Route path="/settings" element={<div>Settings Page</div>} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* 🌐 Публічна зона */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            {/* ❗ Якщо нічого не співпало → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
}

export default App;
