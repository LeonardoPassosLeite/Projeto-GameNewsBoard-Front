import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TierListService } from '../../../../../shared/services/tier-list-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TierListRequest } from '../../../../../shared/models/tier-list.model';
import { Location } from '@angular/common';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { InputComponent } from '../../../../../shared/forms/input/input.component';

@Component({
  selector: 'app-create-tier-list',
  standalone: true,
  imports: [GenericModule, ReactiveFormsModule, FormsModule, InputComponent],
  templateUrl: './create-tier-list.component.html',
  styleUrls: ['./create-tier-list.component.scss'],
})
export class CreateTierListComponent implements OnInit {
  @Output() created = new EventEmitter<void>();

  userId!: string;
  form: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  imageUrl: string | null = null;
  imageId: string | null = null;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private tierListService: TierListService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const fromRouterState = this.router.getCurrentNavigation()?.extras?.state?.['userId'];
    const fromLocationState = (this.location as any).getState()?.['userId'];
    this.userId = fromRouterState || fromLocationState;

    console.log('[CreateTierComponent] userId recebido no ngOnInit:', this.userId);
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.selectedFile = fileInput.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);

      this.uploading = true;
      this.tierListService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          if (res?.imageUrl && res?.imageId) {
            this.imageUrl = res.imageUrl;
            this.imageId = res.imageId;
          } else {
            this.toastr.error('Imagem enviada, mas dados retornados inválidos.');
            console.error('[Upload] Resposta inesperada:', res);
          }
          this.uploading = false;
        },
        error: (err) => {
          console.error('Erro ao enviar imagem:', err);
          this.toastr.error('Erro ao enviar imagem. Tente novamente.');
          this.previewUrl = null;
          this.imageUrl = null;
          this.imageId = null;
          this.uploading = false;
        },
      });
    }
  }

  submit(): void {
    if (this.form.invalid || this.uploading || !this.imageId) {
      this.toastr.warning('Formulário incompleto ou upload em andamento.');
      return;
    }

    const payload: TierListRequest = {
      title: this.form.value.title,
      imageUrl: this.imageUrl ?? undefined,
      imageId: this.imageId ?? undefined,
    };

    this.tierListService.createTierList(payload).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        this.created.emit();
        this.form.reset();
        this.selectedFile = null;
        this.previewUrl = null;
        this.imageUrl = null;
        this.imageId = null;
      },
      error: (err) => {
        console.error('[CreateTierComponent] Erro ao criar tier:', err);
        this.toastr.error(err.message);
      },
    });
  }
}
