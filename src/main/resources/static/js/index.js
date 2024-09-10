$(document).ready(function () {
    initializeCategories(indexCategories);

});
// index 화면 메뉴 생성
function indexCategories(categoriesList) {
    var container = $('#indexPageMenu');
    container.empty(); // 기존 내용을 지웁니다.

    $.each(categoriesList, function (index, item) {
        var divCol = $('<div class="col my-3"></div>');
        var divCard = $('<div class="card text-center shadow-sm" role=button></div>');
        var divBody = $('<div class="card-body"></div>');
        var h6 = $('<h6 class="card-title m-2 setMenuSize flex-center"></h6>');

        divCard.click(function () {
            navigateToPage(item.slug);
        });

        h6.text(item.subCategory);

        divBody.append(h6);
        divCard.append(divBody);
        divCol.append(divCard);

        container.append(divCol);
    });
}