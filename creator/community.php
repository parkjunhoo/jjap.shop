<?php
$page_title = '크리에이터 커뮤니티 - 짭샵';
$page_description = '크리에이터들을 위한 소통 공간입니다. 팁, 정보, 잡담을 자유롭게 나누세요.';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    
    <!-- 파비콘 -->
    <link rel="icon" type="image/x-icon" href="../assets/images/jjapshoplogo.webp">
    <link rel="shortcut icon" type="image/x-icon" href="../assets/images/jjapshoplogo.webp">
    <link rel="apple-touch-icon" href="../assets/images/jjapshoplogo.webp">
    
    <!-- SEO 메타 태그 -->
    <meta name="description" content="<?php echo $page_description; ?>">
    <meta name="keywords" content="크리에이터, 커뮤니티, 유튜브, 팁, 정보, 소통">
    <meta name="author" content="짭샵">
    
    <!-- Open Graph 메타 태그 -->
    <meta property="og:title" content="<?php echo $page_title; ?>">
    <meta property="og:description" content="<?php echo $page_description; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://jjap.shop/community">
    <meta property="og:image" content="https://jjap.shop/assets/images/jjapshoplogo.webp">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="../assets/css/common.css">
    
    <!-- 커뮤니티 전용 CSS -->
    <link rel="stylesheet" href="../assets/css/community.css">
</head>
<body>
    <!-- 공용 헤더 -->
    <?php include_once '../includes/section-headers/creator-header.php'; ?>

    <div class="community-container">
        <!-- 헤더 -->
        <div class="community-header">
            <h1>💬 크리에이터 커뮤니티</h1>
            <p>크리에이터들을 위한 자유로운 소통 공간입니다</p>
            <a href="/creator/write-post" class="btn btn-primary write-btn">
                ✍️ 글쓰기
            </a>
        </div>

        <!-- 카테고리 네비게이션 (동적 로딩) -->
        <div class="category-nav" id="categoryNav"></div>

        <!-- 검색 및 정렬 -->
        <div class="search-sort-bar">
            <div class="search-box">
                <input type="text" id="search-input" placeholder="제목, 작성자로 검색...">
                <button id="search-btn" class="search-btn">🔍</button>
            </div>
            <div class="sort-options">
                <select id="sort-select">
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                    <option value="views">조회순</option>
                </select>
            </div>
        </div>

        <!-- 게시글 목록 -->
        <div class="posts-container" id="posts-container">
            <!-- 게시글들이 여기에 동적으로 로드됩니다 -->
            <div class="loading">게시글을 불러오는 중...</div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination" id="pagination">
            <!-- 페이지 번호들이 여기에 동적으로 생성됩니다 -->
        </div>
    </div>

    <!-- 공용 푸터 -->
    <?php include_once '../includes/footer.php'; ?>

    <!-- 커뮤니티 전용 JavaScript -->
    <script src="../assets/js/community.js"></script>
</body>
</html>
