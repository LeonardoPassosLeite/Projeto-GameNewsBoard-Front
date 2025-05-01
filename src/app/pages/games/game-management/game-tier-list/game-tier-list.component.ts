import { Component, OnInit } from '@angular/core';
import { NavigateButtonComponent } from '../../../../shared/forms/navigate-button/navigate-button.component';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { UserService } from '../../../../shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handling.service';
import { UserProfileResponse } from '../../../../shared/models/user-profile.model';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environments';

@Component({
  selector: 'app-game-tier-list',
  standalone: true,
  imports: [GenericModule, NavigateButtonComponent],
  templateUrl: './game-tier-list.component.html',
  styleUrl: './game-tier-list.component.scss',
})
export class GameTierListComponent implements OnInit {
  userProfile: UserProfileResponse | null = null;
  errorMessage: string = '';
  loading = true;
  uploadsBaseUrl = environment.uploadsBaseUrl;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private errorHandler: ErrorHandlingService
  ) {}

  ngOnInit(): void {
    this.reloadProfile();
    console.log(this.userProfile);
  }

  reloadProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.loading = false;
        console.log('[GameTierListComponent] userId no User:', profile.userId);

        this.userProfile?.tiers.forEach((tier) => {
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
    if (!this.userProfile?.userId) {
      this.toastr.error('ID do usuário não encontrado.');
      return;
    }

    this.router.navigate(['manage-games/tier-list/create-tier-list'], {
      state: { userId: this.userProfile.userId },
    });
  }

  goToTier(tierId: string): void {
    console.log('[GameTierListComponent] Navegando para montagem do tier, id:', tierId);

    this.router.navigate(['manage-games/tier-list/add-game-tier-list', tierId]);
  }

  encodeUrl(url: string): string {
    return encodeURI(url);
  }
}
