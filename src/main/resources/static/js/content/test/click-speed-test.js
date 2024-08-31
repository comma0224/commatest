let clickCount = 0;
let timeout;

function showDefaultScreen() {
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('default-screen user-select-none').html(`
            <div class="strong">테스트를 시작하시려면 클릭하세요.</div>
            <div class="small">배경 화면이 초록색에서 보라색으로 변할때 클릭하시면 됩니다.</div>
    `);
    $('#testResultContainer').html('');
}

function showReadyScreen() {
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('ready-screen user-select-none').html(`
            <div class="strong">준비</div>
            <div class="small">3초 뒤 시작합니다. 화면이 파란색이 되면 클릭해주세요.</div>
    `);
    setTimeout(showTestScreen, 3000);
}

function showTestScreen() {
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('test-screen user-select-none').html(`
            <div class="strong">클릭</div>
            <div class="small">클릭해주세요. 테스트는 5초간 진행 됩니다.</div>
    `);
    clickCount = 0;
    timeout = setTimeout(showResultScreen, 5000);
}

function showResultScreen() {
    // MariaDB에 저장하는 AJAX 호출 (생략)
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('result-screen user-select-none').html(`
            <div class="strong">클릭 횟수: ${clickCount} 번</div>
            <div class="small">상위 N% 입니다.</div>
    `);
    $('#testResultContainer').html(`
            <button id="retryButton" class="btn btn-primary">테스트 다시하기</button>
    `);

    $('#retryButton').click(function () {
        clickCount = 0;
        showDefaultScreen();
    });
}

function updateClickCount() {
    $('#testResultContainer').html(`
        <div class="small">
            현재 클릭 횟수 : ${clickCount}
        </div>
    `);
}

$(document).ready(function () {
    $('#testContainer').click(function () {
        const bgColorClass = $(this).attr('class');

        if (bgColorClass.includes('default-screen')) {
            showReadyScreen();
        } else if (bgColorClass.includes('test-screen')) {
            clickCount++;
            updateClickCount();
        }
    });
});