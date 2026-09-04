import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderAction';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';
import MetaData from '../layout/MetaData';

const ProcessOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { order } = useSelector((state) => state.orderDetails);
    const { error, isUpdated } = useSelector((state) => state.order);
    const [status, setStatus] = useState('Processing');

    useEffect(() => {
        dispatch(getOrderDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (order && order.orderStatus) {
            setStatus(order.orderStatus);
        }
    }, [order]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success('Order status updated');
            dispatch({ type: UPDATE_ORDER_RESET });
            navigate('/admin/orders');
        }
    }, [dispatch, error, isUpdated, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateOrder(id, status));
    };

    return (
        <Fragment>
            <MetaData title='Process Order - Admin' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>PROCESS ORDER</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor='status'>Order Status</label>
                    <select id='status' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value='Processing'>Processing</option>
                        <option value='Shipped'>Shipped</option>
                        <option value='Delivered'>Delivered</option>
                    </select>
                    <button type='submit'>Update Status</button>
                </form>
            </div>
        </Fragment>
    );
};

export default ProcessOrder;
