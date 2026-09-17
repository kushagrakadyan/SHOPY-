import React, { useEffect, useMemo, useState } from 'react';
import { Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeProductFromWishlist } from '../../actions/productAction';
import { getProductFallbackImage, getProductImages, PREFER_PROFESSIONAL_IMAGES } from '../../utils/productImages';

const WishlistProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageFailed, setImageFailed] = useState(false);

    const images = useMemo(() => getProductImages(product || {}), [product]);
    const fallback = useMemo(() => getProductFallbackImage(product || {}), [product]);
    const displayImages = PREFER_PROFESSIONAL_IMAGES ? [fallback] : (images.length ? images : [fallback]);

    useEffect(() => {
        setCurrentImageIndex(0);
        setImageFailed(false);
    }, [product?._id]);

    useEffect(() => {
        if (displayImages.length <= 1) return undefined;
        const timer = setInterval(() => {
            setCurrentImageIndex(index => (index + 1) % displayImages.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [displayImages.length]);

    if (!product) return null;

    const options = {
        size: 'small',
        value: Number(product.ratings) || 0,
        readOnly: true,
        precision: 0.5
    };

    const imageUrl = imageFailed ? fallback : displayImages[currentImageIndex];

    return (
        <div className='wishlistProductCard'>
            <Link to={`/product/${product._id}`}>
                <div className='wishlistImageWrap'>
                    <img
                        src={imageUrl}
                        alt={product.name || 'Product'}
                        onError={() => setImageFailed(true)}
                    />
                </div>
                <h3>{product.name}</h3>
                <div>
                    <Rating {...options} />
                    <span> ({product.numOfReviews || 0})</span>
                </div>
                <strong>₹{Number(product.price || 0).toLocaleString('en-IN')}</strong>
            </Link>
            <button
                type='button'
                onClick={() => dispatch(removeProductFromWishlist(product._id))}
            >
                Remove
            </button>
        </div>
    );
};

export default WishlistProductCard;
