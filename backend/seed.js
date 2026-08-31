require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const Address = require("./models/Address");
const Cart = require("./models/Cart");
const Wishlist = require("./models/Wishlist");
const Order = require("./models/Order");
const Auction = require("./models/Auction");
const Bid = require("./models/Bid");
const Review = require("./models/Review");
const Message = require("./models/Message");
const Notification = require("./models/Notification");
const Delivery = require("./models/Delivery");
const Payment = require("./models/Payment");
const Return = require("./models/Return");
const SupportTicket = require("./models/SupportTicket");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Product.deleteMany({}),
            Address.deleteMany({}),
            Cart.deleteMany({}),
            Wishlist.deleteMany({}),
            Order.deleteMany({}),
            Auction.deleteMany({}),
            Bid.deleteMany({}),
            Review.deleteMany({}),
            Message.deleteMany({}),
            Notification.deleteMany({}),
            Delivery.deleteMany({}),
            Payment.deleteMany({}),
            Return.deleteMany({}),
            SupportTicket.deleteMany({})
        ]);

        const password = await bcrypt.hash("12345678", 10);

        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@test.com",
                mobile: "9000000001",
                password,
                role: "admin",
                status: "active"
            },
            {
                name: "Seller One",
                email: "seller1@test.com",
                mobile: "9000000002",
                password,
                role: "seller",
                status: "active"
            },
            {
                name: "Seller Two",
                email: "seller2@test.com",
                mobile: "9000000003",
                password,
                role: "seller",
                status: "active"
            },
            {
                name: "Seller Three",
                email: "seller3@test.com",
                mobile: "9000000004",
                password,
                role: "seller",
                status: "active"
            },
            {
                name: "Seller Four",
                email: "seller4@test.com",
                mobile: "9000000005",
                password,
                role: "seller",
                status: "active"
            },
            {
                name: "Seller Five",
                email: "seller5@test.com",
                mobile: "9000000006",
                password,
                role: "seller",
                status: "active"
            },
            {
                name: "Buyer One",
                email: "buyer1@test.com",
                mobile: "9000000007",
                password,
                role: "buyer",
                status: "active"
            },
            {
                name: "Buyer Two",
                email: "buyer2@test.com",
                mobile: "9000000008",
                password,
                role: "buyer",
                status: "active"
            },
            {
                name: "Buyer Three",
                email: "buyer3@test.com",
                mobile: "9000000009",
                password,
                role: "buyer",
                status: "active"
            },
            {
                name: "Buyer Four",
                email: "buyer4@test.com",
                mobile: "9000000010",
                password,
                role: "buyer",
                status: "active"
            },
            {
                name: "Buyer Five",
                email: "buyer5@test.com",
                mobile: "9000000011",
                password,
                role: "buyer",
                status: "active"
            }
        ]);

        const admin = users[0];

        const sellers = users.filter(user => user.role === "seller");
        const buyers = users.filter(user => user.role === "buyer");

        const categories = await Category.insertMany([
            {
                name: "Electronics",
                description: "Electronic devices and accessories",
                status: "active"
            },
            {
                name: "Mobiles",
                description: "Smartphones and mobile accessories",
                status: "active"
            },
            {
                name: "Laptops",
                description: "Laptops and computer devices",
                status: "active"
            },
            {
                name: "Furniture",
                description: "Home and office furniture",
                status: "active"
            },
            {
                name: "Fashion",
                description: "Clothing and fashion products",
                status: "active"
            }
        ]);

        const products = await Product.insertMany([
            {
                seller: sellers[0]._id,
                name: "Samsung Galaxy S23",
                description: "Samsung smartphone in excellent condition",
                category: categories[1]._id,
                price: 45000,
                condition: "used",
                quantity: 3,
                images: ["samsung-s23.jpg"],
                status: "approved"
            },
            {
                seller: sellers[1]._id,
                name: "Dell Inspiron Laptop",
                description: "Dell laptop suitable for students and office work",
                category: categories[2]._id,
                price: 55000,
                condition: "new",
                quantity: 4,
                images: ["dell-inspiron.jpg"],
                status: "approved"
            },
            {
                seller: sellers[2]._id,
                name: "Sony Wireless Headphones",
                description: "Wireless noise cancelling headphones",
                category: categories[0]._id,
                price: 8500,
                condition: "new",
                quantity: 10,
                images: ["sony-headphones.jpg"],
                status: "approved"
            },
            {
                seller: sellers[3]._id,
                name: "Office Study Table",
                description: "Wooden study table for home and office",
                category: categories[3]._id,
                price: 7000,
                condition: "used",
                quantity: 2,
                images: ["study-table.jpg"],
                status: "approved"
            },
            {
                seller: sellers[4]._id,
                name: "Nike Sports Shoes",
                description: "Comfortable sports shoes for daily use",
                category: categories[4]._id,
                price: 5000,
                condition: "new",
                quantity: 6,
                images: ["nike-shoes.jpg"],
                status: "approved"
            }
        ]);

        const addresses = await Address.insertMany([
            {
                user: buyers[0]._id,
                fullName: "Buyer One",
                mobile: "9000000007",
                addressLine: "101 Main Road",
                city: "Ahmedabad",
                state: "Gujarat",
                pincode: "380001",
                country: "India",
                isDefault: true
            },
            {
                user: buyers[1]._id,
                fullName: "Buyer Two",
                mobile: "9000000008",
                addressLine: "202 Ring Road",
                city: "Surat",
                state: "Gujarat",
                pincode: "395001",
                country: "India",
                isDefault: true
            },
            {
                user: buyers[2]._id,
                fullName: "Buyer Three",
                mobile: "9000000009",
                addressLine: "303 Station Road",
                city: "Vadodara",
                state: "Gujarat",
                pincode: "390001",
                country: "India",
                isDefault: true
            },
            {
                user: buyers[3]._id,
                fullName: "Buyer Four",
                mobile: "9000000010",
                addressLine: "404 College Road",
                city: "Rajkot",
                state: "Gujarat",
                pincode: "360001",
                country: "India",
                isDefault: true
            },
            {
                user: buyers[4]._id,
                fullName: "Buyer Five",
                mobile: "9000000011",
                addressLine: "505 Market Road",
                city: "Bhavnagar",
                state: "Gujarat",
                pincode: "364001",
                country: "India",
                isDefault: true
            }
        ]);

        const carts = await Cart.insertMany([
            {
                buyer: buyers[0]._id,
                items: [
                    {
                        product: products[0]._id,
                        quantity: 1
                    },
                    {
                        product: products[2]._id,
                        quantity: 2
                    }
                ]
            },
            {
                buyer: buyers[1]._id,
                items: [
                    {
                        product: products[1]._id,
                        quantity: 1
                    }
                ]
            },
            {
                buyer: buyers[2]._id,
                items: [
                    {
                        product: products[3]._id,
                        quantity: 1
                    }
                ]
            },
            {
                buyer: buyers[3]._id,
                items: [
                    {
                        product: products[4]._id,
                        quantity: 2
                    }
                ]
            },
            {
                buyer: buyers[4]._id,
                items: [
                    {
                        product: products[0]._id,
                        quantity: 1
                    }
                ]
            }
        ]);

        const wishlists = await Wishlist.insertMany([
            {
                buyer: buyers[0]._id,
                products: [products[1]._id, products[2]._id]
            },
            {
                buyer: buyers[1]._id,
                products: [products[0]._id]
            },
            {
                buyer: buyers[2]._id,
                products: [products[4]._id]
            },
            {
                buyer: buyers[3]._id,
                products: [products[3]._id, products[0]._id]
            },
            {
                buyer: buyers[4]._id,
                products: [products[2]._id]
            }
        ]);

        const orders = await Order.insertMany([
            {
                buyer: buyers[0]._id,
                items: [
                    {
                        product: products[0]._id,
                        seller: sellers[0]._id,
                        quantity: 1,
                        price: 45000
                    }
                ],
                address: addresses[0]._id,
                totalAmount: 45000,
                paymentMethod: "cod",
                paymentStatus: "pending",
                orderStatus: "placed"
            },
            {
                buyer: buyers[1]._id,
                items: [
                    {
                        product: products[1]._id,
                        seller: sellers[1]._id,
                        quantity: 1,
                        price: 55000
                    }
                ],
                address: addresses[1]._id,
                totalAmount: 55000,
                paymentMethod: "online",
                paymentStatus: "paid",
                orderStatus: "confirmed"
            },
            {
                buyer: buyers[2]._id,
                items: [
                    {
                        product: products[2]._id,
                        seller: sellers[2]._id,
                        quantity: 2,
                        price: 8500
                    }
                ],
                address: addresses[2]._id,
                totalAmount: 17000,
                paymentMethod: "online",
                paymentStatus: "paid",
                orderStatus: "shipped"
            },
            {
                buyer: buyers[3]._id,
                items: [
                    {
                        product: products[3]._id,
                        seller: sellers[3]._id,
                        quantity: 1,
                        price: 7000
                    }
                ],
                address: addresses[3]._id,
                totalAmount: 7000,
                paymentMethod: "cod",
                paymentStatus: "pending",
                orderStatus: "delivered"
            },
            {
                buyer: buyers[4]._id,
                items: [
                    {
                        product: products[4]._id,
                        seller: sellers[4]._id,
                        quantity: 1,
                        price: 5000
                    }
                ],
                address: addresses[4]._id,
                totalAmount: 5000,
                paymentMethod: "online",
                paymentStatus: "paid",
                orderStatus: "delivered"
            }
        ]);

        const now = new Date();

        const auctions = await Auction.insertMany([
            {
                seller: sellers[0]._id,
                product: products[0]._id,
                startingPrice: 40000,
                currentPrice: 45000,
                startTime: new Date(now.getTime() - 86400000),
                endTime: new Date(now.getTime() + 86400000 * 2),
                status: "active",
                winner: null
            },
            {
                seller: sellers[1]._id,
                product: products[1]._id,
                startingPrice: 50000,
                currentPrice: 52000,
                startTime: new Date(now.getTime() - 86400000),
                endTime: new Date(now.getTime() + 86400000),
                status: "active",
                winner: null
            },
            {
                seller: sellers[2]._id,
                product: products[2]._id,
                startingPrice: 7000,
                currentPrice: 8000,
                startTime: new Date(now.getTime() + 86400000),
                endTime: new Date(now.getTime() + 86400000 * 3),
                status: "upcoming",
                winner: null
            },
            {
                seller: sellers[3]._id,
                product: products[3]._id,
                startingPrice: 6000,
                currentPrice: 6500,
                startTime: new Date(now.getTime() - 86400000 * 3),
                endTime: new Date(now.getTime() - 86400000),
                status: "ended",
                winner: buyers[2]._id
            },
            {
                seller: sellers[4]._id,
                product: products[4]._id,
                startingPrice: 4500,
                currentPrice: 4800,
                startTime: new Date(now.getTime() + 86400000 * 2),
                endTime: new Date(now.getTime() + 86400000 * 5),
                status: "upcoming",
                winner: null
            }
        ]);

        const bids = await Bid.insertMany([
            {
                auction: auctions[0]._id,
                buyer: buyers[0]._id,
                amount: 42000
            },
            {
                auction: auctions[0]._id,
                buyer: buyers[1]._id,
                amount: 45000
            },
            {
                auction: auctions[1]._id,
                buyer: buyers[2]._id,
                amount: 51000
            },
            {
                auction: auctions[1]._id,
                buyer: buyers[3]._id,
                amount: 52000
            },
            {
                auction: auctions[3]._id,
                buyer: buyers[2]._id,
                amount: 6500
            }
        ]);

        const reviews = await Review.insertMany([
            {
                product: products[0]._id,
                buyer: buyers[0]._id,
                seller: sellers[0]._id,
                rating: 5,
                comment: "Excellent product and fast delivery"
            },
            {
                product: products[1]._id,
                buyer: buyers[1]._id,
                seller: sellers[1]._id,
                rating: 4,
                comment: "Good laptop and good seller"
            },
            {
                product: products[2]._id,
                buyer: buyers[2]._id,
                seller: sellers[2]._id,
                rating: 5,
                comment: "Very good headphones"
            },
            {
                product: products[3]._id,
                buyer: buyers[3]._id,
                seller: sellers[3]._id,
                rating: 4,
                comment: "Good table for study"
            },
            {
                product: products[4]._id,
                buyer: buyers[4]._id,
                seller: sellers[4]._id,
                rating: 5,
                comment: "Comfortable shoes"
            }
        ]);

        const messages = await Message.insertMany([
            {
                sender: buyers[0]._id,
                receiver: sellers[0]._id,
                message: "Is the Samsung phone still available?",
                read: false
            },
            {
                sender: sellers[1]._id,
                receiver: buyers[1]._id,
                message: "Your laptop order has been confirmed.",
                read: true
            },
            {
                sender: buyers[2]._id,
                receiver: sellers[2]._id,
                message: "Can you provide more details about the headphones?",
                read: false
            },
            {
                sender: sellers[3]._id,
                receiver: buyers[3]._id,
                message: "Your table has been delivered.",
                read: true
            },
            {
                sender: buyers[4]._id,
                receiver: sellers[4]._id,
                message: "Are these shoes available in size 9?",
                read: false
            }
        ]);

        const notifications = await Notification.insertMany([
            {
                user: buyers[0]._id,
                title: "Order Placed",
                message: "Your order has been placed successfully.",
                type: "order",
                read: false
            },
            {
                user: buyers[1]._id,
                title: "Payment Successful",
                message: "Your online payment was successful.",
                type: "payment",
                read: true
            },
            {
                user: sellers[2]._id,
                title: "New Order",
                message: "You received a new order.",
                type: "order",
                read: false
            },
            {
                user: sellers[3]._id,
                title: "Product Review",
                message: "A buyer reviewed your product.",
                type: "review",
                read: false
            },
            {
                user: admin._id,
                title: "New User",
                message: "A new buyer registered on ReSellBazar.",
                type: "user",
                read: true
            }
        ]);

        const deliveries = await Delivery.insertMany([
            {
                order: orders[0]._id,
                trackingNumber: "RSB100001",
                courier: "BlueDart",
                status: "processing",
                estimatedDate: new Date(now.getTime() + 86400000 * 4)
            },
            {
                order: orders[1]._id,
                trackingNumber: "RSB100002",
                courier: "Delhivery",
                status: "shipped",
                estimatedDate: new Date(now.getTime() + 86400000 * 2)
            },
            {
                order: orders[2]._id,
                trackingNumber: "RSB100003",
                courier: "DTDC",
                status: "out_for_delivery",
                estimatedDate: new Date(now.getTime())
            },
            {
                order: orders[3]._id,
                trackingNumber: "RSB100004",
                courier: "BlueDart",
                status: "delivered",
                estimatedDate: new Date(now.getTime() - 86400000)
            },
            {
                order: orders[4]._id,
                trackingNumber: "RSB100005",
                courier: "Delhivery",
                status: "delivered",
                estimatedDate: new Date(now.getTime() - 86400000 * 2)
            }
        ]);

        const payments = await Payment.insertMany([
            {
                order: orders[0]._id,
                buyer: buyers[0]._id,
                amount: 45000,
                method: "cod",
                transactionId: "COD-100001",
                status: "pending"
            },
            {
                order: orders[1]._id,
                buyer: buyers[1]._id,
                amount: 55000,
                method: "online",
                transactionId: "TXN-100002",
                status: "success"
            },
            {
                order: orders[2]._id,
                buyer: buyers[2]._id,
                amount: 17000,
                method: "online",
                transactionId: "TXN-100003",
                status: "success"
            },
            {
                order: orders[3]._id,
                buyer: buyers[3]._id,
                amount: 7000,
                method: "cod",
                transactionId: "COD-100004",
                status: "pending"
            },
            {
                order: orders[4]._id,
                buyer: buyers[4]._id,
                amount: 5000,
                method: "online",
                transactionId: "TXN-100005",
                status: "success"
            }
        ]);

        const returns = await Return.insertMany([
            {
                order: orders[0]._id,
                buyer: buyers[0]._id,
                reason: "Product does not meet expectations",
                status: "requested"
            },
            {
                order: orders[1]._id,
                buyer: buyers[1]._id,
                reason: "Received damaged packaging",
                status: "approved"
            },
            {
                order: orders[2]._id,
                buyer: buyers[2]._id,
                reason: "Wrong product received",
                status: "rejected"
            },
            {
                order: orders[3]._id,
                buyer: buyers[3]._id,
                reason: "Changed my mind",
                status: "completed"
            },
            {
                order: orders[4]._id,
                buyer: buyers[4]._id,
                reason: "Size issue",
                status: "requested"
            }
        ]);

        const supportTickets = await SupportTicket.insertMany([
            {
                user: buyers[0]._id,
                subject: "Payment issue",
                message: "I have a question about my payment.",
                status: "open"
            },
            {
                user: buyers[1]._id,
                subject: "Order tracking",
                message: "My order tracking is not updating.",
                status: "in_progress"
            },
            {
                user: buyers[2]._id,
                subject: "Product issue",
                message: "I received the wrong product.",
                status: "resolved"
            },
            {
                user: buyers[3]._id,
                subject: "Return request",
                message: "I want to return my product.",
                status: "closed"
            },
            {
                user: sellers[0]._id,
                subject: "Seller account",
                message: "I need help with my seller account.",
                status: "open"
            }
        ]);

        console.log("");
        console.log("=================================");
        console.log("DATABASE SEEDED SUCCESSFULLY");
        console.log("=================================");
        console.log("Users:", users.length);
        console.log("Categories:", categories.length);
        console.log("Products:", products.length);
        console.log("Addresses:", addresses.length);
        console.log("Carts:", carts.length);
        console.log("Wishlists:", wishlists.length);
        console.log("Orders:", orders.length);
        console.log("Auctions:", auctions.length);
        console.log("Bids:", bids.length);
        console.log("Reviews:", reviews.length);
        console.log("Messages:", messages.length);
        console.log("Notifications:", notifications.length);
        console.log("Deliveries:", deliveries.length);
        console.log("Payments:", payments.length);
        console.log("Returns:", returns.length);
        console.log("Support Tickets:", supportTickets.length);
        console.log("");
        console.log("Login password for all test users: 12345678");
        console.log("");
        console.log("Admin: admin@test.com");
        console.log("Seller: seller1@test.com");
        console.log("Buyer: buyer1@test.com");
        console.log("");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("SEED ERROR:");
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();