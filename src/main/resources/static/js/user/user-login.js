$(document).ready(function() {
// 쿠키에서 아이디 읽기
    const cookieUserId = getCookie("userId");
    if (cookieUserId) {
        $('#login-user-id').val(cookieUserId);
        $('#remember-user-id').prop('checked', true);
    }

    $('#user-login').on('submit', function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        formValidity(this).then(function(isValid) {
            if (isValid) {
                // 폼이 유효하면 제출

                // 입력된 값 가져오기
                var userId = $('#login-user-id').val().trim();
                var userPassword = $('#login-user-password').val().trim();

                if ($('#remember-user-id').is(':checked')) {
                    setCookie("userId", userId, 30);
                } else {
                    setCookie("userId", "", -1); // 쿠키 삭제
                }

                var userData = {
                    userId: userId,
                    userPassword: userPassword
                };

                sendAjax('/login', userData)
                    .then(response => {
                        if (response.status) {
                            clearCachedCategories();
                            navigateToPageWithAlert('', response.message);
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