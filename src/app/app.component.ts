import {Component, OnInit} from '@angular/core';
import {NotifcationService} from './shared/notifcation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'firebase-notifications';
  message;

  constructor(private messagingService: NotifcationService) { }

  ngOnInit() {
    const userId = 'user001';
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
  }
}
