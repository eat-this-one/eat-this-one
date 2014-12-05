angular.module('eat-this-one')
    .controller('DishesShareController', ['$scope', '$window', 'appStatus', 'eatConfig', 'urlParser', 'notifier', function($scope, $window, appStatus, eatConfig, urlParser, notifier) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.sharedish;

    // To store the user contacts with a valid name and mobile phone.
    $scope.contacts = [];

    document.addEventListener('deviceready', function() {

        function onSuccess(contacts) {

            // Expensive method.
            for (var i = 0; i < contacts.length; i++) {
                if (contacts[i].displayName === "" && contacts[i].displayName == null) {
                    break;
                }
                if (typeof contacts[i].phoneNumbers != 'undefined' && contacts[i].phoneNumbers != null) {
                    for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                        if (contacts[i].phoneNumbers[j].type === 'mobile') {
                            // We pick the first one removing spaces from the phone number.
                            // TODO Avoid duplicates adding a contacts[mobilePhone] key.
                            $scope.contacts.push({
                                displayName: contacts[i].displayName,
                                mobilePhone: contacts[i].phoneNumbers[j].value.replace(/\s+/g, '')
                            });
                            break;
                        }
                    }
                }
            }

            // Update $scope.contacts.
            $scope.$apply();
        };

        function onError(contactError) {
            notifier.show($scope.lang.error, $scope.lang.errornocontacts, 'error');
            console.log('Error getting contacts: ' + contactError);
        };

        var filter = [
            navigator.contacts.fieldType.displayName,
            navigator.contacts.fieldType.name
        ];
        // TODO Try to filter by something (not null...) to avoid the big big iteration.
        var options = new ContactFindOptions();
        options.filter = "";
        options.multiple = true;
        options.desiredFields = [
            navigator.contacts.fieldType.displayName,
            navigator.contacts.fieldType.name,
            navigator.contacts.fieldType.phoneNumbers
        ];
        navigator.contacts.find(filter, onSuccess, onError, options);

    }, false);

    $scope.skip = function() {
        // TODO If there are no subscribers we should warn the
        // user that no users will see the dish he/she just added.
        $window.location.href = 'index.html';
    };

    $scope.sendSms = function() {

        // Get all selected contacts.
        var phonesArray = [];
        $('input[type=checkbox]').each(function() {
            if (this.checked) {
                phonesArray.push(this.value);
            }
        });

        // The user should explicitly press 'Skip'.
        if (phonesArray.length === 0) {
            notifier.show($scope.lang.nocontacts, $scope.lang.nocontactsinfo, 'warning');
            return false;
        }

        // Get dish.name, dish.description, user.name
        // and location.name as GET arguments.
        var msg = '"' + urlParser.getParam('username') + '" ' + $scope.lang.sharedwithyouin +
             ' "' + urlParser.getParam('locationname') + '": ' + urlParser.getParam('dishname') + '.' +
            "\n" + $scope.lang.downloadapp + "\n" + $scope.lang.android + ": " + eatConfig.downloadAppUrl;

        // Open sms app.
        window.plugins.socialsharing.shareViaSMS(msg, phonesArray.join(','));
    }
}]);
