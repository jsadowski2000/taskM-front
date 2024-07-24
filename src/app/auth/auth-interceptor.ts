import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, catchError, filter, from, Observable, switchMap, take, tap, throwError } from "rxjs";
import { AuthResponseDto } from "../login/authResponseInteface";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);


  constructor(
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {}

  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.cookieService.get('jwt');

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes('auth/token/refresh')) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshAccessToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.accessToken);
          return next.handle(this.addToken(request, token.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.router.navigate(['/login']);
          return throwError(error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private refreshAccessToken(): Observable<any> {
    const accessToken = this.cookieService.get('jwt');
    const refreshToken = this.cookieService.get('refresh_token');
    const credentials = { accessToken: accessToken, refreshToken: refreshToken };
    
    return this.http.post<any>('http://localhost:5099/auth/token/refresh', credentials).pipe(
      tap((response) => {
        this.cookieService.set('jwt', response.token);
        this.cookieService.set('refresh_token', response.refreshToken);
      }),
      catchError((error) => {
        console.error('Error refreshing access token:', error);
        return throwError(error);
      })
    );
  }
}