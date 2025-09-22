<?php
// 오류 디버깅을 위한 설정
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// 데이터베이스 연결 설정 (실제 DB 사용)
$use_database = true; // 실제 DB 사용

if ($use_database) {
    $host = 'localhost';
    $dbname = 'jjapshop'; // 메인 DB 사용 (horror_ 테이블들이 있는)
    $username = 'root';
    $password = '';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // 연결 테스트 및 테이블 존재 확인
        $stmt = $pdo->query("SHOW TABLES LIKE 'horror_%'");
        $tables = $stmt->fetchAll();
        
        if (empty($tables)) {
            throw new Exception("horror_ 테이블들이 존재하지 않습니다. horror_board.sql을 먼저 실행해주세요.");
        }
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'DB 연결 실패',
            'details' => $e->getMessage(),
            'host' => $host,
            'dbname' => $dbname,
            'solution' => 'DB 연결 정보를 확인해주세요.'
        ]);
        exit;
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'solution' => '테이블 확인 중 오류가 발생했습니다.'
        ]);
        exit;
    }
} else {
    $pdo = null; // 목업 데이터 사용
}

$action = $_GET['action'] ?? '';

switch($action) {
    case 'test':
        testDatabase();
        break;
    case 'get_posts':
        getPosts();
        break;
    case 'get_post':
        getPost();
        break;
    case 'submit_post':
        submitPost();
        break;
    case 'get_categories':
        getCategories();
        break;
    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => '잘못된 요청입니다.']);
}

function getPosts() {
    global $pdo, $use_database;
    
    $category = $_GET['category'] ?? '';
    $page = (int)($_GET['page'] ?? 1);
    $limit = (int)($_GET['limit'] ?? 10);
    $offset = ($page - 1) * $limit;
    $sort = $_GET['sort'] ?? 'latest';
    
    // 임시 목업 데이터 사용 (실제 DB 연결 전까지)
    if (!$use_database) {
        // 목업 데이터 생성
        $mockPosts = [];
        
        // 카테고리별 목업 데이터
        $categoryData = [
            'urban-legends' => [
                'name' => '도시 전설',
                'icon' => '🏙️'
            ],
            'true-stories' => [
                'name' => '실화 이야기',
                'icon' => '😨'
            ],
            'scary-when-understood' => [
                'name' => '이해하면 무서운 이야기',
                'icon' => '🤔'
            ],
            'translated-horror' => [
                'name' => '번역 괴담',
                'icon' => '🌏'
            ]
        ];
        
        $currentCategoryData = $categoryData[$category] ?? $categoryData['urban-legends'];
        
        // 목업 게시글 생성 (비어있는 상태로 반환)
        echo json_encode([
            'success' => true,
            'posts' => [], // 빈 배열로 반환하여 "첫 이야기 쓰기" 상태 표시
            'pagination' => [
                'current_page' => $page,
                'total_pages' => 0,
                'total_posts' => 0,
                'per_page' => $limit
            ]
        ]);
        return;
    }
    
    try {
        // 실제 DB 사용 시의 로직 (위의 기존 코드)
        // 정렬 조건 설정
        $orderBy = match($sort) {
            'popular' => 'ORDER BY view_count DESC, created_at DESC',
            'views' => 'ORDER BY view_count DESC',
            'comments' => 'ORDER BY comment_count DESC',
            'rating' => 'ORDER BY horror_rating DESC, view_count DESC',
            default => 'ORDER BY created_at DESC'
        };
        
        // WHERE 조건 설정
        $whereClause = "WHERE p.status = 'published' AND c.is_active = TRUE";
        $params = [];
        
        if ($category) {
            $whereClause .= " AND c.slug = ?";
            $params[] = $category;
        }
        
        // 총 개수 조회
        $countSql = "
            SELECT COUNT(*) as total
            FROM horror_posts p
            JOIN horror_board_categories c ON p.category_id = c.id
            $whereClause
        ";
        
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetch()['total'];
        
        // 게시글 조회
        $sql = "
            SELECT 
                p.id,
                p.title,
                p.nickname,
                p.excerpt,
                p.view_count,
                p.like_count,
                p.comment_count,
                p.horror_rating,
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
            LIMIT ? OFFSET ?
        ";
        
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 시간 포맷팅
        foreach ($posts as &$post) {
            $post['time_ago'] = getTimeAgo($post['created_at']);
            $post['horror_stars'] = str_repeat('😱', $post['horror_rating']);
        }
        
        echo json_encode([
            'success' => true,
            'posts' => $posts,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($total / $limit),
                'total_posts' => (int)$total,
                'per_page' => $limit
            ]
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => '데이터 조회 중 오류가 발생했습니다',
            'details' => $e->getMessage(),
            'query_info' => [
                'category' => $category,
                'page' => $page,
                'sort' => $sort,
                'limit' => $limit
            ]
        ]);
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => '일반 오류',
            'details' => $e->getMessage()
        ]);
    }
}

