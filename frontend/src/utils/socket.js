import io from 'socket.io-client';

let socket;
let socketWasAuthenticated = false;

export const getSocket = () => {
    if (!socket) {
        socket = io(
            process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || window.location.origin,
            { withCredentials: true, autoConnect: true }
        );
    }
    return socket;
};

export const syncSocketAuthentication = isAuthenticated => {
    const currentSocket = getSocket();
    if (isAuthenticated && !socketWasAuthenticated) {
        socketWasAuthenticated = true;
        if (currentSocket.connected) currentSocket.disconnect();
        currentSocket.connect();
    }
    if (!isAuthenticated) {
        socketWasAuthenticated = false;
        if (currentSocket.connected) currentSocket.disconnect();
    }
    if (isAuthenticated && !currentSocket.connected) {
        currentSocket.connect();
    }
    return currentSocket;
};
