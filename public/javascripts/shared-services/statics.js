angular.module('eat-this-one').factory('statics', ['$filter', function($filter) {

    return {

        countries : {
            AU : {
                name : 'Australia',
                currency : '$',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            ES : {
                name: 'España',
                currency : '&#8364;',
                defaultLanguage : 'es',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            GB : {
                name: 'United Kingdom',
                currency : '&#8356;',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            IE : {
                name: 'Ireland',
                currency : '&#8364;',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            },
            US : {
                name: 'United States',
                currency : '$',
                defaultLanguage : 'en',
                donationOptions : [
                    { text: 1, value: '1'},
                    { text: 3, value: '3'},
                    { text: 5, value: '5'}
                ]
            }
        },

        defaultCountry : 'AU',

        displayCurrency : function(value) {
            var loc = JSON.parse(localStorage.getItem('loc'));
            return $filter('currency')(value, this.countries[loc.country].currency, 0);
        },

        getDonationOptions : function() {
            var loc = JSON.parse(localStorage.getItem('loc'));
            if (loc === null) {
                return [];
            }

            var options = this.countries[loc.country].donationOptions;
            for (var i in options) {
                options[i].text = $filter('currency')(options[i].text, this.countries[loc.country].currency, 0);
            }
            return options;
        },

        getCountriesOptions : function() {
            var options = [];
            for (var code in this.countries) {
                if (this.countries.hasOwnProperty(code)) {
                    options.push({
                        value: code,
                        text: this.countries[code].name
                    });
                }
            }
            return options;
        },

        getLocationLanguage : function() {
            var country = JSON.parse(localStorage.getItem('loc')).country;
            return this.countries[country].defaultLanguage;
        }

    };
}]);
