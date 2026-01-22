# Expense Tracker

A full-stack web application for managing shared expenses within groups. Track who paid what, manage group expenses, and settle debts easily.

##  Features

- **User Authentication** - Secure login and signup system
- **Group Management** - Create and manage expense groups with multiple members
- **Expense Tracking** - Add, view, and manage expenses within groups
- **Dashboard** - Get an overview of your finances and groups
- **Balance Management** - Track balances and see who owes whom
- **Responsive Design** - Mobile-friendly interface for all devices
- **Expandable UI** - Interactive components that expand/collapse for better UX

##  Project Structure

```
expense-tracker/
 Frontend/              # React + Vite frontend
    src/
       componets/    # React components
          addExpenses.jsx
          balance.jsx
          createGroup.jsx
          dashboard.jsx
          groupDetails.jsx
          loginPage.jsx
          signUp.jsx
       App.jsx
       main.jsx
       index.css
    package.json
    vite.config.js
    tailwind.config.js

 BackEnd/              # Node.js + Express backend
     controllers/      # Route controllers
     middlewares/      # Authentication & validation middleware
     Models/          # MongoDB schemas
     routes/          # API routes
     config/          # Database configuration
     utils/           # Utility functions
     server.js
     package.json
```

##  Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd expense-tracker
```

2. **Setup Backend**
```bash
cd BackEnd
npm install
```

3. **Setup Frontend**
```bash
cd ../Frontend
npm install
```

### Configuration

#### Backend (.env)
Create a .env file in the BackEnd folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key
```

##  Running the Application

### Start Backend
```bash
cd BackEnd
npm start
# or for development with auto-reload
npx nodemon
```

### Start Frontend
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port)

##  Dependencies

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client (for API calls)

### Backend
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemon** - Auto-reload during development

##  API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Groups
- `POST /api/groups` - Create new group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group

### Expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/group/:groupId` - Get expenses for a group
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

##  UI Components

### Responsive Features
- Mobile-first design with Tailwind CSS breakpoints
- Expandable/collapsible sections for better mobile UX
- Centered layouts with proper padding and spacing
- Touch-friendly interface elements

### Key Components
- **LoginPage** - User authentication
- **SignUp** - New user registration
- **Dashboard** - Main application dashboard
- **CreateGroup** - Group creation interface
- **GroupDetails** - Detailed group view with expandable sections
- **AddExpenses** - Expense entry form
- **Balance** - Balance and settlement view

##  Authentication

The application uses JWT (JSON Web Tokens) for secure authentication:
- Passwords are hashed using bcrypt
- Protected routes require valid JWT token
- Tokens are stored in browser storage

##  Database Schema

### User Model
- Email, password, name, profile info

### Group Model
- Name, description, members, creation date

### Expense Model
- Title, amount, paidBy, splitBetween, group reference, date

##  Development

### Available Scripts

Frontend:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

Backend:
```bash
npm start        # Start server
npm run dev      # Start with nodemon
```

##  Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

##  License

This project is open source and available under the MIT License.

##  Support

For issues or questions, please create an issue in the repository.
