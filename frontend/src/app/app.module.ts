import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { BackendConnectionService } from "../app/backend-connection.service";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from "@angular/router";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { ChartsModule } from 'ng2-charts';

import { NavbarComponent } from './navbar/navbar.component';
import { PollroomComponent } from './pollroom/pollroom.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { JoinRoomComponent } from './join-room/join-room.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { ImageDialogService } from './image-dialog/image-dialog.service';
import {NavbarTitleService} from "./navbar-title.service";
import { ChartComponent } from './chart/chart.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PollroomComponent,
    HomepageComponent,
    RoomsComponent,
    ConfirmationDialogComponent,
    JoinRoomComponent,
    ImageDialogComponent,
    ChartComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule,
    NgxQRCodeModule,
    RouterModule.forRoot([
      { path: '', component: HomepageComponent },
      { path: 'pollroom/:id', component: PollroomComponent },
      { path: 'rooms', component: RoomsComponent },
      { path: 'join', component: JoinRoomComponent}
    ]),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [ConfirmationDialogService,ImageDialogService,NavbarTitleService,BackendConnectionService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
  entryComponents: [ ConfirmationDialogComponent, ImageDialogComponent ]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}