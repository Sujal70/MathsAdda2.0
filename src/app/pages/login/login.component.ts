import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isScrolled = false;
  isLoading = false;
  errorMessage = '';

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.redirectByRole(response.data.user.role);
        } else {
          this.errorMessage = response.message || 'Login failed.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

  private redirectByRole(role: string): void {
    // Step 4 will swap these to /admin, /teacher, /student dashboards.
    // For now everyone lands on /home so we can verify login works end-to-end.
    console.log('Logged in as role:', role);
    this.router.navigate(['/home']);
  }
}
