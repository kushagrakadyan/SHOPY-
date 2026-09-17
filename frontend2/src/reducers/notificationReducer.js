import {
    CLEAR_NOTIFICATIONS,
    NOTIFICATION_RECEIVED
} from '../constants/notificationConstants';

const initialState = { notifications: [], unreadCount: 0 };

export const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case NOTIFICATION_RECEIVED:
            if (state.notifications.some(item => item.id === action.payload.id)) {
                return state;
            }
            return {
                notifications: [action.payload, ...state.notifications].slice(0, 20),
                unreadCount: state.unreadCount + 1
            };
        case CLEAR_NOTIFICATIONS:
            return initialState;
        default:
            return state;
    }
};