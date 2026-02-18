import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service/auth-service';

@Component({
  selector: 'app-dashboard-overview-page',
  imports: [],
  templateUrl: './dashboard-overview-page.html',
  styleUrl: './dashboard-overview-page.css',
})
export class DashboardOverviewPage implements OnInit {
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    console.log('token: ', this.authService.token());
    console.log('userData: ', this.authService.userData());
  }
}
