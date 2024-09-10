$(document).ready(function () {
    var column = [
        { data: 'memberCode', title: '사용자 코드', visible: 'false', readonly: true },
        { data: 'memberLevel', title: '사용자 레벨', type: 'select', options: ['guest', 'member', 'moderator', 'admin'], default: 'admin' },
        { data: 'memberId', title: '사용자 ID' },
        { data: 'memberName', title: '사용자 이름' },
        { data: 'memberNickname', title: '사용자 별명', visible: 'false', readonly: true },
        { data: 'email', title: '이메일'},
        { data: 'emailVerified', title: '이메일 인증', options: ['true', 'false'], default: 'false' },
        { data: 'passwordHash', title: '비밀번호', visible: 'false', readonly: true },
        { data: 'dateOfBirth', title: '생일'},
        { data: 'phoneNumber', title: '전화번호' },
        { data: 'gender', title: '성별', type: 'select', options: ['true', 'false'], default: 'true' },
        { data: 'profilePictureUrl', title: '프로필 사진 URL' },
        { data: 'joinDate', title: '가입 일', visible: 'false', readonly: true },
        { data: 'lastLogin', title: '마지막 로그인', visible: 'false', readonly: true },
        { data: 'isActive', title: '상태', options: ['true', 'false'], default: 'true' },
        { data: 'accountType', title: '계정 유형', visible: 'false', readonly: true },
        { data: 'subscriptionExpiry', title: '구독 만료일', visible: 'false', readonly: true },
        { data: 'points', title: '포인트' },
        { data: 'cash', title: '캐쉬' }
    ];

    // 초기 데이터 로드
    $.ajax({
        url: '/membersAll',
        type: 'POST',
        success: function (data) {
            generateTable('#membersTable', data, column, 2);
        }
    });

    function generateTable(selector, data, columns, fixedColumns) {
        var $table = $(selector);
        $table.empty(); // Clear any existing content

        // Create table header
        var $thead = $('<thead>');
        var $headerRow = $('<tr>');
        columns.forEach(function (col) {
            var $th = $('<th>').text(col.title);
            if (col.visible === 'false') {
                $th.css('display', 'none');
            }
            $headerRow.append($th);
        });
        $thead.append($headerRow);
        $table.append($thead);

        // Create table body
        var $tbody = $('<tbody>');
        data.forEach(function (row) {
            var $tr = createRow(row);
            $tbody.append($tr);
        });
        $table.append($tbody);

        // Apply fixed columns if necessary
        if (fixedColumns > 0) {
            $table.addClass('fixed-columns');
            $table.find('thead th:lt(' + fixedColumns + '), tbody td:lt(' + fixedColumns + ')').addClass('fixed');
        }
    }

    function createRow(row) {
        var $tr = $('<tr>');
        column.forEach(function (col) {
            var value = row[col.data];
            var $td = $('<td>').text(value);
            if (col.visible === 'false') {
                $td.css('display', 'none');
            }
            $tr.append($td);
        });

        // 행 클릭 시 모달 열기
        $tr.click(function () {
            openModal(column, row, function (updatedRow) {
                $tr.replaceWith(createRow(updatedRow));
            });
        });

        return $tr;
    }

    // 행 추가 버튼 클릭 시
    $('#addRowButton').click(function () {
        var newRow = {};
        column.forEach(function (col) {
            newRow[col.data] = col.default;
        });
        openModal(column, newRow, function (newRow) {
            addRow(newRow);
        });
    });

    // 데이터 저장 버튼 클릭 시
    $('#saveButton').click(function () {
        var data = [];
        $('#membersTable tbody tr').each(function () {
            var row = {};
            $(this).find('td').each(function (index) {
                var key = column[index].data;
                row[key] = $(this).text();
            });
            data.push(row);
        });

        sendAjax('/membersSave', data)
            .then(response => {
                if (response.status) {
                    alertBox(response.message);
                }else{
                    errorBox(response.message);
                }

            })
            .catch(error => {
                errorBox(error);
            });
    });

    function addRow(row) {
        var $tr = createRow(row);
        $('#membersTable tbody').append($tr);
    }

    function openModal(column, row, onSave) {
        // Create modal structure
        var $modal = $(`
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">행 수정</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <!-- Dynamic form fields will be generated here -->
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="modalCancelButton" data-bs-dismiss="modal">취소</button>
                        <button type="button" class="btn btn-primary" id="modalSaveButton">완료</button>
                    </div>
                </div>
            </div>
        </div>
    `);

        var $modalBody = $modal.find('.modal-body form');
        column.forEach(function (col) {
            var $formGroup = $('<div class="mb-3">');
            $formGroup.append($('<label>').attr('for', 'modal' + col.data).addClass('form-label').text(col.title));

            if (col.type === 'select') {
                var $select = $('<select>').addClass('form-control').attr('id', 'modal' + col.data);
                col.options.forEach(function (option) {
                    $select.append($('<option>').attr('value', option).text(option));
                });
                $select.val(String(row[col.data]));
                $formGroup.append($select);
            } else {
                var $input = $('<input>').addClass('form-control').attr('id', 'modal' + col.data).val(row[col.data]);
                if (col.readonly) {
                    $input.attr('readonly', true);
                }
                $formGroup.append($input);
            }

            if (col.visible === 'false') {
                $formGroup.css('display', 'none');
            }

            $modalBody.append($formGroup);
        });

        $modal.find('#modalSaveButton').off('click').on('click', function () {
            var updatedRow = {};
            column.forEach(function (col) {
                var value = $modal.find('#modal' + col.data).val();
                updatedRow[col.data] = value;
            });
            onSave(updatedRow);
            $modal.modal('hide');
        });

        $modal.find('#modalCancelButton').off('click').on('click', function () {
            $modal.modal('hide');
        });

        $('body').append($modal);
        $modal.modal('show');

        $modal.on('hidden.bs.modal', function () {
            $modal.remove();
        });
    }
});