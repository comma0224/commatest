$(document).ready(function () {
    const message = localStorage.getItem('alertMessage');
    if (message) {
        alertBox(message);
        localStorage.removeItem('alertMessage');
    }
    initializeCategories(dynamicCategories);

    // WebSocket connection
    var socket = new WebSocket('ws://localhost/category-updates');

    socket.onmessage = function (event) {
        if (event.data === 'Categories updated') {
            clearCachedCategories();
            initializeCategories(dynamicCategories);
        }
    };
});

// 페이지 이동
function navigateToPage(name) {
    window.location.href = '/' + name;
}

// nav 메뉴 생성
function dynamicCategories(categoriesList) {
    var container = $('#dynamicCategories');
    container.empty(); // 기존 내용을 지웁니다.
    var mainCategorys = [...new Set(categoriesList.map(item => item.mainCategory))];

    mainCategorys.forEach(function (mainCategory) {
        var mainCategoryItem = $('<li class="nav-item dropdown"></li>');
        var a = $('<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>');
        a.text(mainCategory);
        var ul = $('<ul class="dropdown-menu"></ul>');

        categoriesList.filter(item => item.mainCategory === mainCategory).forEach(function (item) {
            var subCategoryItem = $('<li><a class="dropdown-item" href="#" onclick="navigateToPage(\'' + item.slug + '\')">' + item.subCategory + '</a></li>');
            ul.append(subCategoryItem);
        });

        mainCategoryItem.append(a);
        mainCategoryItem.append(ul);
        container.append(mainCategoryItem);
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

function clearCachedCategories() {
    localStorage.removeItem('categoriesList');
}

function userLogout() {
    sendAjax('/user-logout', {})
        .then(response => {
            if (response.status) {
                clearCachedCategories();
                navigateToPageWithAlert('', response.message);
            } else {
                errorBox(response.message);
            }
        })
        .catch(error => {
            errorBox(error.message);
        });
}

function initializeCategories(callback) {
    var categoriesList = JSON.parse(localStorage.getItem('categoriesList'));
    var localStorageMemberLevel = localStorage.getItem('memberLevel');

    sendAjax('/checkMemberLevel',{})
        .then(response => {
            var memberLevel = response.memberLevel;

            if (!categoriesList || localStorageMemberLevel !== memberLevel) {
                sendAjax('/categories', {})
                    .then(function (response) {
                        localStorage.setItem('categoriesList', JSON.stringify(response));
                        localStorage.setItem('memberLevel', memberLevel);
                        callback(response);
                    });
            } else {
                callback(categoriesList);
            }
        })
}