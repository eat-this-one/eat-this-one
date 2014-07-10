angular.module('eat-this-one').run(['sessionManager', 'eatConfig', function(sessionManager, eatConfig) {

    // Init the session.
    sessionManager.initSession();

    // Set user language.
    // We want to access strings through $.eatLang.lang.
    var userLang = navigator.language || navigator.userLanguage;
    if (typeof $.eatLang[userLang] !== 'undefined') {
        $.eatLang.lang = $.eatLang[userLang.substring(0, 2)];
    } else {
        $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
    }
}]);
