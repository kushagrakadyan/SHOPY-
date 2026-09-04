import axios from '../utils/axiosConfig';
import { getErrorMessage } from '../utils/apiError';
import {
    CONTACT_REQUEST,
    CONTACT_SUCCESS,
    CONTACT_FAIL,
    CLEAR_CONTACT,
    CLEAR_ERRORS
} from '../constants/contactConstants';

export const submitContactForm = myForm => async dispatch => {
    try {
        dispatch({ type: CONTACT_REQUEST });

        const { data } = await axios.post('/api/v1/contact-us', myForm);

        dispatch({ type: CONTACT_SUCCESS, payload: data });
    } catch (error) {
        console.log('error', error);
        dispatch({
            type: CONTACT_FAIL,
            payload: getErrorMessage(error)
        });
    }
};

export const clearContactForm = () => dispatch => {
    dispatch({ type: CLEAR_CONTACT });
};

// Clearing Errors
export const clearErrors = () => async dispatch => {
    dispatch({ type: CLEAR_ERRORS });
};
