import { useNavigate } from "react-router-dom";

const CategoryCard = ({ category }) => {
    const navigate = useNavigate();

    const categoryName =
        typeof category === "string"
            ? category
            : category?.name;

    const getCategoryIcon = (name) => {
        const categoryName = name?.toLowerCase().trim();

        if (categoryName === "electronics") {
            return "📺";
        }

        if (categoryName === "fashion") {
            return "👕";
        }

        if (
            categoryName === "home & living" ||
            categoryName === "home and living"
        ) {
            return "🛋️";
        }

        if (
            categoryName === "beauty & health" ||
            categoryName === "beauty and health"
        ) {
            return "💄";
        }

        if (
            categoryName === "sports & fitness" ||
            categoryName === "sports and fitness"
        ) {
            return "⚽";
        }

        return "🛍️";
    };

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
                {getCategoryIcon(categoryName)}
            </div>

            <h3>{categoryName}</h3>

            <p>Explore {categoryName}</p>
        </div>
    );
};

export default CategoryCard;