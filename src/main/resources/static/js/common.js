$(document).ready(function () {
    $('#reactionTest').click(function () {
        window.location.href = '/reaction-test';
    });
    indexPageMenu();
    dynamicMenu();
});

// index 화면 메뉴 생성
function indexPageMenu() {
    var container = $('.menuList');
    container.empty(); // 기존 내용을 지웁니다.

    $.each(datasetMenu, function(index, item) {
        var div = $('<div></div>');
        div.addClass('box rounded-3');
        div.attr('id', item.id);
        div.click(function() {
            navigateToPage(item.id);
        });

        var h3 = $('<h3></h3>');
        h3.text(item.mainMenu);
        div.append(h3);

        div.html(item.subMenu);
        container.append(div);
    });
}

// 페이지 이동
function navigateToPage(name) {
    window.location.href = '/' + name;
}

// nav 메뉴 생성
function dynamicMenu() {
    var dropdown = $('#dynamicMenu');
    var mainMenus = [...new Set(datasetMenu.map(item => item.mainMenu))];

    mainMenus.forEach(function (mainMenu) {
        var mainMenuItem = $('<li class="nav-item dropdown"></li>');
        var a = $('<a class="nav-link dropdown-toggle" href="#" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></a>');
        a.text(mainMenu);
        var ul = $('<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton"></ul>');

        datasetMenu.filter(item => item.mainMenu === mainMenu).forEach(function (item) {
            //var subMenuItem = $('<li><a class="dropdown-item" href="#">' + item.subMenu + '</a></li>');
            //var subMenuItem = $('<li><a class="dropdown-item" href="/' + item.subMenu + '">' + item.subMenu + '</a></li>');
            var subMenuItem = $('<li><a class="dropdown-item" href="#" onclick="navigateToPage(\'' + item.id + '\')">' + item.subMenu + '</a></li>');
            ul.append(subMenuItem);
        });

        mainMenuItem.append(a);
        mainMenuItem.append(ul);
        dropdown.append(mainMenuItem);
    });
}