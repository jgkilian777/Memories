import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class HomeComponent {

  title = 'Demo';
  greeting = {};

  constructor(private app: AppService, private http: HttpClient) {
    // http.get('resource').subscribe(data => this.greeting = data);
  }

  authenticated() { return this.app.authenticated; }

}
