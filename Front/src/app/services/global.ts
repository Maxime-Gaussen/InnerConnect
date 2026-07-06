import { Injectable } from '@angular/core';
import * as API from "../lib/api";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public isLogged: boolean = false;
  public isPro: boolean = false;
  public user: any = null;
  public pro: any = null;
  public exercer: any = null;

  public readonly ready: Promise<void>;

  constructor(private router: Router) {
    this.ready = this.verifToken();
  }

  async logout() {
    await API.logout();
    this.isLogged = false;
    this.isPro = false;
    this.user = null;
    this.pro = null;
    this.exercer = null;
    this.router.navigate(['/login']);
  }

  async verifToken() {
    const verif = await API.authByToken();
    if (verif.user) {
      const verifPro = await API.isPro(verif.user.id_user);
      if (verifPro.pro) {
        this.pro = verifPro.pro;
        this.isPro = true;
        const verifExercer = await API.getOneByPro(verifPro.pro.id_pro);
        if(verifExercer.exercer){
          const methodoExercer = await API.getOnMethodo(verifExercer.exercer.id_methodologie);
          this.exercer = {titre : methodoExercer.methodo.titre , id_methodologie : methodoExercer.methodo.id_methodologie}
        }
        
      }
      this.user = verif.user;
      this.isLogged = true;
    }
  }
}