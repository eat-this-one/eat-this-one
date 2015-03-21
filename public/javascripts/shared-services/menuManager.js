angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', 'newLogRequest', 'redirecter', function($mdSidenav, newLogRequest, redirecter) {
    return {

        lang : $.eatLang.lang,

        toggle : function() {
            $mdSidenav('menu').toggle();
        },

        dishAddItem : function() {
            return {
                name : this.lang.adddish,
                icon : 'glyphicon glyphicon-cutlery',
                callback : 'dishAddCallback'
            };
        },

        dishAddCallback : function() {
            newLogRequest('click', 'dishes-add');
            redirecter.redirect('dishes/edit.html');
        },

        locationViewItem : function() {

            return {
                name : this.lang.ranking,
                icon : 'glyphicon glyphicon-king',
                callback : 'locationViewCallback'
            };
        },

        locationViewCallback : function() {
            var url = null;

            var loc = localStorage.getItem('loc');
            if (loc === null) {
                url = 'location-subscriptions/edit.html';
            } else {
                loc = JSON.parse(loc);
                url = 'locations/view.html?id=' + loc._id;
            }

            newLogRequest('click', 'location-view');
            redirecter.redirect(url);
        },

        dishesListItem : function() {
            return {
                name : this.lang.dishes,
                icon : 'glyphicon glyphicon-piggy-bank',
                callback : 'dishesListCallback'
            };
        },

        dishesListCallback : function() {
            newLogRequest('click', 'index');
            redirecter.redirect('index.html');
        },

        feedbackItem : function() {
            return {
                name : this.lang.feedback,
                icon : 'glyphicon glyphicon-send',
                callback : 'feedbackCallback'
            };
        },

        feedbackCallback : function() {
            newLogRequest('click', 'feedback-add');
            redirecter.redirect('feedback/add.html');
        }
    };
}]);
