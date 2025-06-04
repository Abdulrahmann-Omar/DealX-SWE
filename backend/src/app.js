import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { productRoutes, cartRoutes, searchRoute } from './routes/productRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { ProfileRouter } from './routes/profileRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CORS Configuration ---
// Use environment variable for allowed origin, fallback to a sensible default for development if needed
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000'; // Default for local dev if not set

console.log(`Configuring CORS for origin: ${allowedOrigin}`); // Log the origin being used

const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow standard methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true // Allow cookies/session info if needed
};

// Enable CORS with options
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// --- Middleware ---
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Session Management ---
// Ensure SESSION_SECRET is set in the environment
if (!process.env.SESSION_SECRET) {
  console.error('FATAL ERROR: SESSION_SECRET environment variable is not set.');
  process.exit(1);
}

// Uncomment and configure session middleware if needed
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false, // Set to true if you want to save new sessions that are not modified
//   cookie: {
//     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
//     httpOnly: true, // Prevent client-side JS access to the cookie
//     maxAge: 24 * 60 * 60 * 1000 // Example: 1 day session duration
//   }
// }));

// --- API Routes ---
app.get('/api/health', (req, res) => {
  // Basic health check endpoint
  res.status(200).json({ status: 'UP', message: 'Backend is running' });
});

app.use('/api/products', productRoutes);
app.use('/api/products', searchRoute);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', ProfileRouter);
app.use('/api/users', userRoutes);

// --- Static File Serving (Handled by Nginx in Production) ---
// This section might be removed if Nginx handles all static serving and routing
// If kept for local dev without Nginx, ensure it doesn't conflict
// app.use(express.static(path.join(__dirname, '../../frontend/build'))); // Adjusted path assuming app.js is in backend/src

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html')); // Adjusted path
// });

// --- Error Handling (Basic Example) ---
// Add more robust error handling middleware as needed
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
