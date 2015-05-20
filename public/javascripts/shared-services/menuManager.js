angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', 'newLogRequest', 'redirecter', function($mdSidenav, newLogRequest, redirecter) {
    return {

        lang : $.eatLang.lang,

        toggle : function() {
            $mdSidenav('menu').toggle();
        },

        getDefaultItems : function() {
            return [
                this.dishesListItem(),
                this.groupViewItem(),
                this.editProfileItem()
            ];
        },

        groupViewItem : function() {

            return {
                name : this.lang.participants,
                icon : 'glyphicon glyphicon-home',
                callback : 'groupViewCallback'
            };
        },

        groupViewCallback : function() {
            var url = null;

            var group = localStorage.getItem('group');
            if (group === null) {
                url = 'group-members/edit.html';
            } else {
                group = JSON.parse(group);
                url = 'groups/view.html?id=' + group._id;
            }

            newLogRequest('click', 'group-view');
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

        editProfileItem : function() {
            return {
                name : this.lang.editprofile,
                icon : 'glyphicon glyphicon-user',
                callback : 'editProfileCallback'
            };

        },

        editProfileCallback : function() {
            newLogRequest('click', 'user-edit');
            redirecter.redirect('users/edit.html');
        }
    };
}]);
