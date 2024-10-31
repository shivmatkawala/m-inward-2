import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnDestroy {
  materialData: any;
  totalBatches: number = 0;
  totalPacks: number = 0;
  private materialDataSubscription: Subscription | null = null;
  private batchDataSubscription: Subscription | null = null;
  private packDataSubscription: Subscription | null = null;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.materialDataSubscription = this.sharedService.materialData$.subscribe(materialData => {
      console.log('Received materialData:', materialData);
      this.materialData = materialData;
    });

    this.batchDataSubscription = this.sharedService.batchData$.subscribe(() => {
      this.totalBatches = this.sharedService.getNumberOfBatches();
    });

    this.packDataSubscription = this.sharedService.packData$.subscribe(() => {
      this.totalPacks = this.sharedService.getTotalPackCount();
    });
  }

  ngOnDestroy() {
    if (this.materialDataSubscription) {
      this.materialDataSubscription.unsubscribe();
    }
    if (this.batchDataSubscription) {
      this.batchDataSubscription.unsubscribe();
    }
    if (this.packDataSubscription) {
      this.packDataSubscription.unsubscribe();
    }
  }
}
