import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors, createProduct } from '../../actions/productAction';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../layout/MetaData';

const NewProduct = () => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector((state) => state.newProduct);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: 'Electronics',
        price: '',
        Stock: ''
    });
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            toast.success('Product created successfully');
            setProduct({ name: '', description: '', category: 'Electronics', price: '', Stock: '' });
            setImages([]);
            setImagesPreview([]);
            dispatch({ type: NEW_PRODUCT_RESET });
        }
    }, [dispatch, error, success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setImagesPreview(files.map((file) => URL.createObjectURL(file)));
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', product.name);
        formData.set('description', product.description);
        formData.set('category', product.category);
        formData.set('price', product.price);
        formData.set('Stock', product.Stock);

        images.forEach((image) => {
            formData.append('product', image);
        });

        dispatch(createProduct(formData));
    };

    return (
        <Fragment>
            <MetaData title='Add Product - Admin Panel' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>ADD PRODUCT</h1>
                <form className='newProductForm' encType='multipart/form-data' onSubmit={submitHandler}>
                    <div>
                        <label htmlFor='name'>Name</label>
                        <input id='name' name='name' value={product.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <textarea id='description' name='description' value={product.description} onChange={handleChange} rows='4' required />
                    </div>
                    <div>
                        <label htmlFor='price'>Price</label>
                        <input id='price' name='price' type='number' value={product.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='category'>Category</label>
                        <input id='category' name='category' value={product.category} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='Stock'>Stock</label>
                        <input id='Stock' name='Stock' type='number' value={product.Stock} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor='images'>Images</label>
                        <input id='images' type='file' accept='image/*' multiple onChange={handleImageChange} />
                    </div>
                    {imagesPreview.length > 0 && (
                        <div className='previewImages'>
                            {imagesPreview.map((img, idx) => (
                                <img key={idx} src={img} alt='preview' />
                            ))}
                        </div>
                    )}
                    <button type='submit' disabled={loading}>Create Product</button>
                </form>
            </div>
        </Fragment>
    );
};

export default NewProduct;
