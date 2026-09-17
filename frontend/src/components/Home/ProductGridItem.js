import React, { useState } from 'react';
import './ProductGridItem.css';
import { Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import { getProductFallbackImage, getProductImages, PREFER_PROFESSIONAL_IMAGES } from '../../utils/productImages';

const ProductGridItem = ({ product }) => {
    const [hovered, setHovered] = useState(false);

    if (!product) return null;

    const images = getProductImages(product);
    const fallbackImage = getProductFallbackImage(product);
    const imageUrl = PREFER_PROFESSIONAL_IMAGES ? fallbackImage : (images[0] || fallbackImage);

    const options = {
        size: 'large',
        value: Number(product.ratings) || 0,
        readOnly: true,
        precision: 0.5
    };

    return (
        <Link to={`/product/${product._id}`} className='productGridLink'>
            <div
                className='productGridItem'
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <img
                    src={imageUrl}
                    alt={product.name || 'Product'}
                    onError={(event) => {
                        if (event.currentTarget.src !== fallbackImage) {
                            event.currentTarget.src = fallbackImage;
                        }
                    }}
                />

                {hovered && (
                    <div className='productGridItemContent'>
                        <p>{product.name}</p>
                        <span>{product.description}</span>
                        <span>₹{Number(product.price || 0).toLocaleString('en-IN')}</span>
                        <Rating {...options} />
                        <span className='productCardSpan'>
                            ({product.numOfReviews || 0} Reviews)
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
};

export default ProductGridItem;
