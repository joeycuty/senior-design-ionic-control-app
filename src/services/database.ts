import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { AuthService } from "./auth";
import { LightService } from "./light";

import 'rxjs/Rx';

@Injectable()

export class DatabaseService {

    public userLights: any[] = [];

    constructor(private http: Http, private authService: AuthService, private lightService: LightService) {}

    putData(token: string) {

        //const userId = this.authService.getActiveUser().uid;

        var packet = {
                lightId: "aaa001"
            }
            //put overrides
            //post merges
        return this.http.post('http://weathersight.herokuapp.com/testsms', packet)
            .map((response: Response) => {
                return response.json();
            });
    }

    getLight(token: string, light: string) {

        //const userId = this.authService.getActiveUser().uid;

        return this.http.get('https://weathersight-76387.firebaseio.com/lights/' + light + '.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            });
    }

    talkToLight(token, lightId, lightSMS, command) {

        //const userId = this.authService.getActiveUser().uid;

        var packet = {
                token: token,
                lightId: lightId,
                lightSms: lightSMS,
                command: command
            }
            //put overrides
            //post merges
        return this.http.post('http://weathersight.herokuapp.com/sendsms', packet)
            .map((response: Response) => {
                return response.json();
            });
    }

    saveLightToUser(token) {

        const userId = this.authService.getActiveUser().uid;

        var location = '';

        if (this.lightService.light.sms == '') {
            location = '/slaves/';

            this.lightService.light['masterSms'] = this.lightService.specificLight.sms;
            this.lightService.light['masterId'] = this.lightService.specificLightId;
            
        } else {
            location = '/masters/';
        }

        return this.http.patch('https://weathersight-76387.firebaseio.com/users/' + userId + location + this.lightService.lightId + '.json?auth=' + token, this.lightService.getFinalLight())
            .map((response: Response) => {
                return response.json();
            });
    }

    saveSlaveToMaster(token) {

        const userId = this.authService.getActiveUser().uid;

        var test = {};
        test[this.lightService.lightId] = this.lightService.lightId;

        return this.http.put('https://weathersight-76387.firebaseio.com/users/' + userId + '/masters/' + this.lightService.specificLightId + '/slaves/' + '.json?auth=' + token, test)
            .map((response: Response) => {
                return response.json();
            });
    }

    markLightAsUsed(token, lightId) {

        const userId = this.authService.getActiveUser().uid;

        var location = this.lightService.getFinalLight();

        location['used'] = true;

        return this.http.patch('https://weathersight-76387.firebaseio.com/lights/' + lightId + '.json?auth=' + token, location)
            .map((response: Response) => {
                return response.json();
            });
    }

    getLights(token, type) {

        const userId = this.authService.getActiveUser().uid;

        var location = '';

        if (type == 'slaves') {
            location = '/slaves';
        } else {
            location = '/masters';
        }

        return this.http.get('https://weathersight-76387.firebaseio.com/users/' + userId + location + '.json?auth=' + token)
            .map((response: Response) => {
                return response.json();
            });
    }

}
