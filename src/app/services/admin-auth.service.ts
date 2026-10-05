import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AdminAuthResponse, AdminUser, ApiResponse } from '../models/AdminUser';

const TOKEN_KEY = 'hustle_admin_token';
const USER_KEY = 'hustle_admin_user';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tokenSignal = signal<string | null>(this.getStoredToken());
  private readonly currentUserSignal = signal<AdminUser | null>(this.getStoredUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => {
    const user = this.currentUserSignal();
    const token = this.tokenSignal();
    return !!token && user?.role === 'ROLE_ADMIN';
  });

  login(credentials: { email: string; password: string }): Observable<AdminUser> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post<ApiResponse<AdminAuthResponse>>(url, credentials).pipe(
      map(response => {
        const authData = response.data;
        if (!authData || !authData.user) {
          throw new Error('Invalid authentication response from server.');
        }

        // Strict role validation: Only ROLE_ADMIN allowed in hustle-admin
        if (authData.user.role !== 'ROLE_ADMIN') {
          this.logout();
          throw new Error('Access Denied: Only verified administrators can access the admin dashboard. This account does not have administrator privileges.');
        }

        this.setSession(authData.token, authData.user);
        return authData.user;
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch (e) {
        // Ignore storage exceptions
      }
    }
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isAdmin(): boolean {
    return this.isAuthenticated();
  }

  private setSession(token: string, user: AdminUser): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } catch (e) {
        // Ignore storage exceptions
      }
    }
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);
  }

  private getStoredToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): AdminUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? (JSON.parse(data) as AdminUser) : null;
    } catch {
      return null;
    }
  }
}
