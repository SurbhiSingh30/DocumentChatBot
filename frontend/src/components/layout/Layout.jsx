import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

function Layout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="layout">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <main className="main">
                <Navbar />

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;