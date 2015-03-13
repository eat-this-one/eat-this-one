angular.module('eat-this-one')
    .controller('FeedbackAddController', ['$scope', 'redirecter', 'appStatus', 'notifier', 'eatConfig', 'authManager', 'formsManager', 'newLogRequest', 'menuManager', 'addFeedbackRequest', function($scope, redirecter, appStatus, notifier, eatConfig, authManager, formsManager, newLogRequest, menuManager, addFeedbackRequest) {

    $scope.lang = $.eatLang.lang;
    $scope.auth = authManager;
    $scope.redirectAction = redirecter.redirectAction;
    $scope.redirectMenuItem = redirecter.redirectMenuItem;
    $scope.menu = menuManager;

    // Define header.
    $scope.pageTitle = $scope.lang.feedback;
    $scope.actionIcons = [
        {
            name : $scope.lang.save,
            icon : 'glyphicon glyphicon-ok',
            callback : 'save'
        }
    ];
    $scope.menuItems = [
        menuManager.dishesListItem(),
        menuManager.bookedMealsItem()
    ];

    $scope.showToggleMenu = false;
    if ($scope.auth.isAuthenticated()) {
        $scope.showToggleMenu = true;
    }

    $scope.feedback = {
        name: 'feedback',
        label: $scope.lang.feedback,
        validation: ['required', 'text'],
        value: ''
    };

    $scope.save = function() {

        // Validate the form text forms, the other ones have a default value.
        if (!formsManager.validate(['feedback'], $scope)) {
            return;
        }

        appStatus.waiting('feedback');
        newLogRequest('click', 'feedback-add-confirm');

        var feedbackCallback = function(data) {
            appStatus.completed('feedback');
            notifier.show($scope.lang.thanks, $scope.lang.feedbackaddedinfo, function() {
                redirecter.redirect('index.html');
            });
        };
        var feedbackErrorCallback = function(data, errorStatus, errorMsg) {
            appStatus.completed('feedback');
            newLogRequest('error', 'feedback-add', errorMsg);
            notifier.show($scope.lang.error, $scope.lang.weird);
        };
        addFeedbackRequest($scope, $scope.feedback.value, feedbackCallback, feedbackErrorCallback);
    };

}]);
