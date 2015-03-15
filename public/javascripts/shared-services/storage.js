angular.module('eat-this-one')
    .factory('storage', function() {
    return {

        add : function(itemname, value) {

            var item = localStorage.getItem(itemname);
            if (item === null) {
                item = {};
            } else {
                item = JSON.parse(item);
            }
            item[value] = value;

            localStorage.setItem(itemname, JSON.stringify(item));
        },

        isIn : function(itemname, value) {
            var item = localStorage.getItem(itemname);
            if (item === null) {
                return false;
            }

            item = JSON.parse(item);
            if (typeof item[value] === "undefined") {
                return false;
            }

            return true;
        }
    };
});
