angular.module('eat-this-one').factory('formsManager', function() {

    return {

        validate : function(fieldNames, fields) {

            var missing = [];
            fieldNames.forEach(function(field) {

                // DEV
                if (typeof fields[field] === 'undefined') {
                    console.log('Wrong use of formsManager.validate, fields should contain all field names.');
                    return;
                }
                if (fields[field].value === null ||
                        fields[field].value === '' ||
                        typeof fields[field].value === 'undefined') {
                    missing.push(fields[field].label);
                }
            });

            if (missing.length > 0) {
                return false;
            }

            return true;
        }
    }
});
