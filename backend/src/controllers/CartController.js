import Cart from '../models/CartModel.js';



export async function addToCart(req, res) {
    try {
    const { id: product_id } = req.params;
    const { quantity, cart_id } = req.body;



    if (!product_id ) {
        return res.status(400).json({ message: 'productId and userId are required' });
    }
    
    const existingCartItem = await Cart.findOne({ where: {product_id } });
    if (existingCartItem) {
        
        return res.status(409).json({ message: 'Product is already in the cart' });
    }
    
    const newCartItem = await Cart.create({
        cart_id,
        product_id,
        quantity,
    });
    
    res.status(201).json({
        message: 'Product added to cart successfully',
        cartItem: newCartItem,
    });
    } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({
        message: 'Error adding product to the cart',
        error: error.message,
    });
    }
    }
    