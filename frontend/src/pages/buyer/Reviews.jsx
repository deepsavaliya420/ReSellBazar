import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import {
    getProductReviews,
    createReview
} from "../../services/reviewApi";

const Reviews = () => {
    const { id } = useParams();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProductReviews(id);

            setReviews(
                Array.isArray(data)
                    ? data
                    : data.reviews || []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load reviews."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadReviews();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim()) {
            setError("Please enter a comment.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            setMessage("");

            await createReview({
                product: id,
                rating,
                comment
            });

            setComment("");
            setRating(5);
            setMessage("Review added successfully.");

            await loadReviews();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add review."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="page-container">
                <div className="page-header">
                    <h1>Product Reviews</h1>
                    <p>
                        Read reviews and share your experience.
                    </p>
                </div>

                <ErrorMessage message={error} />

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                <div className="review-form">
                    <h2>Write a Review</h2>

                    <form onSubmit={handleSubmit}>
                        <label>Rating</label>

                        <select
                            value={rating}
                            onChange={(e) =>
                                setRating(Number(e.target.value))
                            }
                        >
                            <option value={5}>5 - Excellent</option>
                            <option value={4}>4 - Good</option>
                            <option value={3}>3 - Average</option>
                            <option value={2}>2 - Poor</option>
                            <option value={1}>1 - Very Poor</option>
                        </select>

                        <label>Comment</label>

                        <textarea
                            value={comment}
                            onChange={(e) =>
                                setComment(e.target.value)
                            }
                            placeholder="Write your review..."
                            rows="4"
                        />

                        <button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </form>
                </div>

                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {reviews.length === 0 ? (
                        <div className="empty-state">
                            <p>No reviews yet.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div
                                className="review-card"
                                key={review._id}
                            >
                                <h3>
                                    {review.buyer?.name ||
                                        "Customer"}
                                </h3>

                                <p>
                                    <strong>
                                        Rating:
                                    </strong>{" "}
                                    {review.rating}/5
                                </p>

                                <p>
                                    {review.comment}
                                </p>

                                {review.createdAt && (
                                    <small>
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString(
                                            "en-IN"
                                        )}
                                    </small>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Reviews;