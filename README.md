# Clone Uber Eats FrontEnd

- ReactJS, Typescript, Apollo for Graphql
- Tailwind CSS
- AWS S3
- Jest / Cypress

## Screens:

### Logged Out :

- [x] Home
- [x] Email Login
- [x] Create Account
- [x] Verify Email code

### Logged In :

Role: Clinet

- [x] Home
- [x] Profile
- [x] Edit Profile
- [x] Category
- [x] RestaurantDetail
- [x] Search
- [x] Order

Role: Owner

- [x] Home
- [x] Profile
- [x] Edit Profile
- [x] My Restaurants
- [x] My Restaurant_detail page
- [x] Add Restaurant
- [x] Add Dish
- [x] Order Status Get

Role: Driver

- [x] Home
- [x] Profile
- [x] Edit Profile
- [x] Driver Board
- [x] Cooked Status Get

## 개발과정

Authentication

1. 로그인

- localstorage에 token저장으로 로그인
- apollo local-only-fields로 local state를 cache로 관리
- form input value 에러체크

2. 계정 생성

- form input값 에러체크
- useMutation으로 input값 서버로 전달 -> 계정 생성
- 계정이 만들어지면 alert창으로 확인
- useHistory를 통해 로그인 페이지로 이동

Common User page

1. 사용자 이메일 인증(default:true로 함.)

- window location의 주소에서 code값 받아, mutation으로 전달,
- mutation완료 후 writeFragment함수 이용.
  서버 query값 중 verified값 true로 변경되어 본인 인증이 될 수 있게 함.

2. 프로필 수정

- user email 수정, 저장 기능. user verified를 false로 변경해서 이메일 인증이 될 수 있게 함.

3. 사용자에 따라 필요한 order status 변경 및 실시간 동기화(웹소켓)

Client page

- 검색기능 ->검색어 window location의 주소에서 query로 전달 ->query값이 있어야 page로딩
- 등록 전체 식당 로딩(pagenation)
- 카테고리 로딩 -> 카테고리별로 식당 분류
- 식당 디테일 페이지: oder기능 구현

Owner page

1. main page

- 등록 식당 로딩
- 식당 등록
  - img 업로드 위해 backend에 upload module 생성(nestJS)
  - 서버에 업로드 된 이미지를 저장하기 위해 aws-sdk 사용.
  - 이미지 보관을 위해 AWS S3 storage service 이용.
  - apollo caching기능을 이용, query data(writeQuery)로 cache를
    업데이트 함. : 식당 등록 후 뒤로가기를 눌렀을 때 식당 리스트에
    새로 등록된 식당이 바로 보일 수 있게 함.

2. 식당 디테일 페이지

- 메뉴등록
- 매출 그래프(Victory library)
- pending된 order를 subscription을 통해 받고, order가 있는 경우
  orderpage가 팝업처럼 열림

Driver page

1. 드라이버/배달지역 위치 받기
2. 지도에 경로 표시(google map api sdk)
3. order status 받기 / 전달하기
4. 드라이버 위치변경 시 지도 위 marker도 함께 이동

Deploy

- backend Heroku에 build
- front Netlify에 build

https://naughty-keller-380317.netlify.app/
