CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NULL DEFAULT NULL,
  `full_name` varchar(255) NULL DEFAULT NULL,
  `signup_type` varchar(255) NULL DEFAULT NULL,
  `birthday` varchar(10) NULL DEFAULT NULL COMMENT '생년월일',
  `profile_image` varchar(255) DEFAULT NULL COMMENT '프로필 이미지',
  `is_benefit_noti` boolean DEFAULT false COMMENT '동네가게 혜택 알림 동의',  
  `is_benefit_noti_at` timestamp(6) NULL  DEFAULT null COMMENT '동네가게 혜택 알림 여부 일자',
  `is_event_noti` boolean DEFAULT false COMMENT '동네가게 이벤트 알림 동의',  
  `is_event_noti_at` timestamp(6) NULL  DEFAULT null COMMENT '동네가게 이벤트 알림 여부 일자',
  `is_discount_noti` boolean DEFAULT false COMMENT '동네가게 할인 알림 동의',  
  `is_discount_noti_at` timestamp(6) NULL  DEFAULT null COMMENT '동네가게 할인 알림 여부 일자',
  `is_delivery_noti` boolean DEFAULT false COMMENT '배달현황 알림 동의',  
  `is_email_noti` boolean DEFAULT false COMMENT '이메일 알림 여부',
  `is_email_noti_at` timestamp(6) NULL  DEFAULT null COMMENT '이메일 알림 여부 일자',
  `is_sms_noti` boolean DEFAULT false COMMENT 'SMS 알림 여부',
  `is_sms_noti_at` timestamp(6) NULL  DEFAULT null COMMENT 'SMS 알림 여부 일자',
  `withdrawal_reason` varchar(255) NULL DEFAULT NULL COMMENT '회원 탈퇴 사유',
  `level` int NULL DEFAULT NULL COMMENT '회원레벨(일반회원_C1-1|바우처회원_C2-2|C3_기부회원-3)',
  `rank` varchar(20) NULL DEFAULT NULL COMMENT '회원등급(새내기-rookie|주민-local|이웃-neighbor|단골-regular)',
  `memo` varchar(1000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `user_address` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `area` varchar(20) NOT NULL COMMENT '주소지(우리집|회사|기타)',
  `type` varchar(20) NOT NULL COMMENT '주소체계(지번-jibun|도로명-road)',
  `address1` varchar(255) NOT NULL,
  `address2` varchar(255) NULL DEFAULT NULL,
  `region1` varchar(30) NULL DEFAULT NULL COMMENT '시도 단위',
  `region2`  varchar(40) NULL DEFAULT NULL COMMENT '구 단위',
  `region3` varchar(40) NULL DEFAULT NULL COMMENT '동 단위',
  `region4` varchar(50) NULL DEFAULT NULL COMMENT '행정동 명칭',
  `latitude` double NULL DEFAULT NULL COMMENT '위도',
  `longitude`  double NULL DEFAULT NULL COMMENT '경도',
  `is_use` boolean DEFAULT true COMMENT '사용 여부(현재 사용하고 있는 주소)',
  PRIMARY KEY (`id`)
);

CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `title` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `title` varchar(50) NOT NULL,
  `subtitle` varchar(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `role_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `owner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `role_id` int NOT NULL,
  `is_confirmed` boolean DEFAULT false COMMENT '가게인증 여부 - 점주일 경우 필수 항목',
  `is_benefit_noti` boolean DEFAULT false COMMENT '동네가게 혜택 알림 동의 - 점주일 경우 필수 항목',
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) NULL DEFAULT NULL COMMENT '휴대전화 - 점주일 경우 필수 항목',
  `full_name` varchar(255) NULL DEFAULT NULL,
  `signup_type` varchar(255) NULL DEFAULT NULL,
  `business_name` varchar(50) NULL DEFAULT NULL,
  `business_address1` varchar(255) NULL DEFAULT NULL,
  `business_address2` varchar(255) NULL DEFAULT NULL,
  `business_number` varchar(20) NULL DEFAULT NULL,
  `department` varchar(20) NULL DEFAULT NULL COMMENT '소속 부서 - 운영자 전용',
  `memo` varchar(2000) NULL DEFAULT NULL COMMENT '회원 메모 - 점주 전용',
  `status` varchar(20) DEFAULT 'request' COMMENT '점주 인가 상태(요청-request|승인-confirm|반려-reject) - 점주 전용',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
);

