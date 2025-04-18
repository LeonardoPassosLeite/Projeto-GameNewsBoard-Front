import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItem } from '../../models/commons/menu-item.model';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  submenuOpen = false;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;

  constructor(private router: Router) {}

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
      this.router.navigate(['/inicio']);
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      this.submenuOpen = !this.submenuOpen;
      this.selectedMenuTitle = item.label;
      this.activeSubmenu = this.submenuOpen ? item.submenu : null;
    }
  }
}
