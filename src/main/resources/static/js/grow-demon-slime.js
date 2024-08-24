$(document).ready(function() {
    // 현재 HTML 파일 이름을 가져옵니다.
    var fileName = window.location.pathname.split('/').pop();

    // 파일 이름을 "-" 문자로 분할합니다.
    var parts = fileName.split('-');

    // 첫 번째 부분을 data로, 두 번째 부분을 pageKey로 사용합니다.
    var data = parts[0];
    var pageKey = parts[1].split('.')[0]; // 파일 확장자를 제거합니다.

    // DataTable을 초기화합니다.
    initializeDataTable(data, pageKey);
});


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
        $('#header-row').append('<th>' + i + '</th>');
        column.push({
            data: null,    title: i.toString(),    render: renderFunction(i)
        });
    }
    return column;
}

//DataTable 생성
function initializeDataTable(data, pageKey) {
    var dataSets;
    var dataSets1;
    var dataSets2;

    var columns;
    var fixedColumns;

    if (data === "skill") {
        dataSets = dataSetSkill;
        dataSets.push({ name: "메테오(붉은 공명석)", default: "2472", growth: "25.84", hits: "6", cool: "8", tiers: "6", key: "6c", value:"8", use: 0});
        dataSets.push({ name: "고드름(인어의 눈물)", default: "280", growth: "1.50", hits: "7", cool: "8", tiers: "3", key: "3a", value:"100", use: 0});
        dataSets.push({ name: "에너지 볼(푸른 공명석 1렙)", default: "590", growth: "3.70", hits: "1", cool: "7", tiers: "2", key: "2c", value:"100", use: 0});

        dataSets.sort(function(a, b) {
            return a.tiers - b.tiers;
        });

    } else if(data === "familiar") {
        dataSets = dataSetFamiliar;
    }

    if (pageKey === 'dps') {
        fixedColumns = 6;
        columns = updateColumnsVisibility(column, pageKey);
    }else if(pageKey === 'damage') {
        fixedColumns = 4;
        columns = updateColumnsVisibility(column, pageKey);
    }else if (pageKey === 'efficiency') {
        fixedColumns = 1;
        dataSets = dataSetCoolDown;
        columns = efficiencyColumn;
    }else {
        fixedColumns = 1;
        dataSets1 = hitsIn20Sec;
        dataSets2 = hitsIn30Sec;
        columns = stageColumn;

        var previousRowData1 = null;
        var previousRowData2 = null;

        $('#datatables1').DataTable({
            data: dataSets1,
            columns: columns,
            "pageLength": -1,
            "order": [],
            "dom": 'rt',
            "scrollX": true,
            "scrollY": '80vh',
            "autoWidth": false,
            "responsive": true,
            "fixedColumns": {
                leftColumns: fixedColumns
            },
            "createdRow": function(row, data, dataIndex) {
                var currentRowData = Array.isArray(data) ? data : Object.values(data);
                if (previousRowData1) {
                    currentRowData.forEach((cellData, index) => {
                        if (index > 0 && cellData !== previousRowData1[index]) {
                            $('td:eq(' + index + ')', row).addClass('changeColumn');
                        }
                    });
                }
                previousRowData1 = currentRowData.slice(); // Create a copy of the current row data
            }
        }).columns.adjust();

        $('#datatables2').DataTable({
            data: dataSets2,
            columns: columns,
            "pageLength": -1,
            "order": [],
            "dom": 'rt',
            "scrollX": true,
            "scrollY": '80vh',
            "autoWidth": false,
            "responsive": true,
            "fixedColumns": {
                leftColumns: fixedColumns
            },
            "createdRow": function(row, data, dataIndex) {
                var currentRowData = Array.isArray(data) ? data : Object.values(data);
                if (previousRowData2) {
                    currentRowData.forEach((cellData, index) => {
                        if (index > 0 && cellData !== previousRowData2[index]) {
                            $('td:eq(' + index + ')', row).addClass('changeColumn');
                        }
                    });
                }
                previousRowData2 = currentRowData.slice(); // Create a copy of the current row data
            }
        }).columns.adjust();

        return;
    }

    $('#datatables').DataTable({
        data: dataSets,columns: columns,"pageLength": -1,"order": [],"dom": 'rt',"scrollX": true,"scrollY": '80vh', // DataTable의 높이를 80vh로 설정
        "autoWidth": false,"responsive": true,"fixedColumns": {
            leftColumns: fixedColumns
        },"createdRow": function(row, data, dataIndex) {
            if (data.tiers) {
                $('td:eq(0)', row).addClass('tier-' + data.tiers);
            }
        }
    }).columns.adjust();
}