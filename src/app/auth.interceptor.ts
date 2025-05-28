// src/app/auth/auth.interceptor.ts

import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './auth/token.service';
// import { TokenService } from './token.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const http = inject(HttpClient);
  const accessToken = tokenService.getAccessToken();

  let authReq = req;
  if (accessToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(authReq, next, tokenService, http);
      }
      return throwError(() => error);
    })
  );
};

// fonction de rafraîchissement du token
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  http: HttpClient
): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return http.post<any>('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken
    }).pipe(
      switchMap((response) => {
        isRefreshing = false;
        tokenService.saveAccessToken(response.access);
        refreshTokenSubject.next(response.access);
        const newRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${response.access}`)
        });
        return next(newRequest);
      }),
      catchError((err) => {
        isRefreshing = false;
        tokenService.clearTokens();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        const newRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(newRequest);
      })
    );
  }
}
