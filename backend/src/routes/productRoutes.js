import express from 'express';
import { getProducts } from '../controllers/ProductController.js';
import { addToCart } from '../controllers/CartController.js'; 
import { searchProducts } from '../controllers/searchController.js';

const productRoutes = express.Router();
const cartRoutes = express.Router();
const searchRoute = express.Router(); 

productRoutes.get('/', getProducts);

searchRoute.get('/search', searchProducts);


cartRoutes.post('/:id', addToCart);

export { productRoutes, cartRoutes ,searchRoute };