CREATE TABLE `owner_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `owner_id` int NOT NULL,
  `image_file_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `owner_id` int NOT NULL,
  `category` varchar(50) DEFAULT NULL COMMENT '업종(한식|양식|중식|일식|치킨|야식|패스트푸드)',
  `name` varchar(50) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `min_order_price` int DEFAULT NULL,
  `delivery_price` int DEFAULT NULL,
  `delivery_area` varchar(255) DEFAULT NULL,
  `hygiene` varchar(255) DEFAULT NULL,
  `instruction` varchar(255) DEFAULT NULL,
  `intro` varchar(3000) DEFAULT NULL,
  `relay_to` VARCHAR(20) NULL DEFAULT 'POS' COMMENT '주문 전달/취소 대상(포스-POS|푸드넷24-FOODNET24)',
  `cover_image1` varchar(255) DEFAULT NULL,
  `cover_image2` varchar(255) DEFAULT NULL,
  `cover_image3` varchar(255) DEFAULT NULL,
  `cover_image4` varchar(255) DEFAULT NULL,
  `cover_image5` varchar(255) DEFAULT NULL,
  `cover_image6` varchar(255) DEFAULT NULL,
  `is_package` boolean DEFAULT true,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `origin` varchar(3000) DEFAULT NULL,
  `open_status` varchar(10) DEFAULT 'ready' COMMENT '영업상황(준비-ready|시작-open|중지-stop|종료-close)',
  `open_settings_type` varchar(10) DEFAULT 'allWeek' COMMENT '영업시간설정 구분(평일주말동일-allweek|평일주말구분-weekday|요일별구분-dayofweek)',
  `is_break_hours` boolean DEFAULT true,
  `is_rest_days` boolean DEFAULT true,
  `open_hours` varchar(255) DEFAULT NULL,
  `break_hours` varchar(255) DEFAULT NULL,
  `rest_days` varchar(255) DEFAULT NULL,
  `cooking_time` int DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store_open_hour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `day_of_week` varchar(10) NOT NULL COMMENT '요일(monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
  `is_all_hours` boolean DEFAULT false COMMENT '24시간 영업 유무',
  `is_rest_day` boolean DEFAULT false COMMENT '휴무일 유무',
  `open_hour` int DEFAULT 0,
  `open_min` int DEFAULT 0,
  `close_hour` int DEFAULT 0,
  `close_min` int DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store_break_hour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `start_hour` int DEFAULT 0,
  `start_min` int DEFAULT 0,
  `end_hour` int DEFAULT 0,
  `end_min` int DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store_stop_hour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `is_not_settings` boolean DEFAULT false COMMENT '시간 설정 안함(설정안함-true, 설정함-false)',
  `message` varchar(255) NOT NULL COMMENT '가게사정|재료소진|직접입력...',
  `date` date NOT NULL COMMENT '날짜(yyyy-MM-dd)',
  `start_hour` int DEFAULT 0,
  `start_min` int DEFAULT 0,
  `end_hour` int DEFAULT 0,
  `end_min` int DEFAULT 0,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `image_file_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `store_review` (	
  `id` int NOT NULL AUTO_INCREMENT,	
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),	
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),	
  `deleted_at` timestamp(6) NULL DEFAULT NULL,	
  `user_id` int NOT NULL,	
  `store_id` int NOT NULL,
  `order_id` int NOT NULL,
  `taste` boolean DEFAULT false COMMENT '맛(0 ~ 1)',	
  `portion` boolean DEFAULT false COMMENT '양(0 ~ 1)', 
  `hygiene` boolean DEFAULT false COMMENT '위생[포장](0 ~ 1)',
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `image3` varchar(255) DEFAULT NULL,
  `image4` varchar(255) DEFAULT NULL,
  `image5` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)	
);

CREATE TABLE `store_review_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_review_id` int NOT NULL,
  `image_file_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `category_store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `bookmark` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `store_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `image_file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `folder` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `owner_id` int DEFAULT NULL,
  `store_id` int DEFAULT NULL,
  `menu_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `icon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `type` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `icon_store` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `icon_id` int NOT NULL,
  `store_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `icon_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `icon_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(10) DEFAULT 'normal' COMMENT '분류(일반-normal|바우처-voucher)',
  `description` varchar(255) DEFAULT NULL,
  `menu_count` int DEFAULT 0,
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL COMMENT '가게 id, 메뉴는 독립적 - 메뉴그룹에 추가/삭제 가능해야함',
  `menu_group_id` int NOT NULL,
  `menu_group_name` varchar(50) DEFAULT NULL,
  `menu_image` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `combo` varchar(255) DEFAULT NULL COMMENT '메뉴 구성, 예) 치즈떡볶이(2인분)+순대(1인분)',
  `description` varchar(1000) DEFAULT NULL COMMENT '메뉴 설명, 예) 치즈를 넉넉하게 올린...',
  `is_signature` boolean DEFAULT false,
  `is_popular` boolean DEFAULT false,
  `is_donation` boolean DEFAULT false,
  `is_soldout` boolean DEFAULT false,
  `is_hidden` boolean DEFAULT false,
  `base_price` int DEFAULT 0,
  `required_option` int DEFAULT 0,
  `optional_option` int DEFAULT 0,
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `menu_id` int NOT NULL,
  `image_file_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `menu_id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL COMMENT '가격명 - 생략가능 예) 1~2인분',
  `discount` int NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu_signature` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `option_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL COMMENT '가게 id, 옵션그룹은 독립적 - 메뉴에 추가/삭제 가능해야함',
  `name` varchar(50) NOT NULL COMMENT '옵션그룹명, 예) 필수 옵션, 토핑 선택 등',
  `is_required` boolean DEFAULT true COMMENT '필수 여부, 예) 옵션을 반드시 선택해야 주문이 가능해요',
  `min_option` int NOT NULL COMMENT '최소 옵션수, 필수일 경우 1 선택일 경우 0',
  `max_option` int NOT NULL COMMENT '최대 옵션수, 필수일 경우 1 선택일 경우 옵션그룹의 총 옵션수 이하',
  `option_count` int DEFAULT 0,
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `store_id` int NOT NULL COMMENT '가게 id, 옵션은 독립적 - 옵션그룹에 추가/삭제 가능해야함',
  `option_group_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` int NOT NULL,
  `is_soldout` boolean DEFAULT false,
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `menu_option_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `menu_id` int NOT NULL,
  `option_group_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tray` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `menu_id` int NOT NULL,
  `price_id` int NOT NULL,
  `number` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tray_option_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `tray_id` int NOT NULL,
  `option_group_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `tray_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  `tray_option_group_id` int NOT NULL,
  `option_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `recommend_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `menu_keyword1` varchar(50) NOT NULL COMMENT '메뉴키워드1 필수',
  `menu_keyword2` varchar(50) DEFAULT NULL COMMENT '메뉴키워드2 선택',
  `menu_keyword3` varchar(50) DEFAULT NULL COMMENT '메뉴키워드3 선택',
  `started_at` timestamp(6) NULL DEFAULT NULL COMMENT '시작일',
  `ended_at` timestamp(6) NULL DEFAULT NULL COMMENT '종료일',
  `is_all_areas` boolean DEFAULT false COMMENT '노출지역 전체 여부',
  `is_displayed` boolean DEFAULT false COMMENT '노출 여부',
  `position` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `recommend_category_area` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `recommend_category_id` int NOT NULL,
  `category` varchar(20) NOT NULL COMMENT '지역분류(대분류-large|중분류-medium|소분류-small)',
  `name` varchar(20) NOT NULL COMMENT '지역명(seoul|busan|daegu|incheon|gwangju|daejeon|ulsan|sejong|gyeonggi|gangwon|chungbuk|chungnam|jeonbuk|jeonnam|gyeongbuk|gyeongnam|jeju)',
  PRIMARY KEY (`id`)
);

CREATE TABLE `recommend_category_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `recommend_category_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `discount_category_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `category_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `completed_at` timestamp(6) NULL DEFAULT NULL COMMENT '조리 완료 시간',
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `reception_number` int NOT NULL COMMENT '접수번호, 가게마다 매일 오픈 후 첫주문부터 시작, 예) 123',
  `order_number` varchar(20) NOT NULL COMMENT '주문번호, 주문전체 유니크한 영어 대문자 + 숫자 조합, 예) B10S01WV7R',
  `order_status` varchar(50) NULL DEFAULT 'ready' COMMENT '주문상황, 주문확인/주문취소(고객취소|매장취소)/주문접수/조리중/조리완료/픽업완료',
  `cancel_code` int DEFAULT NULL COMMENT '주문취소(메뉴 또는 옵션이 품절-10|제조지연-20|고객요청-30|기타 사유-40|배달불가능지역-50|고객정보 부정확-60)',
  `cooking_time` int DEFAULT NULL COMMENT '조리시간(분)',
  `is_disposable` boolean DEFAULT false,
  `request` varchar(500) DEFAULT NULL,
  `using_method` varchar(20) DEFAULT '포장',
  `payment` varchar(20) NULL DEFAULT NULL,
  `total_price` int NOT NULL,
  `discount_price` int NOT NULL,
  `coupon_price` int DEFAULT 0 COMMENT '쿠폰 할인금액',
  `purchase_price` int NOT NULL,
  `coupon_issuer` varchar(20) DEFAULT NULL COMMENT '쿠폰발행자(동네가게-dngg|점주-owner)',
  `type` varchar(20) NULL DEFAULT NULL COMMENT '주소체계(지번-jibun|도로명-road)',
  `address1` varchar(255) NULL DEFAULT NULL,
  `address2` varchar(255) NULL DEFAULT NULL,
  `region1` varchar(30) NULL DEFAULT NULL COMMENT '시도 단위',
  `region2`  varchar(40) NULL DEFAULT NULL COMMENT '구 단위',
  `region3` varchar(40) NULL DEFAULT NULL COMMENT '동 단위',
  `region4` varchar(50) NULL DEFAULT NULL COMMENT '행정동 명칭',
  `latitude` double NULL DEFAULT NULL COMMENT '위도',
  `longitude`  double NULL DEFAULT NULL COMMENT '경도',
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_id` int NOT NULL,
  `menu_id` int NOT NULL COMMENT '메뉴 아이디, 재주문시 활용',
  `number` int NOT NULL COMMENT '수량, 재주문시 활용',
  `menu_image` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `combo` varchar(255) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_menu_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_menu_id` int NOT NULL,
  `menu_price_id` int NOT NULL COMMENT '메뉴가격 아이디, 재주문시 활용',
  `name` varchar(50) DEFAULT NULL COMMENT '가격명 - 생략가능 예) 1~2인분',
  `discount` int NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_option_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_menu_id` int NOT NULL COMMENT '주문메뉴 아이디',
  `option_group_id` int NOT NULL COMMENT '옵션그룹 아이디, 재주문시 활용',
  `name` varchar(50) NOT NULL COMMENT '옵션그룹명',
  `is_required` boolean DEFAULT true COMMENT '필수 여부',
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_option` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_option_group_id` int NOT NULL COMMENT '주문옵션그룹 아이디',
  `option_id` int NOT NULL COMMENT '옵션 아이디, 재주문시 활용',
  `name` varchar(50) NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `payment_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_id` int NOT NULL COMMENT '주문 아이디',
  `status` varchar(20) NOT NULL COMMENT '구분(아임포트 결제상태). paid:결제완료, cancelled:결제취소 = [paid, cancelled]',
  `owner_id` int NULL DEFAULT NULL COMMENT '주문취소 작성자(운영자) 아이디',
  PRIMARY KEY (`id`)
);

