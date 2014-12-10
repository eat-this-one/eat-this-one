angular.module('eat-this-one').controller('IndexController', ['$scope', '$window', 'eatConfig', 'authManager', 'appStatus', 'notifier', 'dishesRequest', 'OAuthUserRequest', 'newLogRequest', function($scope, $window, eatConfig, authManager, appStatus, notifier, dishesRequest, OAuthUserRequest, newLogRequest) {

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

    newLogRequest('view', 'index');

    // Its only purpose is to store the log.
    $scope.dishClicked = function(dishid) {
        newLogRequest('click', 'dishes-view', dishid);
    };

    // Redirects to add dish page.
    $scope.addDish = function() {
        newLogRequest('click', 'dishes-add');
        $window.location.href = 'dishes/edit.html';
    };

    // Redirects to the user meals list.
    $scope.indexMeals = function() {
        newLogRequest('click', 'meals-index');
        $window.location.href = 'meals/index.html';
    };

    // Redirects the user to google oauth page.
    $scope.authorizeGoogle = function() {

        newLogRequest('click', 'login-google');

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
                    OAuthUserRequest.google($scope, code[1]);
                    newLogRequest('click', 'login-google-submit');

                } else if (error) {
                    notifier.show($scope.lang.error, $scope.lang.errorsigningoogle, 'error')
                    appStatus.completed('signin');
                    console.log('Sign in with Google error: ' + error[1]);
                }
            });

        });
    };

}]);
