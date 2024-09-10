$(document).ready(function() {
    $('#updateMember').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                const memberData = {
                    memberName: $('#updateMemberName').val(),
                    memberNickname: $('#updateMemberNickname').val(),
                    email: $('#updateEmail').val(),
                    dateOfBirth: $('#updateDateOfBirth').val(),
                    phoneNumber: $('#updatePhoneNumber').val(),
                    gender: $('#updateGender').val()
                };

                sendAjax('/update-member-info', memberData)
                    .then(response => {
                        if (response.status) {
                            alertBox(response.message);
                            // Update the member information on the page
                            const updatedMember = response.updatedMember;
                            $('#name').val(updatedMember.memberName);
                            $('#nickname').val(updatedMember.memberNickname);
                            $('#email').val(updatedMember.email);
                            $('#birthday').val(updatedMember.dateOfBirth);
                            $('#phoneNumber').val(updatedMember.phoneNumber);
                            $('#gender').val(updatedMember.gender);
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

    $('#updatePassword').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                var passwordHash = $('#checkPasswordHash');
                var modifyPasswordHash = $('#modifyPasswordHash');
                var modifyConfirmPasswordHash = $('#modifyConfirmPasswordHash');

                const inputIds = [passwordHash, modifyPasswordHash, modifyConfirmPasswordHash];

                const memberData = {
                    passwordHash: passwordHash.val(),
                    modifyPasswordHash: modifyPasswordHash.val(),
                    modifyConfirmPasswordHash: modifyConfirmPasswordHash.val()
                };

                sendAjax('/update-member-password', memberData)
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

    $('#deleteMember').on('submit', function(event) {
        event.preventDefault();

        formValidity(this).then(function(isValid) {
            if (isValid) {
                const memberData = {
                    passwordHash: $('#deletePasswordHash').val()
                };

                sendAjax('/delete-member', memberData)
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