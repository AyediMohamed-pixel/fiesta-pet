import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class supperAdminGuard {

  constructor(private auth: AuthService, private router: Router){}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.haveAccess();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.haveAccess();
  }

  haveAccess(){
    if(this.auth.isLoggedIn()){
      let activeUser = this.auth.getUserInformation(); 
      if(activeUser && activeUser.role && activeUser.role === 'supper-admin'){
        return true;
      }
      this.router.navigateByUrl('/' + activeUser!.role); 
      return false;
    }
    this.router.navigateByUrl('/auth/sign_in');
    return false;
  }


}
