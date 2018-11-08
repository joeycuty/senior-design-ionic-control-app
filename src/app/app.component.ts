import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { SigninPage } from '../pages/signin/signin';


import { AuthService } from "../services/auth";

import firebase from "firebase";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;
    signinPage = SigninPage;
    homePage = HomePage;
    isAuthenticated = false;
    @ViewChild('nav') nav: NavController

    constructor(platform: Platform, private menuCtrl: MenuController, private authService: AuthService) {
        var config = {
            // removed private data.
        };
        firebase.initializeApp(config);
        firebase.auth().onAuthStateChanged((user)=>{
          if(user){
             this.isAuthenticated = true;
             //this.rootPage = this.homePage;
             this.nav.setRoot(HomePage);
          }
          else
          {
            this.isAuthenticated = false;
            //this.rootPage = this.signinPage;
            this.nav.setRoot(SigninPage);
          }
        });
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    onLoad(page: any) {
        this.nav.setRoot(page);
        this.menuCtrl.close();
    }

    onSignout()
    {
      this.authService.signout()
      .then((data) => { this.menuCtrl.close(); })
      .catch((error) => { this.menuCtrl.close(); })
    }
}
