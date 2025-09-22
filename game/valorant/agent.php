<?php
// URL에서 요원 이름 추출 (예: /game/valorant/agent/네온)
$request_uri = $_SERVER['REQUEST_URI'];
$path_parts = explode('/', trim($request_uri, '/'));

// agent 다음의 경로에서 요원 이름 추출
$agent_name = '';
$agent_key = array_search('agent', $path_parts);
if ($agent_key !== false && isset($path_parts[$agent_key + 1])) {
    $agent_name = urldecode($path_parts[$agent_key + 1]);
}

// 요원 이름이 없으면 발로란트 메인으로 리다이렉트
if (!$agent_name) {
    header('Location: /game/valorant');
    exit;
}

// 페이지 메타 정보
$page_title = $agent_name . ' 공략 및 팁 - 발로란트 - 게임 공략 - 짭샵';
$page_description = '발로란트 ' . $agent_name . ' 요원의 상세한 공략 가이드와 실전 팁을 확인해보세요. 프로 게이머들의 노하우와 커뮤니티 팁을 모두 만나볼 수 있습니다.';
$page_keywords = '발로란트, 발로란트 ' . $agent_name . ', ' . $agent_name . ' 공략, ' . $agent_name . ' 가이드, ' . $agent_name . ' 팁, 발로란트 팁, 게임 공략, 짭샵';
$canonical_url = 'https://jjap.shop/game/valorant/agent/' . urlencode($agent_name);

// 페이지별 CSS, JS
$page_css = 'assets/css/valorant-board.css';
$page_js = 'assets/js/valorant-board.js';
?>

<?php include_once '../../../includes/section-headers/game-header.php'; ?>

<main class="valorant-board-main">
    <!-- 요원 헤더 -->
    <div class="agent-header">
        <div class="agent-hero">
            <div class="container">
                <div class="agent-info-loading">
                    <div class="loading-spinner">⚡</div>
                    <p>요원 정보를 불러오는 중...</p>
                </div>
                <div class="agent-info" style="display: none;">
                    <div class="agent-avatar">
                        <img id="agentImage" src="" alt="" class="agent-image">
                        <div class="agent-type-badge" id="agentTypeBadge"></div>
                    </div>
                    <div class="agent-details">
                        <div class="agent-type" id="agentType"></div>
                        <h1 class="agent-name" id="agentName"><?php echo htmlspecialchars($agent_name); ?></h1>
                        <p class="agent-description" id="agentDescription"></p>
                        <div class="agent-stats">
                            <div class="stat-item">
                                <span class="stat-number" id="totalTips">-</span>
                                <span class="stat-label">총 팁</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="totalViews">-</span>
                                <span class="stat-label">총 조회수</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number" id="totalLikes">-</span>
                                <span class="stat-label">총 좋아요</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- AdSense 광고 -->
    <?php include_once '../../../includes/ads/horizontal-ad.php'; ?>

    <!-- 컨트롤 바 -->
    <div class="controls-bar">
        <div class="container">
            <div class="controls-left">
                <div class="sort-controls">
                    <select id="sortSelect" class="custom-select">
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                        <option value="likes">좋아요순</option>
                        <option value="comments">댓글순</option>
                    </select>
                </div>
                <div class="filter-controls">
                    <select id="difficultyFilter" class="custom-select">
                        <option value="">모든 난이도</option>
                        <option value="beginner">초급</option>
                        <option value="intermediate">중급</option>
                        <option value="advanced">고급</option>
                    </select>
                    <select id="categoryFilter" class="custom-select">
                        <option value="">모든 카테고리</option>
                        <option value="strategy">전략</option>
                        <option value="skill">스킬</option>
                        <option value="map">맵</option>
                        <option value="general">일반</option>
                    </select>
                </div>
            </div>
            <div class="controls-right">
                <button id="writeBtn" class="write-btn">
                    <i class="icon">✏️</i>
                    팁 작성하기
                </button>
                <button id="favoriteViewBtn" class="favorite-view-btn">
                    <i class="icon">⭐</i>
                    즐겨찾기 (<span id="favoriteCount">0</span>)
                </button>
            </div>
        </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="posts-section">
        <div class="container">
            <!-- 로딩 상태 -->
            <div id="postsLoading" class="posts-loading">
                <div class="loading-spinner">⚡</div>
                <p>팁을 불러오는 중...</p>
            </div>

            <!-- 게시글 목록 -->
            <div id="postsList" class="posts-list" style="display: none;"></div>

            <!-- 빈 상태 -->
            <div id="emptyPosts" class="empty-posts" style="display: none;">
                <div class="empty-icon">📝</div>
                <h3>아직 <?php echo htmlspecialchars($agent_name); ?> 팁이 없습니다</h3>
                <p>첫 번째 팁을 작성해보세요!</p>
                <button class="write-first-btn" onclick="location.href='/game/valorant/write?agent=<?php echo urlencode($agent_name); ?>'">
                    첫 팁 작성하기
                </button>
            </div>

            <!-- 페이지네이션 -->
            <div id="pagination" class="pagination" style="display: none;"></div>
        </div>
    </div>

    <!-- 즐겨찾기 모달 -->
    <div id="favoritesModal" class="modal favorites-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>⭐ 즐겨찾기한 팁들</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="favorites-controls">
                    <div class="view-toggle">
                        <button id="listViewBtn" class="view-btn active">📋 리스트</button>
                        <button id="feedViewBtn" class="view-btn">📱 피드</button>
                    </div>
                    <div class="favorites-filters">
                        <input type="text" id="favoritesSearch" placeholder="팁 검색..." class="search-input">
                        <select id="favoritesAgentFilter" class="custom-select">
                            <option value="">모든 요원</option>
                        </select>
                    </div>
                </div>
                <div id="favoritesList" class="favorites-list"></div>
                <div id="favoritesEmpty" class="empty-favorites" style="display: none;">
                    <div class="empty-icon">⭐</div>
                    <p>즐겨찾기한 팁이 없습니다</p>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
