angular.module('eat-this-one').factory('appStatus', function() {

    var alreadyFinished = false;

    return {

        waiting : function() {

            document.addEventListener('deviceready', function() {
                if (!alreadyFinished) {
                    ActivityIndicator.show($.eatLang.lang.loading);

                    // Sometimes it gets stucked even if the data is
                    // already loaded. There is no problem in running
                    // hide when it is already hidden.
                    setTimeout(function() {
                        ActivityIndicator.hide();
                    }, 3000);
                }
            }, true);
        },
        completed : function() {

            // Marking that the action already finished because
            // sometimes is even faster than deviceready.
            alreadyFinished = true;

            document.addEventListener('deviceready', function() {
                ActivityIndicator.hide();
            });
        }
    }
});
