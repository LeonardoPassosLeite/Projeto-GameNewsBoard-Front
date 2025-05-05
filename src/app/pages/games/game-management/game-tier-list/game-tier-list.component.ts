import { Component, OnInit } from '@angular/core';
import { NavigateButtonComponent } from '../../../../shared/forms/navigate-button/navigate-button.component';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { TierListService } from '../../../../shared/services/tier-list-service';
import { TierListResponse } from '../../../../shared/models/tier-list.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RemoveButtonComponent } from '../../../../shared/forms/remove-button/remove-button.component';
import { ConfirmDialogComponent } from '../../../../shared/modais/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-game-tier-list',
  standalone: true,
  imports: [
    GenericModule,
    NavigateButtonComponent,
    RemoveButtonComponent,
    ConfirmDialogComponent,
    FontAwesomeModule,
  ],
  templateUrl: './game-tier-list.component.html',
  styleUrl: './game-tier-list.component.scss',
})
export class GameTierListComponent implements OnInit {
  tierLists: TierListResponse[] = [];
  errorMessage: string = '';
  loading = true;
  uploadsBaseUrl = environment.uploadsBaseUrl;
  hoveredTierId: string | null = null;
  confirmTierId: string | null = null;

  constructor(
    private tierListService: TierListService,
    private toastr: ToastrService,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.loadTiers();
  }

  openConfirmDialog(tierId: string): void {
    this.confirmTierId = tierId;
  }

  loadTiers(): void {
    this.tierListService.getMyTierLists().subscribe({
      next: (tiers) => {
        this.tierLists = tiers;
        this.loading = false;

        tiers.forEach((tier) => {
          console.log(`[Tier] ${tier.title}: ${tier.imageUrl}`);
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = this.errorHandler.handleHttpError(err);
        this.toastr.error(this.errorMessage);
      },
    });
  }

  onDeleteConfirmed(): void {
    if (!this.confirmTierId) return;

    this.tierListService.deleteTierList(this.confirmTierId).subscribe({
      next: () => {
        this.toastr.success('Tier deletada com sucesso.');
        this.tierLists = this.tierLists.filter((t) => t.id !== this.confirmTierId);
        this.confirmTierId = null;
      },
      error: (err) => {
        this.toastr.error(this.errorHandler.handleHttpError(err));
        this.confirmTierId = null;
      },
    });
  }

  onDeleteCancelled(): void {
    this.confirmTierId = null;
  }

  goToCreateTier(): void {
    this.router.navigate(['manage-games/tier-list/create-tier-list']);
  }

  goToTier(tierId: string): void {
    this.router.navigate(['manage-games/tier-list/add-game-tier-list', tierId]);
  }

  getImageUrl(relativePath?: string): string {
    if (!relativePath) return 'assets/images/default-tier.png';
    return encodeURI(`${this.uploadsBaseUrl}${relativePath}`);
  }
}
