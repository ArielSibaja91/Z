import { Route, Routes } from "react-router-dom";
import { SignUpPage } from "./pages/auth/signup/SignUpPage";
import { LoginPage } from "./pages/auth/login/LoginPage";
import { HomePage } from "./pages/home/HomePage";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { SideBar } from "./components/common/SideBar";
import { RightPanel } from "./components/common/RightPanel";
import { ProfilePage } from "./pages/profile/ProfilePage";

export const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <SideBar />
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>
        <Route path="/notifications" element={<NotificationPage />}/>
        <Route path="/profile/:username" element={<ProfilePage />}/>
      </Routes>
      <RightPanel />
    </div>
  );
};