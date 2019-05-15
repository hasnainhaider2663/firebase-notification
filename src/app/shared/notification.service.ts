import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {take} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  token;

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
    this.angularFireMessaging.messaging.subscribe(
      (messaging) => {
        messaging.onMessage = messaging.onMessage.bind(messaging);
        messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging);
      }
    );
  }

  async sendMessage(msg) {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'key=AAAAOLTltTI:APA91bFJEj74jDPQlfJAMsbK6pnlt4oXEs2iD4kex_B7F2nWAlkLMomMlNoHlY75QzHlOB-qGoLG_vbhBcyI8hck1D-BUUi5spOk4jFiXzy5t2s3r-EmxqGC5mzR7s-4PNIlXvpY3IRr');
      const res = await this.http.post('https://fcm.googleapis.com/fcm/send', msg).toPromise();

      console.log(res);
      // if (res['status'] === 200) {
      //   return true;
      // }

      return res;
    } catch (e) {
      throw e;
    }
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token;
        this.token = token;
        this.angularFireDB.object('fcmTokens/').update(data);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        alert('Unable to get permission to notify.');
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage(cb) {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log('new message received. ', payload);
        cb(payload);
      });
  }
}
