angular.module('eat-this-one')
    .factory('pushManager', ['eatConfig', function(eatConfig) {

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


function onNotification(e) {

    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            console.log('FOREGROUDN NOTIFICATION RECEIVED');
            // on Android soundname is outside the payload. 
            // On Amazon FireOS all custom attributes are contained within payload
            //var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
            //var my_media = new Media("/android_asset/www/"+ soundfile);
            //my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                console.log('COLDSTART NOTIFICATION: ' + e.payload.message);
            }
            else
            {
                console.log('BACKGROUDN NOTIFICATION: ' + e.payload.message);
            }
        }

           //Only works for GCM
       //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
       ////Only works on Amazon Fire OS
       //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
    break;

    case 'error':
        console.log('OH ERROR RECEIVING MESSAGE: ' + e.msg);
    break;

    default:
        console.log('Error, unknown event received')
    break;
  }
}
