import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PollroomComponent } from './pollroom/pollroom.component';
import { Room } from './room';
import { Question } from './question';

export class WebSocketAPI {
    //Dwa serwery
    //private webSocketEndPoint: string = 'http://localhost:8080/connect';
    //Jeden serwer
    private webSocketEndPoint: string = '/connect';
    private stompClient: any;
    private stompClient2: any;
    
    constructor(private pollroomComponent: PollroomComponent, private room: Room){}
    
    connect() {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        this.stompClient2 = Stomp.over(ws);

        const _this = this;
        
        _this.stompClient.connect({}, function (frame) {

            // jak sa 2 subscribe to nie widzi drugiego
            _this.stompClient.subscribe("/room/"+_this.room.id+"/users", function (message) {
                _this.pollroomComponent.setNumberOfUsers(JSON.parse(message.body).content);
            });
            _this.stompClient.send("/instant-polls/poll/"+_this.room.id+"/enter",{},{});
            

        }, this.errorCallBack);

       /* _this.stompClient2.connect({}, function (frame) {

            _this.stompClient2.subscribe("/room/"+_this.room.id,+"/questions", function (message) {
                alert("here!");
                alert(JSON.parse(message.body).content);
            });
        }, this.errorCallBack);
*/
    };

    addQuestion(questionType : string, question : string, answers : string) {
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