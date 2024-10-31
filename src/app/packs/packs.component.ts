import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedService } from '../shared.service';
import { Pack } from '../models/pack.model';
import { messages } from '../messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.css']
})
export class PacksComponent implements OnInit {
  numberOfPacks: number = 0;
  packs: Pack[] = [];
  packFormData: Pack[] = [];
  isPackFormEnabled: boolean = false;
  remainingQuantity: number = 0;
  batches: any;
  selectedBatchNumber: string = '';
  selectedBatch: any;
  totalGrossError: string = '';
  messages = messages;

  constructor(private sharedService: SharedService, private toastr: ToastrService) {}

  ngOnInit() {
    this.sharedService.packData$.subscribe(packData => {
      if (packData) {
        this.packs = packData[this.selectedBatchNumber] || [];
      }
    });

    this.sharedService.packFormState$.subscribe(isEnabled => {
      this.isPackFormEnabled = isEnabled;
    });

    this.sharedService.batchData$.subscribe(batchData => {
      if (batchData.length > 0) {
        this.batches = batchData;
      }
    });

    this.sharedService.clickedbatch$.subscribe(batch => {
      if (batch) {
        this.selectedBatch = batch;
        this.selectedBatchNumber = batch.batchNumber;
        if(this.selectedBatch.batchQuantity){
          this.remainingQuantity = this.selectedBatch?.batchQuantity;
        }
        
        this.updatePacks();
        this.updateRemainingQuantity();
      }
    });
  }

  validateForm() {
    this.totalGrossError = '';

    if (this.remainingQuantity < 0) {
      this.totalGrossError = this.messages.totalGrossError;
      // this.toastr.error(this.messages.totalGrossError);  // Show error message
      // return this.messages.totalGrossError;  // Indicate that the form is not valid
    }

    return true;  // Indicate that the form is valid
  }

  addPacks() {
    if (!this.isPackFormEnabled || this.remainingQuantity <= 0) return;

    for (let i = 0; i < this.numberOfPacks; i++) {
      if (this.remainingQuantity <= 0) break;
      const newPack: Pack = {
        index: this.packFormData.length + 1,
        grossWeight: null,
        tareWeight: null,
        netWeight: null,
        isEditing: true,
        batchNumber: this.selectedBatchNumber
      };
      this.packFormData.push(newPack);
    }
    this.numberOfPacks = 0; // Reset the input field
  }

  deletePack(index: number) {
    this.packFormData.splice(index, 1);
    this.packFormData.forEach((pack, idx) => {
      pack.index = idx + 1;
    });
    this.updateRemainingQuantity();
  }

  editPack(pack: Pack) {
    pack.isEditing = true;
  }

  savePack(pack: Pack) {
    pack.isEditing = false;
    this.updateRemainingQuantity();
  }

  calculateNetWeight(pack: Pack) {
    if (pack.grossWeight != null) {
      pack.netWeight = pack.grossWeight;
    }
    this.updateRemainingQuantity();
  }

  submitPacks() {
    let errMsg = this.validateForm();
    // if (errMsg !== true) {
    //   this.toastr.error(errMsg);  // Show error message
    //   return;
    // }

    const validPacks = this.packFormData.filter(pack => pack.grossWeight !== null);

    if (this.isFormValid(validPacks)) {
      this.sharedService.addPacksToService(validPacks, this.selectedBatchNumber);
      this.toastr.success(this.messages.successPackSubmission)
      this.resetPackForm();
      this.isPackFormEnabled = false;
      if (this.sharedService.batchButtonsState$) {
        this.sharedService.enableBatchButtons(); // Re-enable buttons

      }
    } else {
      this.toastr.error(this.messages.totalGrossError);  // Show error message
    }
  }

  private resetPackForm() {
    this.packFormData = [];
    this.selectedBatch = null;
    this.selectedBatchNumber = '';
    this.remainingQuantity = 0;
  }

  private updatePacks() {
    this.sharedService.packData$.subscribe(packData => {
      if (packData) {
        this.packs = packData[this.selectedBatchNumber] || [];
        this.packFormData = this.packs.map(pack => ({ ...pack, isEditing: false }));
      }
    });
  }

  private updateRemainingQuantity() {
    const totalGrossWeight = this.packFormData.reduce((sum, pack) => sum + (pack.grossWeight || 0), 0);
    if(this.selectedBatch?.batchQuantity){
      this.remainingQuantity = this.selectedBatch?.batchQuantity - totalGrossWeight;
    }
  }

  private isFormValid(validPacks: Pack[]): boolean {
    const totalGrossWeight = validPacks.reduce((sum, pack) => sum + (pack.grossWeight || 0), 0);
    return totalGrossWeight <= this.selectedBatch.batchQuantity;
  }
}
