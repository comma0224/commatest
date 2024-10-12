$(document).ready(function () {
    // 새 게시글 폼 제출 이벤트 핸들러
    $('#newPostForm').submit(function (event) {
        event.preventDefault();

        var data = {
            subSectionKey: $('#subSectionKey').val(),
            subSectionTagKey: $('.subSectionTag[data-active="true"]').data('key'),
            title: $('#title').val(),
            content: $('#content').val()
        };
        sendAjax('/savePost', data)
            .then(response => {
                if (response.status) {
                    navigateToPageWithAlert('section/Grow_Demon_Slime', response.message);
                } else {
                    errorBox(response.message);
                }
            });
    });
});