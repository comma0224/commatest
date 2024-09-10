import { ClassicEditor, editorConfig, viewerConfig } from '../../ckeditor5/ckeditor5.mjs';

$(document).ready(function () {
    // CKEditor5 초기화
    ClassicEditor
        .create(document.querySelector('#content'), viewerConfig)
        .then(editor => {
            editor.enableReadOnlyMode('readonly')
        })
        .catch(error => {
            console.error(error);
        });

    // 새 게시글 폼 제출 이벤트 핸들러
    $('#saveComment').submit(function (event) {
        event.preventDefault();

        var data = {
            postKey: $('#postKey').val(),
            content: $('#commentContent').val(),
            parentCommentKey: ''//$('#parentCommentKey').val()
        };
        sendAjax('/saveComment', data)
            .then(response => {
                if (response.status) {
                    location.reload();
                } else {
                    errorBox(response.message);
                }
            });
    });
});