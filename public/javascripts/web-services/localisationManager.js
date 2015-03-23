angular.module('eat-this-one').factory('localisationManager', ['eatConfig', function(eatConfig) {

    return {

        supportedCountries : {
            AU : 'Australia',
            ES : 'España',
            GB : 'United Kingdom',
            IE : 'Ireland',
            US : 'United States'
        },

        defaultCountry : 'AU',

        getCountriesOptions : function() {
            var options = [];
            for (var code in this.supportedCountries) {
                if (this.supportedCountries.hasOwnProperty(code)) {
                    options.push({
                        value: code,
                        text: this.supportedCountries[code]
                    });
                }
            }
            return options;
        },

        setLanguage : function() {
            // We want to access strings through $.eatLang.lang.
            var userLang = navigator.language || navigator.userLanguage;
            if (typeof $.eatLang[userLang] !== 'undefined') {
                $.eatLang.lang = $.eatLang[userLang.substring(0, 2)];
            } else {
                $.eatLang.lang = $.eatLang[eatConfig.defaultLang];
            }
        },

        setCountry : function() {
            var locale = navigator.language || navigator.userLanguage;
            console.log('Detected browser locale: ' + locale);
            var country = locale.substring(3, 5);
            if (this.supportedCountries.hasOwnProperty(country)) {
                localStorage.setItem('country', country);
            } else {
                // The default one.
                localStorage.setItem('country', this.defaultCountry);
            }
        }
    };
}]);
