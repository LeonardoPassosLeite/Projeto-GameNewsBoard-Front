import { Component, HostListener } from '@angular/core';
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
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent {
  submenuOpen = false;
  menuExpanded = true; 
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;
  isSmallScreen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.detectScreenSize(); // Chama a função para detectar a tela inicial
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectScreenSize();
  }

  // side-menu.component.ts
  detectScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 600;
    if (this.isSmallScreen) {
      this.menuExpanded = false;
    } else {
      this.menuExpanded = true;
    }
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

    this.submenuOpen = false;
    this.selectedMenuTitle = null;
    this.activeSubmenu = null;
  }

  toggleSubmenu(item: MenuItem): void {
    if (item.submenu) {
      // Se o menu está recolhido, primeiro expande o menu
      if (!this.menuExpanded && !this.isSmallScreen) {
        this.menuExpanded = true;
        // Usamos setTimeout para garantir que o menu está expandido antes de abrir o submenu
        setTimeout(() => {
          this.selectedMenuTitle = item.label;
        }, 300); // Tempo da animação de expansão
      } else {
        // Comportamento normal quando o menu já está expandido
        if (this.selectedMenuTitle === item.label) {
          this.selectedMenuTitle = null;
        } else {
          this.selectedMenuTitle = item.label;
        }
      }
    } else {
      this.navigateTo(item);
    }
  }

  toggleMenu(): void {
    this.menuExpanded = !this.menuExpanded; // Alterna o estado do menu
  }
}
