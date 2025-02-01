import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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

export const App = () => {
  const { user, isLoading, isError, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner className="w-6 h-6" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Error loading user. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* SideBar only for authenticated users */}
      {user && <SideBar />}
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={user ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      {/* Right Panel only for authenticated users */}
      {user && <RightPanel />}
      <Toaster />
    </div>
  );
};
