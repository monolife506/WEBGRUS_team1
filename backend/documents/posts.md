글 작성하기
=========

## 글 작성하기

`POST /api/posts`

글을 작성할 때에는 FormData의 형태로 다음과 같은 정보를 필수적으로 다음 uri로 전송해야 한다.
또한 글 작성을 위해서는 계정이 필요하므로, 헤더에 발급받은 jwt 토큰을 포함해야 한다.

1. title: 글의 제목
2. photos: 글에 포함될 사진들의 파일 (여러개 선택 가능)

다음 정보들은 추가적으로 포함할 수 있다.

1. description: 글에 대한 설명
2. tags: 글을 찾을 때 사용할 태그, array 형태로 나타낸다.

저장된 사진들은 backend 프로젝트의 `public/images` 폴더에 무작위적인 제목으로 저장된다.
이때 사진에 대한 접근은 `GET /images/:filename`으로 접근할 수 있다.
그리고 DB상에는 다음과 같은 형식으로 글이 저장된다.

```
{
    _id: ObjectId('5feb24d71aa82f91c36a4c4c'),
    description: '', // 설명
    tags: [], // 태그
    viewcnt: 0, // 열람 횟수
    likecnt: 0, // 좋아요 횟수 
    commentcnt: 0, // 댓글 횟수 
    isDeleted: false, // 이 글이 삭제된 상태인지 확인
    title: 'hi!', // 제목

    // 포함된 파일들의 정보가 담긴 array
    files: [
        {
            _id: ObjectId('5feb24d71aa82f91c36a4c4d'),
            originalname: '19119_en_1.jpg', // 파일을 업로드할 때의 본래 이름
            filename: 'b702c63677332908d348357d7fffd243' // 서버에 저장된 파일명
        },
        {
            _id: ObjectId('5feb24d71aa82f91c36a4c4e'),
            originalname: '19950_en_1.jpg',
            filename: '0ffa6a4be48765bf1cdd11715be6205c'
        }
    ],
    owner: 'testid', // 작성자, 현재 토큰을 발급한 유저명이 나타난다.
    posttime: ISODate('2020-12-29T12:45:11.555Z'), // 작성 시간, 자동으로 수정된다.
    modifytime: ISODate('2020-12-29T12:45:11.556Z'), // 수정 시간, 자동으로 수정된다.
    comments: [], // 댓글들의 정보가 담긴 배열
    __v: 0
}
```

## 글 열람하기

`GET /api/posts/content/:postid`
이 api는 글 하나의 정보를 표시한다. 만약 로그인된 상태인 경우 글의 조회수가 갱신된다.

이때 여러개의 글을 return하는 GET api들은 다음과 같은 param 항목을 가질 수 있다.
page: 현재 보여주는 페이지, 한 페이지는 글을 10개 표시 (maxPost), 첫 페이지는 page=1이다. 기본값은 1이며, 존재하지 않는 페이지를 나타내는 경우 오류를 return한다. 
추가로, page=0인 경우 페이지를 무시하고 모든 글들의 정보를 return한다.

sortby: 정렬 기준으로, 이에 따라 여러개의 글을 정렬하여 표시한다.
- `sortby=times`: 가장 최근에 만들어진 글부터 정렬 (기본값)
- `sortby=views`: 조회수가 가장 많은 글부터 정렬
- `sortby=likes`: 좋아요 수가 가장 많은 글부터 정렬

여러개의 글들을 표시하는 api는 다음과 같다.
`GET /api/posts/users/{userid}` : 작성자가 `{userid}`인 유저가 작성한 글 표시
`GET /api/posts/favorites/{userid}` : `{userid}`가 좋아요 표시한 모든 글 표시
`GET /api/posts/all` : 모든 글의 정보 표시
`GET /api/posts/search/:query`: 위 uri로 query를 포함하는 글들의 정보 표시 (검색)

이때 `GET /api/posts/search/:query`의 경우, URI의 mode라는 param으로 검색의 조건을 결정한다. (GET FORM의 mode)
mode가 아래의 4가지 중 하나로 명시되지 않은 경우, `mode=title`로 간주한다.

- `mode=title` : 제목에 따른 검색
- `mode=content` : 내용에 따른 검색
- `mode=all` : 제목과 내용에 따른 검색
- `mode=owner` : 글 작성자에 따른 검색 
- `mode=tags` : 태그에 따른 검색

## 글 수정하기

`PUT /api/posts/:postid`

위 uri로 글의 title, description, photos, tag를 수정한다. modifytime은 자동으로 갱신된다.
이때 jwt 토큰으로 현재 유저와 글의 작성자가 같은지 확인하는 과정을 거친다.

나머지 정보는 글을 작성할 때와 같이 FormData의 형식으로 동일하게 하면 되지만, 지워지는 파일에 대해서는 그 파일의 filename들이 담긴 array `deletedFiles`를 FormData로 전달해 주어야 한다.

## 글 삭제하기 

`DELETE /api/posts/:postid`

위 uri로 특정 글을 지운다.
파일도 자동으로 모두 지워진다.
jwt 토큰으로 글의 주인과 현재 로그인된 유저가 같은지 확인한다.

## 글에 좋아요 표시하기

`PUT /api/users/favorites/:postid`: id가 `postid`인 글에 좋아요 토글
`GET /api/users/favorites/:postid`: id가 `postid`인 글의 좋아요 여부 확인
유저를 팔로잉하는 api와 사용법은 동일하다. 다만 `GET /api/users/favorites/:postid`에서 favorite의 true/false 여부를 대신 판단한다.
