<?php
$page_title = '게임 공략 모음 - 발로란트 팁 가이드 | 짭샵';
$page_description = '게이머들을 위한 최고의 게임 공략 플랫폼! 발로란트 요원별 팁, 전략 가이드, 커뮤니티 공략을 무료로 만나보세요. 초보부터 고수까지 모든 레벨의 게이머를 위한 완벽한 가이드.';
$page_keywords = '게임 공략, 발로란트 팁, 발로란트 공략, 요원 가이드, 게임 커뮤니티, FPS 게임, 게이밍, 전략 가이드, 발로란트 전략, 게임 팁, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/game';
$page_css = 'assets/css/game.css';
// $page_js = 'assets/js/game.js';
?>

<?php include_once '../includes/section-headers/game-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="game-home-container">
    <!-- Games Grid Section -->
    <section class="games-section">
        <div class="games-grid">
            <!-- 발로란트 -->
            <a href="/game/valorant" class="game-card valorant">
                <div class="game-card-background"></div>
                <div class="game-icon">
                    <img src="../assets/images/valorant/valorant_logo.svg" alt="VALORANT 로고" class="game-logo">
                </div>
                <div class="game-info">
                    <h3 class="game-title">VALORANT</h3>
                    <p class="game-genre">전술 FPS</p>
                    <p class="game-description">요원별 상세 공략과 전략 가이드</p>
                    <div class="game-features">
                        <span class="feature-tag">요원별 팁</span>
                        <span class="feature-tag">맵 전략</span>
                        <span class="feature-tag">스킬 가이드</span>
                        <span class="feature-tag">즐겨찾기</span>
                    </div>
                </div>
                <div class="card-arrow" onclick="window.location.href='/game/valorant/board'">
                    <span>공략 보러가기</span>
                    <span class="arrow-icon">→</span>
                </div>
            </a>
        </div>
    </section>
</div>

<?php include_once '../includes/footer.php'; ?>
