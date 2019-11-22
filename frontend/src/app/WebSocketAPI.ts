import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PollroomComponent } from './pollroom/pollroom.component';
import { Room } from './room';

export class WebSocketAPI {
    //Dwa serwery
    //private webSocketEndPoint: string = 'http://localhost:8080/connect';
    //Jeden serwer
    private webSocketEndPoint: string = '/connect';
    private stompClient: any;
    
    constructor(private pollroomComponent: PollroomComponent, private room: Room){}
    
    connect() {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe("/room/"+_this.room.id+"/users", function (message) {
                _this.pollroomComponent.setNumberOfUsers(JSON.parse(message.body).content);
            });
            _this.stompClient.send("/poll/poll/"+_this.room.id+"/enter",{},{});
        }, this.errorCallBack);
    };

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.send("/poll/poll/"+this.room.id+"/exit",{},{});
            this.stompClient.disconnect();
        }
    }
    
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this.connect();
        }, 5000);
    }
}