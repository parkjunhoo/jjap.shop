<?php
// 발로란트 전체 팁 게시판
$page_title = '발로란트 팁 게시판 - 모든 요원 공략 모음 - 게임 공략 - 짭샵';
$page_description = '발로란트 모든 요원의 팁과 공략을 한 곳에서! 타격대, 척후대, 감시자, 연막까지 25개 요원의 전략과 노하우를 확인해보세요.';
$page_keywords = '발로란트, 발로란트 팁, 발로란트 게시판, 발로란트 공략, 요원 팁, 발로란트 전략, 게임 공략, 짭샵';
$canonical_url = 'https://jjap.shop/game/valorant/board';

// 페이지별 CSS, JS
$page_css = 'assets/css/valorant-board.css';
$page_js = 'assets/js/valorant-board.js';
?>

<?php include_once '../../includes/section-headers/game-header.php'; ?>

<main class="valorant-board-main">
    <!-- 게시판 헤더 -->
    <div class="board-header">
        <div class="board-hero">
            <div class="container">
                <div class="board-title-section">
                    <div class="title-content">
                        <h1 class="board-title">
                            <img src="../../assets/images/valorant/valorant_logo.svg" alt="VALORANT" class="title-logo">
                            발로란트 팁 게시판
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- AdSense 광고 -->
    <?php include_once '../../includes/ads/horizontal-ad.php'; ?>

    <!-- 컨트롤 바 -->
    <div class="controls-bar">
        <div class="container">
            <div class="controls-left">
                <div class="filter-controls">
                    <!-- 요원 필터 -->
                    <div class="agent-filter-container">
                        <button id="agentFilterBtn" class="agent-filter-btn">
                            <i class="filter-icon">🎯</i>
                            <span class="filter-text">모든 요원</span>
                            <i class="arrow-icon">▼</i>
                        </button>
                        <input type="hidden" id="selectedAgents" value="">
                    </div>
                </div>
                <div class="sort-controls">
                    <div class="sort-toggle">
                        <button id="latestBtn" class="sort-btn active" data-sort="latest">
                            <i class="sort-icon">⚡</i>
                            <span>최신순</span>
                        </button>
                        <button id="popularBtn" class="sort-btn" data-sort="popular">
                            <i class="sort-icon">🔥</i>
                            <span>인기순</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="controls-right">
                <button id="writeBtn" class="write-btn">
                    <i class="icon">✏️</i>
                    팁 작성하기
                </button>
                <button id="favoriteViewBtn" class="favorite-view-btn">
                    <i class="icon">⭐</i>
                    즐겨찾기
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
                <h3>검색 조건에 맞는 팁이 없습니다</h3>
                <p>다른 조건으로 검색해보시거나 첫 번째 팁을 작성해보세요!</p>
                <button class="write-first-btn" onclick="location.href='/game/valorant/write'">
                    팁 작성하기
                </button>
            </div>

            <!-- 페이지네이션 -->
            <div id="pagination" class="pagination" style="display: none;"></div>
        </div>
    </div>

    <!-- 요원 필터 모달 -->
    <div id="agentFilterModal" class="agent-filter-modal">
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h3 class="modal-title">요원 필터 선택</h3>
                <button class="modal-close-btn" id="closeAgentFilterModal">✕</button>
            </div>
            
            <div class="modal-body">
                <!-- 로딩 상태 -->
                <div id="agentFilterLoading" class="modal-loading">
                    <div class="loading-spinner">⚡</div>
                    <p>요원 목록을 불러오는 중...</p>
                </div>
                
                
                <!-- 요원 목록 -->
                <div id="agentFilterGrid" class="agent-filter-grid" style="display: none;"></div>
                
                <!-- 에러 상태 -->
                <div id="agentFilterError" class="modal-error" style="display: none;">
                    <div class="error-icon">❌</div>
                    <p>요원 목록을 불러올 수 없습니다.</p>
                </div>
            </div>
            
            <div class="modal-footer">
                <div class="selected-count">
                    <span id="selectedAgentCount">0</span>개 요원 선택됨
                </div>
                <div class="modal-actions">
                    <button id="clearAgentSelection" class="btn-secondary">전체 해제</button>
                    <button id="applyAgentFilter" class="btn-primary">적용</button>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
