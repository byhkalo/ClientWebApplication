/**
    Task 2

    Goal:	
        Verify the detail product card
        
    Process description:	
        Create system test for presenting and close product detail card:
            -	Open card on product click
            -	Close card by “Close” button
            -	Close card by click on outer field


    Completion Criteria:	
        Result of each interaction should be presentation of actual state.
        Card should contain product info (on witch clicked):
            -	Title
            -	Name
            -	Description
            -	Image
            -	Store info
            -	Basket manage buttons
        On click “Close” button – window should be closed
        On click “Outer” field – window should be closed

*/


 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
 
describe('System Test 2 - Verify the detail product card', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();

    beforeEach(() => {
        productsPage.navigateTo()
    });

    it('Open card on product click', async() => {
        let productCard = productsPage.getProductCard(1);
        let productTitle = productsPage.getProductTitle(productCard);
        let productPrice = productsPage.getProductPrice(productCard);
        let productCount = productsPage.getProductCount(productCard);

        productCard.click();

        let productDetailWindow = productsPage.getProductDetailWindow();
        let productDetailTitle = productsPage.getProductDetailTitle();
        let productDetailPrice = productsPage.getProductDetailPrice();
        let productDetailCount = productsPage.getProductDetailCount();

        expect(productDetailWindow.isDisplayed()).toEqual(true);
        expect(productTitle).toEqual(productDetailTitle)
        expect(productPrice).toEqual(productDetailPrice)
        expect(productCount).toEqual(productDetailCount)
    });

    it('Close card by “Close” button', async() => {
        let productCard = productsPage.getProductCard(1);

        productCard.click();

        let productDetailWindow = productsPage.getProductDetailWindow();
        expect(productDetailWindow.isPresent()).toEqual(true);

        productsPage.getProductDetailCloseButton().click();
        browser.driver.sleep(1000);
        expect(productDetailWindow.isPresent()).toEqual(false);
    });

    it('Close card by click on outer field',async() => {
        let productCard = productsPage.getProductCard(1);

        productCard.click();

        let productDetailWindow = productsPage.getProductDetailWindow();
        expect(productDetailWindow.isPresent()).toEqual(true);

        let backgroundToClick = productsPage.getProductDetailBackgroundField()

        browser.actions().mouseDown(backgroundToClick).perform();
        browser.actions().mouseUp(backgroundToClick).perform();
        
        browser.driver.sleep(500);
        expect(productDetailWindow.isPresent()).toEqual(false);
    });

});
