# Duma Deer Processing System

A comprehensive deer processing management system built with Next.js, MongoDB, and Firebase. This application streamlines the deer processing workflow from customer check-in to order completion and payment tracking.

## 🦌 About

Duma Deer Processing is a full-stack web application designed for deer processing facilities to manage customer orders, track processing preferences, calculate pricing, and handle administrative tasks. The system provides an intuitive interface for customers to submit their processing preferences and an admin panel for staff to manage orders, print receipts, and export data.

## 🛠 Tech Stack

### Frontend

- **Next.js 13** - React framework with Pages Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management and validation
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching
- **React Hot Toast** - Toast notifications

### Backend

- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - Primary database with Mongoose ODM
- **Firebase Auth** - User authentication and authorization
- **Firebase Storage** - File storage for receipts and documents

### Additional Services

- **SendGrid** - Email service for notifications
- **Uppy** - File upload handling
- **FontAwesome Pro** - Icon library

## 📁 Project Structure

```
├── components/          # Reusable UI components
│   ├── layouts/        # Layout components
│   └── modals/         # Modal components
├── config/             # Application configuration
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
│   ├── types.ts        # TypeScript type definitions
│   ├── products.ts     # Product configurations
│   ├── priceCalculations.ts # Pricing logic
│   └── ...
├── models/             # MongoDB models
│   ├── Deer.ts         # Deer processing order model
│   ├── Profile.ts      # User profile model
│   └── EmailTemplate.ts # Email template model
├── pages/              # Next.js pages
│   ├── admin/          # Admin-only pages
│   ├── api/            # API routes
│   └── ...
├── providers/          # React context providers
├── public/             # Static assets
├── scripts/            # Utility scripts
└── styles/             # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Firebase project
- SendGrid account

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd duma-deer-processing
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # MongoDB
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # SendGrid Email Service
   SENDGRID_API=SG.your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your-from-email@domain.com
   SENDGRID_REPLY_TO_EMAIL=your-reply-to@domain.com

   # Firebase Server-side
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKey\n-----END PRIVATE KEY-----\n"

   # Firebase Client-side
   NEXT_PUBLIC_DOMAIN=https://your-domain.com
   NEXT_PUBLIC_FIREBASE_API_KEY=your_39_character_api_key
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   NEXT_PUBLIC_FIREBASE_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   ```

### Database Setup

1. **Create MongoDB Database**

   - Create a MongoDB Atlas cluster
   - Create a database for the application
   - Add your IP address to the whitelist

2. **Setup Email Templates**
   Use MongoDB Compass to import the following email templates to the `emailtemplates` collection:

   ```json
   [
     {
       "key": "resetPassword",
       "name": "Reset password",
       "description": "Sent to any admin or user when they request a password reset",
       "subject": "Reset your password for Duma Deer Processing",
       "body": "Hi #recipient_name#,\n\nFollow this link to reset your password.\n\n#reset_password_link#\n\nIf you did not ask to reset your password, you can ignore this email.\n\nThanks,\nThe Duma Deer Processing Team",
       "vars": ["recipientName", "resetPasswordLink"],
       "updatedAt": { "$date": "2023-07-18T20:28:24.229Z" }
     },
     {
       "key": "inviteEmail",
       "name": "Invite to set password",
       "description": "Sent to users when an admin adds them to the system",
       "subject": "Duma Deer Processing Invite",
       "body": "Hi #recipient_name#,\n\nYou have been invited to join Duma Deer Processing. Please click the link below to set your password.\n\n#set_password_link#\n\nIf you did not request this invite, please ignore this email.\n\nThanks,\nThe Duma Deer Processing Team",
       "vars": ["recipientName", "setPasswordLink"],
       "updatedAt": { "$date": "2023-07-18T20:28:51.349Z" }
     }
   ]
   ```

### Firebase Setup

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication with Email/Password provider
   - Enable Cloud Storage

2. **Get Firebase Credentials**
   - Go to Project Settings → Service Accounts
   - Generate a new private key (for server-side variables)
   - Go to Project Settings → General (for client-side variables)

### Create Admin User

```bash
npm run create-admin
```

Follow the prompts to create an admin user account.

### Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Features

### Customer Features

- **Multi-step Check-in Form**: Guided 7-step process for deer processing preferences
- **Processing Options**: Comprehensive options for:
  - Cape and hide processing
  - Meat cutting preferences (steaks, roasts, ground venison)
  - Specialty meats (bologna, sausages, jerky, snack sticks)
  - Custom notes for special requests
- **Price Calculation**: Real-time pricing based on selected options
- **Order Summary**: Review before submission
- **Receipt Generation**: Printable order confirmation

### Admin Features

- **Order Management**: View, edit, and update deer processing orders
- **Customer Database**: Search and manage customer information
- **Pricing Administration**: Configure product prices
- **User Management**: Add/remove admin users
- **Email Templates**: Customize automated email communications
- **Data Export**: Export order data to CSV format
- **Print Management**: Track which orders have been printed

### Authentication & Security

- Firebase Authentication with role-based access
- Admin-only protected routes
- Secure API endpoints with validation
- Custom user claims for authorization

## 💰 Pricing System

The application includes a sophisticated pricing calculation system (`lib/priceCalculations.ts`) that:

- Calculates total costs based on selected processing options
- Supports different pricing tiers for various meat products
- Handles special pricing for bulk orders
- Provides real-time price updates in the UI

## 📧 Email System

Automated email notifications using SendGrid:

- Password reset emails
- User invitation emails
- Order confirmation emails
- Customizable templates through admin panel

## 🗄️ Data Models

### Deer Processing Order

The main data model includes customer information, processing preferences, pricing, and order status tracking.

### User Profiles

Admin and customer user management with role-based permissions.

### Email Templates

Configurable email templates for automated communications.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run create-admin` - Create admin user

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

### File Naming Conventions

- Components: PascalCase (e.g., `CheckInForm.tsx`)
- Pages: kebab-case (e.g., `admin/deer-orders.tsx`)
- Utilities: camelCase (e.g., `priceCalculations.ts`)

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers (primary admin interface)
- Tablets (customer check-in)
- Mobile devices (basic functionality)

## 🚀 Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

See `vercel.json` for deployment configuration.

## 🔐 Security Considerations

- Environment variables for sensitive data
- Firebase security rules for data access
- Input validation with Zod schemas
- Secure API endpoints with authentication checks
- HTTPS-only in production

## 📚 Key Dependencies

- `next` - React framework
- `react-hook-form` - Form management
- `mongoose` - MongoDB ODM
- `firebase` - Authentication and storage
- `@sendgrid/mail` - Email service
- `zod` - Schema validation
- `tailwindcss` - CSS framework
- `@tanstack/react-query` - Data fetching

## 🤝 Contributing

1. Follow the established code style and patterns
2. Write tests for new functionality
3. Keep components under 200-300 lines
4. Use TypeScript for all new code
5. Follow the existing project structure

## 📄 License

This project is private and proprietary to Duma Deer Processing.

---

For questions or support, contact the development team.
