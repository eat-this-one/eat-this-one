angular.module('eat-this-one').directive('eatPhoto', ['eatConfig', function(eatConfig) {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link : function(scope) {

            // Import lang strings.
            scope.lang = $.eatLang.lang;

            scope.onPhotoDataSuccess = function(imageData) {
                var smallimg = $('#id-smallimage');
                smallimg.css('display', 'block');
                smallimg.prop('src', "data:image/jpeg;base64," + imageData);
                $('#id-photobtn').css('display', 'none');

                // And send data back to the controller scope.
                scope.element.value = imageData;
            };

            scope.onPhotoFail = function(message) {
                console.log('Error capturing the image: ' + message);
            };

            scope.capturePhoto = function() {
                navigator.camera.getPicture(scope.onPhotoDataSuccess, scope.onPhotoFail, {
                    quality: 30,
                    destinationType: navigator.camera.DestinationType.DATA_URL
                });
            };

        },
        templateUrl: "templates/photo.html"
    };

}]);
