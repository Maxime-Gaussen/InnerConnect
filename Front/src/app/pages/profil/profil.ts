import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GlobalService } from '../../services/global';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})
export class Profil {
  

  constructor(public global: GlobalService, private router: Router) {
    if(this.global.isPro){
      this.router.navigate(['/profil-pro']);
    }
  }
  
}
