/**
    Task 1

    Goal:	
        Verify the filtering and sorting of presented products
        
    Process description:	
        Create system test for modeling filtering and sorting case. Such as:
            -	Filter by product category
            -	Filter by “filter text”
            -	Filter by products count range
            -	Filter by product price range
            -	Sorting: Price low to top
            -	Sorting: Price top to low
            -	Sorting: Name ascending
            -	Sorting: Name descending

    Completion Criteria:	
        Result of each filter should be list of products with correct assortment. 
        Result of sorting should be list of products with correct order. 
        Changing of the filter – should be presented on screen with related behavior. 
        Filter button should change color, range sliders should change detail text.. 
        Changing ordering type – should change sort type text in dropdown field.
*/


 
import { browser, by, element, Key } from 'protractor';
import { ProductsMainPO } from '../page.objects/products.main.po';
import { filter } from 'rxjs/operators';
import { protractor } from 'protractor/built/ptor';
 
describe('System Test 1 - Verify the filtering and sorting of presented products', () => {

    let productsPage: ProductsMainPO = new ProductsMainPO();

    beforeEach(() => {
        productsPage.navigateTo()
    });

    it('should Filter by product category', async() => {
        expect(productsPage.getSmartphonesFilerButton().getText()).toEqual("Smartphones");
        expect(productsPage.getLaptopsFilerButton().getText()).toEqual("Laptops");
        expect(productsPage.getMonitorsFilerButton().getText()).toEqual("Monitors");
        expect(productsPage.getAccessoriesFilerButton().getText()).toEqual("Accessories");
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        productsPage.getSmartphonesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        productsPage.getSmartphonesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        productsPage.getSmartphonesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        let countWithoutSmartphones = await productsPage.getProductsCards().count();

        productsPage.getLaptopsFilerButton().click();
        expect(productsPage.getProductsCards().count()).toBeLessThan(countWithoutSmartphones);
        let countWithoutLaptops = await productsPage.getProductsCards().count();

        productsPage.getMonitorsFilerButton().click();
        expect(productsPage.getProductsCards().count()).toBeLessThan(countWithoutLaptops);
        let countWithoutMonitors = await productsPage.getProductsCards().count();

        productsPage.getAccessoriesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(0);

        productsPage.getAccessoriesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(countWithoutMonitors);

        productsPage.getMonitorsFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(countWithoutLaptops);
        
        productsPage.getLaptopsFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(countWithoutSmartphones);

        productsPage.getSmartphonesFilerButton().click();
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Filter by “filter text”', async() => {
        let filterInput = productsPage.getFilterInput();
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        filterInput.sendKeys('apple')
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount, "Should be less than Original ");
        let appleProductsCount = await productsPage.getProductsCards().count();

        await filterInput.clear();
        filterInput.sendKeys(Key.ENTER)
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        await filterInput.clear();
        await filterInput.sendKeys('APPLE')
        expect(productsPage.getProductsCards().count()).toEqual(appleProductsCount);

        await filterInput.clear();
        await filterInput.sendKeys('APPle')
        expect(productsPage.getProductsCards().count()).toEqual(appleProductsCount);

        await filterInput.clear();
        filterInput.sendKeys(Key.ENTER)        
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        await filterInput.clear();
        await filterInput.sendKeys('qweqweqweqwepoipoipoipoi123321123321123poipqweipqwoieqpwoieqwvnsdvkjndjk cksjkncdkncdskcnjsdkj')
        expect(productsPage.getProductsCards().count()).toEqual(0);

        await filterInput.clear();
        filterInput.sendKeys(Key.ENTER)
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Filter by products count range',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        // move min bit to the right
        productsPage.moveCountMinToTheRight()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);

        // move min to the left
        productsPage.moveCountMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move max bit to the left
        productsPage.moveCountMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        
        // move max to the right
        productsPage.moveCountMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move min bit to the right
        // move max bit to the left
        productsPage.moveCountMinToTheRight()
        productsPage.moveCountMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        var minMaxConfiguredCount = await productsPage.getProductsCards().count();
       
        // move min to the left
        productsPage.moveCountMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeGreaterThan(minMaxConfiguredCount);

        // move max to the right
        productsPage.moveCountMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move min bit to the right
        // move max bit to the left
        productsPage.moveCountMinToTheRight()
        productsPage.moveCountMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        minMaxConfiguredCount = await productsPage.getProductsCards().count();

        // move max to the right
        productsPage.moveCountMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toBeGreaterThan(minMaxConfiguredCount);

        // move min to the left
        productsPage.moveCountMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Filter by product price range',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        // move min bit to the right
        productsPage.movePriceMinToTheRight()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);

        // move min to the left
        productsPage.movePriceMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move max bit to the left
        productsPage.movePriceMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        
        // move max to the right
        productsPage.movePriceMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move min bit to the right
        // move max bit to the left
        productsPage.movePriceMinToTheRight()
        productsPage.movePriceMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        var minMaxConfiguredPrice = await productsPage.getProductsCards().count();
       
        // move min to the left
        productsPage.movePriceMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeGreaterThan(minMaxConfiguredPrice);

        // move max to the right
        productsPage.movePriceMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);

        // move min bit to the right
        // move max bit to the left
        productsPage.movePriceMinToTheRight()
        productsPage.movePriceMaxToTheLeft()
        expect(productsPage.getProductsCards().count()).toBeLessThan(originalProductsCount);
        minMaxConfiguredPrice = await productsPage.getProductsCards().count();

        // move max to the right
        productsPage.movePriceMaxToTheRight()
        expect(productsPage.getProductsCards().count()).toBeGreaterThan(minMaxConfiguredPrice);

        // move min to the left
        productsPage.movePriceMinToTheLeft()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Sorting: Price low to top',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        productsPage.selectNameDescendingSort()
        productsPage.selectPriceLowToTopSort()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Sorting: Price top to low',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        productsPage.selectPriceTopToLowSort()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Sorting: Name ascending',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        productsPage.selectNameAscendingSort()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });

    it('Sorting: Name descending',async() => {
        expect(productsPage.getProductsCardsWithWait().count()).toBeGreaterThan(0);
        let originalProductsCount = await productsPage.getProductsCards().count();
        
        productsPage.selectNameDescendingSort()
        expect(productsPage.getProductsCards().count()).toEqual(originalProductsCount);
    });
});
