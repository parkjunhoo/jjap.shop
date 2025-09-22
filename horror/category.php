<?php
// URL에서 카테고리 추출
$category_slug = $_GET['category'] ?? '';

// 카테고리 정보
$categories = [
    'urban-legends' => [
        'name' => '도시 전설',
        'slug' => 'urban-legends',
        'icon' => '🏙️',
        'description' => '도시에서 전해지는 무서운 전설과 괴담들',
        'color' => '#8B4513'
    ],
    'true-stories' => [
        'name' => '실화 이야기',
        'slug' => 'true-stories',
        'icon' => '😨',
        'description' => '실제로 겪었거나 목격한 무서운 경험담',
        'color' => '#DC143C'
    ],
    'scary-when-understood' => [
        'name' => '이해하면 무서운 이야기',
        'slug' => 'scary-when-understood',
        'icon' => '🤔',
        'description' => '처음엔 평범해 보이지만 이해하면 소름 끼치는 이야기',
        'color' => '#4B0082'
    ],
    'translated-horror' => [
        'name' => '번역 괴담',
        'slug' => 'translated-horror',
        'icon' => '🌏',
        'description' => '해외의 유명한 무서운 이야기와 크리피파스타',
        'color' => '#006400'
    ]
];

// 유효한 카테고리인지 확인
if (!isset($categories[$category_slug])) {
    header('HTTP/1.0 404 Not Found');
    include('404.php');
    exit;
}

$current_category = $categories[$category_slug];
$current_category['slug'] = $category_slug; // slug 추가

$page_title = $current_category['name'] . ' - 무서운이야기 게시판 - 짭샵';
$page_description = $current_category['description'] . '을 공유하는 무서운 이야기 게시판입니다.';
$page_keywords = '무서운이야기, 괴담, ' . $current_category['name'] . ', 게시판, 짭샵';
$page_css = 'assets/css/horror.css';
$page_js = 'assets/js/horror.js';
?>

<?php include_once '../includes/section-headers/horror-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="horror-category-container">
    <!-- 카테고리 헤더 -->
    <div class="category-hero" style="--category-color: <?php echo $current_category['color']; ?>">
        <div class="category-hero-content">
            <div class="category-icon"><?php echo $current_category['icon']; ?></div>
            <h1 class="category-title"><?php echo $current_category['name']; ?></h1>
            <p class="category-description"><?php echo $current_category['description']; ?></p>
        </div>
    </div>

    <!-- 필터 및 정렬 -->
    <div class="category-controls">
        <div class="controls-left">
            <div class="view-mode-toggle">
                <button class="view-mode-btn active" data-mode="list">
                    <i class="fas fa-list"></i>
                </button>
                <button class="view-mode-btn" data-mode="grid">
                    <i class="fas fa-th"></i>
                </button>
            </div>
            
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">전체</button>
                <button class="filter-btn" data-filter="featured">추천</button>
                <button class="filter-btn" data-filter="popular">인기</button>
            </div>
        </div>

        <div class="controls-right">
            <select id="sortSelect" class="sort-select">
                <option value="latest">최신순</option>
                <option value="popular">인기순</option>
                <option value="views">조회순</option>
                <option value="comments">댓글순</option>
                <option value="rating">무서운순</option>
            </select>

            <a href="/horror/write?category=<?php echo $category_slug; ?>" class="write-story-btn">
                ✍️ 이야기 쓰기
            </a>
        </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="posts-list" id="postsList">
        <div class="loading-posts">
            <div class="loading-spinner">👻</div>
            <p>무서운 이야기들을 불러오는 중...</p>
        </div>
    </div>

    <!-- 빈 목록 상태 -->
    <div class="empty-posts" id="emptyPosts" style="display: none;">
        <div class="empty-content">
            <div class="empty-icon">😢</div>
            <h3>아직 이야기가 없어요</h3>
            <p>이 카테고리의 첫 번째 무서운 이야기를 작성해보세요!</p>
            <a href="/horror/write?category=<?php echo $current_category['slug']; ?>" class="first-post-btn">
                👻 첫 이야기 쓰기
            </a>
        </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination" id="pagination" style="display: none;">
        <!-- JavaScript로 동적 생성 -->
    </div>

