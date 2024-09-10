$(document).ready(function() {
    $('#member-register').on('submit', function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        formValidity(this).then(function(isValid) {
            if (isValid) {
                // 폼이 유효하면 제출
                var userId = $('#remember-user-id').val().trim();
                var userPassword = $('#register-user-password').val().trim();
                var nickname = $('#register-nickname').val().trim();

                var memberData = {
                    userId: userId,
                    userPassword: userPassword,
                    nickname: nickname
                };

                sendAjax('/register', memberData)
                    .then(response => {
                        if (response.status) {
                            navigateToPageWithAlert('user-login', response.message);
                        } else {
                            errorBox(response.message);
                        }
                    })
                    .catch(error => {
                        errorBox(error.message);
                    });
            } else {
                // 폼이 유효하지 않으면 이벤트 전파를 중지
                event.stopPropagation();
            }
        });
    });
});