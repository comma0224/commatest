$(document).ready(function () {
    // 초기 데이터 가져오기
    fetchSubSectionData($('.subSection').first().data('key'));

    // 각 subSection에 클릭 이벤트 리스너 추가
    $('.subSection').click(function () {
        var subSectionKey = $(this).data('key');
        var subSectionUrl = $(this).data('url');

        $('.subSection[data-active="true"]').attr('data-active', 'false');
        $(this).attr('data-active', 'true');

        if (subSectionUrl) {
            fetchContentData('/add-on/' + subSectionUrl);
        } else {
            fetchSubSectionData(subSectionKey);
        }
    });

    $('.isFavorite').click(function () {
        // 클릭된 SVG 확인
        var isFavorite = $(this).hasClass('bi-star-fill');
        var sectionKey = $('#sectionKey').val();

        if (isFavorite) {
            updateFavoriteStatus(sectionKey, isFavorite);
        } else {
            sendAjax("/checkLogin", {})
                .then(response => {
                    if (response) {
                        updateFavoriteStatus(sectionKey, isFavorite);
                    } else {
                        navigateToPageWithAlert('user-login', "로그인이 필요한 서비스입니다.");
                    }
                });
        }
    });

    // .post 클릭 이벤트 리스너 추가
    $('#posts').on('click', '.post', function () {
        var postKey = $(this).data('key');
        fetchPostDetail(postKey);
    });
});

/**
 * subSection 데이터 가져오기
 * @param {number} subSectionKey - 서브 섹션 키
 * 작성자: LeeSunJae
 */
function fetchSubSectionData(subSectionKey) {
    var data = {
        subSectionKey: subSectionKey
    };
    sendAjax('/subSectionData', data)
        .then(response => {
            fetchSubSectionTags(response.subSectionTags);
            fetchPosts(response.postsWithLikes);
            createPagination(response.totalPages);
            $('.page-btn[data-page="1"]').addClass('active').siblings().removeClass('active');
            $('#newPost').show();
            $('#subSectionTags').show();
            $('#pages').show();
            $('#subSectionKey').val(subSectionKey);
        });
}

/**
 * 콘텐츠 데이터 가져오기
 * @param {string} subSectionUrl - 서브 섹션 URL
 * 작성자: LeeSunJae
 */
function fetchContentData(subSectionUrl) {
    var data = {
        sectionKey: $('#sectionKey').val(),
        subSectionKey: $('#subSectionKey').val()
    };
    sendAjax(subSectionUrl, data)
        .then(response => {
            $('#newPost').hide();
            $('#subSectionTags').hide();
            $('#pages').hide();
            $('#posts').html(response);
        });
}

/**
 * subSectionTag 데이터와 좋아요가 포함된 게시글 가져오기
 * 작성자: LeeSunJae
 */
function fetchSubSectionTagData() {
    var subSectionKey = $('#subSectionKey').val();
    var subSectionTagKey = $(this).data('key');
    $('.subSectionTag[data-active="true"]').attr('data-active', 'false');
    $(this).attr('data-active', 'true');

    var data = {
        subSectionKey: subSectionKey,
        subSectionTagKey: subSectionTagKey
    };
    sendAjax('/subSectionTagData', data)
        .then(response => {
            fetchPosts(response.postsWithLikes);
            createPagination(response.totalPages);
        });
}

/**
 * 게시글 데이터 가져오기
 * @param {number} page - 페이지 번호
 * 작성자: LeeSunJae
 */
function fetchPostData(page) {
    $('.page-btn[data-page=' + page + ']').addClass('active').siblings().removeClass('active');
    var subSectionKey = $('#subSectionKey').val();
    var subSectionTagKey = $('.subSectionTag[data-active="true"]').data('key');
    var data = {
        subSectionKey: subSectionKey,
        subSectionTagKey: subSectionTagKey,
        page: page
    };
    sendAjax('/postData', data)
        .then(response => {
            fetchPosts(response.postsWithLikes);
        });
}

/**
 * subSectionTag 목록 업데이트
 * @param {Array} subSectionTags - 서브 섹션 태그 목록
 * 작성자: LeeSunJae
 */
function fetchSubSectionTags(subSectionTags) {
    var div = $('#subSectionTags');
    div.empty();

    if (subSectionTags.length > 1) {
        var allSpan = $('<span class="badge subSectionTag m-1"></span>');
        allSpan.text("전체");
        allSpan.attr('data-key', '0');
        allSpan.click(fetchSubSectionTagData);
        div.append(allSpan);
    }

    subSectionTags.forEach(function (tag) {
        var tagSpan = $('<span class="badge subSectionTag m-1"></span>');
        tagSpan.text(tag.title);
        tagSpan.attr('data-key', tag.subSectionTagKey);
        tagSpan.click(fetchSubSectionTagData);
        div.append(tagSpan);
    });

    $('.subSectionTag').first().attr('data-active', 'true');
}

