import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StoredUser, TokenService } from './token.service';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: StoredUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenService);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap(res => this.persist(res)));
  }

  register(req: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/register`, req)
      .pipe(tap(res => this.persist(res)));
  }

  refresh(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = this.tokens.getRefreshToken();
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.baseUrl}/refresh-token`, { refreshToken })
      .pipe(tap(res => this.persist(res)));
  }

  logout(): Observable<ApiResponse<boolean>> {
    const refreshToken = this.tokens.getRefreshToken() ?? '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<ApiResponse<boolean>>(`${this.baseUrl}/revoke-token`, JSON.stringify(refreshToken), { headers })
      .pipe(tap(() => this.tokens.clear()));
  }

  private persist(res: ApiResponse<LoginResponse>): void {
    if (res.success && res.data) {
      this.tokens.setSession(res.data.token, res.data.refreshToken, res.data.user);
    }
  }
}
