angular.module('eat-this-one').factory('localisationManager', ['eatConfig', 'statics', function(eatConfig, statics) {

    return {

        setCountry : function() {
            var locale = navigator.language || navigator.userLanguage;
            console.log('Detected browser locale: ' + locale);
            var country = locale.substring(3, 5);
            if (statics.countries.hasOwnProperty(country)) {
                localStorage.setItem('country', country);
            } else {
                // The default one.
                localStorage.setItem('country', statics.defaultCountry);
            }
        },

        setLanguage : function() {
            // We want to access strings through $.eatLang.lang.
            var userLang = navigator.language || navigator.userLanguage;
            if (typeof $.eatLang[userLang] !== 'undefined') {
                $.eatLang.lang = $.eatLang[userLang.substring(0, 2)];
            } else {
                $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
            }
        }

    };
}]);
