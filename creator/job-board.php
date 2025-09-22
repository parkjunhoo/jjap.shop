<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>구인구직 - 크리에이터 커뮤니티</title>
    <meta name="description" content="크리에이터들을 위한 구인구직 공간입니다. 편집자, 멤버, 기타 분야의 일자리를 찾아보세요">
    
    <!-- Open Graph -->
    <meta property="og:title" content="구인구직 - 크리에이터 커뮤니티">
    <meta property="og:description" content="크리에이터들을 위한 구인구직 공간입니다. 편집자, 멤버, 기타 분야의 일자리를 찾아보세요">
    <meta property="og:type" content="website">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/community.css">
    <link rel="stylesheet" href="../assets/css/job-board.css">
</head>
<body>
    <?php include '../includes/section-headers/creator-header.php'; ?>
    
    <!-- Google AdSense 수평 광고 -->
    <?php include_once '../includes/ads/horizontal-ad.php'; ?>
    
    <div class="job-board-container">
        <!-- 헤더 -->
        <div class="job-board-header">
            <h1><i class="fas fa-briefcase"></i> 구인구직</h1>
            <p>크리에이터들과 함께할 멋진 기회를 찾아보세요!</p>
            <div class="header-buttons">
                <a href="/creator/write-job?type=recruit" class="btn-recruit">
                    <i class="fas fa-user-plus"></i> 구인하기
                </a>
                <a href="/creator/write-job?type=job_seek" class="btn-job-seek">
                    <i class="fas fa-search"></i> 구직하기
                </a>
            </div>
        </div>
        
        <!-- 카테고리 네비게이션 -->
        <div class="category-nav">
            <button class="category-btn active" data-category="all">
                <i class="fas fa-th-large"></i> 전체
            </button>
            <button class="category-btn" data-category="editor">
                <i class="fas fa-cut"></i> 편집자
            </button>
            <button class="category-btn" data-category="member">
                <i class="fas fa-users"></i> 멤버
            </button>
            <button class="category-btn" data-category="other">
                <i class="fas fa-plus-circle"></i> 기타
            </button>
        </div>

        <!-- 구인/구직 토글 -->
        <div class="type-toggle" id="typeToggle">
            <button class="type-btn active" data-type="all">전체</button>
            <button class="type-btn" data-type="recruit">구인</button>
            <button class="type-btn" data-type="job_seek">구직</button>
        </div>
        
        <!-- 검색 및 정렬 -->
        <div class="search-sort-bar">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="구인구직 검색...">
                <button class="search-btn" id="searchBtn">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="filter-options">
                <select id="postTypeFilter">
                    <option value="all">전체</option>
                    <option value="recruit">구인</option>
                    <option value="job_seek">구직</option>
                </select>
            </div>
            <div class="sort-options">
                <select id="sortSelect">
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                    <option value="minute_high">분당 단가 높은순</option>
                    <option value="minute_low">분당 단가 낮은순</option>
                    <option value="video_high">건당 단가 높은순</option>
                    <option value="video_low">건당 단가 낮은순</option>
                    <option value="views">조회순</option>
                </select>
            </div>
        </div>
        
        <!-- 구인구직 목록 -->
        <div class="job-posts-container">
            <div class="loading" id="loading">
                <i class="fas fa-spinner fa-spin"></i> 구인구직 정보를 불러오는 중...
            </div>
            
            <div class="job-posts-list" id="jobPostsList" style="display: none;">
                <!-- 구인구직 게시글이 여기에 동적으로 로드됩니다 -->
            </div>
            
            <!-- 페이지네이션 -->
            <div class="pagination" id="pagination"></div>
        </div>
        
        
    </div>
    
    <?php include '../includes/footer.php'; ?>
    
    <script src="../assets/js/job-board.js"></script>
</body>
</html>
