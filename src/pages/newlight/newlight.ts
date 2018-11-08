import { Component } from '@angular/core';
import { NgForm } from "@angular/forms";
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";

import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

import { SetLightLocationPage } from '../set-light-location/set-light-location';
/*
  Generated class for the Newlight page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-newlight',
    templateUrl: 'newlight.html'
})
export class NewlightPage {

    constructor(private databaseService: DatabaseService, private lightService: LightService, private authService: AuthService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad MapPage');

        const loading = this.loadingCtrl.create({
            content: "Updating Light Data..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLights(token, 'master')
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            this.lightService.userMasterLights = [];
                            this.lightService.userSlaveLights = [];
                            if (data == null) {

                                /*const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();*/
                            } else {

                                for (var j in data) {
                                    data[j]['lightId'] = j;
                                    if (data[j].sms == null) {

                                        this.lightService.userSlaveLights.push(data[j]);
                                    } else {

                                        this.lightService.userMasterLights.push(data[j]);
                                    }
                                }
                            }
                        },
                        (error) => {
                            console.log(error);
                            loading.dismiss();

                            const alert = this.alertCtrl.create({
                                title: 'Error',
                                message: "There was an error connecting to the database.  Please check your network connection and try again.",
                                buttons: ['ok']
                            });
                            alert.present();
                        }
                    );

            })

    }

    onNewLight(form: NgForm) {
        console.log(form.value.light);

        const loading = this.loadingCtrl.create({
            content: "Verifying Light..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLight(token, form.value.light)
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "No light was found.  Please re-enter the light code.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.used == true) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "This light is already in use.  Please re-enter the light code.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.used == false) {

                                if (data.sms != null) {

                                    this.lightService.newLight(form.value.light, data.sms, this.authService.getActiveUser().uid);
                                    this.navCtrl.push(SetLightLocationPage);
                                } else {
                                    if (this.lightService.userMasterLights.length == 0) {

                                        const alert = this.alertCtrl.create({
                                            title: 'Error',
                                            message: "You are trying to install a slave light but do not have any master lights to connect it to.  Please install a master light before installing any slave lights.",
                                            buttons: ['ok']
                                        });
                                        alert.present();
                                    } else {

                                        this.lightService.newLight(form.value.light, '', this.authService.getActiveUser().uid);
                                        this.navCtrl.push(SetLightLocationPage);
                                    }
                                }
                            }

                        },
                        (error) => {
                            console.log(error);
                            loading.dismiss();

                            const alert = this.alertCtrl.create({
                                title: 'Error',
                                message: "There was an error connecting to the database.  Please check your network connection and try again.",
                                buttons: ['ok']
                            });
                            alert.present();
                        }
                    );

            })
    }

}