function getPost() {
    global $pdo, $use_database;
    
    $id = (int)($_GET['id'] ?? 0);
    
    // 목업 모드일 때
    if (!$use_database) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => '게시글을 찾을 수 없습니다.']);
        return;
    }
    
    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => '게시글 ID가 필요합니다.']);
        return;
    }
    
    try {
        // 조회수 증가
        $updateSql = "UPDATE horror_posts SET view_count = view_count + 1 WHERE id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute([$id]);
        
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
        $post = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$post) {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => '게시글을 찾을 수 없습니다.']);
            return;
        }
        
        $post['time_ago'] = getTimeAgo($post['created_at']);
        $post['horror_stars'] = str_repeat('😱', $post['horror_rating']);
        
        echo json_encode([
            'success' => true,
            'post' => $post
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => '게시글 조회 중 오류가 발생했습니다.'
        ]);
    }
}

function submitPost() {
    global $pdo, $use_database;
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'POST 방식만 지원합니다.']);
        return;
    }
    
    $required_fields = ['category', 'title', 'content', 'nickname', 'password'];
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => "{$field} 필드가 필요합니다."]);
            return;
        }
    }
    
    try {
        // 카테고리 ID 조회
        $categoryStmt = $pdo->prepare("SELECT id FROM horror_board_categories WHERE slug = ? AND is_active = TRUE");
        $categoryStmt->execute([$_POST['category']]);
        $category = $categoryStmt->fetch();
        
        if (!$category) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => '유효하지 않은 카테고리입니다.']);
            return;
        }
        
        // 게시글 저장
        $sql = "
            INSERT INTO horror_posts (
                category_id, nickname, post_password, title, content, excerpt,
                horror_rating, ip_address, user_agent, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ";
        
        $content = $_POST['content'];
        $excerpt = generateExcerpt($content);
        $horror_rating = (int)($_POST['horror_rating'] ?? 3);
        $password_hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $category['id'],
            $_POST['nickname'],
            $password_hash,
            $_POST['title'],
            $content,
            $excerpt,
            $horror_rating,
            $ip_address,
            $user_agent
        ]);
        
        $postId = $pdo->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'post_id' => $postId,
            'message' => '무서운 이야기가 성공적으로 등록되었습니다!'
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => '게시글 저장 중 오류가 발생했습니다.'
        ]);
    }
}

