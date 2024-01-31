import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private router: Router, private httpClient: HttpClient) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = localStorage.getItem('userToken');

    if (isAuthenticated) {
      console.log('Authentication is returning true');
      return true;
    } else {
      // Redirect to the login page if not authenticated
      console.log('Authentication is returning false');

      this.router.navigate(['/login']);
      return false;
    }
  }
}
