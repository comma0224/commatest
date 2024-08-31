$(document).ready(function() {
// 쿠키에서 아이디 읽기
    const cookieMemberId = getCookie("memberId");
    if (cookieMemberId) {
        $('#loginMemberId').val(cookieMemberId);
        $('#rememberMeCheckbox').prop('checked', true);
    }

    $('#member-login').on('submit', function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        formValidity(this).then(function(isValid) {
            if (isValid) {
                // 폼이 유효하면 제출

                // 입력된 값 가져오기
                var memberId = $('#loginMemberId').val().trim();
                var passwordHash = $('#loginPasswordHash').val().trim();

                if ($('#rememberMeCheckbox').is(':checked')) {
                    setCookie("memberId", memberId, 30);
                } else {
                    setCookie("memberId", "", -1); // 쿠키 삭제
                }

                var memberData = {
                    memberId: memberId,
                    passwordHash: passwordHash
                };

                sendAjax('/login', memberData)
                    .then(response => {
                        if (response.status) {
                            window.location.href = '/';
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