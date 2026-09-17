export const getErrorMessage = (error, fallback = 'Request failed') =>
    error?.response?.data?.message || error?.message || fallback;