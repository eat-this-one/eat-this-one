angular.module('eat-this-one').factory('formsManager', function() {

    return {

        validate : function(fieldNames, fields) {

            var missing = [];
            var wrongcontents = [];
            fieldNames.forEach(function(field) {

                // DEV
                if (typeof fields[field] === 'undefined') {
                    console.log('Wrong use of formsManager.validate, fields should contain all field names.');
                    return;
                }

                // Iterate through the field required validations.
                fields[field].validation.forEach(function(process) {
                    switch (process) {

                        // The field is required.
                        case 'required':
                            if (fields[field].value === null ||
                                fields[field].value === '' ||
                                typeof fields[field].value === 'undefined') {
                                    missing.push(fields[field].label);
                            }
                            break;

                        // The field contents should be text.
                        case 'text':
                            // Only triggers an error if there is content.
                            if (fields[field].value && fields[field].value.length > 0) {
                                var textexpression = new RegExp(/^[A-Za-z1-9-_=".',;\s]*$/);
                                if (!textexpression.test(fields[field].value)) {
                                    wrongcontents.push(fields[field].label);
                                }
                            }
                            break;

                        case 'email':
                            // Only triggers an error if there is content.
                            if (fields[field].value && fields[field].value.length > 0) {
                                var emailexpression = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                                if (!emailexpression.test(fields[field].value)) {
                                    wrongcontents.push(fields[field].label);
                                }
                            }
                            break;
                    }
                });
            });

            if (missing.length > 0) {
                return false;
            }

            if (wrongcontents.length > 0) {
                return false;
            }

            return true;
        }
    }
});
