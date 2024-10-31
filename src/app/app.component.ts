import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialComponent } from './material/material.component';
import { BatchesComponent } from './batches/batches.component';
import { SummaryComponent } from './summary/summary.component';
import { PacksComponent } from './packs/packs.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialComponent, BatchesComponent, SummaryComponent, PacksComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'm-inward-2';
}
