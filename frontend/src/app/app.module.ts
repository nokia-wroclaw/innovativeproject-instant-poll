import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { TestingConnectionServiceService } from '../app/testing-connection-service.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";

import { NavbarComponent } from './navbar/navbar.component';
import { PollroomComponent } from './pollroom/pollroom.component';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PollroomComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomepageComponent },
      { path: 'pollroom', component: PollroomComponent },
    ])
  ],
  providers: [TestingConnectionServiceService,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]

})
export class AppModule { }
