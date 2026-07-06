import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Acceuil } from './acceuil';

vi.mock('../../lib/api', () => ({
  getAllMethodologie: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

const mockMethodologies = [
  { id_methodologie: 1, titre: 'Médecin', descriptif: 'Médecin généraliste.' },
  { id_methodologie: 2, titre: 'Infirmier', descriptif: 'Soins infirmiers.' },
  { id_methodologie: 3, titre: 'Pharmacien', descriptif: 'Expert du médicament.' },
];

describe('Acceuil', () => {
  let component: Acceuil;
  let fixture: ComponentFixture<Acceuil>;

  beforeEach(async () => {
    vi.mocked(API.getAllMethodologie).mockResolvedValue(mockMethodologies);

    await TestBed.configureTestingModule({
      imports: [Acceuil],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Acceuil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('charge les méthodologies au démarrage', () => {
    expect(component.methodologies().length).toBe(3);
  });

  it('appelle API.getAllMethodologie dans ngOnInit', () => {
    expect(API.getAllMethodologie).toHaveBeenCalledOnce();
  });

  it('affiche un signal vide si l\'API ne renvoie rien', async () => {
    vi.mocked(API.getAllMethodologie).mockResolvedValue([]);
    await component.ngOnInit();
    expect(component.methodologies().length).toBe(0);
  });

  describe('iconFor()', () => {
    it('retourne l\'icône correcte pour Médecin', () => {
      expect(component.iconFor('Médecin')).toBe('local_hospital');
    });

    it('retourne l\'icône correcte pour Pharmacien', () => {
      expect(component.iconFor('Pharmacien')).toBe('local_pharmacy');
    });

    it('retourne "spa" pour un titre inconnu', () => {
      expect(component.iconFor('Inconnu')).toBe('spa');
    });

    it('retourne l\'icône correcte pour Psychologue', () => {
      expect(component.iconFor('Psychologue')).toBe('psychology');
    });
  });
});
