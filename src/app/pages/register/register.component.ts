import { Component, HostListener, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isScrolled = false;
  isLoading = false;
  errorMessage = '';

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  onRegister(form: NgForm): void {
    this.errorMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    this.auth
      .register({
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone.trim(),
        password: this.password
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            console.log('Registered as role:', response.data.user.role);
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message || 'Registration failed.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
  }
}
