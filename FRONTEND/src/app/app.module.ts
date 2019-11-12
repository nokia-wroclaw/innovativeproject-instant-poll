import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { TestingConnectionServiceService } from '../app/testing-connection-service.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";

import { NavbarComponent } from './navbar/navbar.component';
import { NewpollComponent } from './newpoll/newpoll.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ChartsComponent } from './charts/charts.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NewpollComponent,
    HomepageComponent,
    ChartsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomepageComponent },
      { path: 'newpoll', component: NewpollComponent },
      { path: 'charts', component: ChartsComponent },
    ])
  ],
  providers: [TestingConnectionServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
