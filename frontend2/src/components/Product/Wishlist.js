import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    clearErrors,
    fetchWishlist,
} from '../../actions/productAction';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';

import './Wishlist.css';
import WishlistProductCard from './WishlistProductCard';

const Wishlist = () => {
    const dispatch = useDispatch();

    const { loading, error, wishlist } = useSelector(state => state.wishlist);

    useEffect(() => {
        dispatch(fetchWishlist());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title='WISHLIST -- ECOMMERCE' />
                    <h2 className='productsHeading'>Wishlist</h2>
                    {wishlist && wishlist.length > 0 ? (
                        <div className='products'>
                            {wishlist.map(product => (
                                <WishlistProductCard
                                    key={product.product || product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>Your wishlist is empty.</p>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default Wishlist;