function getCategories() {
    global $pdo, $use_database;
    
    if (!$use_database) {
        // 목업 데이터 반환
        echo json_encode([
            'success' => true,
            'categories' => [
                ['id' => 1, 'name' => '도시 전설', 'slug' => 'urban-legends', 'icon' => '🏙️', 'post_count' => 0],
                ['id' => 2, 'name' => '실화 이야기', 'slug' => 'true-stories', 'icon' => '😨', 'post_count' => 0],
                ['id' => 3, 'name' => '이해하면 무서운 이야기', 'slug' => 'scary-when-understood', 'icon' => '🤔', 'post_count' => 0],
                ['id' => 4, 'name' => '번역 괴담', 'slug' => 'translated-horror', 'icon' => '🌏', 'post_count' => 0]
            ]
        ]);
        return;
    }
    
    try {
        $sql = "
            SELECT 
                c.*,
                COUNT(p.id) as post_count
            FROM horror_board_categories c
            LEFT JOIN horror_posts p ON c.id = p.category_id AND p.status = 'published'
            WHERE c.is_active = TRUE
            GROUP BY c.id
            ORDER BY c.sort_order ASC
        ";
        
        $stmt = $pdo->query($sql);
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'categories' => $categories
        ]);
        
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => '카테고리 조회 중 오류가 발생했습니다: ' . $e->getMessage()
        ]);
    }
}

function testDatabase() {
    global $pdo, $use_database;
    
    try {
        // 기본 정보 수집
        $info = [
            'use_database' => $use_database,
            'pdo_available' => isset($pdo),
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        if (!$use_database) {
            $info['status'] = 'mock_mode';
            echo json_encode(['success' => true, 'info' => $info]);
            return;
        }
        
        if (!$pdo) {
            $info['status'] = 'pdo_not_initialized';
            echo json_encode(['success' => false, 'info' => $info]);
            return;
        }
        
        // 데이터베이스 연결 테스트
        $stmt = $pdo->query("SELECT VERSION() as mysql_version");
        $version = $stmt->fetch();
        $info['mysql_version'] = $version['mysql_version'];
        
        // 현재 데이터베이스 확인
        $stmt = $pdo->query("SELECT DATABASE() as current_db");
        $db = $stmt->fetch();
        $info['current_database'] = $db['current_db'];
        
        // horror_ 테이블들 확인
        $stmt = $pdo->query("SHOW TABLES LIKE 'horror_%'");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $info['horror_tables'] = $tables;
        $info['horror_table_count'] = count($tables);
        
        // 각 테이블의 레코드 수 확인
        $table_stats = [];
        foreach ($tables as $table) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
                $count = $stmt->fetch();
                $table_stats[$table] = $count['count'];
            } catch (Exception $e) {
                $table_stats[$table] = 'error: ' . $e->getMessage();
            }
        }
        $info['table_stats'] = $table_stats;
        
        // 특별히 카테고리와 게시글 확인
        if (in_array('horror_board_categories', $tables)) {
            try {
                $stmt = $pdo->query("SELECT id, name, slug FROM horror_board_categories ORDER BY sort_order");
                $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $info['categories'] = $categories;
            } catch (Exception $e) {
                $info['categories_error'] = $e->getMessage();
            }
        }
        
        if (in_array('horror_posts', $tables)) {
            try {
                $stmt = $pdo->query("SELECT COUNT(*) as total FROM horror_posts WHERE status = 'published'");
                $count = $stmt->fetch();
                $info['published_posts'] = $count['total'];
            } catch (Exception $e) {
                $info['posts_error'] = $e->getMessage();
            }
        }
        
        $info['status'] = 'connected';
        echo json_encode(['success' => true, 'info' => $info]);
        
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'info' => $info ?? []
        ]);
    }
}

function getTimeAgo($datetime) {
    $time = time() - strtotime($datetime);
    
    if ($time < 60) return '방금 전';
    if ($time < 3600) return floor($time/60) . '분 전';
    if ($time < 86400) return floor($time/3600) . '시간 전';
    if ($time < 2592000) return floor($time/86400) . '일 전';
    if ($time < 31536000) return floor($time/2592000) . '개월 전';
    return floor($time/31536000) . '년 전';
}

function generateExcerpt($content, $length = 150) {
    // HTML 태그 제거
    $text = strip_tags($content);
    // 공백 정리
    $text = preg_replace('/\s+/', ' ', trim($text));
    // 길이 제한
    if (mb_strlen($text) > $length) {
        $text = mb_substr($text, 0, $length) . '...';
    }
    return $text;
}
?>
