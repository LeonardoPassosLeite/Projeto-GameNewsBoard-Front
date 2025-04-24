import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { InputComponent } from '../../../../shared/forms/input/input.component';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../../../shared/models/commons/api-response.model';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [GenericModule, InputComponent, ReactiveFormsModule],
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  form: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private errorHandler: ErrorHandlingService,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.authService.register(this.form.value).subscribe({
      next: (res: ApiResponse<string>) => {
        this.toastr.success(res.message);
        this.router.navigate(['/login']);
      },
      error: err => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error(msg);
        this.errorMessage = msg;
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