</div>

<!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>

<script>
// 현재 카테고리 정보
const currentCategory = '<?php echo $current_category['slug']; ?>';
let currentPage = 1;
let currentSort = 'latest';
let currentFilter = 'all';
let isLoading = false;

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeCategoryPage();
});

function initializeCategoryPage() {
    // 보기 모드 토글
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const mode = this.dataset.mode;
            toggleViewMode(mode);
        });
    });

    // 정렬 옵션 변경
    document.getElementById('sortSelect').addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 1;
        loadPosts();
    });

    // 필터 버튼들
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            currentPage = 1;
            loadPosts();
        });
    });

    // 초기 게시글 로드
    loadPosts();
}

function toggleViewMode(mode) {
    const postsList = document.querySelector('.posts-list');
    
    if (mode === 'grid') {
        postsList.classList.add('grid-view');
    } else {
        postsList.classList.remove('grid-view');
    }
}

async function loadPosts() {
    if (isLoading) return;
    
    isLoading = true;
    const postsList = document.getElementById('postsList');
    const emptyPosts = document.getElementById('emptyPosts');
    const pagination = document.getElementById('pagination');
    
    // 로딩 상태 표시
    postsList.innerHTML = `
        <div class="loading-posts">
            <div class="loading-spinner">👻</div>
            <p>무서운 이야기들을 불러오는 중...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`/api/horror_v2.php?action=get_posts&category=${currentCategory}&page=${currentPage}&sort=${currentSort}&limit=10`);
        const data = await response.json();
        
        if (data.success) {
            if (data.data.posts && data.data.posts.length > 0) {
                displayPosts(data.data.posts);
                displayPagination(data.data.pagination);
                emptyPosts.style.display = 'none';
                pagination.style.display = 'block';
            } else {
                postsList.innerHTML = '';
                emptyPosts.style.display = 'block';
                pagination.style.display = 'none';
            }
        } else {
            showError(data.error || '게시글을 불러올 수 없습니다.');
        }
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        showError('네트워크 오류가 발생했습니다.');
    }
    
    isLoading = false;
}

function displayPosts(posts) {
    const postsList = document.getElementById('postsList');
    
    const postsHTML = posts.map(post => `
        <div class="post-card ${post.is_featured ? 'featured' : ''} ${post.is_pinned ? 'pinned' : ''}">
            ${(post.is_featured || post.is_pinned) ? `
                <div class="post-badges">
                    ${post.is_featured ? '<span class="badge featured">⭐ 추천</span>' : ''}
                    ${post.is_pinned ? '<span class="badge pinned">📌 공지</span>' : ''}
                </div>
            ` : ''}
            
            ${post.thumbnail ? `
                <div class="post-thumbnail">
                    <img src="${post.thumbnail}" alt="YouTube 썸네일" class="youtube-thumbnail" loading="lazy" 
                         onerror="this.style.display='none';">
                    <div class="youtube-indicator">
                        <span class="youtube-icon">▶️</span>
                        <span class="youtube-text">동영상 포함</span>
                    </div>
                </div>
            ` : ''}
            
            <div class="post-content" onclick="window.location.href='/horror/post/${post.id}'">
                <div class="post-category">${post.category_name}</div>
                <h3 class="post-title">
                    <a href="/horror/post/${post.id}">${escapeHtml(post.title)}</a>
                </h3>
                <p class="post-excerpt">${escapeHtml(post.excerpt)}</p>
                <div class="post-meta">
                    <div class="post-stats">
                        <span class="views">👀 ${post.view_count.toLocaleString()}</span>
                        <span class="comments">💬 ${post.comment_count}</span>
                        ${post.has_youtube ? '<span class="youtube-badge">🎥 동영상</span>' : ''}
                    </div>
                    <div class="post-info">
                        <span class="author">${escapeHtml(post.nickname)}</span>
                        <span class="time">${post.time_ago}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    postsList.innerHTML = postsHTML;
}

