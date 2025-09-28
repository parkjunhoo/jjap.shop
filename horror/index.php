<?php
$page_title = '무서운이야기 게시판 - 도시전설, 실화, 괴담 모음 | 짭샵';
$page_description = '소름 끼치는 무서운이야기 모음! 도시전설, 실화 이야기, 이해하면 무서운 이야기, 번역 괴담까지. 밤에 읽으면 더 무서운 공포 스토리 게시판.';
$page_keywords = '무서운이야기, 도시전설, 실화 괴담, 공포 이야기, 무서운 실화, 이해하면 무서운 이야기, 번역 괴담, 공포 게시판, 괴담 모음, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/horror';
$page_css = 'assets/css/horror.css';
$page_js = 'assets/js/horror.js';
?>

<!-- 홈페이지 전용 CSS 추가 -->
<link rel="stylesheet" href="/assets/css/horror-home.css">
<!-- YouTube 썸네일 CSS -->
<link rel="stylesheet" href="/assets/css/horror-youtube.css">

<?php include_once '../includes/section-headers/horror-header.php'; ?>

<div class="horror-home-container">
    <!-- 로딩 상태 -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner">👻</div>
        <p>무서운 이야기를 불러오는 중...</p>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="home-content" id="homeContent" style="display: none;">
        
        <!-- 메인 헤더 & 통계 -->
        <div class="main-header">
            <div class="header-content">
                <div class="title-section">
                    <h1 class="main-title">👻 무서운이야기 게시판</h1>
                    <p class="main-subtitle">소름 끼치는 이야기들을 함께 나누는 공간</p>
                </div>
                <div class="action-section">
                    <a href="/horror/write" class="primary-write-btn">
                        ✍️ 무서운 이야기 쓰기
                    </a>
                </div>
            </div>
        </div>

        


        <!-- 메인 컨텐츠 영역 -->
        <div class="main-content-grid">
            
        <!-- Google AdSense 수평 광고 -->
        <?php include_once '../../includes/ads/horizontal-ad.php'; ?>
        
            <!-- 왼쪽 영역: 최신 게시물 -->
            <div class="left-section">

                <!-- 카테고리 바로가기 -->
                <div class="category-shortcuts">
                    <div class="shortcuts-header">
                        <h3 class="shortcuts-title">📂 카테고리 바로가기</h3>
                    </div>
                    <div class="shortcuts-grid">
                        <a href="/horror/category/urban-legends" class="shortcut-btn urban-legends">
                            <span class="shortcut-icon">🏙️</span>
                            <span class="shortcut-text">도시전설</span>
                        </a>
                        <a href="/horror/category/true-stories" class="shortcut-btn true-stories">
                            <span class="shortcut-icon">📰</span>
                            <span class="shortcut-text">실화이야기</span>
                        </a>
                        <a href="/horror/category/scary-when-understood" class="shortcut-btn scary-when-understood">
                            <span class="shortcut-icon">🧠</span>
                            <span class="shortcut-text">이해하면무서운</span>
                        </a>
                        <a href="/horror/category/translated-horror" class="shortcut-btn translated-tales">
                            <span class="shortcut-icon">🌐</span>
                            <span class="shortcut-text">번역괴담</span>
                        </a>
                    </div>
                </div>

                <!-- 최신 게시물 -->
                <div class="latest-posts-widget">
                    <div class="widget-header">
                        <h2 class="widget-title">🆕 최신 이야기</h2>
                    </div>
                    <div class="posts-list" id="latestPostsList">
                        <!-- JavaScript로 동적 로드 -->
                    </div>
                </div>

            </div>

            <!-- 오른쪽 영역: 인기 게시물 & 활동 -->
            <div class="right-section">
                
                <!-- 인기 게시물 -->
                <div class="popular-posts-widget">
                    <div class="widget-header">
                        <h2 class="widget-title">🔥 인기 이야기</h2>
                    </div>
                    <div class="popular-posts-list" id="popularPostsList">
                        <!-- JavaScript로 동적 로드 -->
                    </div>
                </div>


            </div>
        </div>

        <!-- 카테고리별 최신 게시물 섹션 -->
        <div class="category-latest-section">
            <div class="section-header">
                <h2 class="section-title">📋 카테고리별 최신 이야기</h2>
            </div>
            <div class="category-tabs" id="categoryTabs">
                <!-- JavaScript로 동적 로드 -->
            </div>
            <div class="category-content" id="categoryContent">
                <!-- JavaScript로 동적 로드 -->
            </div>
        </div>

    </div>
