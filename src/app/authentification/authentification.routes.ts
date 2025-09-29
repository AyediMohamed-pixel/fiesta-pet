import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicGuard } from '../shared/guards/public.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/sign_in',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'sign_in',
        loadComponent: () => import('./sign-in/sign-in.page').then( m => m.SignInPage),
        canActivate: [PublicGuard]

      },
      {
        path: 'sign_up',
        loadComponent: () => import('./sign-up/sign-up.page').then( m => m.SignUpPage),
        canActivate: [PublicGuard]

      },
      {
        path: 'forget-password',
        loadComponent: () => import('./forget-password/forget-password.page').then( m => m.ForgetPasswordPage),
        canActivate: [PublicGuard]

      }
    ]

  }





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }
