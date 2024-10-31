import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../shared.service';
import { messages } from '../messages';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent {
  materialName:string[] = ['Material-1', 'Material-2', 'Material-3'];
  supplierName:string[] = ['Supplier-1', 'Supplier-2', 'Supplier-3'];

  //materialName:string[] = [];
  //supplierName:string[] = [];

  materialData = {
    materialName: '',
    supplierName: '',
    materialQuantity: null
  };

  materialNameError: string = '';
  supplierNameError: string = '';
  materialQuantityError: string = '';

  messages = messages;
  formSubmitted: boolean = false;


  //constructor(private sharedService: SharedService, private toastr: ToastrService, private apiService: ApiService) { }
  constructor(private sharedService: SharedService, private toastr: ToastrService) { }

  ngOnInit(){
    //this.fetchMaterialNames();
    //this.fetchSupplierNames();
  }

  // fetchMaterialNames() {
  //   this.apiService.getMaterialNames().subscribe({
  //     next: (data) => this.materialNames = data,
  //     error: (err) => this.toastr.error('Failed to load material names', 'Error')
  //   });
  // }

  // fetchSupplierNames() {
  //   this.apiService.getSupplierNames().subscribe({
  //     next: (data) => this.supplierNames = data,
  //     error: (err) => this.toastr.error('Failed to load supplier names', 'Error')
  //   });
  // }


  validateForm() {
    this.materialNameError = '';
    this.supplierNameError = '';
    this.materialQuantityError = '';

    if (!this.materialData.materialName) {
      this.materialNameError = this.messages.materialNameRequired;
      return this.materialNameError;
    }

    if (!this.materialData.supplierName) {
      this.supplierNameError = this.messages.supplierNameRequired;
      return this.supplierNameError;
    }

    if (this.materialData.materialQuantity === null || this.materialData.materialQuantity === undefined) {
      this.materialQuantityError = this.messages.materialQuantityRequired;
      return this.materialQuantityError;
    } else if (this.materialData.materialQuantity < 1) {
      this.materialQuantityError = this.messages.materialQuantityMinValue;
      return this.materialQuantityError;
    }

    return !this.materialNameError && !this.supplierNameError && !this.materialQuantityError;
  }

  onSubmit() {
    const errMsg = this.validateForm();
    if (errMsg !== true) {
      if (this.materialNameError) {
        this.toastr.error(this.materialNameError, 'Error', {positionClass:'toast-top-left'});
      }
      if (this.supplierNameError) {
        this.toastr.error(this.supplierNameError, 'Error', {positionClass:'toast-top-left'});
      }
      if (this.materialQuantityError) {
        this.toastr.error(this.materialQuantityError, 'Error', {positionClass:'toast-top-left'});
      }
      return;
    }

    console.log('Submitting materialData:', this.materialData);
    this.sharedService.submitMaterialData(this.materialData);
    this.toastr.success(this.messages.materialDataSuccess, 'Success',  {positionClass:'toast-top-left'});
    this.formSubmitted = true;
  }
}