CREATE TABLE `settlement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `done_at` timestamp(6) NULL DEFAULT NULL COMMENT '정산완료일시',
  `created_date` varchar(10) NOT NULL COMMENT '생성일(yyyy-MM-dd)',
  `ready_date` varchar(10) NULL DEFAULT NULL COMMENT '대기일(yyyy-MM-dd)',
  `expected_date` varchar(10) NULL DEFAULT NULL COMMENT '예정일(yyyy-MM-dd)',
  `done_date` varchar(10) NULL DEFAULT NULL COMMENT '완료일(yyyy-MM-dd)',
  `pending_date` varchar(10) NULL DEFAULT NULL COMMENT '보류일(yyyy-MM-dd)',
  `settlement_sum_id` int DEFAULT 0 COMMENT '정산합계 아이디',
  `store_id` int NOT NULL COMMENT '가게 아이디',
  `store_name` varchar(50) NULL DEFAULT NULL COMMENT '가게명',
  `business_name` varchar(50) NULL DEFAULT NULL COMMENT '상호명',
  `payment_snapshot_id` int NOT NULL COMMENT '결제현황 아이디',
  `payment_snapshot_date` timestamp(6) NOT NULL COMMENT '결제현황 생성일(주문/취소일)',
  `payment_snapshot_status` varchar(20) NOT NULL COMMENT '구분(아임포트 결제상태). paid:결제완료, cancelled:결제취소 = [paid, cancelled]',
  `pay_method` varchar(50) NULL COMMENT 'samsung:삼성페이|card:신용카드|trans:계좌이체|vbank:가상계좌|phone:휴대폰|cultureland:문화상품권|smartculture:스마트문상|booknlife:도서문화상품권|happymoney:해피머니|point:포인트|ssgpay:SSGPAY|lpay:LPAY|payco:페이코|kakaopay:카카오페이|tosspay:토스|naverpay:네이버페이',
  `order_number` varchar(20) NOT NULL COMMENT '주문번호,',
  `sales_price` int NOT NULL COMMENT '매출금액(주문금액 + 고객부담 배달료)',
  `order_price` int NOT NULL COMMENT '주문금액',
  `user_delivery_price` int DEFAULT 0 COMMENT '고객부담 배달료',
  `payment_price` int NOT NULL COMMENT '결제/취소금액',
  `voucher_price` int DEFAULT 0 COMMENT '바우처결제',
  `settlement_price` int NOT NULL COMMENT '정산금액(매출금액 + 공제금액 + 부가세)',
  `deduction_price` int NOT NULL COMMENT '공제금액',
  `owner_delivery_price` int DEFAULT 0 COMMENT '공제금액 상세-점주부담 배달료',
  `discount_price` int DEFAULT 0 COMMENT '공제금액 상세-사장님 할인',
  `agency_price` int NOT NULL COMMENT '공제금액 상세-중개수수료',
  `billing_price` int NOT NULL COMMENT '공제금액 상세-결제수수료',
  `point_price` int DEFAULT 0 COMMENT '공제금액 상세-포인트',
  `owner_coupon_price` int DEFAULT 0 COMMENT '공제금액 상세-사장님 쿠폰',
  `dngg_coupon_price` int DEFAULT 0 COMMENT '동네가게 쿠폰',
  `vat_price` int NOT NULL COMMENT '부가세',
  `status` varchar(20) NOT NULL COMMENT '정산상태(대기-ready|완료-done|보류-pending)',
  `is_cancelled` boolean DEFAULT false COMMENT '결제취소 여부, 결제완료(payment_snapshot_status > paid)인 경우만 참조',
  PRIMARY KEY (`id`)
);

CREATE TABLE `settlement_fee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `store_id` int NOT NULL COMMENT '가게 아이디',
  `admission` float DEFAULT 0 COMMENT '입점수수료(퍼센티지)',
  `agency` float NOT NULL COMMENT '중개수수료(퍼센티지)',
  `billing` float NOT NULL COMMENT '결제수수료(퍼센티지)',
  `delivery` float NOT NULL COMMENT '배달수수료(퍼센티지)',
  PRIMARY KEY (`id`)
);

