export const saveAuthData = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getUser = () => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
};

export const removeAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const isLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
};