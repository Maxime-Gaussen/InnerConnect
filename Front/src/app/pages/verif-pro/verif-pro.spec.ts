import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VerifPro } from './verif-pro';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  verifyPro: vi.fn(),
  registerPro: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean' };
const mockMedecinInfo = {
  identificationNationale: '810000002443',
  nom: 'NAUDILLON',
  prenom: 'YVES',
  profession: 'Médecin',
  specialite: 'Médecine générale',
};

describe('VerifPro', () => {
  let component: VerifPro;
  let fixture: ComponentFixture<VerifPro>;
  let globalService: GlobalService;

  beforeEach(async () => {
    vi.mocked(API.verifyPro).mockResolvedValue({});
    vi.mocked(API.registerPro).mockResolvedValue({});

    await TestBed.configureTestingModule({
      imports: [VerifPro],
      providers: [
        provideRouter([]),
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifPro);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService);
    globalService.user = { ...mockUser };
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire de vérification invalide au démarrage', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('formulaire de cabinet invalide au démarrage', () => {
    expect(component.cabinetForm.invalid).toBe(true);
  });

  describe('verify()', () => {
    it('affiche les infos médecin après vérification réussie', async () => {
      vi.mocked(API.verifyPro).mockResolvedValue(mockMedecinInfo);
      component.form.setValue({ idNat: '810000002443' });

      await component.verify();

      expect(API.verifyPro).toHaveBeenCalledWith('810000002443');
      expect(component.medecinInfo).toEqual(mockMedecinInfo);
      expect(component.errorMessage).toBe('');
    });

    it('affiche un message d\'erreur si le numéro est inconnu', async () => {
      vi.mocked(API.verifyPro).mockResolvedValue({ error: 'Numéro d\'identification non reconnu' });
      component.form.setValue({ idNat: '999999999999' });

      await component.verify();

      expect(component.errorMessage).toBe('Numéro d\'identification non reconnu');
      expect(component.medecinInfo).toBeNull();
    });

    it('ne soumet pas si le formulaire est invalide', async () => {
      await component.verify();
      expect(API.verifyPro).not.toHaveBeenCalled();
    });
  });

  describe('register()', () => {
    it('appelle API.registerPro avec les bonnes valeurs', async () => {
      component.medecinInfo = mockMedecinInfo;
      vi.mocked(API.registerPro).mockResolvedValue({ pro: { id_pro: 1 } });
      component.cabinetForm.setValue({
        nom_cabinet: 'Cabinet Dupont',
        adresse: '1 rue de la Paix',
        ville: 'Marseille',
        description: 'Cabinet médical généraliste',
        horaire_cabinet: 'Lun-Ven 9h-18h',
      });

      await component.register();

      expect(API.registerPro).toHaveBeenCalledWith(
        '810000002443', 1,
        'Cabinet Dupont', '1 rue de la Paix', 'Marseille',
        'Cabinet médical généraliste', 'Lun-Ven 9h-18h'
      );
    });

    it('met à jour isPro et pro après inscription réussie', async () => {
      component.medecinInfo = mockMedecinInfo;
      const mockPro = { id_pro: 1, nom_cabinet: 'Cabinet Dupont' };
      vi.mocked(API.registerPro).mockResolvedValue({ pro: mockPro });
      component.cabinetForm.setValue({
        nom_cabinet: 'Cabinet Dupont',
        adresse: '1 rue de la Paix',
        ville: 'Marseille',
        description: 'Cabinet médical',
        horaire_cabinet: 'Lun-Ven 9h-18h',
      });

      await component.register();

      expect(globalService.isPro).toBe(true);
      expect(globalService.pro).toEqual(mockPro);
    });

    it('redirige vers /login si l\'utilisateur n\'est pas connecté', async () => {
      globalService.user = null;
      await component.register();
      expect(API.registerPro).not.toHaveBeenCalled();
    });
  });
});
