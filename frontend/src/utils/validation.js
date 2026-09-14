export const isRequired = (value) => {
    return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
    );
};

export const isValidEmail = (email) => {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
};

export const isValidMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;

    return mobileRegex.test(mobile);
};

export const isValidPassword = (password) => {
    return (
        typeof password === "string" &&
        password.length >= 6
    );
};

export const validateRegisterForm = (formData) => {
    const errors = {};

    if (!isRequired(formData.name)) {
        errors.name = "Name is required.";
    }

    if (!isRequired(formData.email)) {
        errors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!isRequired(formData.mobile)) {
        errors.mobile = "Mobile number is required.";
    } else if (!isValidMobile(formData.mobile)) {
        errors.mobile =
            "Mobile number must contain 10 digits.";
    }

    if (!isRequired(formData.password)) {
        errors.password = "Password is required.";
    } else if (!isValidPassword(formData.password)) {
        errors.password =
            "Password must be at least 6 characters.";
    }

    if (!isRequired(formData.role)) {
        errors.role = "Role is required.";
    }

    return errors;
};

export const validateLoginForm = (formData) => {
    const errors = {};

    if (!isRequired(formData.email)) {
        errors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
        errors.email = "Enter a valid email address.";
    }

    if (!isRequired(formData.password)) {
        errors.password = "Password is required.";
    }

    return errors;
};