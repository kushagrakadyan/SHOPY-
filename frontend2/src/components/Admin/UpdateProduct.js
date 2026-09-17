import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, getProductDetails, updateProduct } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../layout/MetaData';

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { product } = useSelector((state) => state.productDetails);
    const { error, isUpdated } = useSelector((state) => state.product);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        Stock: ''
    });

    useEffect(() => {
        dispatch(getProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: product.category || '',
                Stock: product.Stock || ''
            });
        }
    }, [product]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('Product updated');
            dispatch({ type: UPDATE_PRODUCT_RESET });
            navigate('/admin/products');
        }
    }, [dispatch, error, isUpdated, navigate]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.set('name', form.name);
        payload.set('description', form.description);
        payload.set('price', form.price);
        payload.set('category', form.category);
        payload.set('Stock', form.Stock);

        dispatch(updateProduct(id, payload));
    };

    return (
        <Fragment>
            <MetaData title='Update Product - Admin Panel' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>UPDATE PRODUCT</h1>
                <form className='newProductForm' onSubmit={submitHandler}>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input id='name' name='name' value={form.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' name='description' value={form.description} onChange={handleChange} rows='4' required />
                    </div>
                    <div>
                        <label htmlFor='price'>Price</label>
                        <input id='price' name='price' type='number' value={form.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='category'>Category</label>
                        <input id='category' name='category' value={form.category} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='Stock'>Stock</label>
                        <input id='Stock' name='Stock' type='number' value={form.Stock} onChange={handleChange} required />
                    </div>
                    <button type='submit'>Update Product</button>
                </form>
            </div>
        </Fragment>
    );
};

export default UpdateProduct;
