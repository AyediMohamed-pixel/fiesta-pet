import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { defineCustomElement as defineLoading } from '@ionic/core/components/ion-loading';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UsernameValidaor } from 'src/app/shared/validators/username.validator';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class SignInPage {

  errorMsg: any;

  public loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      UsernameValidaor.cannotContainSpace
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });

  constructor(
    private requestService: RequestsService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController

  ) { defineLoading(); }

  ionViewDidEnter() {
  }

  ionViewDidLeave() {
    this.loginForm.reset();
  }

  onSignin() {

    this.loadingCtrl
      .create({ keyboardClose: true, })
      .then((loadingEl) => {
        loadingEl.present();
        this.requestService
          .post('auth/sign_in', this.loginForm.value)
          .subscribe(
            (data) => {
              this.authService.signin(data.data); 
              
              if(data.sessionId) {
                localStorage.setItem('sessionId', data.sessionId);
                this.navCtrl.navigateForward('/agent-depot/session/' + data.sessionId);
              }
              
              window.location.reload();
              loadingEl.dismiss();


            },
            (error) => {
              if (error.error) {
                this.errorMsg = error.error.message;
              } else {
                this.errorMsg = "Quelque chose ne va pas, réessayez !";
              }
              setTimeout(() => {
                this.errorMsg = null;
              }, 5000);
              loadingEl.dismiss();
            }
          );
      });
  }

  getPasswordErrorMessage() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Ce champ est obligatoire.';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'Ce champ contient au minimum 6 caractères.';
    }
    return '';
  }


  getUsernameErroressage() {
    if (this.loginForm.get('username')?.hasError('required')) {
      return "Ce champ est obligatoire.";
    }
    if (this.loginForm.get('username')?.hasError('cannotContainSpace')) {
      return "Ne contient pas d'espace.";
    }
    return '';

  }

}

