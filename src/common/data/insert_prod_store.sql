-- role ( 슈퍼관리자, 관리자, CS담당자, 운영자, 매출관리자, 점주)
INSERT INTO `prod_store`.`role` (title) VALUES ('admin');
INSERT INTO `prod_store`.`role` (title) VALUES ('manager');
INSERT INTO `prod_store`.`role` (title) VALUES ('cs');
INSERT INTO `prod_store`.`role` (title) VALUES ('operator');
INSERT INTO `prod_store`.`role` (title) VALUES ('sales');
INSERT INTO `prod_store`.`role` (title) VALUES ('store');
-- permission
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('운영자메인',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('운영자관리',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('회원관리','일반회원정보');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('회원관리','점주정보');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('홈관리','추천메뉴');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('게시판관리','공지사항');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('게시판관리','이벤트');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('고객센터','일반고객문의');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('고객센터','사장님문의');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('고객센터','FAQ');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('쿠폰관리',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('포인트관리','포인트현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('포인트관리','포인트관리');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('매출관리','매출현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('매출관리','결제현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('이용약관',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('개인정보처리방침',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('점주메인',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('가게관리','가게정보');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('가게관리','영업관리');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('가게관리','수수료설정');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('메뉴관리',null);
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('쿠폰관리','쿠폰현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('리뷰관리','리뷰현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('리뷰관리','재주문율');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('정산관리','정산현황');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('정산관리','가게정산');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('정산관리','기부정산');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('공지/안내','공지사항');
INSERT INTO `prod_store`.`permission` (title,subtitle) VALUES ('공지/안내','문의하기');
-- role_permission
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,1);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,2);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,3);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,4);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,5);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,6);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,7);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,8);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,9);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,10);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,11);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,12);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,13);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,14);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,15);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,16);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,17);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,18);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,19);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,20);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,21);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,22);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,23);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,24);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,25);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,26);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,27);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,28);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,29);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (1,30);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,1);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,3);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,4);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,5);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,6);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,7);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,8);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,9);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,10);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,11);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,12);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,13);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,14);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,15);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,16);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,17);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,18);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,19);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,20);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,21);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,22);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,23);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,24);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,25);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,26);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,27);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,28);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,29);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (2,30);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,18);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,19);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,20);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,21);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,22);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,23);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,24);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,25);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,26);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,27);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,28);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,29);
INSERT INTO `prod_store`.`role_permission` (role_id,permission_id) VALUES (6,30);
-- owner
INSERT INTO `prod_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (1,'dev@foodnet24.com','123123','010-1111-1234','관리자','email',null,null,null,'개발');
INSERT INTO `prod_store`.`owner` (role_id,username,password,phone_number,full_name,signup_type,business_name,business_address1,business_number,department)
VALUES (2,'kimwon@foodnet24.com','123123','010-1111-1234','김원','email',null,null,null,'개발');
-- category
INSERT INTO `prod_store`.`category` (name) VALUES ('한식');
INSERT INTO `prod_store`.`category` (name) VALUES ('양식');
INSERT INTO `prod_store`.`category` (name) VALUES ('중식');
INSERT INTO `prod_store`.`category` (name) VALUES ('일식');
INSERT INTO `prod_store`.`category` (name) VALUES ('치킨');
INSERT INTO `prod_store`.`category` (name) VALUES ('야식');
INSERT INTO `prod_store`.`category` (name) VALUES ('패스트푸드');
-- icon
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','good','착한가게');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','popular','인기가게');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','new','신규가게');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','coupon','쿠폰');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','package','포장');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','inStore','매장');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('store','clean','위생');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('menu','order','주문');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('menu','signature','대표');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('menu','new','신규');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('menu','recommended','추천');
INSERT INTO `prod_store`.`icon` (type,name,description) VALUES ('menu','adult','19');
-- code
INSERT INTO `prod_store`.`code`(id, parent_id, ref, depth, name, description) 
VALUES (1, 0, 'target', 0, 'coupon_target', '쿠폰적용대상');
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (2, 1, 'target', 1, 'all', '전체', 1);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (3, 1, 'target', 1, 'area', '지역', 2);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (4, 1, 'target', 1, 'rank', '등급', 3);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (5, 3, 'target', 2, 'CC', '춘천', 1);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (6, 4, 'target', 2, 'rookie', '새내기', 1);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (7, 4, 'target', 2, 'local', '주민', 2);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (8, 4, 'target', 2, 'neighbor', '이웃', 3);
INSERT INTO `prod_store`.`code` (id, parent_id, ref, depth, name, description, position) 
VALUES (9, 4, 'target', 2, 'regular', '단골', 4);
-- settlement_fee
INSERT INTO `prod_store`.`settlement_fee` (`store_id`,`admission`,`agency`,`billing`) VALUES (1, 0, 2, 3);
INSERT INTO `prod_store`.`settlement_fee` (`store_id`,`admission`,`agency`,`billing`) VALUES (2, 0, 2, 3);
INSERT INTO `prod_store`.`settlement_fee` (`store_id`,`admission`,`agency`,`billing`) VALUES (3, 0, 2, 3);