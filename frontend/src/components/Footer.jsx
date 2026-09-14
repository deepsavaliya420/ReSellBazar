const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <h3>ReSellBazar</h3>

                <p>
                    A marketplace for buying,
                    selling and auctioning products.
                </p>

                <p>
                    © {new Date().getFullYear()} ReSellBazar.
                    All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;