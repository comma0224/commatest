let testCount = 1;
let reactionTimes = [];
let startTime;
let timeout;

function showDefaultScreen() {
    console.log('showDefaultScreen');
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('default-screen').html(`
            <div class="strong">테스트를 시작하시려면 클릭하세요.</div>
            <div class="small">배경 화면이 초록색에서 파란색으로 변할때 클릭하시면 됩니다.</div>
    `);
    $('#testResultContainer').html('');
}

function showReadyScreen() {
    console.log('showReadyScreen');
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('ready-screen').html(`
            <div class="strong">준비</div>
            <div class="small">배경화면이 파란색이 되면 클릭해주세요. </div>
    `);
    $('#testResultContainer').html(`
            <div class="small">
            현재 테스트 : ${testCount}/5 <br>
            반응 시간 : ${reactionTimes.length > 0 ? reactionTimes.join(', ') + ' ms' : '없음'}
            </div>
    `);
    timeout = setTimeout(showTestScreen, Math.random() * 3000 + 2000);
}

function showTestScreen() {
    console.log('showTestScreen');
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('test-screen').html(`
            <div class="strong">클릭</div>
            <div class="small">클릭해주세요</div>
    `);
    startTime = new Date().getTime();
}

function showErrorScreen() {
    console.log('showErrorScreen');
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('error-screen').html(`
            <div class="strong">잘못 클릭 하셨습니다.</div>
            <div class="small">배경화면이 파랑색이 되면 클릭해주세요.</div>
    `);
}

function showResultScreen() {
    console.log('showResultScreen');
    // MariaDB에 저장하는 AJAX 호출 (생략)
    const averageTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    $('#testContainer').removeClass().addClass('test-container');
    $('#testContainer').addClass('result-screen').html(`
            <div class="strong">평균 반응 시간: ${averageTime} ms</div>
            <div class="small">상위 N% 입니다.</div>
    `);
    $('#testResultContainer').html(`
            <button id="retryButton" class="btn-purple">테스트 다시하기</button>
    `);


    $('#retryButton').click(function () {
        testCount = 1;
        reactionTimes = [];
        showDefaultScreen();
    });
}

$(document).ready(function () {

    $('#testContainer').click(function () {
        const currentTime = new Date().getTime();
        const bgColorClass = $(this).attr('class');

        if (bgColorClass.includes('default-screen')) {
            showReadyScreen();
        } else if (bgColorClass.includes('ready-screen')) {
            clearTimeout(timeout);
            showErrorScreen();
        } else if (bgColorClass.includes('test-screen')) {
            const reactionTime = currentTime - startTime;
            reactionTimes.push(reactionTime);
            testCount++;
            if (testCount <= 5) {
                showReadyScreen();
            } else {
                showResultScreen();
            }
        } else if (bgColorClass.includes('error-screen')) {
            clearTimeout(timeout);
            testCount = 1;
            reactionTimes = [];
            showDefaultScreen();
        }
    });
});