function displayPagination(pagination) {
    const paginationDiv = document.getElementById('pagination');
    
    if (pagination.total_pages <= 1) {
        paginationDiv.style.display = 'none';
        return;
    }
    
    let paginationHTML = '';
    
    // 이전 버튼
    paginationHTML += `
        <button class="page-btn prev" ${pagination.current_page <= 1 ? 'disabled' : ''} 
                onclick="changePage(${pagination.current_page - 1})">이전</button>
    `;
    
    // 페이지 번호들
    paginationHTML += '<div class="page-numbers">';
    
    const startPage = Math.max(1, pagination.current_page - 2);
    const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="page-dots">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="page-btn ${i === pagination.current_page ? 'current' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    if (endPage < pagination.total_pages) {
        if (endPage < pagination.total_pages - 1) {
            paginationHTML += '<span class="page-dots">...</span>';
        }
        paginationHTML += `<button class="page-btn" onclick="changePage(${pagination.total_pages})">${pagination.total_pages}</button>`;
    }
    
    paginationHTML += '</div>';
    
    // 다음 버튼
    paginationHTML += `
        <button class="page-btn next" ${pagination.current_page >= pagination.total_pages ? 'disabled' : ''} 
                onclick="changePage(${pagination.current_page + 1})">다음</button>
    `;
    
    paginationDiv.innerHTML = paginationHTML;
    paginationDiv.style.display = 'flex';
}

function changePage(page) {
    currentPage = page;
    loadPosts();
    
    // 페이지 상단으로 스크롤
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showError(message) {
    const postsList = document.getElementById('postsList');
    postsList.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😢</div>
            <h3>오류가 발생했습니다</h3>
            <p>${message}</p>
            <button onclick="loadPosts()" class="retry-btn">다시 시도</button>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>

<style>
.horror-category-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a2e, #16213e, #0f0f23);
    min-height: 100vh;
    color: #e0e6ed;
}

.category-hero {
    background: linear-gradient(135deg, var(--category-color), rgba(0,0,0,0.8));
    border-radius: 15px;
    padding: 25px;
    text-align: center;
    margin-bottom: 25px;
    border: 2px solid rgba(139, 0, 0, 0.3);
}

.category-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
}

.category-title {
    font-size: 2.5rem;
    color: #ff6b6b;
    margin-bottom: 10px;
    text-shadow: 0 0 20px rgba(220, 20, 60, 0.8);
}

.category-description {
    font-size: 1.1rem;
    color: #ccc;
    margin: 0;
}

.category-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding: 20px;
    background: linear-gradient(135deg, #2a2a4a, #1f1f3a);
    border-radius: 15px;
    border: 2px solid rgba(139, 0, 0, 0.2);
}

.controls-left, .controls-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.view-mode-toggle {
    display: flex;
    background: rgba(139, 0, 0, 0.2);
    border-radius: 8px;
    overflow: hidden;
}

