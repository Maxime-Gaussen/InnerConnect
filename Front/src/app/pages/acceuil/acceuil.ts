import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import * as API from '../../lib/api';

@Component({
  selector: 'app-acceuil',
  imports: [MatIconModule],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.scss',
})
export class Acceuil implements OnInit {

  methodologies = signal<any[]>([]);
  error = signal('');

  private iconMap: Record<string, string> = {
    'Médecin': 'local_hospital',
    'Pharmacien': 'local_pharmacy',
    'Chirurgien-Dentiste': 'dentistry',
    'Sage-Femme': 'pregnant_woman',
    'Infirmier': 'healing',
    'Masseur-Kinésithérapeute': 'self_improvement',
    'Pédicure-Podologue': 'directions_walk',
    'Technicien de Laboratoire': 'biotech',
    'Orthophoniste': 'record_voice_over',
    'Psychologue': 'psychology',
    'Ergothérapeute': 'accessible',
    'Diététicien': 'restaurant',
    'Psychomotricien': 'sports_gymnastics',
  };

  constructor(private router: Router, private titleService: Title, private metaService: Meta) {}

  async ngOnInit() {
    this.titleService.setTitle('BigProject — Trouvez votre praticien en médecine douce');
    this.metaService.updateTag({ name: 'description', content: 'Trouvez un praticien en médecine douce et bien-être près de chez vous : médecin, infirmier, kinésithérapeute, psychologue et bien d\'autres spécialités.' });
    try {
      const data = await API.getAllMethodologie();
      this.methodologies.set(data);
    } catch {
      this.error.set('Impossible de charger les méthodologies. Veuillez réessayer plus tard.');
    }
  }

  iconFor(titre: string): string {
    return this.iconMap[titre] ?? 'spa';
  }

  goToFicheTech(id: number) {
    this.router.navigate(['/' + id]);
  }
}
