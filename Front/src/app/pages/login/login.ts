import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as API from '../../lib/api';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
})
export class Login {

  form: FormGroup;
  hidePassword = true;
  error = '';

  constructor(private fb: FormBuilder, private router: Router, public global: GlobalService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async submitForm() {
    if (!this.form.valid) return;
    this.error = '';
    try {
      const result = await API.login(this.form.value.email, this.form.value.password);
      if (result.token) {
        const isPro = await API.isPro(result.user.id_user);
        if (isPro.pro) {
          this.global.pro = isPro.pro;
          this.global.isPro = true;
        }
        this.global.user = result.user;
        this.global.isLogged = true;
        this.router.navigate([this.global.isPro ? '/profil-pro' : '/profil']);
      } else {
        this.error = result.message ?? 'Email ou mot de passe incorrect.';
      }
    } catch {
      this.error = 'Connexion impossible. Vérifiez votre connexion et réessayez.';
    }
  }

  async linkRegister() {
    this.router.navigate(['/register']);
  }
}
