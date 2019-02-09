import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatDialogRef,
} from '@angular/material';

import { OrderFormComponent } from './order-form.component';
import { BasketService } from 'src/services/basketService';
import { OrderService } from 'src/services/order.service';


// private fb: FormBuilder, 
// private basketService: BasketService, 
// private orderService: OrderService, 
// public dialogRef: MatDialogRef<OrderFormComponent>
class MockFormBuilder extends FormBuilder {
}

class MockOrderService {

  mockFirstNameValue: string = 'Firstname';
  mockLastNameValue: string = 'Lastnameuser';
  mockEmailValue: string = 'testtest@mail.com';
  mockTelephoneValue: string = '47888222555';
  mockAddresValue: string = 'Test address';
  mockCityValue: string = 'Krakow';
  mockStateValue: string = 'ASFF';
  mockPostalCodeValue: string = '12332';
  mockShipingTypeValue: string = 'free';
  createOrder(firstName: string, lastName: string, email: string, telephone: string, 
    addres: string, city: string, state: string, postalCode: string, shipingType: string) {
    expect(firstName).toEqual(this.mockFirstNameValue);
    expect(lastName).toEqual(this.mockLastNameValue);
    expect(email).toEqual(this.mockEmailValue);
    expect(telephone).toEqual(this.mockTelephoneValue);
    expect(addres).toEqual(this.mockAddresValue);
    expect(city).toEqual(this.mockCityValue);
    expect(state).toEqual(this.mockStateValue);
    expect(postalCode).toEqual(this.mockPostalCodeValue);
    expect(shipingType).toEqual(this.mockShipingTypeValue);
  }
}

class MockMatDialogRef {
  close() {}
}

describe('OrderFormComponent', () => {
  let component: OrderFormComponent;
  let fixture: ComponentFixture<OrderFormComponent>;

  let mockFormBuilder: MockFormBuilder;
  let mockOrderService: MockOrderService
  let mockDialogRef: MockMatDialogRef

  beforeEach(async(() => {
    mockFormBuilder = new MockFormBuilder();
    mockOrderService = new MockOrderService();
    mockDialogRef = new MockMatDialogRef();

    TestBed.configureTestingModule({
      declarations: [ OrderFormComponent ],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
      ]
    })
    .overrideComponent(OrderFormComponent, {
      set: {
        providers: [ 
          { provide: FormBuilder, useValue: mockFormBuilder },
          { provide: OrderService, useValue: mockOrderService}, 
          { provide: MatDialogRef, useValue: mockDialogRef } ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderFormComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('Submit Form', () => {
    let spyOrderCreate = spyOn(mockOrderService, 'createOrder').and.callThrough();
    let spyCloseDialog = spyOn(mockDialogRef, 'close').and.callThrough();
    fixture.detectChanges();
    // SET Values for order
    component.firstNameValue = mockOrderService.mockFirstNameValue;
    component.lastNameValue = mockOrderService.mockLastNameValue;
    component.emailValue = mockOrderService.mockEmailValue;
    component.telephoneValue = mockOrderService.mockTelephoneValue;
    component.addresValue = mockOrderService.mockAddresValue;
    component.cityValue = mockOrderService.mockCityValue;
    component.stateValue = mockOrderService.mockStateValue;
    component.postalCodeValue = mockOrderService.mockPostalCodeValue;
    component.shipingTypeValue = mockOrderService.mockShipingTypeValue;

    expect(spyOrderCreate.calls.any()).toBe(false);
    expect(spyCloseDialog.calls.any()).toBe(false);

    // INVALID FORM
    let spyOnForm = spyOnProperty(component.addressForm, 'invalid').and.returnValue(true);
    component.onSubmit();
    expect(spyOnForm.calls.any()).toBe(true);
    expect(spyOrderCreate.calls.any()).toBe(false);
    expect(spyCloseDialog.calls.any()).toBe(false);

    // VALID FORM
    spyOnForm.calls.reset();
    expect(spyOnForm.calls.any()).toBe(false);
    spyOnForm.and.returnValue(false);
    component.onSubmit();

    expect(spyOnForm.calls.any()).toBe(true);
    expect(spyOrderCreate.calls.any()).toBe(true);
    expect(spyCloseDialog.calls.any()).toBe(true);
  });
});
