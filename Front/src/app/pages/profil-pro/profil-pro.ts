import { Component, OnInit, signal, computed } from '@angular/core';
import { GlobalService } from '../../services/global';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import * as API from '../../lib/api';

@Component({
  selector: 'app-profil-pro',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, RouterLink],
  templateUrl: './profil-pro.html',
  styleUrl: './profil-pro.scss',
})
export class ProfilPro implements OnInit {
  methodos = signal<any[]>([]);
  allMethodos = signal<any[]>([]);
  selectedMethodoId: number | null = null;
  error = signal('');

  constructor(public global: GlobalService) {}

  async ngOnInit() {
    this.error.set('');
    try {
      const [all] = await Promise.all([API.getAllMethodologie(), this.global.ready]);
      this.allMethodos.set(all);
      console.log(this.allMethodos)
      await this.loadMethodos();
    } catch {
      this.error.set('Impossible de charger les données. Veuillez réessayer plus tard.');
    }
  }

  async loadMethodos() {
    if (!this.global.pro?.id_pro) return;
    const result = await API.getOneByPro(String(this.global.pro.id_pro));
    this.methodos.set(result.exercer ?? []);
  }


  methodoTitle(id_methodologie: number): string {
    const m = this.allMethodos().find((m: any) => m.id_methodologie === id_methodologie);
    return m?.titre ?? 'Inconnue';
  }

  availableMethodos = computed(() => {
    const assigned = new Set(this.methodos().map((e: any) => e.id_methodologie));
    return this.allMethodos().filter((m: any) => !assigned.has(m.id_methodologie));
  });

  async addMethodo() {
    if (!this.selectedMethodoId || !this.global.pro?.id_pro) return;
    this.error.set('');
    try {
      await API.addNewExercer(String(this.global.pro.id_pro), String(this.selectedMethodoId));
      this.selectedMethodoId = null;
      await this.loadMethodos();
    } catch {
      this.error.set('Impossible d\'ajouter la méthodologie. Veuillez réessayer ou vérifier que vous en avez pas déja une.');
    }
  }

 
  async removeMethodo(id_methodologie: number) {
    if (!this.global.pro?.id_pro) return;
    this.error.set('');
    try {
      await API.removeExercer(String(this.global.pro.id_pro), String(id_methodologie));
    } catch {
      this.error.set('Impossible de supprimer la méthodologie. Veuillez réessayer.');
      return;
    }
    
    this.methodos.set(this.methodos().filter((m: any) => m.id_methodologie !== id_methodologie));
    try {
      await this.loadMethodos();
    } catch { }
  }
}
