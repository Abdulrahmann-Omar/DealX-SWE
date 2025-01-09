import express from 'express';
import cors from 'cors';
import session from 'express-session';
import {productRoutes, cartRoutes , searchRoute} from './routes/productRoutes.js';
import {userRoutes} from './routes/userRoutes.js'
import {ProfileRouter} from './routes/profileRoutes.js'
const app = express();



const corsOptions = {
  origin: 'http://localhost:3000', // Allow only requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

app.use(cors(corsOptions));

app.use(cors(corsOptions));
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Server is running');
});


// app.use(session({
//   secret: '1e3w7s8ab9sevs', 
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: false } 
// }));

app.use('/api/products', productRoutes);
app.use('/api/products' ,searchRoute);
app.use('/api/cart' , cartRoutes);
app.use('/api/profile', ProfileRouter);
//comment
app.use('/api/users', userRoutes);


export default app;
