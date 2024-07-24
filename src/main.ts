import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app/app.component';
import routeConfig from './app/app.routes';
import { JwtInterceptor } from './app/auth/jwt-interceptor';
import { AuthGuard } from './app/auth/authguard';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptor } from './app/auth/auth-interceptor';





bootstrapApplication(AppComponent, {
  providers: [
    // provideHttpClient(withInterceptors([JwtInterceptor])),
    provideRouter(routeConfig),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),
      HttpClientModule
    ),
    AuthGuard,
    CookieService,
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }
  ]
}).catch(err => console.error(err));