CREATE TABLE `settlement_sum` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `done_at` timestamp(6) NULL DEFAULT NULL COMMENT '정산완료일시',
  `created_date` varchar(10) NOT NULL COMMENT '생성일(yyyy-MM-dd)',
  `ready_date` varchar(10) NULL DEFAULT NULL COMMENT '대기일(yyyy-MM-dd)',
  `expected_date` varchar(10) NULL DEFAULT NULL COMMENT '예정일(yyyy-MM-dd)',
  `done_date` varchar(10) NULL DEFAULT NULL COMMENT '완료일(yyyy-MM-dd)',
  `pending_date` varchar(10) NULL DEFAULT NULL COMMENT '보류일(yyyy-MM-dd)',
  `store_id` int NOT NULL COMMENT '가게 아이디',
  `store_name` varchar(50) NULL DEFAULT NULL COMMENT '가게명',
  `business_name` varchar(50) NULL DEFAULT NULL COMMENT '상호명',
  `business_number` varchar(20) NULL DEFAULT NULL COMMENT '사업자등록번호',
  `order_count` int NOT NULL COMMENT '주문 건수',
  `sales_amount` int NOT NULL COMMENT '매출금액(주문금액 + 고객부담 배달료)',
  `order_amount` int NOT NULL COMMENT '주문금액',
  `user_delivery_amount` int DEFAULT 0 COMMENT '고객부담 배달료',
  `payment_amount` int NOT NULL COMMENT '결제/취소금액',
  `voucher_amount` int DEFAULT 0 COMMENT '바우처결제',
  `settlement_amount` int NOT NULL COMMENT '정산금액(매출금액 + 공제금액 + 부가세)',
  `deduction_amount` int NOT NULL COMMENT '공제금액',
  `owner_delivery_amount` int DEFAULT 0 COMMENT '공제금액 상세-점주부담 배달료',
  `discount_amount` int DEFAULT 0 COMMENT '공제금액 상세-사장님 할인',
  `agency_amount` int NOT NULL COMMENT '공제금액 상세-중개수수료',
  `billing_amount` int NOT NULL COMMENT '공제금액 상세-결제수수료',
  `point_amount` int DEFAULT 0 COMMENT '공제금액 상세-포인트',
  `owner_coupon_amount` int DEFAULT 0 COMMENT '공제금액 상세-사장님 쿠폰',
  `dngg_coupon_amount` int DEFAULT 0 COMMENT '동네가게 쿠폰',
  `vat_amount` int NOT NULL COMMENT '부가세',
  `status` varchar(20) NOT NULL COMMENT '정산상태(대기-ready|완료-done|보류-pending)',
  PRIMARY KEY (`id`)
);

