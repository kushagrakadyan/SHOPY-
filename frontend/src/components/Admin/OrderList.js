import React, { Fragment, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, getAllOrders } from '../../actions/orderAction';
import MetaData from '../layout/MetaData';

const OrderList = () => {
    const dispatch = useDispatch();
    const { orders, error, loading } = useSelector((state) => state.allOrders);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        dispatch(getAllOrders());
    }, [dispatch, error]);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 200, flex: 0.8 },
        { field: 'status', headerName: 'Status', minWidth: 150, flex: 0.5 },
        { field: 'amount', headerName: 'Amount', minWidth: 120, flex: 0.5 },
        { field: 'items', headerName: 'Items', minWidth: 120, flex: 0.5 },
        {
            field: 'actions',
            headerName: 'Actions',
            minWidth: 120,
            flex: 0.4,
            sortable: false,
            renderCell: (params) => (
                <Link to={`/admin/order/${params.row.id}`}>View</Link>
            )
        }
    ];

    const rows = orders
        ? orders.map((item) => ({
              id: item._id,
              status: item.orderStatus,
              amount: `₹${item.totalPrice}`,
              items: item.orderItems?.length || 0
          }))
        : [];

    return (
        <Fragment>
            <MetaData title='All Orders - Admin' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>ALL ORDERS</h1>
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

export default OrderList;
