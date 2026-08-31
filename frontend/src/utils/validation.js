export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateRequired = (value) => {
    return value !== undefined && value !== null && value.trim() !== "";
};