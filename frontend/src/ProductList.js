import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Card from './Card';
import { motion } from 'framer-motion';


const ProductList = () => {
  const [products, setProducts] = useState([]);   // State to store products
  const [loading, setLoading] = useState(false);   // State to manage loading state
  const [offset, setOffset] = useState(0);         // State to manage offset
  const [limit] = useState(100);                    // Set a default limit

  const loadMoreData = async () => {
    if (loading) return;  // Prevent loading while a request is in progress
    
    setLoading(true); // Set loading to true when making a request
    
    try {
      // Fetch the products with the current offset and limit
      const response = await axios.get(`http://localhost:5000/api/products?page=${Math.floor(offset / limit) + 1}&limit=${limit}`);
      
      // Append new products to the existing list
      setProducts((prevProducts) => [...prevProducts, ...response.data.products]);
      
      // Update the offset for the next fetch
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); // Set loading to false once the request is done
    }
  };

  useEffect(() => {
    // Initial fetch when the component mounts
    loadMoreData();
  }, []); // Empty array means this runs only once when the component mounts

  useEffect(() => {
    // Add scroll event listener to trigger loadMoreData when user scrolls to bottom
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMoreData(); // Load more data when scrolled to the bottom
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]); // Re-run this effect whenever loading state changes

  return (
    <motion.div className="product-list mainuser"
    
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }} // Trigger animation once when card is in view
  >
    
      {products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
      
      {loading && <div>Loading more products...</div>} {/* Show loading indicator */}
    </motion.div>
  );
};

export default ProductList;
