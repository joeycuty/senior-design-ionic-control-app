export class LightService {

    constructor() {}

    public lightId = null;
    private userId = '';

    public userMasterLights: any[] = [];

    public userSlaveLights: any[] = [];

    public light = {
        location: {
            lat: 0,
            lng: 0
        },
        active: false,
        emergency: false,
        sms: '',
        slaves: {},
        owner: this.userId

    }

    public specificLight = {

        location: {
            lat: 0,
            lng: 0
        },
        active: false,
        emergency: false,
        sms: '',
        masterSms: '',
        masterId: '',
        slaves: {},
        owner: this.userId

    }

    public specificLightId = null;

    setSpecificLight(lightId, type) {
        this.specificLightId = lightId;

        if (type == "master") {
            for (var i = 0; i < this.userMasterLights.length; i++) {
                if (this.userMasterLights[i]['lightId'] == lightId) {
                    this.specificLight = this.userMasterLights[i];
                }
            }
        } else {
            for (var i = 0; i < this.userSlaveLights.length; i++) {
                if (this.userSlaveLights[i]['lightId'] == lightId) {
                    this.specificLight = this.userSlaveLights[i];
                }
            }
        }
    }

    newLight(id, sms, uid) {

        this.clearLight(); 
        
        this.lightId = id;
        this.light.sms = sms;
        this.light.owner = uid;
    }

    getFinalLight() {
        var json = {};

        json = this.light;

        return json;
    }

    clearLight() {
        this.lightId = null;
        this.light = {
            location: {
                lat: 0,
                lng: 0
            },
            active: false,
            emergency: false,
            sms: '',
            slaves: {},
            owner: this.userId

        }
    }

    setLocation(marker) {
        this.light.location = marker;
        console.log(this.light);
    }

}
