import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div className="dashboard-layout">
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;