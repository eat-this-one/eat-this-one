angular.module('eat-this-one').controller('IndexController', ['$scope', '$window', 'eatConfig', 'authManager', 'appStatus', 'notifier', 'dishesRequest', 'newOAuthUserRequest', function($scope, $window, eatConfig, authManager, appStatus, notifier, dishesRequest, newOAuthUserRequest) {

    // Dependencies.
    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;

    // Page title.
    $scope.pageTitle = $scope.lang.sitename;

    $scope.dishes = [];
    $scope.showNoDishes = false;

    if ($scope.auth.isAuthenticated()) {
        appStatus.waiting();
        dishesRequest($scope);
    }

    // Redirects to add dish page.
    $scope.addDish = function() {
        $window.location.href = 'dishes/edit.html';
    };

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        $window.location.href = 'meals/index.html';
    };

    // Redirects the user to google oauth page.
    $scope.authorizeGoogle = function() {

        document.addEventListener('deviceready', function() {

            appStatus.waiting('signin');

            var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                client_id: eatConfig.gOAuthClientId,
                redirect_uri: 'http://localhost',
                response_type: 'code',
                scope: 'profile email'
            });
            var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

            $(authWindow).on('loadstart', function(e) {
                var url = e.originalEvent.url;
                var code = /\?code=(.+)$/.exec(url);
                var error = /\?error=(.+)$/.exec(url);

                if (code || error) {
                    authWindow.close();
                }

                if (code) {
                    newOAuthUserRequest.google($scope, code[1]);
                } else if (error) {
                    notifier.show($scope.lang.error, $scope.lang.errorsigningoogle, 'error')
                    appStatus.completed('signin');
                    console.log('Sign in with Google error: ' + error[1]);
                }
            });

        });
    };

}]);
