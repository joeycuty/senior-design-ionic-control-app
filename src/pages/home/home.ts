import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AuthService } from "../../services/auth";
import { DatabaseService } from "../../services/database";

import { NewlightPage } from '../newlight/newlight';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private authService: AuthService, private databaseService: DatabaseService) {

    var test = "aaa001_23_432_23.03_23_";
    console.log(test);
    var arr = test.split("_");

    console.log(arr);
    
  }

  

  map()
  {
  	this.navCtrl.push(MapPage);
  }

  newLight()
  {
  	this.navCtrl.push(NewlightPage);
  }

}
