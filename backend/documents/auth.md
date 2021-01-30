계정 관리
=======

## 계정 만들기

`POST /api/users`
다음과 같은 json 형식으로 전송하면 DB에 계정 정보가 추가되며 user 정보와 done: true를 return한다.
형식이 다르거나 오류가 발생한 경우에는 {done: false}를 return한다.

```
{
    "userid": "sampleid",
    "useremail": "example@email.com",
    "password": "password"
}
```

## 계정 정보로 jwt 토큰 발급

`POST /api/auth`
다음과 같은 json 형식으로 전송하면 id와 password가 DB상에 존재할 경우 jwt 토큰을 발급하고 (done: true), 아니면 status code 400으로 'undefined' 토큰을 return한다. (done: false) 

```
{
    "userid": "testid",
    "password": "password"
}
```

## jwt 토큰의 유효성 검증

`GET /api/auth`
Bearer Token을 2에서 발급받은 토큰으로 하고 전송하면 유효한 토큰인 경우 status code 200을 return한다.

## 계정 정보 수정

`PUT /api/users`
유효한 Bearer Token을 가지고 있을때 다음 api를 호출하면 다음과 같은 형식으로 원래 비밀번호를 제대로 입력한 경우 userid를 제외한 현재 계정의 정보를 수정할 수 있다.
제대로 작동된 경우 {done: true}와 변경된 user의 정보를 return한다.

```
{
    "oldpassword": "orginalpassword" // 원래 비밀번호
    "useremail: "useremail", // 변경할 이메일
    "password": "password", // 변경할 비밀번호
}
```

## 계정 삭제

`DELETE /api/users`
유효한 Bearer Token을 가지고 있을때 다음 api를 호출하면 다음과 같은 형식으로 현재 비밀번호를 제대로 입력한 경우 userid를 제외한 현재 계정의 정보를 삭제할 수 있다.
제대로 작동된 경우 {done: true}를 return한다.

```
{
    "password": "password" // 현재 비밀번호
}
```

## 팔로잉과 팔로워

`GET /api/users/following/:userid` : id가 `userid`인 유저에 대해 팔로잉 상태 확인
`PUT /api/users/following/:userid` : id가 `userid`인 유저에 대해 팔로잉 상태 토글
유효한 jwt 토큰을 가지고 있을 때 두 api를 호출하여 현재 유저의 팔로잉 유저 리스트를 수정할 수 있다.

`GET /api/users/following/:userid`는 return하는 following의 true/false 여부로 `userid`의 팔로잉 상태를 확인한다.
`PUT /api/users/following/:userid`는 return되는 json의 status가 add/del (add는 현재 팔로잉에 추가됨, del은 팔로잉에서 제거됨)인지 확인해 팔로잉 상태 토글을 확인할 수 있다.

## 로그아웃

프론트엔드에서 Bearer Token의 내용을 삭제하여 로그아웃을 구현할 수 있다.