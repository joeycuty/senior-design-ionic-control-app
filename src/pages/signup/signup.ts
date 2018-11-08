import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { LoadingController, AlertController, NavController } from "ionic-angular";

import { AuthService } from "../../services/auth";

/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
	constructor(private navCtrl: NavController, private authService: AuthService, private loadingCtrl: LoadingController, private alertaCtrl: AlertController){}

  onSignup( form : NgForm ) {
  	console.log(form.value);

  	const loading = this.loadingCtrl.create({
  		content: "Registering..."
  	})

  	loading.present();
  	this.authService.signup(form.value.email, form.value.password)
  	.then(
  		(data)=>{
  		 	console.log(data); 
  		 	loading.dismiss();

  		 	const alert = this.alertaCtrl.create({
  		 		title: 'Registation Successful!',
  		 		message: "you may now login with your email and password!",
  		 		buttons: ['ok']
  		 	});
  		 	alert.present();


  		})
  	.catch(
  		(error)=>{
  		 	console.log(error);
  		 	loading.dismiss();
  		 	const alert = this.alertaCtrl.create({
  		 		title: 'Registration Failed!',
  		 		message: error.message,
  		 		buttons: ['ok']
  		 	});
  		 	alert.present();
  		})


  }

}
