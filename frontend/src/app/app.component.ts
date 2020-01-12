import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    var lang = localStorage.getItem('lang');
    if(lang != null)
      this.translate.use(lang); 
}

  ngOnInit() {
  }

  useLanguage(language: string) {
    this.translate.use(language);
    localStorage.setItem("lang",language)
}
}