// 페이지 로드 시 실행 - 안전한 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 발로란트 게시판 초기화 시작...');
    
    // ValorantBoard 클래스가 로드되었는지 확인
    if (typeof ValorantBoard !== 'undefined') {
        try {
            // 전체 게시판 모드로 ValorantBoard 초기화
            window.board = new ValorantBoard(''); // 전역 변수로 설정
            
            if (board && typeof board.init === 'function') {
                board.init();
                console.log('✅ 발로란트 게시판 초기화 완료!');
            } else {
                console.error('❌ ValorantBoard init 메서드를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('❌ 발로란트 게시판 초기화 오류:', error);
            // 기본 기능이라도 작동하도록 대체 처리
            initBasicFeatures();
        }
    } else {
        console.error('❌ ValorantBoard 클래스를 찾을 수 없습니다. JS 파일이 제대로 로드되었는지 확인하세요.');
        // 기본 기능이라도 작동하도록 대체 처리
        setTimeout(() => {
            if (typeof ValorantBoard !== 'undefined') {
                window.board = new ValorantBoard('');
                board.init();
                console.log('✅ 발로란트 게시판 지연 초기화 완료!');
            } else {
                initBasicFeatures();
            }
        }, 1000); // 1초 후 재시도
    }
});

// 기본 기능 대체 초기화
function initBasicFeatures() {
    console.log('🔄 기본 기능 초기화 중...');
    
    // 기본적인 게시글 목록 로딩 시도
    loadBasicPosts();
}

async function loadBasicPosts() {
    try {
        const response = await fetch('/api/valorant.php?action=get_posts&page=1&sort=latest&limit=10');
        const data = await response.json();
        
        if (data.success && data.data.posts) {
            console.log('📝 기본 게시글 목록 로드 성공:', data.data.posts.length + '개');
            // 기본적인 게시글 렌더링
            renderBasicPosts(data.data.posts);
        }
    } catch (error) {
        console.error('❌ 기본 게시글 로드 실패:', error);
    }
}

