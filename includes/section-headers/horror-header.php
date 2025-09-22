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
    <title><?php echo isset($page_title) ? $page_title : '무서운이야기 - 짭샵'; ?></title>
    <meta name="description" content="<?php echo isset($page_description) ? $page_description : '스릴 넘치는 무서운 이야기와 괴담 커뮤니티! 실화 무서운 이야기, 창작 괴담, 도시전설 등을 함께 나누고 즐기세요.'; ?>">
    <meta name="keywords" content="<?php echo isset($page_keywords) ? $page_keywords : '무서운이야기, 괴담, 도시전설, 실화 무서운 이야기, 창작 괴담, 호러 스토리, 무서운 사진, 짭샵, jjap.shop'; ?>">
    <meta name="author" content="짭샵">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#8B5A83">
    
    <!-- Open Graph 메타 태그 -->
    <meta property="og:title" content="<?php echo isset($page_title) ? $page_title : '무서운이야기 - 짭샵'; ?>">
    <meta property="og:description" content="<?php echo isset($page_description) ? $page_description : '스릴 넘치는 무서운 이야기와 괴담 커뮤니티!'; ?>">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo isset($page_url) ? $page_url : 'https://jjap.shop/horror'; ?>">
    <meta property="og:image" content="https://jjap.shop/assets/images/jjapshoplogo.webp">
    <meta property="og:site_name" content="짭샵 무서운이야기">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6901124389391205"
         crossorigin="anonymous"></script>
    
    <!-- 파비콘 설정 -->
    <link rel="icon" type="image/webp" sizes="16x16" href="/assets/images/jjapshoplogo.webp">
    <link rel="icon" type="image/webp" sizes="32x32" href="/assets/images/jjapshoplogo.webp">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/jjapshoplogo.webp">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="/assets/css/common.css">
    <!-- 2줄 헤더 CSS -->
    <link rel="stylesheet" href="/assets/css/two-line-header.css">
    <!-- 새로운 모바일 메뉴 v2 CSS -->
    <link rel="stylesheet" href="/assets/css/mobile-menu-v2.css">
    <!-- 새로운 모바일 메뉴 v2 JavaScript -->
    <script src="/assets/js/mobile-menu-v2.js" defer></script>
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- 페이지별 CSS -->
    <?php if (isset($page_css)): ?>
        <link rel="stylesheet" href="/<?php echo $page_css; ?>">
    <?php endif; ?>
    
    <!-- 페이지별 JavaScript -->
    <?php if (isset($page_js)): ?>
        <script src="/<?php echo $page_js; ?>" defer></script>
    <?php endif; ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js" defer></script>
</head>
<body class="horror-section <?php echo isset($body_class) ? $body_class : ''; ?>">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJVKR8HQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <!-- 2줄 헤더 구조 -->
    <header class="two-line-header horror-header">
        <!-- 첫 번째 줄: 섹션 네비게이션 -->
        <div class="section-nav-bar">
            <div class="header-container">
                <div class="header-left">
                    <a href="/" class="home-link">
                        <img src="/assets/images/jjapshoplogo.webp" alt="짭샵" class="logo-img">
                        <span class="logo-text">짭샵</span>
                    </a>
                </div>
                
                <nav class="section-nav">
                    <ul class="section-list">
                        <li><a href="/creator" class="section-link">🎨 크리에이터</a></li>
                        <li><a href="/tools" class="section-link">🛠️ 유틸리티</a></li>
                        <li><a href="/test" class="section-link">🧠 심리테스트</a></li>
                        <li><a href="/game" class="section-link">🎮 게임</a></li>
                        <li><a href="/horror" class="section-link active">👻 무서운이야기</a></li>
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
                        <li><a href="/horror" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'active' : ''; ?>">홈</a></li>
                        <li><a href="/horror/category/urban-legends" class="detail-link <?php echo (isset($_GET['category']) && $_GET['category'] == 'urban-legends') ? 'active' : ''; ?>">🏙️ 도시 전설</a></li>
                        <li><a href="/horror/category/true-stories" class="detail-link <?php echo (isset($_GET['category']) && $_GET['category'] == 'true-stories') ? 'active' : ''; ?>">😨 실화 이야기</a></li>
                        <li><a href="/horror/category/scary-when-understood" class="detail-link <?php echo (isset($_GET['category']) && $_GET['category'] == 'scary-when-understood') ? 'active' : ''; ?>">🤔 이해하면 무서운</a></li>
                        <li><a href="/horror/category/translated-horror" class="detail-link <?php echo (isset($_GET['category']) && $_GET['category'] == 'translated-horror') ? 'active' : ''; ?>">🌏 번역 괴담</a></li>
                        <li><a href="/horror/write" class="detail-link <?php echo basename($_SERVER['PHP_SELF']) == 'write.php' ? 'active' : ''; ?>">✍️ 글쓰기</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    
    <!-- 새로운 모바일 메뉴는 JavaScript로 동적 생성됨 -->
    <nav class="mobile-menu horror-mobile-menu" id="mobileMenu" aria-hidden="true">
        <div class="mobile-menu-content">
            <div class="mobile-menu-header">
                <h3>메뉴</h3>
                <button class="mobile-menu-close" id="mobileMenuClose">×</button>
            </div>
            
            <!-- 섹션 선택 -->
            <div class="mobile-section-nav">
                <h4>섹션</h4>
                <ul class="mobile-section-list">
                    <li><a href="/creator" class="mobile-section-link">🎨 크리에이터</a></li>
                    <li><a href="/tools" class="mobile-section-link">🛠️ 유틸리티</a></li>
                    <li><a href="/test" class="mobile-section-link">🧠 심리테스트</a></li>
                    <li><a href="/game" class="mobile-section-link">🎮 게임</a></li>
                    <li><a href="/horror" class="mobile-section-link active">👻 무서운이야기</a></li>
                </ul>
            </div>
            
            <!-- 세부 메뉴 -->
            <div class="mobile-detail-nav">
                <h4>무서운이야기 메뉴</h4>
                <ul class="mobile-nav-list">
                    <li><a href="/horror" class="mobile-nav-link">🏠 홈</a></li>
                    <li><a href="/horror/category/urban-legends" class="mobile-nav-link">🏙️ 도시 전설</a></li>
                    <li><a href="/horror/category/true-stories" class="mobile-nav-link">😨 실화 이야기</a></li>
                    <li><a href="/horror/category/scary-when-understood" class="mobile-nav-link">🤔 이해하면 무서운</a></li>
                    <li><a href="/horror/category/translated-horror" class="mobile-nav-link">🌏 번역 괴담</a></li>
                    <li><a href="/horror/write" class="mobile-nav-link">✍️ 글쓰기</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <script>
    (function(){
        const btn = document.getElementById('mobileMenuBtn');
        const closeBtn = document.getElementById('mobileMenuClose');
        const menu = document.getElementById('mobileMenu');
        function open(){ menu.classList.add('active'); menu.setAttribute('aria-hidden','false'); }
        function close(){ menu.classList.remove('active'); menu.setAttribute('aria-hidden','true'); }
        if (btn) btn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        menu.addEventListener('click', function(e){ if(e.target === menu) close(); });
        window.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    })();
    </script>
    
    <!-- 메인 콘텐츠 시작 -->
    <main class="main-content horror-content">
