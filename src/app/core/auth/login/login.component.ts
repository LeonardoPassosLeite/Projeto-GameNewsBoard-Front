import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../shared/forms/input/input.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handling.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

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
  
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        this.toastr.success(res.message); 
        setTimeout(() => {
          this.router.navigate(['/manage-games']);
        }, 300);  
      },
      error: (err) => {
        const msg = this.errorHandler.handleHttpError(err);
        this.toastr.error('Informe seus dados corretamente');
        this.errorMessage = msg;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
