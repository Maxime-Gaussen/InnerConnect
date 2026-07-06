import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProfilPro } from './profil-pro';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  getAllMethodologie: vi.fn(),
  getOneByPro: vi.fn(),
  addNewExercer: vi.fn(),
  removeExercer: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
  isPro: vi.fn().mockResolvedValue({ pro: null }),
}));

import * as API from '../../lib/api';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr' };
const mockPro  = { id_pro: 1, nom_cabinet: 'Cabinet Test', ville: 'Marseille' };
const allMethodos = [
  { id_methodologie: 1, titre: 'Médecin' },
  { id_methodologie: 2, titre: 'Infirmier' },
  { id_methodologie: 3, titre: 'Pharmacien' },
];

describe('ProfilPro', () => {
  let component: ProfilPro;
  let fixture: ComponentFixture<ProfilPro>;
  let globalService: GlobalService;

  beforeEach(async () => {
    vi.mocked(API.getAllMethodologie).mockResolvedValue(allMethodos);
    vi.mocked(API.getOneByPro).mockResolvedValue({ exercer: [] });

    await TestBed.configureTestingModule({
      imports: [ProfilPro],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilPro);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService);
    globalService.user = { ...mockUser };
    globalService.pro  = { ...mockPro };
    await fixture.whenStable();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('charge toutes les méthodologies disponibles', () => {
    expect(component.allMethodos().length).toBe(3);
  });

  it('retourne le titre d\'une méthodologie par son id', () => {
    expect(component.methodoTitle(1)).toBe('Médecin');
    expect(component.methodoTitle(2)).toBe('Infirmier');
  });

  it('retourne "Inconnue" pour un id inexistant', () => {
    expect(component.methodoTitle(99)).toBe('Inconnue');
  });

  it('availableMethodos contient toutes les méthodologies si aucune n\'est assignée', () => {
    expect(component.availableMethodos.length).toBe(3);
  });

  it('availableMethodos exclut les méthodologies déjà assignées', () => {
    component.methodos.set([{ id_pro: 1, id_methodologie: 1 }]);
    const available = component.availableMethodos;
    expect(available.length).toBe(2);
    expect(available.find((m: any) => m.id_methodologie === 1)).toBeUndefined();
  });

  it('ajoute une méthodologie et recharge la liste', async () => {
    vi.mocked(API.addNewExercer).mockResolvedValue({ exercer: { id_pro: 1, id_methodologie: 2 } });
    vi.mocked(API.getOneByPro).mockResolvedValue({ exercer: [{ id_pro: 1, id_methodologie: 2 }] });

    component.selectedMethodoId = 2;
    await component.addMethodo();

    expect(API.addNewExercer).toHaveBeenCalledWith('1', '2');
    expect(component.methodos().length).toBe(1);
    expect(component.selectedMethodoId).toBeNull();
  });

  it('ne fait rien si aucune méthodologie n\'est sélectionnée', async () => {
    component.selectedMethodoId = null;
    await component.addMethodo();
    expect(API.addNewExercer).not.toHaveBeenCalled();
  });

  it('supprime une méthodologie et recharge la liste', async () => {
    component.methodos.set([{ id_pro: 1, id_methodologie: 1 }]);
    vi.mocked(API.removeExercer).mockResolvedValue({ success: true });
    vi.mocked(API.getOneByPro).mockResolvedValue({ exercer: [] });

    await component.removeMethodo(1);

    expect(API.removeExercer).toHaveBeenCalledWith('1', '1');
    expect(component.methodos().length).toBe(0);
  });
});
