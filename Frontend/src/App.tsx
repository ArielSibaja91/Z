import { Route, Routes, Navigate } from "react-router-dom";
import { SignUpPage } from "./pages/auth/signup/SignUpPage";
import { LoginPage } from "./pages/auth/login/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { SideBar } from "./components/common/SideBar";
import { RightPanel } from "./components/common/RightPanel";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/useAuth";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

export const App = () => {
  const { user: authUser, isLoading } = useAuth();
  if (isLoading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner className="w-6 h-6" />
			</div>
		);
	}
  return (
    <div className="flex max-w-6xl mx-auto">
      {/* SideBar only for authenticated users */}
			{authUser && <SideBar />}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login" />}/>
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>
      </Routes>
      {/* Right Panel only for authenticated users */}
			{authUser && <RightPanel />}
      <Toaster />
    </div>
  );
};