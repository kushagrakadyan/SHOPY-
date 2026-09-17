import { Rating } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addProductToWishlist } from '../../actions/productAction';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ProductCard = ({ product }) => {

    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);
    const defaultImageUrl = "https://ecommerce-bucket-sdk.s3.ap-south-1.amazonaws.com/default.jpg";

    const options = {
        size: 'small',
        value: product.ratings,
        readOnly: true,
        precision: 0.2
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = product.images || defaultImageUrl;

    const addToWishlist = () => {
        if (!isAuthenticated) {
            toast.info('Please log in to use your wishlist');
            return;
        }

        dispatch(addProductToWishlist(product._id));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (currentImageIndex + 1) % images.length;
            setCurrentImageIndex(nextIndex);
        }, 2000);

        return () => clearInterval(intervalId);
    }, [currentImageIndex, images.length]);

    if (!product) {
        return null;
    }

    const imageUrl = images.length > 0 ? images[currentImageIndex]?.url : defaultImageUrl;

    return (
        <Fragment>
                <Link className='productCard' to={`/product/${product._id}`}>
                    <div className='image-container'>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className='product-image'
                        />
                    </div>
                    <p>{product.name}</p>
                    <div>
                        <Rating {...options} />
                        <span className='productCardSpan'>
                            ({product.numOfReviews} Reviews)
                        </span>
                    </div>
                    <span>{`₹${product.price}`}</span>
                    <button
                        type='button'
                        onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            addToWishlist();
                        }}
                        className='addToWishlistButton'
                    >
                        Add to Wishlist
                    </button>
                </Link>
        </Fragment>
    );
};

export default ProductCard;
