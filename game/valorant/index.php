<?php
$page_title = '발로란트 공략 가이드 - 요원별 팁과 전략 | 짭샵';
$page_description = '발로란트 완벽 공략! 25개 요원별 상세 가이드, 스킬 활용법, 맵 전략, 메타 분석까지. 초보부터 고수까지 모든 레벨의 발로란트 플레이어를 위한 최고의 팁 커뮤니티.';
$page_keywords = '발로란트, 발로란트 공략, 발로란트 팁, 요원 가이드, 발로란트 전략, 타격대, 척후대, 감시자, 연막, 발로란트 커뮤니티, FPS 게임, 게임 팁, 짭샵';
$canonical_url = 'https://jjap.shop/game/valorant';
$page_css = 'assets/css/valorant.css';
$page_js = 'assets/js/valorant-new.js';
?>

<?php include_once '../../includes/section-headers/game-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../../includes/ads/horizontal-ad.php'; ?>

<div class="valorant-container">
    <!-- Valorant Hero Section -->
    <section class="valorant-hero">
        <div class="hero-background">
            <img src="../../assets/images/valorant/valorant_logo.svg" alt="VALORANT" class="hero-logo">
        </div>
        <div class="hero-content">
            <h1 class="hero-title">VALORANT</h1>
            <div class="hero-actions">
                <a href="/game/valorant/board" class="hero-btn primary">🎯 팁 게시판</a>
                <a href="/game/valorant/favorites" class="hero-btn secondary">⭐ 즐겨찾기</a>
            </div>
        </div>
    </section>

    <!-- Agent Types Section -->
    <section class="agent-types-section">
        <div class="section-header">
            <h2 class="section-title">🎯 요원 역할별 가이드</h2>
            <p class="section-subtitle">각 역할의 특성을 파악하고 완벽한 팀워크를 구성하세요</p>
        </div>

        <div class="agent-types-grid">
            <!-- 타격대 -->
            <div class="agent-type-card duelist" data-type="duelist">
                <div class="type-header">
                    <img src="../../assets/images/valorant/charactor/타격대.svg" alt="타격대" class="type-icon">
                    <div class="type-info">
                        <h3 class="type-name">타격대</h3>
                        <p class="type-name-en">Duelist</p>
                        <p class="type-description">전장을 주도하는 공격적 요원</p>
                    </div>
                </div>
                <div class="agents-preview" id="duelistAgents">
                    <div class="loading">요원 정보를 불러오는 중...</div>
                </div>
            </div>

            <!-- 척후대 -->
            <div class="agent-type-card initiator" data-type="initiator">
                <div class="type-header">
                    <img src="../../assets/images/valorant/charactor/척후대.svg" alt="척후대" class="type-icon">
                    <div class="type-info">
                        <h3 class="type-name">척후대</h3>
                        <p class="type-name-en">Initiator</p>
                        <p class="type-description">정보 수집과 진입을 지원</p>
                    </div>
                </div>
                <div class="agents-preview" id="initiatorAgents">
                    <div class="loading">요원 정보를 불러오는 중...</div>
                </div>
            </div>

            <!-- 감시자 -->
            <div class="agent-type-card sentinel" data-type="sentinel">
                <div class="type-header">
                    <img src="../../assets/images/valorant/charactor/감시자.svg" alt="감시자" class="type-icon">
                    <div class="type-info">
                        <h3 class="type-name">감시자</h3>
                        <p class="type-name-en">Sentinel</p>
                        <p class="type-description">방어와 영역 통제 전문</p>
                    </div>
                </div>
                <div class="agents-preview" id="sentinelAgents">
                    <div class="loading">요원 정보를 불러오는 중...</div>
                </div>
            </div>

            <!-- 연막 -->
            <div class="agent-type-card controller" data-type="controller">
                <div class="type-header">
                    <img src="../../assets/images/valorant/charactor/연막.svg" alt="연막" class="type-icon">
                    <div class="type-info">
                        <h3 class="type-name">연막</h3>
                        <p class="type-name-en">Controller</p>
                        <p class="type-description">맵 제어와 지원의 핵심</p>
                    </div>
                </div>
                <div class="agents-preview" id="controllerAgents">
                    <div class="loading">요원 정보를 불러오는 중...</div>
                </div>
            </div>
        </div>
    </section>

</div>

<?php include_once '../../includes/footer.php'; ?>
