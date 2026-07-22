import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    console.log(collapsed);
    return (
        <div className="layout">

            <Sidebar
                collapsed={collapsed}
            />

            <div className="main">

                <Navbar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <div className="page-content">
                    <Outlet />
                </div>

            </div>

        </div>
    );
}

export default Layout;