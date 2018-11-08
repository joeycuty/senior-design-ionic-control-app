import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController } from 'ionic-angular';

import { DatabaseService } from "../../services/database";

import { Geolocation } from 'ionic-native';
import { AuthService } from "../../services/auth";
import { LightService } from "../../services/light";

import { SpecificLightPage } from "../specific-light/specific-light";

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {

    private location: any = {
        lat: 33.458772,
        lng: -88.832629
    }

    public toggleView: boolean = true;

    constructor(private modalCtrl: ModalController, private databaseService: DatabaseService, private authService: AuthService, private lightService: LightService, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {}

    openLight(lightId, type) {

        this.lightService.setSpecificLight(lightId, type);

        this.location = this.lightService.specificLight.location;
        setTimeout(() => {
            const modal = this.modalCtrl.create(SpecificLightPage);
            modal.present();
        }, 100);
    }

    dismiss() {
        console.log("TEST)");
    }

    toggleMapView() {

        this.toggleView = !this.toggleView;

        console.log(this.toggleView);
    }

    useGPS() {

        Geolocation.getCurrentPosition().then((event) => {
            // resp.coords.latitude
            // resp.coords.longitude
            this.location = {
                lat: event.coords.latitude,
                lng: event.coords.longitude
            }
            this.location = {
                lat: event.coords.latitude,
                lng: event.coords.longitude
            }
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MapPage');

        const loading = this.loadingCtrl.create({
            content: "Updating Light Data..."
        });

        loading.present();

        this.useGPS();

        this.authService.getToken()
            .then((token) => {

                this.lightService.userMasterLights = [];
                this.lightService.userSlaveLights = [];

                this.databaseService.getLights(token, 'master')
                    .subscribe(
                        (data) => {
                            // loading.dismiss();

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
                                    this.lightService.userMasterLights.push(data[j]);
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
                this.databaseService.getLights(token, 'slaves')
                    .subscribe(
                        (data) => {
                            loading.dismiss();

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
                                    this.lightService.userSlaveLights.push(data[j]);

                                    console.log(data[j]);

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
