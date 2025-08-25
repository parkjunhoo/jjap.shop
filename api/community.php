<?php
// =====================================================
// 커뮤니티 API - 게시글 CRUD
// =====================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// 세션 시작 (비밀번호 선검증 토큰 저장용)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

try {
    require_once '../includes/db.php';
    
    // 요청 메소드 확인
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    switch ($method) {
        case 'GET':
            handleGet($action);
            break;
        case 'POST':
            handlePost($action);
            break;
        case 'PUT':
            handlePut($action);
            break;
        case 'DELETE':
            handleDelete($action);
            break;
        default:
            sendResponse(405, '허용되지 않는 메소드입니다.');
    }
} catch (Exception $e) {
    error_log("API 오류: " . $e->getMessage());
    sendResponse(500, '서버 오류가 발생했습니다: ' . $e->getMessage());
}

// GET 요청 처리
function handleGet($action) {
    global $db;
    
    switch ($action) {
        case 'posts':
            getPosts();
            break;
        case 'post':
            getPost();
            break;
        case 'categories':
            getCategories();
            break;
        case 'comments':
            getComments();
            break;
        case 'test':
            testConnection();
            break;
        default:
            sendResponse(400, '잘못된 액션입니다.');
    }
}

// POST 요청 처리
function handlePost($action) {
    global $db;
    
    switch ($action) {
        case 'create_post':
            createPost();
            break;
        case 'create_comment':
            createComment();
            break;
        case 'like':
            toggleLike();
            break;
        case 'increase_view':
            increaseView();
            break;
        case 'verify_password':
            verifyPassword();
            break;
        default:
            sendResponse(400, '잘못된 액션입니다.');
    }
}

// PUT 요청 처리
function handlePut($action) {
    global $db;
    
    switch ($action) {
        case 'update_post':
            updatePost();
            break;
        case 'update_comment':
            updateComment();
            break;
        default:
            sendResponse(400, '잘못된 액션입니다.');
    }
}

// 조회수 증가 (프론트 중복 방지 후 호출)
function increaseView() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    $postId = (int)($input['post_id'] ?? 0);
    if (!$postId) {
        sendResponse(400, '게시글 ID가 필요합니다.');
    }
    $db->update("UPDATE posts SET view_count = view_count + 1 WHERE id = ?", [$postId]);
    sendResponse(200, '조회수 증가');
}

// 비밀번호 선검증 (편집/삭제 진입 전 확인)
function verifyPassword() {
    global $db;
    $input = json_decode(file_get_contents('php://input'), true);
    $postId = (int)($input['id'] ?? 0);
    $password = $input['password'] ?? '';
    if (!$postId || !$password) {
        sendResponse(400, '필수 필드(id, password)가 필요합니다.');
    }
    $post = $db->fetch("SELECT post_password FROM posts WHERE id = ? AND status <> 'hidden'", [$postId]);
    if (!$post) {
        sendResponse(404, '게시글을 찾을 수 없습니다.');
    }
    if (!password_verify($password, $post['post_password'])) {
        sendResponse(403, '비밀번호가 올바르지 않습니다.');
    }
    // 인증 성공: 세션 토큰 저장 (10분 이내 유효)
    if (!isset($_SESSION['edit_auth'])) { $_SESSION['edit_auth'] = []; }
    $_SESSION['edit_auth'][$postId] = time();
    sendResponse(200, '인증 성공');
}

// DELETE 요청 처리
function handleDelete($action) {
    global $db;
    
    switch ($action) {
        case 'delete_post':
            deletePost();
            break;
        case 'delete_comment':
            deleteComment();
            break;
        default:
            sendResponse(400, '잘못된 액션입니다.');
    }
}

