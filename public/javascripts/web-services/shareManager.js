angular.module('eat-this-one').factory('shareManager', ['eatConfig', 'appStatus', 'notifier', 'urlParser', 'newLogRequest', function(eatConfig, appStatus, notifier, urlParser, newLogRequest) {

    return {

        init : function($scope) {
        },

        process : function($scope) {

            // The receiver already knows who is sending the message.
            var msg = $scope.lang.imcooking + ' ' + urlParser.getParam('dishname') + '. ' +
                 $scope.lang.joindetailsbook + '. ' + $scope.lang.groupcode +
                 ': "' + urlParser.getParam('locationname') + '". ' + eatConfig.downloadAppUrl;


            window.location.href = 'mailto:?to=&body=' + msg + '&subject=' + $scope.lang.inviteemailsubject;
        }
    };
}]);
