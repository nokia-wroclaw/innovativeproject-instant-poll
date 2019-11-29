import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PollroomComponent } from './pollroom/pollroom.component';
import { Room } from './room';
import { Question } from './question';

export class WebSocketAPI {
    //Dwa serwery
    private webSocketEndPoint: string = 'http://localhost:8080/connect';
    //Jeden serwer
    //private webSocketEndPoint: string = '/connect';
    private stompClient: any;
    
    constructor(private pollroomComponent: PollroomComponent, private room: Room){}
    
    connect() {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);

        const _this = this;
        
        _this.stompClient.connect({}, function () {
            _this.stompClient.subscribe("/room/"+_this.room.id+"/users", function (message) {
                _this.pollroomComponent.setNumberOfUsers(JSON.parse(message.body).content);
            });
            _this.stompClient.subscribe("/question/"+_this.room.id+"/questions", function (message) {
                _this.pollroomComponent.receiveQuestion(JSON.parse(message.body));
            });
            _this.stompClient.send("/instant-polls/poll/"+_this.room.id+"/enter",{},{});
        }, this.errorCallBack);
    };

    addQuestion(questionType : string, question : string, answers : Array<string>) {
        if (this.stompClient !== null) {
            var message = JSON.stringify({question: question, answers : answers});
            this.stompClient.send("/instant-polls/poll/"+this.room.id+"/addQuestion/" + questionType,{},message);
        }
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.send("/instant-polls/poll/"+this.room.id+"/exit",{},{});
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