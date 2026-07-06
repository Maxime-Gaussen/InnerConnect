import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Profil } from './profil';
import { GlobalService } from '../../services/global';

vi.mock('../../lib/api', () => ({
  authByToken: vi.fn().mockResolvedValue({ user: null }),
  isPro: vi.fn().mockResolvedValue({ pro: null }),
}));

const mockUser = { id_user: 1, nom: 'Dupont', prenom: 'Jean', age: 30, email: 'jean@test.fr' };

describe('Profil', () => {
  let component: Profil;
  let fixture: ComponentFixture<Profil>;
  let globalService: GlobalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profil],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Profil);
    component = fixture.componentInstance;
    globalService = TestBed.inject(GlobalService);
    globalService.user = { ...mockUser };
    globalService.isPro = false;
    fixture.detectChanges();
  });

  afterEach(() => vi.clearAllMocks());

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('expose le GlobalService via global', () => {
    expect(component.global).toBeTruthy();
    expect(component.global.user).toEqual(mockUser);
  });

  it('affiche les données utilisateur dans le template', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Dupont');
    expect(el.textContent).toContain('Jean');
  });

  it('affiche l\'email de l\'utilisateur', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('jean@test.fr');
  });
});
