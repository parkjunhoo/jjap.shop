<?php
$page_title = '랜덤 조언 생성기 - 짭샵';
$page_description = '100가지 지혜로운 조언 중 하나를 랜덤하게 받아보세요. 매일 새로운 인사이트를 얻으세요.';
$page_keywords = '랜덤 조언, 명언, 지혜, 인생 조언, 동기부여, 영감, 해결의 책';
$page_css = '../assets/css/common.css';
include_once '../includes/section-headers/tools-header.php';
?>

    <link rel="stylesheet" href="../assets/css/random-advice.css">

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="advice-container">
    <div class="advice-header">
        <h1>🎲 랜덤 조언 생성기</h1>
        <p>인생의 고민이 있을 때, 새로운 시각이 필요할 때<br>1100가지 지혜로운 조언 중 하나를 받아보세요</p>
    </div>

    <div class="advice-main">
        <div class="advice-card">
            <div class="advice-icon">💡</div>
            <div class="advice-text" id="adviceText">
                "조언 생성" 버튼을 클릭하여 오늘의 조언을 받아보세요
            </div>
            <div class="advice-source" id="adviceSource">
                — 지혜의 말씀 —
            </div>
        </div>

        <div class="advice-controls">
            <button id="generateAdvice" class="btn btn-primary">
                <span class="btn-icon">🎯</span>
                조언 생성
            </button>
            <button id="favoriteAdvice" class="btn btn-secondary" style="display: none;">
                <span class="btn-icon">❤️</span>
                즐겨찾기
            </button>
        </div>

        <div class="advice-stats" id="adviceStats">
            <div class="stat-item">
                <span class="stat-number" id="totalGenerated">0</span>
                <span class="stat-label">생성된 조언</span>
            </div>
            <div class="stat-item">
                <span class="stat-number" id="totalFavorites">0</span>
                <span class="stat-label">즐겨찾기</span>
            </div>
        </div>
    </div>

    <div class="advice-favorites" id="adviceFavorites" style="display: none;">
        <h3>❤️ 나의 즐겨찾기 조언</h3>
        <div class="favorites-list" id="favoritesList">
            <!-- 즐겨찾기 조언들이 여기에 표시됩니다 -->
        </div>
        <button id="clearFavorites" class="btn btn-danger">
            <span class="btn-icon">🗑️</span>
            즐겨찾기 모두 삭제
        </button>
    </div>
</div>

    <script src="../assets/js/random-advice-extended.js"></script>

<?php include_once '../includes/footer.php'; ?>
