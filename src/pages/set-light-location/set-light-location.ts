import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';
import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

import { ConfirmLightPage } from '../confirm-light/confirm-light';
import { SelectMasterLightPage } from '../select-master-light/select-master-light';

/*
  Generated class for the SetLightLocation page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
    selector: 'page-set-light-location',
    templateUrl: 'set-light-location.html'
})
export class SetLightLocationPage {

    private location: any = {
        lat: 33.458772,
        lng: -88.832629
    }

    private marker: any = null;

    constructor(private loadingCtrl: LoadingController, private alertCtrl: AlertController, private databaseService: DatabaseService, private authService: AuthService, private lightService: LightService, public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SetLightLocationPage');
    }

    onSetMarker(event: any) {
        this.marker = {
            lat: event.coords.lat,
            lng: event.coords.lng
        }

    }

    useGPS() {

        const loading = this.loadingCtrl.create({
            content: "Retrieving GPS..."
        })

        loading.present();

        Geolocation.getCurrentPosition().then((event) => {
            loading.dismiss();
            // resp.coords.latitude
            // resp.coords.longitude
            this.marker = {
                lat: event.coords.latitude,
                lng: event.coords.longitude
            }
            this.location = {
                lat: event.coords.latitude,
                lng: event.coords.longitude
            }
        }).catch((error) => {
            loading.dismiss();
            console.log('Error getting location', error);
        });
    }

    continue () {
        this.lightService.setLocation(this.marker);

        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        loading.present();

        if (this.lightService.light.sms == '') {
            loading.dismiss();
            this.navCtrl.push(SelectMasterLightPage);
        } else {
            this.authService.getToken()
                .then((token) => {
                    this.databaseService.talkToLight(token, this.lightService.lightId, this.lightService.light.sms, '_1_$')
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

}
