import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors } from '../../actions/productAction';
import MetaData from '../layout/MetaData';

const ProductReviews = () => {
    const dispatch = useDispatch();
    const { reviews, error } = useSelector((state) => state.productReviews);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    return (
        <Fragment>
            <MetaData title='Product Reviews - Admin' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>PRODUCT REVIEWS</h1>
                <div>{reviews && reviews.length ? reviews.map((review, idx) => (
                    <div key={review._id || idx}>
                        <strong>{review.name}</strong>
                        <p>{review.comment}</p>
                        <small>Rating: {review.rating}</small>
                    </div>
                )) : <p>No reviews available.</p>}</div>
            </div>
        </Fragment>
    );
};

export default ProductReviews;
