import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", redirectTo: "acceuil", pathMatch: "full" },
    { path: "login",        loadComponent: () => import('./pages/login/login').then(m => m.Login) },
    { path: "register",     loadComponent: () => import('./pages/register/register').then(m => m.Register) },
    { path: "acceuil",      loadComponent: () => import('./pages/acceuil/acceuil').then(m => m.Acceuil) },
    { path: "profil",       loadComponent: () => import('./pages/profil/profil').then(m => m.Profil) },
    { path: "profil-pro",   loadComponent: () => import('./pages/profil-pro/profil-pro').then(m => m.ProfilPro) },
    { path: "verif-pro",    loadComponent: () => import('./pages/verif-pro/verif-pro').then(m => m.VerifPro) },
    { path: "update/:update", loadComponent: () => import('./pages/update/update').then(m => m.Update) },
    { path: ":methodo",     loadComponent: () => import('./pages/fiche-tech/fiche-tech').then(m => m.FicheTech) },
];
