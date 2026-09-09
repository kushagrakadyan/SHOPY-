import { Rating } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addItemsToCart } from '../../actions/cartAction';
import { removeProductFromWishlist } from '../../actions/productAction';

const WishlistProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const productId = product.product || product._id;
    const images = Array.isArray(product.images) ? product.images : [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const options = {
        size: 'small',
        value: product.ratings,
        readOnly: true,
        precision: 0.2
    };

    useEffect(() => {
        if (images.length < 2) return undefined;
        const intervalId = setInterval(() => {
            setCurrentImageIndex(index => (index + 1) % images.length);
        }, 2000);
        return () => clearInterval(intervalId);
    }, [images.length]);

    const deleteWishlistProduct = () => {
        dispatch(removeProductFromWishlist(productId));
        toast.success('Product removed from wishlist');
    };

    const moveToCart = async () => {
        if (Number(product.Stock) <= 0) {
            toast.info('This product is currently out of stock');
            return;
        }
        try {
            await dispatch(addItemsToCart(productId, 1));
            toast.success('Item added to cart');
        } catch (error) {
            toast.error(error.message || 'Unable to add item to cart');
        }
    };

    return (
        <Fragment>
            <div className='productCard'>
                <Link to={`/product/${productId}`}>
                    <div className='image-container'>
                        {images.length > 0 ? (
                            <img
                                src={images[currentImageIndex].url}
                                alt={product.name}
                                className='product-image'
                            />
                        ) : (
                            <span>No image available</span>
                        )}
                    </div>
                    <p>{product.name}</p>
                    <div>
                        <Rating {...options} />
                        <span className='productCardSpan'>
                            ({product.numOfReviews || 0} Reviews)
                        </span>
                    </div>
                    <span>{`₹${product.price}`}</span>
                </Link>
                <button
                    type='button'
                    onClick={deleteWishlistProduct}
                    className='deleteButton'
                >
                    Remove from Wishlist
                </button>
                <button
                    type='button'
                    onClick={moveToCart}
                    className='addToWishlistButton'
                    disabled={Number(product.Stock) <= 0}
                >
                    {Number(product.Stock) <= 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
            </div>
        </Fragment>
    );
};

export default WishlistProductCard;
