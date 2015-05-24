describe('Eat this one', function() {

    beforeEach(function() {
        browser.get('http://localhost:8000');
        browser.waitForAngular();
    });

    it('should add new users', function() {

        // Click the first icon to start the app.
        element(by.css('.splash-icon')).click();

        // There is an animation here.
        browser.sleep(1000);

        var dialogContent = element(by.css('md-dialog md-dialog-content p'));

        // No fields filled.
        element(by.css('#id-signup')).click();
        expect(dialogContent.getText()).toEqual('Some fields need your attention.');
        element(by.css('.md-actions button.md-primary')).click();

        // Incorrect data.
        element(by.css('#id-name')).sendKeys('%^');
        element(by.css('#id-signup')).click();
        expect(dialogContent.getText()).toEqual('Some fields need your attention.');
        element(by.css('.md-actions button.md-primary')).click();

        // Missing email.
        element(by.css('#id-name')).clear();
        element(by.css('#id-name')).sendKeys('User 1');
        element(by.css('#id-signup')).click();
        expect(dialogContent.getText()).toEqual('Some fields need your attention.');
        element(by.css('.md-actions button.md-primary')).click();

        // All good.
        element(by.css('#id-email')).sendKeys('user1@example.com');
        element(by.css('#id-signup')).click();

        // Redirect animation again.
        browser.sleep(1000);
    });
});
