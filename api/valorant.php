<?php
// 발로란트 팁 게시판 API
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 데이터베이스 연결
class ValorantDB {
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
            $this->sendError('데이터베이스 연결에 실패했습니다.', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
        }
    }
    
    public function getPDO() {
        return $this->pdo;
    }
    
    private function logError($message, $exception) {
        error_log(date('Y-m-d H:i:s') . " [VALORANT API ERROR] $message: " . $exception->getMessage());
    }
    
    private function sendError($message, $details = []) {
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

// API 핸들러 클래스
class ValorantAPI {
    private $db;
    
    public function __construct() {
        $this->db = new ValorantDB();
    }
    
    public function handleRequest() {
        $action = $_GET['action'] ?? '';
        
        // 디버깅을 위한 로그
        error_log("[VALORANT API] 액션 호출: " . $action);
        
        try {
            switch($action) {
                case 'test':
                    $this->testConnection();
                    break;
                case 'get_agents':
                    $this->getAgents();
                    break;
                case 'get_posts':
                    $this->getPosts();
                    break;
                case 'get_post':
                    $this->getPost();
                    break;
                case 'create_post':
                    $this->createPost();
                    break;
                case 'update_post':
                    $this->updatePost();
                    break;
                case 'delete_post':
                    $this->deletePost();
                    break;
                case 'verify_password':
                    $this->verifyPassword();
                    break;
                case 'create_comment':
                    $this->createComment();
                    break;
                case 'get_comments':
                    $this->getComments();
                    break;
                case 'like_post':
                    $this->likePost();
                    break;
                case 'toggle_favorite':
                    $this->toggleFavorite();
                    break;
                case 'get_favorites':
                    $this->getFavorites();
                    break;
                case 'upload_image':
                    $this->uploadImage();
                    break;
                case 'get_latest_tips':
                    $this->getLatestTips();
                    break;
                case 'debug':
                    $this->debugInfo();
                    break;
                default:
                    $this->sendError('잘못된 액션입니다.', [
                        'available_actions' => ['test', 'get_agents', 'get_posts', 'get_post', 'create_post', 'update_post', 'delete_post', 'verify_password', 'create_comment', 'get_comments', 'like_post', 'toggle_favorite', 'get_favorites', 'upload_image', 'get_latest_tips', 'debug'],
                        'requested_action' => $action
                    ]);
            }
        } catch (Exception $e) {
            $this->sendError('API 처리 중 오류가 발생했습니다.', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    // 연결 테스트
    public function testConnection() {
        $this->sendSuccess(['message' => 'Valorant API 연결 성공']);
    }
    
    // 디버깅 정보 제공
    public function debugInfo() {
        try {
            $pdo = $this->db->getPDO();
            $debugData = [];
            
            // DB 연결 확인
            $debugData['db_connected'] = true;
            
            // 테이블 존재 확인
            $tables = ['valorant_agents', 'valorant_agent_types', 'valorant_posts'];
            $debugData['tables'] = [];
            
            foreach ($tables as $table) {
                $checkTable = $pdo->query("SHOW TABLES LIKE '$table'");
                $exists = $checkTable->rowCount() > 0;
                $debugData['tables'][$table] = ['exists' => $exists];
                
                if ($exists) {
                    // 데이터 개수 확인
                    $countStmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
                    $count = $countStmt->fetch()['count'];
                    $debugData['tables'][$table]['count'] = $count;
                    
                    // valorant_agents 추가 정보
                    if ($table === 'valorant_agents') {
                        $activeStmt = $pdo->query("SELECT COUNT(*) as count FROM valorant_agents WHERE is_active = TRUE");
                        $activeCount = $activeStmt->fetch()['count'];
                        $debugData['tables'][$table]['active_count'] = $activeCount;
                        
                        // 샘플 데이터
                        $sampleStmt = $pdo->query("SELECT id, agent_name, is_active FROM valorant_agents LIMIT 3");
                        $samples = $sampleStmt->fetchAll();
                        $debugData['tables'][$table]['samples'] = $samples;
                    }
                }
            }
            
            // API 호출 정보
            $debugData['api_info'] = [
                'request_method' => $_SERVER['REQUEST_METHOD'],
                'query_string' => $_SERVER['QUERY_STRING'] ?? '',
                'requested_action' => $_GET['action'] ?? '',
                'timestamp' => date('Y-m-d H:i:s')
            ];
            
            $this->sendSuccess($debugData);
            
        } catch (Exception $e) {
            $this->sendError('디버그 정보 조회 실패', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    // 요원 목록 조회
    public function getAgents() {
        try {
            $pdo = $this->db->getPDO();
            
            // 디버깅을 위한 로그 추가
            error_log("[VALORANT API] getAgents() 호출됨");
            
            // 먼저 테이블 존재 여부 확인
            $checkTable = $pdo->query("SHOW TABLES LIKE 'valorant_agents'");
            $tableCount = $checkTable->rowCount();
            error_log("[VALORANT API] valorant_agents 테이블 존재 여부: " . $tableCount);
            
            if ($tableCount === 0) {
                error_log("[VALORANT API] 테이블이 존재하지 않음");
                // 테이블이 없으면 SQL 파일 실행 필요
                $this->sendError('발로란트 테이블이 생성되지 않았습니다. /admin/setup_valorant.php 에서 DB를 설정하세요.', [
                    'setup_url' => '/admin/setup_valorant.php',
                    'description' => '테이블 생성이 필요합니다.',
                    'debug' => 'valorant_agents 테이블이 존재하지 않습니다.'
                ]);
                return;
            }
            
            $sql = "
                SELECT 
                    a.id,
                    a.agent_name as name,
                    a.agent_name_en as name_en,
                    a.agent_image as image,
                    a.agent_description as description,
                    at.type_name,
                    at.type_name_en,
                    at.type_icon,
                    at.type_color
                FROM valorant_agents a
                LEFT JOIN valorant_agent_types at ON a.agent_type_id = at.id
                WHERE a.is_active = TRUE
                ORDER BY a.agent_type_id, a.sort_order
            ";
            
            $stmt = $pdo->query($sql);
            $agents = $stmt->fetchAll();
            
            error_log("[VALORANT API] 쿼리 실행 완료, 조회된 행 수: " . count($agents));
            
            // JavaScript에서 기대하는 단순한 배열 형태로 반환
            $result_agents = [];
            foreach ($agents as $agent) {
                $result_agents[] = [
                    'id' => (int)$agent['id'],
                    'name' => $agent['name'],
                    'name_en' => $agent['name_en'],
                    'image' => $agent['image'] ?: '/assets/images/valorant/default-agent.webp',
                    'description' => $agent['description'],
                    'type_name' => $agent['type_name'] ?: '일반',
                    'type_name_en' => $agent['type_name_en'] ?: 'General',
                    'type_icon' => $agent['type_icon'],
                    'type_color' => $agent['type_color'] ?: '#666666'
                ];
            }
            
            error_log("[VALORANT API] 변환된 요원 수: " . count($result_agents));
            
            // 첫 번째 요원 데이터 샘플 로그
            if (!empty($result_agents)) {
                error_log("[VALORANT API] 첫 번째 요원 샘플: " . json_encode($result_agents[0]));
            }
            
            // 결과가 비어있는 경우 처리
            if (count($result_agents) === 0) {
                $this->sendError('등록된 요원이 없습니다. /admin/setup_valorant.php 에서 요원 데이터를 추가하세요.', [
                    'setup_url' => '/admin/setup_valorant.php',
                    'description' => '요원 데이터 추가가 필요합니다.',
                    'agents_count' => 0
                ]);
                return;
            }
            
            $this->sendSuccess([
                'agents' => $result_agents,
                'count' => count($result_agents),
                'message' => count($result_agents) . '명의 요원을 불러왔습니다.'
            ]);
            
        } catch (Exception $e) {
            $this->sendError('요원 정보 조회 실패', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    // 게시글 목록 조회
    public function getPosts() {
        try {
            error_log("[VALORANT API] getPosts() 호출됨");
            
            // GET 파라미터 로그
            error_log("[VALORANT API] GET 파라미터: " . json_encode($_GET));
            
            $pdo = $this->db->getPDO();
            
            // 테이블 존재 확인
            try {
                $pdo->query("SELECT 1 FROM valorant_posts LIMIT 1");
            } catch (Exception $e) {
                // 테이블이 없는 경우 빈 결과 반환
                $this->sendSuccess([
                    'posts' => [],
                    'pagination' => [
                        'current_page' => 1,
                        'total_pages' => 0,
                        'total_posts' => 0,
                        'per_page' => 10,
                        'has_next' => false,
                        'has_prev' => false
                    ],
                    'filters' => [
                        'agent_id' => '',
                        'agent_name' => '',
                        'sort' => 'latest'
                    ]
                ]);
                return;
            }
            
            // 파라미터 처리
            $agent_id = $_GET['agent_id'] ?? '';
            $agent_ids = $_GET['agent_ids'] ?? '';
            $agent_name = $_GET['agent_name'] ?? '';
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = min(50, max(1, (int)($_GET['limit'] ?? 10)));
            $sort = $_GET['sort'] ?? 'latest';
            $offset = ($page - 1) * $limit;
            
            // WHERE 조건
            $whereConditions = ["p.status = 'published'"];
            $params = [];
            
            // 요원 필터링
            if ($agent_ids) {
                // 다중 요원 선택 (예: "1,2,3")
                $agentIdArray = array_map('intval', explode(',', $agent_ids));
                $agentIdArray = array_filter($agentIdArray, function($id) { return $id > 0; });
                
                if (!empty($agentIdArray)) {
                    $placeholders = str_repeat('?,', count($agentIdArray) - 1) . '?';
                    $whereConditions[] = "p.agent_id IN ($placeholders)";
                    $params = array_merge($params, $agentIdArray);
                }
            } elseif ($agent_id) {
                // 단일 요원 선택 (기존 방식 호환)
                $whereConditions[] = "p.agent_id = ?";
                $params[] = $agent_id;
            } elseif ($agent_name) {
                // 요원 이름으로 필터링
                $whereConditions[] = "a.agent_name = ?";
                $params[] = $agent_name;
            }
            
            $whereClause = "WHERE " . implode(' AND ', $whereConditions);
            
            // 정렬 조건 (PHP 7.x 호환)
            switch($sort) {
                case 'popular':
                    $orderBy = 'ORDER BY p.view_count DESC, p.created_at DESC';
                    break;
                case 'likes':
                    $orderBy = 'ORDER BY p.like_count DESC, p.created_at DESC';
                    break;
                case 'comments':
                    $orderBy = 'ORDER BY p.comment_count DESC, p.created_at DESC';
                    break;
                default:
                    $orderBy = 'ORDER BY p.created_at DESC';
                    break;
            }
            
            // 총 개수 조회
            $countSql = "
                SELECT COUNT(*) as total
                FROM valorant_posts p
                LEFT JOIN valorant_agents a ON p.agent_id = a.id
                $whereClause
            ";
            
            $stmt = $pdo->prepare($countSql);
            $stmt->execute($params);
            $total = (int)$stmt->fetchColumn();
            
            // 게시글 조회
            $sql = "
                SELECT 
                    p.id, p.title, p.summary, p.nickname, p.view_count, p.like_count, 
                    p.comment_count, p.favorite_count, p.is_featured, p.is_notice,
                    p.tip_difficulty, p.tip_category, p.tags, p.created_at,
                    a.agent_name, a.agent_image, a.agent_name_en,
                    at.type_name, at.type_color, at.type_icon
                FROM valorant_posts p
                LEFT JOIN valorant_agents a ON p.agent_id = a.id
                LEFT JOIN valorant_agent_types at ON a.agent_type_id = at.id
                $whereClause
                $orderBy
                LIMIT $limit OFFSET $offset
            ";
            
            $allParams = $params;
            error_log("[VALORANT API] SQL 쿼리: " . $sql);
            error_log("[VALORANT API] SQL 파라미터: " . json_encode($allParams));
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($allParams);
            $posts = $stmt->fetchAll();
            
            error_log("[VALORANT API] 조회된 게시글 수: " . count($posts));
            
            // 시간 포맷팅
            foreach ($posts as &$post) {
                $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                $post['tags'] = json_decode($post['tags'] ?? '[]', true);
                
                // 기본값 설정 (요원 정보가 없는 경우)
                $post['agent_name'] = $post['agent_name'] ?? '일반';
                $post['agent_image'] = $post['agent_image'] ?? '/assets/images/valorant/default-agent.webp';
                $post['type_name'] = $post['type_name'] ?? '일반';
                $post['type_color'] = $post['type_color'] ?? '#666666';
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
                    'agent_id' => $agent_id,
                    'agent_name' => $agent_name,
                    'sort' => $sort
                ]
            ]);
            
        } catch (Exception $e) {
            error_log("[VALORANT API] getPosts 예외 발생: " . $e->getMessage());
            error_log("[VALORANT API] Stack trace: " . $e->getTraceAsString());
            $this->sendError('게시글 목록 조회 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 게시글 상세 조회
    public function getPost() {
        try {
            $post_id = (int)($_GET['id'] ?? 0);
            
            if (!$post_id) {
                $this->sendError('게시글 ID가 필요합니다.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 조회수 증가
            $this->incrementViewCount($post_id);
            
            // 게시글 조회
            $sql = "
                SELECT 
                    p.*, a.agent_name, a.agent_image, a.agent_name_en,
                    at.type_name, at.type_color, at.type_icon
                FROM valorant_posts p
                JOIN valorant_agents a ON p.agent_id = a.id
                JOIN valorant_agent_types at ON a.agent_type_id = at.id
                WHERE p.id = ? AND p.status = 'published'
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$post_id]);
            $post = $stmt->fetch();
            
            if (!$post) {
                $this->sendError('게시글을 찾을 수 없습니다.');
                return;
            }
            
            $post['time_ago'] = $this->getTimeAgo($post['created_at']);
            $post['tags'] = json_decode($post['tags'] ?? '[]', true);
            
            $this->sendSuccess(['post' => $post]);
            
        } catch (Exception $e) {
            $this->sendError('게시글 조회 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 게시글 작성
    public function createPost() {
        try {
            error_log("[VALORANT API] createPost() 호출됨");
            
            // POST 데이터 로그
            error_log("[VALORANT API] POST 데이터: " . json_encode($_POST));
            
            // 필수 필드 검증
            $required = ['agent_id', 'title', 'content', 'nickname', 'password'];
            foreach ($required as $field) {
                if (empty($_POST[$field])) {
                    error_log("[VALORANT API] 필수 필드 누락: $field");
                    $this->sendError("필수 항목이 누락되었습니다: $field");
                    return;
                }
            }
            
            $pdo = $this->db->getPDO();
            
            // 테이블 존재 확인
            try {
                $checkTable = $pdo->query("SHOW TABLES LIKE 'valorant_posts'");
                if ($checkTable->rowCount() === 0) {
                    error_log("[VALORANT API] valorant_posts 테이블이 존재하지 않음");
                    $this->sendError('데이터베이스 테이블이 생성되지 않았습니다. 관리자에게 문의하세요.');
                    return;
                }
                error_log("[VALORANT API] valorant_posts 테이블 존재 확인 완료");
            } catch (Exception $e) {
                error_log("[VALORANT API] 테이블 확인 오류: " . $e->getMessage());
                $this->sendError('데이터베이스 오류가 발생했습니다.');
                return;
            }
            
            // 요원 확인
            error_log("[VALORANT API] 요원 ID 확인: " . $_POST['agent_id']);
            $stmt = $pdo->prepare("SELECT id FROM valorant_agents WHERE id = ? AND is_active = TRUE");
            $stmt->execute([$_POST['agent_id']]);
            if (!$stmt->fetch()) {
                error_log("[VALORANT API] 존재하지 않는 요원 ID: " . $_POST['agent_id']);
                $this->sendError('존재하지 않는 요원입니다.');
                return;
            }
            error_log("[VALORANT API] 요원 ID 검증 완료");
            
            $sql = "
                INSERT INTO valorant_posts (
                    agent_id, title, content, summary, nickname, password,
                    tip_difficulty, tip_category, tags, ip_address, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ";
            
            $summary = $this->generateSummary($_POST['content']);
            $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
            $tags = json_encode($_POST['tags'] ?? []);
            
            error_log("[VALORANT API] SQL 실행 준비 완료");
            error_log("[VALORANT API] 데이터: " . json_encode([
                'agent_id' => $_POST['agent_id'],
                'title' => $_POST['title'],
                'difficulty' => $_POST['tip_difficulty'] ?? 'beginner',
                'category' => $_POST['tip_category'] ?? 'general'
            ]));
            
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute([
                $_POST['agent_id'],
                $_POST['title'],
                $_POST['content'],
                $summary,
                $_POST['nickname'],
                $passwordHash,
                $_POST['tip_difficulty'] ?? 'beginner',
                $_POST['tip_category'] ?? 'general',
                $tags,
                $ipAddress
            ]);
            
            if ($success) {
                $postId = $pdo->lastInsertId();
                error_log("[VALORANT API] 글 작성 성공! Post ID: $postId");
                $this->sendSuccess([
                    'message' => '게시글이 작성되었습니다.',
                    'post_id' => $postId
                ]);
            } else {
                error_log("[VALORANT API] SQL 실행 실패");
                $errorInfo = $stmt->errorInfo();
                error_log("[VALORANT API] SQL 오류: " . json_encode($errorInfo));
                $this->sendError('게시글 작성에 실패했습니다. SQL 오류: ' . $errorInfo[2]);
            }
            
        } catch (Exception $e) {
            error_log("[VALORANT API] createPost 예외 발생: " . $e->getMessage());
            error_log("[VALORANT API] Stack trace: " . $e->getTraceAsString());
            $this->sendError('게시글 작성 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 좋아요 토글
    public function likePost() {
        try {
            $post_id = (int)($_POST['post_id'] ?? 0);
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
            
            if (!$post_id) {
                $this->sendError('게시글 ID가 필요합니다.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 이미 좋아요를 눌렀는지 확인
            $stmt = $pdo->prepare("SELECT id FROM valorant_likes WHERE post_id = ? AND ip_address = ?");
            $stmt->execute([$post_id, $ip_address]);
            $existing = $stmt->fetch();
            
            if ($existing) {
                // 좋아요 취소
                $pdo->prepare("DELETE FROM valorant_likes WHERE id = ?")->execute([$existing['id']]);
                $pdo->prepare("UPDATE valorant_posts SET like_count = like_count - 1 WHERE id = ?")->execute([$post_id]);
                $action = 'unliked';
            } else {
                // 좋아요 추가
                $pdo->prepare("INSERT INTO valorant_likes (post_id, ip_address, user_agent, created_at) VALUES (?, ?, ?, NOW())")
                    ->execute([$post_id, $ip_address, $_SERVER['HTTP_USER_AGENT'] ?? '']);
                $pdo->prepare("UPDATE valorant_posts SET like_count = like_count + 1 WHERE id = ?")->execute([$post_id]);
                $action = 'liked';
            }
            
            // 현재 좋아요 수 조회
            $stmt = $pdo->prepare("SELECT like_count FROM valorant_posts WHERE id = ?");
            $stmt->execute([$post_id]);
            $like_count = $stmt->fetchColumn();
            
            $this->sendSuccess([
                'action' => $action,
                'like_count' => $like_count
            ]);
            
        } catch (Exception $e) {
            $this->sendError('좋아요 처리 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 즐겨찾기 토글 (로컬 스토리지용)
    public function toggleFavorite() {
        try {
            $post_id = (int)($_POST['post_id'] ?? 0);
            $action = $_POST['action'] ?? ''; // 'add' or 'remove'
            
            if (!$post_id) {
                $this->sendError('게시글 ID가 필요합니다.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 즐겨찾기 수 업데이트
            if ($action === 'add') {
                $pdo->prepare("UPDATE valorant_posts SET favorite_count = favorite_count + 1 WHERE id = ?")->execute([$post_id]);
            } elseif ($action === 'remove') {
                $pdo->prepare("UPDATE valorant_posts SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = ?")->execute([$post_id]);
            }
            
            // 현재 즐겨찾기 수 조회
            $stmt = $pdo->prepare("SELECT favorite_count FROM valorant_posts WHERE id = ?");
            $stmt->execute([$post_id]);
            $favorite_count = $stmt->fetchColumn();
            
            $this->sendSuccess([
                'action' => $action,
                'favorite_count' => $favorite_count
            ]);
            
        } catch (Exception $e) {
            $this->sendError('즐겨찾기 처리 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 최신 팁 조회 (메인 페이지용)
    public function getLatestTips() {
        try {
            $pdo = $this->db->getPDO();
            
            // 테이블 존재 확인
            try {
                $pdo->query("SELECT 1 FROM valorant_posts LIMIT 1");
            } catch (Exception $e) {
                // 테이블이 없는 경우 빈 결과 반환
                $this->sendSuccess(['posts' => []]);
                return;
            }
            
            $limit = min(10, max(1, (int)($_GET['limit'] ?? 3)));
            
            $sql = "
                SELECT 
                    p.id, p.title, p.summary, p.nickname, p.view_count, p.like_count, 
                    p.comment_count, p.favorite_count, p.is_featured,
                    p.tip_difficulty, p.tip_category, p.created_at,
                    a.agent_name, a.agent_image, a.agent_name_en,
                    at.type_name, at.type_color, at.type_icon
                FROM valorant_posts p
                LEFT JOIN valorant_agents a ON p.agent_id = a.id
                LEFT JOIN valorant_agent_types at ON a.agent_type_id = at.id
                WHERE p.status = 'published'
                ORDER BY p.created_at DESC
                LIMIT ?
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$limit]);
            $posts = $stmt->fetchAll();
            
            // 시간 포맷팅
            foreach ($posts as &$post) {
                $post['time_ago'] = $this->getTimeAgo($post['created_at']);
                
                // 기본값 설정 (요원 정보가 없는 경우)
                $post['agent_name'] = $post['agent_name'] ?? '일반';
                $post['agent_image'] = $post['agent_image'] ?? '/assets/images/valorant/default-agent.webp';
                $post['type_name'] = $post['type_name'] ?? '일반';
                $post['type_color'] = $post['type_color'] ?? '#666666';
                
                // 내용 요약 생성
                $post['content'] = $this->generateSummary($post['summary'] ?: '', 100);
            }
            
            $this->sendSuccess(['posts' => $posts]);
            
        } catch (Exception $e) {
            $this->sendError('최신 팁 조회 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 즐겨찾기 목록 조회 (ID 배열로)
    public function getFavorites() {
        try {
            $post_ids = $_GET['post_ids'] ?? '';
            $agent_filter = $_GET['agent_filter'] ?? '';
            $search = $_GET['search'] ?? '';
            
            if (!$post_ids) {
                $this->sendSuccess(['posts' => []]);
                return;
            }
            
            $ids = explode(',', $post_ids);
            $ids = array_filter(array_map('intval', $ids));
            
            if (empty($ids)) {
                $this->sendSuccess(['posts' => []]);
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 기본 쿼리
            $whereConditions = ["p.id IN (" . str_repeat('?,', count($ids) - 1) . "?)"];
            $params = $ids;
            
            // 요원 필터
            if ($agent_filter) {
                $whereConditions[] = "a.agent_name = ?";
                $params[] = $agent_filter;
            }
            
            // 검색
            if ($search) {
                $whereConditions[] = "(p.title LIKE ? OR p.content LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }
            
            $whereClause = "WHERE " . implode(' AND ', $whereConditions);
            
            $sql = "
                SELECT 
                    p.id, p.title, p.summary, p.nickname, p.view_count, p.like_count,
                    p.comment_count, p.favorite_count, p.created_at, p.tip_difficulty, p.tip_category,
                    a.agent_name, a.agent_image, a.agent_name_en,
                    at.type_name, at.type_color, at.type_icon
                FROM valorant_posts p
                JOIN valorant_agents a ON p.agent_id = a.id
                JOIN valorant_agent_types at ON a.agent_type_id = at.id
                $whereClause
                ORDER BY p.created_at DESC
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $posts = $stmt->fetchAll();
            
            // 시간 포맷팅
            foreach ($posts as &$post) {
                $post['time_ago'] = $this->getTimeAgo($post['created_at']);
            }
            
            $this->sendSuccess(['posts' => $posts]);
            
        } catch (Exception $e) {
            $this->sendError('즐겨찾기 조회 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 이미지 업로드
    public function uploadImage() {
        try {
            if (!isset($_FILES['image'])) {
                $this->sendError('업로드할 이미지가 없습니다.');
                return;
            }
            
            $file = $_FILES['image'];
            
            // 파일 검증
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $this->sendError('파일 업로드 중 오류가 발생했습니다.');
                return;
            }
            
            // 파일 크기 체크 (5MB 제한)
            if ($file['size'] > 5 * 1024 * 1024) {
                $this->sendError('파일 크기가 너무 큽니다. (최대 5MB)');
                return;
            }
            
            // 파일 타입 검증
            $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file['type'], $allowedTypes)) {
                $this->sendError('지원하지 않는 파일 형식입니다.');
                return;
            }
            
            // 업로드 디렉토리 생성
            $uploadDir = '../assets/images/valorant/posts/';
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            // 고유한 파일명 생성
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid('valorant_') . '_' . time() . '.' . $extension;
            $filepath = $uploadDir . $filename;
            
            // 파일 저장
            if (move_uploaded_file($file['tmp_name'], $filepath)) {
                $url = '/assets/images/valorant/posts/' . $filename;
                $this->sendSuccess(['url' => $url]);
            } else {
                $this->sendError('파일 저장에 실패했습니다.');
            }
            
        } catch (Exception $e) {
            $this->sendError('이미지 업로드 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 비밀번호 확인
    public function verifyPassword() {
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $post_id = (int)($input['post_id'] ?? 0);
            $password = $input['password'] ?? '';
            
            if (!$post_id || !$password) {
                $this->sendError('게시글 ID와 비밀번호가 필요합니다.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            $stmt = $pdo->prepare("SELECT password FROM valorant_posts WHERE id = ?");
            $stmt->execute([$post_id]);
            $stored_password = $stmt->fetchColumn();
            
            if (!$stored_password) {
                $this->sendError('게시글을 찾을 수 없습니다.');
                return;
            }
            
            if (password_verify($password, $stored_password)) {
                $this->sendSuccess(['verified' => true]);
            } else {
                $this->sendError('비밀번호가 일치하지 않습니다.');
            }
            
        } catch (Exception $e) {
            $this->sendError('비밀번호 확인 실패', ['error' => $e->getMessage()]);
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

        if (!$postId || !$title || !$content) {
            $this->sendError('필수 필드(id, title, content)가 필요합니다');
            return;
        }

        // 게시글 존재 확인
        $stmt = $pdo->prepare("SELECT * FROM valorant_posts WHERE id = ?");
        $stmt->execute([$postId]);
        $post = $stmt->fetch();

        if (!$post) {
            $this->sendError('게시글을 찾을 수 없습니다');
            return;
        }

        // 세션 인증 확인 (비밀번호는 verify_password에서 이미 검증됨)
        session_start();
        $hasSession = isset($_SESSION['valorant_edit_auth'][$postId]) &&
                     (time() - $_SESSION['valorant_edit_auth'][$postId] <= 600);

        if (!$hasSession) {
            $this->sendError('인증이 만료되었습니다. 다시 시도해주세요');
            return;
        }

        $pdo->beginTransaction();

        $sql = "
            UPDATE valorant_posts 
            SET title = ?, content = ?, updated_at = NOW() 
            WHERE id = ?
        ";

        $stmt = $pdo->prepare($sql);
        $success = $stmt->execute([
            $title,
            $content,
            $postId
        ]);

        if (!$success) {
            throw new Exception('게시글 수정에 실패했습니다');
        }

        $pdo->commit();

        // 세션 정리
        unset($_SESSION['valorant_edit_auth'][$postId]);

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
        $stmt = $pdo->prepare("SELECT password FROM valorant_posts WHERE id = ?");
        $stmt->execute([$postId]);
        $post = $stmt->fetch();

        if (!$post) {
            $this->sendError('게시글을 찾을 수 없습니다');
            return;
        }

        if (!password_verify($password, $post['password'])) {
            $this->sendError('비밀번호가 올바르지 않습니다');
            return;
        }

        $pdo->beginTransaction();

        // 실제 삭제 대신 숨김 처리
        $sql = "UPDATE valorant_posts SET status = 'hidden', updated_at = NOW() WHERE id = ?";
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


    // 댓글 조회
    public function getComments() {
        try {
            $post_id = (int)($_GET['post_id'] ?? 0);
            
            if (!$post_id) {
                $this->sendError('게시글 ID가 필요합니다.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            $sql = "
                SELECT id, nickname, content, like_count, created_at
                FROM valorant_comments
                WHERE post_id = ? AND status = 'published'
                ORDER BY created_at ASC
            ";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$post_id]);
            $comments = $stmt->fetchAll();
            
            foreach ($comments as &$comment) {
                $comment['time_ago'] = $this->getTimeAgo($comment['created_at']);
            }
            
            $this->sendSuccess(['comments' => $comments]);
            
        } catch (Exception $e) {
            $this->sendError('댓글 조회 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 댓글 작성
    public function createComment() {
        try {
            $post_id = (int)($_POST['post_id'] ?? 0);
            $nickname = trim($_POST['nickname'] ?? '');
            $content = trim($_POST['content'] ?? '');
            $password = $_POST['password'] ?? '';
            
            if (!$post_id || !$nickname || !$content || !$password) {
                $this->sendError('모든 필드가 필요합니다.');
                return;
            }
            
            if (mb_strlen($content) < 2) {
                $this->sendError('댓글 내용을 2자 이상 입력해주세요.');
                return;
            }
            
            $pdo = $this->db->getPDO();
            
            // 게시글 존재 확인
            $stmt = $pdo->prepare("SELECT id FROM valorant_posts WHERE id = ?");
            $stmt->execute([$post_id]);
            if (!$stmt->fetch()) {
                $this->sendError('게시글을 찾을 수 없습니다.');
                return;
            }
            
            $sql = "
                INSERT INTO valorant_comments (
                    post_id, nickname, password, content, ip_address, created_at
                ) VALUES (?, ?, ?, ?, ?, NOW())
            ";
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$post_id, $nickname, $hashedPassword, $content, $ipAddress]);
            
            // 댓글 수 업데이트
            $pdo->prepare("UPDATE valorant_posts SET comment_count = comment_count + 1 WHERE id = ?")->execute([$post_id]);
            
            $commentId = $pdo->lastInsertId();
            
            $this->sendSuccess([
                'message' => '댓글이 작성되었습니다.',
                'comment_id' => $commentId
            ]);
            
        } catch (Exception $e) {
            $this->sendError('댓글 작성 실패', ['error' => $e->getMessage()]);
        }
    }
    
    // 조회수 증가
    private function incrementViewCount($post_id) {
        try {
            $pdo = $this->db->getPDO();
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
            
            // 조회 로그 추가 (중복 허용)
            $pdo->prepare("INSERT INTO valorant_views (post_id, ip_address, user_agent, referrer, created_at) VALUES (?, ?, ?, ?, NOW())")
                ->execute([
                    $post_id,
                    $ip_address,
                    $_SERVER['HTTP_USER_AGENT'] ?? '',
                    $_SERVER['HTTP_REFERER'] ?? ''
                ]);
            
            // 조회수 업데이트
            $pdo->prepare("UPDATE valorant_posts SET view_count = view_count + 1 WHERE id = ?")->execute([$post_id]);
            
        } catch (Exception $e) {
            // 로그만 남기고 에러는 무시
            error_log("View count increment failed: " . $e->getMessage());
        }
    }
    
    // 요약 생성
    private function generateSummary($content, $length = 150) {
        $text = strip_tags($content);
        $text = preg_replace('/\s+/', ' ', trim($text));
        if (mb_strlen($text) > $length) {
            $text = mb_substr($text, 0, $length) . '...';
        }
        return $text;
    }
    
    // 시간 경과 계산
    private function getTimeAgo($datetime) {
        $time = time() - strtotime($datetime);
        
        if ($time < 60) return '방금 전';
        if ($time < 3600) return floor($time/60) . '분 전';
        if ($time < 86400) return floor($time/3600) . '시간 전';
        if ($time < 2592000) return floor($time/86400) . '일 전';
        if ($time < 31536000) return floor($time/2592000) . '개월 전';
        return floor($time/31536000) . '년 전';
    }
    
    private function sendSuccess($data) {
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
    
    private function sendError($message, $details = []) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $message,
            'details' => $details,
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}

// API 실행
try {
    $api = new ValorantAPI();
    $api->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'API 초기화 실패',
        'details' => ['error' => $e->getMessage()],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?>
