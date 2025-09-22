-- 발로란트 팁 게시판 데이터베이스 설계
-- 생성일: 2025-09-22

-- 1. 발로란트 요원 분류 테이블
CREATE TABLE valorant_agent_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL COMMENT '역할 이름 (타격대, 척후대, 감시자, 연막)',
    type_name_en VARCHAR(50) NOT NULL COMMENT '영문 역할 이름',
    type_icon VARCHAR(100) NOT NULL COMMENT '역할 아이콘 경로',
    type_color VARCHAR(20) NOT NULL COMMENT '역할 대표 색상',
    sort_order INT DEFAULT 1 COMMENT '정렬 순서',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 발로란트 요원 정보 테이블
CREATE TABLE valorant_agents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    agent_name VARCHAR(50) NOT NULL COMMENT '요원 이름',
    agent_name_en VARCHAR(50) NOT NULL COMMENT '영문 요원 이름',
    agent_type_id INT NOT NULL COMMENT '역할 ID',
    agent_image VARCHAR(200) NOT NULL COMMENT '요원 이미지 경로',
    agent_description TEXT COMMENT '요원 설명',
    abilities JSON COMMENT '스킬 정보 (JSON)',
    sort_order INT DEFAULT 1 COMMENT '정렬 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (agent_type_id) REFERENCES valorant_agent_types(id) ON DELETE CASCADE
);

-- 3. 발로란트 팁 게시글 테이블
CREATE TABLE valorant_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '게시글 제목',
    content LONGTEXT NOT NULL COMMENT '게시글 내용',
    summary VARCHAR(300) COMMENT '게시글 요약',
    
    -- 요원 정보
    agent_id INT NOT NULL COMMENT '관련 요원 ID',
    
    -- 작성자 정보
    nickname VARCHAR(50) NOT NULL COMMENT '작성자 닉네임',
    password VARCHAR(255) NOT NULL COMMENT '게시글 비밀번호 (해시)',
    ip_address VARCHAR(45) COMMENT '작성자 IP',
    
    -- 게시글 상태
    status ENUM('draft', 'published', 'deleted') DEFAULT 'published' COMMENT '게시글 상태',
    is_featured BOOLEAN DEFAULT FALSE COMMENT '추천글 여부',
    is_notice BOOLEAN DEFAULT FALSE COMMENT '공지글 여부',
    
    -- 상호작용 통계
    view_count INT DEFAULT 0 COMMENT '조회수',
    like_count INT DEFAULT 0 COMMENT '좋아요 수',
    comment_count INT DEFAULT 0 COMMENT '댓글 수',
    favorite_count INT DEFAULT 0 COMMENT '즐겨찾기 수',
    
    -- 게시글 메타 정보
    tip_difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner' COMMENT '팁 난이도',
    tip_category ENUM('strategy', 'skill', 'map', 'general') DEFAULT 'general' COMMENT '팁 카테고리',
    tags JSON COMMENT '태그 (JSON 배열)',
    
    -- 시간 정보
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    
    -- 인덱스
    INDEX idx_agent_id (agent_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_view_count (view_count),
    INDEX idx_like_count (like_count),
    INDEX idx_tip_difficulty (tip_difficulty),
    INDEX idx_tip_category (tip_category),
    
    FOREIGN KEY (agent_id) REFERENCES valorant_agents(id) ON DELETE CASCADE
);

-- 4. 발로란트 댓글 테이블
CREATE TABLE valorant_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL COMMENT '게시글 ID',
    parent_id INT NULL COMMENT '부모 댓글 ID (대댓글용)',
    
    content TEXT NOT NULL COMMENT '댓글 내용',
    nickname VARCHAR(50) NOT NULL COMMENT '작성자 닉네임',
    password VARCHAR(255) NOT NULL COMMENT '댓글 비밀번호 (해시)',
    ip_address VARCHAR(45) COMMENT '작성자 IP',
    
    like_count INT DEFAULT 0 COMMENT '좋아요 수',
    status ENUM('published', 'deleted') DEFAULT 'published' COMMENT '댓글 상태',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    
    INDEX idx_post_id (post_id),
    INDEX idx_parent_id (parent_id),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (post_id) REFERENCES valorant_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES valorant_comments(id) ON DELETE CASCADE
);

-- 5. 발로란트 좋아요 테이블 (중복 방지)
CREATE TABLE valorant_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL COMMENT '게시글 ID',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP 주소',
    user_agent VARCHAR(500) COMMENT '사용자 에이전트',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_like (post_id, ip_address),
    FOREIGN KEY (post_id) REFERENCES valorant_posts(id) ON DELETE CASCADE
);

-- 6. 발로란트 조회수 로그 테이블
CREATE TABLE valorant_views (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL COMMENT '게시글 ID',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP 주소',
    user_agent VARCHAR(500) COMMENT '사용자 에이전트',
    referrer VARCHAR(500) COMMENT '리퍼러',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_post_id (post_id),
    INDEX idx_ip_address (ip_address),
    INDEX idx_created_at (created_at),
    
    FOREIGN KEY (post_id) REFERENCES valorant_posts(id) ON DELETE CASCADE
);

