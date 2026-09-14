import { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <form
            className="search-bar"
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                value={value}
                onChange={(e) =>
                    setValue(e.target.value)
                }
                placeholder="Search products..."
            />

            <button type="submit">
                Search
            </button>
        </form>
    );
};

export default SearchBar;