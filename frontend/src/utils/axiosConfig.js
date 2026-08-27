import axios from 'axios';

// In development CRA's proxy handles relative API calls.  In production this
// points every request at the deployed Express service instead.
axios.defaults.baseURL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
axios.defaults.withCredentials = true;

export default axios;
