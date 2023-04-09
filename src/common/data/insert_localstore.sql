-- role ( 슈퍼관리자, 관리자, CS담당자, 운영자, 매출관리자, 점주)
INSERT INTO `dev_store`.`role` (title) VALUES ('admin');
INSERT INTO `dev_store`.`role` (title) VALUES ('manager');
INSERT INTO `dev_store`.`role` (title) VALUES ('cs');
INSERT INTO `dev_store`.`role` (title) VALUES ('operator');
INSERT INTO `dev_store`.`role` (title) VALUES ('sales');
INSERT INTO `dev_store`.`role` (title) VALUES ('store');
-- permission
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('운영자메인',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('운영자관리',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('회원관리','일반회원정보');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('회원관리','점주정보');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('홈관리','추천메뉴');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('게시판관리','공지사항');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('게시판관리','이벤트');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('고객센터','일반고객문의');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('고객센터','사장님문의');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('고객센터','FAQ');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('쿠폰관리',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('포인트관리','포인트현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('포인트관리','포인트관리');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('매출관리','매출현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('매출관리','결제현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('이용약관',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('개인정보처리방침',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('점주메인',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('가게관리','가게정보');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('가게관리','영업관리');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('가게관리','수수료설정');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('메뉴관리',null);
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('쿠폰관리','쿠폰현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('리뷰관리','리뷰현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('리뷰관리','재주문율');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('정산관리','정산현황');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('정산관리','가게정산');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('정산관리','기부정산');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('공지/안내','공지사항');
INSERT INTO `dev_store`.`permission` (title,subtitle) VALUES ('공지/안내','문의하기');
-- role_permission
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,1);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,2);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,3);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,4);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,5);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,6);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,7);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,8);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,9);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,10);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,11);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,12);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,13);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,14);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,15);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,16);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,17);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,18);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,19);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,20);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,21);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,22);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,23);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,24);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,25);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,26);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,27);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,28);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,29);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (1,30);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,1);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,3);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,4);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,5);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,6);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,7);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,8);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,9);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,10);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,11);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,12);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,13);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,14);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,15);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,16);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,17);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,18);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,19);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,20);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,21);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,22);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,23);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,24);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,25);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,26);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,27);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,28);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,29);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (2,30);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,18);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,19);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,20);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,21);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,22);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,23);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,24);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,25);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,26);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,27);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,28);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,29);
INSERT INTO `dev_store`.`role_permission` (role_id,permission_id) VALUES (6,30);
-- owner
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (1,'dev@foodnet24.com','123123','010-1111-1234','전관리','email',null,null,null,'개발');
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (1,'kimwon@foodnet24.com','123123','010-1111-1234','김관리','email',null,null,null,'개발');
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store1@test.com','123123','010-1111-1234','김사장','email','엘리스리틀이태리공덕점','서울 마포구 공덕동 476','111-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store2@test.com','123123','010-2222-1234','이사장','email','이요이요스시1호공덕점','서울 마포구 공덕동 469','112-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store3@test.com','123123','010-3333-1234','박사장','email','클래식햄버거공덕점','서울 마포구 공덕동 232-10','113-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store4@test.com','123123','010-4444-1234','최사장','email','참나무본가공덕점','서울 마포구 공덕동 256-5 2층','114-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store5@test.com','123123','010-5555-1234','정사장','email','몽중헌공덕점','서울 마포구 도화동 25-13 효성 해링턴스퀘어 A동 2F','115-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store6@test.com','123123','010-6666-1234','강사장','email','공덕차이나공덕점','서울 마포구 공덕동 384-19 용진빌딩 2층','116-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store7@test.com','123123','010-7777-1234','조사장','email','봉할매김치찌개불백전문공덕점','서울 마포구 염리동 168-9 재화스퀘어 지하1층','117-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store8@test.com','123123','010-8888-1234','윤사장','email','미스터라멘공덕점','서울 마포구 공덕동 249-23 2층 좌측호','118-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store9@test.com','123123','010-9999-1234','장사장','email','공덕김밥공덕점','서울 마포구 공덕동 255-6','119-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store10@test.com','123123','010-1111-1111','임사장','email','북창동순두부공덕점','서울 마포구 염리동 173-32 하나프라자','121-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store11@test.com','123123','010-1111-2222','한사장','email','돈카츠준공덕점','서울 마포구 신공덕동 172 펜트라우스 101동 b226호','122-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (6,'store12@test.com','123123','010-1111-3333','오사장','email','바른치킨공덕파크자이점','서울 마포구 공덕동 476','123-12-12345',null);
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (2,'manager1@foodnet24.com','123123','010-1111-1234','박개발','email',null,null,null,'개발');
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (2,'manager2@foodnet24.com','123123','010-1111-1234','최운영','email',null,null,null,'운영');
INSERT INTO `dev_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (2,'manager3@foodnet24.com','123123','010-1111-1234','오기획','email',null,null,null,'기획');
-- store
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (3,'양식','엘리스리틀이태리공덕','080-1111-1234',10000,'앨리스리틀이태리 고급스런 파스타','https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',1,'매일 11:30 - 22:00','15:00 - 17:30','연중무휴','서울 마포구 공덕동 476','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,30,22,0,20,37.5453591,126.9446182);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (4,'일식','이요이요스시 공덕1호점','080-2222-1234',12000,'오마카세 이요이요스시 수요미식회 나온 초밥','https://d1jwjxg29cufk5.cloudfront.net/stores/sushi-3367640_640.jpg',1,'매일 12:00 - 21:30','14:30 - 18:00','정기휴무(매주 일요일)','서울 마포구 공덕동 469','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',12,0,21,30,15,37.5500777,126.9506622);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (5,'패스트푸드','클래식햄버거','080-3333-1234',8000,'마포구 공덕동에 자리잡은 수제버거 매장입니다','https://d1jwjxg29cufk5.cloudfront.net/stores/burger-3962996_640.jpg',1,'매일 11:00 - 20:30','15:00 - 17:00','일요일 휴무','서울 마포구 공덕동 232-10','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,0,20,30,10,37.5487755,126.9507084);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (6,'한식','참나무본가 공덕점','080-4444-1234',9000,'참나무본가 공덕맛집 기본상차림 푸짐한 고기집','https://d1jwjxg29cufk5.cloudfront.net/stores/charcoal-grilled-meat-6464948_640.jpg',1,'매일 11:30 - 22:30','15:00 - 16:30','연중무휴','서울 마포구 공덕동 256-5 2층','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,30,22,30,20,37.5450653,126.9506944);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (7,'중식','몽중헌 공덕점','080-5555-1234',9000,'꿈속의 집(夢中軒)으로 당신을 초대합니다','https://d1jwjxg29cufk5.cloudfront.net/stores/jajang-2545938_640.jpg',1,'매일 11:30 - 22:00','15:00 - 17:30','연중무휴','서울 마포구 도화동 25-13 효성 해링턴스퀘어 A동 2F','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,30,22,0,20,37.5431034,126.9489309);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (8,'중식','공덕 차이나','080-6666-1234',8000,'농림축산식품부 제공 안심식당','https://d1jwjxg29cufk5.cloudfront.net/stores/jambong-6004032_640.jpg',1,'매일 11:00 - 22:00','15:00 - 17:30','정기휴무(매주 일요일)','서울 마포구 공덕동 384-19 용진빌딩 2층','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,0,22,0,20,37.5467207,126.9498544);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (9,'한식','봉할매김치찌개불백전문점','080-7777-1234',8000,'불백 전문','https://d1jwjxg29cufk5.cloudfront.net/stores/ttukbaegi-2517765_640.jpg',1,'매일 11:00 - 21:00','15:00 - 17:30','연중무휴','서울 마포구 염리동 168-9 재화스퀘어 지하1층','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,0,21,0,15,37.5438797,126.9454911);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (10,'일식','미스터라멘 공덕점','080-8888-1234',8000,'라멘 전문','https://d1jwjxg29cufk5.cloudfront.net/stores/ramen-4665686_640.jpg',1,'매일 11:00 - 21:00','15:00 - 17:30','토일 휴무','서울 마포구 공덕동 249-23 2층 좌측호','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,0,21,0,15,37.546318,126.9519921);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (11,'야식','공덕김밥','080-9999-1234',8000,'김밥 전문','https://d1jwjxg29cufk5.cloudfront.net/stores/kimbab-2610864_640.jpg',1,'매일 07:00 - 21:00','15:00 - 17:30','정기휴무(매주 일요일)','서울 마포구 공덕동 255-6','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',7,0,21,0,10,37.5443765,126.9497831);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (12,'한식','북창동순두부 공덕점','080-1210-1234',8000,'북창동 순두부가 맛있는 이유! 1. 대한민국 1등 순두부 브랜드','https://d1jwjxg29cufk5.cloudfront.net/stores/cheonggukjang-1483809_640.jpg',1,'매일 07:00 - 22:00','15:00 - 17:30','연중무휴','서울 마포구 염리동 173-32 하나프라자','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',7,0,22,0,20,37.5426501,126.9445092);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (13,'양식','돈카츠 준','080-1211-1211',12000,'돈카츠 준은 엄선된 제주산 돼지고기만을 사용합니다','https://d1jwjxg29cufk5.cloudfront.net/stores/tonkatsu-5787702_640.jpg',1,'매일 11:00 - 21:00','15:00 - 17:30','일요일 휴무','서울 마포구 신공덕동 172 펜트라우스 101동 b226호','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,0,21,0,20,37.5441654,126.9520647);
INSERT INTO `dev_store`.`store` (owner_id,category,name,phone_number,min_order_price,intro,cover_image1,is_package,opening_time,break_time,day_off,address1,origin,open_hour,open_min,close_hour,close_min,cooking_time,latitude,longitude)
VALUES (14,'치킨','바른치킨 공덕파크자이점','080-1211-1212',12000,'오늘 당신의 치킨은 몇번째 튀긴 치킨인가요?','https://d1jwjxg29cufk5.cloudfront.net/stores/chicken-667935_640.jpg',1,'매일 11:30 - 23:30','15:00 - 17:30','연중무휴','서울 마포구 공덕동 476','돈목살(스페인산) 앞다리살(국내산) 돈등심(국내산) 돈삼겹(독일산) 우삼겹(미국산) 새우(베트남산)',11,30,23,30,30,37.5451501,126.9452841);
-- store_image
INSERT INTO `dev_store`.`store_image` (store_id,image_file_id) VALUES (12,1);
INSERT INTO `dev_store`.`store_image` (store_id,image_file_id) VALUES (12,2);
INSERT INTO `dev_store`.`store_image` (store_id,image_file_id) VALUES (12,3);
INSERT INTO `dev_store`.`store_image` (store_id,image_file_id) VALUES (12,4);
INSERT INTO `dev_store`.`store_image` (store_id,image_file_id) VALUES (12,5);
-- category
INSERT INTO `dev_store`.`category` (name) VALUES ('한식');
INSERT INTO `dev_store`.`category` (name) VALUES ('양식');
INSERT INTO `dev_store`.`category` (name) VALUES ('중식');
INSERT INTO `dev_store`.`category` (name) VALUES ('일식');
INSERT INTO `dev_store`.`category` (name) VALUES ('치킨');
INSERT INTO `dev_store`.`category` (name) VALUES ('야식');
INSERT INTO `dev_store`.`category` (name) VALUES ('패스트푸드');
-- category_store
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (1,2);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (2,4);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (3,2);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (3,6);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (3,7);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (4,1);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (5,3);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (6,3);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (7,1);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (8,4);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (9,1);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (10,1);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (11,2);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (12,5);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (12,6);
INSERT INTO `dev_store`.`category_store` (store_id, category_id) VALUES (12,7);
-- image_file ( https://d1jwjxg29cufk5.cloudfront.net )
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','pasta-salad-1967501_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','sushi-3367640_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/sushi-3367640_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','burger-3962996_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/burger-3962996_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','charcoal-grilled-meat-6464948_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/charcoal-grilled-meat-6464948_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','jajang-2545938_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/jajang-2545938_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','jambong-6004032_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/jambong-6004032_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','ttukbaegi-2517765_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/ttukbaegi-2517765_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','ramen-4665686_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/ramen-4665686_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','kimbab-2610864_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/kimbab-2610864_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','cheonggukjang-1483809_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/cheonggukjang-1483809_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','tonkatsu-5787702_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/tonkatsu-5787702_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('stores','chicken-667935_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/stores/chicken-667935_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('menus','chicken-667935_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-667935_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('menus','chicken-669637_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-669637_640.jpg');
INSERT INTO `dev_store`.`image_file` (folder,name,url) VALUES ('menus','chicken-641881_640.jpg','https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg');
-- icon
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','good','착한가게');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','popular','인기가게');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','new','신규가게');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','coupon','쿠폰');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','package','포장');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','inStore','매장');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('store','clean','위생');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('menu','order','주문');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('menu','signature','대표');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('menu','new','신규');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('menu','recommended','추천');
INSERT INTO `dev_store`.`icon` (type,name,description) VALUES ('menu','adult','19');
-- icon_store ( 샘플데이터 - 착한가게, 인기가게, 신규가게 등 특정 조건 또는 통계 데이터가 필요한 경우 별도 처리가 필요 )
INSERT INTO `dev_store`.`icon_store` (icon_id,store_id) VALUES (1,12);
INSERT INTO `dev_store`.`icon_store` (icon_id,store_id) VALUES (2,12);
-- icon_menu ( 대표 9, 추천 11)
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (9,1);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (9,3);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (9,5);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (9,17);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (9,6);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (11,5);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (11,6);
INSERT INTO `dev_store`.`icon_menu` (icon_id,menu_id) VALUES (11,7);
-- menu_group
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'시그니쳐 메뉴',null,4,1);
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'치킨메뉴',null,9,2);
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'윙봉메뉴',null,3,3);
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'세트메뉴',null,2,4);
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'사이드',null,6,5);
INSERT INTO `dev_store`.`menu_group` (store_id,name,description,menu_count,position) VALUES (12,'주류메뉴','배달 주문 시, 주류메뉴는 다른 메뉴와 함께 구매해주세요',6,6);
-- menu
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,1,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg','대세레드 (매운강도:중)',null,'탱글한 랍스터 새우와 72시간 숙성된 소스의 뒤끝있는 매운맛!',1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,1,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg','대세레드 스페셜 (매운강도:중)',null,'탱글한 랍스터 새우 12마리, 떡과 고추를 더해 맛있게 매운 고추 소스의 대세레드 스페셜',2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,1,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-2443901_640.jpg','대세핫블랙 (매운강도:상)',null,'(기존 대새치킨) 랍스터 새우와 매운 간장 소스로 맛을 낸 스페셜 메뉴',3);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,1,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-2443901_640.jpg','대세핫블랙 스페셜 (매운강도:상)',null,'(기존 대새치킨 스페셜) 12마리의 랍스터 새우와 쫄깃한 떡사리, 중독성 있는 매운 간장 소스가 어우러진 대새핫블랙스페셜',4);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-667935_640.jpg','현미바사삭',null,'특허받은 현미파우더에 깨끗한 기름으로 조리하여 후라이드 본연의 깔끔하고 고소한 치킨',1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-669637_640.jpg','반반치킨',null,'현미바사삭과 특제 양념치킨을 동시에 맛볼 수 있는 반반 치킨',2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/seasoned-chicken-669639_640.jpg','양념치킨',null,'매콤달콤한 양념과 현미 파우더의 고소함이 잘 어우러진 바른치킨만의 특제 양념 치킨',3);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg','스파이크치킨',null,'숯불향을 머금은 매운맛과 크런치한 식감이 입안을 강타하는 치킨',4);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-2443901_640.jpg','후추치킨',null,'후추와 청양고추의 깔끔함과 매콤달콤한 감칠맛이 중독적인 치킨',5);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-667935_640.jpg','통곡물 간장',null,'감칠맛 넘치는 특제 간장소스와 통곡물 토핑으로 식감을 살린 매력적인 맛의 치킨',6);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-1001767_640.jpg','꿀마늘치킨',null,'알싸한 마늘 토핑과 달콤한 꿀 소스의 조화가 인상적인 치킨',7);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-1390410_640.jpg','달콤강정',null,'달콤한 강정소스에 쫄깃한 떡을 더한 100% 국내산 순살 치킨',8);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,2,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-641881_640.jpg','(NEW)팍뿌리까',null,'팍팍 뿌려 팍뿌리카 매콤 달콤한 파프리카 시즈닝과 멕시코 타코시즈닝의 조화로운 치킨',9);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,3,'https://d1jwjxg29cufk5.cloudfront.net/menus/chiken-997682_640.jpg','현미윙봉',null,'쫄깃한 윙과 담백한 봉만 모아 바사삭 바르게 튀긴 바른치킨 특제 현미윙봉',1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,3,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-4049103_640.jpg','간장윙봉',null,'입맛 돋우는 달콤짭쪼름한 간장소스와 윙봉의 매력적인 조화',2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,3,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-drumsticks-5205207_640.jpg','고추윙봉 (매운강도:중)',null,'첫 맛은 깔끔하고 뒷 맛은 매콤한 고추소스와 부드러운 윙봉의 조화',3);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,4,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-667935_640.jpg','순덕이세트 (현미바사삭 순살 + 바른 치즈 떡볶이)','현미바사삭 순살 + 바른 치즈 떡볶이',null,1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,4,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-nuggets-246180_640.jpg','고.김.떡 세트','한입고추 & 김말이튀김 + 바른 치즈 떡볶이',null,2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/tteokbokki-2735719_640.jpg','바른치즈떡볶이',null,'중독성 있는 맛있는 매운맛의 인기 메뉴! 100% 자연산 치즈를 듬뿍 올린 매콤한 국물떡볶이',1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/french-fries-1351062_640.jpg','모듬 감자튀김',null,'4가지 이색 감자튀김과 바삭한 카사바칩',2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/goguma_cheese_ball.JPG','고구마치즈볼',null,'달콤한 고구마무스와 모짜렐라, 고다치즈의 환상적인 조합',3);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/chicken-nuggets-246180_640.jpg','한입 고추 & 김말이튀김',null,'한 입에 쏙 감기는 아삭한 고추튀김과 김말이 튀김',4);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/burger-4022487_640.jpg','마산 할매 아구포',null,'씹을수록 고소하고 부드러운 오동통 할매아구포',5);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,5,'https://d1jwjxg29cufk5.cloudfront.net/menus/schnitzel-3779726_640.jpg','덕장 먹태',null,'바삭한 식감과 고소한 맛의 덕장먹태',6);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,'https://d1jwjxg29cufk5.cloudfront.net/menus/soju-3233578_640.jpg','참이슬 후레쉬',null,null,1);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,'https://d1jwjxg29cufk5.cloudfront.net/menus/bottle-2877005_640.jpg','처음처럼',null,null,2);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,null,'진로이즈백',null,null,3);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,null,'카스 (병)',null,null,4);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,null,'테라 (병)',null,null,5);
INSERT INTO `dev_store`.`menu` (store_id,menu_group_id,menu_image,name,combo,description,position) VALUES (12,6,null,'카스 생맥주 (병)',null,null,6);
-- menu_image
INSERT INTO `dev_store`.`menu_image` (menu_id,image_file_id) VALUES (1,13);
INSERT INTO `dev_store`.`menu_image` (menu_id,image_file_id) VALUES (2,14);
INSERT INTO `dev_store`.`menu_image` (menu_id,image_file_id) VALUES (3,15);
-- menu_price
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (1,null,10,21900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (2,null,0,29900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (3,null,10,21900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (4,null,0,29900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (5,null,20,16900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (6,null,30,17900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (7,null,0,17900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (8,null,0,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (9,null,10,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (10,null,10,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (11,null,10,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (12,null,20,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (13,null,0,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (14,null,0,17900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (15,null,0,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (16,null,0,18900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (17,null,0,16900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (18,null,0,15900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (19,null,0,8900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (20,null,0,6900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (21,null,0,5000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (22,null,0,7900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (23,null,0,12900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (24,null,0,14900);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (25,null,0,4000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (26,null,0,4000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (27,null,0,4000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (28,null,0,4000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (29,null,0,4000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (30,'1000cc',0,7000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (30,'2000cc',0,13000);
INSERT INTO `dev_store`.`menu_price` (menu_id,name,discount,price) VALUES (30,'3000cc',0,18000);
-- menu_signature
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,1,1);
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,3,2);
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,5,3);
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,17,4);
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,6,5);
INSERT INTO `dev_store`.`menu_signature` (store_id,menu_id,position) VALUES (12,10,6);
-- option_group
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'치킨 선택',1,1,1,1);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'반반 변경 추가선택',0,0,1,2);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'사이드 추가선택',0,0,8,3);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'반반 변경 추가선택',0,0,1,4);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'치킨 선택',1,1,1,5);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'매운맛 선택',1,1,1,6);
INSERT INTO `dev_store`.`option_group` (store_id,name,is_required,min_option,max_option,position) VALUES (12,'추가선택',0,0,1,7);
-- option
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,1,'뼈',0,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,1,'순살',1000,2);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,2,'현미바사삭',0,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'떡튀김',1000,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'카사바칩',2000,2);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'고구마치즈볼(5개)',5000,3);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'대새튀김(4개)',5500,4);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'포장무',500,5);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'양념소스',500,6);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'바른치즈떡볶이',8900,7);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,3,'음료 사이즈업',2000,8);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,4,'현미윙봉',0,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,5,'혼자닭',0,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,5,'함께닭',7500,2);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,6,'기본',0,1);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,6,'조금 덜 맵게',0,2);
INSERT INTO `dev_store`.`option` (store_id,option_group_id,name,price,position) VALUES (12,7,'감자납작당면',2000,1);
-- menu_option_group
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (1,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (1,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (1,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (2,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (2,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (2,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (3,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (3,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (3,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (4,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (4,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (4,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (5,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (5,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (6,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (6,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (7,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (7,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (7,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (8,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (8,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (8,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (9,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (9,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (9,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (10,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (10,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (10,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (11,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (11,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (11,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (12,2);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (12,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (13,1);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (13,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (14,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (15,4);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (15,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (16,4);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (16,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (17,5);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (17,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (18,3);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (19,6);
INSERT INTO `dev_store`.`menu_option_group` (menu_id,option_group_id) VALUES (19,7);
-- recommend_category
INSERT INTO `dev_store`.`recommend_category` (name,position) VALUES ('한식',1);
INSERT INTO `dev_store`.`recommend_category` (name,position) VALUES ('돈까스, 일식',2);
INSERT INTO `dev_store`.`recommend_category` (name,position) VALUES ('중식',3);
INSERT INTO `dev_store`.`recommend_category` (name,position) VALUES ('야식',4);
-- recommend_category_menu
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (1,2);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (1,4);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (1,7);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (2,8);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (2,13);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (2,14);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (3,15);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (3,16);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (3,17);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (4,18);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (4,19);
INSERT INTO `dev_store`.`recommend_category_menu` (recommend_category_id,menu_id) VALUES (4,20);
-- discount_category_menu
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (1,1);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (1,3);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (1,5);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (1,6);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (1,9);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (2,10);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (2,11);
INSERT INTO `dev_store`.`discount_category_menu` (category_id,menu_id) VALUES (2,12);
-- user
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user1@test.com','123123','010-1111-1234','김하나','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user2@test.com','123123','010-1111-1234','김두리','email','local');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (2,'user3@test.com','123123','010-1111-1234','김세찌','email','neighbor');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user4@test.com','123123','010-2222-1234','이하나','email','regular');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user5@test.com','123123','010-3333-1234','이두리','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user6@test.com','123123','010-4444-1234','이세찌','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user7@test.com','123123','010-5555-1234','박하나','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user8@test.com','123123','010-6666-1234','박두리','email','local');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (2,'user9@test.com','123123','010-7777-1234','박세찌','email','local');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user10@test.com','123123','010-8888-1234','최하나','email','local');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user11@test.com','123123','010-9999-1234','최두리','email','neighbor');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (2,'user12@test.com','123123','010-1111-1111','최세찌','email','neighbor');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user13@test.com','123123','010-1111-2222','정하나','email','neighbor');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user14@test.com','123123','010-1111-3333','정두리','email','regular');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user15@test.com','123123','010-1111-1234','정세찌','email','regular');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user16@test.com','123123','010-1111-1234','강하나','email','regular');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (2,'user17@test.com','123123','010-1111-1234','강두리','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user18@test.com','123123','010-1111-1234','강세찌','email','local');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (1,'user19@test.com','123123','010-1111-1234','조하나','email','neighbor');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (2,'user20@test.com','123123','010-1111-1234','조두리','email','rookie');
INSERT INTO `dev_store`.`user` (level,username,password,phone_number,full_name,signup_type,`rank`)
VALUES (3,'user21@test.com','123123','010-1111-1234','조세찌','email','local');
-- user_address
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (21,'우리집','road','강원 춘천시 동면 가락재로 6','3층 303호');
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (21,'회사','road','강원 춘천시 동면 가산로 10','8층 815호');
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (20,'우리집','road','강원 춘천시 동면 가래매기길 6','1층 102호');
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (19,'회사','road','강원 춘천시 동면 가래울길 8','2층 215호');
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (18,'우리집','road','강원 춘천시 동면 가암길 11','5층 503호');
INSERT INTO `dev_store`.`user_address` (user_id,area,type,address1,address2)
VALUES (17,'회사','road','강원 춘천시 동면 가옹개길 11','11층 1115호');
-- coupon
INSERT INTO `dev_store`.`coupon` 
(`name`,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price,discount_price, issued_count, download_count, is_disabled) 
VALUES ('오픈 할인 3000원','2022-03-03','2022-03-03', '2022-03-07', true, 'ALL', 10000, null, null, 3000, 100, 0, false);
INSERT INTO `dev_store`.`coupon` 
(name,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price,discount_price, issued_count, download_count,is_disabled) 
VALUES ('오픈 할인 5000원','2022-03-03','2022-03-03', '2022-03-07', true, 'ALL', 50000, null, null,  5000, 100, 0, false);
INSERT INTO `dev_store`.`coupon` 
(name,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price, discount_price, issued_count, download_count,is_disabled) 
VALUES ('치킨 할인 5000원','2022-03-03','2022-03-03', '2022-03-07', true, 'CATEGORY', 15000, null, null,  5000, 30, 0, false);
INSERT INTO `dev_store`.`coupon` 
(name,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price, discount_price, issued_count, download_count,is_disabled) 
VALUES ('치킨 할인 15000원','2022-03-03','2022-03-03', '2022-03-07', true, 'VOUCHER', 15000, null, null, 15000, 5, 0, false);
INSERT INTO `dev_store`.`coupon` 
(name,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price, discount_price, issued_count, download_count,is_disabled, store_id) 
VALUES ('치킨 할인 3000원','2022-03-03','2022-03-03', '2022-03-07', true, 'STORE', 15000, null, null, 3000,  20, 0, false, 12);
INSERT INTO `dev_store`.`coupon` 
(name,opened_at, started_at, ended_at, is_duplicate, division, min_price, discount_rate,max_discount_price, discount_price, issued_count, download_count,is_disabled) 
VALUES ('선착순 20명 5% 할인 ','2022-03-03','2022-03-03', '2022-03-07', true, 'ALL', 15000, 5, 10000, null, 20, 0, false);
-- code
INSERT INTO `dev_store`.`code`(id, parent_id, ref, depth, name, description) 
VALUES (1, 0, 'target', 0, 'coupon_target', '쿠폰적용대상');
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (2, 1, 'target', 1, 'all', '전체', 1);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (3, 1, 'target', 1, 'area', '지역', 2);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (4, 1, 'target', 1, 'rank', '등급', 3);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (5, 3, 'target', 2, 'CC', '춘천', 1);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (6, 4, 'target', 2, 'rookie', '새내기', 1);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (7, 4, 'target', 2, 'local', '주민', 2);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (8, 4, 'target', 2, 'neighbor', '이웃', 3);
INSERT INTO `dev_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (9, 4, 'target', 2, 'regular', '단골', 4);
-- settlement
INSERT INTO `settlement` VALUES 
(1,'2022-07-05 15:36:04.000000',NULL,'2022-07-05',NULL,NULL,1,27,66,'2022-07-04 10:28:03.201000','paid','card','CC202264N1P96I',12000,10800,0,10260,-1740,0,-1200,0,-216,-324,0,NULL,0,'ready'),
(2,'2022-07-05 15:36:04.000000',NULL,'2022-07-05',NULL,NULL,1,27,67,'2022-07-04 10:44:10.650000','paid','card','CC202264NJ7L56',33000,29700,0,28215,-4785,0,-3300,0,-594,-891,0,NULL,0,'ready'),
(3,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,68,'2022-07-05 01:25:38.904000','paid','card','CC202265NA5I09',12000,10800,0,10260,-1740,0,-1200,0,-216,-324,0,NULL,0,'ready'),
(4,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,69,'2022-07-05 02:16:02.942000','paid','card','CC202265ND583V',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(5,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,70,'2022-07-05 04:01:19.389000','paid','card','CC202265N4N5R3',57000,51300,0,48735,-8265,0,-5700,0,-1026,-1539,0,NULL,0,'ready'),
(6,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,71,'2022-07-05 04:01:54.404000','cancelled','card','CC202265N4N5R3',57000,51300,0,48735,-8265,0,-5700,0,-1026,-1539,0,NULL,0,'ready'),
(7,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,72,'2022-07-05 04:19:22.719000','paid','card','CC202265N30WN4',19800,19800,0,18810,-990,0,0,0,-396,-594,0,NULL,0,'ready'),
(8,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,73,'2022-07-05 04:22:52.893000','paid','card','CC202265N3L39N',16000,14400,0,13680,-2320,0,-1600,0,-288,-432,0,NULL,0,'ready'),
(9,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,74,'2022-07-05 04:24:35.229000','paid','card','CC202265N99CL0',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(10,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,75,'2022-07-05 04:33:33.120000','paid','card','CC202265N33QC4',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(11,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,76,'2022-07-05 05:05:26.113000','paid','card','CC202265NPM495',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(12,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,77,'2022-07-05 05:06:21.086000','paid','card','CC202265ND6B22',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(13,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,78,'2022-07-05 05:07:15.758000','paid','card','CC202265NA76B3',15000,13500,0,12825,-2175,0,-1500,0,-270,-405,0,NULL,0,'ready'),
(14,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,79,'2022-07-05 05:08:23.608000','paid','card','CC202265N4K4P2',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(15,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,80,'2022-07-05 05:54:42.598000','paid','card','CC202265N82NK8',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(16,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,81,'2022-07-05 06:12:04.560000','paid','card','CC202265NR674V',12000,10800,0,10260,-1740,0,-1200,0,-216,-324,0,NULL,0,'ready'),
(17,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,82,'2022-07-05 07:21:26.910000','paid','card','CC202265N5V6Q6',33000,29700,0,28215,-4785,0,-3300,0,-594,-891,0,NULL,0,'ready'),
(18,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,83,'2022-07-05 07:58:15.486000','paid','card','CC202265NTS612',12000,10800,0,10260,-1740,0,-1200,0,-216,-324,0,NULL,0,'ready'),
(19,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,84,'2022-07-05 08:00:41.626000','paid','card','CC202265NK4L89',12000,10800,0,10260,-1740,0,-1200,0,-216,-324,0,NULL,0,'ready'),
(20,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,85,'2022-07-05 08:07:48.783000','paid','card','CC202265N89D9V',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(21,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,2,27,86,'2022-07-05 08:42:13.416000','paid','card','CC202265N9U0K9',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(22,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,87,'2022-07-06 02:01:05.087000','paid','card','CC202266N6D7A6',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(23,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,88,'2022-07-06 02:06:55.737000','paid','card','CC202266N9F02B',13000,11700,0,11115,-1885,0,-1300,0,-234,-351,0,NULL,0,'ready'),
(24,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,89,'2022-07-06 06:04:33.785000','paid','card','CC202266N71F7H',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(25,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,90,'2022-07-06 06:07:27.984000','paid','card','CC202266N6KF07',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(26,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,91,'2022-07-06 06:09:45.230000','paid','card','CC202266N299WN',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(27,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,92,'2022-07-06 06:25:40.464000','paid','card','CC202266N86QV8',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(28,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,93,'2022-07-06 07:11:19.293000','paid','card','CC202266N896TV',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(29,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,3,27,94,'2022-07-06 07:24:44.421000','paid','card','CC202266N8P7I1',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(30,'2022-07-08 15:36:36.000000',NULL,'2022-07-08',NULL,NULL,4,27,95,'2022-07-07 01:07:49.322000','paid','card','CC202267N68LR3',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(31,'2022-07-08 15:36:36.000000',NULL,'2022-07-08',NULL,NULL,4,27,96,'2022-07-07 04:05:40.401000','paid','card','CC202267NL9W86',15000,13500,0,12825,-2175,0,-1500,0,-270,-405,0,NULL,0,'ready'),
(32,'2022-07-08 15:36:36.000000',NULL,'2022-07-08',NULL,NULL,4,27,97,'2022-07-07 04:10:38.656000','cancelled','card','CC202267NL9W86',15000,13500,0,12825,-2175,0,-1500,0,-270,-405,0,NULL,0,'ready'),
(33,'2022-07-08 15:36:36.000000',NULL,'2022-07-08',NULL,NULL,4,27,98,'2022-07-07 04:12:26.175000','paid','card','CC202267NR2H66',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(34,'2022-07-12 15:36:45.000000',NULL,'2022-07-12',NULL,NULL,5,27,136,'2022-07-11 01:29:43.138000','paid','card','CC2022611N7M23A',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(35,'2022-07-12 15:36:45.000000',NULL,'2022-07-12',NULL,NULL,5,27,137,'2022-07-11 01:30:34.190000','cancelled','card','CC2022611N7M23A',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(36,'2022-07-12 15:36:45.000000',NULL,'2022-07-12',NULL,NULL,5,27,138,'2022-07-11 01:34:22.267000','paid','card','CC2022611NI948Y',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(37,'2022-07-12 15:36:45.000000',NULL,'2022-07-12',NULL,NULL,5,27,139,'2022-07-11 01:39:30.354000','paid','card','CC2022611N895JP',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(38,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,144,'2022-07-12 01:35:09.191000','paid','card','CC2022612N59C8L',7000,6300,0,5985,-1015,0,-700,0,-126,-189,0,NULL,0,'ready'),
(39,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,145,'2022-07-12 01:59:25.067000','paid','card','CC2022612N9W92A',13000,11700,0,11115,-1885,0,-1300,0,-234,-351,0,NULL,0,'ready'),
(40,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,146,'2022-07-12 01:59:35.290000','cancelled','card','CC2022612N9W92A',13000,11700,0,11115,-1885,0,-1300,0,-234,-351,0,NULL,0,'ready'),
(41,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,147,'2022-07-12 02:15:30.964000','paid','card','CC2022612N71N8U',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(42,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,151,'2022-07-12 02:18:32.285000','cancelled','card','CC2022612N71N8U',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(43,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,158,'2022-07-12 04:17:00.591000','paid','card','CC2022612N9F7I6',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(44,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,159,'2022-07-12 04:17:11.683000','cancelled','card','CC2022612N9F7I6',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(45,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,161,'2022-07-12 04:27:28.107000','paid','card','CC2022612N96C4D',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(46,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,162,'2022-07-12 04:27:34.984000','cancelled','card','CC2022612N96C4D',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(47,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,163,'2022-07-12 04:30:47.462000','paid','card','CC2022612NSJ028',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(48,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,164,'2022-07-12 04:30:53.422000','cancelled','card','CC2022612NSJ028',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(49,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,167,'2022-07-12 04:35:21.123000','paid','card','CC2022612N2Y1M6',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(50,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,169,'2022-07-12 04:36:13.099000','cancelled','card','CC2022612N2Y1M6',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(51,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,170,'2022-07-12 04:38:33.982000','paid','card','CC2022612NM987H',8000,6200,0,6890,-1110,0,-800,0,-124,-186,0,'dngg',-1000,'ready'),
(52,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,171,'2022-07-12 04:39:17.241000','cancelled','card','CC2022612NM987H',8000,6200,0,6890,-1110,0,-800,0,-124,-186,0,'dngg',-1000,'ready'),
(53,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,173,'2022-07-12 04:46:39.425000','paid','card','CC2022612N34A6I',7000,5300,0,6035,-965,0,-700,0,-106,-159,0,'dngg',-1000,'ready'),
(54,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,175,'2022-07-12 05:00:23.167000','paid','card','CC2022612N8NB53',9900,8464,0,8488,-1412,0,-990,0,-169,-253,0,'dngg',-446,'ready'),
(55,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,176,'2022-07-12 05:00:53.609000','cancelled','card','CC2022612N8NB53',9900,8464,0,8488,-1412,0,-990,0,-169,-253,0,'dngg',-446,'ready'),
(56,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,177,'2022-07-12 05:01:52.059000','paid','card','CC2022612NQ499B',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(57,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,178,'2022-07-12 05:15:15.740000','paid','card','CC2022612N85QY6',9900,8900,0,9455,-445,0,0,0,-178,-267,0,'dngg',-1000,'ready'),
(58,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,179,'2022-07-12 05:18:55.787000','paid','card','CC2022612ND4C69',9900,9900,0,9405,-495,0,0,0,-198,-297,0,NULL,0,'ready'),
(59,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,180,'2022-07-12 05:20:17.317000','paid','card','CC2022612N9BW88',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(60,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,192,'2022-07-12 05:43:17.036000','paid','card','CC2022612NCH895',33000,29700,0,28215,-4785,0,-3300,0,-594,-891,0,NULL,0,'ready'),
(61,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,204,'2022-07-12 05:51:33.339000','paid','card','CC2022612NJ3M15',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(62,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,234,'2022-07-12 06:12:50.277000','cancelled','card','CC2022612NJ3M15',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(63,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,248,'2022-07-12 06:19:27.600000','paid','card','CC2022612N498RD',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(64,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,255,'2022-07-12 06:28:53.917000','paid','card','CC2022612N88MJ8',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(65,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,259,'2022-07-12 06:31:03.344000','paid','card','CC2022612N5KC86',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(66,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,260,'2022-07-12 06:32:50.251000','paid','card','CC2022612N6A6S5',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(67,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,261,'2022-07-12 06:33:00.752000','cancelled','card','CC2022612N6A6S5',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(68,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,307,'2022-07-12 07:26:28.583000','paid','card','CC2022612N06HR1',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(69,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,308,'2022-07-12 07:27:35.008000','cancelled','card','CC2022612N06HR1',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(70,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,309,'2022-07-12 07:29:27.116000','paid','card','CC2022612N24HP2',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(71,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,311,'2022-07-12 07:30:35.599000','paid','card','CC2022612NU9H49',15000,13500,0,12825,-2175,0,-1500,0,-270,-405,0,NULL,0,'ready'),
(72,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,312,'2022-07-12 07:31:38.750000','paid','card','CC2022612N2RY94',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(73,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,321,'2022-07-12 07:42:28.417000','cancelled','card','CC2022612N498RD',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(74,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,347,'2022-07-12 08:15:42.728000','paid','card','CC2022612N3M6A1',7000,6300,0,5985,-1015,0,-700,0,-126,-189,0,NULL,0,'ready'),
(75,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,357,'2022-07-12 08:20:49.169000','paid','card','CC2022612NAS740',7000,6300,0,5985,-1015,0,-700,0,-126,-189,0,NULL,0,'ready'),
(76,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,360,'2022-07-12 08:22:35.765000','paid','card','CC2022612N280IB',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(77,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,365,'2022-07-12 08:28:39.612000','paid','card','CC2022612NP236K',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(78,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,366,'2022-07-12 08:31:06.195000','paid','card','CC2022612N176VT',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(79,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,367,'2022-07-12 08:35:43.632000','cancelled','card','CC2022612N176VT',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(80,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,368,'2022-07-12 08:41:10.115000','cancelled','card','CC2022612NP236K',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(81,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,369,'2022-07-12 08:44:33.641000','paid','card','CC2022612N68F2M',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(82,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,6,27,370,'2022-07-12 08:54:37.202000','cancelled','card','CC2022612N68F2M',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(83,'2022-07-14 15:37:03.000000',NULL,'2022-07-14',NULL,NULL,7,27,371,'2022-07-13 00:50:20.200000','paid','card','CC2022613N3H08C',7000,6300,0,5985,-1015,0,-700,0,-126,-189,0,NULL,0,'ready'),
(84,'2022-07-14 15:37:03.000000',NULL,'2022-07-14',NULL,NULL,7,27,372,'2022-07-13 01:00:22.008000','cancelled','card','CC2022613N3H08C',7000,6300,0,5985,-1015,0,-700,0,-126,-189,0,NULL,0,'ready'),
(85,'2022-07-14 15:37:03.000000',NULL,'2022-07-14',NULL,NULL,7,27,373,'2022-07-13 04:17:20.644000','paid','card','CC2022613ND8F92',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(86,'2022-07-14 15:37:03.000000',NULL,'2022-07-14',NULL,NULL,7,27,374,'2022-07-13 04:27:20.368000','paid','card','CC2022613N9AI81',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(87,'2022-07-15 15:37:12.000000',NULL,'2022-07-15',NULL,NULL,8,27,376,'2022-07-14 00:59:19.741000','paid','card','CC2022614NNW135',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(88,'2022-07-16 15:37:16.000000',NULL,'2022-07-16',NULL,NULL,9,27,395,'2022-07-15 06:07:20.115000','paid','card','CC2022615N78PA1',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(89,'2022-07-16 15:37:16.000000',NULL,'2022-07-16',NULL,NULL,9,27,396,'2022-07-15 06:17:23.942000','cancelled','card','CC2022615N78PA1',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(90,'2022-07-16 15:37:16.000000',NULL,'2022-07-16',NULL,NULL,9,27,397,'2022-07-15 06:28:50.299000','paid','card','CC2022615N00I5K',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(91,'2022-07-16 15:37:16.000000',NULL,'2022-07-16',NULL,NULL,9,27,398,'2022-07-15 06:38:53.867000','cancelled','card','CC2022615N00I5K',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(92,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,443,'2022-07-20 01:42:56.159000','paid','card','CC2022620N9M7I4',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(93,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,444,'2022-07-20 01:57:05.901000','paid','card','CC2022620NK6C59',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(94,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,445,'2022-07-20 01:57:19.313000','cancelled','card','CC2022620NK6C59',9000,8100,0,7695,-1305,0,-900,0,-162,-243,0,NULL,0,'ready'),
(95,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,446,'2022-07-20 01:58:16.661000','paid','card','CC2022620NW39D1',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(96,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,447,'2022-07-20 01:59:39.916000','paid','card','CC2022620N52L5D',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(97,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,448,'2022-07-20 01:59:55.143000','cancelled','card','CC2022620N52L5D',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(98,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,449,'2022-07-20 02:02:27.723000','paid','card','CC2022620N87K5H',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(99,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,450,'2022-07-20 02:04:16.460000','paid','card','CC2022620N2H8R1',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(100,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,451,'2022-07-20 02:20:01.298000','paid','card','CC2022620N77W7F',9900,9900,0,9405,-495,0,0,0,-198,-297,0,NULL,0,'ready'),
(101,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,452,'2022-07-20 04:51:29.201000','paid','card','CC2022620NC342D',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(102,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,453,'2022-07-20 05:20:42.644000','cancelled','card','CC2022620N87K5H',9900,8910,0,8465,-1435,0,-990,0,-178,-267,0,NULL,0,'ready'),
(103,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,454,'2022-07-20 05:53:41.824000','paid','card','CC2022620N991BA',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(104,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,455,'2022-07-20 05:54:42.519000','paid','card','CC2022620N9R12D',10000,9000,0,8550,-1450,0,-1000,0,-180,-270,0,NULL,0,'ready'),
(105,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,456,'2022-07-20 06:00:46.527000','paid','card','CC2022620N6R8A9',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(106,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,10,27,457,'2022-07-20 06:00:57.604000','cancelled','card','CC2022620N6R8A9',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(107,'2022-07-22 15:37:32.000000',NULL,'2022-07-22',NULL,NULL,11,27,483,'2022-07-21 04:52:47.990000','paid','card','CC2022621N117AC',8000,7200,0,6840,-1160,0,-800,0,-144,-216,0,NULL,0,'ready'),
(108,'2022-07-27 15:37:39.000000',NULL,'2022-07-27',NULL,NULL,12,27,532,'2022-07-26 08:21:38.730000','paid','card','CC2022626NH874I',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready'),
(109,'2022-07-27 15:37:39.000000',NULL,'2022-07-27',NULL,NULL,12,27,533,'2022-07-26 08:21:45.919000','cancelled','card','CC2022626NH874I',6000,5400,0,5130,-870,0,-600,0,-108,-162,0,NULL,0,'ready');
-- settlement_fee
INSERT INTO `settlement_fee` VALUES (1,'2022-08-04 06:36:05.235132',27,0,2,3);
-- settlement_sum
INSERT INTO `settlement_sum` VALUES 
(1,'2022-07-05 15:36:04.000000',NULL,'2022-07-05',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',2,45000,40500,0,38475,-6525,0,-4500,0,0,-1215,0,0,'ready'),
(2,'2022-07-06 15:36:16.000000',NULL,'2022-07-06',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',19,326700,296010,0,281210,-45490,0,-30690,0,0,-8880,0,0,'ready'),
(3,'2022-07-07 15:36:27.000000',NULL,'2022-07-07',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',8,81700,73530,0,69855,-11845,0,-8170,0,0,-2205,0,0,'ready'),
(4,'2022-07-08 15:36:36.000000',NULL,'2022-07-08',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',4,47000,42300,0,40185,-6815,0,-4700,0,0,-1269,0,0,'ready'),
(5,'2022-07-12 15:36:45.000000',NULL,'2022-07-12',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',4,34000,30600,0,29070,-4930,0,-3400,0,0,-918,0,0,'ready'),
(6,'2022-07-13 15:36:52.000000',NULL,'2022-07-13',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',45,417900,373198,0,359436,-58464,0,-39810,0,0,-11192,0,-4892,'ready'),
(7,'2022-07-14 15:37:03.000000',NULL,'2022-07-14',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',4,33000,29700,0,28215,-4785,0,-3300,0,0,-891,0,0,'ready'),
(8,'2022-07-15 15:37:12.000000',NULL,'2022-07-15',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',1,8000,7200,0,6840,-1160,0,-800,0,0,-216,0,0,'ready'),
(9,'2022-07-16 15:37:16.000000',NULL,'2022-07-16',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',4,36000,32400,0,30780,-5220,0,-3600,0,0,-972,0,0,'ready'),
(10,'2022-07-21 15:37:25.000000',NULL,'2022-07-21',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',15,133600,121230,0,115170,-18430,0,-12370,0,0,-3636,0,0,'ready'),
(11,'2022-07-22 15:37:32.000000',NULL,'2022-07-22',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',1,8000,7200,0,6840,-1160,0,-800,0,0,-216,0,0,'ready'),
(12,'2022-07-27 15:37:39.000000',NULL,'2022-07-27',NULL,NULL,27,'미수라 도시락','미수라도시락(춘천시청점)','524-81-01294',2,12000,10800,0,10260,-1740,0,-1200,0,0,-324,0,0,'ready');
-- settlement_sum_snapshot
INSERT INTO `settlement_sum_snapshot` VALUES 
(1,'2022-07-05 15:36:04.000000',1,'ready'),
(2,'2022-07-06 15:36:16.000000',2,'ready'),
(3,'2022-07-07 15:36:27.000000',3,'ready'),
(4,'2022-07-08 15:36:36.000000',4,'ready'),
(5,'2022-07-12 15:36:45.000000',5,'ready'),
(6,'2022-07-13 15:36:52.000000',6,'ready'),
(7,'2022-07-14 15:37:03.000000',7,'ready'),
(8,'2022-07-15 15:37:12.000000',8,'ready'),
(9,'2022-07-16 15:37:16.000000',9,'ready'),
(10,'2022-07-21 15:37:25.000000',10,'ready'),
(11,'2022-07-22 15:37:32.000000',11,'ready'),
(12,'2022-07-27 15:37:39.000000',12,'ready');
