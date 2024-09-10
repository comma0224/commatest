$(document).ready(function () {
    var column = [
        { data: 'categoryId', title: '카테고리 ID', visible: 'false', readonly: true },
        { data: 'mainCategory', title: '메인 카테고리' },
        { data: 'subCategory', title: '서브 카테고리' },
        { data: 'createdAt', title: '생성일', visible: 'false', readonly: true },
        { data: 'updatedAt', title: '수정일', visible: 'false', readonly: true },
        { data: 'createdBy', title: '생성자', visible: 'false', readonly: true },
        { data: 'updatedBy', title: '수정자', visible: 'false', readonly: true },
        { data: 'isActive', title: '사용 여부', type: 'select', options: ['true', 'false'], default: 'true' },
        { data: 'slug', title: '카테고리 URL' },
        { data: 'priority', title: '정렬' },
        { data: 'metaTitle', title: '메타 제목' },
        { data: 'metaDescription', title: '메타 설명' },
        { data: 'memberLevel', title: '조회 레벨', type: 'select', options: ['guest', 'member', 'moderator', 'admin'], default: 'admin' }
    ];

    // 초기 데이터 로드
    $.ajax({
        url: '/categoriesAll',
        type: 'POST',
        success: function (data) {
            generateTable('#categoriesTable', data, column, 2);
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
        $('#categoriesTable tbody tr').each(function () {
            var row = {};
            $(this).find('td').each(function (index) {
                var key = column[index].data;
                row[key] = $(this).text();
            });
            data.push(row);
        });

        sendAjax('/categoriesSave', data)
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
        $('#categoriesTable tbody').append($tr);
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