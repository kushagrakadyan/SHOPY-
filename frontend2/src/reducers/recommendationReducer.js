import {
    RECOMMENDATIONS_FAIL,
    RECOMMENDATIONS_REQUEST,
    RECOMMENDATIONS_SUCCESS
} from '../constants/recommendationConstants';

const initialState = {
    recommendations: [],
    source: null,
    loading: false,
    error: null
};

export const recommendationReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECOMMENDATIONS_REQUEST:
            return { ...state, loading: true, error: null };
        case RECOMMENDATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                recommendations: action.payload.recommendations || [],
                source: action.payload.source || null
            };
        case RECOMMENDATIONS_FAIL:
            return { ...state, loading: false, error: action.payload, recommendations: [] };
        default:
            return state;
    }
};