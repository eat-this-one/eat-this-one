angular.module('eat-this-one').factory('menuManager', ['$mdSidenav', 'newLogRequest', 'redirecter', function($mdSidenav, newLogRequest, redirecter) {
    return {

        lang : $.eatLang.lang,

        toggle : function() {
            $mdSidenav('menu').toggle();
        },

        close : function() {
            var sidenav = $mdSidenav('menu');
            if (sidenav.isOpen()) {
                sidenav.close();
            }
        },

        getDefaultItems : function() {

            var items = [];

            items.push(this.dishesListItem());
            items.push(this.groupViewItem());
            items.push(this.editProfileItem());

            return items;
        },

        groupViewItem : function() {

            var itemName = this.lang.participants;

            // Only if the user is not member of any group.
            if (localStorage.getItem('group') === null) {
                itemName = this.lang.setgroup;
            }

            return {
                name : itemName,
                icon : 'glyphicon glyphicon-home',
                callback : 'groupViewCallback'
            };
        },

        groupViewCallback : function() {
            var url = null;

            var group = localStorage.getItem('group');
            if (group === null) {
                newLogRequest('click', 'groupMembers-edit');
                url = 'group-members/edit.html';
            } else {
                group = JSON.parse(group);
                newLogRequest('click', 'group-view');
                url = 'groups/view.html?id=' + group._id;
            }

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
