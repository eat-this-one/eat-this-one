angular.module('eat-this-one').factory('appStatus', function() {
    return {

        waiting : function() {
            // TODO Something that blocks the app until it is ready.
        },
        completed : function() {
            // TODO Unblocks the app.
        }
    }
});
