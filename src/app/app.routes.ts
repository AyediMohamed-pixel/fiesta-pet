import { Routes } from '@angular/router';
import { PublicGuard } from './shared/guards/public.guard';
import { PrivateGuard } from './shared/guards/private.guard';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'authentification',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    redirectTo: 'animal',
    pathMatch: 'full',
  },
  {
    path: 'authentification',
    loadChildren: () => import('./authentification/authentification.module').then( m => m.AuthentificationModule),
    canActivate : [PublicGuard]
  },
  {
    path: 'animal',
    loadChildren: () => import('./animal/animal.module').then( m => m.AnimalModule),
    // canActivate : [PrivateGuard]
  },
];
