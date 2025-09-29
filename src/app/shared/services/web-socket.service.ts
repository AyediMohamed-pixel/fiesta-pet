
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const WEBSOCKET_URL = environment.SOCKETS_SERVER_URI + 'notifs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: Socket;

  constructor(private authService: AuthService) {
    this.socket = io(WEBSOCKET_URL, {
      auth: {
        token: this.authService.getToken()
      },
      withCredentials: true,
      transports: ['websocket', 'polling'], // ensure fallback is supported
    });
  }

  getNotif(id: string) {
    let observable = new Observable<any>(observer => {
      this.socket.on(id, (data) => {
        observer.next(data);
      });
      return () => { this.socket.disconnect(); };
    });
    return observable;
  }


}

