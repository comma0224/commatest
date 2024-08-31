$(document).ready(function() {
    $('#member-register').on('submit', function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작을 막음

        formValidity(this).then(function(isValid) {
            if (isValid) {
                // 폼이 유효하면 제출
                var memberId = $('#registerMemberId').val().trim();
                var passwordHash = $('#registerPasswordHash').val().trim();

                var memberData = {
                    memberId: memberId,
                    passwordHash: passwordHash
                };

                sendAjax('/register', memberData)
                    .then(response => {
                        if (response.status) {
                            navigateToPageWithAlert('member-login', response.message);
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