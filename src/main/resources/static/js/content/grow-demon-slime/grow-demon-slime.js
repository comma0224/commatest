$(document).ready(function() {


    // DataTable을 초기화합니다.
    initializeData();
});
var previousRowData = null;

function updateColumnsVisibility(column, pageKey) {
    column.map(function(item) {
        if (pageKey !== 'dps') {
            if (item.data === 'hits' || item.data === 'cool') {
                item.visible = false;
            }
        }
    });

    var renderFunction = pageKey !== 'dps'
        ? function (i) {
            return function (data, type, row, meta) {
                var value = parseFloat(row.default) + (row.growth * (i - 1));
                return parseFloat(value).toFixed(2); // 소수점 2자리까지 표현
            };
        }
        : function (i) {
            return function (data, type, row, meta) {
                var value = (parseFloat(row.default) + (row.growth * (i - 1))) * row.hits / row.cool;
                return parseFloat(value).toFixed(2); // 소수점 2자리까지 표현
            };
        };

    column.push({
        data: null,title: '100',render: renderFunction(100)
    });

    for (var i = 1; i < 100; i++) {
        $('.header-row').append('<th>' + i + '</th>');
        column.push({
            data: null,    title: i.toString(),    render: renderFunction(i)
        });
    }
    return column;
}

// DataTable의 Data 생성
function initializeData() {
    var fileName = window.location.pathname.split('/').pop().split('.')[0];

    var selector;
    var datasets;
    var columns;
    var fixedColumns;

    if (fileName === 'skill-dps') {
        selector = "#datatables";
        datasets = structuredClone(datasetSkills);
        datasets.push({
            name: "메테오(붉은 공명석)",default: "2472",growth: "25.84",hits: "6",cool: "8",tiers: "6",key: "6c",value: "8",use: 0
        });
        datasets.push({
            name: "고드름(인어의 눈물)",default: "280",growth: "1.50",hits: "7",cool: "8",tiers: "3",key: "3a",value: "100",use: 0
        });
        datasets.push({
            name: "에너지 볼(푸른 공명석 1렙)",default: "590",growth: "3.70",hits: "1",cool: "7",tiers: "2",key: "2c",value: "100",use: 0
        });
        datasets.sort(function (a, b) {
            return a.tiers - b.tiers;
        });
        columns = updateColumnsVisibility(column, "dps");
        fixedColumns = 6;

        initializeTable(selector, datasets, columns, fixedColumns, "addTierClass");
    } else if (fileName === 'skill-damage') {
        selector = "#datatables";
        datasets = structuredClone(datasetSkills);
        datasets.push({name: "메테오(붉은 공명석)",default: "2472",growth: "25.84",hits: "6",cool: "8",tiers: "6",key: "6c",value: "8",use: 0});
        datasets.push({name: "고드름(인어의 눈물)",default: "280",growth: "1.50",hits: "7",cool: "8",tiers: "3",key: "3a",value: "100",use: 0});
        datasets.push({name: "에너지 볼(푸른 공명석 1렙)",default: "590",growth: "3.70",hits: "1",cool: "7",tiers: "2",key: "2c",value: "100",use: 0});
        datasets.sort(function (a, b) {
            return a.tiers - b.tiers;
        });
        columns = updateColumnsVisibility(column, "damage");
        fixedColumns = 4;
        initializeTable(selector, datasets, columns, fixedColumns, "addTierClass");
    } else if (fileName === 'familiar-dps') {
        selector = "#datatables";
        datasets = structuredClone(datasetFamiliars);
        columns = updateColumnsVisibility(column, "dps");
        fixedColumns = 6;
        initializeTable(selector, datasets, columns, fixedColumns, "addTierClass");
    } else if (fileName === 'familiar-damage') {
        selector = "#datatables";
        datasets = structuredClone(datasetFamiliars);
        columns = updateColumnsVisibility(column, "damage");
        fixedColumns = 4;
        initializeTable(selector, datasets, columns, fixedColumns, "addTierClass");
    } else if (fileName === 'cooldown-efficiency') {
        selector = "#datatables";
        datasets = structuredClone(datasetCoolDowns);
        columns = efficiencyColumn;
        fixedColumns = 1;
        initializeTable(selector, datasets, columns, fixedColumns, "none");
    } else if (fileName === 'cooldown-stage') {
        selector = "#datatables_20";
        datasets = structuredClone(hitsIn20Sec);
        columns = structuredClone(stageColumn);
        fixedColumns = 1;
        initializeTable(selector, datasets, columns, fixedColumns, "highlightChangedColumns");

        previousRowData = null;

        selector = "#datatables_30";
        datasets = structuredClone(hitsIn30Sec);
        initializeTable(selector, datasets, columns, fixedColumns, "highlightChangedColumns");
    } else if (fileName === 'engraving') {
        selector = "#datatables";
        datasets = structuredClone(datasetEngraving);
        columns = structuredClone(engravingColumn);
        fixedColumns = 1;
        initializeTable(selector, datasets, columns, fixedColumns, "none");
    }
}

// DataTable 초기화 함수 수정
function initializeTable(selector, data, columns, fixedColumns, createdRowCallbackName) {
    let options = {
        data: data,
        columns: columns,
        "pageLength": -1,
        "order": [],
        "dom": 'rt',
        "scrollX": true,
        "scrollY": shouldScrollY(selector) ? '80vh' : false,
        "autoWidth": false,
        "responsive": true,
        "fixedColumns": {
            leftColumns: fixedColumns
        },
        "rowCallback": function(row, data, dataIndex) {
            if (createdRowCallbackName === "highlightChangedColumns") {
                highlightChangedColumns(row, data, dataIndex);
            } else if (createdRowCallbackName === "addTierClass") {
                addTierClass(row, data, dataIndex);
            }
        },
        "headerCallback": function(thead, data, start, end, display) {
            $(thead).find('th').css('text-align', 'center');
        }
    };

    $(selector).DataTable(options).columns.adjust();
}

function shouldScrollY(selector) {
    const table = $(selector);
    const tableHeight = table.height();
    const maxHeight = 0.8 * window.innerHeight; // 80% of the viewport height
    return tableHeight > maxHeight;
}

// 스킬, 사역마의 색상을 변경
function addTierClass(row, data, dataIndex) {
    if (data.tiers) {
        $('td:eq(0)', row).addClass('tier-' + data.tiers);
    }
}

function highlightChangedColumns(row, data, dataIndex) {
    var currentRowData = Array.isArray(data) ? data : Object.values(data);

    if (previousRowData) {
        currentRowData.forEach((cellData, index) => {
            if (index > 0 && cellData !== previousRowData[index]) {
                $('td:eq(' + index + ')', row).addClass('changeColumn');
            }
        });
    }

        previousRowData = currentRowData.slice(); // 현재 행 데이터를 전역 변수에 저장
}