CREATE TABLE `settlement_sum_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `settlement_sum_id` int NOT NULL COMMENT '정산합계 아이디',
  `status` varchar(20) NOT NULL COMMENT '정산상태(대기-ready|완료-done|보류-pending)',
  PRIMARY KEY (`id`)
);

CREATE TABLE `coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,  
  `name` varchar(255) NOT NULL COMMENT '쿠폰명',
  `opened_at` timestamp(6) NULL DEFAULT NULL COMMENT '오픈 시간',  
  `started_at` timestamp(6) NULL DEFAULT NULL COMMENT '적용 기간 - 시작',  
  `ended_at` timestamp(6) NULL DEFAULT NULL COMMENT '적용 기간 - 종료',  
  `is_duplicate` boolean DEFAULT false COMMENT '중복 적용 가능 여부',
  `benefit` varchar(255) NULL DEFAULT NULL COMMENT '적용구분(할인: discount, 적립: accumulate)',  
  `min_price` int DEFAULT NULL COMMENT '적용가능금액(최소이용금액)',  
  `discount_rate` int DEFAULT NULL COMMENT '%할인율',
  `max_discount_price` int DEFAULT NULL COMMENT '% 할인시 최대 금액',
  `discount_price` int DEFAULT NULL COMMENT '할인 금액',
  `issued_count` int DEFAULT NULL COMMENT '발급 수',
  `limit_count` int DEFAULT NULL COMMENT '인당 제한 수 설정 : (null : 제한없음, 숫자: 제한)',
  `download_count` int DEFAULT NULL COMMENT '다운로드 수',
  `is_disabled` boolean DEFAULT false COMMENT '비활성 여부',
  `store_id` int NULL DEFAULT NULL COMMENT '가게ID',
  `created_by` int NULL DEFAULT NULL COMMENT '등록인',
  `updated_by` int NULL DEFAULT NULL COMMENT '수정인',  
  PRIMARY KEY (`id`)
);

