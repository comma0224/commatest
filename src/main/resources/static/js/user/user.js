$(document).ready(function() {
    'use strict';

    $('#kakao').on('click', function() {
        // Open a new popup window
        var popup = window.open('/kakao', 'kakaoPopup',  'width=400, height=600');

        // Ensure the popup remains in focus
        if (popup) {
            popup.focus();
        }
    });

    // 각 인풋박스에 onChange 이벤트를 추가
    $('input, select').on('change', function() {
        inputValidity(this);
    });
});

function oauth(code) {
    $('#user-register').show();

    var data = {
        grant_type : 'authorization_code',
        client_id : '347a5f90cc44471068b6858fc5139c7f',
        redirect_uri : 'http://localhost/oauth',
        code : code
    }
    console.log("인가코드 ==> "+ code);

    $.ajax({
        type : "POST"
        , url : 'https://kauth.kakao.com/oauth/token'
        , data : data
        , contentType:'application/x-www-form-urlencoded;charset=utf-8'
        , dataType: null
        , success : function(response) {
            Kakao.Auth.setAccessToken(response.access_token);
            console.log("access_token ==> "+ response.access_token);
        }
        ,error : function(jqXHR, error) {

        }
    });

    Kakao.API.request({
        url: '/v2/user/me'
    })
        .then(function(res) {
            console.log("res  ==> " + res.id);
        })
        .catch(function(err) {
            alert(
                'failed to request user information: ' + JSON.stringify(err)
            );
        });

}

function inputValidity(input) {
    var input = $(input);
    var inputId = input.attr('id');
    var value = input.val();
    //var feedback = input.next('.feedback');
    var feedback = input.closest('.input-area').find('.feedback').hide();

    input.removeClass('is-valid is-invalid');
    feedback.removeClass('valid-feedback invalid-feedback');


    var idPattern = /^[a-zA-Z0-9]{6,}$/;
    var passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return new Promise(function(resolve, reject) {
        switch (inputId) {
            case 'register-user-id':
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
                sendAjax("/is-user-id-exists", {userId: value})
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
            case 'register-user-password':
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
            case 'register-confirm-user-password':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호 확인을 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호와 일치하는지 확인
                var userPassword = $('#register-user-password').val();
                if (value !== userPassword) {
                    feedback.text('비밀번호가 일치하지 않습니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'login-user-id':
                // 빈 값 체크
                if (!value) {
                    feedback.text('아이디를 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 영문과 숫자 체크
                if (!idPattern.test(value)) {
                    feedback.text('아이디는 6자 이상 영문과 숫자로만 적어주세요').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'login-user-password':
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
            case 'update-nickname':
                // 빈 값 체크
                if (!value) {
                    feedback.text('필수 항목입니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 서버 측 유효성 검사
                sendAjax("/is-nickname-exists", {nickname: value})
                    .then(response => {
                        if (response.status) {
                            feedback.text('이미 사용 중인 닉네임입니다.').addClass('invalid-feedback').show();
                            input.addClass('is-invalid');
                            resolve(false);
                        } else {
                            feedback.text('사용 가능한 닉네임입니다.').addClass('valid-feedback').show();
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
            case 'modify-user-password':
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
            case 'modify-confirm-user-password':
                // 빈 값 체크
                if (!value) {
                    feedback.text('비밀번호 확인을 입력해 주세요.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                // 비밀번호와 일치하는지 확인
                var password = $('#modify-user-password').val();
                if (value !== password) {
                    feedback.text('비밀번호가 일치하지 않습니다.').addClass('invalid-feedback').show();
                    input.addClass('is-invalid');
                    resolve(false);
                    break;
                }

                input.addClass('is-valid');
                feedback.addClass('valid-feedback').hide();
                resolve(true);
                break;
            case 'check-user-password':
            case 'delete-user-password':
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