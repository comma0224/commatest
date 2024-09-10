$(document).ready(function() {
    $('#update-user').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                const userData = {
                    nickname: $('#update-nickname').val()
                };

                sendAjax('/update-user', userData)
                    .then(response => {
                        if (response.status) {
                            alertBox(response.message);
                            // Update the member information on the page
                            const updatedUser = response.updatedUser;
                            $('#update-nickname').val(updatedUser.nickname);
                        } else {
                            errorBox(response.message);
                        }
                    })
                    .catch(error => {
                        errorBox(error.message);
                    });
            } else {
                event.stopPropagation();
            }
        });
    });

    $('#update-user-password').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                var checkUserPassword = $('#check-user-password');
                var modifyUserPassword = $('#modify-user-password');
                var modifyConfirmUserPassword = $('#modify-confirm-user-password');

                const inputIds = [checkUserPassword, modifyUserPassword, modifyConfirmUserPassword];

                const userData = {
                    userPassword: modifyUserPassword.val()
                };

                sendAjax('/update-user-password', userData)
                    .then(response => {
                        if (response.status) {
                            alertBox(response.message);

                            inputIds.forEach(id => {
                                const input = $(id);
                                const feedback = input.closest('.mb-3').find('.feedback').hide();

                                input.val('');
                                input.removeClass('is-valid is-invalid');
                                feedback.removeClass('valid-feedback invalid-feedback');
                            });

                        }else {
                            errorBox(response.message);
                        }
                    })
                    .catch(error => {
                        errorBox(error.message);
                    });
            } else {
                event.stopPropagation();
            }
        });
    });

    $('#delete-user').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                const userData = {
                    userPassword: $('#delete-user-Password').val()
                };

                sendAjax('/delete-user', userData)
                    .then(response => {
                        if (response.status) {
                            clearCachedCategories();
                            navigateToPageWithAlert('', response.message);
                        }else {
                            errorBox(response.message);
                        }
                    })
                    .catch(error => {
                        errorBox(error.message);
                    });
            } else {
                event.stopPropagation();
            }
        });
    });
    $('#emailVerified').on('click', function(event) {
        alertBox("아직 구현되지 않은 기능입니다.");
    });
});