CREATE TABLE `coupon_download` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `used_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '쿠폰 사용 일자',
  `user_id` int NOT NULL COMMENT '유저 아이디',
  `coupon_id` int NOT NULL COMMENT '쿠폰 아이디',
  `order_id` int NOT NULL COMMENT '주문 아이디',
  `is_use` boolean DEFAULT false COMMENT '사용 여부',
  PRIMARY KEY (`id`)
);

CREATE TABLE `coupon_disabled_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),  
  `created_by` int NOT NULL COMMENT '유저 아이디',
  `coupon_id` int NOT NULL COMMENT '쿠폰 아이디',
  `is_disabled` boolean DEFAULT false COMMENT '비활성 여부',
  PRIMARY KEY (`id`)
);

CREATE TABLE `coupon_target` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `coupon_id` int NOT NULL COMMENT '쿠폰 아이디',
  `code_id` int NOT NULL COMMENT '대상 아이디(공통코드 아이디)',  
  PRIMARY KEY (`id`)
);

CREATE TABLE `code` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT 0,
  `ref` varchar(20) NOT NULL COMMENT '적용대상(target)',
  `depth` int NULL DEFAULT NULL COMMENT '0 : 코드 종류, 1 대분류 : 2 중분류 3: 소분류 ...',
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `position` int NOT NULL DEFAULT 1 COMMENT '순서',
  `is_disabled` boolean DEFAULT false COMMENT '비활성 여부', 
  PRIMARY KEY (`id`)
);

CREATE TABLE `iamport_payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,  
  `imp_uid` varchar(50) NOT NULL COMMENT '아임포트 결제 고유 UID',
  `merchant_uid` varchar(50) NOT NULL COMMENT '가맹점에서 전달한 거래 고유 UID',
  `pay_method` varchar(50) NULL COMMENT 'samsung:삼성페이|card:신용카드|trans:계좌이체|vbank:가상계좌|phone:휴대폰|cultureland:문화상품권|smartculture:스마트문상|booknlife:도서문화상품권|happymoney:해피머니|point:포인트|ssgpay:SSGPAY|lpay:LPAY|payco:페이코|kakaopay:카카오페이|tosspay:토스|naverpay:네이버페이',
  `channel` varchar(10) NULL COMMENT '결제가 발생된 경로. pc:(인증방식)PC결제, mobile:(인증방식)모바일결제, api:정기결제 또는 비인증방식결제 = [pc, mobile, api]',
  `pg_provider` varchar(20) NULL COMMENT 'PG사 명칭. inicis(이니시스) / nice(나이스정보통신)',
  `emb_pg_provider` varchar(20) NULL COMMENT '허브형결제 PG사 명칭. chai(차이) / kakaopay(카카오페이)',
  `pg_tid` varchar(50) NULL COMMENT 'PG사 승인정보',
  `pg_id` varchar(50) NULL COMMENT '거래가 처리된 PG사 상점아이디',
  `escrow` boolean DEFAULT false COMMENT '에스크로결제 여부',
  `apply_num` varchar(50) NULL COMMENT '카드사 승인정보(계좌이체/가상계좌는 값 없음)',
  `bank_code` varchar(50) NULL COMMENT '은행 표준코드 - (금융결제원기준)',
  `bank_name` varchar(50) NULL COMMENT '은행 명칭 - (실시간계좌이체 결제 건의 경우)',
  `card_code` varchar(10) NULL COMMENT '카드사 코드번호(금융결제원 표준코드번호) = [361(BC카드), 364(광주카드), 365(삼성카드), 366(신한카드), 367(현대카드), 368(롯데카드), 369(수협카드), 370(씨티카드), 371(NH카드), 372(전북카드), 373(제주카드), 374(하나SK카드), 381(KB국민카드), 041(우리카드), 071(우체국)]',
  `card_name` varchar(10) NULL COMMENT '카드사 명칭 - (신용카드 결제 건의 경우)',
  `card_quota` int NULL COMMENT '할부개월 수(0이면 일시불)',
  `card_number` varchar(50) NULL COMMENT '결제에 사용된 마스킹된 카드번호. 7~12번째 자리를 마스킹하는 것이 일반적이지만, PG사의 정책/설정에 따라 다소 차이가 있을 수 있음',
  `card_type` int NULL COMMENT '카드유형. (주의)해당 정보를 제공하지 않는 일부 PG사의 경우 null 로 응답됨(ex. JTNet, 이니시스-빌링) = [null, 0(신용카드), 1(체크카드)]',
  `vbank_code` varchar(50) NULL COMMENT '가상계좌 은행 표준코드 - (금융결제원기준)',
  `vbank_name` varchar(50) NULL COMMENT '입금받을 가상계좌 은행명',
  `vbank_num` varchar(50) NULL COMMENT '입금받을 가상계좌 계좌번호',
  `vbank_holder` varchar(50) NULL COMMENT '입금받을 가상계좌 예금주',
  `vbank_date` int NULL COMMENT '입금받을 가상계좌 마감기한 UNIX timestamp',
  `vbank_issued_at` int NULL COMMENT '가상계좌 생성 시각 UNIX timestamp',
  `name` varchar(50) NULL COMMENT '주문명칭',
  `amount` int NULL COMMENT '주문(결제)금액',
  `cancel_amount` int NULL COMMENT '결제취소금액',
  `currency` varchar(10) NULL COMMENT '결제승인화폐단위(KRW:원, USD:미화달러, EUR:유로)',
  `buyer_name` varchar(50) NULL COMMENT '주문자명',
  `buyer_email` varchar(50) NULL COMMENT '주문자 Email주소',
  `buyer_tel` varchar(20) NULL COMMENT '주문자 전화번호',
  `buyer_addr` varchar(255) NULL COMMENT '주문자 주소',
  `buyer_postcode` varchar(10) NULL COMMENT '주문자 우편번호',
  `custom_data` varchar(255) NULL COMMENT '가맹점에서 전달한 custom data. JSON string으로 전달',
  `user_agent` varchar(255) NULL COMMENT '구매자가 결제를 시작한 단말기의 UserAgent 문자열',
  `status` varchar(20) NULL COMMENT '결제상태. ready:미결제, paid:결제완료, cancelled:결제취소, failed:결제실패 = [ready, paid, cancelled, failed]',
  `started_at` int NULL COMMENT '결제시작시점 UNIX timestamp. IMP.request_pay() 를 통해 결제창을 최초 오픈한 시각',
  `paid_at` int NULL COMMENT '결제완료시점 UNIX timestamp. 결제완료가 아닐 경우 0',
  `failed_at` int NULL COMMENT '결제실패시점 UNIX timestamp. 결제실패가 아닐 경우 0',
  `cancelled_at` int NULL COMMENT '결제취소시점 UNIX timestamp. 결제취소가 아닐 경우 0',
  `fail_reason` varchar(250) NULL COMMENT '결제실패 사유',
  `cancel_reason` varchar(250) NULL COMMENT '결제취소 사유',
  `receipt_url` varchar(255) NULL COMMENT '신용카드 매출전표 확인 URL',
  `cash_receipt_issued` boolean DEFAULT false COMMENT '현금영수증 자동발급 여부',
  `customer_uid` varchar(50) NULL COMMENT '해당 결제처리에 사용된 customer_uid. 결제창을 통해 빌링키 발급 성공한 결제건의 경우 요청된 customer_uid 값을 응답합니다.',
  `customer_uid_usage` varchar(20) NULL COMMENT 'customer_uid가 결제처리에 사용된 상세 용도.(null:일반결제, issue:빌링키 발급, payment:결제, payment.scheduled:예약결제 = [issue, payment, payment.scheduled]',
  PRIMARY KEY (`id`)
);

CREATE TABLE `iamport_payment_cancel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,  
  `pg_tid` varchar(50) NULL COMMENT 'PG사 승인정보',
  `amount` int NULL COMMENT '취소 금액',
  `cancelled_at` int NULL COMMENT '결제취소된 시각 UNIX timestamp',
  `reason` varchar(250) NULL COMMENT '결제취소 사유',
  `receipt_url` varchar(255) NULL COMMENT '취소에 대한 매출전표 확인 URL. PG사에 따라 제공되지 않는 경우도 있음',
  PRIMARY KEY (`id`)
);