// 현재 요원 이름
const currentAgent = '<?php echo addslashes($agent_name); ?>';

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const board = new ValorantBoard(currentAgent);
    board.init();
});
</script>

<style>
.valorant-board-main {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #ffffff;
}

/* 요원 헤더 */
.agent-header {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, rgba(255, 70, 85, 0.05) 100%);
    border-bottom: 1px solid rgba(255, 70, 85, 0.2);
    padding: 2rem 0;
}

.agent-hero .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.agent-info {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.agent-avatar {
    position: relative;
    flex-shrink: 0;
}

.agent-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid rgba(255, 70, 85, 0.5);
    object-fit: cover;
}

.agent-type-badge {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 2px solid #1a1a2e;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.agent-details {
    flex: 1;
}

.agent-type {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.agent-name {
    font-size: 3rem;
    font-weight: 900;
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    margin-bottom: 1rem;
}

.agent-description {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.agent-stats {
    display: flex;
    gap: 2rem;
}

.stat-item {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #FF4655;
}

.stat-label {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
}

/* 로딩 상태 */
.agent-info-loading, .posts-loading {
    text-align: center;
    padding: 3rem 0;
}

.loading-spinner {
    font-size: 2rem;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 컨트롤 바 */
.controls-bar {
    background: rgba(26, 26, 46, 0.9);
    border-bottom: 1px solid rgba(255, 70, 85, 0.1);
    padding: 1rem 0;
    backdrop-filter: blur(10px);
}

.controls-bar .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.controls-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.sort-controls, .filter-controls {
    display: flex;
    gap: 0.5rem;
}

.custom-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 8px;
    color: #ffffff;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    min-width: 120px;
    cursor: pointer;
}

.custom-select:focus {
    outline: none;
    border-color: #FF4655;
    box-shadow: 0 0 0 2px rgba(255, 70, 85, 0.2);
}

.controls-right {
    display: flex;
    gap: 0.75rem;
}

.write-btn, .favorite-view-btn {
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.favorite-view-btn {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.2), rgba(255, 70, 85, 0.1));
    border: 1px solid rgba(255, 70, 85, 0.5);
}

.write-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 70, 85, 0.3);
}

.favorite-view-btn:hover {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.3), rgba(255, 70, 85, 0.2));
    transform: translateY(-1px);
}

/* 게시글 섹션 */
.posts-section {
    padding: 2rem 0;
}

.posts-section .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 빈 상태 */
.empty-posts {
    text-align: center;
    padding: 4rem 0;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.write-first-btn {
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    border: none;
    color: white;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.3s ease;
}

.write-first-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 70, 85, 0.3);
}

/* 모달 */
.modal {
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
}

.modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    margin: 2% auto;
    padding: 0;
    border-radius: 15px;
    width: 90%;
    max-width: 1000px;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1), rgba(255, 70, 85, 0.05));
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 70, 85, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: #ffffff;
}

.modal-close {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.modal-close:hover {
    opacity: 1;
}

.modal-body {
    padding: 2rem;
    max-height: calc(90vh - 120px);
    overflow-y: auto;
}

/* 즐겨찾기 컨트롤 */
.favorites-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
}

.view-toggle {
    display: flex;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.view-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s;
}

.view-btn.active {
    background: rgba(255, 70, 85, 0.3);
    color: #ffffff;
}

.favorites-filters {
    display: flex;
    gap: 0.5rem;
}

.search-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 8px;
    color: #ffffff;
    padding: 0.5rem 1rem;
    width: 200px;
}

.search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

/* 반응형 */
@media (max-width: 768px) {
    .agent-info {
        flex-direction: column;
        text-align: center;
    }
    
    .agent-name {
        font-size: 2rem;
    }
    
    .agent-stats {
        justify-content: center;
    }
    
    .controls-bar .container {
        flex-direction: column;
        gap: 1rem;
    }
    
    .controls-left, .controls-right {
        width: 100%;
        justify-content: center;
    }
    
    .modal-content {
        width: 95%;
        margin: 5% auto;
    }
    
    .favorites-controls {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>

