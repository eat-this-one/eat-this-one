angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', 'newLogRequest', 'redirecter', function($mdSidenav, newLogRequest, redirecter) {
    return {

        lang : $.eatLang.lang,

        toggle : function() {
            $mdSidenav('menu').toggle();
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
