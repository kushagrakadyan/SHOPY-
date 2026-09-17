import React from 'react';
import './CartItemCard.css';
import { Link } from 'react-router-dom';
import { getProductFallbackImage, PREFER_PROFESSIONAL_IMAGES } from '../../utils/productImages';

const CartItemCard = ({ item, deleteCartItems }) => {
    return (
        <div className="CartItemCard">
            <img
                src={PREFER_PROFESSIONAL_IMAGES ? getProductFallbackImage(item) : (item.image || getProductFallbackImage(item))}
                alt={item.name || 'Product'}
                onError={(event) => {
                    const fallback = getProductFallbackImage(item);
                    if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback;
                }}
            />
            <div>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>{`Price: ₹${item.price}`}</span>
                <p onClick={() => deleteCartItems(item.product)}>Remove</p>
            </div>
        </div>
    );
};

export default CartItemCard;
