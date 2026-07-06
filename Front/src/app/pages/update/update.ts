import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import * as API from "../../lib/api";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { GlobalService } from '../../services/global';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-update',
  imports: [MatInputModule, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatButton, MatIcon, MatIconButton, RouterLink],
  templateUrl: './update.html',
  styleUrl: './update.scss',
})
export class Update {
  form: FormGroup;
  hidePassword = true;

  update = signal<any>({});
  private nameUpdate = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder, public global: GlobalService , private router: Router) {
    this.form = this.fb.group({
      update: ['', [Validators.required]],
    });
    this.activatedRoute.params.subscribe((params) => {
      this.nameUpdate.set(params['update']);
      this.update.set({ update: this.nameUpdate().slice(1) });
    });
  }

  async onUpdate() {
    if (this.form.invalid) return;

    const val = this.form.value.update;
    const uid = this.global.user.id_user;
    let result: any;

    if (this.nameUpdate() == ":nom") {
      result = await API.updateNameUser(val, uid);
    } else if (this.nameUpdate() == ":prenom") {
      result = await API.updateFirstNameUser(val, uid);
    } else if (this.nameUpdate() == ":age") {
      result = await API.updateAgeUser(Number(val), uid);
    } else if (this.nameUpdate() == ":email") {
      result = await API.updateEmailUser(val, uid);
    } else if (this.nameUpdate() == ":password") {
      result = await API.updatePasswordUser(val, uid);
    } else if (this.nameUpdate() == ":nom_cabinet") {
      result = await API.updateNameOffice(val, this.global.pro.id_pro);
    } else if (this.nameUpdate() == ":adresse") {
      result = await API.updateAddressOffice(val, this.global.pro.id_pro);
    } else if (this.nameUpdate() == ":ville") {
      result = await API.updateCityOffice(val, this.global.pro.id_pro);
    } else if (this.nameUpdate() == ":description") {
      result = await API.updateDescriptionOffice(val, this.global.pro.id_pro);
    } else if (this.nameUpdate() == ":horaire_cabinet") {
      result = await API.updateOfficeHours(val, this.global.pro.id_pro);
    }

    if (result && !result.error) {
      if (result.user) this.global.user = result.user;
      if (result.pro) this.global.pro = result.pro;
      this.router.navigate([this.global.isPro ? '/profil-pro' : '/profil']);
    }
  }
}
