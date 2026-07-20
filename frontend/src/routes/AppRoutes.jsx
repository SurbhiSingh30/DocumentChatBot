import { Routes, Route } from "react-router-dom";
import Documents from "../pages/Documents";
// import Dashboard from "../pages/Dashboard";
// import Chat from "../pages/Chat";

function AppRoutes() {
  return (
    <Routes>
        <Route
            path="/"
            element={<Documents/>}
        />
    </Routes>
  );
}

export default AppRoutes;

// import { Routes, Route } from "react-router-dom";

// import Dashboard from "../pages/Dashboard";
// import Chat from "../pages/Chat";
// import Documents from "../pages/Documents";
// import Upload from "../pages/Upload";
// import Profile from "../pages/Profile";
// import Settings from "../pages/Settings";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import NotFound from "../pages/NotFound";

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Dashboard />} />

//       <Route path="/chat" element={<Chat />} />

//       <Route path="/documents" element={<Documents />} />

//       <Route path="/upload" element={<Upload />} />

//       <Route path="/profile" element={<Profile />} />

//       <Route path="/settings" element={<Settings />} />

//       <Route path="/login" element={<Login />} />

//       <Route path="/register" element={<Register />} />

//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default AppRoutes;