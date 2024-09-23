import { Injectable } from '@angular/core';
import { MqttService as NgxMqttService, IMqttMessage } from 'ngx-mqtt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private readonly topic = 'mc/robot/navigate';

  // BehaviorSubject to track connection status
  connectionStatusSubject = new BehaviorSubject<boolean>(false);
  connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor(private ngxMqttService: NgxMqttService) {
    this.setupConnection();
  }

  private setupConnection(): void {

    this.ngxMqttService.onConnect.subscribe({
      next: () => {
        console.log('Connected to MQTT broker');
        this.connectionStatusSubject.next(true); // Set status to true when connected
        this.subscribeToTopic(this.topic);
      },
      error: (error: any) => {
        console.error('Connection error:', error);
        this.connectionStatusSubject.next(false); // Set status to false if connection fails
      }
    });

    this.ngxMqttService.onEnd.subscribe({
      next: () => {
        console.log('Disconnected from MQTT broker...');
        this.connectionStatusSubject.next(false); // Set status to false when disconnecting
      }
    });

    this.ngxMqttService.onClose.subscribe({
      next: () => {
        console.log('Disconnected from MQTT broker');
        this.connectionStatusSubject.next(false); // Set status to false when disconnected
      }
    });
    
    this.ngxMqttService.onOffline.subscribe({
      next: () => {
        console.log('Disconnected from MQTT broker');
        this.connectionStatusSubject.next(false); // Set status to false when disconnected
      }
    });

    this.ngxMqttService.onReconnect.subscribe({
      next: () => {
        console.log('Reconnected to MQTT broker');
        this.connectionStatusSubject.next(true); // Set status to false when disconnected
      }
    });
  }

  private subscribeToTopic(topic: string): void {
    this.ngxMqttService.observe(topic).subscribe({
      next: (message: IMqttMessage) => {
        console.log(`Message received on topic ${topic}:`, message.payload.toString());
        // Handle incoming messages here if needed
      },
      error: (error) => {
        console.error(`Failed to receive message on topic ${topic}:`, error);
      }
    });
  }

  public publishMessage(topic: string, message: string): void {
    if (this.connectionStatusSubject.getValue()) {
      this.ngxMqttService.publish(topic, message).subscribe({
        next: () => {
          console.log(`Message published to topic ${topic}: ${message}`);
        },
        error: (error) => {
          console.error(`Failed to publish message to topic ${topic}:`, error);
        }
      });
    } else {
      console.error('Cannot publish message. MQTT client is not connected.');
    }
  }
}
