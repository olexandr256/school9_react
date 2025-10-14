import { Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Admin/Home";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import PrivateRoute from "./pages/Admin/components/PrivateRoute";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";

function App() {
    return (
        <Routes>
            {/* Захищений блок */}
            <Route
                element={
                    <PrivateRoute>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/dashboard" element={<Home />} />
            </Route>

            {/* Публічні маршрути */}
            <Route element={<AuthLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

        </Routes>
    );
}

export default App;
