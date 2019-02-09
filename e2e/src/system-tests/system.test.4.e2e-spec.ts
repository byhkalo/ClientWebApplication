/**
    Task 4

    Goal:	
        Verify basket navigation

    Process description:	
        Create system test for checking basket navigation:
            -	Open basket screen by “Basket” button
            -	Open shop screen from basket by “Continue shopping” button
            -	Open shop screen from basket by “Shopping!! 💥” button
            -	Navigate to/from basket with products

    Completion Criteria:	
        Result of each interaction should be correct presentation of windows.
        Click on basket button should redirect to the basket screen
        Click on “Continue shopping” button should redirect to the shop screen
        Click on “Shopping!! 💥” button should redirect to the shop screen
        If basket is empty - “Shopping!! 💥” button shouldn’t be hidden
        If basket contain products - “Shopping!! 💥” button should be hidden

*/


 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { BasketPO } from '../page.objects/basket.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
import { parseWebDriverCommand } from 'blocking-proxy/built/lib/webdriver_commands';
 
describe('System Test 4 - Verify basket navigation', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();
    let basketPage: BasketPO = new BasketPO();

    beforeEach(() => {
        
    });

    it('Open basket screen by “Basket” button', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');

        await productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');
    });

    it('Open shop screen from basket by “Continue shopping” button', async() => {
        basketPage.navigateToBasket();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        basketPage.getContinueShoppingButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });

    it('Open shop screen from basket by “Shopping!!” button', async() => {
        basketPage.navigateToBasket();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let largeContinueButton = basketPage.getShoppingLargeButton();
        expect(largeContinueButton.isPresent()).toEqual(true);
        largeContinueButton.click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
    });

    it('Navigate to/from basket with products', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        
        let productCard = productsPage.getProductCard(1);
        let productCount = await productsPage.getProductCount(productCard);
        let count: number = Number((productCount.split('Count: ')[1]));
        expect(count).toBeGreaterThan(0);
        let addButton = productsPage.getProductAddButton(productCard);

        addButton.click()

        expect(productsPage.getBasketThumbnailText()).toEqual('1');
    
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');
        expect(basketPage.getBasketThumbnailText()).toEqual('1');

        let largeContinueButton = basketPage.getShoppingLargeButton();
        expect(largeContinueButton.isPresent()).toEqual(false);

        basketPage.getContinueShoppingButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        expect(productsPage.getBasketThumbnailText()).toEqual('1');
    });
});
