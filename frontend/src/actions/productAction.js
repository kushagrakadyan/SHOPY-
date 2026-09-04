import axios from '../utils/axiosConfig';
import { getErrorMessage } from '../utils/apiError';

import { ADD_PRODUCT_TO_WISHLIST_FAIL, 
    ADD_PRODUCT_TO_WISHLIST_REQUEST, 
    ADD_PRODUCT_TO_WISHLIST_SUCCESS, 
    ADMIN_PRODUCT_FAIL, 
    ADMIN_PRODUCT_REQUEST, 
    ADMIN_PRODUCT_SUCCESS, 
    ALL_PRODUCT_FAIL, 
    ALL_PRODUCT_REQUEST, 
    ALL_PRODUCT_SUCCESS, 
    ALL_REVIEW_FAIL, 
    ALL_REVIEW_REQUEST, 
    ALL_REVIEW_SUCCESS, 
    ALL_WISHLIST_PRODUCTS_FAIL, 
    ALL_WISHLIST_PRODUCTS_REQUEST, 
    ALL_WISHLIST_PRODUCTS_SUCCESS, 
    DELETE_PRODUCT_FAIL, 
    DELETE_PRODUCT_REQUEST, 
    DELETE_PRODUCT_SUCCESS, 
    DELETE_REVIEW_FAIL, 
    DELETE_REVIEW_REQUEST, 
    DELETE_REVIEW_SUCCESS, 
    NEW_PRODUCT_FAIL, 
    NEW_PRODUCT_REQUEST, 
    NEW_PRODUCT_SUCCESS, 
    NEW_REVIEW_FAIL, 
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS, 
    PRODUCT_DETAILS_FAIL, 
    PRODUCT_DETAILS_REQUEST, 
    PRODUCT_DETAILS_SUCCESS, 
    REMOVE_PRODUCT_FROM_WISHLIST_FAIL, 
    REMOVE_PRODUCT_FROM_WISHLIST_REQUEST, 
    REMOVE_PRODUCT_FROM_WISHLIST_SUCCESS, 
    UPDATE_PRODUCT_FAIL, 
    UPDATE_PRODUCT_REQUEST, 
    UPDATE_PRODUCT_SUCCESS,
    SEARCH_PRODUCTS_REQUEST,
    SEARCH_PRODUCTS_SUCCESS,
    SEARCH_PRODUCTS_FAIL,
    SUMMARIZE_REVIEWS_REQUEST,
    SUMMARIZE_REVIEWS_SUCCESS,
    SUMMARIZE_REVIEWS_FAIL,
    CLEAR_ERRORS
} from '../constants/productConstants';

// Get All Products
export const getProduct = (filters = {}) => async dispatch => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        const params = new URLSearchParams();
        const {
            keyword = '', category = '', priceMin, priceMax,
            ratingMin, availability = 'all', sort = 'newest',
            page = 1, limit = 8
        } = filters;

        if (keyword) params.set('keyword', keyword);
        if (category) params.set('category', category);
        if (Number.isFinite(Number(priceMin))) params.set('price[gte]', priceMin);
        if (Number.isFinite(Number(priceMax))) params.set('price[lte]', priceMax);
        if (Number.isFinite(Number(ratingMin)) && Number(ratingMin) > 0) params.set('ratings[gte]', ratingMin);
        if (availability && availability !== 'all') params.set('availability', availability);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', limit);

        const { data } = await axios.get(`/api/v1/products?${params.toString()}`);

        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Get All Products For Admin
export const getAdminProduct = () => async dispatch => {
    try {
        dispatch({ type: ADMIN_PRODUCT_REQUEST });

        const { data } = await axios.get('/api/v1/admin/products');

        dispatch({
            type: ADMIN_PRODUCT_SUCCESS,
            payload: data.products
            // payload: data,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCT_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Create Product
export const createProduct = productData => async dispatch => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });

        const { data } = await axios.post(`/admin/add-product`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Update Product
export const updateProduct = (id, productData) => async dispatch => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const { data } = await axios.put(`/admin/product/${id}`, productData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Delete Product
export const deleteProduct = id => async dispatch => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const { data } = await axios.delete(`/admin/product/${id}`);

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Get Products Details
export const getProductDetails = id => async dispatch => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/product/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// NEW REVIEW
export const newReview = reviewData => async dispatch => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });

        const { data } = await axios.post(
            `/api/v1/review`,
            reviewData
        );

        console.log('DATA', data);

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.review
        });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Get All Reviews of a Product
