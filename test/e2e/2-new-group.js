describe('Eat this one', function() {

    beforeEach(function() {
        browser.waitForAngular();
    });

    it('should add new groups', function() {

        // Country and new group name should not appear by default
        // only join group should appear.
        expect(element(by.id('id-country')).isDisplayed()).toBe(false);
        expect(element(by.id('id-newgroup')).isDisplayed()).toBe(false);
        expect(element(by.id('id-joingroup')).isDisplayed()).toBe(true);

        // All changes when we select new group.
        element(by.id('id-radio-newgroup')).click();
        expect(element(by.id('id-country')).isDisplayed()).toBe(true);
        expect(element(by.id('id-newgroup')).isDisplayed()).toBe(true);
        expect(element(by.id('id-joingroup')).isDisplayed()).toBe(false);

        // It does not work without a name.
        element(by.css('button[form=id-page-form]')).click();
        element(by.css('.md-actions button.md-primary')).click();

        element(by.id('id-newgroup')).sendKeys('Test group');
        element(by.css('button[form=id-page-form]')).click();
    });
});
