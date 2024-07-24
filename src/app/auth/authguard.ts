import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthResponseDto } from '../login/authResponseInteface';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const token = this.cookieService.get("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      console.log(this.jwtHelper.decodeToken(token));
      return true;
    }
    
    const isRefreshSuccess = await this.tryRefreshingTokens(token); 
    if (!isRefreshSuccess) { 
      this.router.navigate(["login"]); 
    }
    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    const refreshToken = this.cookieService.get('refresh_token');
    if (!token || !refreshToken) { 
      return false;
    }
  
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    
    console.log("Sending refresh request with credentials:", credentials);
    
    try {
      const refreshRes = await this.http.post<AuthResponseDto>("http://localhost:5099/auth/token/refresh", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).toPromise();
  
      console.log("Received response:", refreshRes);
      
      if (refreshRes && refreshRes.token && refreshRes.refreshToken) {
        this.cookieService.set("jwt", refreshRes.token);
        this.cookieService.set("refresh_token", refreshRes.refreshToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
    
    return false;
  }
}