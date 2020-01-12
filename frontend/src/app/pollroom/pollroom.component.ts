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
import { Action } from '../action';
import { TouchSequence } from 'selenium-webdriver';
import { NavbarTitleService } from "../navbar-title.service";
import { isNgTemplate } from '@angular/compiler';
import { trigger, style, animate, transition } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-pollroom',
    animations: [
        trigger(
            'inOutAnimationDetails',
            [
                transition(
                    ':enter', [
                    style({ opacity: 0 }),
                    animate('500ms', style({ opacity: 1 }))
                ]
                )
            ]
        ),
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter', [
                    style({ transform: 'translateY(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateY(0%)', opacity: 1 }))
                ]
                ),
                transition(
                    ':leave', [
                    style({ transform: 'translateY(0%)', opacity: 1 }),
                    animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
                ]
                )
            ]
        ),
    ],
    templateUrl: './pollroom.component.html',
    styleUrls: ['./pollroom.component.css']
})

export class PollroomComponent implements OnInit, OnDestroy {

    private room: Room;
    private admin: boolean;
    private opened: boolean;
    private webSocketAPI: WebSocketAPI;
    private emptyQuestion = false;
    private emptyAnswer = false;
    private notEnoughtAnswers = false;
    private ifConnecting = true;
    private questions: Array<Question>;
    private shortLink: string;
    private numberOfUsers = '0';
    private chartTrigger = 0;
    private ifQuestionsReceived = false;
    private ifUsersInfoReceived = false;
    private type = 1;
    private answers = [];
    private from = 0;
    private to = 10;
    private openedPDFPanel = false;
    private allToGenerate = false;

    constructor(private backendService: BackendConnectionService,
        private router: Router, private route: ActivatedRoute,
        private confirmationDialogService: ConfirmationDialogService,
        private imageDialogService: ImageDialogService,
        private titleService: Title,
        private navbarTitleService: NavbarTitleService,
        private translate: TranslateService
    ) { }


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
                    this.router.navigate(['/join'], {
                        state: { error: "Pokój nie istnieje" }
                    });
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

