-- =====================================================
-- 무서운 이야기 게시판 - 기존 테이블 삭제 후 재생성
-- =====================================================
use qkrwnsgn123;
-- 1. 기존 horror_ 테이블들 모두 삭제 (외래키 때문에 순서 중요)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS horror_post_tags;
DROP TABLE IF EXISTS horror_attachments;
DROP TABLE IF EXISTS horror_comments;
DROP TABLE IF EXISTS horror_reactions;
DROP TABLE IF EXISTS horror_reports;
DROP TABLE IF EXISTS horror_captcha_sessions;
DROP TABLE IF EXISTS horror_posts;
DROP TABLE IF EXISTS horror_tags;
DROP TABLE IF EXISTS horror_board_categories;
DROP TABLE IF EXISTS horror_admin_accounts;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 2. 새 테이블 생성
-- =====================================================

-- 카테고리 테이블 (단순화)
CREATE TABLE horror_board_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10) DEFAULT '👻',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 게시글 테이블 (핵심 기능만)
CREATE TABLE horror_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    post_password VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    status ENUM('published', 'hidden') DEFAULT 'published',
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES horror_board_categories(id) ON DELETE CASCADE,
    INDEX idx_category_status (category_id, status),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_nickname (nickname)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 댓글 테이블 (단순화)
CREATE TABLE horror_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    comment_password VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (post_id) REFERENCES horror_posts(id) ON DELETE CASCADE,
    INDEX idx_post_id (post_id),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. 초기 데이터 삽입
-- =====================================================

-- 카테고리 데이터
INSERT INTO horror_board_categories (name, slug, description, icon, sort_order) VALUES
('도시 전설', 'urban-legends', '도시에서 전해지는 무서운 전설과 괴담들', '🏙️', 1),
('실화 이야기', 'true-stories', '실제로 겪었거나 목격한 무서운 경험담', '😨', 2),
('이해하면 무서운 이야기', 'scary-when-understood', '처음엔 평범해 보이지만 이해하면 소름 끼치는 이야기', '🤔', 3),
('번역 괴담', 'translated-horror', '해외의 유명한 무서운 이야기와 크리피파스타', '🌏', 4);

-- 샘플 게시글 데이터
INSERT INTO horror_posts (category_id, nickname, post_password, title, content, excerpt) VALUES
(1, '도시전설헌터', '$2y$10$example1', '지하철 2호선의 유령 승객', 
'매일 밤 마지막 차에 타는 승객이 있다고 합니다. 그 승객은 항상 같은 자리에 앉고, 같은 역에서 내립니다.

하지만 이상한 점은... 그 승객이 내리는 역에는 실제로는 정류장이 없다는 것입니다.

어느 날 호기심에 그 승객을 따라가 보았는데...

(긴 내용 생략)

그날 이후로 저는 마지막 차를 타지 않게 되었습니다. 여러분도 조심하세요.',
'지하철 마지막 차에 나타나는 정체불명의 승객에 대한 이야기입니다.'),

(2, '실화증언자', '$2y$10$example2', '새벽 3시의 전화', 
'작년 겨울, 매일 새벽 3시마다 전화가 걸려왔습니다. 처음에는 장난전화인줄 알았는데...

전화를 받으면 숨소리만 들렸습니다. 그런데 그 숨소리가... 점점 거칠어졌습니다.

며칠 후부터는 중얼거리는 소리도 들리기 시작했습니다.

"찾았다... 찾았어..."

(긴 내용 생략)

지금도 가끔씩 새벽에 전화벨이 울리면 소름이 돋습니다. 절대 받지 마세요.',
'매일 새벽 3시에 걸려오는 이상한 전화에 대한 실화입니다.'),

(3, '추리고수', '$2y$10$example3', '완벽한 하루', 
'오늘 정말 완벽한 하루를 보냈어요! 

아침에 일어나서 좋아하는 커피를 마시고, 출근해서 상사에게 칭찬받고, 점심에는 맛있는 음식을 먹었습니다. 

저녁에는 연인과 데이트를 하고 집에 와서 따뜻한 샤워를 했어요.

내일도 이런 하루가 계속되었으면 좋겠네요. 매일매일 똑같은 완벽한 하루가요.

그런데... 잠깐, 어제도 똑같은 하루였던 것 같은데?

그저께도... 그리고 그 전날도...

아, 맞다. 나는 이미 죽었구나.',
'얼핏 보면 평범한 일상 이야기이지만... 자세히 읽어보면 소름이 돋는 이야기입니다.'),

(4, '번역러', '$2y$10$example4', '[번역] Reddit 괴담 "The Stairs in the Woods"', 
'원제: The Stairs in the Woods
출처: Reddit r/nosleep

삼림 관리소에서 일하는 사람들 사이에서는 절대 말하지 않는 규칙이 하나 있습니다. 

숲 속에서 계단을 발견해도 절대 올라가지 말라는 것입니다...

그 계단들은 어디서 왔는지, 왜 거기 있는지 아무도 모릅니다. 하지만 한 가지는 확실합니다.

올라간 사람은... 다시 내려오지 못한다는 것을.

(긴 번역 내용 생략)',
'Reddit에서 유명한 괴담 "숲 속의 계단"을 번역한 이야기입니다.');

-- 댓글 샘플 데이터
INSERT INTO horror_comments (post_id, nickname, comment_password, content, ip_address) VALUES
(1, '지하철이용자', '$2y$10$comment1', '저도 비슷한 경험이 있어요... 정말 무서워요 ㅠㅠ', '127.0.0.1'),
(1, '회의론자', '$2y$10$comment2', '그냥 상상이겠죠? 하지만 재미있네요!', '127.0.0.2'),
(2, '밤샘러', '$2y$10$comment3', '새벽 3시는 정말 으스스한 시간이에요...', '127.0.0.3'),
(3, '추리팬', '$2y$10$comment4', '와... 마지막에 반전이 소름돋아요!', '127.0.0.4'),
(4, 'Reddit팬', '$2y$10$comment5', '원문도 읽어봤는데 번역 잘하셨네요!', '127.0.0.5');

-- 댓글 수 업데이트
UPDATE horror_posts SET comment_count = (
    SELECT COUNT(*) FROM horror_comments WHERE post_id = horror_posts.id
);

-- =====================================================
-- 4. 뷰 생성 (성능 최적화)
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
-- 5. 완료 확인
-- =====================================================
SELECT '무서운 이야기 게시판 DB 재생성 완료!' AS message;
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND table_name LIKE 'horror_%'
ORDER BY TABLE_NAME;

SELECT 
    c.name as '카테고리',
    COUNT(p.id) as '게시글수'
FROM horror_board_categories c
LEFT JOIN horror_posts p ON c.id = p.category_id AND p.status = 'published'
WHERE c.is_active = TRUE
GROUP BY c.id, c.name
ORDER BY c.sort_order;
