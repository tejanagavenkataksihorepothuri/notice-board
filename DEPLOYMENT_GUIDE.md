# Deployment Guide for MERN Notice Board

## Quick Deployment Commands

### For Development
```bash
npm run dev
```
This runs both frontend and backend in development mode with hot reloading.

### For Production-like Local Deployment
```bash
# Option 1: Use the deployment script
npm run deploy:all

# Option 2: Step by step
npm run build          # Install deps and build frontend
npm run start          # Start backend only (serves built frontend)

# Option 3: Use platform-specific scripts
# Windows (PowerShell)
.\deploy.ps1

# Windows (Command Prompt)
deploy.bat

# Linux/Mac
./deploy.sh
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run both frontend and backend in development mode |
| `npm run build` | Install all dependencies and build frontend |
| `npm run start` | Start backend server (production mode) |
| `npm run deploy:all` | Build and serve both frontend and backend |
| `npm run deploy:local` | Build and start for local production testing |
| `npm run deploy:production` | Build and start for production |
| `npm run install:all` | Install dependencies for root, backend, and frontend |
| `npm run frontend:build` | Build React frontend only |
| `npm run backend:start` | Start backend server only |

## Environment Setup

### Backend Environment Variables
Create `backend/.env` file with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notice-board
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=production
```

### Frontend Environment Variables (Optional)
Create `frontend/.env` file with:
```env
REACT_APP_API_URL=http://localhost:5000
```

## Deployment Platforms

### 1. Render (Recommended)
```bash
# Backend deployment on Render
npm run render:backend

# Frontend deployment on Render
npm run render:frontend
```

### 2. Heroku
```bash
# Set buildpacks
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main
```

### 3. Vercel (Frontend) + Railway/Render (Backend)
```bash
# Frontend on Vercel
npm run frontend:build

# Backend on Railway/Render
npm run backend:start
```

## Git Commands for Deployment

### Initial Setup
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: MERN Notice Board application"

# Add remote repository
git remote add origin https://github.com/yourusername/notice-board.git

# Push to main branch
git push -u origin main
```

### Regular Updates
```bash
# Add changes
git add .

# Commit changes
git commit -m "Update: describe your changes"

# Push to repository
git push origin main
```

### Create Release Branch
```bash
# Create and switch to release branch
git checkout -b release/v1.0.0

# Push release branch
git push -u origin release/v1.0.0

# Create pull request for deployment
```

## Production Checklist

- [ ] Update MongoDB URI in `backend/.env`
- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Update CORS origins in `backend/server.js`
- [ ] Test all API endpoints
- [ ] Verify file upload functionality
- [ ] Test admin authentication
- [ ] Check responsive design on different devices
- [ ] Verify all environment variables are set
- [ ] Test database connection
- [ ] Ensure proper error handling

## Troubleshooting

### Common Issues

1. **CORS Error**: Update CORS origins in `backend/server.js`
2. **Database Connection**: Check MongoDB URI in `.env`
3. **Build Errors**: Run `npm run install:all` to reinstall dependencies
4. **Port Conflicts**: Change ports in environment variables
5. **File Upload Issues**: Check upload directory permissions

### Debug Commands
```bash
# Check if ports are in use
netstat -tulpn | grep :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# Check backend logs
cd backend && npm run dev

# Check frontend build
cd frontend && npm run build

# Test database connection
cd backend && npm run test-connection
```

## Performance Optimization

### Production Build
- Frontend is optimized and minified
- Static files are compressed
- Images are optimized
- API calls are cached where appropriate

### Monitoring
- Monitor MongoDB Atlas usage
- Set up error logging
- Monitor API response times
- Track user analytics (optional)

## Security Considerations

- JWT tokens have expiration
- Passwords are hashed with bcrypt
- File uploads are validated
- CORS is properly configured
- Environment variables are secured
- Input validation on all endpoints
