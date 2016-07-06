import {Component, NgZone} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Http, Headers} from '@angular/http';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  items:Array<any> = [];
  isAuthenticated:boolean = false;

  constructor(private navController: NavController, private zone: NgZone, private http: Http) {
  }

  login() {
    let ctrl = this;
    let authContext = new Microsoft.ADAL.AuthenticationContext("https://login.microsoftonline.com/common");
    authContext.acquireTokenAsync("https://graph.microsoft.com", 
      "175e6dac-d507-4a49-a36b-5e1de0edf05a", "http://localhost:8000").then(function(result: Microsoft.ADAL.AuthenticationResult){
        ctrl.zone.run(() => {
          ctrl.isAuthenticated = true;

          //call the graph
          ctrl.http.get("https://graph.microsoft.com/v1.0/me/drive/root/children", {
            headers: new Headers({ "Authorization": "Bearer " + result.accessToken })
          }).subscribe(res => {
            if (res.status == 200)
              ctrl.items = res.json().value;
          });
        });
      }, function(err) {
        //TODO: handle auth error
      });
  }
}
