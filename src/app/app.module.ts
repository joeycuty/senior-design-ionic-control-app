import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { NewlightPage } from '../pages/newlight/newlight';
import { SetLightLocationPage } from '../pages/set-light-location/set-light-location';
import { MapPage } from '../pages/map/map';
import { SpecificLightPage } from '../pages/specific-light/specific-light';


import { ConfirmLightPage } from '../pages/confirm-light/confirm-light';
import { SelectMasterLightPage } from '../pages/select-master-light/select-master-light';


import { AgmCoreModule } from "angular2-google-maps/core";



import {AuthService } from '../services/auth';
import {LightService } from '../services/light';
import {DatabaseService } from '../services/database';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    NewlightPage,
    MapPage,
    SetLightLocationPage,
    ConfirmLightPage,
    SpecificLightPage,
    SelectMasterLightPage

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbIcwJu8I3kryc6Q5bvY-XYPsFjTqGwVk'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    NewlightPage,
    MapPage,
    SetLightLocationPage,
    ConfirmLightPage,
    SpecificLightPage,
    SelectMasterLightPage
    
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService, LightService, DatabaseService]
})
export class AppModule {}
