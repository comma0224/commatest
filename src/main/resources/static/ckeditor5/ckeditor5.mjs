import {
    ClassicEditor,
    AccessibilityHelp,
    Alignment,
    AutoImage,
    Autosave,
    Bold,
    Essentials,
    FontColor,
    FontSize,
    GeneralHtmlSupport,
    ImageBlock,
    ImageInsert,
    ImageInsertViaUrl,
    ImageToolbar,
    ImageUpload,
    Base64UploadAdapter,
    Italic,
    List,
    Mention,
    Paragraph,
    SelectAll,
    SpecialCharacters,
    Strikethrough,
    Table,
    TableToolbar,
    TodoList,
    Underline,
    Undo
} from './ckeditor5.js';

import translations from './ko.js';

const editorConfig = {
    toolbar: {
        items: [
            'fontSize',
            'fontColor',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            '|',
            'insertImage',
            'insertTable',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList'
        ],
        shouldNotGroupWhenFull: false
    },
    plugins: [
        AccessibilityHelp,
        Alignment,
        AutoImage,
        Autosave,
        Bold,
        Essentials,
        FontColor,
        FontSize,
        GeneralHtmlSupport,
        ImageBlock,
        ImageInsert,
        ImageInsertViaUrl,
        ImageToolbar,
        ImageUpload,
        Base64UploadAdapter,
        Italic,
        List,
        Mention,
        Paragraph,
        SelectAll,
        SpecialCharacters,
        Strikethrough,
        Table,
        TableToolbar,
        TodoList,
        Underline,
        Undo
    ],
    fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true
    },
    htmlSupport: {
        allow: [
            {
                name: /^.*$/,
                styles: true,
                attributes: true,
                classes: true
            }
        ]
    },
    image: {
        toolbar: ['imageTextAlternative']
    },
    language: 'ko',
    mention: {
        feeds: [
            {
                marker: '@',
                feed: [
                    /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
                ]
            }
        ]
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties']
    },
    translations: [translations]
};

const viewerConfig = {
    ...editorConfig,
    toolbar: [],
};

export { ClassicEditor, editorConfig, viewerConfig };