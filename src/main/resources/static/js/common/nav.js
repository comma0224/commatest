$(document).ready(function () {

    initializeCategories(dynamicCategories);

    const $toggler = $('.navbar-toggler');
    const $offcanvas = $('.offcanvas');
    const $offcanvasBackdrop = $('.offcanvas-backdrop');
    const $closeButton = $offcanvas.find('.btn-close');

    $toggler.on('click', function () {
        $offcanvas.toggleClass('show');
        $offcanvasBackdrop.toggleClass('show');
    });

    $closeButton.on('click', function () {
        $offcanvas.removeClass('show');
        $offcanvasBackdrop.toggleClass('show');
    });

    $offcanvasBackdrop.on('click', function () {
        $offcanvas.removeClass('show');
        $offcanvasBackdrop.toggleClass('show');
    });
});

// nav 메뉴 생성
function dynamicCategories(categoriesList) {
    var container = $('#dynamicCategories');
    container.empty(); // 기존 내용을 지웁니다.
    var mainCategorys = [...new Set(categoriesList.map(item => item.mainCategory))];

    mainCategorys.forEach(function (mainCategory) {
        var mainCategoryItem = $('<li class="nav-item"></li>');
        mainCategoryItem.click(function () {
            $(this).find('.dropdown-menu').toggleClass('show');
        });
        var main = $('<div class="nav-main"></div>');
        var title = $('<div class="nav-title"></div>');
        title.text(mainCategory);
        var list = $('<div class="nav-list"></div>');

        var ul = $('<ul class="dropdown-menu"></ul>');

        categoriesList.filter(item => item.mainCategory === mainCategory).forEach(function (item) {
            var subCategoryItem = $('<li class="dropdown-item">' + item.subCategory + '</li>');
            subCategoryItem.click(function () {
                navigateToPage(item.slug);
            });
            ul.append(subCategoryItem);
        });
        main.append(title).append(list);
        mainCategoryItem.append(main).append(ul);
        container.append(mainCategoryItem);
    });
}