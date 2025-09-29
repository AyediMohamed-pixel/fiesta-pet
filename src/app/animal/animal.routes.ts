import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./animal.page').then(m => m.AnimalPage)
      },
      {
        path: 'ajouter-animal',
        loadComponent: () => import('./add-animal/add-animal.page').then(m => m.AddAnimalPage)
      },
      {
        path: 'detail-animal/:id',
        loadComponent: () => import('./view-animal/view-animal.page').then(m => m.ViewAnimalPage)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimalRoutingModule { }
