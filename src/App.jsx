import {Routes, Route, Navigate} from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Admin/Home";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import NotFoundPage from "./pages/Admin/pages/NotFoundPage";
import UserProfilePage from "./pages/Admin/pages/UserProfilePage";

function App() {
    return (
        <Routes>
            {/* Захищений блок - всі маршрути потребують авторизації */}
            <Route
                element={
                 <AdminLayout/>
                 //    <PrivateRoute>
                 //        <AdminLayout />
                 //    </PrivateRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<UserProfilePage/>}/>
                <Route path="/settings" element={<div>Settings Page</div>} />
                {/* Додайте інші захищені маршрути */}

                {/* Сторінка 404 всередині захищеної області */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Публічні маршрути - доступні без авторизації */}
            <Route element={<AuthLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>



            {/* Fallback route для неіснуючих маршрутів */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;