export const getAllReviews = id => async dispatch => {
    try {
        dispatch({ type: ALL_REVIEW_REQUEST });

        const { data } = await axios.get(`/api/v1/reviews?id=${id}`);

        dispatch({
            type: ALL_REVIEW_SUCCESS,
            payload: data.reviews
        });
    } catch (error) {
        dispatch({
            type: ALL_REVIEW_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

// Delete Review of a Product
export const deleteReviews = (reviewId, productId) => async dispatch => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST });

        const { data } = await axios.delete(
            `/api/v1/review/${reviewId}`,
            { data: { productId } }
        );

        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatch({
            type: DELETE_REVIEW_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

export const fetchWishlist = () => async dispatch => {
    try {
        dispatch({ type: ALL_WISHLIST_PRODUCTS_REQUEST });

        // Assume you have an API endpoint to fetch wishlist products
        const { data } = await axios.get('/api/v1/wishlist');

        dispatch({
            type: ALL_WISHLIST_PRODUCTS_SUCCESS,
            payload: data.wishlistProducts
        });
    } catch (error) {
        dispatch({
            type: ALL_WISHLIST_PRODUCTS_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

export const addProductToWishlist = (id) => async dispatch => {
    try {
        dispatch({ type: ADD_PRODUCT_TO_WISHLIST_REQUEST });

        // Assume you have an API endpoint to add a product to the wishlist
        const { data } = await axios.post(`/api/v1/wishlist/${id}`);

        dispatch({
            type: ADD_PRODUCT_TO_WISHLIST_SUCCESS,
            payload: data.wishlist
        });
    } catch (error) {
        dispatch({
            type: ADD_PRODUCT_TO_WISHLIST_FAIL,
               payload: getErrorMessage(error)
        });
    }
};

export const removeProductFromWishlist = id => async dispatch => {
           try {
               dispatch({ type: REMOVE_PRODUCT_FROM_WISHLIST_REQUEST });

               // Assume you have an API endpoint to remove a product from the wishlist
               const { data } = await axios.delete(`/api/v1/wishlist/${id}`);

               dispatch({
                   type: REMOVE_PRODUCT_FROM_WISHLIST_SUCCESS,
                   payload: data.wishlist
               });
           } catch (error) {
               dispatch({
                   type: REMOVE_PRODUCT_FROM_WISHLIST_FAIL,
                   payload:
                       getErrorMessage(error)
               });
           }
       };

export const searchProducts = (filters = {}) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_PRODUCTS_REQUEST });

        const {
            keyword = '', category = '', priceMin, priceMax,
            ratingMin, availability = 'all', sort = 'newest',
            page = 1, limit = 8
        } = filters;

        // Use URLSearchParams to build the query string dynamically
        const params = new URLSearchParams();

        if (keyword) {
            params.append('keyword', keyword);
        }
        if (category) params.append('category', category);
        if (Number.isFinite(Number(priceMax))) params.append('price[lte]', priceMax);
        if (Number.isFinite(Number(priceMin))) params.append('price[gte]', priceMin);
        if (Number.isFinite(Number(ratingMin)) && Number(ratingMin) > 0) params.append('ratings[gte]', ratingMin);
        if (availability && availability !== 'all') params.append('availability', availability);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', limit);

        const { data } = await axios.get(`/api/v1/search?${params.toString()}`);

        dispatch({
            type: SEARCH_PRODUCTS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SEARCH_PRODUCTS_FAIL,
               payload: getErrorMessage(error),
        });
    }
};

export const summarizeProductReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: SUMMARIZE_REVIEWS_REQUEST });

        // You might need to include the token for authentication
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}` // If your route is protected
            },
        };

        const { data } = await axios.post(
            `/api/v1/products/${id}/summarize-reviews`,
            {}, 
            config
        );

        dispatch({
            type: SUMMARIZE_REVIEWS_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: SUMMARIZE_REVIEWS_FAIL,
               payload: getErrorMessage(error),
        });
    }
};

// Clearing Errors
export const clearErrors = () => async dispatch => {
    dispatch({ type: CLEAR_ERRORS });
};