// 댓글 삭제(숨김 처리)
function deleteComment() {
    global $db;
    $input = json_decode(file_get_contents('php://input'), true);
    $commentId = (int)($input['id'] ?? 0);
    $password = $input['password'] ?? '';
    if (!$commentId || !$password) {
        sendResponse(400, '필수 필드(id, password)가 필요합니다.');
    }
    $comment = $db->fetch("SELECT id, post_id, comment_password, is_deleted FROM comments WHERE id = ?", [$commentId]);
    if (!$comment) {
        sendResponse(404, '댓글을 찾을 수 없습니다.');
    }
    if ((int)$comment['is_deleted'] === 1) {
        sendResponse(200, '이미 삭제된 댓글입니다.');
    }
    if (!password_verify($password, $comment['comment_password'])) {
        sendResponse(403, '비밀번호가 올바르지 않습니다.');
    }
    $ok = $db->update("UPDATE comments SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [$commentId]);
    if ($ok) {
        // 게시글 댓글 수 감소
        $db->update("UPDATE posts SET comment_count = CASE WHEN comment_count > 0 THEN comment_count - 1 ELSE 0 END WHERE id = ?", [$comment['post_id']]);
        sendResponse(200, '댓글이 삭제되었습니다.');
    } else {
        sendResponse(500, '댓글 삭제에 실패했습니다.');
    }
}

// 게시글 목록 조회
function getPosts() {
    global $db;
    
    try {
        $page = (int)($_GET['page'] ?? 1);
        $limit = (int)($_GET['limit'] ?? 10);
        $category = $_GET['category'] ?? '';
        $search = $_GET['search'] ?? '';
        $sort = $_GET['sort'] ?? 'latest';
        
        $offset = ($page - 1) * $limit;
    
    // 기본 쿼리
    $sql = "SELECT p.*, c.name as category_name, 
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND is_deleted = 0) as comment_count
            FROM posts p 
            LEFT JOIN board_categories c ON p.category_id = c.id 
            WHERE p.status = 'published'";
    
    $params = [];
    
    // 카테고리 필터
    if ($category && $category !== 'all') {
        $sql .= " AND c.slug = ?";
        $params[] = $category;
    }
    
    // 검색 필터 (제목, 작성자만)
    if ($search) {
        $sql .= " AND (p.title LIKE ? OR p.nickname LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    // 정렬
    switch ($sort) {
        case 'popular':
            $sql .= " ORDER BY p.like_count DESC, p.view_count DESC";
            break;
        case 'views':
            $sql .= " ORDER BY p.view_count DESC";
            break;
        case 'latest':
        default:
            $sql .= " ORDER BY p.created_at DESC";
            break;
    }
    
    $sql .= " LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $posts = $db->fetchAll($sql, $params);
    
    // 전체 게시글 수 조회
    $countSql = "SELECT COUNT(*) as total FROM posts p 
                  LEFT JOIN board_categories c ON p.category_id = c.id 
                  WHERE p.status = 'published'";
    
    if ($category && $category !== 'all') {
        $countSql .= " AND c.slug = ?";
        $countParams = [$category];
    } else {
        $countParams = [];
    }
    
    if ($search) {
        $countSql .= " AND (p.title LIKE ? OR p.nickname LIKE ?)";
        $searchTerm = "%{$search}%";
        $countParams[] = $searchTerm;
        $countParams[] = $searchTerm;
    }
    
    $totalResult = $db->fetch($countSql, $countParams);
    $total = $totalResult['total'];
    
    sendResponse(200, '성공', [
        'posts' => $posts,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_posts' => $total,
            'has_next' => $page < ceil($total / $limit),
            'has_prev' => $page > 1
        ]
    ]);
    } catch (Exception $e) {
        error_log("getPosts 오류: " . $e->getMessage());
        sendResponse(500, '게시글 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

// 게시글 상세 조회
function getPost() {
    global $db;
    
    try {
        $postId = (int)($_GET['id'] ?? 0);
        
        if (!$postId) {
            sendResponse(400, '게시글 ID가 필요합니다.');
        }
        
        // 조회수 증가는 프론트에서 중복 방지 후 별도 엔드포인트로 처리 예정
        
        // 게시글 정보 조회
        $post = $db->fetch("SELECT p.*, c.name as category_name 
                            FROM posts p 
                            LEFT JOIN board_categories c ON p.category_id = c.id 
                            WHERE p.id = ? AND p.status = 'published'", [$postId]);
        
        if (!$post) {
            sendResponse(404, '게시글을 찾을 수 없습니다.');
        }
        
        // 댓글 조회
        $comments = $db->fetchAll("SELECT * FROM comments 
                                   WHERE post_id = ? AND is_deleted = 0 
                                   ORDER BY created_at ASC", [$postId]);
        
        sendResponse(200, '성공', [
            'post' => $post,
            'comments' => $comments
        ]);
    } catch (Exception $e) {
        error_log("getPost 오류: " . $e->getMessage());
        sendResponse(500, '게시글을 불러오는 중 오류가 발생했습니다.');
    }
}

// 카테고리 목록 조회
function getCategories() {
    global $db;
    
    try {
        $categories = $db->fetchAll("SELECT * FROM board_categories WHERE is_active = 1 ORDER BY sort_order ASC");
        
        sendResponse(200, '성공', ['categories' => $categories]);
    } catch (Exception $e) {
        error_log("getCategories 오류: " . $e->getMessage());
        sendResponse(500, '카테고리 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

// 댓글 목록 조회
function getComments() {
    global $db;
    
    try {
        $postId = (int)($_GET['post_id'] ?? 0);
        
        if (!$postId) {
            sendResponse(400, '게시글 ID가 필요합니다.');
        }
        
        $comments = $db->fetchAll("SELECT * FROM comments 
                                   WHERE post_id = ? AND is_deleted = 0 
                                   ORDER BY created_at ASC", [$postId]);
        
        sendResponse(200, '성공', ['comments' => $comments]);
    } catch (Exception $e) {
        error_log("getComments 오류: " . $e->getMessage());
        sendResponse(500, '댓글 목록을 불러오는 중 오류가 발생했습니다.');
    }
}

// 게시글 생성
function createPost() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 필수 필드 검증
    $required = ['category_id', 'title', 'content', 'nickname', 'password'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            sendResponse(400, "필수 필드가 누락되었습니다: {$field}");
        }
    }
    
    // CAPTCHA 검증 (나중에 구현)
    // if (!verifyCaptcha($input['captcha'])) {
    //     sendResponse(400, '자동입력방지문구가 올바르지 않습니다.');
    // }
    
    $sql = "INSERT INTO posts (category_id, nickname, post_password, title, content, excerpt, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    $excerpt = mb_substr(strip_tags($input['content']), 0, 200) . '...';
    
    $postId = $db->insert($sql, [
        $input['category_id'],
        $input['nickname'],
        password_hash($input['password'], PASSWORD_DEFAULT),
        $input['title'],
        $input['content'],
        $excerpt,
        $_SERVER['REMOTE_ADDR'] ?? '',
        $_SERVER['HTTP_USER_AGENT'] ?? ''
    ]);
    
    if ($postId) {
        sendResponse(201, '게시글이 성공적으로 작성되었습니다.', ['post_id' => $postId]);
    } else {
        sendResponse(500, '게시글 작성에 실패했습니다.');
    }
}

// 댓글 생성
function createComment() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 필수 필드 검증
    $required = ['post_id', 'content', 'nickname', 'password'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            sendResponse(400, "필수 필드가 누락되었습니다: {$field}");
        }
    }
    
    $sql = "INSERT INTO comments (post_id, nickname, comment_password, content, parent_id, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $commentId = $db->insert($sql, [
        $input['post_id'],
        $input['nickname'],
        password_hash($input['password'], PASSWORD_DEFAULT),
        $input['content'],
        $input['parent_id'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? '',
        $_SERVER['HTTP_USER_AGENT'] ?? ''
    ]);
    
    if ($commentId) {
        // 게시글 댓글 수 증가
        $db->update("UPDATE posts SET comment_count = comment_count + 1 WHERE id = ?", [$input['post_id']]);
        
        sendResponse(201, '댓글이 성공적으로 작성되었습니다.', ['comment_id' => $commentId]);
    } else {
        sendResponse(500, '댓글 작성에 실패했습니다.');
    }
}

// 댓글 수정
function updateComment() {
    global $db;
    $input = json_decode(file_get_contents('php://input'), true);
    $commentId = (int)($input['id'] ?? 0);
    $content = $input['content'] ?? '';
    $password = $input['password'] ?? '';
    if (!$commentId || !$content || !$password) {
        sendResponse(400, '필수 필드(id, content, password)가 필요합니다.');
    }
    $comment = $db->fetch("SELECT id, comment_password, is_deleted FROM comments WHERE id = ?", [$commentId]);
    if (!$comment || (int)$comment['is_deleted'] === 1) {
        sendResponse(404, '댓글을 찾을 수 없습니다.');
    }
    if (!password_verify($password, $comment['comment_password'])) {
        sendResponse(403, '비밀번호가 올바르지 않습니다.');
    }
    $ok = $db->update("UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [$content, $commentId]);
    if ($ok) {
        sendResponse(200, '댓글이 수정되었습니다.');
    } else {
        sendResponse(500, '댓글 수정에 실패했습니다.');
    }
}

// 좋아요 토글
function toggleLike() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['target_type']) || empty($input['target_id'])) {
        sendResponse(400, '필수 필드가 누락되었습니다.');
    }
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    
    // 기존 좋아요 확인
    $existing = $db->fetch("SELECT id FROM likes WHERE ip_address = ? AND target_type = ? AND target_id = ?", 
                           [$ip, $input['target_type'], $input['target_id']]);
    
    if ($existing) {
        // 좋아요 취소
        $db->delete("DELETE FROM likes WHERE id = ?", [$existing['id']]);
        
        // 카운트 감소
        $table = $input['target_type'] === 'post' ? 'posts' : 'comments';
        $db->update("UPDATE {$table} SET like_count = like_count - 1 WHERE id = ?", [$input['target_id']]);
        
        sendResponse(200, '좋아요가 취소되었습니다.', ['liked' => false]);
    } else {
        // 좋아요 추가
        $db->insert("INSERT INTO likes (ip_address, target_type, target_id) VALUES (?, ?, ?)", 
                    [$ip, $input['target_type'], $input['target_id']]);
        
        // 카운트 증가
        $table = $input['target_type'] === 'post' ? 'posts' : 'comments';
        $db->update("UPDATE {$table} SET like_count = like_count + 1 WHERE id = ?", [$input['target_id']]);
        
        sendResponse(200, '좋아요가 추가되었습니다.', ['liked' => true]);
    }
}

// 게시글 수정
function updatePost() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        sendResponse(400, '게시글 ID가 필요합니다.');
    }
    
    // 세션 인증 또는 비밀번호 확인
    $post = $db->fetch("SELECT * FROM posts WHERE id = ?", [$input['id']]);
    if (!$post) {
        sendResponse(404, '게시글을 찾을 수 없습니다.');
    }
    $hasSession = isset($_SESSION['edit_auth'][$input['id']]) && (time() - $_SESSION['edit_auth'][$input['id']] <= 600);
    if (!$hasSession) {
        if (empty($input['password']) || !password_verify($input['password'], $post['post_password'])) {
            sendResponse(403, '비밀번호가 올바르지 않습니다.');
        }
        // 비밀번호로 인증한 경우에도 세션 토큰 부여(편의)
        $_SESSION['edit_auth'][$input['id']] = time();
    }
    
    // 카테고리 변경 허용
    $sql = "UPDATE posts SET title = ?, content = ?, excerpt = ?, category_id = COALESCE(?, category_id), updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    
    $excerpt = mb_substr(strip_tags($input['content']), 0, 200) . '...';
    
    $result = $db->update($sql, [
        $input['title'],
        $input['content'],
        $excerpt,
        isset($input['category_id']) && $input['category_id'] ? (int)$input['category_id'] : null,
        $input['id']
    ]);
    
    if ($result) {
        sendResponse(200, '게시글이 성공적으로 수정되었습니다.');
    } else {
        sendResponse(500, '게시글 수정에 실패했습니다.');
    }
}

