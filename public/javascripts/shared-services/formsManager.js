angular.module('eat-this-one').factory('formsManager', function() {

    return {

        validate : function(fieldNames, fields) {

            var errors = [];
            var validated = [];
            fieldNames.forEach(function(field) {

                var fieldHasErrors = false;

                // DEV
                if (typeof fields[field] === 'undefined') {
                    console.log('Wrong use of formsManager.validate, fields should contain all field names.');
                    return;
                }

                if (typeof fields[field].validation === 'undefined') {
                    console.log('Wrong use of formsManager.validate, fields should contain a validation field.');
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
                                    errors.push(fields[field].name);
                                    fieldHasErrors = true;
                            }
                            break;

                        // The field contents should be text.
                        case 'text':
                            // Only triggers an error if there is content.
                            if (fields[field].value && fields[field].value.length > 0) {
                                var textexpression = new RegExp(/^[A-Za-z1-9-_=".',;\s]*$/);
                                if (!textexpression.test(fields[field].value)) {
                                    errors.push(fields[field].name);
                                    fieldHasErrors = true;
                                }
                            }
                            break;

                        case 'email':
                            // Only triggers an error if there is content.
                            if (fields[field].value && fields[field].value.length > 0) {
                                var emailexpression = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                                if (!emailexpression.test(fields[field].value)) {
                                    errors.push(fields[field].name);
                                    fieldHasErrors = true;
                                }
                            }
                            break;
                    }

                    if (fieldHasErrors === false) {
                        validated.push(fields[field].name);
                    }
                });
            });

            // Remove error class.
            if (validated.length > 0) {
                validated.forEach(function(fieldname) {
                    var group = $('#id-' + fieldname).closest('md-input-container');
                    group.removeClass('md-input-invalid');
                });
            }

            // Set error class.
            if (errors.length > 0) {
                errors.forEach(function(fieldname) {
                    var group = $('#id-' + fieldname).closest('md-input-container');
                    group.addClass('md-input-invalid');
                });
                return false;
            }

            return true;
        }
    };
});
