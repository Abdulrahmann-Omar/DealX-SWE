import React from 'react'
import MainNav from "./Main_Nav"



const marketplaces = [
{ name: 'Amazon' },
{ name: 'Walmart' },
{ name: 'Ebay' },
{ name: 'AliExpress' },
{ name: 'Etsy' },
{ name: 'another' },
];

const products = [
{
name: 'Product 1',
quantity: 1,
price: 150,
image: 'path/to/product-image.jpg', // Replace with actual image path
},
];

const CartPage = () => {
return (
    <>
    <MainNav/>

<div className="cart-page">
    <h1>Your Cart : 10 items</h1>

    <div className="cart-content">

    <div className="cart-marketplaces">
        {marketplaces.map((marketplace) => (
        <div className="marketplace" key={marketplace.name}>
            <h2>{marketplace.name}</h2>
            {products.map((product, index) => (
            <div className="product" key={index}>
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-details">
                <span>{product.name}</span>
                <span>QTY: {product.quantity}</span>
                <span>{product.price} $</span>
                </div>
            </div>
            ))}
        </div>
        ))}
    </div>

    <div className="cart-summary">
        <h3>subtotal : 50 items</h3>
        <p>$ 1500</p>
        <h3>Est. taxes :</h3>
        <p>$ 200</p>
        <hr />
        <h3>Est. total</h3>
        <p>with delivery $100</p>
        <h2>$ 1900</h2>
        <button className="checkout-btn">Checkout</button>
    </div>
    </div>
</div>
</>
);
};





export default CartPage ;

