angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'newLogRequest', function(eatConfig, appStatus, notifier, newLogRequest) {

    return {

        init : function($scope) {

            document.addEventListener('deviceready', function() {

                function onSuccess(contacts) {

                    // To prevent duplicates.
                    var contactPhones = [];
                    var phoneNumber = null;
                    for (var i = 0; i < contacts.length; i++) {
                        if (contacts[i].displayName === null || contacts[i].phoneNumbers === null) {
                            continue;
                        }
                        for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                            phoneNumber = contacts[i].phoneNumbers[j].normalizedNumber.replace(/-/g, '');
                            if (contactPhones.indexOf(phoneNumber) === -1) {
                                $scope.contacts.push({
                                    displayName: contacts[i].displayName + ' - ' + phoneNumber,
                                    mobilePhones: phoneNumber
                                });
                                contactPhones.push(phoneNumber);
                            }
                        }
                    }

                    // Update $scope.contacts.
                    $scope.$digest();

                    // Set a class once a contact is selected.
                    $('#id-contacts .contact').each(function() {
                        $(this).on('click', function(e) {
                            // Toggles active class.
                            if ($(this).hasClass('active')) {
                                $(this).removeClass('active');
                                $(this).children('span.glyphicon').removeClass('glyphicon-ok');
                            } else {
                                $(this).addClass('active');
                                $(this).children('span.glyphicon').addClass('glyphicon-ok');
                            }
                        });
                    });

                    // All done.
                    appStatus.completed('contacts');
                }

                function onError(contactError) {
                    appStatus.completed('contacts');
                    notifier.show($scope.lang.error, $scope.lang.errornocontacts, function() {
                        newLogRequest('error', 'contacts-get', contactError);
                    });
                }

                // Get the contacts with phone number.
                navigator.contactsPhoneNumbers.list(onSuccess, onError);

            }, false);

        },

        process : function($scope, msg) {

            appStatus.waiting('selectedContacts');

            // Get all selected contacts.
            var phonesArray = [];
            $('#id-contacts .contact.active').each(function() {
                phonesArray.push(this.id);
            });

            // The user should explicitly press 'Skip'.
            if (phonesArray.length === 0) {
                appStatus.completed('selectedContacts');
                notifier.show($scope.lang.nocontacts, $scope.lang.nocontactsinfo);
                return false;
            }

            appStatus.completed('selectedContacts');

            var phonesStr = phonesArray.join(',');

            newLogRequest('click', 'share-contacts', phonesStr);

            // Open sms app.
            window.plugins.socialsharing.shareViaSMS(msg, phonesStr);
        }
    };
}]);
