import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { getRecommendations } from '../../actions/recommendationAction';
import ProductCard from '../Home/ProductCard';

const RecommendedProducts = ({ productId }) => {
    const dispatch = useDispatch();
    const { recommendations, loading, error } = useSelector(
        state => state.recommendations
    );

    useEffect(() => {
        dispatch(getRecommendations(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    if (loading || error || !recommendations.length) return null;

    return (
        <section className='recommended-products'>
            <h3 className='reviewsHeading'>You May Also Like</h3>
            <p>Based on this product's category, price and rating.</p>
            <div className='products'>
                {recommendations.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default RecommendedProducts;