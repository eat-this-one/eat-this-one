angular.module('eat-this-one').factory('imgManager', ['photoRequest', function(photoRequest) {

    return {

        fillDishSrc : function(dish) {

            if (typeof dish.photoid === "undefined") {
                dish.imgSrc = 'images/default.svg';
            } else {
                photoRequest(dish);
            }
        }
    };
}]);
