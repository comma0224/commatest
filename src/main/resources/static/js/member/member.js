$(document).ready(function() {
    'use strict';

    // 각 인풋박스에 onChange 이벤트를 추가
    $('input, select').on('change', function() {
        inputValidity(this);
    });
});

function inputValidity(input) {
    var input = $(input);
    var inputId = input.attr('id');
    var value = input.val();
    //var feedback = input.next('.feedback');
    var feedback = input.closest('.mb-3').find('.feedback').hide();

    input.removeClass('is-valid is-invalid');
    feedback.removeClass('valid-feedback invalid-feedback');


    var idPattern = /^[a-zA-Z0-9]{6,}$/;
    var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return new Promise(function(resolve, reject) {
        switch (inputId) {
            case 'registerMemberId':
                // 빈 값 체크
                if (!value) {
                    feedback.text('아이디를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 영문과 숫자 체크

                if (!idPattern.test(value)) {
                    feedback.text('아이디는 6자리 이상 영문과 숫자만 입력 가능합니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 서버 측 유효성 검사
                sendAjax("/check-member-id", {memberId: value})
                    .then(response => {
                        if (response.status) {
                            feedback.text('이미 사용 중인 아이디입니다.').addClass('invalid-feedback').show();
                            input.addClass('is-invalid');
                            resolve(false);
                        } else {
                            feedback.text('사용 가능한 아이디입니다.').addClass('valid-feedback').show();
                            input.addClass('is-valid');
                            resolve(true);
                        }
                    })
                    .catch(error => {
                        feedback.text('서버 에러가 발생했습니다.').addClass('invalid-feedback').show();
                        input.addClass('is-invalid');
                        resolve(false);
                    });
                break;
            case 'registerPasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호 유효성 체크
                if (!passwordPattern.test(value)) {
                    feedback.text('비밀번호는 8자리 이상 영문, 숫자, 특수문자를 포함해야 합니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'registerConfirmPasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호 확인을 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호와 일치하는지 확인
                var password = $('#registerPasswordHash').val();
                if (password && value !== password) {
                    feedback.text('비밀번호가 일치하지 않습니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'loginMemberId':
                // 빈 값 체크
                if (!value) {
                    feedback.text('아이디를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 영문과 숫자 체크
                if (!idPattern.test(value)) {
                    feedback.text('아이디는 6자 이상 적어주세요').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'loginPasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }
                // 비밀번호 유효성 체크
                if (!passwordPattern.test(value)) {
                    feedback.text('비밀번호를 8자 이상 적어주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'updateMemberName':
            case 'updateMemberNickname':
            case 'updateDateOfBirth':
            case 'updatePhoneNumber':
            case 'updateGender':
                // 빈 값 체크
                if (!value) {
                    feedback.text('필수 항목입니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'updateEmail':
                // 빈 값 체크
                if (!value) {
                    feedback.text('이메일을 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 이메일 형식 체크
                if (!emailPattern.test(value)) {
                    feedback.text('유효한 이메일 형식이 아닙니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 이메일 중복 검사
                sendAjax("/check-email", {email: value})
                    .then(response => {
                        if (response.status) {
                            feedback.text('사용 가능한 이메일입니다.').addClass('valid-feedback').show();
                            input.addClass('is-valid');
                            resolve(true);
                        } else {
                            feedback.text('이미 사용 중인 이메일입니다.').addClass('invalid-feedback').show();
                            input.addClass('is-invalid');
                            resolve(false);
                        }
                    })
                    .catch(error => {
                        feedback.text('서버 에러가 발생했습니다.').addClass('invalid-feedback').show();
                        input.addClass('is-invalid');
                        resolve(false);
                    });
                break;
            case 'modifyPasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호 유효성 체크
                if (!passwordPattern.test(value)) {
                    feedback.text('비밀번호는 8자리 이상 영문, 숫자, 특수문자를 포함해야 합니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호 확인 값과 비교
                var confirmPassword = $('#modifyConfirmPasswordHash').val();
                if (confirmPassword && value !== confirmPassword) {
                    feedback.text('비밀번호가 일치하지 않습니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'modifyConfirmPasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호 확인을 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호와 일치하는지 확인
                var password = $('#modifyPasswordHash').val();
                if (password && value !== password) {
                    feedback.text('비밀번호가 일치하지 않습니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'checkPasswordHash':
            case 'deletePasswordHash':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            default:
                resolve(true);
                break;
        }
    });
}

function formValidity(form) {
    var form = $(form);
    var items = form.find('input[required], select[required]');
    var promises = [];

    items.each(function() {
        promises.push(inputValidity(this));
    });

    return Promise.all(promises).then(function(results) {
        return results.every(function(isValid) {
            return isValid;
        });
    });
}