/*
page.utils.js
글과 댓글 pagination을 위한 함수들
*/

// 글의 pagination을 위한 함수
function pagePosts(page, totalCnt) {
    const postCnt = 10; // 한 페이지에 표시되는 글들의 개수
    const curPage = (page) ? parseInt(page) : 1; // 현재 페이지
    const pageCnt = Math.ceil(totalCnt / postCnt); // 모든 페이지의 개수
    const skipCnt = (curPage - 1) * postCnt; // 넘길 글들의 수

    return { postCnt, curPage, pageCnt, skipCnt };
}

// post의 sort 조건들
const sortModes = {
    times: { posttime: -1 },
    views: { viewcnt: -1 },
    likes: { likecnt: -1 }
}

function pageComments() {

}

const sortComments = {

}

module.exports.pagePosts = pagePosts;
module.exports.sortModes = sortModes;