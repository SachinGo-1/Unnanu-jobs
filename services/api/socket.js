import openSocket from 'socket.io-client';
import urls from 'services/api/urls';

const  socket = openSocket(urls.Socket);

function SocketListner(token, cb) {
	if (token) {
		const tokenData = { AuthToken: token, UserType: 1 };
		socket.emit('AuthorizationToken', tokenData);
	  socket.on('MessageReceived', data => cb(data));
	  socket.on('InterviewReceived', data => cb(data));
	  socket.on('ReceivedPostponeInterview', data => cb(data));
	  socket.on('NewJobOffer', data => cb(data));
	  socket.on('ReceiveOnboard', data => cb(data));
	  socket.on('offerMarkAsRead', data => cb(data));
	  socket.on('MarkAsReadMessage', data => cb(data));
	}
}

export { SocketListner };