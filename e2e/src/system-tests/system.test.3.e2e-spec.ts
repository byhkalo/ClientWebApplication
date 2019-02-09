/**
    Task 3

    Goal:	
        Verify the manage basket buttons

    Process description:	
        Create system test for checking manage basket buttons by correct behavior: 
            -	Add product from products list view
            -	Remove product from products list view
            -	Add product from detail card
            -	Remove product from detail card

    Completion Criteria:	
        Result of each interaction should be correct presentation of actual button states.
        “Remove One” button should be disabled on products list view and detail card if basket isn’t contain product
        “Remove One” button should be enabled on products list and detail card view if basket contain product
        “Add One” button should be disabled on products list view and detail card if store don’t have enough product count
        “Add One” button should be enabled on products list view and detail card if store have enough product count
        Product count should be in correct state on products list view
        Product count should be in correct state on detail card

*/


 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
 
describe('System Test 3 - Verify the manage basket buttons', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();

    beforeEach(() => {
        productsPage.navigateTo()
    });

    it('Add product from products list view', async() => {
        let productCard = productsPage.getProductCard(1);
        let productPrice = await productsPage.getProductPrice(productCard);
        let productCount = await productsPage.getProductCount(productCard);

        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));

        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);

        let addButton = productsPage.getProductAddButton(productCard);
        let removeButton = productsPage.getProductRemoveButton(productCard);

        expect(await addButton.isEnabled()).toEqual(true);
        expect(await removeButton.isEnabled()).toEqual(false);

        productsPage.clickOnElement(addButton, count);

        expect(await addButton.isEnabled()).toEqual(false);
        // browser.driver.sleep(3000);
        expect(await removeButton.isEnabled()).toEqual(true);

        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: "+ String(count) +" Total Price: "+String(count * price));
        expect(productsPage.getBasketThumbnailText()).toEqual(String(count));
    });

    it('Remove product from products list view', async() => {
        let productCard = productsPage.getProductCard(1);
        let productPrice = await productsPage.getProductPrice(productCard);
        let productCount = await productsPage.getProductCount(productCard);
        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));

        let addButton = productsPage.getProductAddButton(productCard);
        let removeButton = productsPage.getProductRemoveButton(productCard);

        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);
        expect(await removeButton.isEnabled()).toEqual(false);

        productsPage.clickOnElement(addButton, count);
        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: "+ String(count) +" Total Price: "+String(count * price));
        expect(await addButton.isEnabled()).toEqual(false);
        expect(await removeButton.isEnabled()).toEqual(true);

        productsPage.clickOnElement(removeButton, count);

        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: 0 Total Price: 0");
        expect(productsPage.getBasketThumbnailText()).toEqual(String(0));
    });

    it('Add product from detail card',async() => {
        let productCard = productsPage.getProductCard(1);
        productCard.click();
        let productDetailCard = productsPage.getProductDetailWindow();
        let addButton = productsPage.getProductDetailAddButton();
        let removeButton = productsPage.getProductDetailRemoveButton();
        let productPrice = await productsPage.getProductDetailPrice();
        let productCount = await productsPage.getProductDetailCount();

        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));
        
        expect(productDetailCard.isPresent()).toEqual(true);
        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);

        expect(await addButton.isEnabled()).toEqual(true);
        expect(await removeButton.isEnabled()).toEqual(false);

        productsPage.clickOnElement(addButton, count);

        expect(await addButton.isEnabled()).toEqual(false);
        // browser.driver.sleep(3000);
        expect(await removeButton.isEnabled()).toEqual(true);

        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: "+ String(count) +" Total Price: "+String(count * price));
        expect(productsPage.getBasketThumbnailText()).toEqual(String(count));
    });

    it('Remove product from detail card',async() => {
        let productCard = productsPage.getProductCard(1);
        productCard.click();
        let productDetailCard = productsPage.getProductDetailWindow();
        let addButton = productsPage.getProductDetailAddButton();
        let removeButton = productsPage.getProductDetailRemoveButton();
        let productPrice = await productsPage.getProductDetailPrice();
        let productCount = await productsPage.getProductDetailCount();

        let count: number = Number((productCount.split('Count: ')[1]));
        let price: number = Number((productPrice.split('Price: ')[1]));
        
        expect(productDetailCard.isPresent()).toEqual(true);
        expect(count).toBeGreaterThan(0);
        expect(price).toBeGreaterThan(0);
        expect(await removeButton.isEnabled()).toEqual(false);

        productsPage.clickOnElement(addButton, count);
        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: "+ String(count) +" Total Price: "+String(count * price));
        expect(await addButton.isEnabled()).toEqual(false);
        expect(await removeButton.isEnabled()).toEqual(true);

        productsPage.clickOnElement(removeButton, count);

        expect(productsPage.getBasketStatusTitleText())
        .toEqual("Total Count: 0 Total Price: 0");
        expect(productsPage.getBasketThumbnailText()).toEqual(String(0));
    });
});
