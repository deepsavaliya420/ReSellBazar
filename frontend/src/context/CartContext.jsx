import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
} from "../services/cartApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadCart = async () => {
        if (!user || user.role !== "buyer") {
            setCart(null);
            return;
        }

        try {
            setLoading(true);

            const data = await getCart();

            setCart(
                data.cart || data
            );
        } catch (error) {
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [user]);

    const addProduct = async (
        productId,
        quantity = 1
    ) => {
        const data = await addToCart(
            productId,
            quantity
        );

        setCart(
            data.cart || data
        );

        return data;
    };

    const removeProduct = async (
        productId
    ) => {
        const data =
            await removeFromCart(productId);

        setCart(
            data.cart || data
        );

        return data;
    };

    const emptyCart = async () => {
        const data = await clearCart();

        setCart(
            data.cart || data
        );

        return data;
    };

    const cartItems =
        cart?.items ||
        cart?.products ||
        [];

    const itemCount = cartItems.reduce(
        (total, item) =>
            total +
            Number(
                item.quantity || 1
            ),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                cartItems,
                itemCount,
                loadCart,
                addProduct,
                removeProduct,
                emptyCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};