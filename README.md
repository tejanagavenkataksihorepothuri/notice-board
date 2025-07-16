# College Notice Board - MERN Stack Application

A comprehensive web application for managing and displaying college notices with admin authentication, image uploads, and responsive design.

## 🚀 Features

### Admin Features
- **Secure Authentication**: JWT-based login system
- **Notice Management**: Create, edit, delete notices
- **Image Uploads**: Support for local and cloud storage (AWS S3)
- **Rich Content**: Full description support with detailed notice views
- **Audience Targeting**: Target specific departments or groups
- **Priority Settings**: Set notice importance levels
- **Expiry Management**: Automatic handling of expired notices
- **Dashboard Analytics**: Overview of notice statistics

### Public Features
- **Public Access**: View notices without login
- **Detailed Views**: Click on notice cards to see full details
- **Advanced Filtering**: Filter by audience, priority, search terms
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Theme**: Toggle between themes
- **Pagination**: Efficient notice browsing
- **Bookmark & Share**: Save and share notices

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **multer** for file uploads
- **AWS S3** for cloud storage (optional)

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hook Form** for forms
- **date-fns** for date formatting
- **Lucide React** for icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd "notice board/backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/college_notice_board
   JWT_SECRET=your_very_long_and_random_secret_key
   PORT=5000
   USE_CLOUD_STORAGE=false
   ```

4. **Setup Database**
   ```bash
   node scripts/setup.js
   ```

5. **Add Sample Data** (optional)
   ```bash
   node scripts/seedNotices.js
   ```

6. **Start Backend Server**
   ```bash
   npm start
   ```
   Server runs on: http://localhost:5000

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd "notice board/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   Application runs on: http://localhost:3000

## 🔧 Configuration

### Cloud Storage (AWS S3)

To enable cloud image storage:

1. Set up AWS S3 bucket
2. Update `.env` file:
   ```env
   USE_CLOUD_STORAGE=true
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your-bucket-name
   ```

### Default Admin Credentials
- **Email**: admin@college.edu
- **Password**: admin123

⚠️ **Important**: Change these credentials in production!

## 📱 Usage

### Public Users
1. Visit http://localhost:3000
2. Browse notices without login
3. Use filters to find specific notices
4. Click on notice cards for detailed view
5. Bookmark and share notices

### Admin Users
1. Login at http://localhost:3000/admin/login
2. Access admin dashboard
3. Create, edit, and delete notices
4. Upload images for notices
5. Set target audience and priority
6. Monitor notice statistics

## 🗂️ Project Structure

```
notice board/
├── backend/
│   ├── config/
│   │   └── cloudStorage.js      # S3 configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── models/
│   │   ├── Admin.js             # Admin user model
│   │   └── Notice.js            # Notice model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   └── notices.js           # Notice CRUD routes
│   ├── scripts/
│   │   ├── setup.js             # Database setup
│   │   └── seedNotices.js       # Sample data
│   ├── uploads/                 # Local file storage
│   ├── server.js                # Main server file
│   └── .env.example             # Environment template
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/          # Reusable components
    │   ├── context/             # React contexts
    │   ├── pages/               # Main pages
    │   ├── types/               # TypeScript types
    │   ├── utils/               # Helper functions
    │   └── App.tsx              # Main app component
    ├── tailwind.config.js       # Tailwind configuration
    └── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Notices
- `GET /api/notices` - Get all active notices (public)
- `GET /api/notices/:id` - Get single notice (public)
- `POST /api/notices` - Create notice (admin)
- `PUT /api/notices/:id` - Update notice (admin)
- `DELETE /api/notices/:id` - Delete notice (admin)
- `GET /api/notices/admin` - Get all notices for admin
- `GET /api/notices/stats/overview` - Get notice statistics

## 🎨 Key Features Implemented

### Enhanced Notice Display
- **Card View**: Attractive notice cards with image previews
- **Detailed View**: Full-page notice details with complete description
- **Click Navigation**: Click any notice card to view full details
- **Image Handling**: Proper image display with fallback handling

