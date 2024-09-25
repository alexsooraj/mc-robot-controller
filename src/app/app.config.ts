import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MqttModule } from 'ngx-mqtt';

const config = localStorage.getItem('mc-rc-config');
let host = 'localhost';
if (config !== null) {
  host = JSON.parse(config).host;
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), importProvidersFrom(MqttModule.forRoot({
    hostname: host,
    port: 8080, // WebSocket port (default is 9001)
    path: '/mqtt',
    protocol: 'ws', // Use 'wss' for secure WebSocket connections
  }))]
};
