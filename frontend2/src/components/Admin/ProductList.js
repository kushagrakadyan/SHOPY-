import React, { Fragment, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, deleteProduct, getAdminProduct } from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';
import MetaData from '../layout/MetaData';
import './ProductList.css';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, error, loading } = useSelector((state) => state.products);
    const { error: deleteError, isDeleted, message } = useSelector((state) => state.product);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearErrors());
        }

        if (isDeleted) {
            toast.success(message || 'Product deleted');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }

        dispatch(getAdminProduct());
    }, [dispatch, error, deleteError, isDeleted, message]);

    const deleteHandler = (id) => {
        dispatch(deleteProduct(id));
    };

    const columns = [
        { field: 'id', headerName: 'Product ID', minWidth: 200, flex: 0.8 },
        { field: 'name', headerName: 'Name', minWidth: 180, flex: 1 },
        { field: 'category', headerName: 'Category', minWidth: 160, flex: 0.6 },
        { field: 'price', headerName: 'Price', minWidth: 120, flex: 0.5 },
        { field: 'stock', headerName: 'Stock', minWidth: 120, flex: 0.5 },
        {
            field: 'actions',
            flex: 0.5,
            headerName: 'Actions',
            minWidth: 160,
            sortable: false,
            renderCell: (params) => (
                <Fragment>
                    <div className='actions'>
                        <Link to={`/admin/product/${params.row.id}`}>
                            <EditIcon className='editIcon' />
                        </Link>
                        <Button onClick={() => deleteHandler(params.row.id)}>
                            <DeleteIcon className='deleteIcon' />
                        </Button>
                    </div>
                </Fragment>
            )
        }
    ];

    const rows = products
        ? products.map((item) => ({
              id: item._id,
              name: item.name,
              category: item.category,
              price: `₹${item.price}`,
              stock: item.Stock
          }))
        : [];

    return (
        <Fragment>
            <MetaData title='All Products - Admin' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>ALL PRODUCTS</h1>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    className='productListTable'
                    autoHeight
                    loading={loading}
                />
            </div>
        </Fragment>
    );
};

export default ProductList;
