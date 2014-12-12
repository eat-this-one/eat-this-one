angular.module('eat-this-one')
    .controller('DishesShareController', ['$scope', '$window', 'appStatus', 'eatConfig', 'urlParser', 'notifier', 'newLogRequest', function($scope, $window, appStatus, eatConfig, urlParser, notifier, newLogRequest) {

    $scope.lang = $.eatLang.lang;

    // Page title.
    $scope.pageTitle = $scope.lang.addcolleagues;

    // To store the user contacts with a valid name and mobile phone.
    $scope.contacts = [];

    // Set the loading here as getting contacts may be slow.
    appStatus.waiting('contacts');

    newLogRequest('view', 'dishes-share');

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

            // Set a class once a contact is selected.
            $('#id-contacts .contact').each(function() {
                $(this).on('click', function(e) {
                    // Toggles active class.
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                    } else {
                        $(this).addClass('active');
                    }
                });
            });

            // All done.
            appStatus.completed('contacts');
        };

        function onError(contactError) {
            notifier.show($scope.lang.error, $scope.lang.errornocontacts, 'error');
            console.log('Error getting contacts: ' + contactError);

            appStatus.completed('contacts');
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

    $scope.continue = function() {

        newLogRequest('click', 'dishes-share-continue');

        // TODO If there are no subscribers we should warn the
        // user that no users will see the dish he/she just added.
        $window.location.href = 'index.html';
    };

    $scope.sendSms = function() {

        appStatus.waiting('selectedContacts');

        // Get all selected contacts.
        var phonesArray = [];
        $('#id-contacts .contact.active').each(function() {
            console.log('contact! ' + this.id);
            phonesArray.push(this.id);
        });

        // The user should explicitly press 'Skip'.
        if (phonesArray.length === 0) {
            notifier.show($scope.lang.nocontacts, $scope.lang.nocontactsinfo, 'warning');
            appStatus.completed('selectedContacts');
            return false;
        }

        // The receiver already knows who is sending the message.
        var msg = $scope.lang.iwanttoshare + ': "' + urlParser.getParam('dishname') + '" ' +
             $scope.lang.in + ' "' + urlParser.getParam('locationname') + '". \n' +
             $scope.lang.downloadapp + ".\n" + $scope.lang.android + ": " + eatConfig.downloadAppUrl;

        appStatus.completed('selectedContacts');

        var phonesStr = phonesArray.join(',');

        newLogRequest('click', 'share-contacts', phonesStr);

        // Open sms app.
        window.plugins.socialsharing.shareViaSMS(msg, phonesStr);
    }
}]);
