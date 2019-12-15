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
    
    constructor(private pollroomComponent: PollroomComponent, private room: Room){}
    
    connect() {
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);

        const _this = this;
        
        _this.stompClient.connect({}, function () {
            _this.stompClient.subscribe("/room/"+_this.room.id+"/users", function (message) {
                _this.pollroomComponent.setNumberOfUsers(JSON.parse(message.body).content);
            });
            _this.stompClient.subscribe("/question/"+_this.room.id, function (message) {
                _this.pollroomComponent.receiveQuestion(JSON.parse(message.body));
            });
            _this.stompClient.subscribe("/answer/"+_this.room.id, function (message) {
                _this.pollroomComponent.receiveAnswer(JSON.parse(message.body));
            });
            _this.stompClient.subscribe("/user/"+localStorage.getItem("user_id")+"/allQuestions", function (message) {
                _this.pollroomComponent.addQuestions(JSON.parse(message.body));
            });

        }, this.errorCallBack);
    };


    addQuestion(questionType : string, question : string, answers : Array<string>) {
        if (this.stompClient !== null) {
            var message = JSON.stringify({question: question, answers : answers});
            this.stompClient.send("/instant-polls/poll/"+this.room.id+"/addQuestion/" + questionType,{},message);
        }
    }

    deleteQuestion(questionId : number) {
        if (this.stompClient !== null) {
            var id = questionId.toString();
            var message = JSON.stringify({id: id, action : "delete"});
            this.stompClient.send("/instant-polls/poll/"+this.room.id+"/"+localStorage.getItem("token")+"/deleteQuestion",{},message);
        }
    }

    sendAnswer(answer: string) {
        if (this.stompClient !== null) {
            this.stompClient.send("/instant-polls/poll/"+this.room.id+"/answer",{},answer);
        }
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
    }
    
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    getQuestions() {
        this.stompClient.send("/instant-polls/poll/"+localStorage.getItem("user_id")+"/allQuestions",{},this.room.id);
    }
    
    getNumberOfUsers() {
        this.stompClient.send("/instant-polls/poll/"+this.room.id+"/enter",{},localStorage.getItem("user_id"));
    }
}