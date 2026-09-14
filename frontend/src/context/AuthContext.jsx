import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    registerUser,
    loginUser,
    getProfile
} from "../services/authApi";

import {
    saveAuthData,
    getToken,
    getUser,
    removeAuthData
} from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            const token = getToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getProfile();

                const loggedInUser =
                    data.user || data;

                setUser(loggedInUser);

                localStorage.setItem(
                    "user",
                    JSON.stringify(loggedInUser)
                );
            } catch (error) {
                removeAuthData();
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    const register = async (userData) => {
        const data = await registerUser(userData);

        if (data.token && data.user) {
            saveAuthData(
                data.token,
                data.user
            );

            setUser(data.user);
        }

        return data;
    };

    const login = async (userData) => {
        const data = await loginUser(userData);

        if (data.token && data.user) {
            saveAuthData(
                data.token,
                data.user
            );

            setUser(data.user);
        }

        return data;
    };

    const logout = () => {
        removeAuthData();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                register,
                login,
                logout,
                isAuthenticated: Boolean(user)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};