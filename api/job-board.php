<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../includes/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

try {
  if ($method === 'GET') {
    if ($action === 'list') return getPosts();
    if ($action === 'show') return getPost();
    send(400, '잘못된 액션');
  }
  if ($method === 'POST') {
    if ($action === 'create') return createPost();
    if ($action === 'increase_view') return increaseView();
    if ($action === 'verify_password') return verifyPassword();
    send(400, '잘못된 액션');
  }
  if ($method === 'PUT') {
    if ($action === 'update') return updatePost();
    send(400, '잘못된 액션');
  }
  if ($method === 'DELETE') {
    if ($action === 'delete') return deletePost();
    send(400, '잘못된 액션');
  }
  send(405, '허용되지 않는 메소드');
} catch (Exception $e) {
  error_log('job-board api error: '.$e->getMessage());
  send(500, '서버 오류: '.$e->getMessage());
}

function getPosts() {
  global $db;
  $page = max(1, (int)($_GET['page'] ?? 1));
  $limit = max(1, (int)($_GET['limit'] ?? 12));
  $offset = ($page-1)*$limit;
  $category = $_GET['category'] ?? 'all';
  $type = $_GET['type'] ?? 'all';
  $search = $_GET['search'] ?? '';
  $rate = $_GET['rate'] ?? 'all';
  $sort = $_GET['sort'] ?? 'latest';

  $sql = "SELECT p.*,(SELECT name FROM job_categories c WHERE c.id=p.category_id) category_name FROM job_posts p WHERE p.status='active'";
  $params = [];
  if ($category !== 'all') { $sql .= " AND p.category_id=(SELECT id FROM job_categories WHERE slug=?)"; $params[]=$category; }
  if ($type !== 'all') { $sql .= " AND p.post_type=?"; $params[]=$type; }
  if ($rate !== 'all') { $sql .= " AND p.rate_type=?"; $params[]=$rate; }
  if ($search) { $sql .= " AND (p.title LIKE ? OR p.content LIKE ? OR p.nickname LIKE ?)"; $s="%$search%"; array_push($params,$s,$s,$s); }

  switch ($sort) {
    case 'minute_high': $sql .= " ORDER BY p.minute_rate DESC"; break;
    case 'minute_low': $sql .= " ORDER BY p.minute_rate ASC"; break;
    case 'video_high': $sql .= " ORDER BY p.video_rate DESC"; break;
    case 'video_low': $sql .= " ORDER BY p.video_rate ASC"; break;
    case 'views': $sql .= " ORDER BY p.view_count DESC"; break;
    case 'latest': default: $sql .= " ORDER BY p.created_at DESC"; break;
  }
  $sql .= " LIMIT ? OFFSET ?"; array_push($params,$limit,$offset);
  $rows = $db->fetchAll($sql,$params);

  $countSql = "SELECT COUNT(*) cnt FROM job_posts p WHERE p.status='active'"; $cParams=[];
  if ($category !== 'all') { $countSql .= " AND p.category_id=(SELECT id FROM job_categories WHERE slug=?)"; $cParams[]=$category; }
  if ($type !== 'all') { $countSql .= " AND p.post_type=?"; $cParams[]=$type; }
  if ($rate !== 'all') { $countSql .= " AND p.rate_type=?"; $cParams[]=$rate; }
  if ($search) { $countSql .= " AND (p.title LIKE ? OR p.content LIKE ? OR p.nickname LIKE ?)"; $s="%$search%"; array_push($cParams,$s,$s,$s); }
  $total = (int)($db->fetch($countSql,$cParams)['cnt'] ?? 0);

  send(200,'성공',[ 'posts'=>$rows, 'pagination'=>[
    'current_page'=>$page,
    'total_pages'=>ceil($total/$limit),
    'total_posts'=>$total
  ]]);
}

function getPost(){
  global $db;
  $id = (int)($_GET['id'] ?? 0);
  if(!$id) send(400,'ID 필요');
  $post = $db->fetch("SELECT p.*,(SELECT name FROM job_categories c WHERE c.id=p.category_id) category_name FROM job_posts p WHERE p.id=?",[$id]);
  if(!$post) send(404,'없음');
  $contacts = $db->fetchAll("SELECT type,label,value FROM job_post_contacts WHERE post_id=? ORDER BY id ASC",[$id]);
  send(200,'성공',[ 'post'=>$post, 'contacts'=>$contacts ]);
}

