import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';

import { AppComponent } from './app.component';
import { BookingComponent } from './booking/booking.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SuccesComponent } from './succes/succes.component';


@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    HomeComponent,
    HeaderComponent,
    SuccesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    AngularMyDatePickerModule,

    ],
  providers: [],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
