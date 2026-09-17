import { Rating } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addProductToWishlist } from '../../actions/productAction';
import { toast } from 'react-toastify';
import { getProductFallbackImage, getProductImages, PREFER_PROFESSIONAL_IMAGES } from '../../utils/productImages';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageFailed, setImageFailed] = useState(false);

    const safeProduct = product || {};

    const productImages = useMemo(() => getProductImages(safeProduct), [product]);
    const fallbackImage = useMemo(() => getProductFallbackImage(safeProduct), [product]);
    const displayImages = PREFER_PROFESSIONAL_IMAGES
        ? [fallbackImage]
        : (productImages.length ? productImages : [fallbackImage]);

    const options = {
        size: 'small',
        value: Number(safeProduct.ratings) || 0,
        readOnly: true,
        precision: 0.5
    };

    useEffect(() => {
        setCurrentImageIndex(0);
        setImageFailed(false);
    }, [safeProduct._id]);

    useEffect(() => {
        if (displayImages.length <= 1) return undefined;

        const intervalId = setInterval(() => {
            setCurrentImageIndex(index => (index + 1) % displayImages.length);
        }, 3500);

        return () => clearInterval(intervalId);
    }, [displayImages.length]);

    const addToWishlist = event => {
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated) {
            toast.info('Please log in to use your wishlist');
            return;
        }

        dispatch(addProductToWishlist(safeProduct._id));
    };

    const imageUrl = imageFailed ? fallbackImage : displayImages[currentImageIndex];
    const hasDiscount = safeProduct.originalPrice && Number(safeProduct.originalPrice) > Number(safeProduct.price);
    const discount = hasDiscount
        ? Math.round(((Number(safeProduct.originalPrice) - Number(safeProduct.price)) / Number(safeProduct.originalPrice)) * 100)
        : null;

    return (
        <Link className='productCard' to={`/product/${safeProduct._id}`}>
            <div className='productImageWrap'>
                <div className='productBadges'>
                    {discount && <span className='discountBadge'>-{discount}%</span>}
                    {safeProduct.stock === 0 && <span className='stockBadge'>Out of stock</span>}
                </div>

                <button
                    type='button'
                    aria-label='Add product to wishlist'
                    className='wishlistIcon'
                    onClick={addToWishlist}
                >
                    ♡
                </button>

                <img
                    src={imageUrl}
                    alt={safeProduct.name || 'Product'}
                    className='product-image'
                    loading='lazy'
                    onError={() => {
                        if (!imageFailed) setImageFailed(true);
                    }}
                />

                {displayImages.length > 1 && (
                    <div className='productImageDots'>
                        {displayImages.slice(0, 4).map((_, index) => (
                            <span key={index} className={index === currentImageIndex ? 'active' : ''} />
                        ))}
                    </div>
                )}
            </div>

            <div className='productCardInfo'>
                <span className='productCategory'>{safeProduct.category || 'GENERAL'}</span>
                <h3 title={safeProduct.name}>{safeProduct.name}</h3>

                <div className='productRatingRow'>
                    <span className='ratingValue'>{Number(safeProduct.ratings || 0).toFixed(1)}</span>
                    <Rating {...options} />
                    <span className='reviewCount'>({safeProduct.numOfReviews || 0})</span>
                </div>

                <div className='productPriceRow'>
                    <span className='productPrice'>₹{Number(safeProduct.price || 0).toLocaleString('en-IN')}</span>
                    {hasDiscount && (
                        <span className='productOldPrice'>₹{Number(safeProduct.originalPrice).toLocaleString('en-IN')}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
