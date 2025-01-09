import Product from '../models/ProductCardModel.js';

export async function getProducts(req, res) {
try {
// Extract page and limit from query parameters, with defaults
const page = parseInt(req.query.page) || 1;  // Default to 1 if not provided
const limit = parseInt(req.query.limit) || 10;  // Default to 10 if not provided

// Fetch the products with pagination
const products = await Product.findAll({
    limit: limit,  // Number of records per page
    offset: (page - 1) * limit,  // Skip records based on page
});

// Get the total count of products to calculate total pages
const totalProducts = await Product.count();

// Send response with products and pagination info
res.json({
    products: products,
    total: totalProducts,
    page: page,
    pages: Math.ceil(totalProducts / limit),  // Calculate total pages
});
} catch (error) {
console.error(error);
res.status(500).send('Server Error');
}
}
