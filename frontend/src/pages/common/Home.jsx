

function App() {
    const categories = [
        "Electronics",
        "Fashion",
        "Books",
        "Furniture",
        "Vehicles",
        "Sports"
    ];

    const products = [
        {
            name: "iPhone 14",
            price: "₹45,000",
            condition: "Used",
            category: "Electronics"
        },
        {
            name: "Gaming Laptop",
            price: "₹65,000",
            condition: "Like New",
            category: "Electronics"
        },
        {
            name: "Mountain Bike",
            price: "₹18,500",
            condition: "Used",
            category: "Sports"
        },
        {
            name: "Study Table",
            price: "₹4,500",
            condition: "Good",
            category: "Furniture"
        }
    ];

    return (
        <div className="app">

            <nav className="navbar">
                <div className="logo">
                    ReSell<span>Bazar</span>
                </div>

                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
                    />
                    <button>Search</button>
                </div>

                <div className="nav-actions">
                    <button className="login-btn">Login</button>
                    <button className="register-btn">Register</button>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1>Buy. Sell. Auction.</h1>

                    <p>
                        Your trusted marketplace for new,
                        used and auction products.
                    </p>

                    <div className="hero-buttons">
                        <button className="primary-btn">
                            Shop Now
                        </button>

                        <button className="secondary-btn">
                            Sell Your Product
                        </button>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="section-header">
                    <h2>Browse Categories</h2>
                    <button>View All</button>
                </div>

                <div className="categories">
                    {categories.map((category) => (
                        <div className="category-card" key={category}>
                            <div className="category-icon">
                                🛍️
                            </div>

                            <h3>{category}</h3>

                            <p>Explore {category}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section products-section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <button>View All</button>
                </div>

                <div className="products">
                    {products.map((product) => (
                        <div className="product-card" key={product.name}>

                            <div className="product-image">
                                📦
                            </div>

                            <div className="product-info">

                                <span className="condition">
                                    {product.condition}
                                </span>

                                <h3>{product.name}</h3>

                                <p className="category">
                                    {product.category}
                                </p>

                                <div className="product-bottom">
                                    <strong>{product.price}</strong>

                                    <button>
                                        View
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="auction-section">
                <div>
                    <h2>Discover Amazing Auctions</h2>

                    <p>
                        Bid on unique products and get the best deals.
                    </p>

                    <button className="primary-btn">
                        Explore Auctions
                    </button>
                </div>

                <div className="auction-icon">
                    🔨
                </div>
            </section>

            <footer>
                <div className="footer-content">

                    <div>
                        <h2>
                            ReSell<span>Bazar</span>
                        </h2>

                        <p>
                            Buy, sell and auction products
                            in one marketplace.
                        </p>
                    </div>

                    <div>
                        <h3>Quick Links</h3>
                        <p>Home</p>
                        <p>Products</p>
                        <p>Categories</p>
                        <p>Auctions</p>
                    </div>

                    <div>
                        <h3>Account</h3>
                        <p>Login</p>
                        <p>Register</p>
                        <p>My Orders</p>
                        <p>Wishlist</p>
                    </div>

                </div>

                <div className="copyright">
                    © 2026 ReSellBazar. All rights reserved.
                </div>
            </footer>

        </div>
    );
}

export default App;