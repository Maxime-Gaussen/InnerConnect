import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { GlobalService } from '../../services/global';
import * as API from '../../lib/api';

@Component({
  selector: 'app-verif-pro',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verif-pro.html',
  styleUrl: './verif-pro.scss',
})
export class VerifPro {
  form: FormGroup;
  cabinetForm: FormGroup;
  medecinInfo: any = null;
  errorMessage = '';

  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder, public global: GlobalService) {
    this.form = this.fb.group({
      idNat: ['', [Validators.required]],
    });
    this.cabinetForm = this.fb.group({
      nom_cabinet: ['', [Validators.required]],
      adresse: ['', [Validators.required]],
      ville: ['', [Validators.required]],
      description: ['', [Validators.required]],
      horaire_cabinet: ['', [Validators.required]],
    });
  }

  async verify() {
    if (this.form.invalid) return;
    this.errorMessage = '';
    try {
      const result = await API.verifyPro(this.form.value.idNat);
      if (result.error) {
        this.errorMessage = result.error;
      } else {
        this.medecinInfo = result;
      }
    } catch {
      this.errorMessage = 'Impossible de contacter le serveur, veuillez réessayer.';
    }
  }

  async register() {
    if (!this.global.user) {
      this.router.navigate(['/login']);
      return;
    }
    try {
      const result = await API.registerPro(
        this.form.value.idNat,
        this.global.user.id_user,
        this.cabinetForm.value.nom_cabinet,
        this.cabinetForm.value.adresse,
        this.cabinetForm.value.ville,
        this.cabinetForm.value.description,
        this.cabinetForm.value.horaire_cabinet,
      );
      if (result.error) {
        this.snackBar.open(result.error, 'Fermer', { duration: 4000 });
        return;
      }
      if (result.pro) {
        this.global.isPro = true;
        this.global.pro = result.pro;
      }
      this.snackBar.open('Votre profil professionnel a bien été créé !', 'OK', { duration: 3000 });
      setTimeout(() => this.router.navigate(['/profil']), 3000);
    } catch {
      this.snackBar.open('Une erreur est survenue, veuillez réessayer.', 'Fermer', { duration: 4000 });
    }
  }
}
