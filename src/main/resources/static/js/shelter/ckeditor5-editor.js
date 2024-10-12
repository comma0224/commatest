import { ClassicEditor,editorConfig,viewerConfig } from '../../ckeditor5/ckeditor5.mjs';

$(document).ready(function () {
    // CKEditor5 초기화
    ClassicEditor.create(document.querySelector('#content'), editorConfig)
        .catch(error => {
            console.error(error);
        });
});