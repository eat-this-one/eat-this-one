angular.module('eat-this-one')
    .factory('pushManager', ['notifier', 'eatConfig', function(notifier, eatConfig) {

    return {

        register : function() {

            if (device.platform == 'android' ||
                    device.platform == 'Android' ||
                    device.platform == "amazon-fireos" ) {

                window.plugins.pushNotification.register(
                    this.registered,
                    this.errorHandler,
                    {
                        "senderID": eatConfig.gcmSenderId,
                        "ecb":"onNotification"
                    }
                );

            } else {

                window.plugins.pushNotification.register(
                    this.registeredAPN,
                    this.errorHandler,
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"onNotificationAPN"
                    }
                );
            }
        },

        registered : function(result) {
            console.log('REGISTERED METHOD: ' + result);
        },

        registeredAPN : function(result) {
            console.log('REGISTERED APN: ' + result);
        },

        error : function(error) {
            console.log('Error, not able to get the registration ID: ' + error);
        }
    }

}]);


// TODO Move this inside pushManager!!
function onNotification(e) {

    switch(e.event) {

        case 'registered':
            if (e.regid.length > 0) {
                console.log("Got a registration ID: " + e.regid);
            } else {
                console.log('Error getting the registration id');
            }
            break;

        case 'message':
            if (e.foreground) {
                console.log('Notifying message while in foreground');
                notifier.statusBar('Eat this one', e.payload.message);
            } else if ( e.coldstart ) {
                console.log('Notifying message, app was not started');
                notifier.statusBar('Eat this one', e.payload.message);
            } else {
                console.log('Notifying message while in background');
                notifier.statusBar('Eat this one', e.payload.message);
            }
            break;

        case 'error':
            console.log('OH ERROR RECEIVING MESSAGE: ' + e.msg);
            break;

        default:
            console.log('Error, unknown event received' + e);
            break;
    }
}

// TODO Once this is not a crappy prototype.
function onNotificationAPN(e) {
}
