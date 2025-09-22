<?php
// 무서운 이야기 게시판 API v2 - 완전 재작성
// JSON API이므로 PHP 경고나 에러가 출력되지 않도록 설정
error_reporting(0);
ini_set('display_errors', 0);

// 출력 버퍼 시작 (혹시 모를 경고 메시지 캐치용)
ob_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// =====================================================
// 데이터베이스 연결
// =====================================================
class HorrorDB {
    private $pdo;
    private $connected = false;
    
    public function __construct() {
        try {
            $host = 'localhost';
            $dbname = 'qkrwnsgn123';
            $username = 'qkrwnsgn123'; 
            $password = 'qkrwnsgn123!';
            
            $this->pdo = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4", 
                $username, 
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
            
            $this->connected = true;
            
        } catch (PDOException $e) {
            $this->logError('DB Connection Failed', $e);
            $this->sendError('데이터베이스 연결에 실패했습니다', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
        }
    }
    
    public function isConnected() {
        return $this->connected;
    }
    
    public function getPDO() {
        return $this->pdo;
    }
    
    private function logError($message, $exception) {
        error_log(date('Y-m-d H:i:s') . " [HORROR API ERROR] $message: " . $exception->getMessage());
    }
    
    private function sendError($message, $details = []) {
        // 출력 버퍼 정리 (경고나 에러 메시지 제거)
        ob_clean();
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'details' => $details,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
}

// =====================================================
// API 핸들러 클래스
// =====================================================
class HorrorAPI {
    private $db;
    
    public function __construct() {
        $this->db = new HorrorDB();
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        
        try {
            switch($action) {
                case 'test':
                    $this->testConnection();
                    break;
                case 'get_categories':
                    $this->getCategories();
                    break;
                case 'get_posts':
                    $this->getPosts();
                    break;
                case 'get_post':
                    $this->getPost();
                    break;
                case 'submit_post':
                    $this->submitPost();
                    break;
                case 'submit_comment':
                    $this->submitComment();
                    break;
                case 'verify_password':
                    $this->verifyPassword();
                    break;
                case 'update_post':
                    $this->updatePost();
                    break;
                case 'delete_post':
                    $this->deletePost();
                    break;
                case 'get_home_data':
                    $this->getHomeData();
                    break;
                default:
                    $this->sendError('잘못된 요청입니다', ['available_actions' => [
                        'test', 'get_categories', 'get_posts', 'get_post', 'submit_post', 'submit_comment', 'verify_password', 'update_post', 'delete_post', 'get_home_data'
                    ]]);
            }
        } catch (Exception $e) {
            $this->sendError('API 처리 중 오류가 발생했습니다', [
                'error' => $e->getMessage(),
                'action' => $action
            ]);
        }
    }
    
    // =====================================================
    // 연결 테스트
    // =====================================================
    public function testConnection() {
        try {
            $pdo = $this->db->getPDO();
            
            $info = [
                'status' => 'connected',
                'timestamp' => date('Y-m-d H:i:s'),
                'mysql_version' => $pdo->query('SELECT VERSION()')->fetchColumn(),
                'current_database' => $pdo->query('SELECT DATABASE()')->fetchColumn()
            ];
            
            // 테이블 확인
            $tables = $pdo->query("SHOW TABLES LIKE 'horror_%'")->fetchAll(PDO::FETCH_COLUMN);
            $info['horror_tables'] = $tables;
            $info['table_count'] = count($tables);
            
            // 각 테이블의 레코드 수
            $table_stats = [];
            foreach ($tables as $table) {
                $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                $table_stats[$table] = (int)$count;
            }
            $info['table_stats'] = $table_stats;
            
            // 카테고리 확인
            if (in_array('horror_board_categories', $tables)) {
                $categories = $pdo->query("SELECT * FROM horror_board_categories ORDER BY sort_order")->fetchAll();
                $info['categories'] = $categories;
            }
            
            $this->sendSuccess($info);
            
        } catch (Exception $e) {
            $this->sendError('테스트 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
    
    // =====================================================
    // 카테고리 목록 조회
    // =====================================================
    public function getCategories() {
        try {
            $pdo = $this->db->getPDO();
            
            $sql = "
                SELECT 
                    c.*,
                    COALESCE(COUNT(p.id), 0) as post_count
                FROM horror_board_categories c
                LEFT JOIN horror_posts p ON c.id = p.category_id AND p.status = 'published'
                WHERE c.is_active = TRUE
                GROUP BY c.id
                ORDER BY c.sort_order ASC
            ";
            
            $categories = $pdo->query($sql)->fetchAll();
            
            $this->sendSuccess([
                'categories' => $categories,
                'total' => count($categories)
            ]);
            
        } catch (Exception $e) {
            $this->sendError('카테고리 조회 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
    
    // =====================================================
    // 게시글 목록 조회
    // =====================================================
    public function getPosts() {
        try {
            $pdo = $this->db->getPDO();
            
            // 파라미터 처리
            $category = $_GET['category'] ?? '';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = min(50, max(1, (int)($_GET['limit'] ?? 10)));
            $sort = $_GET['sort'] ?? 'latest';
            $offset = ($page - 1) * $limit;
            
            // 정렬 조건
            $orderBy = match($sort) {
                'popular' => 'ORDER BY p.view_count DESC, p.created_at DESC',
                'views' => 'ORDER BY p.view_count DESC',
                'comments' => 'ORDER BY p.comment_count DESC',
                'likes' => 'ORDER BY p.like_count DESC',
                default => 'ORDER BY p.created_at DESC'
            };
            
            // WHERE 조건
            $whereConditions = ["p.status = 'published'", "c.is_active = TRUE"];
            $params = [];
            
            if ($category) {
                $whereConditions[] = "c.slug = ?";
                $params[] = $category;
            }
            
            $whereClause = "WHERE " . implode(' AND ', $whereConditions);
            
            // 총 개수 조회
            $countSql = "
                SELECT COUNT(*) as total
                FROM horror_posts p
                JOIN horror_board_categories c ON p.category_id = c.id
                $whereClause
            ";
            
            $stmt = $pdo->prepare($countSql);
            $stmt->execute($params);
            $total = (int)$stmt->fetchColumn();
            
            // 게시글 조회 (MariaDB 호환 - offset, limit 순서)
            $sql = "
                SELECT 
                    p.id,
                    p.title,
                    p.nickname,
                    p.excerpt,
                    p.view_count,
                    p.like_count,
                    p.comment_count,
                    p.is_pinned,
                    p.is_featured,
                    p.created_at,
                    c.name as category_name,
                    c.slug as category_slug,
                    c.icon as category_icon
                FROM horror_posts p
                JOIN horror_board_categories c ON p.category_id = c.id
                $whereClause
                $orderBy
                LIMIT ?, ?
            ";
            
            // MariaDB LIMIT offset, limit 순서로 파라미터 추가
            $allParams = array_merge($params, [$offset, $limit]);
            $stmt = $pdo->prepare($sql);
            
            // 파라미터 바인딩 (타입 명시)
            $paramIndex = 1;
            foreach ($params as $param) {
                $stmt->bindValue($paramIndex++, $param, PDO::PARAM_STR);
            }
            $stmt->bindValue($paramIndex++, (int)$offset, PDO::PARAM_INT);
            $stmt->bindValue($paramIndex, (int)$limit, PDO::PARAM_INT);
            
            $stmt->execute();
            $posts = $stmt->fetchAll();
            
            // 시간 포맷팅 및 썸네일 처리
            foreach ($posts as &$post) {
                $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                
                // YouTube 썸네일 추출 (컨텐츠에서 유튜브 링크가 있다면)
                $fullPost = $this->getPostContent($post['id']);
                if ($fullPost && $fullPost['content']) {
                    $youtubeThumbnail = $this->extractYouTubeThumbnail($fullPost['content']);
                    if ($youtubeThumbnail) {
                        $post['thumbnail'] = $youtubeThumbnail;
                        $post['has_youtube'] = true;
                    } else {
                        $post['has_youtube'] = false;
                    }
                }
            }
            
            $this->sendSuccess([
                'posts' => $posts,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($total / $limit),
                    'total_posts' => $total,
                    'per_page' => $limit,
                    'has_next' => $page < ceil($total / $limit),
                    'has_prev' => $page > 1
                ],
                'filters' => [
                    'category' => $category,
                    'sort' => $sort
                ]
            ]);
            
        } catch (Exception $e) {
            $this->sendError('게시글 목록 조회 중 오류 발생', [
                'error' => $e->getMessage(),
                'params' => [
                    'category' => $category ?? 'none',
                    'page' => $page ?? 'none',
                    'sort' => $sort ?? 'none'
                ]
            ]);
        }
    }
    
    // =====================================================
    // 개별 게시글 조회
    // =====================================================
    public function getPost() {
        try {
            $pdo = $this->db->getPDO();
            
            $id = (int)($_GET['id'] ?? 0);
            
            if (!$id) {
                $this->sendError('게시글 ID가 필요합니다');
                return;
            }
            
            // 조회수 증가
            $pdo->prepare("UPDATE horror_posts SET view_count = view_count + 1 WHERE id = ?")->execute([$id]);
            
            // 게시글 조회
            $sql = "
                SELECT 
                    p.*,
                    c.name as category_name,
                    c.slug as category_slug,
                    c.icon as category_icon
                FROM horror_posts p
                JOIN horror_board_categories c ON p.category_id = c.id
                WHERE p.id = ? AND p.status = 'published'
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $post = $stmt->fetch();
            
            if (!$post) {
                $this->sendError('게시글을 찾을 수 없습니다', ['id' => $id]);
                return;
            }
            
            // 시간 포맷팅
            $post['time_ago'] = $this->getTimeAgo($post['created_at']);
            $post['formatted_date'] = date('Y년 m월 d일 H:i', strtotime($post['created_at']));
            
            // 댓글 조회
            $commentSql = "
                SELECT id, nickname, content, like_count, created_at
                FROM horror_comments 
                WHERE post_id = ? 
                ORDER BY created_at ASC
            ";
            $commentStmt = $pdo->prepare($commentSql);
            $commentStmt->execute([$id]);
            $comments = $commentStmt->fetchAll();
            
            // 댓글 시간 포맷팅
            foreach ($comments as &$comment) {
                $comment['time_ago'] = $this->getTimeAgo($comment['created_at']);
                $comment['formatted_date'] = date('Y.m.d H:i', strtotime($comment['created_at']));
            }
            
            $post['comments'] = $comments;
            
            $this->sendSuccess(['post' => $post]);
            
        } catch (Exception $e) {
            $this->sendError('게시글 조회 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
    
    // =====================================================
    // 게시글 작성
    // =====================================================
    public function submitPost() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                $this->sendError('POST 방식만 지원합니다');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 필수 필드 검증
            $required = ['category', 'title', 'content', 'nickname', 'password'];
            foreach ($required as $field) {
                if (empty($_POST[$field])) {
                    $this->sendError("필수 항목이 누락되었습니다: $field");
                    return;
                }
            }
            
            // 카테고리 확인
            $stmt = $pdo->prepare("SELECT id FROM horror_board_categories WHERE slug = ? AND is_active = TRUE");
            $stmt->execute([$_POST['category']]);
            $category = $stmt->fetch();
            
            if (!$category) {
                $this->sendError('유효하지 않은 카테고리입니다');
                return;
            }
            
            // 게시글 저장
            $sql = "
                INSERT INTO horror_posts (
                    category_id, nickname, post_password, title, content, excerpt, ip_address, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ";
            
            $excerpt = $this->generateExcerpt($_POST['content']);
            $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                $category['id'],
                $_POST['nickname'],
                $passwordHash,
                $_POST['title'],
                $_POST['content'],
                $excerpt,
                $ipAddress
            ]);
            
            $postId = $pdo->lastInsertId();
            
            $this->sendSuccess([
                'post_id' => (int)$postId,
                'message' => '무서운 이야기가 성공적으로 등록되었습니다!'
            ]);
            
        } catch (Exception $e) {
            $this->sendError('게시글 작성 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
    
    // =====================================================
    // 댓글 등록
    // =====================================================
    public function submitComment() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                $this->sendError('POST 방식만 지원합니다');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // POST 데이터 받기
            $post_id = (int)($_POST['post_id'] ?? 0);
            $nickname = trim($_POST['nickname'] ?? '');
            $password = $_POST['password'] ?? '';
            $content = trim($_POST['content'] ?? '');
            
            // 기본 유효성 검사
            if (!$post_id) {
                $this->sendError('게시글 ID가 필요합니다');
                return;
            }
            
            if (empty($nickname) || mb_strlen($nickname) < 2) {
                $this->sendError('닉네임을 2자 이상 입력해주세요');
                return;
            }
            
            if (empty($password) || strlen($password) < 4) {
                $this->sendError('비밀번호를 4자 이상 입력해주세요');
                return;
            }
            
            if (empty($content) || mb_strlen($content) < 2) {
                $this->sendError('댓글 내용을 2자 이상 입력해주세요');
                return;
            }
            
            // 게시글 존재 확인
            $postCheck = $pdo->prepare("SELECT id FROM horror_posts WHERE id = ? AND status = 'published'");
            $postCheck->execute([$post_id]);
            if (!$postCheck->fetchColumn()) {
                $this->sendError('존재하지 않는 게시글입니다');
                return;
            }
            
            $pdo->beginTransaction();
            
            // 댓글 등록
            $sql = "
                INSERT INTO horror_comments (
                    post_id, nickname, comment_password, content, ip_address, created_at
                ) VALUES (?, ?, ?, ?, ?, NOW())
            ";
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$post_id, $nickname, $hashedPassword, $content, $ipAddress]);
            
            $commentId = $pdo->lastInsertId();
            
            // 게시글의 댓글 수 업데이트
            $updateSql = "UPDATE horror_posts SET comment_count = comment_count + 1 WHERE id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([$post_id]);
            
            $pdo->commit();
            
            $this->sendSuccess([
                'comment_id' => (int)$commentId,
                'message' => '댓글이 성공적으로 등록되었습니다!'
            ]);
            
        } catch (Exception $e) {
            if ($pdo && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->sendError('댓글 등록 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
    
    // =====================================================
    // 유틸리티 함수들
    // =====================================================
    private function getTimeAgo($datetime) {
        $time = time() - strtotime($datetime);
        
        if ($time < 60) return '방금 전';
        if ($time < 3600) return floor($time/60) . '분 전';
        if ($time < 86400) return floor($time/3600) . '시간 전';
        if ($time < 2592000) return floor($time/86400) . '일 전';
        if ($time < 31536000) return floor($time/2592000) . '개월 전';
        return floor($time/31536000) . '년 전';
    }
    
    // YouTube 링크를 제거하고 썸네일을 추출하는 함수
    private function generateExcerpt($content, $length = 150) {
        // 먼저 YouTube 링크를 제거
        $text = $this->removeYouTubeLinks($content);
        $text = strip_tags($text);
        $text = preg_replace('/\s+/', ' ', trim($text));
        
        if (mb_strlen($text) > $length) {
            $text = mb_substr($text, 0, $length) . '...';
        }
        return $text;
    }
    
    // YouTube 링크를 제거하는 함수
    private function removeYouTubeLinks($content) {
        // YouTube URL 패턴들
        $patterns = [
            // youtube.com 링크들 (전체 링크 제거)
            '#https?://(www\.)?youtube\.com/watch\?[^\s<>&]*#i',
            '#https?://youtu\.be/[^\s<>&]*#i',
            '#https?://(www\.)?youtube\.com/shorts/[^\s<>&]*#i',
            // 텍스트로만 있는 링크들
            '#(www\.)?youtube\.com/watch\?[^\s<>&]*#i',
            '#youtu\.be/[^\s<>&]*#i',
            '#(www\.)?youtube\.com/shorts/[^\s<>&]*#i'
        ];
        
        foreach ($patterns as $pattern) {
            $content = preg_replace($pattern, '[동영상]', $content);
        }
        
        return $content;
    }
    
    // YouTube ID를 추출하는 함수
    private function extractYouTubeId($url) {
        $patterns = [
            '#(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/shorts/)([^&\n?#]+)#',
            '#youtube\.com/embed/([^&\n?#]+)#',
            '#youtube\.com/v/([^&\n?#]+)#'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }
        
        return false;
    }
    
    // 컨텐츠에서 YouTube 썸네일 URL을 추출하는 함수
    private function extractYouTubeThumbnail($content) {
        $patterns = [
            '#https?://(www\.)?youtube\.com/watch\?[^\s<>&]*#i',
            '#https?://youtu\.be/[^\s<>&]*#i',
            '#https?://(www\.)?youtube\.com/shorts/[^\s<>&]*#i'
        ];
        
        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $content, $matches)) {
                $videoId = $this->extractYouTubeId($matches[0]);
                if ($videoId) {
                    // 고화질 썸네일을 우선적으로 사용
                    return "https://img.youtube.com/vi/$videoId/maxresdefault.jpg";
                }
            }
        }
        
        return null;
    }
    
    // 게시글 내용을 가져오는 헬퍼 함수 (썸네일 추출용)
    private function getPostContent($postId) {
        try {
            $pdo = $this->db->getPDO();
            $stmt = $pdo->prepare("SELECT content FROM horror_posts WHERE id = ? LIMIT 1");
            $stmt->execute([(int)$postId]);
            return $stmt->fetch();
        } catch (Exception $e) {
            return null;
        }
    }
    
    private function sendSuccess($data) {
        // 출력 버퍼 정리 (경고나 에러 메시지 제거)
        ob_clean();
        
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
    private function sendError($message, $details = []) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'details' => $details,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    // 비밀번호 확인
    public function verifyPassword() {
        try {
            $pdo = $this->db->getPDO();
            
            $input = json_decode(file_get_contents('php://input'), true);
            $postId = (int)($input['id'] ?? 0);
            $password = $input['password'] ?? '';
            
            if (!$postId || !$password) {
                $this->sendError('필수 필드(id, password)가 필요합니다');
                return;
            }
            
            $stmt = $pdo->prepare("SELECT post_password FROM horror_posts WHERE id = ? AND status = 'published'");
            $stmt->execute([$postId]);
            $post = $stmt->fetch();
            
            if (!$post) {
                $this->sendError('게시글을 찾을 수 없습니다');
                return;
            }
            
            if (!password_verify($password, $post['post_password'])) {
                $this->sendError('비밀번호가 올바르지 않습니다');
                return;
            }
            
            // 인증 성공: 세션 토큰 저장 (10분 유효)
            session_start();
            if (!isset($_SESSION['horror_edit_auth'])) {
                $_SESSION['horror_edit_auth'] = [];
            }
            $_SESSION['horror_edit_auth'][$postId] = time();
            
            $this->sendSuccess(['message' => '인증 성공']);
            
        } catch (Exception $e) {
            $this->sendError('비밀번호 확인 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }

    // 게시글 수정
    public function updatePost() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
                $this->sendError('PUT 방식만 지원합니다');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            $input = json_decode(file_get_contents('php://input'), true);
            $postId = (int)($input['id'] ?? 0);
            $title = trim($input['title'] ?? '');
            $content = $input['content'] ?? '';
            $categorySlug = $input['category'] ?? '';
            
            if (!$postId || !$title || !$content || !$categorySlug) {
                $this->sendError('필수 필드가 누락되었습니다');
                return;
            }
            
            // 게시글 존재 확인
            $stmt = $pdo->prepare("SELECT * FROM horror_posts WHERE id = ? AND status = 'published'");
            $stmt->execute([$postId]);
            $post = $stmt->fetch();
            
            if (!$post) {
                $this->sendError('게시글을 찾을 수 없습니다');
                return;
            }
            
            // 세션 인증 확인 (비밀번호는 verify_password에서 이미 확인됨)
            session_start();
            $hasSession = isset($_SESSION['horror_edit_auth'][$postId]) && 
                         (time() - $_SESSION['horror_edit_auth'][$postId] <= 600);
            
            if (!$hasSession) {
                $this->sendError('인증이 만료되었습니다. 다시 시도해주세요');
                return;
            }
            
            // 카테고리 ID 확인
            $stmt = $pdo->prepare("SELECT id FROM horror_board_categories WHERE slug = ?");
            $stmt->execute([$categorySlug]);
            $category = $stmt->fetch();
            
            if (!$category) {
                $this->sendError('유효하지 않은 카테고리입니다');
                return;
            }
            
            $pdo->beginTransaction();
            
            // 게시글 수정
            $sql = "
                UPDATE horror_posts 
                SET title = ?, content = ?, excerpt = ?, category_id = ?, updated_at = NOW() 
                WHERE id = ?
            ";
            
            $excerpt = $this->generateExcerpt($content);
            
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([
                $title,
                $content,
                $excerpt,
                $category['id'],
                $postId
            ]);
            
            if (!$success) {
                throw new Exception('게시글 수정에 실패했습니다');
            }
            
            $pdo->commit();
            
            // 세션 정리
            unset($_SESSION['horror_edit_auth'][$postId]);
            
            $this->sendSuccess(['message' => '게시글이 성공적으로 수정되었습니다']);
            
        } catch (Exception $e) {
            if ($pdo && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->sendError('게시글 수정 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }

    // 게시글 삭제 (숨김 처리)
    public function deletePost() {
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
                $this->sendError('DELETE 방식만 지원합니다');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            $input = json_decode(file_get_contents('php://input'), true);
            $postId = (int)($input['id'] ?? 0);
            $password = $input['password'] ?? '';
            
            if (!$postId || !$password) {
                $this->sendError('필수 필드(id, password)가 필요합니다');
                return;
            }
            
            // 게시글 존재 및 비밀번호 확인
            $stmt = $pdo->prepare("SELECT post_password FROM horror_posts WHERE id = ? AND status = 'published'");
            $stmt->execute([$postId]);
            $post = $stmt->fetch();
            
            if (!$post) {
                $this->sendError('게시글을 찾을 수 없습니다');
                return;
            }
            
            if (!password_verify($password, $post['post_password'])) {
                $this->sendError('비밀번호가 올바르지 않습니다');
                return;
            }
            
            $pdo->beginTransaction();
            
            // 게시글 숨김 처리 (실제 삭제하지 않음)
            $sql = "UPDATE horror_posts SET status = 'hidden', updated_at = NOW() WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([$postId]);
            
            if (!$success) {
                throw new Exception('게시글 삭제에 실패했습니다');
            }
            
            $pdo->commit();
            
            $this->sendSuccess(['message' => '게시글이 성공적으로 삭제되었습니다']);
            
        } catch (Exception $e) {
            if ($pdo && $pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $this->sendError('게시글 삭제 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }

    // 홈페이지용 데이터 조회 (안전한 단계별 버전)
    public function getHomeData() {
        try {
            $pdo = $this->db->getPDO();
            $homeData = [];
            
            // 1. 전체 통계 정보 (단계별 안전 쿼리)
            try {
                // 우선 간단한 카운트부터
                $stmt = $pdo->query("SELECT COUNT(*) as total_posts FROM horror_posts");
                $totalPosts = $stmt->fetch()['total_posts'];
                
                // 조회수 합계 (컬럼이 있는지 확인 후)
                $stmt = $pdo->query("SHOW COLUMNS FROM horror_posts LIKE 'view_count'");
                $hasViewCount = $stmt->fetch();
                
                if ($hasViewCount) {
                    $stmt = $pdo->query("SELECT COALESCE(SUM(view_count), 0) as total_views FROM horror_posts");
                    $totalViews = $stmt->fetch()['total_views'];
                } else {
                    $totalViews = 0;
                }
                
                // 활동 일수
                $stmt = $pdo->query("SELECT COUNT(DISTINCT DATE(created_at)) as active_days FROM horror_posts");
                $activeDays = $stmt->fetch()['active_days'];
                
                $homeData['stats'] = [
                    'total_posts' => $totalPosts, 
                    'total_views' => $totalViews, 
                    'active_days' => $activeDays
                ];
            } catch (Exception $e) {
                // 통계 조회 실패시 기본값
                $homeData['stats'] = ['total_posts' => 0, 'total_views' => 0, 'active_days' => 0];
                $homeData['stats_error'] = $e->getMessage();
            }
            
            // 2. 카테고리별 통계 - status 조건 제거
            try {
                $categoryStatsQuery = "
                    SELECT 
                        c.name, c.slug, c.icon, c.color,
                        COUNT(p.id) as post_count,
                        COALESCE(SUM(p.view_count), 0) as total_views
                    FROM horror_board_categories c
                    LEFT JOIN horror_posts p ON c.id = p.category_id
                    GROUP BY c.id, c.name, c.slug, c.icon, c.color
                    ORDER BY post_count DESC
                ";
                $stmt = $pdo->query($categoryStatsQuery);
                $homeData['category_stats'] = $stmt->fetchAll();
            } catch (Exception $e) {
                $homeData['category_stats'] = [];
                $homeData['category_error'] = $e->getMessage();
            }
            
            // 3. 최신 게시물 (전체) - status 조건 제거
            try {
                $latestQuery = "
                    SELECT 
                        p.id, p.title, 
                        COALESCE(p.excerpt, SUBSTRING(p.content, 1, 150)) as excerpt,
                        COALESCE(p.view_count, 0) as view_count, 
                        COALESCE(p.comment_count, 0) as comment_count, 
                        p.created_at,
                        p.nickname, 
                        c.name as category_name, 
                        c.slug as category_slug, 
                        c.icon as category_icon
                    FROM horror_posts p
                    JOIN horror_board_categories c ON p.category_id = c.id
                    ORDER BY p.created_at DESC
                    LIMIT 8
                ";
                $stmt = $pdo->query($latestQuery);
                $latestPosts = $stmt->fetchAll();
                
                foreach ($latestPosts as &$post) {
                    $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                }
                $homeData['latest_posts'] = $latestPosts;
            } catch (Exception $e) {
                $homeData['latest_posts'] = [];
                $homeData['latest_error'] = $e->getMessage();
            }
            
            // 4. 인기 게시물 (조회수 기준) - status 조건 제거
            try {
                $popularQuery = "
                    SELECT 
                        p.id, p.title, 
                        COALESCE(p.excerpt, SUBSTRING(p.content, 1, 150)) as excerpt,
                        COALESCE(p.view_count, 0) as view_count, 
                        COALESCE(p.comment_count, 0) as comment_count, 
                        p.created_at,
                        p.nickname, 
                        c.name as category_name, 
                        c.slug as category_slug, 
                        c.icon as category_icon
                    FROM horror_posts p
                    JOIN horror_board_categories c ON p.category_id = c.id
                    ORDER BY COALESCE(p.view_count, 0) DESC, p.created_at DESC
                    LIMIT 6
                ";
                $stmt = $pdo->query($popularQuery);
                $popularPosts = $stmt->fetchAll();
                
                foreach ($popularPosts as &$post) {
                    $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                }
                $homeData['popular_posts'] = $popularPosts;
            } catch (Exception $e) {
                $homeData['popular_posts'] = [];
                $homeData['popular_error'] = $e->getMessage();
            }
            
            // 5. 카테고리별 최신 게시물
            try {
                $categoriesQuery = "SELECT id, name, slug, icon FROM horror_board_categories ORDER BY id";
                $stmt = $pdo->query($categoriesQuery);
                $categories = $stmt->fetchAll();
                
                $homeData['category_posts'] = [];
                foreach ($categories as $category) {
                    $categoryPostsQuery = "
                        SELECT 
                            p.id, p.title, 
                            COALESCE(p.excerpt, SUBSTRING(p.content, 1, 150)) as excerpt,
                            COALESCE(p.view_count, 0) as view_count, 
                            COALESCE(p.comment_count, 0) as comment_count, 
                            p.created_at, p.nickname
                        FROM horror_posts p
                        WHERE p.category_id = ?
                        ORDER BY p.created_at DESC
                        LIMIT 3
                    ";
                    $stmt = $pdo->prepare($categoryPostsQuery);
                    $stmt->execute([$category['id']]);
                    $categoryPosts = $stmt->fetchAll();
                    
                    foreach ($categoryPosts as &$post) {
                        $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                    }
                    
                    $homeData['category_posts'][$category['slug']] = [
                        'category' => $category,
                        'posts' => $categoryPosts
                    ];
                }
            } catch (Exception $e) {
                $homeData['category_posts'] = [];
                $homeData['category_posts_error'] = $e->getMessage();
            }
            
            // 6. 최근 댓글이 달린 게시물 (단순화)
            try {
                $homeData['recent_comment_posts'] = []; // 일단 빈 배열로 설정
            } catch (Exception $e) {
                $homeData['recent_comment_posts'] = [];
                $homeData['recent_comments_error'] = $e->getMessage();
            }
            
            $this->sendSuccess($homeData);
            
        } catch (Exception $e) {
            $this->sendError('홈페이지 데이터 조회 중 오류 발생', ['error' => $e->getMessage()]);
        }
    }
}

// =====================================================
// API 실행
// =====================================================
try {
    $api = new HorrorAPI();
    $api->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => '시스템 오류가 발생했습니다',
        'details' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
