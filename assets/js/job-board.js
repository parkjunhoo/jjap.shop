// =====================================================
// 구인구직 페이지 스크립트 (프론트 필터/정렬/표시)
// 백엔드 API 연결 전에도 오류 없이 동작하도록 안정 처리
// =====================================================

class JobBoardManager {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all'; // editor | member | other
        this.currentType = 'all';     // recruit | job_seek | all
        this.searchTerm = '';
        this.sortBy = 'latest';
        this.rateFilter = 'all';
        this.postsPerPage = 12;
        this.init();
    }

    init() {
        this.bindCategoryButtons();
        this.bindTypeToggle();
        this.bindFilters();
        this.loadPosts();
        // 초기 '전체' 활성화
        const typeToggle = document.getElementById('typeToggle');
        if (typeToggle) {
            const allBtn = typeToggle.querySelector('.type-btn[data-type="all"]');
            if (allBtn) allBtn.classList.add('active');
        }
    }

    bindCategoryButtons() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category || 'all';
                this.currentPage = 1;
                this.loadPosts();
            });
        });
    }

    bindTypeToggle() {
        const typeToggle = document.getElementById('typeToggle');
        if (typeToggle) {
            typeToggle.querySelectorAll('.type-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    typeToggle.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentType = btn.dataset.type || 'all';
                    // select와 동기화
                    const select = document.getElementById('postTypeFilter');
                    if (select) select.value = this.currentType;
                    this.currentPage = 1;
                    this.loadPosts();
                });
            });
        }
    }

    bindFilters() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const postTypeFilter = document.getElementById('postTypeFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (searchInput) {
            searchInput.addEventListener('input', e => {
                this.searchTerm = e.target.value || '';
            });
            searchInput.addEventListener('keypress', e => {
                if (e.key === 'Enter') {
                    this.currentPage = 1;
                    this.loadPosts();
                }
            });
        }
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.loadPosts();
            });
        }
        if (postTypeFilter) {
            postTypeFilter.addEventListener('change', e => {
                this.currentType = e.target.value || 'all';
                // 토글과 동기화
                const typeToggle = document.getElementById('typeToggle');
                if (typeToggle) {
                    typeToggle.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                    const match = typeToggle.querySelector(`.type-btn[data-type="${this.currentType}"]`);
                    if (match) match.classList.add('active');
                }
                this.currentPage = 1;
                this.loadPosts();
            });
        }
        // rate 필터 제거됨
        if (sortSelect) {
            sortSelect.addEventListener('change', e => {
                this.sortBy = e.target.value || 'latest';
                this.currentPage = 1;
                this.loadPosts();
            });
        }
    }

    async loadPosts() {
        try {
            this.showLoading();
            const posts = await this.fetchPosts();
            this.renderPosts(posts);
            this.updateStats(posts);
            this.renderPagination(posts.totalPages || 0);
        } catch (e) {
            console.error('구인구직 로드 오류:', e);
            this.renderError('구인구직 데이터를 불러올 수 없습니다.');
        } finally {
            this.hideLoading();
        }
    }

    async fetchPosts() {
        const qs = new URLSearchParams({
            action: 'list',
            page: this.currentPage,
            category: this.currentCategory,
            type: this.currentType,
            search: this.searchTerm,
            sort: this.sortBy
        });
        const res = await fetch(`/api/job-board?${qs.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const posts = (json.data && json.data.posts) || [];
        posts.totalPages = (json.data && json.data.pagination && json.data.pagination.total_pages) || 0;
        return posts;
    }

    renderPosts(posts) {
        const list = document.getElementById('jobPostsList');
        if (!list) return;
        if (!posts || posts.length === 0) {
            list.style.display = 'block';
            list.innerHTML = '<div class="no-posts">등록된 구인구직 게시글이 없습니다.</div>';
            return;
        }
        list.style.display = 'grid';
        list.innerHTML = '';
        posts.forEach(p => {
            const card = document.createElement('div');
            const typeClass = p.post_type === 'recruit' ? 'recruit' : (p.post_type === 'job_seek' ? 'job-seek' : '');
            card.className = `job-post-card ${typeClass}`.trim();
            const rateText = this.formatRate(p);
            const catSlug = this.detectCategorySlug(p.category_name);
            const catLabel = this.formatCategoryLabel(catSlug);
            card.innerHTML = `
                <div class="badge-row">
                    <span class="type-badge ${typeClass}">${p.post_type==='recruit'?'구인':'구직'}</span>
                    <span class="category-badge ${catSlug}">${catLabel}</span>
                </div>
                <a class="job-post-title" href="/job-board/${p.id}">${this.escape(p.title || '')}</a>
                <div class="job-post-meta">
                    <span>👤 ${this.escape(p.nickname || '익명')}</span>
                    <span>🕒 ${this.formatDate(p.created_at)}</span>
                    <span>👁️ ${p.view_count ?? 0}</span>
                </div>
                <div class="job-post-excerpt">${this.buildExcerpt(p)}</div>
                ${rateText ? `<div class="job-post-rate">💰 ${rateText}</div>` : ''}
            `;
            card.addEventListener('click', (e)=>{
                if (e.target && e.target.closest('a')) return;
                window.location.href = `/job-board/${p.id}`;
            });
            list.appendChild(card);
        });
    }

    detectCategorySlug(name){
        const n = (name||'').toLowerCase();
        if (n.includes('편집')) return 'editor';
        if (n.includes('멤버')) return 'member';
        return 'other';
    }
    formatCategoryLabel(slug){
        if (slug==='editor') return '편집자';
        if (slug==='member') return '멤버';
        return '기타';
    }

    formatRate(p) {
        if (!p) return '';
        if (p.rate_type === 'per_minute') {
            return `분당 ${this.formatNumber(p.minute_rate)}원`;
        }
        if (p.rate_type === 'per_video') {
            return `건당 ${this.formatNumber(p.video_rate)}원`;
        }
        if (p.rate_type === 'negotiable') return '협의 후 결정';
        return '';
    }

    updateStats(posts) {
        const recruit = document.getElementById('recruitCount');
        const jobSeek = document.getElementById('jobSeekCount');
        const totalViews = document.getElementById('totalViews');
        const totalLikes = document.getElementById('totalLikes');
        if (!posts) posts = [];
        if (recruit) recruit.textContent = posts.filter(p => p.post_type === 'recruit').length;
        if (jobSeek) jobSeek.textContent = posts.filter(p => p.post_type === 'job_seek').length;
        if (totalViews) totalViews.textContent = posts.reduce((s, p) => s + (p.view_count || 0), 0);
        if (totalLikes) totalLikes.textContent = posts.reduce((s, p) => s + (p.like_count || 0), 0);
    }

    renderPagination(totalPages) {
        const pag = document.getElementById('pagination');
        if (!pag) return;
        pag.innerHTML = '';
        if (!totalPages || totalPages <= 1) {
            pag.style.display = 'none';
            return;
        }
        pag.style.display = 'flex';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            if (i === this.currentPage) btn.className = 'active';
            btn.addEventListener('click', () => {
                this.currentPage = i;
                this.loadPosts();
            });
            pag.appendChild(btn);
        }
    }

    showLoading() {
        const loading = document.getElementById('loading');
        const list = document.getElementById('jobPostsList');
        if (loading) loading.style.display = 'block';
        if (list) list.style.display = 'none';
    }
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }

    renderError(msg) {
        const list = document.getElementById('jobPostsList');
        if (!list) return;
        list.style.display = 'block';
        list.innerHTML = `<div class="error-message">${this.escape(msg)}</div>`;
    }

    buildExcerpt(p) {
        const text = this.stripHtml(p?.content || '').replace(/\s+/g, ' ').trim();
        const limit = 60;
        if (text.length <= limit) return this.escape(text);
        return this.escape(text.slice(0, limit)) + '...';
    }
    stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html || '';
        return div.textContent || div.innerText || '';
    }
    formatDate(dateString) {
        const d = new Date(dateString);
        if (isNaN(d)) return '';
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
    formatNumber(n) {
        const num = Number(n||0);
        return num.toLocaleString();
    }
    escape(s) {
        return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
}

document.addEventListener('DOMContentLoaded', () => new JobBoardManager());


