import { Component, OnInit } from '@angular/core';
import { NavigateButtonComponent } from '../../../../shared/forms/navigate-button/navigate-button.component';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';
import { TierListService } from '../../../../shared/services/tier-list-service';
import { TierListResponse } from '../../../../shared/models/tier-list.model';

@Component({
  selector: 'app-game-tier-list',
  standalone: true,
  imports: [GenericModule, NavigateButtonComponent],
  templateUrl: './game-tier-list.component.html',
  styleUrl: './game-tier-list.component.scss',
})
export class GameTierListComponent implements OnInit {
  tierLists: TierListResponse[] = [];
  errorMessage: string = '';
  loading = true;
  uploadsBaseUrl = environment.uploadsBaseUrl;

  constructor(
    private tierListService: TierListService,
    private toastr: ToastrService,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.loadTiers();
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

  goToCreateTier(): void {
    this.router.navigate(['manage-games/tier-list/create-tier-list']);
  }

  goToTier(tierId: string): void {
    console.log('[GameTierListComponent] Navegando para montagem do tier, id:', tierId);
    this.router.navigate(['manage-games/tier-list/add-game-tier-list', tierId]);
  }

  getImageUrl(relativePath?: string): string {
    if (!relativePath) return 'assets/images/default-tier.png'; 
    return encodeURI(`${this.uploadsBaseUrl}${relativePath}`);
  } 
}