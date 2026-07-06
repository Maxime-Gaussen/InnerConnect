import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  login: vi.fn(),
  isPro: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr' };
const mockPro  = { id_pro: 1, nom_cabinet: 'Cabinet Test', ville: 'Marseille' };

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let globalService: GlobalService;

  beforeEach(async () => {
    vi.mocked(API.login).mockResolvedValue({});
    vi.mocked(API.isPro).mockResolvedValue({ pro: null });

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService);
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire invalide au démarrage', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('invalide avec un email malformé', () => {
    component.form.setValue({ email: 'pasunemail', password: 'MotDePasse1' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('invalide si mot de passe inférieur à 8 caractères', () => {
    component.form.setValue({ email: 'test@test.fr', password: 'abc' });
    expect(component.form.get('password')?.invalid).toBe(true);
  });

  it('valide avec email et mot de passe corrects', () => {
    component.form.setValue({ email: 'test@test.fr', password: 'MotDePasse1' });
    expect(component.form.valid).toBe(true);
  });

  it('appelle API.login avec les bonnes valeurs', async () => {
    vi.mocked(API.login).mockResolvedValue({ token: 'abc', user: mockUser });
    component.form.setValue({ email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.submitForm();
    expect(API.login).toHaveBeenCalledWith('jean@test.fr', 'MotDePasse1');
  });

  it('met à jour isLogged et user après connexion réussie', async () => {
    vi.mocked(API.login).mockResolvedValue({ token: 'abc', user: mockUser });
    component.form.setValue({ email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.submitForm();
    expect(globalService.isLogged).toBe(true);
    expect(globalService.user).toEqual(mockUser);
    expect(globalService.isPro).toBe(false);
  });

  it('définit isPro=true et pro pour un compte professionnel', async () => {
    vi.mocked(API.login).mockResolvedValue({ token: 'abc', user: mockUser });
    vi.mocked(API.isPro).mockResolvedValue({ pro: mockPro });
    component.form.setValue({ email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.submitForm();
    expect(globalService.isPro).toBe(true);
    expect(globalService.pro).toEqual(mockPro);
  });

  it('ne modifie pas l\'état global si la connexion échoue', async () => {
    vi.mocked(API.login).mockResolvedValue({ error: 'Identifiants incorrects' });
    component.form.setValue({ email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.submitForm();
    expect(globalService.isLogged).toBe(false);
    expect(globalService.user).toBeNull();
  });

  it('ne soumet pas si le formulaire est invalide', async () => {
    component.form.setValue({ email: '', password: '' });
    await component.submitForm();
    expect(API.login).not.toHaveBeenCalled();
  });
});
