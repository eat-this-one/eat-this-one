'use strict';

describe('Authentication', function() {

    var authManager;
    var sessionManager;

    var user = {
        id : 'idvalue',
        name : 'Test User 1',
        email : 'test@user1.com',
        locale : 'en-GB',
        pictureurl : '',
        token : 'tokenuser'
    };

    beforeEach(module('eat-this-one'));

    beforeEach(inject(function(_authManager_, _sessionManager_){
        authManager = _authManager_;
        sessionManager = _sessionManager_;
    }));

    // Clean session and auth managers.
    afterEach(function() {
        sessionManager.cleanSession();
    });

    it('should know whether a user is autenticated or not', function() {
        expect(authManager.isAuthenticated()).toBe(false);
    });

    it('should know which one is the authenticated user', function() {
        expect(authManager.isUser('stillnotauthenticated')).toBe(false);

        authManager.authenticate(user.id);
        expect(authManager.isAuthenticated()).toBe(true);
        expect(authManager.isUser('idvalue')).toBe(true);
        expect(authManager.isUser('wrong')).toBe(false);
    });

    it('should keep the authenticated user data', function() {
        expect(sessionManager.getToken()).toBe(null);
        expect(sessionManager.getUser()).toBe(null);

        sessionManager.setUser(user);
        authManager.authenticate(user.id);
        expect(sessionManager.getToken()).toBe('tokenuser');
        expect(sessionManager.getUser().id).toBe('idvalue');
        expect(sessionManager.getUser().email).toBe('test@user1.com');
        expect(authManager.isAuthenticated()).toBe(true);
        expect(authManager.isUser(user.id)).toBe(true);
    });
});