function createPost(){
  global $db;
  $input = json_decode(file_get_contents('php://input'), true);
  foreach (['post_type','category_id','title','content','nickname','password'] as $f){ if(empty($input[$f])) send(400, "필수 누락: $f"); }

  // 급여 정규화 (편집자 외면 무시)
  $rateType = $input['rate_type'] ?? null;
  $minute = null; $video = null;
  if ($rateType === 'per_minute') $minute = (float)($input['minute_rate'] ?? 0);
  if ($rateType === 'per_video') $video = (float)($input['video_rate'] ?? 0);
  if ($rateType === 'negotiable') { $minute=null; $video=null; }

  $id = $db->insert("INSERT INTO job_posts (category_id, post_type, title, content, excerpt, nickname, post_password, rate_type, minute_rate, video_rate, ip_address, user_agent) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      (int)$input['category_id'], $input['post_type'], $input['title'], $input['content'],
      mb_substr(strip_tags($input['content']),0,200).'...',
      $input['nickname'], password_hash($input['password'], PASSWORD_DEFAULT),
      $rateType, $minute, $video, $_SERVER['REMOTE_ADDR'] ?? '', $_SERVER['HTTP_USER_AGENT'] ?? ''
    ]);

  if(!$id) send(500,'작성 실패');

  // 연락처 저장
  if (!empty($input['contacts']) && is_array($input['contacts'])){
    foreach($input['contacts'] as $c){
      if (empty($c['value'])) continue;
      $type = in_array($c['type'], ['phone','email','discord','kakaotalk','custom']) ? $c['type'] : 'custom';
      $label = $type==='custom' ? ($c['label'] ?? null) : null;
      $db->insert("INSERT INTO job_post_contacts (post_id,type,label,value) VALUES (?,?,?,?)", [$id,$type,$label,$c['value']]);
    }
  }

  send(201,'작성 성공',[ 'id'=>$id ]);
}

function increaseView(){
  global $db;
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  if(!$id) send(400,'ID 필요');
  $db->update("UPDATE job_posts SET view_count = view_count + 1 WHERE id = ?", [$id]);
  send(200,'조회수 증가');
}

function verifyPassword(){
  global $db;
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  $password = $input['password'] ?? '';
  if(!$id || !$password) send(400,'id/password 필요');
  $row = $db->fetch("SELECT post_password FROM job_posts WHERE id=? AND status<>'deleted'",[$id]);
  if(!$row) send(404,'없음');
  if(!password_verify($password, $row['post_password'])) send(403,'비밀번호 불일치');
  if(!isset($_SESSION['job_edit_auth'])) $_SESSION['job_edit_auth'] = [];
  $_SESSION['job_edit_auth'][$id] = time();
  send(200,'인증 성공');
}

function updatePost(){
  global $db;
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  if(!$id) send(400,'ID 필요');
  $post = $db->fetch("SELECT * FROM job_posts WHERE id=?",[$id]);
  if(!$post) send(404,'없음');
  $hasSession = isset($_SESSION['job_edit_auth'][$id]) && (time()-$_SESSION['job_edit_auth'][$id] <= 600);
  if(!$hasSession){
    $pw = $input['password'] ?? '';
    if(!$pw || !password_verify($pw, $post['post_password'])) send(403,'비밀번호 불일치');
    $_SESSION['job_edit_auth'][$id] = time();
  }
  $title = $input['title'] ?? $post['title'];
  $content = $input['content'] ?? $post['content'];
  $excerpt = mb_substr(strip_tags($content),0,200).'...';
  $categoryId = isset($input['category_id']) && $input['category_id'] ? (int)$input['category_id'] : $post['category_id'];
  $rateType = $input['rate_type'] ?? $post['rate_type'];
  $minute = $rateType==='per_minute' ? (float)($input['minute_rate'] ?? $post['minute_rate']) : null;
  $video = $rateType==='per_video' ? (float)($input['video_rate'] ?? $post['video_rate']) : null;
  if ($rateType==='negotiable'){ $minute=null; $video=null; }
  $ok = $db->update("UPDATE job_posts SET title=?, content=?, excerpt=?, category_id=?, rate_type=?, minute_rate=?, video_rate=?, updated_at=CURRENT_TIMESTAMP WHERE id=?",
    [$title,$content,$excerpt,$categoryId,$rateType,$minute,$video,$id]);
  if(!$ok) send(500,'수정 실패');
  send(200,'수정 성공');
}

function deletePost(){
  global $db;
  $input = json_decode(file_get_contents('php://input'), true);
  $id = (int)($input['id'] ?? 0);
  if(!$id) send(400,'ID 필요');
  $post = $db->fetch("SELECT * FROM job_posts WHERE id=?",[$id]);
  if(!$post) send(404,'없음');
  $hasSession = isset($_SESSION['job_edit_auth'][$id]) && (time()-$_SESSION['job_edit_auth'][$id] <= 600);
  if(!$hasSession){
    $pw = $input['password'] ?? '';
    if(!$pw || !password_verify($pw, $post['post_password'])) send(403,'비밀번호 불일치');
  }
  $ok = $db->update("UPDATE job_posts SET status='hidden', updated_at=CURRENT_TIMESTAMP WHERE id=?",[$id]);
  if(!$ok) send(500,'삭제 실패');
  send(200,'삭제 성공');
}

function send($status,$message,$data=null){
  http_response_code($status);
  $res = [ 'status'=>$status, 'message'=>$message, 'timestamp'=>date('Y-m-d H:i:s') ];
  if ($data!==null) $res['data']=$data;
  echo json_encode($res, JSON_UNESCAPED_UNICODE);
  exit;
}

?>


