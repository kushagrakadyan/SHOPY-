import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';

import { CLEAR_NOTIFICATIONS } from '../../../constants/notificationConstants';

const NotificationBell = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount } = useSelector(state => state.notifications);

    if (!notifications.length) return null;

    return (
        <div className='notification-container' title='Order notifications'>
            <NotificationsIcon />
            {unreadCount > 0 && <span className='cart-badge'>{unreadCount}</span>}
            <div className='notification-panel'>
                {notifications.slice(0, 3).map(notification => (
                    <p key={notification.id}>
                        <strong>{notification.title}</strong><br />
                        {notification.message}
                    </p>
                ))}
                <button type='button' onClick={() => dispatch({ type: CLEAR_NOTIFICATIONS })}>
                    Clear
                </button>
            </div>
        </div>
    );
};

export default NotificationBell;