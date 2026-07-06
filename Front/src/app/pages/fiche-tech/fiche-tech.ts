import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import * as API from '../../lib/api';

@Component({
  selector: 'app-fiche-tech',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './fiche-tech.html',
  styleUrl: './fiche-tech.scss',
})
export class FicheTech {

  methodo = signal<any>(null);
  pros = signal<any[]>([]);
  ville = '';
  searching = false;
  error = signal('');

  private methodoId = signal('');
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.methodoId.set(params['methodo']);
      this.error.set('');
      try {
        const [data, pros] = await Promise.all([
          API.getOnMethodo(this.methodoId()),
          API.searchProsByVille(this.methodoId())
        ]);
        const methodo = data.methodo ?? data;
        this.methodo.set(methodo);
        this.pros.set(pros);
        if (methodo?.titre) {
          this.titleService.setTitle(`${methodo.titre} — Trouver un praticien | BigProject`);
          this.metaService.updateTag({ name: 'description', content: `Trouvez un praticien spécialisé en ${methodo.titre} près de chez vous. ${methodo.descriptif ?? ''}`.trim() });
        }
      } catch {
        this.error.set('Impossible de charger les informations. Veuillez réessayer plus tard.');
      }
    });
  }

  async search() {
    this.error.set('');
    if (!this.ville.trim()) {
      try {
        const pros = await API.searchProsByVille(this.methodoId());
        this.pros.set(pros);
      } catch {
        this.error.set('La recherche a échoué. Veuillez réessayer.');
      }
      return;
    }
    this.searching = true;
    try {
      const results = await API.searchProsByVille(this.methodoId(), this.ville.trim());
      this.pros.set(results);
    } catch {
      this.error.set('La recherche a échoué. Veuillez réessayer.');
    } finally {
      this.searching = false;
    }
  }
}
