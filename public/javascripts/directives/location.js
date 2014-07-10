angular.module('eat-this-one').directive('eatLocation', ['$http', 'eatConfig', function($http, eatConfig) {

    return {

        restrict: 'E',
        scope: {
            loc: '=',
            address: '='
        },
        link : function(scope) {

            // Initially hidden, we show the address box once the user
            // starts to type in the location box.
            scope.showAddress = false;

            // If the user selects an existing location we disable the
            // address input as we don't want the to user spend time on it.
            scope.disableAddress = false;

            // TODO We should use a cache for the system
            // locations; this is too expensive.
            scope.getLocations = function(value) {

                // We need all the location data.
                var locations = [];

                // We show the address box until an
                // existing location is selected.
                scope.showAddress = true;

                // Sending the request without requiring the
                // name to match exactly the provided value.
                return $http.get(eatConfig.backendUrl + '/locations', {
                    params: {
                        name: value,
                        regex: 1
                    }
                }).then(function(res) {
                    angular.forEach(res.data, function(item) {
                        locations.push(item.name);
                    });
                    return locations;
                });
            };

            scope.getAddresses = function(value) {
                return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        address: value,
                        sensor: false
                    }
                }).then(function(res){
                    var addresses = [];
                    angular.forEach(res.data.results, function(item){
                        addresses.push(item.formatted_address);
                    });
                    return addresses;
                });
            };

            // Runs when an existing location is selected.
            // Fills the address with the location address.
            scope.fillAddress = function($item, $model, $label) {
                // TODO: Here we should assign location.address.
                // We can try setting a key in locations[].
                scope.address.value = $item;
                scope.disableAddress = true;
            };
        },
        templateUrl: 'templates/location.html'
    };

}]);
