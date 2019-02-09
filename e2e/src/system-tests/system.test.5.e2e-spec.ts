/**
    Task 5

    Goal:	
        Verify basket manage buttons

    Process description:	
        Create system test for checking basket manage buttons:
            -	Add one more product to basket 
            -	Remove one product
            -	Delete product

    Completion Criteria:	
        Result of each interaction should be correct presentation of actual button states.
        “Remove One” button shouldn’t affect the shopping card if basket contain product with count equal to 0.
        “Remove One” button should affect the shopping card if basket contain product with count greater that 0.
        “Add One” button shouldn’t affect the shopping card if shop isn’t contain enough product count.
        “Add One” button should affect the shopping card if shop contain enough product count.
        “Delete” button should delete product from shopping list.
        Product count should be in correct state on shopping card.

*/
 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { BasketPO } from '../page.objects/basket.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
import { parseWebDriverCommand } from 'blocking-proxy/built/lib/webdriver_commands';
 
describe('System Test 5 - Verify basket manage buttons', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();
    let basketPage: BasketPO = new BasketPO();

    beforeEach(() => {
        
    });

    it('Add one more product to basket', async() => {
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

        let productIn = basketPage.getProductRow(0);
        var productCountBasket = await basketPage.getProductCount(productIn);
        let productPriceBasket = await basketPage.getProductPrice(productIn);
        let countBasket: number = Number(productCountBasket);
        let priceBasket: number = Number(productPriceBasket);
        let addBasketButton = basketPage.getProductAddButton(productIn);

        expect(countBasket).toEqual(1);
        expect(priceBasket).toEqual(price);

        basketPage.clickOnElement(addBasketButton, count-1);
        
        countBasket = Number(await basketPage.getProductCount(productIn));
        let totalBasketAmount = Number(await basketPage.getTotalAmount());
        expect(countBasket).toEqual(count);
        expect(basketPage.getBasketThumbnailText()).toEqual(String(countBasket));
        expect(totalBasketAmount).toEqual(countBasket * price);
    });

    it('Remove one product', async() => {
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

        productsPage.clickOnElement(addButton, 2);
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let productIn = basketPage.getProductRow(0);
        var productCountBasket = await basketPage.getProductCount(productIn);
        let productPriceBasket = await basketPage.getProductPrice(productIn);
        let countBasket: number = Number(productCountBasket);
        let priceBasket: number = Number(productPriceBasket);
        let removeBasketButton = basketPage.getProductRemoveButton(productIn);

        expect(countBasket).toEqual(2);
        expect(priceBasket).toEqual(price);

        basketPage.clickOnElement(removeBasketButton, 2);
        
        countBasket = Number(await basketPage.getProductCount(productIn));
        var totalBasketAmount = Number(await basketPage.getTotalAmount());
        expect(countBasket).toEqual(0);
        expect(basketPage.getBasketThumbnailText()).toEqual('0');
        expect(totalBasketAmount).toEqual(0);

        removeBasketButton.click();
        removeBasketButton.click();
        removeBasketButton.click();

        countBasket = Number(await basketPage.getProductCount(productIn));
        totalBasketAmount = Number(await basketPage.getTotalAmount());
        expect(countBasket).toEqual(0);
        expect(basketPage.getBasketThumbnailText()).toEqual('0');
        expect(totalBasketAmount).toEqual(0);
    });

    it('Delete product', async() => {
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

        productsPage.clickOnElement(addButton, 2);
        productsPage.getBasketButton().click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/basket');

        let productIn = basketPage.getProductRow(0);
        expect(productIn.isPresent()).toEqual(true);
        
        let deleteBasketButton = basketPage.getProductDeleteButton(productIn);
        deleteBasketButton.click();

        let productCards = basketPage.getProductsCards();
        expect(productCards.count()).toEqual(0);
        expect(basketPage.getShoppingLargeButton().isPresent()).toEqual(true);
        expect(basketPage.getBasketThumbnailText()).toEqual('0');
    });
});
