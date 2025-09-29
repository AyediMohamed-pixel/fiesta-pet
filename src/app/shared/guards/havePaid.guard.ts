import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RequestsService } from '../services/requests.service';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class havePaidGuard {
  errorMsg: any;
  havePaidCotisation: boolean = false;

  constructor(private auth: AuthService, private router: Router, private requestService: RequestsService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.haveAccess();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.haveAccess();
  }

  initCotisationState(): Observable<boolean> {
    return this.requestService.get('property/check_payement_cotisation').pipe(
      map(data => {
        this.havePaidCotisation = data; 
        return this.havePaidCotisation;
      }),
      catchError(error => {
        if (error.error) {
          this.errorMsg = error.error.message;
        } else {
          this.errorMsg = 'Quelque chose ne va pas, réessayez !';
        }
        setTimeout(() => {
          this.errorMsg = null;
        }, 5000);
        return of(false); // Returning false in case of error
      })
    );
  }

  haveAccess(): Observable<boolean | UrlTree> {
    return this.initCotisationState().pipe(
      switchMap(havePaid => {
        if (this.auth.isLoggedIn()) {
          let activeUser = this.auth.getUserInformation();
          if (activeUser && activeUser.role && havePaid) {
            return of(true);
          }
          this.router.navigateByUrl('/not-paid');
          return of(false);
        }
        this.router.navigateByUrl('/auth/sign_in');
        return of(false);
      })
    );
  }
}
