CREATE TABLE member
(
    member_code         VARCHAR(50) PRIMARY KEY,                                        -- 사용자 코드 (PRIMARY KEY)
    member_level        ENUM('guest', 'member', 'moderator', 'admin') DEFAULT 'member', -- 사용자 레벨
    member_id           VARCHAR(50)  NOT NULL UNIQUE,                                   -- 사용자 고유 ID (문자형)
    member_name         VARCHAR(50),                                                    -- 사용자 이름 (중복 가능)
    member_nickname     VARCHAR(50),                                                    -- 닉네임 (중복 가능)
    email               VARCHAR(100) UNIQUE,                                            -- 이메일 주소
    email_verified      BOOLEAN   DEFAULT FALSE,                                        -- 이메일 인증 여부
    password_hash       VARCHAR(255) NOT NULL,                                          -- 비밀번호 해시
    date_of_birth       DATE,                                                           -- 생년월일
    phone_number        VARCHAR(20),                                                    -- 전화번호
    gender              ENUM('male', 'female', 'none') DEFAULT 'none',                  -- 성별
    profile_picture_url VARCHAR(255),                                                   -- 프로필 사진 URL
    join_date           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                            -- 가입 날짜
    last_login          TIMESTAMP,                                                      -- 마지막 로그인 시간
    is_active           BOOLEAN   DEFAULT TRUE,                                         -- 활성화 상태
    account_type        ENUM('free', 'premium', 'enterprise') DEFAULT 'free',           -- 계정 유형
    subscription_expiry DATE,                                                           -- 구독 만료일
    points              INT       DEFAULT 0,                                            -- 포인트
    cash                INT       DEFAULT 0                                             -- 캐쉬
);

CREATE TABLE category
(
    category_id      CHAR(36) PRIMARY KEY DEFAULT (UUID()),                          -- UUID를 사용한 고유 식별자
    main_category    VARCHAR(255),                                                   -- 메인 카테고리
    sub_category     VARCHAR(255),                                                   -- 서브 카테고리
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,                            -- 카테고리가 생성된 시간
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,-- 카테고리가 마지막으로 업데이트된 시간
    created_by       VARCHAR(255),                                                   -- 카테고리를 생성한 사용자
    updated_by       VARCHAR(255),                                                   -- 카테고리를 마지막으로 업데이트한 사용자
    status           VARCHAR(50),                                                    -- 카테고리의 상태 (예: active, inactive)
    slug             VARCHAR(255),                                                   -- URL 친화적인 카테고리 이름
    priority         INT,                                                            -- 정렬을 위한 카테고리의 우선순위
    meta_title       VARCHAR(255),                                                   -- SEO를 위한 메타 제목
    meta_description TEXT,                                                           -- SEO를 위한 메타 설명
    member_level     ENUM('guest', 'member', 'moderator', 'admin')                   -- 카테고리를 조회할 수 있는 회원 레벨
);

-- UUID 중복 여부를 확인하는 예시
INSERT INTO category (category_id, main_category, sub_category)
SELECT UUID(), 'Electronics', 'Computers'
    WHERE NOT EXISTS (SELECT 1 FROM category WHERE category_id = UUID());