function renderBasicPosts(posts) {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    if (posts.length === 0) {
        postsList.innerHTML = '<div class="no-posts">게시글이 없습니다.</div>';
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="tip-card" onclick="location.href='/game/valorant/post/${post.id}'">
            <div class="tip-header">
                <div class="agent-info">
                    <img src="/assets/images/valorant/charactor/${post.agent_name}.webp" 
                         alt="${post.agent_name}" class="agent-avatar"
                         onerror="this.src='/assets/images/valorant/default-agent.webp'">
                    <span class="agent-name">${post.agent_name}</span>
                </div>
                <div class="tip-meta">
                    <span class="tip-difficulty">${post.tip_difficulty}</span>
                </div>
            </div>
            <h3 class="tip-title">${post.title}</h3>
            <div class="tip-stats">
                <span>👀 ${post.view_count}</span>
                <span>💬 ${post.comment_count}</span>
                <span>⏰ ${post.time_ago}</span>
            </div>
        </div>
    `).join('');
}
</script>

<style>
.valorant-board-main {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #ffffff;
}

/* 게시판 헤더 */
.board-header {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1) 0%, rgba(255, 70, 85, 0.05) 100%);
    border-bottom: 1px solid rgba(255, 70, 85, 0.2);
    padding: 1.5rem 0;
}

.board-hero .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.board-title-section {
    text-align: center;
}

.board-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.title-logo {
    width: 40px;
    height: 40px;
    filter: none;
}


/* 컨트롤 바 */
.controls-bar {
    background: rgba(26, 26, 46, 0.9);
    border-bottom: 1px solid rgba(255, 70, 85, 0.1);
    padding: 1.5rem 0;
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
    flex-wrap: wrap;
}

.controls-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-controls, .sort-controls {
    display: flex;
    gap: 0.5rem;
}

.custom-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 8px;
    color: #ffffff;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    min-width: 140px;
    cursor: pointer;
    transition: all 0.2s ease;
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

/* 로딩 및 빈 상태 */
.posts-loading, .empty-posts {
    text-align: center;
    padding: 4rem 0;
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

/* 반응형 */
@media (max-width: 768px) {
    .board-title {
        font-size: 2rem;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .controls-bar .container {
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .controls-left {
        width: 100%;
        justify-content: center;
    }
    
    .filter-controls, .sort-controls {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .custom-select {
        min-width: 120px;
    }
}

@media (max-width: 480px) {
    .board-title {
        font-size: 1.8rem;
    }
    
    .filter-controls, .sort-controls {
        flex-direction: column;
        width: 100%;
    }
    
    .custom-select {
        width: 100%;
    }
    
    .controls-right {
        width: 100%;
        justify-content: center;
    }
}

/* 요원 필터 버튼 스타일 */
.agent-filter-container {
    position: relative;
}

.agent-filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 10px;
    color: #ffffff;
    padding: 0.8rem 1.2rem;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 150px;
    justify-content: space-between;
}

.agent-filter-btn:hover {
    background: rgba(255, 70, 85, 0.15);
    border-color: rgba(255, 70, 85, 0.3);
    transform: translateY(-1px);
}

.agent-filter-btn.active {
    background: rgba(255, 70, 85, 0.2);
    border-color: rgba(255, 70, 85, 0.4);
}

.filter-icon {
    font-size: 1.1rem;
}

.arrow-icon {
    font-size: 0.8rem;
    transition: transform 0.3s ease;
}

.agent-filter-btn.active .arrow-icon {
    transform: rotate(180deg);
}

/* 요원 필터 모달 스타일 */
.agent-filter-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10000;
    display: none;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.agent-filter-modal.active {
    display: block;
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
}

.modal-container {
    position: relative;
    width: 90%;
    max-width: 800px;
    max-height: 80vh;
    background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    margin: 5vh auto;
    border: 1px solid rgba(255, 70, 85, 0.2);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 70, 85, 0.05);
}

.modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
}

.modal-close-btn {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.modal-close-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
}

.modal-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.modal-loading {
    text-align: center;
    padding: 2rem;
}

.modal-loading .loading-spinner {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
}

/* 역할별 섹션 스타일 */
.agent-role-section {
    margin-bottom: 2rem;
}

.agent-role-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.agent-role-title .role-icon {
    font-size: 1.2rem;
}

.agent-role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
}

.agent-filter-grid {
    display: block;
}

.agent-filter-card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.agent-filter-card:hover {
    background: rgba(255, 70, 85, 0.1);
    border-color: rgba(255, 70, 85, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(255, 70, 85, 0.2);
}

.agent-filter-card.selected {
    background: rgba(255, 70, 85, 0.2);
    border-color: rgba(255, 70, 85, 0.6);
    transform: translateY(-2px);
}

.agent-filter-card.selected::after {
    content: '✓';
    position: absolute;
    top: 8px;
    right: 8px;
    width: 20px;
    height: 20px;
    background: #FF4655;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: white;
    font-weight: bold;
}

.agent-filter-image {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    margin: 0 auto 0.8rem;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.agent-filter-card.selected .agent-filter-image {
    border-color: rgba(255, 70, 85, 0.6);
}

.agent-filter-name {
    color: #ffffff;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
}

.modal-error {
    text-align: center;
    padding: 2rem;
    color: #ffffff;
}

.error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.modal-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
}

.selected-count {
    color: #ffffff;
    font-weight: 600;
}

.modal-actions {
    display: flex;
    gap: 1rem;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.btn-primary {
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    border: none;
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(255, 70, 85, 0.4);
}

/* 반응형 모달 */
@media (max-width: 768px) {
    .modal-container {
        width: 95%;
        max-height: 90vh;
        margin: 2.5vh auto;
    }
    
    .modal-header, .modal-body, .modal-footer {
        padding: 1rem 1.5rem;
    }
    
    .agent-role-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.8rem;
    }
    
    .agent-filter-card {
        padding: 0.8rem;
    }
    
    .agent-filter-image {
        width: 50px;
        height: 50px;
    }
    
    .modal-footer {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}

/* 정렬 토글 버튼 스타일 */
.sort-toggle {
    display: flex;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
}

.sort-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
}

.sort-btn:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
}

.sort-btn.active {
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(255, 70, 85, 0.3);
    transform: translateY(-1px);
}

.sort-icon {
    font-size: 1.1rem;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
</style>
