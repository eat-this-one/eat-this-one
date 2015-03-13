angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', 'newLogRequest', 'redirecter', function($mdSidenav, newLogRequest, redirecter) {
    return {

        lang : $.eatLang.lang,

        toggle : function() {
            $mdSidenav('menu').toggle();
        },

        locationViewItem : function() {

            var item = {
                icon : 'glyphicon glyphicon-home',
                callback : 'locationViewCallback'
            };

            // If the user does not have a location
            // provide a link to set it up.
            var loc = localStorage.getItem('loc');
            if (loc === null) {
                item.name = this.lang.setmygroup;
            } else {
                loc = JSON.parse(loc);
                item.name = loc.name;
            }

            return item;
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

        bookedMealsItem : function() {
            return {
                name : this.lang.bookedmeals,
                icon : 'glyphicon glyphicon-cutlery',
                callback : 'bookedMealsCallback'
            };
        },

        bookedMealsCallback : function() {
            newLogRequest('click', 'meals-index');
            redirecter.redirect('meals/index.html');
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
