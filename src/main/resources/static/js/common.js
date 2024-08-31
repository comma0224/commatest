$(document).ready(function () {

    const message = localStorage.getItem('alertMessage');
    if (message) {
        alertBox(message);
        localStorage.removeItem('alertMessage');
    }

    indexPageMenu();
    dynamicMenu();
});

// index 화면 메뉴 생성
function indexPageMenu() {
    var container = $('#indexPageMenu');
    container.empty(); // 기존 내용을 지웁니다.

    $.each(datasetMenu, function (index, item) {
        var divCol = $('<div class="col my-3"></div>');
        var divCard = $('<div class="card text-center shadow-sm" role=button></div>');
        var divBody = $('<div class="card-body"></div>');
        var h6 = $('<h6 class="card-title m-2 setMenuSize flex-center"></h6>');

        divCard.click(function () {
            navigateToPage(item.id);
        });

        h6.text(item.subMenu);

        divBody.append(h6);
        divCard.append(divBody);
        divCol.append(divCard);

        container.append(divCol);
    });
}

// 페이지 이동
function navigateToPage(name) {
    window.location.href = '/' + name;
}

// nav 메뉴 생성
function dynamicMenu() {
    var appendMenu = $('#dynamicMenu');
    var mainMenus = [...new Set(datasetMenu.map(item => item.mainMenu))];

    mainMenus.forEach(function (mainMenu) {
        var mainMenuItem = $('<li class="nav-item dropdown"></li>');
        var a = $('<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>');
        a.text(mainMenu);
        var ul = $('<ul class="dropdown-menu"></ul>');

        datasetMenu.filter(item => item.mainMenu === mainMenu).forEach(function (item) {
            var subMenuItem = $('<li><a class="dropdown-item" href="#" onclick="navigateToPage(\'' + item.id + '\')">' + item.subMenu + '</a></li>');
            ul.append(subMenuItem);
        });

        mainMenuItem.append(a);
        mainMenuItem.append(ul);
        appendMenu.append(mainMenuItem);
    });
}

// 공통 createBox 생성 함수
function createBox(message, type) {
    var box = $('<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert"></div>').text(message);
    box.append('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>');
    $('#alert-container').append(box); // 컨테이너에 추가
    setTimeout(function() {
        box.alert('close');
    }, 3000); // 3초 후 자동으로 사라짐
}

// alertBox 생성 함수
function alertBox(message) {
    createBox(message, 'success');
}

// errorBox 생성 함수
function errorBox(message) {
    createBox(message, 'danger');
}

// infoBox 생성 함수
function infoBox(message) {
    createBox(message, 'info');
}

// warningBox 생성 함수
function warningBox(message) {
    createBox(message, 'warning');
}

// 쿠키 생성
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// 쿠키 가져오기
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
//Ajax 통신
function sendAjax(url, data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(response) {
                resolve(response); // 요청이 성공하면 resolve 호출
            },
            error: function(xhr, status, error) {
                reject(new Error("An error occurred: " + error)); // 요청이 실패하면 reject 호출
            }
        });
    });
}

function navigateToPageWithAlert(name, message) {
    localStorage.setItem('alertMessage', message);
    window.location.href = '/' + name;
}