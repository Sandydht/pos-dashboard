import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppBarLayout } from '../app-bar-layout/app-bar-layout';
import { SideBarLayout } from '../side-bar-layout/side-bar-layout';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, AppBarLayout, SideBarLayout],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
