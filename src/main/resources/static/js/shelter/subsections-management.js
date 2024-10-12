$(document).ready(function () {
    // 초기 로드 시 첫 번째 title_group, subSection, subSectionTag 표시
    var firstTitleGroup = $('#titleGroupList .row:visible').first();
    firstTitleGroup.addClass('active');
    filterSubSections(firstTitleGroup.data('key'));

    var firstSubSection = $('#subSectionList .row:visible').first();
    firstSubSection.addClass('active');
    filterSubSectionTags(firstSubSection.data('key'));

    var firstSubSectionTag = $('#subSectionTagList .row:visible').first();
    firstSubSectionTag.addClass('active');

    // Title Group 선택 시
    $('#titleGroupList').on('click', '.row', function () {
        var selectedGroupKey = $(this).data('key');
        $(this).addClass('active').siblings().removeClass('active');
        filterSubSections(selectedGroupKey);

        var firstSubSection = $('#subSectionList .row:visible').first();
        firstSubSection.addClass('active').siblings().removeClass('active');
        filterSubSectionTags(firstSubSection.data('key'));

        var firstSubSectionTag = $('#subSectionTagList .row:visible').first();
        firstSubSectionTag.addClass('active').siblings().removeClass('active');
    });

    // SubSection 선택 시
    $('#subSectionList').on('click', '.row', function () {
        var selectedSubSectionKey = $(this).data('key');
        $(this).addClass('active').siblings().removeClass('active');
        filterSubSectionTags(selectedSubSectionKey);

        var firstSubSectionTag = $('#subSectionTagList .row:visible').first();
        firstSubSectionTag.addClass('active').siblings().removeClass('active');
    });

    // SubSectionTag 선택 시
    $('#subSectionTagList').on('click', '.row', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    // Add Group
    $('#addTitleGroup').click(function () {
        var newGroupKey = 'newGroup' + ($('#titleGroupList .row').length + 1);
        var newGroupItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newGroupKey)
            .text(newGroupKey);
        $('#titleGroupList').append(newGroupItem);

        var newSubSectionKey = 'newSubSection' + ($('#subSectionList .row').length + 1);
        var newSubSectionItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newSubSectionKey)
            .attr('data-group', newGroupKey)
            .text(newSubSectionKey);
        $('#subSectionList').append(newSubSectionItem);

        var newSubSectionTagKey = 'newSubSectionTag' + ($('#subSectionTagList .row').length + 1);
        var newSubSectionTagItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newSubSectionTagKey)
            .attr('data-subsection', newSubSectionKey)
            .text(newSubSectionTagKey);
        $('#subSectionTagList').append(newSubSectionTagItem);

        newGroupItem.click();
    });

    // Delete Group
    $('#deleteTitleGroup').click(function () {
        var selectedGroup = $('#titleGroupList .row.active');
        var groupKey = selectedGroup.data('key');
        $('#subSectionList .row[data-group="' + groupKey + '"]').each(function () {
            var subSectionKey = $(this).data('key');
            $('#subSectionTagList .row[data-subsection="' + subSectionKey + '"]').attr("isDeleted", "true").hide();
            $(this).attr("isDeleted", "true").hide();
        });
        selectedGroup.attr("isDeleted", "true").hide();
        $('#titleGroupList .row:visible').first().click();
    });

    // Add SubSection
    $('#addSubSection').click(function () {
        var selectedGroup = $('#titleGroupList .row.active');
        var groupKey = selectedGroup.data('key');
        var newSubSectionKey = 'newSubSection' + ($('#subSectionList .row').length + 1);
        var newSubSectionItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newSubSectionKey)
            .attr('data-group', groupKey)
            .text(newSubSectionKey);
        $('#subSectionList').append(newSubSectionItem);

        var newSubSectionTagKey = 'newSubSectionTag' + ($('#subSectionTagList .row').length + 1);
        var newSubSectionTagItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newSubSectionTagKey)
            .attr('data-subsection', newSubSectionKey)
            .text(newSubSectionTagKey);
        $('#subSectionTagList').append(newSubSectionTagItem);

        newSubSectionItem.click();
    });

    // Delete SubSection
    $('#deleteSubSection').click(function () {
        var selectedSubSection = $('#subSectionList .row.active');
        var groupKey = selectedSubSection.data('group');
        var subSectionKey = selectedSubSection.data('key');
        var subSections = $('#subSectionList .row[data-group="' + groupKey + '"]');
        if (subSections.length <= 1) {
            errorBox("최소 1개의 메뉴가 필요합니다.");
            return;
        }
        $('#subSectionTagList .row[data-subsection="' + subSectionKey + '"]').attr("isDeleted", "true").hide();
        selectedSubSection.attr("isDeleted", "true").hide();
        $('#subSectionList .row[data-group="' + groupKey + '"]:visible').first().click();
    });

    // Add SubSectionTag
    $('#addSubSectionTag').click(function () {
        var selectedSubSection = $('#subSectionList .row.active');
        var subSectionKey = selectedSubSection.data('key');
        var newSubSectionTagKey = 'newSubSectionTag' + ($('#subSectionTagList .row').length + 1);
        var newSubSectionTagItem = $('<div></div>')
            .addClass('border-bottom border-200 p-2 m-0 row')
            .attr('data-key', newSubSectionTagKey)
            .attr('data-subsection', subSectionKey)
            .text(newSubSectionTagKey);
        $('#subSectionTagList').append(newSubSectionTagItem);
    });

    // Delete SubSectionTag
    $('#deleteSubSectionTag').click(function () {
        var selectedSubSectionTag = $('#subSectionTagList .row.active');
        var subSectionKey = selectedSubSectionTag.data('subsection');
        var subSectionTags = $('#subSectionTagList .row[data-subsection="' + subSectionKey + '"]');
        if (subSectionTags.length <= 1) {
            errorBox("최소 1개의 태그가 필요합니다.");
            return;
        }
        selectedSubSectionTag.attr("isDeleted", "true").hide();
        $('#subSectionTagList .row[data-subsection="' + subSectionKey + '"]').first().click();
    });

    // Title Group 더블 클릭 시 편집
    $('#titleGroupList').on('dblclick', '.row', function () {
        var $this = $(this);
        var currentText = $this.text();
        var input = $('<input type="text" class="p-0" />').val(currentText).css('width', $this.width());
        $this.html(input);
        input.focus();

        input.on('blur keydown', function (e) {
            if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
                var newText = input.val();
                $this.text(newText).attr('data-key', newText);
                $('#subSectionList .row[data-group="' + currentText + '"]').attr('data-group', newText);
            }
        });
    });

    // SubSection 더블 클릭 시 편집
    $('#subSectionList').on('dblclick', '.row', function () {
        var $this = $(this);
        var currentText = $this.text();
        var input = $('<input type="text" class="p-0" />').val(currentText).css('width', $this.width());
        $this.html(input);
        input.focus();

        input.on('blur keydown', function (e) {
            if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
                var newText = input.val();
                $this.text(newText);
            }
        });
    });

    // SubSectionTag 더블 클릭 시 편집
    $('#subSectionTagList').on('dblclick', '.row', function () {
        var $this = $(this);
        var currentText = $this.text();
        var input = $('<input type="text" class="p-0" />').val(currentText).css('width', $this.width());
        $this.html(input);
        input.focus();

        input.on('blur keydown', function (e) {
            if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
                var newText = input.val();
                $this.text(newText);
            }
        });
    });

    // 저장 버튼 클릭 시
    $('#saveButton').click(function () {
        var sectionKey = $('#sectionKey').val();
        var subSections = [];
        var subSectionTags = [];

        $('#subSectionList .row').each(function () {
            var subSection = {
                subSectionKey: $(this).data('key').toString(),
                titleGroup: $(this).attr('data-group'),
                title: $(this).text(),
                sectionKey: sectionKey,
                isDeleted: $(this).attr('isDeleted')
            };
            subSections.push(subSection);
        });

        $('#subSectionTagList .row').each(function () {
            var subSectionTag = {
                subSectionTagKey: $(this).data('key').toString(),
                subSectionKey: $(this).data('subsection').toString(),
                title: $(this).text(),
                isDeleted: $(this).attr('isDeleted')
            };
            subSectionTags.push(subSectionTag);
        });

        var data = {
            subSections: subSections,
            subSectionTags: subSectionTags
        };
        sendAjax('/saveSubSections', data)
            .then(response => {
                location.reload();
            })
    });
});

/**
 * SubSection 필터링
 * @param {string} groupKey - 그룹 키
 * 작성자: LeeSunJae
 */
function filterSubSections(groupKey) {
    $('#subSectionList .row').each(function () {
        if ($(this).data('group') === groupKey) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

/**
 * SubSection Tag 필터링
 * @param {string} subSectionKey - 서브 섹션 키
 * 작성자: LeeSunJae
 */
function filterSubSectionTags(subSectionKey) {
    $('#subSectionTagList .row').each(function () {
        if ($(this).data('subsection') === subSectionKey) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}