</div>

<!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>

<script>
// 홈페이지 데이터 로드 및 렌더링
class HorrorHome {
    constructor() {
        this.data = null;
        this.init();
    }

    async init() {
        await this.loadHomeData();
        this.renderContent();
        this.bindEvents();
    }

    async loadHomeData() {
        try {
            const response = await fetch('/api/horror_v2.php?action=get_home_data');
            const result = await response.json();
            
            if (result.success) {
                this.data = result.data;
            } else {
                throw new Error(result.error || '데이터 로드 실패');
            }
        } catch (error) {
            console.error('홈페이지 데이터 로드 오류:', error);
            this.showError('데이터를 불러오는데 실패했습니다.');
        }
    }

    renderContent() {
        if (!this.data) {
            this.showError('데이터가 없습니다.');
            return;
        }

        // 로딩 숨기고 컨텐츠 표시
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('homeContent').style.display = 'block';

        // 각 섹션 렌더링
        this.renderLatestPosts();
        this.renderPopularPosts();
        this.renderCategoryTabs();
    }



    renderLatestPosts() {
        const latestPostsList = document.getElementById('latestPostsList');
        const latestPosts = this.data.latest_posts;
        
        if (latestPosts.length === 0) {
            latestPostsList.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">📝</div>
                    <p>아직 등록된 이야기가 없습니다.</p>
                    <a href="/horror/write" class="write-first-btn">첫 이야기 쓰기</a>
                </div>
            `;
            return;
        }

        const postsHTML = latestPosts.map(post => `
            <div class="post-item ${post.has_youtube ? 'has-youtube' : ''}">
                ${post.thumbnail ? `
                    <div class="post-thumbnail-small">
                        <img src="${post.thumbnail}" alt="YouTube 썸네일" class="youtube-thumbnail-small" loading="lazy"
                             onerror="this.style.display='none';">
                        <div class="youtube-play-icon">▶️</div>
                    </div>
                ` : ''}
                <div class="post-content-wrapper" onclick="window.location.href='/horror/post/${post.id}'">
                    <div class="post-category">
                        <span class="category-icon">${post.category_icon}</span>
                        <span class="category-name">${post.category_name}</span>
                        ${post.has_youtube ? '<span class="youtube-mini-badge">🎥</span>' : ''}
                    </div>
                    <h3 class="post-title">
                        <a href="/horror/post/${post.id}">${this.escapeHtml(post.title)}</a>
                    </h3>
                    <p class="post-excerpt">${this.escapeHtml(post.excerpt)}</p>
                    <div class="post-meta">
                        <span class="post-author">${this.escapeHtml(post.nickname)}</span>
                        <span class="post-stats">
                            👁️ ${parseInt(post.view_count).toLocaleString()}
                            💬 ${parseInt(post.comment_count)}
                        </span>
                        <span class="post-time">${post.time_ago}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        latestPostsList.innerHTML = postsHTML;
    }

    renderPopularPosts() {
        const popularPostsList = document.getElementById('popularPostsList');
        const popularPosts = this.data.popular_posts;
        
        if (popularPosts.length === 0) {
            popularPostsList.innerHTML = '<p class="no-data">인기 게시물이 없습니다.</p>';
            return;
        }

        const postsHTML = popularPosts.map((post, index) => `
            <div class="popular-post-item ${post.has_youtube ? 'has-youtube' : ''}" onclick="window.location.href='/horror/post/${post.id}'">
                <div class="rank-number">${index + 1}</div>
                ${post.thumbnail ? `
                    <div class="popular-thumbnail">
                        <img src="${post.thumbnail}" alt="YouTube 썸네일" class="youtube-thumbnail-popular" loading="lazy"
                             onerror="this.style.display='none';">
                        <div class="youtube-play-mini">▶️</div>
                    </div>
                ` : ''}
                <div class="post-info">
                    <div class="post-category-small">
                        <span class="category-icon">${post.category_icon}</span>
                        ${post.category_name}
                        ${post.has_youtube ? ' <span class="youtube-micro-badge">🎥</span>' : ''}
                    </div>
                    <h4 class="post-title">
                        <a href="/horror/post/${post.id}">${this.escapeHtml(post.title)}</a>
                    </h4>
                    <div class="post-stats-small">
                        👁️ ${parseInt(post.view_count).toLocaleString()}
                        💬 ${parseInt(post.comment_count)}
                        ⏰ ${post.time_ago}
                    </div>
                </div>
            </div>
        `).join('');
        
        popularPostsList.innerHTML = postsHTML;
    }


    renderCategoryTabs() {
        const categoryTabs = document.getElementById('categoryTabs');
        const categoryContent = document.getElementById('categoryContent');
        const categoryPosts = this.data.category_posts;
        
        if (Object.keys(categoryPosts).length === 0) {
            categoryContent.innerHTML = '<p class="no-data">카테고리별 게시물이 없습니다.</p>';
            return;
        }

        // 탭 생성
        const tabsHTML = Object.values(categoryPosts).map((catData, index) => `
            <button class="category-tab ${index === 0 ? 'active' : ''}" 
                    data-category="${catData.category.slug}">
                <span class="tab-icon">${catData.category.icon}</span>
                <span class="tab-name">${catData.category.name}</span>
                <span class="tab-count">(${catData.posts.length})</span>
            </button>
        `).join('');
        
        categoryTabs.innerHTML = tabsHTML;

        // 첫 번째 카테고리 내용 표시
        const firstCategory = Object.values(categoryPosts)[0];
        this.renderCategoryPosts(firstCategory);
    }

    renderCategoryPosts(categoryData) {
        const categoryContent = document.getElementById('categoryContent');
        const posts = categoryData.posts;
        
        if (posts.length === 0) {
            categoryContent.innerHTML = `
                <div class="no-category-posts">
                    <div class="no-posts-icon">${categoryData.category.icon}</div>
                    <p>${categoryData.category.name} 카테고리에 아직 이야기가 없습니다.</p>
                    <a href="/horror/write?category=${categoryData.category.slug}" class="write-category-btn">
                        첫 이야기 쓰기
                    </a>
                </div>
            `;
            return;
        }

        const postsHTML = posts.map(post => `
            <div class="category-post-item" onclick="window.location.href='/horror/post/${post.id}'">
                <h4 class="post-title">
                    <a href="/horror/post/${post.id}">${this.escapeHtml(post.title)}</a>
                </h4>
                <p class="post-excerpt">${this.escapeHtml(post.excerpt)}</p>
                <div class="post-meta">
                    <span class="post-author">${this.escapeHtml(post.nickname)}</span>
                    <span class="post-stats">👁️ ${parseInt(post.view_count).toLocaleString()}</span>
                    <span class="post-stats">💬 ${parseInt(post.comment_count)}</span>
                    <span class="post-time">${post.time_ago}</span>
                </div>
            </div>
        `).join('');
        
        categoryContent.innerHTML = `
            <div class="category-posts-grid">
                ${postsHTML}
            </div>
            <div class="category-view-more">
                <a href="/horror/category/${categoryData.category.slug}" class="view-more-btn">
                    ${categoryData.category.name} 전체보기 →
                </a>
            </div>
        `;
    }

    bindEvents() {
        // 카테고리 탭 클릭 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-tab')) {
                const tab = e.target.closest('.category-tab');
                const categorySlug = tab.dataset.category;
                
                // 탭 활성 상태 변경
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // 해당 카테고리 내용 표시
                const categoryData = this.data.category_posts[categorySlug];
                if (categoryData) {
                    this.renderCategoryPosts(categoryData);
                }
            }
        });
    }

    showError(message) {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('homeContent').innerHTML = `
            <div class="error-state">
                <div class="error-icon">💀</div>
                <h3>오류가 발생했습니다</h3>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="retry-btn">다시 시도</button>
            </div>
        `;
        document.getElementById('homeContent').style.display = 'block';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new HorrorHome();
});
</script>

</main>
</body>
</html>