### Cloud Storage Integration
- **AWS S3 Support**: Automatic cloud storage for images
- **Fallback Storage**: Local storage when cloud is not configured
- **Image Management**: Automatic cleanup when notices are deleted

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Modern UI**: Clean, professional interface
- **Dark Mode**: Theme switching capability
- **Interactive Elements**: Hover effects and smooth transitions

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This application is designed for educational and institutional use. Ensure proper security measures are implemented before production deployment. - MERN Stack Application

A comprehensive web application for managing college notices with admin authentication and public viewing capabilities.

## 🚀 Features

### 🔐 Admin Panel
- **Secure Authentication**: JWT-based login with bcrypt password hashing
- **Notice Management**: Create, edit, and delete notices
- **Rich Content**: Support for images, target audience, priority levels, and tags
- **Dashboard**: Overview statistics and quick actions
- **Filter & Search**: Advanced filtering and search capabilities

### 👥 Public Interface
- **Public Access**: View notices without authentication
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Smart Filtering**: Filter by audience, search by keywords
- **Auto-expiry**: Notices automatically hide after expiry date
- **Dark Mode**: Toggle between light and dark themes

## 🛠 Tech Stack

### Backend
- **Node.js & Express.js**: Server framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT & bcrypt**: Authentication and security
- **Multer**: File upload handling
- **Express-validator**: Input validation

### Frontend
- **React 18 & TypeScript**: UI framework with type safety
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form management
- **Axios**: HTTP client
- **Date-fns**: Date formatting utilities

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, backend, and frontend)
npm run install:all
```

### 2. Environment Setup

#### Backend Environment (.env in backend folder)
```env
MONGODB_URI=mongodb://localhost:27017/notice-board
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

#### Frontend Environment (.env in frontend folder)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Create initial admin user
cd backend
npm run setup
```

**Default Admin Credentials:**
- Email: `admin@college.edu`
- Password: `admin123`

*⚠️ Please change these credentials after first login!*

### 4. Start the Application

```bash
# Start both backend and frontend concurrently
npm run dev
```

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Login**: http://localhost:3000/admin/login
notice-board/
├── backend/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # Image uploads
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   └── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notice-board
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file and configure:
   # MONGODB_URI=mongodb://localhost:27017/notice-board
   # JWT_SECRET=your-super-secret-jwt-key
   # PORT=5000
   
   # Start the backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the React development server
   npm start
   ```

4. **Create Admin Account**
   
   The first admin can be created by making a POST request to `/api/auth/register`:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \\
     -H "Content-Type: application/json" \\
     -d '{
       "email": "admin@college.edu",
       "password": "admin123",
       "name": "Administrator"
     }'
   ```

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/notice-board
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Usage

### Public Users
1. Visit the application homepage
2. Browse notices without login
3. Use filters to find specific notices
4. Toggle dark mode for better viewing

### Administrators
1. Navigate to `/admin/login`
2. Login with admin credentials
3. Access the dashboard to:
   - View statistics
   - Create new notices
   - Manage existing notices
   - Upload images
   - Set expiry dates and priorities

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: System preference detection with manual toggle
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Clean design with subtle animations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin info

### Notices (Public)
- `GET /api/notices` - Get active notices
- `GET /api/notices/:id` - Get single notice

### Notices (Admin)
- `GET /api/notices/admin` - Get all notices (including expired)
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice
- `GET /api/notices/stats/overview` - Get dashboard statistics

## 🚀 Deployment

### Backend
1. Build and deploy to services like Heroku, Railway, or DigitalOcean
2. Set up MongoDB Atlas for production database
3. Configure environment variables
4. Ensure CORS settings allow your frontend domain

### Frontend
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platforms
3. Update API URL environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database
- Tailwind CSS for the utility-first CSS framework
- All the open-source contributors whose packages made this project possible
#   n o t i c e - b o a r d  
 