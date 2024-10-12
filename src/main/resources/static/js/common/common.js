$(document).ready(function () {
    const message = localStorage.getItem('alertMessage');
    if (message) {
        alertBox(message);
        localStorage.removeItem('alertMessage');
    }


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



// 공통 createBox 생성 함수
function createBox(message, type) {
    // div 요소를 생성하고 클래스와 텍스트를 설정합니다.
    var box = $('<div></div>').addClass('alert alert-' + type).text(message);

    // 닫기 버튼을 생성하고 클래스와 내용을 설정합니다.
    var closeButton = $('<button></button>').addClass('close-btn').html('&times;');

    // 닫기 버튼 클릭 시 실행될 함수입니다.
    closeButton.on('click', function() {
        box.css('opacity', '0');
        setTimeout(function() {
            box.remove();
        }, 500);
    });

    // 닫기 버튼을 box에 추가합니다.
    box.append(closeButton);

    // box를 alert-container에 추가합니다.
    $('#alert-container').append(box);

    // 3초 후에 box를 자동으로 닫습니다.
    setTimeout(function() {
        box.css('opacity', '0');
        setTimeout(function() {
            box.remove();
        }, 500);
    }, 3000);
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

function logout() {
    sendAjax('/logout', {})
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