                var _this = this;
                const time = setInterval(function () {
                    if (this.room != null && _this.ifQuestionsReceived && _this.ifUsersInfoReceived)
                        clearInterval(time)
                    else {
                        if (!_this.ifQuestionsReceived) {
                            _this.webSocketAPI.getQuestions();
                            if (_this.admin)
                                _this.showQr();
                        }
                        if (!_this.ifUsersInfoReceived)
                            _this.webSocketAPI.getNumberOfUsers();
                    }
                }, 1000);
            });
        });


    }

    ngOnDestroy() {
        this.navbarTitleService.setNavbarTitle('');
        if (this.webSocketAPI !== null && this.webSocketAPI !== undefined) {
            this.webSocketAPI.disconnect();
        }
    }

    closeRoom() {
        var title, message, yesButton, noButton;
        this.translate.get('image-dialog.title').subscribe(res => { title = res; });
        this.translate.get('image-dialog.close-message').subscribe(res => { message = res; });
        this.translate.get('image-dialog.yes-button').subscribe(res => { yesButton = res; });
        this.translate.get('pollroom.admin.generatePDF').subscribe(res => { noButton = res; });
        this.confirmationDialogService.confirm(title, message, yesButton, noButton)
            .then((confirmed) => {
                if (confirmed) {
                    var token = localStorage.getItem("token");
                    this.backendService.closeRoom(this.room.id, token).subscribe(response => {
                        this.webSocketAPI.disconnect();
                        this.router.navigate(['rooms']);
                    });
                } else {
                    this.openedPDFPanel = true;
                }
            }).catch(() => { });
    }

    setNumberOfUsers(users: string) {
        this.ifUsersInfoReceived = true;
        this.numberOfUsers = users;
        this.ifConnecting = false;
        this.navbarTitleService.setNavbarNumberOfUsers(this.numberOfUsers);
    }

    questionPanel() {
        this.type = 1;
        this.emptyQuestion = false;
        this.opened = !this.opened;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    sendQuestion() {
        if (this.type == 2 && this.answers.length < 2) {
            this.notEnoughtAnswers = true;
        } else {
            if ((<HTMLInputElement>document.getElementById("question")).value.length !== 0) {
                this.emptyQuestion = false;
                this.emptyAnswer = false;

                var title, message, yesButton, noButton;
                this.translate.get('image-dialog.title').subscribe(res => { title = res; });
                this.translate.get('image-dialog.ask-message').subscribe(res => { message = res; });
                this.translate.get('image-dialog.ask').subscribe(res => { yesButton = res; });
                this.translate.get('image-dialog.no-button').subscribe(res => { noButton = res; });
                this.confirmationDialogService.confirm(title, message, yesButton, noButton)
                    .then((confirmed) => {
                        if (confirmed && this.type == 1) {
                            var question = (<HTMLInputElement>document.getElementById("question")).value;
                            var yesNo = [];
                            this.translate.get("pollroom.yes").subscribe(ele => yesNo.push(ele));
                            this.translate.get("pollroom.no").subscribe(ele => yesNo.push(ele));
                            this.webSocketAPI.addQuestion("yesNo", question, yesNo);
                            (<HTMLInputElement>document.getElementById("question")).value = "";
                        } else if (confirmed && this.type == 2) {
                            var question = (<HTMLInputElement>document.getElementById("question")).value;
                            var answersToSend = [];
                            this.answers.forEach(answer => {
                                answersToSend.push(answer.answer);
                            });
                            this.answers = [];
                            if ((<HTMLInputElement>document.getElementById("multiple")).checked) {
                                this.webSocketAPI.addQuestion("optionsMultiple", question, answersToSend);
                            } else {
                                this.webSocketAPI.addQuestion("optionsSingle", question, answersToSend);
                            }
                            (<HTMLInputElement>document.getElementById("question")).value = "";
                            this.notEnoughtAnswers = false;
                        } else if (confirmed && this.type == 3) {
                            if (this.to >= this.from) {
                                var question = (<HTMLInputElement>document.getElementById("question")).value;
                                this.webSocketAPI.addQuestion("rate", question, [(this.from).toString(), (this.to).toString()]);
                                this.from = 0;
                                this.to = 10;
                                (<HTMLInputElement>document.getElementById("question")).value = "";
                            }
                        }
                    }).catch(() => { });
            } else {
                this.emptyQuestion = true;
            }
        }
    }

    hideResults(question: Question) {
        var action = {
            questionId: question.id,
            hiddenResults: !question.hiddenResults,
            active: question.active,
            numberOfVotes: []
        }
        this.webSocketAPI.sendAction(action);
    }

    freezeQuestion(question: Question) {
        var action = {
            questionId: question.id,
            hiddenResults: question.hiddenResults,
            active: !question.active,
            numberOfVotes: []
        }
        this.webSocketAPI.sendAction(action);
        question.active = !question.active;
    }

    receiveAction(action: Action) {
        var question = this.questions.find(function (item) {
            return action.questionId == item.id;
        });

        if(!action.hiddenResults && question.hiddenResults)
            question.numberOfVotes = action.numberOfVotes;
  
        question.active = action.active
        question.hiddenResults = action.hiddenResults

    }

    receiveQuestion(question: Question) {
        if (question.action === "delete") {
            this.questions = this.questions.filter(function (item) {
                return question.id !== item.id;
            });
        } else {
            question.active = true;
            question.hiddenResults = false;
            this.questions.push(question);
        }

    }

    hideQuestion(question: Question) {
        question.hidden = !question.hidden;
        var element = document.getElementById(question.id + "");

        if (question.hidden) {
            element.classList.replace("fa-angle-down", "fa-angle-up");
        } else {
            element.classList.replace("fa-angle-up", "fa-angle-down");
        }

    }

    deleteQuestion(question: Question) {
        var title, message, yesButton, noButton;
        this.translate.get('image-dialog.title').subscribe(res => { title = res; });
        this.translate.get('image-dialog.delete-message').subscribe(res => { message = res; });
        this.translate.get('image-dialog.delete').subscribe(res => { yesButton = res; });
        this.translate.get('image-dialog.no-button').subscribe(res => { noButton = res; });
        this.confirmationDialogService.confirm(title, message, yesButton, noButton)
            .then((confirmed) => {
                if (confirmed) {
                    this.webSocketAPI.deleteQuestion(question.id);
                }
            }).catch(() => { });
    }

    sendAnswer(question: Question) {
        if (question.selected === undefined) {
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

    selectAnswer(question: Question, id: number) {
        if (question.type === "optionsMultiple") {
            if (question.selected.includes(id)) {
                question.selected.splice(question.selected.indexOf(id), 1);
            } else {
                question.selected.push(id);
            }
        } else {
            question.selected = [id];
        }

    }

    receiveAnswer(answer: any) {
        this.questions.forEach(element => {
            if (element.id == answer.question_id) {
                element.numberOfVotes = answer.numberOfVotes;
                return;
            }
        });
        this.chartTrigger++;
    }

    addQuestions(listOfQuestion: Array<Question>) {
        this.questions = listOfQuestion;
        this.ifQuestionsReceived = true;
    }

    generateShortLink(link: string) {
        var regex = new RegExp("/#/pollroom\/.*$", "i");
        var regex2 = new RegExp(".*\/\/", "i");
        this.shortLink = link.replace(regex, "/j/" + this.room.shortId).replace(regex2, "");
    }

    showQr() {
        var qrCode = document.getElementById("qr").getElementsByClassName("qrcode")[0].getElementsByTagName('img')[0].src;
        this.imageDialogService.show(this.shortLink, qrCode);
    }

    updateLatestJoinedRooms(room_id: string) {
        var latest = [];
        if (localStorage.getItem("latests") === null) {
            latest = [];
        } else {
            latest = Array.from(JSON.parse(localStorage.getItem("latests")));
        }
        latest = latest.filter(id => id !== room_id);
        latest.push(room_id);
        if (latest.length > 5) {
            latest.shift();
        }
        localStorage.setItem("latests", JSON.stringify(latest));
    }

    changeType(type: number) {
        this.type = type;
        this.emptyQuestion = false;
        this.emptyAnswer = false;
        switch (type) {
            case 1:
                document.getElementById("yesNo").classList.add("active");
                document.getElementById("options").classList.remove("active");
                document.getElementById("rate").classList.remove("active");
                break;
            case 2:
                document.getElementById("yesNo").classList.remove("active");
                document.getElementById("options").classList.add("active");
                document.getElementById("rate").classList.remove("active");
                break;
            case 3:
                document.getElementById("yesNo").classList.remove("active");
                document.getElementById("options").classList.remove("active");
                document.getElementById("rate").classList.add("active");
                break;
        }
    }

    removeAnswer(id: number) {
        var title, message, yesButton, noButton;
        this.translate.get('image-dialog.title').subscribe(res => { title = res; });
        this.translate.get('image-dialog.ans-message').subscribe(res => { message = res; });
        this.translate.get('image-dialog.deleteAns').subscribe(res => { yesButton = res; });
        this.translate.get('image-dialog.no-button').subscribe(res => { noButton = res; });
        this.confirmationDialogService.confirm(title, message, yesButton, noButton)
            .then((confirmed) => {
                if (confirmed) {
                    this.answers = this.answers.filter(function (answer) {
                        return id != answer.id;
                    });
                }
            }).catch(() => { });
    }

    addAnswer() {
        this.notEnoughtAnswers = false;
        if ((<HTMLInputElement>document.getElementById("answer")).value.length != 0) {
            this.emptyAnswer = false;
            var ans = { "id": this.answers.length, "answer": (<HTMLInputElement>document.getElementById("answer")).value };
            this.answers.push(ans);
            (<HTMLInputElement>document.getElementById("answer")).value = "";
        } else {
            this.emptyAnswer = true;
        }
    }

    generatePDF() {
        this.openedPDFPanel = !this.openedPDFPanel;
    }

    openPDF() {
        let docDefinition = {
            footer: {
                text: "Instant Polls App.",
                link: "http://instant-polls.herokuapp.com/#/",
                color: 'blue',
                decoration: 'underline',
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            info: {
              title: this.room.roomName
            },
            styles: {
                question: {
                  fontSize: 18,
                  bold: true,
                  margin: [0, 20, 0, 10]
                }
            },
            content: [
                {
                    text: this.room.roomName,
                    bold: true,
                    fontSize: 20,
                    alignment: 'center',
                    margin: [0, 0, 0, 20],
                },
                this.getQuestionFormatForPDF()
            ],
        }
        pdfMake.createPdf(docDefinition).open();
    }

    getQuestionFormatForPDF() {
        var questionsJSON = [];
        this.questions.forEach(element => {
            if(element.toPDF) {
                    var questionHeader = {text: element.question, style: "question"};
                    var questionTable = {table: {headerRows: 1,widths: [ '*', '*' ],
                    body: this.getTableFormat(element) 
                }};
            questionsJSON.push(questionHeader);
            questionsJSON.push(questionTable);
            }
        });
        return questionsJSON;
    }

    getTableFormat(question: Question) {
        var sum = 0;
        var votes = 0;
        var table = [[]];
        this.translate.get('pollroom.pdf.answer').subscribe(element => table[0].push(element));
        this.translate.get('pollroom.pdf.numberOfVotes').subscribe(element => table[0].push(element));
        for(let i = 0; i < question.answers.length; i++) {
            table.push([question.answers[i],question.numberOfVotes[i].toString()]);
            votes += question.numberOfVotes[i];
            if(question.type === 'rate') {
                sum += parseInt(question.answers[i])*question.numberOfVotes[i];
            }
        }
        if(question.type === 'rate') {
            table.push([]);
            this.translate.get('pollroom.pdf.average').subscribe(element => table[table.length-1].push(element));
            table[table.length-1].push((sum/votes).toString());
        }
        table.push(["",""]);
        table.push([]);
        this.translate.get('pollroom.pdf.totalNumber').subscribe(element => table[table.length-1].push(element));
        table[table.length-1].push(votes.toString());
        return table;
    }

    selectQuestionToPDF(question: Question) {
        question.toPDF = !question.toPDF;
    }

    checkAll() {
        this.allToGenerate = !this.allToGenerate;
        this.questions.forEach(que => {
            que.toPDF = this.allToGenerate;
        });
    }
}
