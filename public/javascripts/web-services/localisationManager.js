angular.module('eat-this-one').factory('localisationManager', ['eatConfig', 'statics', function(eatConfig, statics) {

    return {

        setCountry : function() {

            var locale = navigator.language || navigator.userLanguage;
            var country = locale.substring(3, 5);

            if (statics.countries.hasOwnProperty(country)) {
                localStorage.setItem('country', country);
            } else {
                // The default one.
                localStorage.setItem('country', statics.defaultCountry);
            }
        },

        setLanguage : function() {

            if (localStorage.getItem('language') === null) {
                localStorage.setItem('language', eatConfig.defaultLang);
            }
            $.eatLang.lang = $.eatLang[localStorage.getItem('language')];

            // We want to access strings through $.eatLang.lang.
            var userLang = navigator.language || navigator.userLanguage;
            var lang = userLang.substring(0, 2);
            if (typeof $.eatLang[lang] === 'undefined') {
                lang = localStorage.getItem('language');
            }
            $.eatLang.lang = $.eatLang[lang];
            localStorage.setItem('language', lang);
        }

    };
}]);
