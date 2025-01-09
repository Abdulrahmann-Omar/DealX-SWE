import React, { useState } from 'react';
import axios from 'axios';
import Card from './Card';

const FilteredProductsPage = () => {
const [products, setProducts] = useState([]);
const [searchQuery, setSearchQuery] = useState('');

const fetchFilteredProducts = async () => {
try {
    const response = await axios.get('http://localhost:5000/api/products/search', {
    params: { q: searchQuery },
    });
    
    setProducts(response.data || []);
    console.log(response.data)
} catch (error) {
    console.error('Error fetching filtered products:', error);
}
};

const handleSearchChange = (event) => {
setSearchQuery(event.target.value); // Update search query
};

const handleSearchSubmit = (event) => {
event.preventDefault(); // Prevent page reload
fetchFilteredProducts(); // Fetch products based on the search query
};

return (
<div className="product-list">
    <h1>Search Products</h1>
    <form onSubmit={handleSearchSubmit}>
    <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for products..."
    />
    <button type="submit">Search</button>
    </form>

    {products.length > 0 ? (
    products.map((product) => <Card key={product.id} product={product} />)
    ) : (
    <p>No products found.</p>
    )}
</div>
);
};

export default FilteredProductsPage;
