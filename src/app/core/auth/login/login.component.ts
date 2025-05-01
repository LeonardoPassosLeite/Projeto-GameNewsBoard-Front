import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handling.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, GenericModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private errorHandler: ErrorHandlingService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.errorMessage = '';
    const { username, password } = this.form.value;

    this.authService.login({ username, password }).subscribe({
      next: async res => {
        this.toastr.success(res.message);

        await new Promise(resolve => setTimeout(resolve, 200));
        const user = await firstValueFrom(this.userService.getAuthenticatedUserSafe());

        if (user?.username) {
          this.router.navigate(['/manage-games']);
        } else {
          this.toastr.error('Não foi possível confirmar o login. Tente novamente.');
          console.warn('[Login] /me retornou null após login');
        }
      },
      error: err => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg);
        this.errorMessage = msg;
        console.error('[Login] Falha:', err);
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