-- 7. 발로란트 신고 테이블
CREATE TABLE valorant_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NULL COMMENT '신고된 게시글 ID',
    comment_id INT NULL COMMENT '신고된 댓글 ID',
    report_type ENUM('spam', 'inappropriate', 'misinformation', 'other') NOT NULL COMMENT '신고 유형',
    reason TEXT COMMENT '신고 사유',
    reporter_ip VARCHAR(45) NOT NULL COMMENT '신고자 IP',
    status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending' COMMENT '처리 상태',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_post_id (post_id),
    INDEX idx_comment_id (comment_id),
    INDEX idx_status (status),
    
    FOREIGN KEY (post_id) REFERENCES valorant_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES valorant_comments(id) ON DELETE CASCADE
);

-- 기본 데이터 삽입

-- 1. 요원 역할 데이터
INSERT INTO valorant_agent_types (type_name, type_name_en, type_icon, type_color, sort_order) VALUES
('타격대', 'Duelist', '/assets/images/valorant/charactor/타격대.svg', '#ff6b6b', 1),
('척후대', 'Initiator', '/assets/images/valorant/charactor/척후대.svg', '#4ecdc4', 2),
('감시자', 'Sentinel', '/assets/images/valorant/charactor/감시자.svg', '#45b7d1', 3),
('연막', 'Controller', '/assets/images/valorant/charactor/연막.svg', '#96ceb4', 4);

-- 2. 요원 데이터 삽입
-- 타격대
INSERT INTO valorant_agents (agent_name, agent_name_en, agent_type_id, agent_image, sort_order) VALUES
('네온', 'Neon', 1, '/assets/images/valorant/charactor/네온.webp', 1),
('레이나', 'Reyna', 1, '/assets/images/valorant/charactor/레이나.webp', 2),
('레이즈', 'Raze', 1, '/assets/images/valorant/charactor/레이즈.webp', 3),
('아이소', 'Iso', 1, '/assets/images/valorant/charactor/아이소.webp', 4),
('요루', 'Yoru', 1, '/assets/images/valorant/charactor/요루.webp', 5),
('웨이레이', 'Wayley', 1, '/assets/images/valorant/charactor/웨이레이.webp', 6),
('제트', 'Jett', 1, '/assets/images/valorant/charactor/제트.webp', 7),
('피닉스', 'Phoenix', 1, '/assets/images/valorant/charactor/피닉스.webp', 8);

-- 척후대
INSERT INTO valorant_agents (agent_name, agent_name_en, agent_type_id, agent_image, sort_order) VALUES
('게코', 'Gecko', 2, '/assets/images/valorant/charactor/게코.webp', 1),
('브리치', 'Breach', 2, '/assets/images/valorant/charactor/브리치.webp', 2),
('소바', 'Sova', 2, '/assets/images/valorant/charactor/소바.webp', 3),
('스카이', 'Skye', 2, '/assets/images/valorant/charactor/스카이.webp', 4),
('케이오', 'KAY/O', 2, '/assets/images/valorant/charactor/케이오.webp', 5),
('테호', 'Taejo', 2, '/assets/images/valorant/charactor/테호.webp', 6),
('페이드', 'Fade', 2, '/assets/images/valorant/charactor/페이드.webp', 7);

-- 감시자
INSERT INTO valorant_agents (agent_name, agent_name_en, agent_type_id, agent_image, sort_order) VALUES
('데드록', 'Deadlock', 3, '/assets/images/valorant/charactor/데드록.webp', 1),
('바이스', 'Vyse', 3, '/assets/images/valorant/charactor/바이스.webp', 2),
('사이퍼', 'Cypher', 3, '/assets/images/valorant/charactor/사이퍼.webp', 3),
('세이지', 'Sage', 3, '/assets/images/valorant/charactor/세이지.webp', 4),
('체임버', 'Chamber', 3, '/assets/images/valorant/charactor/체임버.webp', 5),
('킬조이', 'Killjoy', 3, '/assets/images/valorant/charactor/킬조이.webp', 6);

-- 연막
INSERT INTO valorant_agents (agent_name, agent_name_en, agent_type_id, agent_image, sort_order) VALUES
('바이퍼', 'Viper', 4, '/assets/images/valorant/charactor/바이퍼.webp', 1),
('브림스톤', 'Brimstone', 4, '/assets/images/valorant/charactor/브림스톤.webp', 2),
('아스트라', 'Astra', 4, '/assets/images/valorant/charactor/아스트라.webp', 3),
('오멘', 'Omen', 4, '/assets/images/valorant/charactor/오멘.webp', 4),
('클로브', 'Clove', 4, '/assets/images/valorant/charactor/클로브.webp', 5),
('하버', 'Harbor', 4, '/assets/images/valorant/charactor/하버.webp', 6);

-- 인덱스 최적화
OPTIMIZE TABLE valorant_agent_types;
OPTIMIZE TABLE valorant_agents;
OPTIMIZE TABLE valorant_posts;
OPTIMIZE TABLE valorant_comments;
OPTIMIZE TABLE valorant_likes;
OPTIMIZE TABLE valorant_views;
OPTIMIZE TABLE valorant_reports;
