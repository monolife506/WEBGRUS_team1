글 작성하기
=========

## 1. 댓글 작성하기

`POST /api/posts/:postid/comments`

댓글을 작성할 때에는 다음과 같은 json 형식으로 정보를 전송한다.
댓글 작성을 위해서는 계정이 필요하므로, 헤더에 발급받은 jwt 토큰을 포함해야 한다.

```
{
    "content": "Placeholder" // 댓글의 내용
}
```

## 2. 댓글 열람하기

`GET /api/posts/:postid/comments`

다음 api로 특정 글에 대한 댓글들의 정보를 확인할 수 있다.

```
[
    {
        "_id": "6014f5ace5c4dd2670604220",
        "post_id": "6014f587e5c4dd267060421c",
        "owner": "sampleid", // 댓글 작성자
        "content": "ㅋㅋ", // 댓글 내용
        "posttime": "2021-01-30T05:59:08.258Z", // 댓글 작성 시간
        "modifytime": "2021-01-30T05:59:08.258Z", // 댓글 수정 시간
        "__v": 0
    },
    {
        "_id": "6014f5a9e5c4dd267060421f",
        "post_id": "6014f587e5c4dd267060421c",
        "owner": "sampleid",
        "content": "응애",
        "posttime": "2021-01-30T05:59:05.220Z",
        "modifytime": "2021-01-30T05:59:05.220Z",
        "__v": 0
    },
    {
        "_id": "6014f5a3e5c4dd267060421e",
        "post_id": "6014f587e5c4dd267060421c",
        "owner": "sampleid",
        "content": "댓글이에요",
        "posttime": "2021-01-30T05:58:59.303Z",
        "modifytime": "2021-01-30T05:58:59.303Z",
        "__v": 0
    }
]
```

## 3. 댓글 수정하기

`PUT /api/posts/:postid/comments/:commentid`

위 uri로 댓글의 description (내용)을 수정한다. modifytime은 자동으로 갱신된다.
수정할 내용을 댓글을 작성할 때와 같은 json의 형태로 전송하면 된다.
이때 jwt 토큰으로 현재 유저와 글의 작성자가 같은지 확인하는 과정을 거친다.

## 4. 글 삭제하기 

`DELETE /api/posts/:postid/comments/:commentid`

위 uri로 특정 댓글을 지운다.
jwt 토큰으로 댓글의 글쓴이와 현재 로그인된 유저가 같은지 확인한다.
