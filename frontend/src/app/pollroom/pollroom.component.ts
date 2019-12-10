import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { BackendConnectionService } from "../backend-connection.service";
import { Observable } from 'rxjs/internal/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { Room } from '../room';
import { WebSocketAPI } from '../WebSocketAPI';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { ImageDialogService } from '../image-dialog/image-dialog.service';
import { Title } from "@angular/platform-browser";
import { NgModel } from '@angular/forms';
import { Question } from '../question';
import { TouchSequence } from 'selenium-webdriver';
import {NavbarTitleService} from "../navbar-title.service";
import { isNgTemplate } from '@angular/compiler';

@Component({
    selector: 'app-pollroom',
    templateUrl: './pollroom.component.html',
    styleUrls: ['./pollroom.component.css']
})

export class PollroomComponent implements OnInit, OnDestroy {

    private room: Room;
    private admin: boolean;
    private opened: boolean;
    private webSocketAPI: WebSocketAPI;
    private question: NgModel;
    private submitted = false;
    private ifConnecting = true;
    private questions: Array<Question>;
    private shortLink: string;
    private numberOfUsers = '0';
    private chartTrigger = 0;

    constructor(private backendService: BackendConnectionService,
        private router: Router, private route: ActivatedRoute,
        private confirmationDialogService: ConfirmationDialogService,
        private imageDialogService: ImageDialogService,
        private titleService: Title,
        private navbarTitleService: NavbarTitleService) { }

    ngOnInit() {
        this.titleService.setTitle("Instant Polls - Pokój");
        this.admin = false;
        this.questions = [];
        if (localStorage.getItem("user_id") === null) {
            this.backendService.generateUserId().subscribe(r => {
                localStorage.setItem("user_id", r['user_id']);
            });
        }
        this.route.params.subscribe(params => {
            this.backendService.getRoom(params['id']).subscribe(r => {
                this.room = r;
                if (this.room === null) {
                    this.router.navigate(['/join']);
                    return;
                }
                this.generateShortLink(window.location.href)
                if (this.room.token === localStorage.getItem("token")) {
                    this.admin = true;
                }
                this.webSocketAPI = new WebSocketAPI(this, this.room);
                this.webSocketAPI.connect();
                this.navbarTitleService.setNavbarTitle(this.room.roomName);
                this.updateLatestJoinedRooms(this.room.id);
            });
        });

    }

    ngOnDestroy() {
        this.navbarTitleService.setNavbarTitle('');
    }

    closeRoom() {
        this.confirmationDialogService.confirm('Potwierdzenie', 'Czy na pewno chcesz zamknąć pokój? Stracisz wszystkie niezapisane dane i nie będziesz mógł wrócić  do pokoju.', "Zamknij pokój", "Cofnij")
            .then((confirmed) => {
                if (confirmed) {
                    var token = localStorage.getItem("token");
                    this.backendService.closeRoom(this.room.id, token).subscribe(response => {
                        this.webSocketAPI.disconnect();
                        this.router.navigate(['rooms']);
                    });
                }
            }).catch(() => { });
    }

    setNumberOfUsers(users: string) {
        this.numberOfUsers = users;
        this.ifConnecting = false;
        this.navbarTitleService.setNavbarNumberOfUsers(this.numberOfUsers);
    }

    questionPanel() {
        this.opened = !this.opened;
    }

    sendQuestion() {
        this.submitted = true;
        if ((<HTMLInputElement>document.getElementById("question")).value.length !== 0) {
            this.confirmationDialogService.confirm('Potwierdzenie', 'Czy na pewno chcesz zadać to pytanie?', "Zadaj", "Cofnij")
                .then((confirmed) => {
                    if (confirmed) {
                        var question = (<HTMLInputElement>document.getElementById("question")).value
                        this.webSocketAPI.addQuestion("yesNo",question,[]);
                    }
                }).catch(() => { });
        }
    }

    receiveQuestion(question: Question) {
        if(question.action === "delete") {
            this.questions = this.questions.filter(function(item) {
                return question.id !== item.id;
            });
        } else {
            this.questions.push(question);
        }

    }

    hideQuestion(question: Question) {
        question.hidden = !question.hidden;
        var element = document.getElementById(question.id+"");
        if(question.hidden) {
            element.classList.replace("fa-angle-down","fa-angle-up");
        } else {
            element.classList.replace("fa-angle-up","fa-angle-down");
        }

    }
    deleteQuestion(question: Question) {
        this.confirmationDialogService.confirm('Potwierdzenie', 'Czy na pewno chcesz usunąć pytanie?', "Usuń pytanie", "Cofnij")
            .then((confirmed) => {
                if (confirmed) {
                    this.webSocketAPI.deleteQuestion(question.id);
                }
            }).catch(() => { });
    }

    sendAnswer(question: Question) {
        if(question.selected === undefined) {
            alert("Nie udzielono odpowiedzi!");
        } else {
            var answer = {
                user_id: localStorage.getItem("user_id"),
                question_id: question.id,
                answer: question.selected
            }
            this.webSocketAPI.sendAnswer(JSON.stringify(answer));
        }
    }

    receiveAnswer(answer: any) {
        this.questions.forEach(element => {
            if(element.id == answer.question_id) {
                element.numberOfVotes = answer.numberOfVotes;
                return;
            }
        });
        this.chartTrigger++;
    }

    addQuestions(listOfQuestion: Array<Question>) {
        this.questions = listOfQuestion;
    }

    generateShortLink(link: string) {
        var regex = new RegExp("/#/pollroom\/.*$", "i");
        var regex2 = new RegExp(".*\/\/","i");
        this.shortLink = link.replace(regex,"/j/"+this.room.shortId).replace(regex2,"");
    }

    showQr() {
        var qrCode = document.getElementById("qr").getElementsByClassName("qrcode")[0].getElementsByTagName('img')[0].src;
        this.imageDialogService.show(this.shortLink, qrCode);
    }

    updateLatestJoinedRooms(room_id: string) {
        var latest = [];
        if(localStorage.getItem("latests") === null) {
            latest = [];
        } else {
            latest = Array.from(JSON.parse(localStorage.getItem("latests")));
        }
        latest = latest.filter(id => id !== room_id);
        latest.push(room_id);
        if(latest.length > 5) {
            latest.shift();
        }
        localStorage.setItem("latests",JSON.stringify(latest));
    }
}
