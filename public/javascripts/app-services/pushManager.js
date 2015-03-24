angular.module('eat-this-one')
    .factory('pushManager', ['$window', 'eatConfig', function($window, eatConfig) {

    return {

        // Here we register which functions will handle the notifications.
        register : function(forceUpdate) {

            // Check if the device is already registered.
            if (forceUpdate === false &&
                    (localStorage.getItem('gcmRegId') !== null ||
                    localStorage.getItem('apnToken') !== null)) {
                return;
            }

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

                // TODO Test properly as it is just a copy & paste.
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
            localStorage.setItem('apnToken', token);
        },

        errorHandler : function(error) {
            newLogRequest('error', 'register-gcm', error);
            console.log('Error, not able to get the registration ID: ' + error);
        },

        errorAPNHandler : function(error) {
            newLogRequest('error', 'register-apn', error);
            console.log('Error, not able to get the APN token: ' + error);
        }

    };

}]);

// TODO: Ok, the redirection to the specific dish seems that is
// not working and it used to work, we should fix this.
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
                    var dishid = e.payload.dishid;
                    bodyscope.injector().get('redirecter')
                        .redirect('dishes/view.html?id=' + dishid);
                    newLogRequest('click', 'gcm-notification',
                        e.payload.type + '-' + dishid);
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

// TODO Check that this works.
function apnNotificationsHandler(e) {

    // All cordova calls should be inside a deviceready listener.
    document.addEventListener('deviceready', function() {

        // We wait for the body to be ready.
        var bodyscope = angular.element('#id-body');
        bodyscope.ready(function() {

            // We inject the service here as we are out of angular init process.
            var newLogRequest = bodyscope.injector().get('newLogRequest');

            var dishid = e.payload.dishid;
            bodyscope.injector().get('redirecter')
                .redirect('dishes/view.html?id=' + dishid);
            newLogRequest('click', 'apn-notification',
                e.payload.type + '-' + dishid);
        });
    });
}
