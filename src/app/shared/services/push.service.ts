import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { FCM } from "@capacitor-community/fcm";


@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor( private platform: Platform) { }

  public initPush(){
    this.platform.ready().then(() => {
   
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if( this.platform.is('android') && !this.platform.is('desktop') && !this.platform.is('mobileweb')){
       this.addListeners();
       this.getDeliveredNotifications();
       this.register();
      }
    });
  }

  async register(){
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
    this.initFCM();
  }

  async addListeners() {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
     
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      
    });

    PushNotifications.createChannel({
      id: "command",
      name: "command",
      sound: "command.mp3",
      importance: 5,
      visibility: 1
    })
      .then(() => {
      })
      .catch((error) => {
        alert("push channel error: " + error);
      });

    PushNotifications.createChannel({
        id: "bigcommand",
        name: "bigcommand",
        sound: "bigcommand.mp3",
        importance: 5,
        visibility: 1
      })
        .then(() => {
        })
        .catch((error) => {
          alert("push channel error: " + error);
        });  

  }

  async getDeliveredNotifications () {
    const notificationList = await PushNotifications.getDeliveredNotifications();
   
  }

  async initFCM(){
    // now you can subscribe to a specific topic
    FCM.subscribeTo({ topic: "command",  })
    .then((r) => console.log(`subscribed to alfarouk`))
    .catch((err) => console.log(err));

    FCM.subscribeTo({ topic: "bigcommand",  })
    .then((r) => console.log(`subscribed to alfarouk`))
    .catch((err) => console.log(err));

    // Get FCM token instead of the APN one returned by Capacitor
    FCM.getToken()
    .then((r) => console.log(`Token ${r.token}`))
    .catch((err) => console.log(err));


  }
}
