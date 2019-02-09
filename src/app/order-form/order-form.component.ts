import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from 'src/services/order.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent {
  addressForm = this.fb.group({
    firstName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    lastName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    phone: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('[0-9 ]*')])],
    address: [null, Validators.required],
    city: [null, Validators.required],
    state: [null, Validators.required],
    postalCode: [null, Validators.compose([
      Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('[0-9 ]*')])
    ],
    shipping: ['free', Validators.required]
  });

  hasUnitNumber = false;

  states = [
    {name: 'Alabama', abbreviation: 'AL'},
    {name: 'Alaska', abbreviation: 'AK'},
    {name: 'American Samoa', abbreviation: 'AS'},
  ];

  firstNameValue: string = '';
  lastNameValue: string = '';
  emailValue: string = '';
  telephoneValue: string = '';
  addresValue: string = '';
  cityValue: string = '';
  stateValue: string = '';
  postalCodeValue: string = '';
  shipingTypeValue: string = 'free';

  constructor(private fb: FormBuilder, private orderService: OrderService, 
    public dialogRef: MatDialogRef<OrderFormComponent>) {}

  onSubmit() {
    if (!this.addressForm.invalid) {
      this.orderService.createOrder(this.firstNameValue, this.lastNameValue, this.emailValue, 
        this.telephoneValue, this.addresValue, this.cityValue, this.stateValue, this.postalCodeValue, 
        this.shipingTypeValue)
      this.dialogRef.close();
    }
  }
}
