import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';


function Card({ product }) {
  const [inCart, setInCart] = useState(false); 
  const [inWishlist, setInWishlist] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
      try {
        if (!inCart) {

          const requestData = {
          
            quantity: product.stock_quantity,     
            cart_id: 123,      
          };

          await axios.post(`http://localhost:5000/api/cart/${product.product_id}` ,requestData);
          setInCart(true);
          alert('Product added to cart!');
        } else {

          navigate('/cart');
        }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };


  const handleAddToWishlist = async () => {
    try {
      if (!inWishlist) {
        await axios.post('/api/wishlist', { productId: product.id });
        setInWishlist(true);
        alert('Product added to wishlist!');
      } else {
        navigate('/wishlist'); 
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleCardClick = (product) => {
    navigate(`/product` , {state : {product}});
  };

  return (
    <div className="product-card " onClick={() => handleCardClick(product)}>
      <div className="card-image">
        <img src={product.image_url} alt="Product Image" />
      </div>
      <div className="card-details">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="card-footer">
          <span className="product-price">${product.price}</span>
          <button
            className="add-to-cart"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
          > <div className="fa fa-shopping-cart"></div>
         </button>
          <button
            className="add-to-wishlist"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card click
              handleAddToWishlist();
            }}
          >
            <div className="fas fa-heart"></div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
