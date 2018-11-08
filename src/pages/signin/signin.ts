import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, NavController } from "ionic-angular";

import { AuthService } from "../../services/auth";
import { SignupPage } from '../signup/signup';
/*
  Generated class for the Signin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html'
})
export class SigninPage {

    constructor(private navCtrl: NavController, private authService: AuthService, private loadingCtrl: LoadingController, private alertaCtrl: AlertController) {}

    onSignin(form: NgForm) {

        console.log(form.value);

        const loading = this.loadingCtrl.create({
            content: "Signing In..."
        })

        loading.present();
        this.authService.signin(form.value.email, form.value.password)
            .then(
                (data) => {
                    console.log(data);
                    loading.dismiss();


                })
            .catch(
                (error) => {
                    console.log(error);
                    loading.dismiss();
                    const alert = this.alertaCtrl.create({
                        title: 'Sign In Failed!',
                        message: error.message,
                        buttons: ['ok']
                    });
                    alert.present();
                })

    }

    register() {
        this.navCtrl.push(SignupPage);
    }

}
