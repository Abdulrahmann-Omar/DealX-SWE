import React, { useState } from 'react';
import Main_Nav from './Main_Nav';

import { useLocation } from 'react-router-dom';





const Product = () => {
const location = useLocation();
const { product } = location.state || {};


// const [size, setSize] = useState(null);

// const handleSizeSelect = (selectedSize) => {
// setSize(selectedSize);
// };


return (
    <>
<Main_Nav/>
<div className="product-page">
    <div className="product-image">
    <img src={product.image_url} alt={product.name} />
    </div>

    <div className="product-info">
    <h1>{product.name}</h1>

    <div className="size-selector">
        <h4>Select size</h4>
        {/* <button onClick={() => handleSizeSelect(30)} className={size === 30 ? 'selected' : ''}>30</button>
        <button onClick={() => handleSizeSelect(32)} className={size === 32 ? 'selected' : ''}>32</button>
        <button onClick={() => handleSizeSelect(34)} className={size === 34 ? 'selected' : ''}>34</button>
        <button onClick={() => handleSizeSelect(36)} className={size === 36 ? 'selected' : ''}>36</button>
        <button onClick={() => handleSizeSelect(40)} className={size === 40 ? 'selected' : ''}>40</button>
        <button onClick={() => handleSizeSelect(43)} className={size === 43 ? 'selected' : ''}>43</button> */}
    </div>

    <div className="price-and-add">
        <span className="price">{product.price}</span>
        <button className="add-to-cart">Add To Cart</button>
    </div>

    


    </div>
    <div className="tabs">
        <button className="tab">Description</button>
        <button className="tab">Reviews</button>
        <button className="tab">Shipping and returns</button>
    </div>
    <div className="description">
        <p>{product.description}</p>
    </div>
</div>
</>
);
};

export default Product