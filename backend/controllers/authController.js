const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password, role } = req.body;

        if (!name || !email || !mobile || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { mobile: mobile }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or mobile already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role: role || "buyer"
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
    {
        id: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.status(200).json({
    message: "Login successful",
    token: token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
    }
});
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};