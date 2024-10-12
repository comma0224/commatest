$(document).ready(function () {

    // 댓글 목록 가져오기
    sendAjax('/getComments', {postKey: $('#postKey').val()} )
        .then(response => {
            if (response.status) {
                setComments(response.comments);
            } else {
                errorBox(response.message);
            }
        });

    // 새 게시글 폼 제출 이벤트 핸들러
    $('#saveComment').submit(function (event) {
        event.preventDefault();

        var data = {
            postKey: $('#postKey').val(),
            content: $('#commentContent').val(),
            parentCommentKey: 0
        };
        sendAjax('/saveComment', data)
            .then(response => {
                if (response.status) {
                    setComments(response.comments);
                    $('#commentContent').val("");
                } else {
                    errorBox(response.message);
                }
            });
    });

    $('.btn-like').click(function () {
        // 클릭된 SVG 확인
        var isPostLike = $(this).hasClass('bi-heart-fill');
        var postKey = $('#postKey').val();

        if (isPostLike) {
            updatePostLikeStatus(postKey, isPostLike);
        } else {
            sendAjax("/checkLogin", {})
                .then(response => {
                    if (response) {
                        updatePostLikeStatus(postKey, isPostLike);
                    } else {
                        navigateToPageWithAlert('user-login', "로그인이 필요한 서비스입니다.");
                    }
                });
        }
    });

    $('.btn-report').click(function () {
        errorBox("신고 기능은 준비 중입니다.");
    });

    const createdAt = $('.createdAt');
    const value = createdAt.text(); // Use text() instead of val()
    const date = formatPostDate(value);
    createdAt.text(date); // Use text() instead of val()
});