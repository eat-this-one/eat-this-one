angular.module('eat-this-one')
    .factory('sessionManager', ['authManager', 'eatConfig', function(authManager, eatConfig) {

    return {

        initSession : function() {
            var token = localStorage.getItem('token');
            if (token !== null) {
                authManager.authenticate();
            }

            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];

            document.addEventListener('deviceready', function() {

                navigator.globalization.getPreferredLanguage(
                    function(language) {
                        console.log(language);
                        var shortLang = language.value.substring(0, 2);
                        if (typeof $.eatLang[shortLang] !== 'undefined') {
                            $.eatLang.lang = $.eatLang[shortLang];
                        } else {
                            // We default to 'en' if any problem.
                            $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
                        }
                    },
                    function() {
                        // We default to 'en' if any problem.
                        $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
                        console.log('Error getting preferred language');
                    }
                );

            });
        },

        setToken : function(authToken) {
            localStorage.setItem('token', authToken);
        },

        getToken : function() {
            return localStorage.getItem('token');
        }
    }
}]);
