import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FicheTech } from './fiche-tech';

vi.mock('../../lib/api', () => ({
  getOnMethodo: vi.fn(),
  searchProsByVille: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

const mockMethodo = { id_methodologie: 1, titre: 'Médecin', descriptif: 'Médecin généraliste.' };
const mockPros = [
  { id_pro: 1, prenom: 'Jean', nom: 'Dupont', nom_cabinet: 'Cabinet Santé', ville: 'Marseille' },
  { id_pro: 2, prenom: 'Marie', nom: 'Martin', nom_cabinet: 'Centre Médical', ville: 'Paris' },
];

describe('FicheTech', () => {
  let component: FicheTech;
  let fixture: ComponentFixture<FicheTech>;

  beforeEach(async () => {
    vi.mocked(API.getOnMethodo).mockResolvedValue({ methodo: mockMethodo });
    vi.mocked(API.searchProsByVille).mockResolvedValue(mockPros);

    await TestBed.configureTestingModule({
      imports: [FicheTech],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { params: of({ methodo: '1' }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FicheTech);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('charge la méthodologie au démarrage', () => {
    expect(component.methodo()).toEqual(mockMethodo);
  });

  it('charge tous les professionnels au démarrage', () => {
    expect(component.pros().length).toBe(2);
  });

  it('filtre les professionnels par ville', async () => {
    vi.mocked(API.searchProsByVille).mockResolvedValue([mockPros[0]]);
    component.ville = 'Marseille';
    await component.search();
    expect(API.searchProsByVille).toHaveBeenCalledWith('1', 'Marseille');
    expect(component.pros().length).toBe(1);
    expect(component.pros()[0].ville).toBe('Marseille');
  });

  it('recharge tous les pros si la ville est vide', async () => {
    vi.mocked(API.searchProsByVille).mockResolvedValue(mockPros);
    component.ville = '';
    await component.search();
    expect(API.searchProsByVille).toHaveBeenCalledWith('1');
    expect(component.pros().length).toBe(2);
  });

  it('retourne un tableau vide si aucun professionnel trouvé', async () => {
    vi.mocked(API.searchProsByVille).mockResolvedValue([]);
    component.ville = 'Atlantis';
    await component.search();
    expect(component.pros().length).toBe(0);
  });

  it('passe searching=true pendant la recherche et false après', async () => {
    let resolve!: (v: any) => void;
    vi.mocked(API.searchProsByVille).mockReturnValue(new Promise(r => { resolve = r; }));
    component.ville = 'Lyon';
    const p = component.search();
    expect(component.searching).toBe(true);
    resolve([]);
    await p;
    expect(component.searching).toBe(false);
  });
});
