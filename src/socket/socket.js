import SockJS from 'sockjs-client/dist/sockjs';
import Stomp from 'stompjs';

// Append token as query param
let socket = null;
let stompClient = null;

export const connectSocket = () => {
  if (stompClient && stompClient.connected){
    stompClient.disconnect();
  }

  let accessToken = localStorage.getItem("accessToken");

  socket = new SockJS(import.meta.env.VITE_BACKEND_URL + "/ws?token=" + accessToken);
  stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log("Socket is connected", frame)


  }, (error) => {
    console.log("Error while connecting websocket.", error);
  })

} 

export const disconnectSocket = () => {
  if (stompClient && stompClient.connected){
    stompClient.disconnect();
  }
}