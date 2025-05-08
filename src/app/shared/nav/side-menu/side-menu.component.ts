import { Component, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/commons/menu-item.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { Observable } from 'rxjs';
import { UserProfileResponse } from '../../models/user-profile.model';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [GenericModule, RouterModule, MatIconModule, HeaderComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  submenuOpen = false;
  menuExpanded = true;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;
  isSmallScreen: boolean = false;

  authenticatedUser$!: Observable<UserProfileResponse | null>;
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.detectScreenSize();
    this.authenticatedUser$ = this.userService.getAuthenticatedUserSafe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectScreenSize();
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (
      this.isDropdownOpen &&
      this.eRef.nativeElement &&
      !this.eRef.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }

  detectScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 600;
    this.menuExpanded = !this.isSmallScreen;
  }

  menuItems: MenuItem[] = [
    { label: 'Noticias', icon: 'article', route: '/news' },
    {
      label: 'Jogos',
      icon: 'gamepad',
      submenu: [
        { label: 'Todos os Jogos', route: '/all-games' },
        { label: 'Gerenciar Jogos', route: '/manage-games' },
      ],
    },
    { label: 'Sair', icon: 'logout' },
  ];

  navigateTo(item: MenuItem): void {
    if (item.label === 'Sair') {
      this.authService.logout().subscribe(() => {
        localStorage.clear();
        this.router.navigate(['/login']);
      });
      return;
    }

    if (item.route && this.router.url !== item.route) {
      this.router.navigate([item.route]);
    }

    if (this.isSmallScreen) {
      this.menuExpanded = false;
    }

    this.submenuOpen = false;
    this.selectedMenuTitle = null;
    this.activeSubmenu = null;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      if (!this.menuExpanded && !this.isSmallScreen) {
        this.menuExpanded = true;
        setTimeout(() => {
          this.selectedMenuTitle = item.label;
        }, 300);
      } else {
        this.selectedMenuTitle = this.selectedMenuTitle === item.label ? null : item.label;
      }
    } else {
      this.navigateTo(item);
    }
  }

  toggleMenu(): void {
    this.menuExpanded = !this.menuExpanded;
  }
}
