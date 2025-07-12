import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';


class SocketService{
  socket = null;

  connect(){
    console.log("trying to activate socket.");
    if (this.socket && this.socket.active){
      this.socket.deactivate();
    }
  
    let accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) return;
  
    this.socket = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_BACKEND_URL + "/ws?token=" + accessToken),
      connectHeaders: {
        "Authorization" : "Bearer " + accessToken,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("Websocket connected.", frame);
      },
      onStompError: (frame) => {
        console.log("Websocket error while connecting.", frame);
      }
    })
  
    this.socket.activate();
  }

  disconnect(){
    console.log("trying to deactivate socket.");
    if (this.socket && this.socket.active){
      console.log("deactivating socket.");
      this.socket.deactivate();
    }
  }

  subscribePrivate(onMessageReceived){
    if (!this.socket || !this.socket.active){
      console.log("subscribing before stompclient is connected.");
      return null;
    }
  
    return this.socket.subscribe("/user/queue/message", onMessageReceived);
  }

  sendPrivateMessage(data){
    if (!this.socket || !this.socket.active){
      console.log("sending before stompclient is connected.");
      return null;
    }
  
    this.socket.publish({
      destination: "/app/private-chat", 
      body: JSON.stringify(data)});
  }

  sendGroupMessage(data){
    if (!this.socket || !this.socket.active){
      console.log("sending before stompclient is connected.");
      return null;
    }

    this.socket.publish({
      destination: "/app/group-chat",
      body: JSON.stringify(data)
    });
  }

  subscribeGroupMessage(groupName, onMessageReceived){
    this.socket.subscribe("/topic/group/"+groupName, onMessageReceived);
  }

  getSocket(){
    return this.socket;
  }
}

export default new SocketService();