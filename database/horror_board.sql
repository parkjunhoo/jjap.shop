-- =====================================================
-- 무서운 이야기 게시판 데이터베이스 생성 (회원가입 없음)
-- =====================================================

-- =====================================================
-- 1. 게시판 카테고리 테이블
-- =====================================================
CREATE TABLE horror_board_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '👻',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. 무서운 이야기 게시글 테이블 (회원가입 없음)
-- =====================================================
CREATE TABLE horror_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    post_password VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    thumbnail_image VARCHAR(255),
    horror_rating INT DEFAULT 1 CHECK (horror_rating >= 1 AND horror_rating <= 5),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'hidden') DEFAULT 'published',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES horror_board_categories(id) ON DELETE CASCADE,
    INDEX idx_category_status (category_id, status),
    INDEX idx_created_at (created_at),
    INDEX idx_nickname (nickname),
    INDEX idx_horror_rating (horror_rating),
    FULLTEXT(title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. 댓글 테이블 (회원가입 없음)
-- =====================================================
CREATE TABLE horror_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    comment_password VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES horror_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES horror_comments(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. 좋아요/싫어요 테이블 (IP 기반)
-- =====================================================
CREATE TABLE horror_reactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    target_id INT NOT NULL,
    reaction_type ENUM('like', 'dislike') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_reaction (ip_address, target_type, target_id),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. 태그 테이블
-- =====================================================
CREATE TABLE horror_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. 게시글-태그 연결 테이블
-- =====================================================
CREATE TABLE horror_post_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES horror_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES horror_tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. 파일 첨부 테이블
-- =====================================================
CREATE TABLE horror_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES horror_posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. CAPTCHA 세션 테이블
-- =====================================================
CREATE TABLE horror_captcha_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    captcha_text VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_session_id (session_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. 신고 테이블
-- =====================================================
CREATE TABLE horror_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_type ENUM('post', 'comment') NOT NULL,
    target_id INT NOT NULL,
    reporter_ip VARCHAR(45) NOT NULL,
    reason ENUM('spam', 'inappropriate', 'false_story', 'copyright', 'other') NOT NULL,
    description TEXT,
    status ENUM('pending', 'processed', 'dismissed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    INDEX idx_target (target_type, target_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. 관리자 계정 테이블 (게시글 관리용)
-- =====================================================
CREATE TABLE horror_admin_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 초기 데이터 삽입
-- =====================================================

-- 게시판 카테고리 초기 데이터
INSERT INTO horror_board_categories (name, slug, description, icon, sort_order) VALUES
('도시 전설', 'urban-legends', '도시에서 전해지는 무서운 전설과 괴담들을 공유하는 공간입니다.', '🏙️', 1),
('실화 이야기', 'true-stories', '실제로 겪었거나 목격한 무서운 이야기들을 나누는 공간입니다.', '😨', 2),
('이해하면 무서운 이야기', 'scary-when-understood', '처음엔 평범해 보이지만 이해하고 나면 소름 끼치는 이야기들입니다.', '🤔', 3),
('번역 괴담', 'translated-horror', '해외의 무서운 이야기와 괴담을 번역해서 공유하는 공간입니다.', '🌏', 4);

-- 관리자 계정 생성 (비밀번호: horror123 - 실제 사용시 반드시 변경 필요!)
INSERT INTO horror_admin_accounts (username, password_hash, nickname) VALUES
('horror_admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '무서운이야기 관리자');

-- 샘플 태그
INSERT INTO horror_tags (name, slug, description) VALUES
('실화', 'true-story', '실제로 일어난 이야기'),
('도시전설', 'urban-legend', '도시 전설 관련'),
('귀신', 'ghost', '귀신이 등장하는 이야기'),
('병원', 'hospital', '병원에서 일어난 무서운 일'),
('학교', 'school', '학교에서 겪은 무서운 경험'),
('아파트', 'apartment', '아파트에서 일어난 괴담'),
('엘리베이터', 'elevator', '엘리베이터 관련 무서운 이야기'),
('지하철', 'subway', '지하철에서 겪은 이상한 경험'),
('심리적공포', 'psychological-horror', '심리적으로 무서운 이야기'),
('초자연현상', 'supernatural', '초자연적인 현상이 담긴 이야기'),
('일본괴담', 'japanese-horror', '일본 괴담 번역'),
('서양괴담', 'western-horror', '서양 괴담 번역'),
('creepypasta', 'creepypasta', '크리피파스타'),
('미스터리', 'mystery', '미스터리한 이야기'),
('살인사건', 'murder-case', '실제 살인사건 관련');

-- =====================================================
-- 샘플 게시글 데이터
-- =====================================================
INSERT INTO horror_posts (category_id, nickname, post_password, title, content, excerpt, horror_rating) VALUES
(1, '도시전설헌터', '$2y$10$example1', '지하철 2호선의 유령 승객', 
'매일 밤 마지막 차에 타는 승객이 있다고 합니다. 그 승객은 항상 같은 자리에 앉고, 같은 역에서 내립니다. 하지만 이상한 점은...

[긴 이야기 내용]

그날 이후로 저는 마지막 차를 타지 않게 되었습니다. 여러분도 조심하세요.',
'지하철 마지막 차에 나타나는 정체불명의 승객에 대한 이야기입니다.', 4),

(2, '실화증언자', '$2y$10$example2', '새벽 3시의 전화', 
'작년 겨울, 매일 새벽 3시마다 전화가 걸려왔습니다. 처음에는 장난전화인줄 알았는데...

[실화 내용]

지금도 가끔씩 새벽에 전화벨이 울리면 소름이 돋습니다. 절대 받지 마세요.',
'매일 새벽 3시에 걸려오는 이상한 전화에 대한 실화입니다.', 5),

(3, '추리고수', '$2y$10$example3', '완벽한 하루', 
'오늘 정말 완벽한 하루를 보냈어요! 

아침에 일어나서 좋아하는 커피를 마시고, 출근해서 상사에게 칭찬받고, 점심에는 맛있는 음식을 먹었습니다. 
저녁에는 연인과 데이트를 하고 집에 와서 따뜻한 샤워를 했어요.

내일도 이런 하루가 계속되었으면 좋겠네요. 매일매일 똑같은 완벽한 하루가요.',
'얼핏 보면 평범한 일상 이야기이지만... 자세히 읽어보면 소름이 돋는 이야기입니다.', 3),

(4, '번역러', '$2y$10$example4', '[번역] Reddit의 유명한 괴담 "The Stairs in the Woods"', 
'원제: The Stairs in the Woods
출처: Reddit r/nosleep

[번역 내용]
삼림 관리소에서 일하는 사람들 사이에서는 절대 말하지 않는 규칙이 하나 있습니다. 

숲 속에서 계단을 발견해도 절대 올라가지 말라는 것입니다...

[긴 번역 내용]',
'Reddit에서 유명한 괴담 "숲 속의 계단"을 번역한 이야기입니다.', 4);

-- =====================================================
-- 인덱스 최적화
-- =====================================================
CREATE INDEX idx_horror_posts_category_status ON horror_posts(category_id, status);
CREATE INDEX idx_horror_comments_post_parent ON horror_comments(post_id, parent_id);
CREATE INDEX idx_horror_reactions_ip_target ON horror_reactions(ip_address, target_type, target_id);
CREATE INDEX idx_horror_posts_rating ON horror_posts(horror_rating, status);

-- =====================================================
-- 뷰 생성 (자주 사용되는 쿼리 최적화)
-- =====================================================
CREATE VIEW horror_posts_with_category AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    c.icon as category_icon
FROM horror_posts p
JOIN horror_board_categories c ON p.category_id = c.id
WHERE p.status = 'published' AND c.is_active = TRUE;

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '무서운 이야기 게시판 데이터베이스 생성이 완료되었습니다! 👻' AS message;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name LIKE 'horror_%';
