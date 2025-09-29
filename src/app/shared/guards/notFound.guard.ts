// not-found-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotFoundGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requestedPath = state.url;

    // Vérifie si le chemin spécifié existe dans la configuration de routage
    const isPathValid = this.isPathValid(requestedPath);

    if (!isPathValid) {
      // Redirige vers le composant NotFound si le chemin n'est pas trouvé
      this.router.navigate(['/not-found']);
    }

    return isPathValid;
  }

  private isPathValid(requestedPath: string): boolean {
    // Tu devras adapter cette logique en fonction de la structure de ton application
    // Ici, je suppose que tu as une liste de chemins valides dans ton application
    const validPaths = ['/home', '/dashboard', '/profile']; // Exemple

    return validPaths.includes(requestedPath);
  }
}
