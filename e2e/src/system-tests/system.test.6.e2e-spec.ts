/**
    Task 6

    Goal:	
        Verify order behavior

    Process description:	
        Create system test for checking ordering process with different input types:
            -	Order empty basket
            -	Order basket with products
            -	Order with empty shipping information
            -	Order with complete shipping information and type

    Completion Criteria:	
        Result of each interaction should be correct presentation of actual button states.
        If basket is empty – “Order” button should be disabled
        If basket contains product – “Order” button should be enabled
        If basket is empty – “Shopping!! 💥”  button should be enabled
        If basket contains product – “Shopping!! 💥”  button should be disabled
        Clicking on “Submit” button with empty shipping info fields should present errors for each incorrect field.
        Clicking on “Submit” button with some incorrect shipping info fields should present errors for each incorrect field.
        Clicking on “Submit” button with all correct shipping info fields should create order for user, remove products 
            from basket and update products count on product list view.

*/
 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { BasketPO } from '../page.objects/basket.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
import { parseWebDriverCommand } from 'blocking-proxy/built/lib/webdriver_commands';
 
describe('System Test 6 - Verify order behavior', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();
    let basketPage: BasketPO = new BasketPO();

    beforeEach(() => {
        
    });

    it('Order empty basket', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        expect(productsPage.getBasketThumbnailText()).toEqual('0');

        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let orderButton = basketPage.getOrderButton();
        expect(orderButton.isEnabled()).toEqual(false);
    });

    it('Order basket with products', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        
        let productCard = productsPage.getProductCard(1);
        let productCount = await productsPage.getProductCount(productCard);
        let productPrice = await productsPage.getProductPrice(productCard);
        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));
        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);

        let addButton = productsPage.getProductAddButton(productCard);

        addButton.click()
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let orderButton = basketPage.getOrderButton();
        expect(orderButton.isEnabled()).toEqual(true);

        orderButton.click();
        expect(basketPage.getOrderWindow().isPresent()).toEqual(true);
        
        basketPage.getOrderCancelButton().click();
        browser.driver.sleep(2000);
        expect(basketPage.getOrderWindow().isPresent()).toEqual(false);

        orderButton.click();
        expect(basketPage.getOrderWindow().isPresent()).toEqual(true);
    });

    it('Order with empty shipping information', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        
        let productCard = productsPage.getProductCard(1);
        let productCount = await productsPage.getProductCount(productCard);
        let productPrice = await productsPage.getProductPrice(productCard);
        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));
        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);

        let addButton = productsPage.getProductAddButton(productCard);

        addButton.click()
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let orderButton = basketPage.getOrderButton();
        expect(orderButton.isEnabled()).toEqual(true);

        orderButton.click();
        expect(basketPage.getOrderWindow().isPresent()).toEqual(true);
        expect(basketPage.getInputErrors().count()).toEqual(0);
        
        basketPage.getOrderSubmitButton().click();
        expect(basketPage.getInputErrors().count()).toEqual(8);
    });

    it('Order with complete shipping information and type', async() => {
        productsPage.navigateTo();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/');
        
        let productCard = productsPage.getProductCard(1);
        let productCount = await productsPage.getProductCount(productCard);
        let productPrice = await productsPage.getProductPrice(productCard);
        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));
        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);

        let addButton = productsPage.getProductAddButton(productCard);

        addButton.click()
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let orderButton = basketPage.getOrderButton();
        expect(orderButton.isEnabled()).toEqual(true);

        orderButton.click();
        expect(basketPage.getOrderWindow().isPresent()).toEqual(true);
        expect(basketPage.getInputErrors().count()).toEqual(0);
        
        basketPage.getOrderFirstNameInput().sendKeys('Testuserfirstname');
        basketPage.getOrderLastNameInput().sendKeys('Testuserlastname');
        basketPage.getOrderEmailInput().sendKeys('somesome@some.com');
        basketPage.getOrderPhoneInput().sendKeys('1231231232');
        basketPage.getOrderAddressInput().sendKeys('Some address Long Street, 32');
        basketPage.getOrderCityInput().sendKeys('Some City');
        basketPage.getOrderPostalCodeInput().sendKeys('12345');
        basketPage.selectState();

        basketPage.getOrderSubmitButton().click();
        browser.driver.sleep(2000);
        expect(basketPage.getOrderWindow().isPresent()).toEqual(false);
        expect(basketPage.getShoppingLargeButton().isPresent()).toEqual(true);
    });
});
