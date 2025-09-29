import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AnimalRoutingModule } from './animal.routes';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AnimalRoutingModule
  ],
  providers : [
    DatePipe,
    { provide: LOCALE_ID, useValue: "fr-FR" }
  ],
})
export class AnimalModule { }