CREATE TABLE `iamport_certification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `member_type` VARCHAR(10) NULL DEFAULT 'user' COMMENT '회원타입(사용자-user|점주-owner)',
  `phone_number` varchar(50) NOT NULL COMMENT '핸드폰 번호',
  `imp_uid` varchar(50) NOT NULL COMMENT '아임포트 인증번호',
  `unique_key` varchar(100) NULL COMMENT '개인 고유구분 식별키(다날 매뉴얼 기준 CI)',
  `unique_in_site` varchar(100) NULL COMMENT '가맹점 내 개인 고유구분 식별키(다날 매뉴얼 기준 DI). 본인인증 PG MID별로 할당되는 개인 식별키',
  `name` varchar(50) NULL COMMENT '인증결과-실명',
  `gender` varchar(50) NULL COMMENT '인증결과-성별. male:남성, female:여성',
  `birthday` varchar(50) NULL COMMENT '인증결과-생년월일 ISO8601 형식의 문자열. YYYY-MM-DD 10자리 문자열',
  PRIMARY KEY (`id`)
);

CREATE TABLE `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `owner_id` int NOT NULL COMMENT '운영자(작성자) 아이디',
  `title` varchar(100) NOT NULL COMMENT '이벤트 제목',
  `body` varchar(5000) NOT NULL COMMENT '이벤트 내용',
  `started_at` timestamp(6) NULL DEFAULT NULL COMMENT '시작일',
  `ended_at` timestamp(6) NULL DEFAULT NULL COMMENT '종료일',
  `is_displayed` boolean DEFAULT true COMMENT '노출 여부',
  `banner_url` varchar(255) NULL COMMENT '배너 이미지 URL',
  `image_url` varchar(255) NULL COMMENT '첨부파일 이미지 URL',
  `hit_count` int DEFAULT 0 COMMENT '조회수',
  PRIMARY KEY (`id`)
);

