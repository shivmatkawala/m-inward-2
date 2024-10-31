import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pack } from './models/pack.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private materialDataSubject = new BehaviorSubject<any>(null);
  materialData$ = this.materialDataSubject.asObservable();

  private batchDataSubject = new BehaviorSubject<any[]>([]);
  batchData$ = this.batchDataSubject.asObservable();

  private clickedbatchDataSubject = new BehaviorSubject<any>({});
  clickedbatch$ = this.clickedbatchDataSubject.asObservable();

  private packDataSubject = new BehaviorSubject<{ [key: string]: Pack[] }>({});
  packData$ = this.packDataSubject.asObservable();

  private packFormStateSubject = new BehaviorSubject<boolean>(false);
  packFormState$ = this.packFormStateSubject.asObservable();

  private batchButtonsStateSubject = new BehaviorSubject<boolean>(false);
  batchButtonsState$ = this.batchButtonsStateSubject.asObservable();


  batches: any[] = [];
  packs: { [key: string]: Pack[] } = {};
 

  submitMaterialData(materialData: any) {
    console.log('Received in SharedService:', materialData);
    this.materialDataSubject.next(materialData);
  }

  getMaterialData() {
    return this.materialDataSubject.value;
  }

  addBatchToService(batchData: any) {
    const newBatch = { ...batchData, remainingQuantity: batchData.quantity };
    this.batches.push(newBatch);
    console.log('Batches in service:', this.batches);
    this.batchDataSubject.next(this.batches); 
  }

  getTotalPackCount(): number {
    return Object.values(this.packs).reduce((total, packArray) => total + packArray.length, 0);
  }

  updateBatch(batchData: any) {
    this.clickedbatchDataSubject.next(batchData);
  }

  getNumberOfBatches() {
    return this.batches.length;
  }

  deleteBatch(index: number) {
    if (index >= 0 && index < this.batches.length) {
      const batchToDelete = this.batches[index];
      const batchNumber = batchToDelete.batchNumber;

      if (batchNumber in this.packs) {
        delete this.packs[batchNumber]; // Delete packs associated with this batch
        console.log('Packs after batch deletion:', this.packs);
      }

      this.batches.splice(index, 1);
      console.log('Batches after deletion:', this.batches);
      this.batchDataSubject.next(this.batches);
      this.packDataSubject.next(this.packs);
    }
  }

  addPacksToService(packsData: Pack[], batchNumber: string) {
    this.packs[batchNumber] = packsData;
    this.updateRemainingQuantity(batchNumber);
    console.log('Packs in service:', this.packs);
    this.packDataSubject.next(this.packs);
  }

  getPacks(batchNumber: string) {
    return this.packs[batchNumber] || [];
  }

  deletePack(index: number, batchNumber: string) {
    if (index >= 0 && index < this.packs[batchNumber].length) {
      this.packs[batchNumber].splice(index, 1);
      this.updateRemainingQuantity(batchNumber);
      console.log('Packs after deletion:', this.packs);
      this.packDataSubject.next(this.packs);
    }
  }

  enablePackForm() {
    this.packFormStateSubject.next(true);
  }

  disablePackForm() {
    this.packFormStateSubject.next(false);
  }

  private updateRemainingQuantity(batchNumber: string) {
    const batch = this.batches.find(b => b.batchNumber === batchNumber);
    const batchPacks = this.packs[batchNumber] || [];
    const totalPackedQuantity = batchPacks.reduce((sum, pack) => sum + (pack.netWeight || 0), 0);
    batch.remainingQuantity = batch.quantity - totalPackedQuantity;
    this.batchDataSubject.next(this.batches);
  }

  enableBatchButtons() {
    if (this.batchButtonsStateSubject) {
      this.batchButtonsStateSubject.next(false);
    }
  }
  
}
