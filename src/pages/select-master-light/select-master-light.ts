import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";
import { ConfirmLightPage } from '../confirm-light/confirm-light';

/*
  Generated class for the SelectMasterLight page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-select-master-light',
    templateUrl: 'select-master-light.html'
})

export class SelectMasterLightPage {

    constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private databaseService: DatabaseService, private authService: AuthService, private lightService: LightService, public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SelectMasterLightPage');
    }

    selectLight(id) {
        console.log(id);
        this.lightService.setSpecificLight(id, 'master');

        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, id, this.lightService.specificLight.sms, '_7_2_$')
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

                                this.navCtrl.push(ConfirmLightPage);
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
