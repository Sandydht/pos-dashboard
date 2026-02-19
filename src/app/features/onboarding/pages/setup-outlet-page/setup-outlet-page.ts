import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/input/input';
import { ButtonComponent } from '../../../../shared/components/button/button';
import { TextareaComponent } from '../../../../shared/components/textarea/textarea';
import { StepHeaderComponent } from '../../components/step-header/step-header';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup-outlet-page',
  standalone: true,
  imports: [CommonModule, InputComponent, TextareaComponent, ButtonComponent, StepHeaderComponent],
  templateUrl: './setup-outlet-page.html',
  styleUrl: './setup-outlet-page.css',
})
export class SetupOutletPage {
  private readonly router = inject(Router);

  goToSetupStorePage(): void {
    this.router.navigate(['/onboarding', 'setup-store']);
  }
}