// 게시글 삭제
function deletePost() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['id'])) {
        sendResponse(400, '게시글 ID가 필요합니다.');
    }
    
    // 세션 인증 또는 비밀번호 확인
    $post = $db->fetch("SELECT * FROM posts WHERE id = ?", [$input['id']]);
    if (!$post) {
        sendResponse(404, '게시글을 찾을 수 없습니다.');
    }
    $hasSession = isset($_SESSION['edit_auth'][$input['id']]) && (time() - $_SESSION['edit_auth'][$input['id']] <= 600);
    if (!$hasSession) {
        if (empty($input['password']) || !password_verify($input['password'], $post['post_password'])) {
            sendResponse(403, '비밀번호가 올바르지 않습니다.');
        }
    }
    
    // 실제 삭제 대신 숨김 처리
    $result = $db->update("UPDATE posts SET status = 'hidden' WHERE id = ?", [$input['id']]);
    
    if ($result) {
        sendResponse(200, '게시글이 성공적으로 삭제되었습니다.');
    } else {
        sendResponse(500, '게시글 삭제에 실패했습니다.');
    }
}

// 데이터베이스 연결 테스트
function testConnection() {
    global $db;
    
    try {
        // 간단한 쿼리로 연결 테스트
        $result = $db->fetch("SELECT 1 as test");
        
        if ($result) {
            sendResponse(200, '데이터베이스 연결 성공', [
                'connection' => 'success',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        } else {
            sendResponse(500, '데이터베이스 연결 실패');
        }
    } catch (Exception $e) {
        error_log("testConnection 오류: " . $e->getMessage());
        sendResponse(500, '데이터베이스 연결 테스트 실패: ' . $e->getMessage());
    }
}

// 응답 전송
function sendResponse($status, $message, $data = null) {
    http_response_code($status);
    
    $response = [
        'status' => $status,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}
?>
