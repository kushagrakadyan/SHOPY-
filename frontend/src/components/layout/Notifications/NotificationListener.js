import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ORDER_STATUS_UPDATED } from '../../../constants/orderConstants';
import { NOTIFICATION_RECEIVED } from '../../../constants/notificationConstants';
import { syncSocketAuthentication } from '../../../utils/socket';

const NotificationListener = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        const socket = syncSocketAuthentication(isAuthenticated);
        if (!isAuthenticated) return undefined;

        const handleOrderStatusUpdated = payload => {
            const notification = {
                id: `${payload.orderId}:${payload.status}`,
                title: `Order #${payload.orderId}`,
                message: payload.message,
                createdAt: Date.now()
            };
            dispatch({ type: ORDER_STATUS_UPDATED, payload });
            dispatch({ type: NOTIFICATION_RECEIVED, payload: notification });
        };

        socket.on('orderStatusUpdated', handleOrderStatusUpdated);
        return () => socket.off('orderStatusUpdated', handleOrderStatusUpdated);
    }, [dispatch, isAuthenticated]);

    return null;
};

export default NotificationListener;