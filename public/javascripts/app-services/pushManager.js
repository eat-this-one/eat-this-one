angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'eatConfig', function($window, eatConfig) {

    return {

        // Here we register which functions will handle the notifications.
        register : function() {

            if (device.platform == 'android' ||
                    device.platform == 'Android' ||
                    device.platform == "amazon-fireos" ) {

                $window.plugins.pushNotification.register(
                    this.registered,
                    this.errorHandler,
                    {
                        "senderID": eatConfig.gcmSenderId,
                        "ecb": "notificationsHandler"
                    }
                );

            } else {

                $window.plugins.pushNotification.register(
                    this.registeredAPN,
                    this.errorAPNHandler,
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"apnNotificationsHandler"
                    }
                );
            }
        },

        registered : function(result) {
            console.log('Registered in Google Cloud Messaging: ' + result);
        },

        registeredAPN : function(token) {
            console.log('Registered in APN: ' + token);
            // We updated it as we may have a random one.
            localStorage.setItem('apnToken', token);
        },

        errorHandler : function(error) {
            console.log('Error, not able to get the registration ID: ' + error);
            // Generating a random one, it would be later replaced on update.
            var randomNumber = Math.random() + new Date().getTime();
            localStorage.setItem('gcmRegId', randomNumber);
        },

        errorAPNHandler : function(error) {
            console.log('Error, not able to get the APN token: ' + error);
            // Generating a random one, it would be later replaced on update.
            var randomNumber = Math.random() + new Date().getTime();
            localStorage.setItem('apnToken', randomNumber);
        }

    };

}]);

function notificationsHandler(e) {
    // All cordova calls should be inside a deviceready listener.
    document.addEventListener('deviceready', function() {

        // We wait for the body to be ready.
        var bodyscope = angular.element('#id-body');
        bodyscope.ready(function() {

            // We inject the service here as we are out of angular init process.
            var newLogRequest = bodyscope.injector().get('newLogRequest');

            switch(e.event) {

                // Storing the registration id.
                case 'registered':

                    // Storing the registration id.
                    if (e.regid.length > 0) {

                        var previousGcmRegId = localStorage.getItem('gcmRegId');

                        if (previousGcmRegId === null ||
                                previousGcmRegId === false ||
                                previousGcmRegId === '') {
                            // Store it if there was nothing before.
                            localStorage.setItem('gcmRegId', e.regid);
                            newLogRequest('create', 'gcm-registration', e.regid);
                        } else if (previousGcmRegId != e.regid) {
                            // We also check that the current one is different.
                            localStorage.setItem('gcmRegId', e.regid);
                            newLogRequest('update', 'gcm-registration', e.regid);

                            // We also update the backend.
                            var updateRegIdRequest = bodyscope.injector().get('updateRegIdRequest');
                            updateRegIdRequest(e.regid);
                        } else {
                            // Let's not log this.
                        }
                    } else {
                        newLogRequest('error', 'gcm-registration', 'no registration id');
                    }
                    break;

                case 'message':

                    var objectid = e.payload.objectid;
                    var url = e.payload.url;
                    if (objectid !== null) {
                        newLogRequest('click', 'apn-notification',
                            e.payload.type + '-' + objectid);
                    } else {
                        newLogRequest('click', 'apn-notification',
                            e.payload.type);
                    }
                    bodyscope.injector().get('redirecter').redirect(url);
                    break;
                case 'error':
                    newLogRequest('error', 'gcm-error', e.msg);
                    console.log('Error: Message can not be received. ' + e.msg);
                    break;
                default:
                    newLogRequest('error', 'gcm-unknown');
                    console.log('Error: Unknown event received');
                    break;
            }
        });
    });
}

// TODO Check that this works, not sure about the payload....
function apnNotificationsHandler(e) {

    // All cordova calls should be inside a deviceready listener.
    document.addEventListener('deviceready', function() {

        // We wait for the body to be ready.
        var bodyscope = angular.element('#id-body');
        bodyscope.ready(function() {

            // We inject the service here as we are out of angular init process.
            var newLogRequest = bodyscope.injector().get('newLogRequest');

            var objectid = e.payload.objectid;
            var url = e.payload.url;
            if (objectid !== null) {
                bodyscope.injector().get('redirecter')
                    .redirect(url);
                newLogRequest('click', 'apn-notification',
                    e.payload.type + '-' + objectid);
            } else {
                bodyscope.injector().get('redirecter')
                    .redirect(url);
                newLogRequest('click', 'apn-notification',
                    e.payload.type);
            }
        });
    });
}
