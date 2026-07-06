import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  register: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let globalService: GlobalService;

  beforeEach(async () => {
    vi.mocked(API.register).mockResolvedValue({});

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService);
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('formulaire invalide initialement', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('invalide si le nom est absent', () => {
    component.form.setValue({ nom: '', prenom: 'Jean', age: 25, email: 'test@test.fr', password: 'MotDePasse1' });
    expect(component.form.get('nom')?.invalid).toBe(true);
  });

  it('invalide si l\'email est malformé', () => {
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 25, email: 'invalide', password: 'MotDePasse1' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('invalide si le mot de passe est inférieur à 8 caractères', () => {
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 25, email: 'test@test.fr', password: 'abc' });
    expect(component.form.get('password')?.invalid).toBe(true);
  });

  it('invalide si l\'âge est 0', () => {
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 0, email: 'test@test.fr', password: 'MotDePasse1' });
    expect(component.form.get('age')?.invalid).toBe(true);
  });

  it('invalide si l\'âge dépasse 120', () => {
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 121, email: 'test@test.fr', password: 'MotDePasse1' });
    expect(component.form.get('age')?.invalid).toBe(true);
  });

  it('valide avec toutes les données correctes', () => {
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 25, email: 'jean@test.fr', password: 'MotDePasse1' });
    expect(component.form.valid).toBe(true);
  });

  it('appelle API.register avec les bonnes valeurs', async () => {
    vi.mocked(API.register).mockResolvedValue({ token: 'xyz', user: { id_user: 2 } });
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 25, email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.onSubmit();
    expect(API.register).toHaveBeenCalledWith('Dupont', 'Jean', 25, 'jean@test.fr', 'MotDePasse1');
  });

  it('met à jour l\'état global après inscription réussie', async () => {
    const mockUser = { id_user: 2, nom: 'Dupont', prenom: 'Jean' };
    vi.mocked(API.register).mockResolvedValue({ token: 'xyz', user: mockUser });
    component.form.setValue({ nom: 'Dupont', prenom: 'Jean', age: 25, email: 'jean@test.fr', password: 'MotDePasse1' });
    await component.onSubmit();
    expect(globalService.isLogged).toBe(true);
    expect(globalService.user).toEqual(mockUser);
  });

  it('ne soumet pas si le formulaire est invalide', async () => {
    await component.onSubmit();
    expect(API.register).not.toHaveBeenCalled();
  });
});
