import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainShopComponentComponent } from './main-shop-component.component';

import {
  MatToolbarModule,
  MatSidenavModule,
} from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

describe('MainShopComponentComponent', () => {
  let component: MainShopComponentComponent;
  let fixture: ComponentFixture<MainShopComponentComponent>;

  @Component({
    selector: 'app-products',
    template: ''
  })
  class MockNavComponent {
  }

  @Component({
    selector: 'app-filters',
    template: ''
  })
  class MockFiltersComponent {
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule],
      declarations: [
        MockNavComponent,
        MockFiltersComponent,
        MainShopComponentComponent]
    })
    .overrideComponent(MainShopComponentComponent, {
        set: {
          providers: [ BreakpointObserver ]
        }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainShopComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
