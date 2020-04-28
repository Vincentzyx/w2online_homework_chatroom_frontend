import SocketIO from 'socket.io-client';

let socket = {
    connect(url = "") {
        this.io = SocketIO(url);
    }
}

export default socket;