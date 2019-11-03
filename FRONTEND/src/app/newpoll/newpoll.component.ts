import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newpoll',
  templateUrl: './newpoll.component.html',
  styleUrls: ['./newpoll.component.css']
})
export class NewpollComponent implements OnInit {

  Arr = Array;
  num:number = 4;

  add_answer_input() {
    if(this.num < 10){
      this.num++;
    }
  }

  remove_answer_input(){
    if(this.num > 1){
      this.num--;
    }
  }

  constructor() { }

  ngOnInit() {
  }

}