CREATE TABLE `notice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `type` varchar(20) NOT NULL COMMENT '공지 분류(고객-user|점주-owner)',
  `owner_id` int NOT NULL COMMENT '운영자(작성자) 아이디',
  `title` varchar(100) NOT NULL COMMENT '공지 제목',
  `body` varchar(5000) NOT NULL COMMENT '공지 내용',
  `image_url` varchar(255) NULL COMMENT '첨부파일 이미지 URL',
  `hit_count` int DEFAULT 0 COMMENT '조회수',
  PRIMARY KEY (`id`)
);

CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `type` varchar(20) NOT NULL COMMENT '문의 분류(고객-user|점주-owner)',
  `category` varchar(20) DEFAULT 'default' COMMENT '문의 유형(기본-default|이용관련-usage|회원관련-member|가게관련-store|결제관련-payment|기타-etc)',
  `user_id` int NULL COMMENT '고객(작성자) 아이디',
  `owner_id` int NULL COMMENT '점주(작성자) 아이디',
  `title` varchar(100) NOT NULL COMMENT '문의 제목',
  `body` varchar(5000) NOT NULL COMMENT '문의 내용',
  `image_url1` varchar(255) NULL COMMENT '첨부파일 이미지1 URL',
  `image_url2` varchar(255) NULL COMMENT '첨부파일 이미지2 URL',
  `status` varchar(20) NOT NULL COMMENT '상태(문의중-ready|접수-received|처리중-processing|완료-finished)',
  `is_answered` boolean DEFAULT false COMMENT '답변 여부', 
  PRIMARY KEY (`id`)
);

CREATE TABLE `question_answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `question_id` int NOT NULL COMMENT '문의 아이디',
  `owner_id` int NOT NULL COMMENT '운영자(작성자) 아이디',
  `body` varchar(1000) NULL DEFAULT NULL COMMENT '답변 내용',
  PRIMARY KEY (`id`)
);

CREATE TABLE `pos_banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `owner_id` int NOT NULL COMMENT '운영자(작성자) 아이디',
  `banner_url` varchar(255) NOT NULL COMMENT '배너 이미지 URL',
  `href` varchar(255) NOT NULL COMMENT '배너 클릭시 이동할 페이지 URL',
  PRIMARY KEY (`id`)
);

CREATE TABLE `push_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `device_token` varchar(200) NULL DEFAULT NULL COMMENT '디바이스 토큰',
  `title` varchar(100) NULL DEFAULT NULL COMMENT '제목',
  `body` varchar(500) NULL DEFAULT NULL COMMENT '내용',
  `image_url` varchar(255) NULL DEFAULT NULL COMMENT '이미지 URL',
  `is_succeed` boolean DEFAULT true COMMENT '성공 여부',  
  `failure_code` varchar(200) NULL DEFAULT NULL COMMENT '실패 코드',
  `failure_message` varchar(500) NULL DEFAULT NULL COMMENT '실패 메세지',
  PRIMARY KEY (`id`)
);

CREATE TABLE `push_send_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `device_token` varchar(200) NULL DEFAULT NULL COMMENT '디바이스 토큰',
  `title` varchar(100) NULL DEFAULT NULL COMMENT '제목',
  `body` varchar(500) NULL DEFAULT NULL COMMENT '내용',
  `image_url` varchar(255) NULL DEFAULT NULL COMMENT '이미지 URL',
  `retry_count` int DEFAULT 0 COMMENT '재시도 횟수 최대 3회',
  `status` varchar(10) NULL DEFAULT NULL COMMENT '상태( ready:준비, failure:실패, success:성공 ) ',
  PRIMARY KEY (`id`)
);

CREATE TABLE `banner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `name` varchar(100) NULL DEFAULT NULL COMMENT '배너명',  
  `started_at` timestamp(6) NULL DEFAULT NULL COMMENT '시작일',
  `ended_at` timestamp(6) NULL DEFAULT NULL COMMENT '종료일',  
  `type` varchar(20) NOT NULL COMMENT '분류(bannerMain, popupModal, popupButtom)',
  `url` varchar(255) NULL COMMENT '배너 이미지 URL',
  `link` varchar(255) NULL COMMENT 'link (event:id, notice:id, https:)',
  `description` varchar(255) NULL DEFAULT NULL COMMENT '설명',
  `is_disabled` boolean DEFAULT true COMMENT '노출 여부',
  `created_by` int NOT NULL COMMENT '운영자(작성자) 아이디',  
  `updated_by` int NOT NULL COMMENT '운영자(수정자) 아이디',  
  PRIMARY KEY (`id`)
);

CREATE TABLE `order_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `order_id` int NOT NULL COMMENT '주문 아이디',
  `status` varchar(20) NOT NULL COMMENT '구분. paid:결제완료, cancelled:결제취소 = [paid, cancelled]',
  `owner_id` int NULL DEFAULT NULL COMMENT '주문취소 작성자(운영자) 아이디',
  `reason` varchar(250) NULL COMMENT '결제취소 사유',
  PRIMARY KEY (`id`)
);