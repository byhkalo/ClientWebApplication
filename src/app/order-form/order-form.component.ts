import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasketService } from 'src/services/basketService';
import { OrderService } from 'src/services/order.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent {
  addressForm = this.fb.group({
    company: null,
    firstName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    lastName: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    email: [null, Validators.compose([Validators.required, Validators.email])],
    phone: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('[0-9 ]*')])],
    address: [null, Validators.required],
    address2: null,
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
    {name: 'Arizona', abbreviation: 'AZ'},
    {name: 'Arkansas', abbreviation: 'AR'},
    {name: 'California', abbreviation: 'CA'},
    {name: 'Colorado', abbreviation: 'CO'},
    {name: 'Connecticut', abbreviation: 'CT'},
    {name: 'Delaware', abbreviation: 'DE'},
    {name: 'District Of Columbia', abbreviation: 'DC'},
    {name: 'Federated States Of Micronesia', abbreviation: 'FM'},
    {name: 'Florida', abbreviation: 'FL'},
    {name: 'Georgia', abbreviation: 'GA'},
    {name: 'Guam', abbreviation: 'GU'},
    {name: 'Hawaii', abbreviation: 'HI'},
    {name: 'Idaho', abbreviation: 'ID'},
    {name: 'Illinois', abbreviation: 'IL'},
    {name: 'Indiana', abbreviation: 'IN'},
    {name: 'Iowa', abbreviation: 'IA'},
    {name: 'Kansas', abbreviation: 'KS'},
    {name: 'Kentucky', abbreviation: 'KY'},
    {name: 'Louisiana', abbreviation: 'LA'},
    {name: 'Maine', abbreviation: 'ME'},
    {name: 'Marshall Islands', abbreviation: 'MH'},
    {name: 'Maryland', abbreviation: 'MD'},
    {name: 'Massachusetts', abbreviation: 'MA'},
    {name: 'Michigan', abbreviation: 'MI'},
    {name: 'Minnesota', abbreviation: 'MN'},
    {name: 'Mississippi', abbreviation: 'MS'},
    {name: 'Missouri', abbreviation: 'MO'},
    {name: 'Montana', abbreviation: 'MT'},
    {name: 'Nebraska', abbreviation: 'NE'},
    {name: 'Nevada', abbreviation: 'NV'},
    {name: 'New Hampshire', abbreviation: 'NH'},
    {name: 'New Jersey', abbreviation: 'NJ'},
    {name: 'New Mexico', abbreviation: 'NM'},
    {name: 'New York', abbreviation: 'NY'},
    {name: 'North Carolina', abbreviation: 'NC'},
    {name: 'North Dakota', abbreviation: 'ND'},
    {name: 'Northern Mariana Islands', abbreviation: 'MP'},
    {name: 'Ohio', abbreviation: 'OH'},
    {name: 'Oklahoma', abbreviation: 'OK'},
    {name: 'Oregon', abbreviation: 'OR'},
    {name: 'Palau', abbreviation: 'PW'},
    {name: 'Pennsylvania', abbreviation: 'PA'},
    {name: 'Puerto Rico', abbreviation: 'PR'},
    {name: 'Rhode Island', abbreviation: 'RI'},
    {name: 'South Carolina', abbreviation: 'SC'},
    {name: 'South Dakota', abbreviation: 'SD'},
    {name: 'Tennessee', abbreviation: 'TN'},
    {name: 'Texas', abbreviation: 'TX'},
    {name: 'Utah', abbreviation: 'UT'},
    {name: 'Vermont', abbreviation: 'VT'},
    {name: 'Virgin Islands', abbreviation: 'VI'},
    {name: 'Virginia', abbreviation: 'VA'},
    {name: 'Washington', abbreviation: 'WA'},
    {name: 'West Virginia', abbreviation: 'WV'},
    {name: 'Wisconsin', abbreviation: 'WI'},
    {name: 'Wyoming', abbreviation: 'WY'}
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

  constructor(private fb: FormBuilder, private basketService: BasketService, 
    private orderService: OrderService, public dialogRef: MatDialogRef<OrderFormComponent>) {}

  onSubmit() {
    if (!this.addressForm.invalid) {
      console.log('firstName' + this.firstNameValue)
      console.log('lastName' + this.lastNameValue)
      console.log('email' + this.emailValue)
      console.log('telephone' + this.telephoneValue)
      console.log('addres' + this.addresValue)
      console.log('city' + this.cityValue)
      console.log('state' + this.stateValue)
      console.log('postalCode' + this.postalCodeValue)
      console.log('shipingType' + this.shipingTypeValue)
      this.orderService.createOrder(this.firstNameValue, this.lastNameValue, this.emailValue, 
        this.telephoneValue, this.addresValue, this.cityValue, this.stateValue, this.postalCodeValue, 
        this.shipingTypeValue)
      this.dialogRef.close();
    }
  }
}
