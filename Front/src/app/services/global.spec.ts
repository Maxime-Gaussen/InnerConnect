import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GlobalService } from './global';

vi.mock('../lib/api', () => ({
  authByToken: vi.fn(),
  isPro: vi.fn(),
  logout: vi.fn(),
}));

import * as API from '../lib/api';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr' };
const mockPro  = { id_pro: 1, id_user: 1, nom_cabinet: 'Cabinet Test', ville: 'Marseille' };

describe('GlobalService', () => {
  let service: GlobalService;

  beforeEach(async () => {
    vi.mocked(API.authByToken).mockResolvedValue({ user: null });
    vi.mocked(API.isPro).mockResolvedValue({ pro: null });

    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    service = TestBed.inject(GlobalService);
    await new Promise(r => setTimeout(r, 0));
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('initialise isLogged à false par défaut', () => {
    expect(service.isLogged).toBe(false);
  });

  it('initialise isPro à false par défaut', () => {
    expect(service.isPro).toBe(false);
  });

  it('initialise user à null par défaut', () => {
    expect(service.user).toBeNull();
  });

  describe('verifToken()', () => {
    it('définit isLogged=true et user quand le token est valide', async () => {
      vi.mocked(API.authByToken).mockResolvedValue({ user: mockUser });
      vi.mocked(API.isPro).mockResolvedValue({ pro: null });

      await service.verifToken();

      expect(service.isLogged).toBe(true);
      expect(service.user).toEqual(mockUser);
      expect(service.isPro).toBe(false);
    });

    it('définit isPro=true et pro pour un utilisateur professionnel', async () => {
      vi.mocked(API.authByToken).mockResolvedValue({ user: mockUser });
      vi.mocked(API.isPro).mockResolvedValue({ pro: mockPro });

      await service.verifToken();

      expect(service.isPro).toBe(true);
      expect(service.pro).toEqual(mockPro);
    });

    it('laisse isLogged=false si le token est invalide', async () => {
      vi.mocked(API.authByToken).mockResolvedValue({ error: 'Unauthorized' });

      await service.verifToken();

      expect(service.isLogged).toBe(false);
      expect(service.user).toBeNull();
    });
  });

  describe('logout()', () => {
    it('réinitialise tout l\'état et appelle API.logout', async () => {
      service.isLogged = true;
      service.isPro = true;
      service.user = mockUser;
      service.pro = mockPro;
      vi.mocked(API.logout).mockResolvedValue(undefined);

      await service.logout();

      expect(API.logout).toHaveBeenCalledOnce();
      expect(service.isLogged).toBe(false);
      expect(service.isPro).toBe(false);
      expect(service.user).toBeNull();
      expect(service.pro).toBeNull();
    });
  });
});
