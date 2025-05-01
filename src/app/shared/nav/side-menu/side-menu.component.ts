import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/commons/menu-item.model';
import { AuthService } from '../../../core/auth/services/auth.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [GenericModule, RouterModule, MatIconModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  submenuOpen = false;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  menuItems: MenuItem[] = [
    { label: 'Noticias', icon: 'article', route: '/news' },
    {
      label: 'Jogos',
      icon: 'gamepad',
      submenu: [
        { label: 'Todos os Jogos', route: '/all-games' },
        { label: 'Gerenciar Jogos', route: '/manage-games' }
      ]
    },
    { label: 'Sair', icon: 'logout' }
  ];

  navigateTo(item: MenuItem): void {
    if (item.label === 'Sair') {
      this.authService.logout().subscribe(() => {
        localStorage.clear();
        this.router.navigate(['/login']);
      });
      return;
    }

    if (item.route) this.router.navigate([item.route]);

    this.submenuOpen = false;
    this.selectedMenuTitle = null;
    this.activeSubmenu = null;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu && item.submenu.length > 0) {
      if (this.selectedMenuTitle === item.label && this.submenuOpen) {
        this.submenuOpen = false;
        this.selectedMenuTitle = null;
        this.activeSubmenu = null;
      } else {
        this.submenuOpen = true;
        this.selectedMenuTitle = item.label;
        this.activeSubmenu = item.submenu;
      }
    } else {
      this.navigateTo(item);
      this.submenuOpen = false;
      this.selectedMenuTitle = null;
      this.activeSubmenu = null;
    }
  }
}
