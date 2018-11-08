import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { LightService } from "../../services/light";
import { DatabaseService } from "../../services/database";
import { AuthService } from "../../services/auth";

@Component({
    selector: 'page-specific-light',
    templateUrl: 'specific-light.html'
})
export class SpecificLightPage {

    public lightId: any = "testtest";
    public myDynamicColor: any = "rgba(123, 103, 103, 0.48)";

    public currentWeather: any = {};

    public red: number = 255;
    private blue: number = 255;
    private green: number = 255;
    private opacity: any = 0.90;
    public rawOp: any = this.opacity * 100;
    private easyView: string = "black";

    constructor(public navCtrl: NavController, private databaseService: DatabaseService, private authService: AuthService, private loadingCtrl: LoadingController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController, private lightService: LightService) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad SpecificLightPage');
        console.log(this.lightService.specificLight.sms);
        this.lightId = this.lightService.specificLightId;
        this.setColor(255, 'red');
        this.getWeather();
    }

    public humidity : any = 10;
    public pressure : any = 0;
    public rain : string = "";
    public temp : any = 0;
    //false = celcius
    public tempSet: string = "C";

    changeTemp() {

        if(this.tempSet == "C")
        {
            this.temp = (this.temp * (9/5) + 32).toFixed(2);
            this.tempSet = "F";
            console.log(this.temp);
        }
        else
        {
            this.temp = (this.currentWeather['temp'] * 1).toFixed(2);
            this.tempSet = "C";
            console.log(this.temp);
        }
    }

    getWeather() {

        const loading = this.loadingCtrl.create({
            content: "Updating Light Data..."
        });

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.getLight(token, this.lightId)
                    .subscribe(
                        (data) => {
                            loading.dismiss();
                            if (data == null) {

                                const alert = this.alertCtrl.create({
                                    title: 'Error',
                                    message: "No light was found.",
                                    buttons: ['ok']
                                });
                                alert.present();
                            } else if (data.used == true) {

                              this.currentWeather = data.currentWeather;
                              console.log("WEATHER SET");

                              this.humidity = (this.currentWeather['humidity'] * 1).toFixed(1);
                              this.pressure = (this.currentWeather['pressure']*1).toFixed(1);

                              if(this.currentWeather['moisture'] > 500)
                              {
                                  this.rain = "Not Raining";

                              }
                              else if(this.currentWeather['moisture'] < 200)
                              {
                                  this.rain = "Heavy Rain";

                              }
                              else if(this.currentWeather['moisture'] < 500)
                              {
                                  this.rain = "Light Rain";

                              }

                              this.temp = this.currentWeather['temp'];
                              this.tempSet = "C";
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

    dismiss() {
        this.viewCtrl.dismiss();
    }

    setColor(val, color) {
        if (color == 'red') {
            this.red = val;
            this.red = this.colorToLight(this.red);
        } else if (color == 'blue') {
            this.blue = val;
            this.blue = this.colorToLight(this.blue);
        } else if (color == 'green') {
            this.green = val;

            this.green = this.colorToLight(this.green);
        } else if (color == 'opacity') {
            this.rawOp = val;
            if (this.rawOp < 50) {
                this.easyView = "black";
            } else {
                this.easyView = "black";
            }
            this.opacity = Number(val / 100).toFixed(2);
            console.log(this.opacity);
           
        }

         var inverseOp = ((1 - (this.opacity)));

            if(inverseOp < 0.10)
            {
                var shownOp = 0.1;
            }
            else if(inverseOp > 0.50)
            {
                shownOp = 1;
            }
            else
            {
                shownOp = inverseOp;
            }
            console.log(inverseOp);
            console.log(shownOp);

        this.myDynamicColor = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + shownOp + ")";
    }

    colorToLight(color)
    {
        var per = color/255;
        if(per < 0.3)
        {
            return 0;
        }
        else
        {
            return color;
        }
    }

    colorToPercent(color) {
        return Number(color / 255 * 100).toFixed(0);
    }

    info(mode) {
        if (mode == "construction") {
            var title = "Construction Mode";
            var message = "Construction Mode can be used to warn drivers and pedestrians of upcoming constuction. A light orange color is used.";
        } else if (mode == "accident") {
            title = "Accident Mode";
            message = "Accident Mode can be used to warn drivers and pedestrians of an accident ahead and to slow down.  A light red hue is used.";
        } else if (mode == "evacuation") {
            title = "Evacuation Mode";
            message = "Evacuation Mode can be used to show people that they need to leave.";
        }else if(mode == "normal") {
            title = "Active Mode";
            message = "Active Mode is the default mode for the streetlight. It changes based on weather conditions.";
        }

        const alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: ['ok']
        });
        alert.present();
    }

    enable(mode) {

        const alert = this.alertCtrl.create({
            title: "Confirm " + mode + " Mode",
            message: "Are you sure you want to enable " + mode + " Mode?",
            buttons: [{
                text: 'Cancel',
                handler: (data) => {
                    console.log('Disagree clicked');
                }
            }, {
                text: 'Activate',
                handler: (data) => {

                    if (data[0] == 'chain') {
                        console.log("enable entire chain..");
                        this.sendMode(mode);

                    } else {
                        console.log("enable just this light");
                        this.sendMode(mode);
                    }
                    console.log('Agree clicked');
                    console.log(mode);

                }
            }]
        });

        alert.present();
    }

    updateWeather() {

        this.getWeather();

    }

    sendMode(mode) {

        const loading = this.loadingCtrl.create({
            content: "Connecting to Light..."
        })

        if (mode == "Construction") {
            var message = "_4_$";
        } else if (mode == "Accident") {
            message = "_3_$";
        } else if (mode == "Evacuation") {
            message = "_5_$";
        } else if (mode == "Active") {
            message = "_2_$";
        }else if (mode == "Manual Color") {
            message = "_6_" + this.colorToPercent(this.red).toString() + "_"+ this.colorToPercent(this.green).toString() + "_" + this.colorToPercent(this.blue).toString() + "_" + this.rawOp + "_$";
            console.log(message);
        } else {
            console.log("MODE EQUIALS");
            console.log(mode);
            message = "_2_$";
        }

        if (this.lightService.specificLight.sms == '') {
            var id = this.lightService.specificLight.masterId;
            var mysms = this.lightService.specificLight.masterSms
        } else {
            id = this.lightId;
            mysms = this.lightService.specificLight.sms;
        }

        loading.present();
        this.authService.getToken()
            .then((token) => {
                this.databaseService.talkToLight(token, id, mysms, message)
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

                                loading.dismiss();
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
