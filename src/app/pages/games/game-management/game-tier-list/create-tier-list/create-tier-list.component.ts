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
import { faImage, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubmitButtonComponent } from '../../../../../shared/forms/submit-button/submit-button.component';
import { NavigateButtonComponent } from '../../../../../shared/forms/navigate-button/navigate-button.component';
import { uploadedImageService } from '../../../../../shared/services/uploaded-image-service';

@Component({
  selector: 'app-create-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    ReactiveFormsModule,
    FormsModule,
    InputComponent,
    SubmitButtonComponent,
    NavigateButtonComponent,
    FontAwesomeModule,
  ],
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
  tierWasCreated = false;

  faImage = faImage;
  faSpinner = faSpinner;

  constructor(
    private fb: FormBuilder,
    private tierListService: TierListService,
    private uploadedImageService: uploadedImageService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location,
    private faLibrary: FaIconLibrary
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
    });

    this.faLibrary.addIcons(faImage, faSpinner);
  }

  ngOnInit(): void {
    const fromRouterState = this.router.getCurrentNavigation()?.extras?.state?.['userId'];
    const fromLocationState = (this.location as any).getState()?.['userId'];
    this.userId = fromRouterState || fromLocationState;
  }

  ngOnDestroy(): void {
    if (this.imageId && !this.tierWasCreated) {
      this.uploadedImageService.deleteImage(this.imageId).subscribe({
        next: () => console.log('[Cleanup] Imagem órfã deletada'),
        error: (err) => console.warn('[Cleanup] Falha ao deletar imagem órfã', err),
      });
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.selectedFile = fileInput.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);

      this.uploading = true;
      this.uploadedImageService.uploadImage(this.selectedFile).subscribe({
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
    if (this.form.invalid || this.uploading || !this.imageId) return;

    const payload: TierListRequest = {
      title: this.form.value.title,
      imageUrl: this.imageUrl ?? undefined,
      imageId: this.imageId ?? undefined,
    };

    this.tierListService.createTierList(payload).subscribe({
      next: (res) => {
        this.tierWasCreated = true;  
        this.toastr.success(res.message);
        this.created.emit();
        this.form.reset();
        this.previewUrl = null;
        this.imageUrl = null;
        this.imageId = null;
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  goBackToTierList(): void {
    this.router.navigate(['/nav-bar/tier-list']);
  }

  getRedirectRoute(): string {
    return '/nav-bar/tier-list';
  }
}
