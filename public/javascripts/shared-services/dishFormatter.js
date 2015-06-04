angular.module('eat-this-one').factory('dishFormatter', ['notifier', 'datesConverter', 'statics', function(notifier, datesConverter, statics) {

    return function($scope, dishData) {

        $scope.dish = dishData;

        // We need both the i18n day string and the today/tomorrow/aftertomorrow selected option.
        var i18nwhen = datesConverter.timeToDayString(Date.parse($scope.dish.when));
        $scope.dish.when = datesConverter.timeToDay(Date.parse($scope.dish.when));

        // Fill form values if they exist.
        var fields = ['name', 'description', 'when', 'nportions', 'donation'];
        for (var fieldName in fields) {
            if ($scope[fields[fieldName]]) {
                $scope[fields[fieldName]].value = $scope.dish[fields[fieldName]];
            }
        }

        // Now, after setting values to the fields, we can set a nice format to dish.when.
        $scope.dish.when = i18nwhen;

        // Chef name requires special treatment.
        if ($scope.dish.user.name === 'deleted') {
            $scope.dish.user.name = $scope.lang.deleteduser;
        }

        // The photo is not required so it may not be there.
        if ($scope.dish.photo) {
            var dishImgCard = $('#id-dish-img-card');
            var dishImg = $('#id-dish-img');
            if (dishImg) {
                dishImgCard.removeClass('hidden');
                dishImgCard.css('display', 'block');
                // Image already returns prefixed with ...jpeg:base64;.
                dishImg.prop('src', $scope.dish.photo);
            }
        }

        // Number of remaining portions to book.
        if ($scope.dish.nportions === 0) {
            // No text as they are unlimited, rendundant info.
            $scope.dish.remainingportions = -1;
        } else {
            $scope.dish.remainingportions = $scope.dish.nportions - dishData.nbookedmeals;
            if ($scope.dish.remainingportions === 1) {
                // Show last portion text.
                $scope.dishusefulinfotext = $scope.lang.lastportion;

            } else if ($scope.dish.remainingportions === 0) {
                // Show all booked text.
                $scope.dishusefulinfotext = $scope.lang.allportionsbooked;
            } else {
                // No text if more than one portion.
            }
        }

        // Format the donation (currency or i18n string).
        if (!isNaN($scope.dish.donation)) {
            $scope.dish.donation = statics.displayCurrency($scope.dish.donation);
        } else {
            $scope.dish.donation = $.eatLang.lang[$scope.dish.donation];
        }

        // If the user already booked the dish this is more useful than any other info.
        if ($scope.dish.booked) {
            $scope.dishusefulinfotext = $scope.lang.alreadybookedtext;
        }

        // Set the page title.
        $scope.pageTitle = $scope.dish.name;
        // Using this instead of filters as we want.
        if ($scope.pageTitle.length > 20) {
            $scope.pageTitle = $scope.pageTitle.substr(0, 20) + '...';
        }
    };

}]);
