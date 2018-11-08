
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

/*
  Generated class for the ConfirmLight page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-confirm-light',
    templateUrl: 'confirm-light.html'
})
export class ConfirmLightPage {

    constructor(private databaseService: DatabaseService, private lightService: LightService, private authService: AuthService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad ConfirmLightPage');
    }

    radioBad() {

        if (this.lightService.light.sms != '') {
            this.lightGood();
        } else {
            console.log("radio bad");
            let confirm = this.alertCtrl.create({
                title: 'Radio Bad Config',
                message: 'If your master light is flashing but your slave light is not, you probably have a bad radio connection.  Please make sure your slave light has a unobstructed view less than 300ft and resend the connection code.',
                buttons: [{
                    text: 'Cancel',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'Resend',
                    handler: () => {
                        console.log('Agree clicked');
                        this.lightBad();
                    }
                }]
            });
            confirm.present();
        }
    }

    lightGood() {
        console.log("bad light");
        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        if (this.lightService.light.sms == '') {
            var id = this.lightService.specificLightId;
            var sms = this.lightService.specificLight.sms
            var slave = true;
        } else {
            id = this.lightService.lightId;
            sms = this.lightService.light.sms;
            slave = false;
        }

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, id, sms, '_2_$')
                    .subscribe(
                        (data) => {

                            if (data == null) {

                                loading.dismiss();
                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == true) {

                                loading.dismiss();
                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "There was an error.",
                                    buttons: ['ok']
                                });

                                alert.present();

                            } else if (data.a == false) {

                                this.databaseService.saveLightToUser(token)
                                    .subscribe(
                                        (data) => {
                                            console.log(data);

                                            this.databaseService.markLightAsUsed(token, this.lightService.lightId)
                                                .subscribe(
                                                    (data) => {

                                                        console.log("works");
                                                        console.log(data);

                                                    },
                                                    (err) => {

                                                        console.log(err);
                                                    }
                                                );

                                            if (slave) {
                                                this.databaseService.saveSlaveToMaster(token)
                                                    .subscribe(
                                                        (data) => {
                                                            console.log(data);

                                                        },
                                                        (err) => {

                                                            console.log(err);
                                                        }
                                                    );
                                            }
                                            loading.dismiss();
                                            const alert = this.alertCtrl.create({
                                                title: 'Light Connected Successfully!',
                                                message: "This light is now part of your network!",
                                                buttons: ['ok']
                                            });
                                            alert.present();
                                            this.navCtrl.popToRoot();
                                        },
                                        (error) => {
                                            loading.dismiss();
                                            const alert = this.alertCtrl.create({
                                                title: 'Light Could not be connected!',
                                                message: "Please check your network connection and try again.",
                                                buttons: ['ok']
                                            });
                                            alert.present();
                                        });

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

    lightBad() {
        console.log("bad light");
        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        if (this.lightService.light.sms == '') {
            var id = this.lightService.specificLightId;
            var sms = this.lightService.specificLight.sms;
            var message = "_7_2_$";
        } else {
            id = this.lightService.lightId;
            sms = this.lightService.light.sms;
            message = "_1_$"
        }

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, id, sms, message)
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "Fatal Error, please start over.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == true) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "There was an error.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.a == false) {

                                const alert = this.alertCtrl.create({
                                    title: 'Connection Reset',
                                    message: "A connection command has been re-sent. Please check the status of the light again.",
                                    buttons: ['ok']
                                });
                                alert.present();
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
