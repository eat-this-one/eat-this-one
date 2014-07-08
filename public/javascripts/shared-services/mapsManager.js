angular.module('eat-this-one').factory('mapsManager', ['eatConfig', function(eatConfig) {

    return {

        getStaticMap : function(address) {
            return eatConfig.mapsBaseUrl +
                '?maptype=road' +
                '&size=300x300' +
                '&markers=%7C%7C' +
                address
        }
    }
}]);
