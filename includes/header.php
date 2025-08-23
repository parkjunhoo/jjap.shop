<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="ca-pub-6901124389391205">
    
    <!-- SEO 메타 태그 -->
    <title><?php echo isset($page_title) ? $page_title : '짭샵 - 크리에이터를 위한 도구 모음'; ?></title>
    <meta name="description" content="<?php echo isset($page_description) ? $page_description : '크리에이터들을 위한 다양한 무료 도구 모음입니다.'; ?>">
    <meta name="keywords" content="<?php echo isset($page_keywords) ? $page_keywords : '크리에이터, 도구, 무료, 카카오톡, 이미지편집'; ?>">
    <meta name="author" content="핵돌핀">
    <meta name="robots" content="index, follow">
    
    <!-- Open Graph 메타 태그 -->
    <meta property="og:title" content="<?php echo isset($page_title) ? $page_title : '짭샵 - 크리에이터를 위한 도구 모음'; ?>">
    <meta property="og:description" content="<?php echo isset($page_description) ? $page_description : '크리에이터들을 위한 다양한 무료 도구 모음입니다.'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo isset($page_url) ? $page_url : 'https://jjap.shop'; ?>">
    <meta property="og:image" content="<?php echo isset($page_image) ? $page_image : '../assets/images/jjap.png'; ?>">
    <meta property="og:site_name" content="짭샵">
    
    <!-- Twitter Card 메타 태그 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo isset($page_title) ? $page_title : '짭샵 - 크리에이터를 위한 도구 모음'; ?>">
    <meta name="twitter:description" content="<?php echo isset($page_description) ? $page_description : '크리에이터들을 위한 다양한 무료 도구 모음입니다.'; ?>">
    <meta name="twitter:image" content="<?php echo isset($page_image) ? $page_image : '../assets/images/jjap.png'; ?>">
    
    <!-- 파비콘 설정 -->
    <link rel="icon" type="image/x-icon" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/favicon.ico' : '../assets/images/favicon.ico'; ?>">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/favicon-16x16.png' : '../assets/images/favicon-16x16.png'; ?>">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/favicon-32x32.png' : '../assets/images/favicon-32x32.png'; ?>">
    <link rel="icon" type="image/png" sizes="48x48" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/favicon-48x48.png' : '../assets/images/favicon-48x48.png'; ?>">
    
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/apple-touch-icon.png' : '../assets/images/apple-touch-icon.png'; ?>">
    
    <!-- Windows 타일 아이콘 -->
    <meta name="msapplication-TileColor" content="#007bff">
    <meta name="msapplication-TileImage" content="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/mstile-144x144.png' : '../assets/images/mstile-144x144.png'; ?>">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/css/common.css' : '../assets/css/common.css'; ?>">
    
    <!-- 페이지별 CSS -->
    <?php if (isset($page_css)): ?>
        <link rel="stylesheet" href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? $page_css : '../' . $page_css; ?>">
    <?php endif; ?>
    
    <!-- 페이지별 JavaScript -->
    <?php if (isset($page_js)): ?>
        <script src="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? $page_js : '../' . $page_js; ?>" defer></script>
    <?php endif; ?>
</head>
<body class="<?php echo isset($body_class) ? $body_class : ''; ?>">
    <!-- 공용 헤더 -->
    <header class="common-header">
        <div class="header-container">
            <div class="header-left">
                <a href="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? '/' : '/'; ?>" class="home-link">
                    <img src="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/jjap.png' : '../assets/images/jjap.png'; ?>" alt="짭샵" class="logo-img">
                    <span class="logo-text">짭샵</span>
                </a>
            </div>
            
            <nav class="header-nav">
                <ul class="nav-list">
                    <li><a href="/" class="nav-link">홈</a></li>
                    <li><a href="/kakao-chat" class="nav-link <?php echo basename($_SERVER['PHP_SELF']) == 'kakao-chat.php' ? 'active' : ''; ?>">
                        <img src="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/kakao.svg' : '../assets/images/kakao.svg'; ?>" alt="카카오톡" class="nav-icon">
                        카카오톡 대화
                    </a></li>
                </ul>
            </nav>
            
            <div class="header-right">
                <button class="theme-toggle" id="theme-toggle" title="테마 변경">
                    <span class="theme-icon light">☀️</span>
                    <span class="theme-icon dark">🌙</span>
                </button>
            </div>
        </div>
    </header>
    
    <!-- 메인 콘텐츠 시작 -->
    <main class="main-content">
