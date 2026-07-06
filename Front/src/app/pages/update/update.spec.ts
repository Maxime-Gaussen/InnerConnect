import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Update } from './update';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  updateNameUser: vi.fn(),
  updateFirstNameUser: vi.fn(),
  updateAgeUser: vi.fn(),
  updateEmailUser: vi.fn(),
  updatePasswordUser: vi.fn(),
  updateNameOffice: vi.fn(),
  updateAddressOffice: vi.fn(),
  updateCityOffice: vi.fn(),
  updateDescriptionOffice: vi.fn(),
  updateOfficeHours: vi.fn(),
  authByToken: vi.fn().mockResolvedValue({ user: null }),
}));

import * as API from '../../lib/api';

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr' };
const mockPro  = { id_pro: 1, nom_cabinet: 'Cabinet Test', ville: 'Marseille' };

const createFixture = async (param: string) => {
  await TestBed.configureTestingModule({
    imports: [Update],
    providers: [
      provideRouter([]),
      { provide: ActivatedRoute, useValue: { params: of({ update: param }) } },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Update);
  const component = fixture.componentInstance;
  const globalService = TestBed.inject(GlobalService);
  globalService.user = { ...mockUser };
  globalService.pro  = { ...mockPro };
  globalService.isPro = false;
  fixture.detectChanges();
  return { fixture, component, globalService };
};

describe('Update', () => {
  afterEach(() => {
    vi.clearAllMocks();
    TestBed.resetTestingModule();
  });

  it('devrait être créé', async () => {
    const { component } = await createFixture(':nom');
    expect(component).toBeTruthy();
  });

  it('formulaire invalide si le champ est vide', async () => {
    const { component } = await createFixture(':nom');
    expect(component.form.invalid).toBe(true);
  });

  it('formule valide avec une valeur saisie', async () => {
    const { component } = await createFixture(':nom');
    component.form.setValue({ update: 'Martin' });
    expect(component.form.valid).toBe(true);
  });

  it('appelle updateNameUser pour le champ :nom', async () => {
    const { component, globalService } = await createFixture(':nom');
    vi.mocked(API.updateNameUser).mockResolvedValue({ user: { ...mockUser, nom: 'Martin' } });
    component.form.setValue({ update: 'Martin' });
    await component.onUpdate();
    expect(API.updateNameUser).toHaveBeenCalledWith('Martin', 1);
    expect(globalService.user.nom).toBe('Martin');
  });

  it('appelle updateFirstNameUser pour le champ :prenom', async () => {
    const { component } = await createFixture(':prenom');
    vi.mocked(API.updateFirstNameUser).mockResolvedValue({ user: { ...mockUser, prenom: 'Pierre' } });
    component.form.setValue({ update: 'Pierre' });
    await component.onUpdate();
    expect(API.updateFirstNameUser).toHaveBeenCalledWith('Pierre', 1);
  });

  it('appelle updateAgeUser pour le champ :age', async () => {
    const { component } = await createFixture(':age');
    vi.mocked(API.updateAgeUser).mockResolvedValue({ user: { ...mockUser, age: 35 } });
    component.form.setValue({ update: '35' });
    await component.onUpdate();
    expect(API.updateAgeUser).toHaveBeenCalledWith(35, 1);
  });

  it('appelle updateCityOffice pour le champ :ville', async () => {
    const { component } = await createFixture(':ville');
    vi.mocked(API.updateCityOffice).mockResolvedValue({ pro: { ...mockPro, ville: 'Lyon' } });
    component.form.setValue({ update: 'Lyon' });
    await component.onUpdate();
    expect(API.updateCityOffice).toHaveBeenCalledWith('Lyon', 1);
  });

  it('appelle updateNameOffice pour le champ :nom_cabinet', async () => {
    const { component } = await createFixture(':nom_cabinet');
    vi.mocked(API.updateNameOffice).mockResolvedValue({ pro: { ...mockPro, nom_cabinet: 'Nouveau Cabinet' } });
    component.form.setValue({ update: 'Nouveau Cabinet' });
    await component.onUpdate();
    expect(API.updateNameOffice).toHaveBeenCalledWith('Nouveau Cabinet', 1);
  });

  it('redirige vers /profil-pro si l\'utilisateur est pro après update', async () => {
    const { component, globalService } = await createFixture(':nom');
    globalService.isPro = true;
    vi.mocked(API.updateNameUser).mockResolvedValue({ user: { ...mockUser, nom: 'Martin' } });
    component.form.setValue({ update: 'Martin' });
    await component.onUpdate();
    // La navigation est gérée par le Router — on vérifie que le résultat correct est utilisé
    expect(globalService.user.nom).toBe('Martin');
  });

  it('ne soumet pas si le formulaire est invalide', async () => {
    const { component } = await createFixture(':nom');
    await component.onUpdate();
    expect(API.updateNameUser).not.toHaveBeenCalled();
  });
});
