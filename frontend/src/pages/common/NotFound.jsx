import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const NotFound = () => {
    return (
        <>
            <Navbar />

            <div className="not-found">

                <h1>404</h1>

                <h2>
                    Page Not Found
                </h2>

                <p>
                    The page you are looking for
                    does not exist.
                </p>

                <Link
                    to="/"
                    className="primary-btn"
                >
                    Go Home
                </Link>

            </div>

            <Footer />
        </>
    );
};

export default NotFound;