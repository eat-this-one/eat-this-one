angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'urlParser', 'newLogRequest', function(eatConfig, appStatus, notifier, urlParser, newLogRequest) {

    return {

        init : function($scope) {

            document.addEventListener('deviceready', function() {

                // Set the loading here as getting contacts may be slow.
                appStatus.waiting('contacts');

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
                                $(this).children('span.glyphicon').removeClass('glyphicon-ok')
                            } else {
                                $(this).addClass('active');
                                $(this).children('span.glyphicon').addClass('glyphicon-ok')
                            }
                        });
                    });

                    // All done.
                    appStatus.completed('contacts');
                };

                function onError(contactError) {
                    appStatus.completed('contacts');
                    notifier.show($scope.lang.error, $scope.lang.errornocontacts, function() {
                        newLogRequest('error', 'contacts-get', contactError);
                    });
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

        },

        process : function($scope) {

            appStatus.waiting('selectedContacts');

            // Get all selected contacts.
            var phonesArray = [];
            $('#id-contacts .contact.active').each(function() {
                phonesArray.push(this.id);
            });

            // The user should explicitly press 'Skip'.
            if (phonesArray.length === 0) {
                appStatus.completed('selectedContacts');
                notifier.show($scope.lang.nocontacts, $scope.lang.nocontactsinfo, function() {
                    return false;
                });
            }

            // The receiver already knows who is sending the message.
            var msg = $scope.lang.imcooking + ' ' + urlParser.getParam('dishname') + '. ' +
                 $scope.lang.joindetailsbook + '. ' + $scope.lang.groupcode +
                 ': "' + urlParser.getParam('locationname') + '". ' + eatConfig.downloadAppUrl;

            appStatus.completed('selectedContacts');

            var phonesStr = phonesArray.join(',');

            newLogRequest('click', 'share-contacts', phonesStr);

            // Open sms app.
            window.plugins.socialsharing.shareViaSMS(msg, phonesStr);
        }
    };
}]);
