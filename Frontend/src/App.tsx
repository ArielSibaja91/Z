import { useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { SignUpPage } from "./pages/auth/signup/SignUpPage";
import { LoginPage } from "./pages/auth/login/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { SideBar } from "./components/common/SideBar";
import { RightPanel } from "./components/common/RightPanel";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner className="w-6 h-6" />;
  };

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  };

  return children;
};

const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner className="w-6 h-6" />;
  };
  
  if (user) {
    return <Navigate to={location?.state?.from || "/"} replace />;
  };
  
  return children;
};

export const App = () => {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex max-w-6xl mx-auto">
      {user && <SideBar />}
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
      {user && <RightPanel />}
      <Toaster />
    </div>
  );
};
