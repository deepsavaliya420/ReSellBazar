import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const categoryName =
        typeof category === "string"
            ? category
            : category?.name;

    return (
        <div
            className="category-card"
            onClick={() =>
                navigate(
                    `/products?category=${encodeURIComponent(
                        categoryName
                    )}`
                )
            }
        >
            <div className="category-icon">
                🛍️
            </div>

            <div className="category-content">
                <h3>{categoryName}</h3>

                <p>
                    Explore {categoryName}
                </p>

                <span className="category-arrow">
                    →
                </span>
            </div>
        </div>
    );
};

export default CategoryCard;