import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class BasketPO {
     
    navigateToBasket():promise.Promise<any> {
        return browser.get('/basket');
    }
    
    // Header
    getTitleText(): promise.Promise<String> {
        return element(by.xpath('/html/body/app-root/div/mat-toolbar/span[1]')).getText();
    }

    getBasketButton(): ElementFinder {
        return element(by.xpath('/html/body/app-root/div/mat-toolbar/button'));
    }
    
    getBasketStatusTitleText(): promise.Promise<String> {
        return element(by.xpath('/html/body/app-root/div/mat-toolbar/div')).getText();
    }

    getBasketThumbnailText(): promise.Promise<String> {
        return element(by.xpath('//*[@id="mat-badge-content-0"]')).getText();
    }
    
    // Filters Menu

    getMenuButtons(): ElementArrayFinder {
        return element(by.css('.mat-sidenav-container')).all(by.css('.menuButton'));
    }

    getContinueShoppingButton(): ElementFinder {
        return this.getMenuButtons().get(0);
    }

    getOrderButton(): ElementFinder {
        return this.getMenuButtons().get(1);
    }

    // Products Grid

    getBasketGrid(): ElementFinder {
        return element(by.css('.table-container'));
    }

    // getProductsCardsWithWait(): ElementArrayFinder {
    //     var until = protractor.ExpectedConditions;
    //     let elem = this.getProductsGrid().element(by.css('.mat-row'));
    //     browser.wait(until.presenceOf(elem), 5000);
        
    //     return this.getProductsGrid().all(by.css('app-product'));
    // }

    getProductsCards(): ElementArrayFinder {
        return this.getBasketGrid().all(by.css('.mat-row'));
    }

    getProductRow(index: number): ElementFinder {
        return this.getProductsCards().get(index);
    }

    getProductName(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.cdk-column-name')).getText();
    }

    getProductPrice(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.cdk-column-price')).getText();
    }

    getProductCount(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.cdk-column-count')).getText();
    }

    getProductAddButton(elem: ElementFinder): ElementFinder {
        return elem.element(by.css('.add-one'));
    }

    getProductRemoveButton(elem: ElementFinder): ElementFinder {
        return elem.element(by.css('.remove-one'));
    }

    getProductDeleteButton(elem: ElementFinder): ElementFinder {
        return elem.element(by.css('.delete-one'));
    }

    clickOnElement(elem: ElementFinder, times: number) {
        for (var i = 0; i<times; i++) {
            elem.click();
        }
    }

    getTotalAmount(): promise.Promise<String> {
        return this.getBasketGrid()
            .element(by.css('.mat-footer-row'))
            .element(by.css('.cdk-column-amount')).getText();
    }

    getShoppingLargeButton(): ElementFinder {
        return element(by.css('.shoppingButton'));
    }

    //ORDER WINDOW

    getOrderWindow(): ElementFinder {
        return element(by.css('.shipping-card'));
    }

    getOrderFirstNameInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.firstName'));
    }

    getOrderLastNameInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.lastName'));
    }

    getOrderEmailInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.email'));
    }

    getOrderPhoneInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.phone'));
    }

    getOrderAddressInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.address'));
    }

    getOrderCityInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.city'));
    }

    getOrderPostalCodeInput(): ElementFinder {
        return this.getOrderWindow().element(by.css('.postalCode'));
    }

    getOrderStateSelect(): ElementFinder {
        return this.getOrderWindow().element(by.css('.state'));
    }
    getOrderStateFirstElement(): ElementFinder {
        return element(by.xpath('//*[@id="mat-option-8"]/span'));
    }
    selectState() {
        this.getOrderStateSelect().click().then(() => {
            this.getOrderStateFirstElement().click();
        })
    }

    getOrderBackgroundField(): ElementFinder {
        return element(by.xpath('/html/body/div/div[1]'))
     // return element(by.xpath('/html/body/div[1]/div[1]'))

    }
    clickOnBackgroundField() {
        // element(by.xpath('/html/body/div/div[1]')).click()
        element(by.xpath('/html/body/div/div[2]')).click()
    }

    getOrderSubmitButton(): ElementFinder {
        return this.getOrderWindow().element(by.css('.submit'));
    }
    getOrderCancelButton(): ElementFinder {
        return this.getOrderWindow().element(by.css('.close'));
    }

    getInputErrors(): ElementArrayFinder {
        return this.getOrderWindow().all(by.css('mat-error'));
    }
}
    