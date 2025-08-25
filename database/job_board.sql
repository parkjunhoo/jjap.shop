-- =====================================================
-- 구인구직 시스템 데이터베이스 설계
-- =====================================================

-- 구인구직 카테고리 테이블
CREATE TABLE job_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '카테고리명',
    slug VARCHAR(50) UNIQUE NOT NULL COMMENT 'URL 슬러그',
    description TEXT COMMENT '카테고리 설명',
    icon VARCHAR(50) COMMENT '아이콘 클래스',
    sort_order INT DEFAULT 0 COMMENT '정렬 순서',
    is_active BOOLEAN DEFAULT TRUE COMMENT '활성화 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 구인구직 게시글 테이블
CREATE TABLE job_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL COMMENT '카테고리 ID',
    post_type ENUM('recruit', 'job_seek') NOT NULL COMMENT '구인/구직 구분',
    title VARCHAR(200) NOT NULL COMMENT '제목',
    content TEXT NOT NULL COMMENT '내용',
    excerpt TEXT COMMENT '요약',
    
    -- 작성자 정보
    nickname VARCHAR(50) NOT NULL COMMENT '닉네임',
    post_password VARCHAR(255) NOT NULL COMMENT '게시글 비밀번호',
    
    -- 급여 (편집자 전용)
    rate_type ENUM('per_minute','per_video','negotiable') DEFAULT NULL COMMENT '급여 타입',
    minute_rate DECIMAL(10,2) COMMENT '분당 (원/분)',
    video_rate DECIMAL(10,2) COMMENT '영상 건당 (원/건)',
    
    -- 구인 관련 (구인글인 경우)
    video_example VARCHAR(500) COMMENT '영상 예시 URL (유튜브 등)',
    project_description TEXT COMMENT '프로젝트 설명',
    required_skills TEXT COMMENT '필요한 기술/능력',
    work_period VARCHAR(100) COMMENT '작업 기간',
    work_location VARCHAR(200) COMMENT '작업 장소',
    
    -- 구직 관련 (구직글인 경우)
    portfolio_url VARCHAR(500) COMMENT '포트폴리오 URL',
    experience_years INT COMMENT '경력 연차',
    skills TEXT COMMENT '보유 기술/능력',
    available_period VARCHAR(100) COMMENT '가능한 기간',
    preferred_location VARCHAR(200) COMMENT '선호 지역',
    
    -- 상태 및 메타 정보
    status ENUM('active', 'closed', 'hidden') DEFAULT 'active' COMMENT '상태',
    view_count INT DEFAULT 0 COMMENT '조회수',
    like_count INT DEFAULT 0 COMMENT '좋아요 수',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    user_agent TEXT COMMENT '사용자 에이전트',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES job_categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_post_type (post_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- 구인구직 연락처 테이블 (다중 연락처 지원)
CREATE TABLE job_post_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL COMMENT '게시글 ID',
    type ENUM('phone','email','discord','kakaotalk','custom') NOT NULL COMMENT '연락처 유형',
    label VARCHAR(100) NULL COMMENT '사용자 정의 라벨(직접입력 시)',
    value VARCHAR(255) NOT NULL COMMENT '연락처 값',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
);

-- 구인구직 댓글 테이블
CREATE TABLE job_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL COMMENT '게시글 ID',
    parent_id INT DEFAULT NULL COMMENT '부모 댓글 ID',
    nickname VARCHAR(50) NOT NULL COMMENT '닉네임',
    comment_password VARCHAR(255) NOT NULL COMMENT '댓글 비밀번호',
    content TEXT NOT NULL COMMENT '댓글 내용',
    ip_address VARCHAR(45) COMMENT 'IP 주소',
    user_agent TEXT COMMENT '사용자 에이전트',
    is_deleted BOOLEAN DEFAULT FALSE COMMENT '삭제 여부',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES job_comments(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_parent_id (parent_id)
);

-- 구인구직 좋아요 테이블
CREATE TABLE job_likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL COMMENT '게시글 ID',
    ip_address VARCHAR(45) NOT NULL COMMENT 'IP 주소',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, ip_address),
    INDEX idx_post_id (post_id)
);

-- 구인구직 첨부파일 테이블
CREATE TABLE job_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL COMMENT '게시글 ID',
    filename VARCHAR(255) NOT NULL COMMENT '파일명',
    original_filename VARCHAR(255) NOT NULL COMMENT '원본 파일명',
    file_path VARCHAR(500) NOT NULL COMMENT '파일 경로',
    file_size INT NOT NULL COMMENT '파일 크기 (bytes)',
    mime_type VARCHAR(100) NOT NULL COMMENT 'MIME 타입',
    file_type ENUM('image', 'document', 'video', 'other') NOT NULL COMMENT '파일 타입',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_file_type (file_type)
);

-- 구인구직 태그 테이블
CREATE TABLE job_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '태그명',
    slug VARCHAR(50) UNIQUE NOT NULL COMMENT '태그 슬러그',
    color VARCHAR(7) DEFAULT '#667eea' COMMENT '태그 색상',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 구인구직 게시글-태그 연결 테이블
CREATE TABLE job_post_tags (
    post_id INT NOT NULL COMMENT '게시글 ID',
    tag_id INT NOT NULL COMMENT '태그 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES job_tags(id) ON DELETE CASCADE
);

-- 초기 데이터 삽입
INSERT INTO job_categories (name, slug, description, icon, sort_order) VALUES
('편집자', 'editor', '영상 편집, 사진 편집 등 편집 관련 구인구직', 'fas fa-cut', 1),
('멤버', 'member', '촬영, 연출, 기획 등 제작 멤버 구인구직', 'fas fa-users', 2),
('기타', 'other', '기타 창작 관련 구인구직', 'fas fa-plus-circle', 3);

INSERT INTO job_tags (name, slug, color) VALUES
('영상편집', 'video-editing', '#667eea'),
('사진편집', 'photo-editing', '#764ba2'),
('모션그래픽', 'motion-graphics', '#f093fb'),
('색보정', 'color-grading', '#f5576c'),
('촬영', 'filming', '#4facfe'),
('연출', 'directing', '#00f2fe'),
('기획', 'planning', '#43e97b'),
('애니메이션', 'animation', '#38f9d7'),
('3D', '3d', '#fa709a'),
('일러스트', 'illustration', '#fee140'),
('웹디자인', 'web-design', '#a8edea'),
('UI/UX', 'ui-ux', '#fed6e3'),
('로고디자인', 'logo-design', '#ffecd2'),
('타이포그래피', 'typography', '#fcb69f'),
('프로모션', 'promotion', '#ff9a9e'),
('브랜딩', 'branding', '#a18cd1'),
('마케팅', 'marketing', '#fbc2eb'),
('SNS', 'sns', '#ffecd2'),
('유튜브', 'youtube', '#ff0000'),
('인스타그램', 'instagram', '#e4405f'),
('틱톡', 'tiktok', '#000000'),
('트위치', 'twitch', '#9146ff'),
('아프리카TV', 'afreecatv', '#00b900'),
('네이버TV', 'navertv', '#03c75a'),
('카카오TV', 'kakaotv', '#fee500');
