import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout"

import Dashboard from "../pages/Dashboard";
import Chat from "../pages/Chat";
import Documents from "../pages/Documents";
import Upload from "../pages/Upload";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      <Route element={<Layout/>} >

        <Route path="/" element={<Dashboard />} />

        <Route path="/chat" element={<Chat />} />

        <Route path="/documents" element={<Documents />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/settings" element={<Settings />} />

      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
