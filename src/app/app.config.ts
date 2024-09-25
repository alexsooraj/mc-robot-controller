import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { MqttModule } from 'ngx-mqtt';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), importProvidersFrom(MqttModule.forRoot({
    hostname: '192.168.121.177',
    port: 8080, // WebSocket port (default is 9001)
    path: '/mqtt',
    protocol: 'ws', // Use 'wss' for secure WebSocket connections
  }))]
};