.view-mode-btn {
    padding: 10px 15px;
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-mode-btn.active {
    background: rgba(139, 0, 0, 0.6);
    color: white;
}

.filter-buttons {
    display: flex;
    gap: 10px;
}

.filter-btn {
    padding: 8px 16px;
    background: rgba(42, 42, 74, 0.5);
    border: 2px solid rgba(139, 0, 0, 0.2);
    border-radius: 8px;
    color: #ccc;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-btn.active, .filter-btn:hover {
    background: rgba(139, 0, 0, 0.6);
    border-color: rgba(139, 0, 0, 0.5);
    color: white;
}

.sort-select {
    padding: 10px 15px;
    background: rgba(42, 42, 74, 0.8);
    border: 2px solid rgba(139, 0, 0, 0.2);
    border-radius: 8px;
    color: #e0e6ed;
    cursor: pointer;
    outline: none;
}

.write-story-btn {
    padding: 12px 20px;
    background: linear-gradient(135deg, #8b0000, #dc143c);
    border: none;
    border-radius: 10px;
    color: white;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.write-story-btn:hover {
    background: linear-gradient(135deg, #dc143c, #ff4444);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 0, 0, 0.4);
    color: white;
}

.posts-list {
    margin-bottom: 30px;
}

.loading-posts, .empty-content, .error-message {
    text-align: center;
    padding: 60px 20px;
    background: linear-gradient(135deg, #2a2a4a, #1f1f3a);
    border-radius: 15px;
    border: 2px solid rgba(139, 0, 0, 0.2);
}

.loading-spinner, .empty-icon, .error-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    animation: float 2s ease-in-out infinite;
}

.first-post-btn, .retry-btn {
    margin-top: 20px;
    padding: 15px 30px;
    background: linear-gradient(135deg, #8b0000, #dc143c);
    color: white;
    border: none;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.first-post-btn:hover, .retry-btn:hover {
    background: linear-gradient(135deg, #dc143c, #ff4444);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 0, 0, 0.4);
    color: white;
}

.post-card {
    background: linear-gradient(135deg, #2a2a4a, #1f1f3a);
    border: 2px solid rgba(139, 0, 0, 0.2);
    border-radius: 15px;
    padding: 0;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.post-content {
    padding: 25px;
}

.post-card:hover {
    transform: translateY(-3px);
    border-color: rgba(220, 20, 60, 0.5);
    box-shadow: 0 12px 30px rgba(139, 0, 0, 0.3);
}

.post-card.featured {
    border-color: rgba(255, 215, 0, 0.5);
    background: linear-gradient(135deg, #3d3d2a, #2d2d1f);
}

.post-card.pinned {
    border-color: rgba(102, 126, 234, 0.5);
    background: linear-gradient(135deg, #2a2d3d, #1f222d);
}

/* YouTube 썸네일 스타일 */
.post-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.youtube-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.post-card:hover .youtube-thumbnail {
    transform: scale(1.05);
}

.youtube-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 0, 0, 0.9);
    color: white;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.youtube-icon {
    font-size: 0.8rem;
}

.youtube-badge {
    background: linear-gradient(135deg, #ff0000, #cc0000);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(255, 0, 0, 0.3);
}

.post-badges {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 10px;
    z-index: 2;
}

.badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
}

.badge.featured {
    background: rgba(255, 215, 0, 0.8);
    color: #333;
}

.badge.pinned {
    background: rgba(102, 126, 234, 0.8);
    color: white;
}

.post-category {
    color: #ff6b6b;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 10px;
}

.post-title {
    margin: 0 0 15px 0;
}

.post-title a {
    color: #e0e6ed;
    text-decoration: none;
    font-size: 1.4rem;
    font-weight: 700;
    transition: color 0.3s ease;
}

.post-title a:hover {
    color: #ff6b6b;
}

.post-excerpt {
    color: #ccc;
    line-height: 1.6;
    margin-bottom: 20px;
    font-size: 1rem;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid rgba(139, 0, 0, 0.2);
}

.post-stats {
    display: flex;
    gap: 15px;
}

.post-stats span {
    color: #999;
    font-size: 0.9rem;
}

.post-info {
    display: flex;
    gap: 10px;
    color: #999;
    font-size: 0.9rem;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 40px;
}

.page-btn {
    padding: 10px 15px;
    background: rgba(42, 42, 74, 0.8);
    border: 2px solid rgba(139, 0, 0, 0.2);
    border-radius: 8px;
    color: #e0e6ed;
    cursor: pointer;
    transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
    background: rgba(139, 0, 0, 0.6);
    border-color: rgba(139, 0, 0, 0.5);
}

.page-btn.current {
    background: linear-gradient(135deg, #8b0000, #dc143c);
    border-color: rgba(220, 20, 60, 0.5);
    color: white;
}

.page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    align-items: center;
    gap: 5px;
}

.page-dots {
    color: #999;
    margin: 0 5px;
}

/* 반응형 */
@media (max-width: 768px) {
    .horror-category-container {
        padding: 15px;
    }
    
    .category-controls {
        flex-direction: column;
        gap: 15px;
        align-items: stretch;
    }
    
    .controls-left, .controls-right {
        justify-content: center;
    }
    
    .post-meta {
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }
    
    .pagination {
        flex-wrap: wrap;
        gap: 5px;
    }
}
</style>

</main>
</body>
</html>