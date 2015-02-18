angular.module('eat-this-one').directive('eatPhoto', ['eatConfig', 'newLogRequest', function(eatConfig, newLogRequest) {

    return {
        restrict: 'E',
        scope: {
            element: '='
        },
        link : function(scope) {

            // Import lang strings.
            scope.lang = $.eatLang.lang;

            scope.onPictureSuccess = function(imageData) {
                var smallimg = $('#id-smallimage');
                smallimg.css('display', 'block');
                smallimg.prop('src', "data:image/jpeg;base64," + imageData);
                $('#id-photobtn').css('display', 'none');
                $('#id-imagebtn').css('display', 'none');

                // And send data back to the controller scope.
                scope.element.value = imageData;
            };

            scope.onCapturePhotoFail = function(message) {
                newLogRequest('error', 'photo-take', message);
                console.log('Error capturing the image: ' + message);
            };

            scope.onSelectImageFail = function(message) {
                newLogRequest('error', 'select-image', message);
                console.log('Error selecting the image: ' + message);
            };

            scope.capturePhoto = function() {
                navigator.camera.getPicture(scope.onPictureSuccess, scope.onCapturePhotoFail, {
                    quality: 30,
                    destinationType: Camera.DestinationType.DATA_URL
                });
            };

            scope.selectImage = function() {
                navigator.camera.getPicture(scope.onPictureSuccess, scope.onSelectImageFail, {
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
            };
        },
        templateUrl: "templates/photo.html"
    };

}]);
