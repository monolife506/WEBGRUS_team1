API 문서
=======

폴더 내부에서 API에 대한 자세한 정보를 확인할 수 있습니다.
- `{userid}` 유저의 ID입니다.
- `{postid}`는 MongoDB의 ObjectDB를 그대로 사용합니다.
- `{commentid}`는 post의 comment array에서의 index입니다.

인증이 필요하지 않은 API
--------------------

- `POST /auth/login` : 로그인
- `POST /user` : 회원가입 (새로운 유저 생성)
- `GET /post/{postid}` : 특정 글의 정보 표시

인증이 필요한 API
--------------

### 계정

- `POST /auth/logout` : 로그아웃
- `GET /user/{userid}` : id가 `{userid}`인 유저의 정보 표시
- `PUT /user/{userid}` : id가 `{userid}`인 유저의 정보 업데이트
- `DELETE /user/{userid}` : id가 `{userid}`인 유저의 정보 삭제
- `POST /user/following/{userid}` : id가 `{userid}`인 유저를 팔로우한다. 
- `DELETE /user/following/{userid}` : id가 `{userid}`인 유저를 팔로우에서 해제한다. 

### 글 작성자

- `POST /post` : 글 생성
- `PUT /post/{postid}` : id가 `{postid}`인 글 업데이트
- `DELETE /post/{postid}` : id가 `{postid}`인 글 삭제

### 글 열람

- `POST /post/{postid}/like`: id가 `{postid}`인 글에 좋아요 추가
- `DELETE /post/{postid}/like`: id가 `{postid}`인 글에 좋아요 제거
- `POST /post/{postid}/comment`: id가 `{postid}`인 글에 댓글 추가
- `PUT /post/{postid}/comment`: id가 `{postid}`인 글에 id가 `{commentid}`인 댓글 수정
- `DELETE /post/{postid}/comment/{commentid}`: id가 `{postid}`인 글에 id가 `{commentid}`인 댓글 제거