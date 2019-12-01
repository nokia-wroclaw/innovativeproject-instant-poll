import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
                document.getElementById("roomName").innerHTML = this.room.roomName;
                document.getElementById("expire-date").innerHTML = "Pokój ważny do: " + this.room.expirationDate;
                document.getElementById("shortLink").innerHTML = "Link: " + this.shortLink;
                if (this.room.token === localStorage.getItem("token")) {
                    this.admin = true;
                }
                this.webSocketAPI = new WebSocketAPI(this, this.room);
                this.webSocketAPI.connect();

                this.navbarTitleService.setNavbarTitle(this.room.roomName);
            });
        });
    }

    @HostListener('window:beforeunload', ['$event'])
    unloadHandler(event) {
        if (this.room !== null && this.room !== undefined) {
            this.webSocketAPI.disconnect();
        }
    }

    ngOnDestroy() {
        if (this.room !== null && this.room !== undefined) {
            this.webSocketAPI.disconnect();
        }
    }

    closeRoom() {
        this.confirmationDialogService.confirm('Potwierdzenie', 'Czy na pewno chcesz zamknąć pokój? Stracisz wszystkie niezapisane dane i nie będziesz mógł wrócić  do pokoju.', "Zamknij pokój", "Cofnij")
            .then((confirmed) => {
                if (confirmed) {
                    var token = localStorage.getItem("token");
                    this.backendService.closeRoom(this.room.id, token).subscribe();
                    this.webSocketAPI.disconnect();
                    this.router.navigate(['rooms']);
                }
            }).catch(() => { });
    }

    setNumberOfUsers(users: string) {
        document.getElementById("users").innerHTML = "Użytkowników w pokoju: " + users;
        this.ifConnecting = false;
    }

    questionPanel() {
        this.opened = !this.opened;
    }

    sendQuestion() {
        this.submitted = true;
        if ((<HTMLInputElement>document.getElementById("question")).value.length !== 0) {
            this.confirmationDialogService.confirm('Potwierdzenie', 'Czy na pewno chcesz zadać to pytanie?.', "Zadaj", "Cofnij")
                .then((confirmed) => {
                    if (confirmed) {
                        var question = (<HTMLInputElement>document.getElementById("question")).value
                        this.webSocketAPI.addQuestion("yesNo",question,[]);
                    }
                }).catch(() => { });
        }
    }

    receiveQuestion(question: Question) {
        this.questions.push(question);
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
                    //usuwanie
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
    }

    addQuestions(listOfQuestion: Array<Question>) {
        this.questions = listOfQuestion;
    }

    generateShortLink(link: string) {
        var regex = new RegExp("pollroom\/.*$", "i");
        var regex2 = new RegExp(".*\/\/","i");
        this.shortLink = link.replace(regex,"join/"+this.room.shortId).replace(regex2,"");
    }

    showQr() {
        var qrCode = document.getElementById("qr").getElementsByClassName("qrcode")[0].getElementsByTagName('img')[0].src;
        this.imageDialogService.show('QR kod', qrCode);
    }
}
