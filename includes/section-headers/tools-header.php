<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MJVKR8HQ');</script>
    <!-- End Google Tag Manager -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO 메타 태그 -->
    <title><?php echo isset($page_title) ? $page_title : '유틸리티 도구 - 짭샵'; ?></title>
    <meta name="description" content="<?php echo isset($page_description) ? $page_description : '일상생활에 유용한 다양한 온라인 유틸리티 도구들! 텍스트 변환, 이미지 처리, 계산기, 파일 변환 등 모든 도구를 무료로 사용하세요.'; ?>">
    <meta name="keywords" content="<?php echo isset($page_keywords) ? $page_keywords : '유틸리티 도구, 온라인 도구, 텍스트 변환, 이미지 처리, 계산기, 파일 변환, 무료 도구, 짭샵, jjap.shop'; ?>">
    <meta name="author" content="짭샵">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#4ECDC4">
    
    <!-- Open Graph 메타 태그 -->
    <meta property="og:title" content="<?php echo isset($page_title) ? $page_title : '유틸리티 도구 - 짭샵'; ?>">
    <meta property="og:description" content="<?php echo isset($page_description) ? $page_description : '일상생활에 유용한 다양한 온라인 유틸리티 도구들!'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo isset($page_url) ? $page_url : 'https://jjap.shop/tools'; ?>">
    <meta property="og:image" content="https://jjap.shop/assets/images/jjapshoplogo.webp">
    <meta property="og:site_name" content="짭샵 유틸리티">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6901124389391205"
         crossorigin="anonymous"></script>
    
    <!-- 파비콘 설정 -->
    <link rel="icon" type="image/webp" sizes="16x16" href="../assets/images/jjapshoplogo.webp">
    <link rel="icon" type="image/webp" sizes="32x32" href="../assets/images/jjapshoplogo.webp">
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/jjapshoplogo.webp">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="../assets/css/common.css">
    <!-- 2줄 헤더 CSS -->
    <link rel="stylesheet" href="../assets/css/two-line-header.css">
    <!-- 새로운 모바일 메뉴 v2 CSS -->
    <link rel="stylesheet" href="../assets/css/mobile-menu-v2.css">
    <!-- 새로운 모바일 메뉴 v2 JavaScript -->
    <script src="../assets/js/mobile-menu-v2.js" defer></script>
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- 페이지별 CSS -->
    <?php if (isset($page_css)): ?>
        <link rel="stylesheet" href="<?php echo '../' . $page_css; ?>">
    <?php endif; ?>
    
    <!-- 페이지별 JavaScript -->
    <?php if (isset($page_js)): ?>
        <script src="<?php echo '../' . $page_js; ?>" defer></script>
    <?php endif; ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js" defer></script>
</head>
<body class="tools-section <?php echo isset($body_class) ? $body_class : ''; ?>">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJVKR8HQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <!-- 2줄 헤더 구조 -->
    <header class="two-line-header tools-header">
        <!-- 첫 번째 줄: 섹션 네비게이션 -->
        <div class="section-nav-bar">
            <div class="header-container">
                <div class="header-left">
                    <a href="/" class="home-link">
                        <img src="../assets/images/jjapshoplogo.webp" alt="짭샵" class="logo-img">
                        <span class="logo-text">짭샵</span>
                    </a>
                </div>
                
                <nav class="section-nav">
                    <ul class="section-list">
                        <li><a href="/creator" class="section-link">🎨 크리에이터</a></li>
                        <li><a href="/tools" class="section-link active">🛠️ 유틸리티</a></li>
                        <li><a href="/test" class="section-link">🧠 심리테스트</a></li>
                        <li><a href="/game" class="section-link">🎮 게임</a></li>
                        <li><a href="/horror" class="section-link">👻 무서운이야기</a></li>
                    </ul>
                </nav>
                
                <div class="header-right">
                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- 두 번째 줄: 세부 메뉴 -->
        <div class="detail-nav-bar">
            <div class="header-container">
                <nav class="detail-nav">
        <ul class="detail-list">
            <li><a href="/tools" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>">🏠 홈</a></li>
            <li><a href="/tools/daily-scheduler" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'daily-scheduler.php' ? 'active' : ''; ?>">⏰ 생활계획표</a></li>
            <li><a href="/tools/pomodoro-timer" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'pomodoro-timer.php' ? 'active' : ''; ?>">🍅 포모도로</a></li>
            <li><a href="/tools/random-advice" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'random-advice.php' ? 'active' : ''; ?>">🎲 랜덤조언</a></li>
            <li><a href="/tools/daily-fortune" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'daily-fortune.php' ? 'active' : ''; ?>">🔮 오늘운세</a></li>
            <li><a href="/tools/food-picker" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'food-picker.php' ? 'active' : ''; ?>">🍽️ 음식추천</a></li>
            <li><a href="/tools/lotto-generator" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'lotto-generator.php' ? 'active' : ''; ?>">🎰 로또번호</a></li>
        </ul>
                </nav>
            </div>
        </div>
    </header>
    
    <!-- 메이플인벤 스타일 모바일 메뉴는 JavaScript로 동적 생성됨 -->
    </script>
    
    <!-- 메인 콘텐츠 시작 -->
    <main class="main-content tools-content">
