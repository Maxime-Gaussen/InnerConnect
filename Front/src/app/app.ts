import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import {MatTabsModule, MatTabLink } from '@angular/material/tabs';
import { MatIcon } from "@angular/material/icon";
import * as API from "./lib/api";
import { GlobalService } from './services/global';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, MatIcon, RouterLinkWithHref, RouterLink, MatTabLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BigProject');
  isVisible : boolean = false;
  constructor(public global: GlobalService){}
  

  async ngOnInit() {
    await this.checkLogin();
  }

  async checkLogin() {

    try {

      const result = await API.authByToken();

      this.global.isLogged = !!result.user;
      if (result.user) this.global.user = result.user;

    } catch (e) {

      this.global.isLogged = false;

    }

}
}