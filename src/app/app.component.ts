import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MqttService } from './services/mqtt.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MqttModule } from 'ngx-mqtt';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // Values for vertical and horizontal movements
  verticalValue: number = 0;   // Value for top-to-bottom movement
  horizontalValue: number = 0; // Value for left-to-right movement

  // Get the screen height and width to calculate the center
  screenHeight: number = window.innerHeight;
  screenWidth: number = window.innerWidth;

  lastSentMsg = '';

  mqttConnectionStatus: boolean = false;

  constructor(private mqtt: MqttService, private storage: StorageService) {
    mqtt.connectionStatusSubject.subscribe(status => {
      this.mqttConnectionStatus = status
    });
  }

  ngOnInit(): void {
    document.querySelector("body")?.requestFullscreen();
    setInterval(() => {
      this.sendMsg();
    }, 50);
  }

  showPrompt() {
    const json = this.storage.getValue();
    const newAddress = prompt('Host address: (Restart required)', json.host);
    if (newAddress!==null) {
      json.host = newAddress;
      this.storage.setValue(json);
    }
  }

  // Capture initial touch position on touchstart
  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      console.log(`Touch started at X: ${touchX}, Y: ${touchY}`);
      this.calculateVerticalValue(touchY);
      this.calculateHorizontalValue(touchX);
    }
  }

  sendMsg() {
    const msg = `{x: ${this.horizontalValue}, y: ${this.verticalValue}}`;
    if (msg !== this.lastSentMsg) {
      this.lastSentMsg = msg;
      this.mqtt.publishMessage(msg);
    }
  }

  // Method to handle touch movement
  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const touchX = touch.clientX; // Get X position of the touch
      const touchY = touch.clientY; // Get Y position of the touch
      this.calculateVerticalValue(touchY);
      this.calculateHorizontalValue(touchX);
    }
  }

  // Reset the values when the touch ends
  @HostListener('window:touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    console.log('Touch ended. Resetting values.');
    this.verticalValue = 0;
    this.horizontalValue = 0;
  }

  // Method to calculate the vertical value based on Y touch position
  calculateVerticalValue(touchY: number): void {
    const centerY = this.screenHeight / 2;  // Calculate the Y center of the screen
    const distanceFromCenterY = (centerY - touchY) / centerY;

    // Ensure the value stays between -1 and 1
    this.verticalValue = Math.max(-1, Math.min(1, distanceFromCenterY));
  }

  // Method to calculate the horizontal value based on X touch position
  calculateHorizontalValue(touchX: number): void {
    const centerX = this.screenWidth / 2;  // Calculate the X center of the screen
    const distanceFromCenterX = (touchX - centerX) / centerX;

    // Ensure the value stays between -1 and 1
    this.horizontalValue = Math.max(-1, Math.min(1, distanceFromCenterX));
  }
}
