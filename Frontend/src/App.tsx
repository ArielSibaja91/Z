import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { SignUpPage } from "./pages/auth/signup/SignUpPage";
import { LoginPage } from "./pages/auth/login/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { SideBar } from "./components/common/SideBar";
import { RightPanel } from "./components/common/RightPanel";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { useAuthCheckQuery } from "./features/auth/authApi";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { data: user, isLoading, isError } = useAuthCheckQuery();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner className="w-6 h-6" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { data: user, isLoading, isSuccess } = useAuthCheckQuery();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner className="w-6 h-6" />
      </div>
    );
  }

  if (isSuccess && user) {
    return <Navigate to={location?.state?.from || "/"} replace />;
  }

  return children;
};

export const App = () => {
  const { data: user, isLoading, isSuccess } = useAuthCheckQuery();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner className="w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {isSuccess && user && <SideBar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignUpPage />
            </AuthRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {isSuccess && user && <RightPanel />}
      <Toaster />
    </div>
  );
};