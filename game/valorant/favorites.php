<?php 
$page_title = '발로란트 즐겨찾기 - 내가 저장한 팁 모아보기 | 짭샵';
$page_description = '발로란트 게임에서 내가 즐겨찾기한 팁과 공략들을 한 번에 모아보세요. 요원별 전략과 유용한 팁들을 쉽게 찾아보실 수 있습니다.';
$page_keywords = '발로란트, 즐겨찾기, 팁, 공략, 전략, 발로란트 가이드, 요원 공략, 게임 팁, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/game/valorant/favorites';
$page_css = 'assets/css/valorant-favorites.css';
$page_js = 'assets/js/valorant-favorites.js';
?>

<?php include_once '../../includes/section-headers/game-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../../includes/ads/horizontal-ad.php'; ?>

<div class="valorant-favorites-container">
    <!-- 헤더 섹션 -->
    <div class="favorites-header">
        <div class="header-content">
            <div class="header-icon">⭐</div>
            <h1 class="page-title">내 즐겨찾기</h1>
            <p class="page-description">저장된 발로란트 팁과 공략을 확인하세요</p>
        </div>
    </div>

    <!-- 필터 및 검색 -->
    <div class="favorites-controls">
        <div class="controls-left">
            <!-- 요원 필터 버튼 -->
            <button id="agentFilterBtn" class="agent-filter-btn">
                <span id="agentFilterText">🎯 모든 요원</span>
                <span class="filter-arrow">▼</span>
            </button>
        </div>
        
        <div class="controls-right">
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="제목이나 내용으로 검색...">
                <span class="search-icon">🔍</span>
            </div>
        </div>
    </div>

    <!-- 즐겨찾기 목록 -->
    <div class="favorites-content">
        <div id="favoritesList" class="favorites-list">
            <!-- JavaScript로 동적 로딩 -->
        </div>
        
        <!-- 빈 상태 -->
        <div id="emptyState" class="empty-state" style="display: none;">
            <div class="empty-icon">⭐</div>
            <h3>아직 즐겨찾기가 없습니다</h3>
            <p>발로란트 팁 게시판에서 유용한 팁들을 즐겨찾기에 추가해보세요!</p>
            <a href="/game/valorant/board" class="go-to-board-btn">팁 게시판 바로가기</a>
        </div>
    </div>

    <!-- 로딩 스피너 -->
    <div id="loadingSpinner" class="loading-spinner">
        <div class="spinner"></div>
        <p>즐겨찾기를 불러오는 중...</p>
    </div>
</div>

<!-- 요원 필터 모달 -->
<div class="agent-filter-modal" id="agentFilterModal">
    <div class="agent-modal-overlay" onclick="closeAgentFilterModal()"></div>
    <div class="agent-modal-content">
        <div class="agent-modal-header">
            <h3 class="modal-title">요원 선택</h3>
            <button class="modal-close" onclick="closeAgentFilterModal()">
                <span>✕</span>
            </button>
        </div>
        <div class="agent-modal-body">
            <div class="agent-roles" id="agentRoles">
                <!-- JavaScript로 동적 로딩 -->
            </div>
        </div>
        <div class="agent-modal-footer">
            <div class="selected-agents-info">
                <span id="selectedAgentsCount">0개 요원 선택됨</span>
            </div>
            <div class="modal-actions">
                <button class="modal-btn clear-btn" onclick="clearAllAgents()">전체 해제</button>
                <button class="modal-btn apply-btn" onclick="applyAgentFilter()">적용</button>
            </div>
        </div>
    </div>
</div>

<!-- 모달 컨테이너 (JavaScript에서 동적 생성) -->

<!-- 푸터 -->
<?php include_once '../../includes/footer.php'; ?>
