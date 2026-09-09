import axios from '../utils/axiosConfig';
import { getErrorMessage } from '../utils/apiError';
import {
    RECOMMENDATIONS_FAIL,
    RECOMMENDATIONS_REQUEST,
    RECOMMENDATIONS_SUCCESS
} from '../constants/recommendationConstants';

export const getRecommendations = (productId, limit = 8) => async dispatch => {
    try {
        dispatch({ type: RECOMMENDATIONS_REQUEST });
        const params = new URLSearchParams({ limit: String(limit) });
        if (productId) params.set('productId', productId);

        const { data } = await axios.get(`/api/v1/recommendations?${params.toString()}`);
        dispatch({ type: RECOMMENDATIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: RECOMMENDATIONS_FAIL, payload: getErrorMessage(error) });
    }
};