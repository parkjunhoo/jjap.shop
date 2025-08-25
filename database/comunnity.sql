-- =====================================================
-- 크리에이터 소통 공간 데이터베이스 생성 (회원가입 없음)
-- =====================================================

-- =====================================================
-- 1. 게시판 카테고리 테이블
-- =====================================================
CREATE TABLE board_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. 게시글 테이블 (회원가입 없음)
-- =====================================================
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    post_password VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    thumbnail_image VARCHAR(255),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published', 'hidden') DEFAULT 'published',
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES board_categories(id) ON DELETE CASCADE,
    INDEX idx_category_status (category_id, status),
    INDEX idx_created_at (created_at),
    INDEX idx_nickname (nickname),
    FULLTEXT(title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. 댓글 테이블 (회원가입 없음)
-- =====================================================
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    comment_password VARCHAR(255) NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_deleted BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. 좋아요 테이블 (IP 기반)
-- =====================================================
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    target_type ENUM('post', 'comment') NOT NULL,
    target_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (ip_address, target_type, target_id),
    INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. 태그 테이블
-- =====================================================
CREATE TABLE tags (
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
CREATE TABLE post_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_tag (post_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. 파일 첨부 테이블
-- =====================================================
CREATE TABLE attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. CAPTCHA 세션 테이블
-- =====================================================
CREATE TABLE captcha_sessions (
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
-- 9. 관리자 계정 테이블 (게시글 관리용)
-- =====================================================
CREATE TABLE admin_accounts (
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
INSERT INTO board_categories (name, slug, description, sort_order) VALUES
('크리에이터 팁', 'creator-tips', '유튜브, 인스타그램 등 크리에이터 활동에 도움이 되는 팁과 노하우를 공유하는 공간입니다.', 1),
('도구 사용법', 'tool-guides', '짭샵 도구들의 상세한 사용법과 활용 팁을 제공합니다.', 2),
('일반 잡담', 'general-chat', '크리에이터들의 자유로운 소통과 일상 이야기를 나누는 공간입니다.', 3),
('성공 사례', 'success-stories', '크리에이터들의 성공 경험과 성장 스토리를 공유합니다.', 4),
('질문과 답변', 'qna', '크리에이터 활동 관련 질문과 답변을 주고받는 공간입니다.', 5),
('콘텐츠 아이디어', 'content-ideas', '새로운 콘텐츠 아이디어와 트렌드를 공유합니다.', 6);

-- 관리자 계정 생성 (비밀번호: admin123 - 실제 사용시 반드시 변경 필요!)
INSERT INTO admin_accounts (username, password_hash, nickname) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '짭샵 관리자');

-- 샘플 태그
INSERT INTO tags (name, slug, description) VALUES
('유튜브', 'youtube', '유튜브 관련 콘텐츠'),
('썸네일', 'thumbnail', '썸네일 제작 관련'),
('OBS', 'obs', 'OBS 스트리밍 도구'),
('크리에이터', 'creator', '크리에이터 활동'),
('팁', 'tips', '유용한 팁과 노하우');

-- =====================================================
-- 인덱스 최적화
-- =====================================================
CREATE INDEX idx_posts_category_status ON posts(category_id, status);
CREATE INDEX idx_comments_post_parent ON comments(post_id, parent_id);
CREATE INDEX idx_likes_ip_target ON likes(ip_address, target_type, target_id);

-- =====================================================
-- 완료 메시지
-- =====================================================
SELECT '데이터베이스 생성이 완료되었습니다!' AS message;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = DATABASE();