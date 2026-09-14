import { Outlet } from "react-router-dom";

const BuyerLayout = () => {
    return (
        <div className="dashboard-layout">
            <main className="dashboard-main">
                <Outlet />
            </main>
        </div>
    );
};

export default BuyerLayout;