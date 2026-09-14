export const formatCurrency = (amount) => {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return "₹0";
    }

    return `₹${value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

export const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "-";
    }

    return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

export const formatDateTime = (date) => {
    if (!date) {
        return "-";
    }

    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "-";
    }

    return value.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const formatNumber = (number) => {
    const value = Number(number);

    if (Number.isNaN(value)) {
        return "0";
    }

    return value.toLocaleString("en-IN");
};

export const formatStatus = (status) => {
    if (!status) {
        return "-";
    }

    return String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
};

export const formatCondition = (condition) => {
    if (!condition) {
        return "-";
    }

    return String(condition)
        .charAt(0)
        .toUpperCase() +
        String(condition).slice(1);
};