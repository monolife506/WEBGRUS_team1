API 문서
=======

폴더 내부에서 API에 대한 자세한 정보를 확인할 수 있습니다.
- `{userid}` 유저의 ID입니다.
- `{postid}`는 MongoDB의 ObjectDB를 그대로 사용합니다.
- `{commentid}`는 post의 comment array에서의 index입니다.

인증이 필요하지 않은 API
--------------------

- `POST /api/auth/login` : 로그인
- `POST /api/users` : 회원가입 (새로운 유저 생성)
- `GET /api/post/{postid}` : 특정 글의 정보 표시

인증이 필요한 API
--------------

### 테스트

- `POST /api/auth/check` : 현재 토큰 검증 (테스트용)

### 계정

- `POST /api/auth/logout` : 로그아웃
- `GET /api/user/{userid}` : id가 `{userid}`인 유저의 정보 표시
- `PUT /api/user/{userid}` : id가 `{userid}`인 유저의 정보 업데이트
- `DELETE /api/user/{userid}` : id가 `{userid}`인 유저의 정보 삭제
- `POST /api/user/following/{userid}` : id가 `{userid}`인 유저를 팔로우한다. 
- `DELETE /api/user/following/{userid}` : id가 `{userid}`인 유저를 팔로우에서 해제한다. 

### 글 작성자

- `POST /api/post` : 글 생성
- `PUT /api/post/{postid}` : id가 `{postid}`인 글 업데이트
- `DELETE /api/post/{postid}` : id가 `{postid}`인 글 삭제

### 글 열람

- `POST /api/post/{postid}/like`: id가 `{postid}`인 글에 좋아요 추가
- `DELETE /api/post/{postid}/like`: id가 `{postid}`인 글에 좋아요 제거
- `POST /api/post/{postid}/comment`: id가 `{postid}`인 글에 댓글 추가
- `PUT /api/post/{postid}/comment`: id가 `{postid}`인 글에 id가 `{commentid}`인 댓글 수정
- `DELETE /api/post/{postid}/comment/{commentid}`: id가 `{postid}`인 글에 id가 `{commentid}`인 댓글 제거