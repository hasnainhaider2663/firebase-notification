import {Component, OnInit} from '@angular/core';
import {NotificationService} from './shared/notification.service';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'firebase-notifications';
  message;
  form;

  // {
  //   "notification": {
  //     "title": "Hello World",
  //     "body": "This is Message from Admin"                                           },                                                                              "to" : "fMHX35Q1Mhc:APA91bFeHjWWguddto19sRfMRm4Z1-QXAWkJoB4ixlw80Whe7U_V2OQpyl5RPl4XIHAlbaTgLR1w3UuAvVsrYr7GwB8p2QIU9iQ34YmNzwvZrqOhtj9jfA2sHezEUxGnYaJhJPp_CAzs","from":"user001"}


  constructor(private messagingService: NotificationService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group(
      {
        body: ['', Validators.required],
        title: ['New Notification Received'],
        to: this.messagingService.token
      });
    const userId = 'user001';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage((payload) => {this.message = payload;});
  }

  sendMessage() {
    this.messagingService.sendMessage({notification: this.form.value});
  }
}
