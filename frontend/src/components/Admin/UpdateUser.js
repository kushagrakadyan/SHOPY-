import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearErrors, getUserDetails, updateUser } from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useSelector((state) => state.userDetails);
    const { error, isUpdated } = useSelector((state) => state.profile);
    const [form, setForm] = useState({ name: '', email: '', role: 'user' });

    useEffect(() => {
        dispatch(getUserDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (user) {
            setForm({ name: user.name || '', email: user.email || '', role: user.role || 'user' });
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success('User updated');
            dispatch({ type: UPDATE_USER_RESET });
            navigate('/admin/users');
        }
    }, [dispatch, error, isUpdated, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser(id, form));
    };

    return (
        <Fragment>
            <MetaData title='Update User - Admin' />
            <div className='productListContainer'>
                <h1 id='productListHeading'>UPDATE USER</h1>
                <form onSubmit={submitHandler}>
                    <label htmlFor='name'>Name</label>
                    <input id='name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    <label htmlFor='role'>Role</label>
                    <select id='role' value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                        <option value='user'>User</option>
                        <option value='admin'>Admin</option>
                    </select>
                    <button type='submit'>Update User</button>
                </form>
            </div>
        </Fragment>
    );
};

export default UpdateUser;
