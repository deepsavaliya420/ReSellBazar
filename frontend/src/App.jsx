import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import SellerLayout from "./layouts/SellerLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import Home from "./pages/common/Home";
import Products from "./pages/common/Products";
import ProductDetails from "./pages/common/ProductDetails";
import Categories from "./pages/common/Categories";
import NotFound from "./pages/common/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Cart from "./pages/buyer/Cart";
import Wishlist from "./pages/buyer/Wishlist";
import Addresses from "./pages/buyer/Addresses";
import Checkout from "./pages/buyer/Checkout";
import Orders from "./pages/buyer/Orders";
import OrderDetails from "./pages/buyer/OrderDetails";
import Payments from "./pages/buyer/Payments";
import Auctions from "./pages/buyer/Auctions";
import AuctionDetails from "./pages/buyer/AuctionDetails";
import Returns from "./pages/buyer/Returns";
import Reviews from "./pages/buyer/Reviews";

import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/MyProducts";
import AddProduct from "./pages/seller/AddProduct";
import EditProduct from "./pages/seller/EditProduct";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerAuctions from "./pages/seller/SellerAuctions";
import CreateAuction from "./pages/seller/CreateAuction";
import SellerMessages from "./pages/seller/SellerMessages";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageReturns from "./pages/admin/ManageReturns";
import ManageAuctions from "./pages/admin/ManageAuctions";
import SupportTickets from "./pages/admin/SupportTickets";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/products"
                        element={<Products />}
                    />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/categories"
                        element={<Categories />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        element={
                            <ProtectedRoute>
                                <RoleRoute role="buyer">
                                    <BuyerLayout />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/buyer"
                            element={<BuyerDashboard />}
                        />

                        <Route
                            path="/buyer/cart"
                            element={<Cart />}
                        />

                        <Route
                            path="/buyer/wishlist"
                            element={<Wishlist />}
                        />

                        <Route
                            path="/buyer/addresses"
                            element={<Addresses />}
                        />

                        <Route
                            path="/buyer/checkout"
                            element={<Checkout />}
                        />

                        <Route
                            path="/buyer/orders"
                            element={<Orders />}
                        />

                        <Route
                            path="/buyer/orders/:id"
                            element={<OrderDetails />}
                        />

                        <Route
                            path="/buyer/payments/:orderId"
                            element={<Payments />}
                        />

                        <Route
                            path="/buyer/auctions"
                            element={<Auctions />}
                        />

                        <Route
                            path="/buyer/auctions/:id"
                            element={<AuctionDetails />}
                        />

                        <Route
                            path="/buyer/returns"
                            element={<Returns />}
                        />

                        <Route
                            path="/buyer/reviews/:productId"
                            element={<Reviews />}
                        />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute>
                                <RoleRoute role="seller">
                                    <SellerLayout />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/seller"
                            element={<SellerDashboard />}
                        />

                        <Route
                            path="/seller/products"
                            element={<SellerProducts />}
                        />

                        <Route
                            path="/seller/products/add"
                            element={<AddProduct />}
                        />

                        <Route
                            path="/seller/products/edit/:id"
                            element={<EditProduct />}
                        />

                        <Route
                            path="/seller/orders"
                            element={<SellerOrders />}
                        />

                        <Route
                            path="/seller/auctions"
                            element={<SellerAuctions />}
                        />

                        <Route
                            path="/seller/auctions/add"
                            element={<CreateAuction />}
                        />

                        <Route
                            path="/seller/messages"
                            element={<SellerMessages />}
                        />
                    </Route>

                    <Route
                        element={
                            <ProtectedRoute>
                                <RoleRoute role="admin">
                                    <AdminLayout />
                                </RoleRoute>
                            </ProtectedRoute>
                        }
                    >
                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/users"
                            element={<ManageUsers />}
                        />

                        <Route
                            path="/admin/products"
                            element={<ManageProducts />}
                        />

                        <Route
                            path="/admin/categories"
                            element={<ManageCategories />}
                        />

                        <Route
                            path="/admin/orders"
                            element={<ManageOrders />}
                        />

                        <Route
                            path="/admin/returns"
                            element={<ManageReturns />}
                        />

                        <Route
                            path="/admin/auctions"
                            element={<ManageAuctions />}
                        />

                        <Route
                            path="/admin/support"
                            element={<SupportTickets />}
                        />
                    </Route>

                    <Route
                        path="/404"
                        element={<NotFound />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/404"
                                replace
                            />
                        }
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default App;