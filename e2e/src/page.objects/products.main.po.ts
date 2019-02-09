import { browser, by, element, promise, ElementFinder, ElementArrayFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';

export class ProductsMainPO {
     
    navigateTo():promise.Promise<any> {
        return browser.get('/');
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

    getFilerButtons(): ElementArrayFinder {
        return element(by.css('.mat-sidenav-container')).all(by.css('.menuButton'));
    }

    getSmartphonesFilerButton(): ElementFinder {
        return this.getFilerButtons().get(0);
    }

    getLaptopsFilerButton(): ElementFinder {
        return this.getFilerButtons().get(1);
    }

    getMonitorsFilerButton(): ElementFinder {
        return this.getFilerButtons().get(2);
    }

    getAccessoriesFilerButton(): ElementFinder {
        return this.getFilerButtons().get(3);
    }

    getCountMinSliderThumb(): ElementFinder {
        return element(by.xpath('/html/body/app-root/div/app-main-shop-component/mat-sidenav-container/mat-sidenav/div/app-filters/mat-nav-list/div[5]/ng5-slider/span[5]'))
    }

    getCountMaxSliderThumb(): ElementFinder {
        return element(by.xpath('/html/body/app-root/div/app-main-shop-component/mat-sidenav-container/mat-sidenav/div/app-filters/mat-nav-list/div[5]/ng5-slider/span[6]'))
    }

    getPriceMinSliderThumb(): ElementFinder {
        return element(by.xpath('/html/body/app-root/div/app-main-shop-component/mat-sidenav-container/mat-sidenav/div/app-filters/mat-nav-list/div[6]/ng5-slider/span[5]'))
    }

    getPriceMaxSliderThumb(): ElementFinder {
        return element(by.xpath('/html/body/app-root/div/app-main-shop-component/mat-sidenav-container/mat-sidenav/div/app-filters/mat-nav-list/div[6]/ng5-slider/span[6]'))
    }

    moveCountMinToTheRight() {
        this.move(this.getCountMinSliderThumb(), 40, 0)
    }
    moveCountMinToTheLeft() {
        this.move(this.getCountMinSliderThumb(), -100, 0)
    }
    moveCountMaxToTheRight() {
        this.move(this.getCountMaxSliderThumb(), 100, 0)
    }
    moveCountMaxToTheLeft() {
        this.move(this.getCountMaxSliderThumb(), -40, 0)
    }

    movePriceMinToTheRight() {
        this.move(this.getPriceMinSliderThumb(), 40, 0)
    }
    movePriceMinToTheLeft() {
        this.move(this.getPriceMinSliderThumb(), -100, 0)
    }
    movePriceMaxToTheRight() {
        this.move(this.getPriceMaxSliderThumb(), 100, 0)
    }
    movePriceMaxToTheLeft() {
        this.move(this.getPriceMaxSliderThumb(), -40, 0)
    }

    move(element: ElementFinder, toX: number, toY: number) {
        let countThumb = element
        // browser.actions().mouseMove(countThumb, { x: 0, y: 0 }).perform();
        browser.actions().mouseDown(countThumb).perform();
        browser.actions().mouseMove(countThumb, { x: toX, y: toY }).perform();
        browser.actions().mouseUp(countThumb).perform();
        browser.driver.sleep(100);
    }
    // Products Grid

    getProductsGrid(): ElementFinder {
        return element(by.css('.grid-container'));
    }

    getFilterInput(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-input-0"]'));
    }

    getSortingElement(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-select-0"]/div/div[1]'));
    }
    getPriceLowToTopSort(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-option-0"]/span'));
    }
    getPriceTopToLowSort(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-option-1"]/span'));
    }
    getNameAscendingSort(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-option-2"]/span'));   
    }
    getNameDescendingSort(): ElementFinder {
        return this.getProductsGrid().element(by.xpath('//*[@id="mat-option-3"]/span'));
    }

    selectPriceLowToTopSort() {
        this.selectSorting(this.getPriceLowToTopSort());
    }
    selectPriceTopToLowSort() {
        this.selectSorting(this.getPriceTopToLowSort());
    }
    selectNameAscendingSort() {
        this.selectSorting(this.getNameAscendingSort());
    }
    selectNameDescendingSort() {
        this.selectSorting(this.getNameDescendingSort());
    }

    selectSorting(sortElement) {
        this.getSortingElement().click().then(() => {
            browser.driver.sleep(100);
            sortElement.click();
            browser.driver.sleep(100);
        });
    }

    getProductsCardsWithWait(): ElementArrayFinder {
        var until = protractor.ExpectedConditions;
        let elem = this.getProductsGrid().element(by.css('app-product'));
        browser.wait(until.presenceOf(elem), 5000);
        
        return this.getProductsGrid().all(by.css('app-product'));
    }

    getProductsCards(): ElementArrayFinder {
        return this.getProductsGrid().all(by.css('app-product'));
    }

    getProductCard(index: number): ElementFinder {
        var until = protractor.ExpectedConditions;
        let elem = this.getProductsGrid().element(by.css('app-product'));
        browser.wait(until.presenceOf(elem), 8000);

        return this.getProductsGrid().all(by.css('app-product')).get(index);
    }

    getProductTitle(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.product-title')).getText();
    }

    getProductPrice(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.product-price')).getText();
    }

    getProductCount(elem: ElementFinder): promise.Promise<String> {
        return elem.element(by.css('.product-count')).getText();
    }

    getProductAddButton(elem: ElementFinder): ElementFinder {
        return elem.element(by.css('.add-one'));
    }

    getProductRemoveButton(elem: ElementFinder): ElementFinder {
        return elem.element(by.css('.remove-one'));
    }

    clickOnElement(elem: ElementFinder, times: number) {
        for (var i = 0; i<times; i++) {
            elem.click();
        }
    }

    //PRODUCT DETAIL WINDOW

    getProductDetailWindow(): ElementFinder {
        return element(by.css('.product-detail'));
    }

    getProductDetailTitle(): promise.Promise<String> {
        return this.getProductDetailWindow().element(by.css('.product-title')).getText();
    }

    getProductDetailPrice(): promise.Promise<String> {
        return this.getProductDetailWindow().element(by.css('.product-price')).getText();
    }

    getProductDetailCount(): promise.Promise<String> {
        return this.getProductDetailWindow().element(by.css('.product-count')).getText();
    }

    getProductDetailAddButton(): ElementFinder {
        return this.getProductDetailWindow().element(by.css('.add-one'));
    }

    getProductDetailRemoveButton(): ElementFinder {
        return this.getProductDetailWindow().element(by.css('.remove-one'));
    }

    getProductDetailCloseButton(): ElementFinder {
        return element(by.css('mat-dialog-actions')).element(by.css('.close-product-detail'));
    }

    getProductDetailBackgroundField(): ElementFinder {
        return element(by.xpath('/html/body/div[1]/div[1]'))
    }
}
    