/**
 * 게시글 목록 업데이트
 * @param {Array} postsWithLikes - 좋아요가 포함된 게시글 목록
 * 작성자: LeeSunJae
 */
function fetchPosts(postsWithLikes) {
    $('#posts').empty();
    postsWithLikes.forEach(function (post) {
        var div = $('<div class="post row align-items-center small"></div>');
        div.attr('data-key', post.postKey);

        var div1 = $('<div class="col-md-1 text-center"></div>');
        div1.text(post.likeCount);

        var div2 = $('<div class="col-md-10"></div>');
        var div2_1 = $('<div></div>');
        var div2_2 = $('<div></div>');
        div2_1.text(post.title + " [" + post.commentCount + "]");
        div2_2.text(post.subSectionTag + " " + formatPostDate(post.createdAt) + " " + post.nickname);
        div2.append(div2_1).append(div2_2);

        var div3 = $('<div class="col-md-1 text-center"></div>');
        div3.text(" [" + post.views + "]");

        div.append(div1).append(div2).append(div3);
        div.append('<hr class="m-0">');
        $('#posts').append(div);
    });
}

/**
 * 페이지네이션 생성
 * @param {number} totalPages - 총 페이지 수
 * 작성자: LeeSunJae
 */
var currentPageGroup = 0;
function createPagination(totalPages) {
    var pagesDiv = $('#pages');
    pagesDiv.empty();

    var startPage = currentPageGroup * 10 + 1;
    var endPage = Math.min(startPage + 9, totalPages);

    var prevButton = $('<button class="page-btn">\< 이전</button>');
    if (currentPageGroup > 0) {
        prevButton.click(function () {
            currentPageGroup--;
            createPagination(totalPages);
        });
    }
    pagesDiv.append(prevButton);

    for (var i = startPage; i <= endPage; i++) {
        var pageButton = $('<button class="page-btn"></button>');
        pageButton.text(i);
        pageButton.attr('data-page', i);
        pageButton.click(function () {
            var page = $(this).data('page');
            fetchPostData(page);
        });
        pagesDiv.append(pageButton);
    }

    var nextButton = $('<button class="page-btn">다음 ></button>');
    if (currentPageGroup < Math.floor(totalPages / 10)) {
        nextButton.click(function () {
            currentPageGroup++;
            createPagination(totalPages);
        });
    }
    pagesDiv.append(nextButton);
}

/**
 * 즐겨찾기 상태 업데이트
 * @param {number} sectionKey - 섹션 키
 * @param {boolean} isFavorite - 즐겨찾기 여부
 * 작성자: LeeSunJae
 */
function updateFavoriteStatus(sectionKey, isFavorite) {
    var data = {
        sectionKey: sectionKey,
        isFavorite: isFavorite
    };

    sendAjax('/updateFavoriteStatus', data)
        .then(response => {
            if (response.status) {
                $('.isFavorite').toggleClass('bi-star-fill bi-star');
            } else {
                errorBox(response.message);
            }
        });
}

/**
 * 새 게시글 작성
 * 작성자: LeeSunJae
 */
function newPost() {
    sendAjax("/checkLogin", {})
        .then(response => {
            if (response) {
                fetchContentData('/new-post');
            } else {
                navigateToPageWithAlert('user-login', "로그인이 필요한 서비스입니다.");
            }
        });
}

/**
 * 게시글 날짜 형식화
 * @param {string} postDateStr - 게시글 날짜 문자열
 * @returns {string} 형식화된 날짜 문자열
 * 작성자: LeeSunJae
 */
function formatPostDate(postDateStr) {
    const postDate = new Date(postDateStr);
    const now = new Date();
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) {
        return `${diffMins}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else {
        return postDate.toISOString().split('T')[0];
    }
}

/**
 * 게시글 상세 데이터 가져오기
 * @param {number} postKey - 게시글 키
 * 작성자: LeeSunJae
 */
function fetchPostDetail(postKey) {
    var data = {
        postKey: postKey
    };
    sendAjax('/post-detail', data)
        .then(response => {
            $('#newPost').hide();
            $('#subSectionTags').hide();
            $('#pages').hide();
            $('#posts').html(response);
        });
}