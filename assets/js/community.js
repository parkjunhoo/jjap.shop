// =====================================================
// 커뮤니티 JavaScript - 게시글 CRUD 및 인터랙션
// =====================================================

class CommunityManager {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.currentSort = 'latest';
        this.postsPerPage = 10;
        
        this.init();
    }
    
    init() {
        this.loadCategories();
        this.initSearch();
        this.initSorting();
        this.loadPosts();
        this.initEventListeners();
    }
    
    // 이벤트 리스너 초기화
    initEventListeners() {
        // 카테고리 버튼 클릭 이벤트
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryClick(e.target);
            });
        });
        
        // 검색 버튼 클릭 이벤트
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }
        
        // 검색 입력 엔터 이벤트
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
        
        // 정렬 변경 이벤트
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.loadPosts();
            });
        }
    }
    
    // 카테고리 로드 및 렌더링
    async loadCategories() {
        try {
            const nav = document.getElementById('categoryNav');
            if (!nav) return;

            // 기본 '전체' 버튼
            nav.innerHTML = '';
            const allBtn = document.createElement('button');
            allBtn.className = 'category-btn active';
            allBtn.dataset.category = 'all';
            allBtn.textContent = '전체';
            allBtn.addEventListener('click', (e) => this.handleCategoryClick(e.target));
            nav.appendChild(allBtn);

            // API로 카테고리 불러오기
            const res = await fetch('/api/community?action=categories');
            if (!res.ok) throw new Error('카테고리 로드 실패');
            const json = await res.json();
            const categories = (json.data && json.data.categories) || json.categories || [];

            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'category-btn';
                btn.dataset.category = cat.slug;
                btn.textContent = cat.name;
                btn.addEventListener('click', (e) => this.handleCategoryClick(e.target));
                nav.appendChild(btn);
            });
        } catch (err) {
            console.error('카테고리 로드 오류:', err);
        }
    }
    
    // 카테고리 클릭 처리
    handleCategoryClick(target) {
        // 카테고리 버튼이 아닌 경우 부모 요소 찾기
        let categoryBtn = target;
        while (categoryBtn && !categoryBtn.classList.contains('category-btn')) {
            categoryBtn = categoryBtn.parentElement;
        }
        
        if (categoryBtn) {
            // 기존 활성 버튼 비활성화
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 클릭된 버튼 활성화
            categoryBtn.classList.add('active');
            
            this.currentCategory = categoryBtn.dataset.category;
            this.currentPage = 1;
            this.loadPosts();
        }
    }
    
    // 검색 초기화
    initSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = (e.target.value || '').trim();
            });
        }
    }
    
    // 검색 실행
    performSearch() {
        const input = document.getElementById('search-input');
        if (input) this.currentSearch = (input.value || '').trim();
        this.currentPage = 1;
        this.loadPosts();
    }
    
    // 정렬 초기화
    initSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.loadPosts();
            });
        }
    }
    
    // 게시글 로드
    async loadPosts() {
        try {
            this.showLoading();
            
            // API 호출 (실제 구현 시에는 실제 API 엔드포인트 사용)
            const posts = await this.fetchPosts();
            
            if (posts && posts.length > 0) {
                this.displayPosts(posts);
                this.hideLoading();
            } else {
                this.displayNoPosts();
                this.hideLoading();
            }
            
        } catch (error) {
            console.error('게시글 로드 오류:', error);
            this.displayError('게시글을 불러오는 중 오류가 발생했습니다.');
            this.hideLoading();
        }
    }
    
    // 게시글 데이터 가져오기 (실제 API 호출)
    async fetchPosts() {
        try {
            // 실제 API 호출
            const response = await fetch(`/api/community?action=posts&page=${this.currentPage}&category=${this.currentCategory}&search=${this.currentSearch}&sort=${this.currentSort}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const json = await response.json();
            const posts = (json.data && json.data.posts) || json.posts || [];
            return posts;
            
        } catch (error) {
            console.error('게시글 데이터 가져오기 오류:', error);
            // 에러 발생 시 빈 배열 반환
            return [];
        }
    }
    
    // 게시글 표시
    displayPosts(posts) {
        const postsList = document.getElementById('jobPostsList') || document.querySelector('.posts-container');
        if (!postsList) return;
        
        postsList.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            postsList.appendChild(postElement);
        });
        
        // 페이지네이션 생성 (실제 데이터 기반)
        if (posts.length > 0) {
            this.createPagination(Math.ceil(posts.length / this.postsPerPage));
        } else {
            this.createPagination(0);
        }
    }
    
    // 게시글 요소 생성
    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-item';
        const thumbSrc = post.thumbnail_image || this.extractFirstImageSrc(post.content);
        const excerpt = this.buildExcerpt(post);
        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-title-row">
                    <span class="post-category-badge">${post.category_name || '일반'}</span>
                    <a href="/community/${post.id}" class="post-title">${post.title}</a>
                </div>
                <div class="post-meta">
                    <span class="meta-item">👤 ${post.nickname}</span>
                    <span class="meta-item">🕒 ${this.formatDate(post.created_at)}</span>
                </div>
            </div>
            <div class="post-snippet" style="display:flex; gap:12px; align-items:flex-start;">
                ${thumbSrc ? `<img src="${thumbSrc}" alt="thumbnail" style="width:80px;height:80px;object-fit:cover;border-radius:10px;flex:0 0 auto;">` : ''}
                <div class="post-excerpt" style="flex:1;">${excerpt}</div>
            </div>
            <div class="post-footer">
                <div class="post-stats">
                    <span class="meta-item">👁️ ${this.formatNumber(post.view_count)}</span>
                    <span class="meta-item">💬 ${this.formatNumber(post.comment_count)}</span>
                </div>
            </div>
        `;
        
        return postDiv;
    }
    
    // 게시글 없음 표시
    displayNoPosts() {
        const postsList = document.getElementById('jobPostsList') || document.querySelector('.posts-container');
        if (!postsList) return;
        
        postsList.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-inbox fa-3x"></i>
                <h3>게시글이 없습니다</h3>
                <p>아직 등록된 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
                <a href="/write-post" class="btn btn-primary">게시글 작성하기</a>
            </div>
        `;
    }
    
    // 에러 표시
    displayError(message) {
        const postsList = document.getElementById('jobPostsList') || document.querySelector('.posts-container');
        if (!postsList) return;
        
        postsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
                <h3>데이터를 불러올 수 없습니다</h3>
                <p>${message}</p>
                <div style="margin-top: 20px;">
                    <button onclick="location.reload()" class="btn btn-secondary">새로고침</button>
                    <a href="/write-post" class="btn btn-primary" style="margin-left: 10px;">게시글 작성하기</a>
                </div>
            </div>
        `;
    }
    
    // 로딩 표시
    showLoading() {
        const postsList = document.getElementById('jobPostsList') || document.querySelector('.posts-container');
        if (postsList) {
            postsList.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin fa-3x"></i>
                    <h3>게시글을 불러오는 중...</h3>
                    <p>잠시만 기다려주세요</p>
                </div>
            `;
        }
    }
    
    // 로딩 숨김
    hideLoading() {
        // 로딩 상태는 displayPosts에서 자동으로 처리됨
    }
    
    // 페이지네이션 생성
    createPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        pagination.innerHTML = '';
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        
        // 이전 페이지 버튼
        if (this.currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.addEventListener('click', () => {
                this.currentPage--;
                this.loadPosts();
            });
            pagination.appendChild(prevBtn);
        }
        
        // 페이지 번호 버튼
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === this.currentPage ? 'active' : '';
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.loadPosts();
            });
            pagination.appendChild(pageBtn);
        }
        
        // 다음 페이지 버튼
        if (this.currentPage < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.addEventListener('click', () => {
                this.currentPage++;
                this.loadPosts();
            });
            pagination.appendChild(nextBtn);
        }
    }
    
    // 날짜 포맷팅
    formatDate(dateString) {
        const d = new Date(dateString);
        const now = new Date();
        const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
        if (sameDay) {
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        }
        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yy}.${mm}.${dd}`;
    }
    
    // 숫자 포맷팅
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // ===== Helper: Excerpt 40자, 초과 시에만 '...'
    buildExcerpt(post) {
        // DB의 excerpt는 항상 '...'가 붙어있을 수 있어 사용하지 않고 본문에서 생성
        const base = this.stripHtml(post.content || '');
        const noLinks = this.removeUrls(base);
        const text = noLinks.replace(/\s+/g, ' ').trim();
        const limit = 40;
        if (text.length <= limit) return this.escape(text);
        return this.escape(text.slice(0, limit)) + '...';
    }

    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html || '';
        return div.textContent || div.innerText || '';
    }

    removeUrls(text) {
        if (!text) return '';
        return text.replace(/https?:\/\/\S+|www\.\S+/gi, '');
    }

    extractFirstImageSrc(html) {
        if (!html) return '';
        const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
        return m ? m[1] : '';
    }

    escape(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CommunityManager();
});

// 전역 함수들 (기존 코드와의 호환성을 위해)
function initCategoryFilter() {
    // 이미 CommunityManager에서 처리됨
}

function filterPostsByCategory() {
    // 이미 CommunityManager에서 처리됨
}

function initSearch() {
    // 이미 CommunityManager에서 처리됨
}

function performSearch() {
    // 이미 CommunityManager에서 처리됨
}

function searchPosts() {
    // 이미 CommunityManager에서 처리됨
}

function displaySearchResults() {
    // 이미 CommunityManager에서 처리됨
}

function initSorting() {
    // 이미 CommunityManager에서 처리됨
}

function sortPosts() {
    // 이미 CommunityManager에서 처리됨
}

function loadPosts() {
    // 이미 CommunityManager에서 처리됨
}

function displaySamplePosts() {
    // 이미 CommunityManager에서 처리됨
}

function createPagination() {
    // 이미 CommunityManager에서 처리됨
}

function formatDate() {
    // 이미 CommunityManager에서 처리됨
}

function formatNumber() {
    // 이미 CommunityManager에서 처리됨
}

function handleError() {
    // 이미 CommunityManager에서 처리됨
}
