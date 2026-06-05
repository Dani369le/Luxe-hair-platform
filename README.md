# Luxe-hair-platform

Premium human hair ecommerce platform with admin dashboard.

## Features

### Customer Features
- User authentication and profile management
- Browse and search hair products by category
- Shopping cart and order management
- Order tracking and history
- Product reviews and ratings
- Secure payment processing

### Admin Features
- Dashboard with sales analytics
- Product inventory management
- Order management and fulfillment
- User management
- Sales reports and metrics
- Admin role assignment

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Stripe** - Payment processing

### Frontend (To be implemented)
- **React** - UI library
- **Redux** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Project Structure

```
luxe-hair-platform/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── models/
│   │   ├── User.js              # User model with password hashing
│   │   ├── Product.js           # Product catalog model
│   │   └── Order.js             # Order and transaction model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── productRoutes.js     # Product CRUD endpoints
│   │   ├── orderRoutes.js       # Order management endpoints
│   │   ├── userRoutes.js        # User profile endpoints
│   │   └── adminRoutes.js       # Admin dashboard endpoints
│   ├── index.js                 # Server entry point
│   ├── .env                     # Environment variables (git ignored)
│   └── .env.example             # Environment variables template
├── client/                       # React frontend (TBD)
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dani369le/Luxe-hair-platform.git
   cd Luxe-hair-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Update `MONGODB_URI` in .env

5. **Run the server**
   ```bash
   npm run dev    # With nodemon for development
   # OR
   npm start      # Production mode
   ```

Server runs on `http://localhost:5000` (or your configured PORT)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user (requires token)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status (admin only)

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Admin Dashboard
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders with filters
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/reports/sales` - Sales reports

## Authentication

Authentication uses JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/luxe-hair-platform
JWT_SECRET=your_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Database Models

### User
- firstName, lastName, email (unique), password (hashed)
- phone, address (street, city, state, zipCode, country)
- role (customer/admin), isVerified
- Timestamps (createdAt, updatedAt)

### Product
- name, description, price, discountPrice
- stock, images array, category
- tags, rating, reviews array
- featured flag
- Timestamps (createdAt, updatedAt)

### Order
- userId (reference to User)
- items array (productId, name, price, quantity)
- totalAmount, taxAmount, shippingCost
- paymentStatus, orderStatus
- shippingAddress, billingAddress
- trackingNumber
- Timestamps (createdAt, updatedAt)

## Functions and Methods

### User Model
- `comparePassword()` - Compare hashed password with input

### Product Model
- `calculateAverageRating()` - Get average rating from reviews

### Order Model
- `calculateSubtotal()` - Calculate order subtotal

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For support, email support@luxehair.com or open an issue on GitHub.

## Roadmap

- [ ] Frontend React application
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] SMS order updates
- [ ] Inventory management system
- [ ] Customer analytics
- [ ] Review and rating system enhancements
- [ ] Wishlist feature
- [ ] Coupon/discount system
- [ ] Shipping integration (FedEx, UPS)
