import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { messages } from '../messages';
import { SharedService } from '../shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-batches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './batches.component.html',
  styleUrls: ['./batches.component.css'],
  preserveWhitespaces: true
})
export class BatchesComponent implements OnInit {
  materialQuantity: number = 0;
  totalBatchQuantity: number = 0;
  remainingMaterialQuantity: number = 0;
  disableButtons: boolean = false;

  batchData = {
    batchNumber: '',
    batchQuantity: null
  };

  batches: any[] = [];

  batchNumberError: string = '';
  batchQuantityError: string = '';

  messages = messages;

  constructor(private sharedService: SharedService, private toastr: ToastrService) {}

  ngOnInit() {
    this.sharedService.materialData$.subscribe(materialData => {
      if (materialData) {
        this.materialQuantity = materialData.materialQuantity;
        this.updateRemainingMaterialQuantity();
      }
    });
    this.sharedService.batchButtonsState$.subscribe(res => this.disableButtons = res);
  }

  validateForm() {
    this.batchNumberError = '';
    this.batchQuantityError = '';

    if (!this.batchData.batchNumber) {
      this.batchNumberError = this.messages.batchNumberRequired;
    } else {
      const lowerCaseBatchNumber = this.batchData.batchNumber.toLowerCase();
      if (this.batches.some(batch => batch.batchNumber.toLowerCase() === lowerCaseBatchNumber)) {
        this.batchNumberError = this.messages.batchNumberDuplicate;
      }
    }

    if (this.batchData.batchQuantity === null || this.batchData.batchQuantity === undefined) {
      this.batchQuantityError = this.messages.batchQuantityRequired;
    } else if (this.batchData.batchQuantity < 1) {
      this.batchQuantityError = this.messages.batchQuantityMinValue;
    } else if ((this.totalBatchQuantity + this.batchData.batchQuantity) > this.materialQuantity) {
      this.batchQuantityError = this.messages.batchQuantityExceeds;
    }

    return !this.batchNumberError && !this.batchQuantityError;
  }

  resetForm() {
    this.batchData = {
      batchNumber: '',
      batchQuantity: null
    };
    this.batchNumberError = '';
    this.batchQuantityError = '';
  }

  onSubmit() {
    if (!this.validateForm()) {
      if (this.batchNumberError) {
        this.toastr.error(this.batchNumberError, 'Error', {positionClass:'toast-top-center'});
      }
      if (this.batchQuantityError) {
        this.toastr.error(this.batchQuantityError, 'Error', {positionClass:'toast-top-center'});
      }
      return;
    } 

    this.sharedService.addBatchToService(this.batchData);
    this.batches.push({ ...this.batchData });
    this.totalBatchQuantity += this.batchData.batchQuantity || 0; // Ensure non-null addition
    this.updateRemainingMaterialQuantity();
    this.toastr.success(this.messages.batchDataSuccess, 'Success', {positionClass:'toast-top-center'});
    this.resetForm();
  }

  isFormDisabled() {
    return this.totalBatchQuantity >= this.materialQuantity;
  }

  deleteBatch(index: number) {
    const batchToDelete = this.batches[index];
    this.sharedService.deleteBatch(index);
    this.totalBatchQuantity -= batchToDelete.batchQuantity;
    this.batches.splice(index, 1);
    this.updateRemainingMaterialQuantity();
    this.toastr.info(this.messages.batchDeleted, 'Info');
  }

  createPacks(batch: any) {
    this.sharedService.enablePackForm();
    this.sharedService.updateBatch(batch);
    this.disableButtons = true;
  }

  private updateRemainingMaterialQuantity() {
    this.remainingMaterialQuantity = this.materialQuantity - this.totalBatchQuantity;
  }
}
