import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
    firebase.initializeApp({
    apiKey: "AIzaSyAjt2khpR2RWVVq_Ru56a3BMhFShRM9Lto",
    authDomain: "hashtagv2.firebaseapp.com",
    databaseURL: "https://hashtagv2.firebaseio.com",
    projectId: "hashtagv2",
    storageBucket: "hashtagv2.appspot.com",
    messagingSenderId: "832967162755"
    });

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.rootPage = 'login';
        unsubscribe();
      } else { 
        this.rootPage = HomePage;
        unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}