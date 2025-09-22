<?php
/**
 * Game Section Header - 게임 섹션 전용 헤더
 * 발로란트 등 게임 관련 페이지
 */

// 기본 메타 정보가 없으면 기본값 설정
if (!isset($page_title)) $page_title = '게임 - 짭샵';
if (!isset($page_description)) $page_description = '발로란트 공략, 게임 팁, 전략 가이드를 제공하는 게임 전문 플랫폼입니다.';
if (!isset($page_keywords)) $page_keywords = '게임, 발로란트, 공략, 팁, 전략, 가이드, 게임 커뮤니티';
if (!isset($canonical_url)) $canonical_url = 'https://jjap.shop/game';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MJVKR8HQ');</script>
    <!-- End Google Tag Manager -->
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    
    <!-- SEO Meta Tags -->
    <title><?php echo htmlspecialchars($page_title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta name="keywords" content="<?php echo htmlspecialchars($page_keywords); ?>">
    <meta name="author" content="짭샵">
    <link rel="canonical" href="<?php echo htmlspecialchars($canonical_url); ?>">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php echo htmlspecialchars($page_title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($canonical_url); ?>">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://jjap.shop/assets/images/jjapshoplogo.webp">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($page_title); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($page_description); ?>">
    <meta name="twitter:image" content="https://jjap.shop/assets/images/jjapshoplogo.webp">
    <meta name="twitter:creator" content="@짭샵">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6901124389391205"
         crossorigin="anonymous"></script>
    
    <!-- Favicon -->
    <link rel="icon" type="image/webp" sizes="16x16" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/images/jjapshoplogo.webp">
    <link rel="icon" type="image/webp" sizes="32x32" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/images/jjapshoplogo.webp">
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/images/jjapshoplogo.webp">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- Common CSS -->
    <link rel="stylesheet" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/css/common.css">
    <link rel="stylesheet" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/css/two-line-header.css">
    <!-- 메이플인벤 스타일 모바일 메뉴 v2 CSS -->
    <link rel="stylesheet" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/css/mobile-menu-v2.css">
    <!-- 메이플인벤 스타일 모바일 메뉴 v2 JavaScript -->
    <script src="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/js/mobile-menu-v2.js" defer></script>
    <!-- SweetAlert2 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
    
    <!-- Page-specific CSS -->
    <?php if (isset($page_css)): ?>
        <?php if (is_array($page_css)): ?>
            <?php foreach ($page_css as $css_file): ?>
                <link rel="stylesheet" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1) . $css_file; ?>">
            <?php endforeach; ?>
        <?php else: ?>
            <link rel="stylesheet" href="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1) . $page_css; ?>">
        <?php endif; ?>
    <?php endif; ?>
    
    <!-- Page-specific JavaScript -->
    <?php if (isset($page_js)): ?>
        <script src="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1) . $page_js; ?>" defer></script>
    <?php endif; ?>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js" defer></script>
</head>
<body class="game-section <?php echo isset($body_class) ? $body_class : ''; ?>">
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MJVKR8HQ"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <!-- 2줄 헤더 구조 -->
    <header class="two-line-header game-header">
        <!-- 첫 번째 줄: 섹션 네비게이션 -->
        <div class="section-nav-bar">
            <div class="header-container">
                <div class="header-left">
                    <a href="/" class="home-link">
                        <img src="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/images/jjapshoplogo.webp" alt="짭샵" class="logo-img">
                        <span class="logo-text">짭샵</span>
                    </a>
                </div>
                
                <nav class="section-nav">
                    <ul class="section-list">
                        <li><a href="/creator" class="section-link">🎨 크리에이터</a></li>
                        <li><a href="/tools" class="section-link">🛠️ 유틸리티</a></li>
                        <li><a href="/test" class="section-link">🧠 심리테스트</a></li>
                        <li><a href="/game" class="section-link active">🎮 게임</a></li>
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
                        <li><a href="/game" class="detail-link <?php echo (basename($_SERVER['PHP_SELF']) == 'index.php' && strpos($_SERVER['REQUEST_URI'], '/valorant') === false) ? 'active' : ''; ?>">홈</a></li>
                        <li class="detail-dropdown">
                            <a href="/game/valorant" class="detail-link valorant-link <?php echo strpos($_SERVER['REQUEST_URI'], 'valorant') !== false ? 'active' : ''; ?>">
                                <img src="<?php echo str_repeat('../', substr_count($_SERVER['REQUEST_URI'], '/') - 1); ?>assets/images/valorant/valorant_logo.svg" alt="VALORANT" class="valorant-logo-icon">
                                발로란트
                            </a>
                            <div class="dropdown-content">
                                <div class="dropdown-grid">
                                    <div class="dropdown-section">
                                        <div class="dropdown-title">🔥 타격대</div>
                                        <a href="/game/valorant/agent/네온" class="dropdown-item">네온</a>
                                        <a href="/game/valorant/agent/레이나" class="dropdown-item">레이나</a>
                                        <a href="/game/valorant/agent/레이즈" class="dropdown-item">레이즈</a>
                                        <a href="/game/valorant/agent/아이소" class="dropdown-item">아이소</a>
                                        <a href="/game/valorant/agent/요루" class="dropdown-item">요루</a>
                                        <a href="/game/valorant/agent/제트" class="dropdown-item">제트</a>
                                        <a href="/game/valorant/agent/피닉스" class="dropdown-item">피닉스</a>
                                    </div>
                                    <div class="dropdown-section">
                                        <div class="dropdown-title">🎯 척후대</div>
                                        <a href="/game/valorant/agent/게코" class="dropdown-item">게코</a>
                                        <a href="/game/valorant/agent/브리치" class="dropdown-item">브리치</a>
                                        <a href="/game/valorant/agent/소바" class="dropdown-item">소바</a>
                                        <a href="/game/valorant/agent/스카이" class="dropdown-item">스카이</a>
                                        <a href="/game/valorant/agent/케이오" class="dropdown-item">케이오</a>
                                        <a href="/game/valorant/agent/페이드" class="dropdown-item">페이드</a>
                                    </div>
                                    <div class="dropdown-section">
                                        <div class="dropdown-title">🛡️ 감시자</div>
                                        <a href="/game/valorant/agent/데드록" class="dropdown-item">데드록</a>
                                        <a href="/game/valorant/agent/바이스" class="dropdown-item">바이스</a>
                                        <a href="/game/valorant/agent/사이퍼" class="dropdown-item">사이퍼</a>
                                        <a href="/game/valorant/agent/세이지" class="dropdown-item">세이지</a>
                                        <a href="/game/valorant/agent/체임버" class="dropdown-item">체임버</a>
                                        <a href="/game/valorant/agent/킬조이" class="dropdown-item">킬조이</a>
                                    </div>
                                    <div class="dropdown-section">
                                        <div class="dropdown-title">💨 연막</div>
                                        <a href="/game/valorant/agent/바이퍼" class="dropdown-item">바이퍼</a>
                                        <a href="/game/valorant/agent/브림스톤" class="dropdown-item">브림스톤</a>
                                        <a href="/game/valorant/agent/아스트라" class="dropdown-item">아스트라</a>
                                        <a href="/game/valorant/agent/오멘" class="dropdown-item">오멘</a>
                                        <a href="/game/valorant/agent/클로브" class="dropdown-item">클로브</a>
                                        <a href="/game/valorant/agent/하버" class="dropdown-item">하버</a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
    
    <!-- 메이플인벤 스타일 모바일 메뉴는 JavaScript로 동적 생성됨 -->
    
    <!-- 메인 콘텐츠 시작 -->
    <main class="main-content game-content">
