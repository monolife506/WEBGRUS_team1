API 문서
=======

다른 문서에서 API에 대한 자세한 정보를 확인할 수 있다.
- `userid`: 유저의 ID
- `postid`, `commentid`: 각각 글과 댓글의 id, MongoDB의 ObjectID를 그대로 사용

인증이 필요하지 않은 API
--------------------

- `POST /api/auth` : 로그인
- `POST /api/users` : 회원가입 (새로운 유저 생성)

- `GET /api/posts/content/:postid` : 특정 글의 정보 표시 (로그인된 상태인 경우 조회수 증가)

아래 api들은 여러개의 글을 받아오므로, post.md를 반드시 참조할 것
- `GET /api/posts/users/:userid` : 작성자가 `userid`인 유저가 작성한 글 표시
- `GET /api/posts/favorites/:userid` : `userid`가 좋아요 표시한 모든 글 표시
- `GET /api/posts/search/:query` : query에 일치하는 글의 정보 표시 (post.md 참조)
- `GET /api/posts/all` : 모든 글의 정보 표시

인증이 필요한 API
--------------

### 계정

- `GET /api/auth` : 현재 토큰 검증
- `PUT /api/users` : 현재 로그인한 유저의 정보 업데이트
- `DELETE /api/users` : 현재 로그인한 유저의 정보 삭제
- `PUT /api/users/following/:userid` : id가 `userid`인 유저에 대해 팔로잉 상태 토글
- `GET /api/users/following/:userid` : id가 `userid`인 유저에 대해 팔로잉 상태 확인

### 글 작성

- `POST /api/posts` : 글 생성
- `PUT /api/posts/:postid` : id가 `postid`인 글 업데이트
- `DELETE /api/posts/:postid` : id가 `postid`인 글 삭제

### 글 열람

- `PUT /api/users/favorites/:postid`: id가 `postid`인 글에 좋아요 토글
- `GET /api/users/favorites/:postid`: id가 `postid`인 글의 좋아요 여부 확인

### 댓글 작성

- `POST /api/posts/:postid/comments`: id가 `:postid`인 글에 댓글 추가
- `PUT /api/posts/:postid/comments/:commentid`: id가 `:postid`인 글에 id가 `:commentid`인 댓글 수정
- `DELETE /api/posts/:postid/comments/:commentid`: id가 `:postid`인 글에 인덱스가 `:commentid`인 댓글 제거