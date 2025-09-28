// 발로란트 즐겨찾기 페이지 JavaScript
(function() {
    'use strict';

class ValorantFavorites {
    constructor() {
        this.favoriteIds = this.loadFavoriteIds(); // post ID들
        this.favoritesPosts = []; // 실제 게시글 데이터
        this.filteredFavorites = [];
        this.currentAgent = 'all';
        this.currentView = 'list';
        this.searchQuery = '';
        
        this.init();
    }
    
    async init() {
        this.bindEvents();
        this.loadInitialState();
        await this.loadFavoritesPosts();
        this.renderFavorites();
    }
    
    bindEvents() {
        // 요원 필터 버튼
        const agentFilterBtn = document.getElementById('agentFilterBtn');
        if (agentFilterBtn) {
            agentFilterBtn.addEventListener('click', () => {
                window.openAgentFilterModal();
            });
        }
        
        // 검색
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterFavorites();
            });
        }
    }
    
    loadInitialState() {
        // URL 파라미터에서 필터 상태 복원
        const params = new URLSearchParams(window.location.search);
        const agent = params.get('agent');
        const view = params.get('view');
        const search = params.get('q');
        
        if (agent) {
            this.currentAgent = agent;
            const agentFilter = document.getElementById('agentFilter');
            if (agentFilter) agentFilter.value = agent;
        }
        
        if (view) {
            this.currentView = view;
            const viewMode = document.getElementById('viewMode');
            if (viewMode) viewMode.value = view;
        }
        
        if (search) {
            this.searchQuery = search.toLowerCase();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = search;
        }
        
        this.updateViewMode();
        this.filterFavorites();
    }
    
    loadFavoriteIds() {
        try {
            const saved = localStorage.getItem('jjapshop_valorant_favorites');
            if (!saved) return [];
            
            const favoriteData = JSON.parse(saved);
            
            // 데이터가 배열인지 확인
            if (!Array.isArray(favoriteData)) return [];
            
            // 각 항목에서 ID를 추출
            const ids = favoriteData.map(item => {
                // item이 객체이고 id 속성이 있는 경우
                if (typeof item === 'object' && item.id) {
                    return String(item.id); // ID를 문자열로 변환
                }
                // item이 이미 ID인 경우
                if (typeof item === 'string' || typeof item === 'number') {
                    return String(item);
                }
                return null;
            }).filter(id => id !== null);
            
            
            // 변환된 ID 목록이 원래와 다르면 새 형태로 저장
            if (ids.length > 0 && JSON.stringify(ids) !== JSON.stringify(favoriteData)) {
                localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(ids));
            }
            
            return ids;
            
        } catch (error) {
            console.error('❌ 즐겨찾기 ID 로드 실패:', error);
            return [];
        }
    }
    
    async loadFavoritesPosts() {
        
        if (this.favoriteIds.length === 0) {
            this.favoritesPosts = [];
            this.filteredFavorites = [];
            this.showEmptyState();
            return;
        }
        
        // 로딩 상태 표시
        this.showLoading();
        
        try {
            // API로 게시글들 가져오기 - 순차적으로 처리하여 안정성 향상
            const loadedPosts = [];
            
            for (const postId of this.favoriteIds) {
                try {
                    const response = await fetch(`/api/valorant.php?action=get_post&id=${postId}`);
                    
                    if (!response.ok) {
                        console.error(`❌ HTTP ${response.status}: 게시글 ${postId} 요청 실패`);
                        continue;
                    }
                    
                    const data = await response.json();
                    
                    if (data.success && data.data && data.data.post) {
                        loadedPosts.push(data.data.post);
                    } else {
                        console.error(`❌ 게시글 ${postId} 데이터가 없거나 오류:`, data.error);
                        // 존재하지 않는 게시글은 즐겨찾기에서 제거
                        this.removeFavoriteById(postId);
                    }
                    
                } catch (error) {
                    console.error(`❌ 게시글 ${postId} 네트워크 오류:`, error);
                }
            }
            
            
            this.favoritesPosts = loadedPosts;
            this.filteredFavorites = [...this.favoritesPosts];
            
            // 로딩 완료
            this.hideLoading();
            
            if (this.favoritesPosts.length === 0) {
                this.showEmptyState();
            }
            
        } catch (error) {
            console.error('❌ 즐겨찾기 게시글 로드 실패:', error);
            this.favoritesPosts = [];
            this.filteredFavorites = [];
            this.hideLoading();
            this.showErrorState('게시글을 불러오는데 실패했습니다.');
        }
    }
    
    saveFavorites() {
        try {
            // ID 배열을 문자열 배열로 변환하여 저장
            const idsToSave = this.favoriteIds.map(id => String(id));
            localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(idsToSave));
        } catch (error) {
            console.error('❌ 즐겨찾기 저장 실패:', error);
        }
    }
    
    // ID로 즐겨찾기 제거 (존재하지 않는 게시글 정리용)
    removeFavoriteById(postId) {
        const index = this.favoriteIds.indexOf(String(postId));
        if (index > -1) {
            this.favoriteIds.splice(index, 1);
            this.saveFavorites();
        }
    }
    
    // 로딩 상태 표시
    showLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        const favoritesList = document.getElementById('favoritesList');
        const emptyState = document.getElementById('emptyState');
        
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        if (favoritesList) favoritesList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }
    
    // 로딩 상태 숨김
    hideLoading() {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
    
    // 빈 상태 표시
    showEmptyState() {
        const favoritesList = document.getElementById('favoritesList');
        const emptyState = document.getElementById('emptyState');
        
        if (favoritesList) favoritesList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    }
    
    // 오류 상태 표시
    showErrorState(message) {
        const favoritesList = document.getElementById('favoritesList');
        const emptyState = document.getElementById('emptyState');
        
        if (favoritesList) {
            favoritesList.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">😢</div>
                    <h3>오류가 발생했습니다</h3>
                    <p>${message}</p>
                    <button class="retry-btn" onclick="location.reload()">다시 시도</button>
                </div>
            `;
            favoritesList.style.display = 'block';
        }
        if (emptyState) emptyState.style.display = 'none';
    }
    
    filterFavorites() {
        
        let filtered = [...this.favoritesPosts];
        
        // 요원별 필터링
        if (this.currentAgent !== 'all') {
            filtered = filtered.filter(post => {
                const agentType = this.getAgentType(post.agent_name);
                return agentType === this.currentAgent || post.agent_name === this.currentAgent;
            });
        }
        
        // 검색 필터링
        if (this.searchQuery) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(this.searchQuery) ||
                post.content.toLowerCase().includes(this.searchQuery) ||
                post.agent_name.toLowerCase().includes(this.searchQuery)
            );
        }
        
        this.filteredFavorites = filtered;
        this.renderFavorites();
        this.updateURL();
    }
    
    getAgentType(agentName) {
        const agentTypes = {
            '네온': 'duelist', '레이나': 'duelist', '레이즈': 'duelist', '아이소': 'duelist', 
            '요루': 'duelist', '제트': 'duelist', '피닉스': 'duelist',
            '게코': 'initiator', '브리치': 'initiator', '소바': 'initiator', '스카이': 'initiator',
            '케이오': 'initiator', '페이드': 'initiator',
            '데드록': 'sentinel', '바이스': 'sentinel', '사이퍼': 'sentinel', '세이지': 'sentinel',
            '체임버': 'sentinel', '킬조이': 'sentinel',
            '바이퍼': 'controller', '브림스톤': 'controller', '아스트라': 'controller', 
            '오멘': 'controller', '클로브': 'controller', '하버': 'controller'
        };
        
        return agentTypes[agentName] || 'unknown';
    }
    
    updateViewMode() {
        const favoritesList = document.getElementById('favoritesList');
        if (favoritesList) {
            favoritesList.className = `favorites-list ${this.currentView}-view`;
        }
    }
    
    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentAgent !== 'all') params.set('agent', this.currentAgent);
        if (this.currentView !== 'list') params.set('view', this.currentView);
        if (this.searchQuery) params.set('q', this.searchQuery);
        
        const newURL = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newURL);
    }
    
    renderFavorites() {
        
        const favoritesList = document.getElementById('favoritesList');
        const emptyState = document.getElementById('emptyState');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        
        if (this.filteredFavorites.length === 0) {
            if (favoritesList) favoritesList.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        if (favoritesList) favoritesList.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
        
        if (!favoritesList) {
            console.error('❌ favoritesList 요소를 찾을 수 없습니다.');
            return;
        }
        
        favoritesList.innerHTML = this.filteredFavorites.map(post => {
            return `
                <div class="favorite-item premium-card" data-id="${post.id}" onclick="valorantFavorites.openPostModal(${post.id})">
                    <div class="card-content">
                        <div class="favorite-header">
                            <div class="agent-avatar">
                                <img src="/assets/images/valorant/charactor/${post.agent_name}.webp" 
                                     alt="${post.agent_name}" class="agent-image"
                                     onerror="this.src='/assets/images/valorant/default-agent.webp'">
                            </div>
                            <div class="favorite-title-section">
                                <div class="title-badges">
                                    <span class="favorite-difficulty difficulty-${post.tip_difficulty}">
                                        ${this.getDifficultyLabel(post.tip_difficulty)}
                                    </span>
                                </div>
                                <h3 class="favorite-title">${this.escapeHtml(post.title)}</h3>
                                <div class="favorite-agent-name">
                                    <span class="agent-icon">🎮</span>
                                    ${this.escapeHtml(post.agent_name)} 전용
                                </div>
                            </div>
                            <button class="remove-favorite" 
                                    onclick="event.stopPropagation(); valorantFavorites.removeFavorite(${post.id})" 
                                    title="즐겨찾기 제거">
                                <span class="remove-icon">🗑️</span>
                            </button>
                        </div>
                        
                        <div class="favorite-content">
                            <p class="content-preview">${this.truncateText(this.stripHtml(post.content || ''), 120)}</p>
                        </div>
                        
                        <div class="favorite-meta">
                            <div class="favorite-stats">
                                <span class="stat-item views">
                                    <i class="stat-icon">👁️</i>
                                    ${this.formatNumber(post.view_count)}
                                </span>
                                <span class="stat-item comments">
                                    <i class="stat-icon">💬</i>
                                    ${this.formatNumber(post.comment_count)}
                                </span>
                            </div>
                            <div class="favorite-date">
                                <span class="favorite-author">
                                    <i class="author-icon">👤</i>
                                    ${this.escapeHtml(post.nickname)}
                                </span>
                                <span class="post-time">• ${post.time_ago}</span>
                            </div>
                        </div>
                        
                        <div class="card-footer">
                            <span class="view-more">클릭하여 자세히 보기 →</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // 카드 호버 효과
        this.addCardAnimations();
        
        // 링크는 a 태그로 처리되므로 별도 클릭 이벤트 불필요
    }
    
    addFavorite(data) {
        const favorite = {
            id: this.generateId(),
            title: data.title,
            content: data.content,
            agent: data.agent || '전체',
            url: data.url,
            savedAt: new Date().toISOString()
        };
        
        // 중복 확인
        const exists = this.favorites.some(f => f.url === favorite.url);
        if (exists) {
            return false;
        }
        
        this.favorites.unshift(favorite); // 최신순으로 추가
        this.saveFavorites();
        this.filterFavorites();
        
        return true;
    }
    
    removeFavorite(postId) {
        if (confirm('즐겨찾기에서 제거하시겠습니까?')) {
            // favoriteIds 배열에서 제거
            this.favoriteIds = this.favoriteIds.filter(id => id != postId);
            // favoritesPosts 배열에서도 제거
            this.favoritesPosts = this.favoritesPosts.filter(post => post.id != postId);
            
            this.saveFavorites();
            this.filterFavorites();
            
            // SweetAlert2가 있으면 사용
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '제거 완료!',
                    text: '즐겨찾기에서 제거되었습니다.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        }
    }
    
    clearAllFavorites() {
        if (confirm('모든 즐겨찾기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            this.favoriteIds = [];
            this.favoritesPosts = [];
            this.saveFavorites();
            this.filterFavorites();
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '전체 삭제 완료!',
                    text: '모든 즐겨찾기가 삭제되었습니다.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }
    }
    
    // 유틸리티 함수들
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '어제';
        if (diffDays < 7) return `${diffDays}일 전`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)}주 전`;
        
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    getDifficultyLabel(difficulty) {
        const labels = {
            'beginner': '🟢 초급',
            'intermediate': '🟡 중급',
            'advanced': '🔴 고급',
            'expert': '⚫ 전문가'
        };
        return labels[difficulty] || '🟢 초급';
    }
    
    stripHtml(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    }
    
    formatNumber(num) {
        if (!num) return '0';
        return num.toLocaleString();
    }
    
    // 카드 애니메이션 효과 - card-glow 제거됨
    addCardAnimations() {
        const cards = document.querySelectorAll('.favorite-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // 게시글 모달 열기
    async openPostModal(postId) {
        
        try {
            // 기존 모달 제거 (혹시 남아있을 수도 있음)
            const existingModal = document.getElementById('postModalOverlay');
            if (existingModal) {
                existingModal.remove();
            }
            
            // 로딩 표시
            this.showModalLoading();
            
            // localStorage에서 즐겨찾기 데이터 찾기
            const post = this.favoritesPosts.find(p => p.id == postId);
            
            if (post) {
                setTimeout(() => {
                    this.displayPostModal(post);
                }, 300); // 로딩 애니메이션 시간을 300ms로 단축
            } else {
                throw new Error('즐겨찾기 게시글을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('❌ 게시글 로드 오류:', error);
            this.showModalError('게시글을 불러오는데 실패했습니다.');
        }
    }
    
    // 모달 표시
    displayPostModal(post) {
        
        // 기존 로딩 모달 제거
        const existingModal = document.getElementById('postModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modalHTML = `
            <div class="post-modal-overlay" id="postModalOverlay" onclick="valorantFavorites.closePostModal(event)">
                <div class="post-modal" onclick="event.stopPropagation()">
                    <div class="modal-close-section">
                        <button class="modal-close" onclick="valorantFavorites.closePostModal()">
                                <span>✕</span>
                        </button>
                    </div>
                    <div class="modal-header">
                        <div class="modal-agent-info">
                            <img src="/assets/images/valorant/charactor/${post.agent_name}.webp" 
                                 alt="${post.agent_name}" class="modal-agent-avatar"
                                 onerror="this.src='/assets/images/valorant/default-agent.webp'">
                            <div class="modal-title-section">
                                <h2 class="modal-title">${this.escapeHtml(post.title)}</h2>
                                <div class="modal-meta">
                                    <span class="modal-agent">${post.agent_name}</span>
                                    <span class="modal-difficulty difficulty-${post.tip_difficulty}">
                                        ${this.getDifficultyLabel(post.tip_difficulty)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-body">
                        <div class="modal-content">
                            <div class="content-body">
                                ${post.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 모달을 body에 추가
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 모달이 제대로 추가되었는지 확인
        const addedModal = document.getElementById('postModalOverlay');
        
        // 스크롤 비활성화
        document.body.style.overflow = 'hidden';
        
        // 애니메이션 - show 클래스 사용으로 더 안정적인 표시
        setTimeout(() => {
            const modal = document.getElementById('postModalOverlay');
            if (modal) {
                modal.classList.add('show');
                modal.querySelector('.post-modal').style.transform = 'scale(1) translateY(0)';
            } else {
                console.error('❌ 모달 요소를 찾을 수 없습니다.');
            }
        }, 50); // 타이밍을 50ms로 증가
    }
    
    // 모달 로딩 표시
    showModalLoading() {
        const loadingHTML = `
            <div class="post-modal-overlay" id="postModalOverlay" onclick="valorantFavorites.closePostModal(event)">
                <div class="post-modal loading" onclick="event.stopPropagation()">
                    <div class="modal-loading">
                        <div class="loading-spinner">🎮</div>
                        <p>게시글을 불러오는 중...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        document.body.style.overflow = 'hidden';
        
        // 로딩 모달도 show 클래스로 표시
        setTimeout(() => {
            const modal = document.getElementById('postModalOverlay');
            if (modal) {
                modal.classList.add('show');
            }
        }, 50);
    }
    
    // 모달 오류 표시
    showModalError(message) {
        
        // 기존 모달 제거
        const existingModal = document.getElementById('postModalOverlay');
        if (existingModal) {
            existingModal.remove();
        }
        
        const errorHTML = `
            <div class="post-modal-overlay" id="postModalOverlay" onclick="valorantFavorites.closePostModal(event)">
                <div class="post-modal error" onclick="event.stopPropagation()">
                    <div class="modal-error">
                        <div class="error-icon">😢</div>
                        <h3>오류가 발생했습니다</h3>
                        <p>${message}</p>
                        <button class="retry-btn" onclick="valorantFavorites.closePostModal()">닫기</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        document.body.style.overflow = 'hidden';
        
        // 오류 모달도 show 클래스로 표시
        setTimeout(() => {
            const modal = document.getElementById('postModalOverlay');
            if (modal) {
                modal.classList.add('show');
            }
        }, 50);
    }
    
    // 모달 닫기
    closePostModal(event) {
        if (event && event.target !== event.currentTarget) return;
        
        const modal = document.getElementById('postModalOverlay');
        if (modal) {
            
            // show 클래스 제거하여 숨김 애니메이션 실행
            modal.classList.remove('show');
            const postModal = modal.querySelector('.post-modal');
            if (postModal) {
                postModal.style.transform = 'scale(0.9) translateY(20px)';
            }
            
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
                document.body.style.overflow = '';
            }, 300);
        }
    }
    
    // 게시글 공유
    async sharePost(postId) {
        const url = `${window.location.origin}/game/valorant/post/${postId}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: '발로란트 팁',
                    url: url
                });
            } else {
                await navigator.clipboard.writeText(url);
                this.showSuccessToast('링크가 클립보드에 복사되었습니다! 📋');
            }
        } catch (error) {
            // 폴백: 수동 복사
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            this.showSuccessToast('링크가 클립보드에 복사되었습니다! 📋');
        }
    }
    
    // 성공 토스트 메시지
    showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
            zIndex: '99999',
            animation: 'slideInRight 0.3s ease-out',
            fontSize: '0.95rem'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // 요원 필터 관련 메서드들
    async loadAgentsForFilter() {
        try {
            const response = await fetch('/api/valorant.php?action=get_agents');
            const data = await response.json();
            
            if (data.success) {
                this.renderAgentFilter(data.data.agents);
            } else {
                console.error('요원 로드 실패:', data.error);
            }
        } catch (error) {
            console.error('요원 로드 오류:', error);
        }
    }
    
    renderAgentFilter(agents) {
        const agentRoles = document.getElementById('agentRoles');
        if (!agentRoles) return;
        
        const roleGroups = {};
        agents.forEach(agent => {
            if (!roleGroups[agent.role]) {
                roleGroups[agent.role] = [];
            }
            roleGroups[agent.role].push(agent);
        });
        
        const roleNames = {
            'Duelist': { name: '🔥 타격대', class: 'duelist' },
            'Initiator': { name: '🎯 척후대', class: 'initiator' },
            'Sentinel': { name: '🛡️ 감시자', class: 'sentinel' },
            'Controller': { name: '💨 연막', class: 'controller' }
        };
        
        agentRoles.innerHTML = Object.entries(roleGroups).map(([role, agents]) => {
            const roleInfo = roleNames[role] || { name: role, class: 'unknown' };
            return `
                <div class="agent-role-section">
                    <h4 class="role-title">${roleInfo.name}</h4>
                    <div class="agent-cards-grid">
                        ${agents.map(agent => `
                            <div class="agent-card" data-agent-id="${agent.id}" onclick="toggleAgentSelection(this)">
                                <img src="/assets/images/valorant/charactor/${agent.name}.webp" 
                                     alt="${agent.name}" class="agent-card-image"
                                     onerror="this.src='/assets/images/valorant/default-agent.webp'">
                                <span class="agent-card-name">${agent.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    setAgentFilter(selectedAgentIds) {
        this.selectedAgents = selectedAgentIds;
        this.filterFavorites();
        
        // 버튼 텍스트 업데이트
        const agentFilterText = document.getElementById('agentFilterText');
        if (agentFilterText) {
            if (selectedAgentIds.length === 0) {
                agentFilterText.textContent = '🎯 모든 요원';
            } else if (selectedAgentIds.length === 1) {
                // 단일 요원 선택 시 요원명 표시
                const selectedCard = document.querySelector(`[data-agent-id="${selectedAgentIds[0]}"]`);
                const agentName = selectedCard ? selectedCard.querySelector('.agent-card-name').textContent : '요원';
                agentFilterText.textContent = `🎯 ${agentName}`;
            } else {
                agentFilterText.textContent = `🎯 ${selectedAgentIds.length}개 요원`;
            }
        }
    }
}

// 전역 함수들 (다른 페이지에서 사용할 수 있도록)
window.addToValorantFavorites = function(data) {
    if (typeof valorantFavorites !== 'undefined') {
        return valorantFavorites.addFavorite(data);
    }
    
    // 즐겨찾기 인스턴스가 없으면 localStorage에 직접 저장
    try {
        const favorites = JSON.parse(localStorage.getItem('jjapshop_valorant_favorites') || '[]');
        const favorite = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title: data.title,
            content: data.content,
            agent: data.agent || '전체',
            url: data.url,
            savedAt: new Date().toISOString()
        };
        
        // 중복 확인
        const exists = favorites.some(f => f.url === favorite.url);
        if (!exists) {
            favorites.unshift(favorite);
            localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(favorites));
            return true;
        }
        return false;
    } catch (error) {
        console.error('즐겨찾기 추가 실패:', error);
        return false;
    }
};

window.isInValorantFavorites = function(url) {
    try {
        const favorites = JSON.parse(localStorage.getItem('jjapshop_valorant_favorites') || '[]');
        return favorites.some(f => f.url === url);
    } catch (error) {
        console.error('즐겨찾기 확인 실패:', error);
        return false;
    }
};

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    window.valorantFavorites = new ValorantFavorites();
});

// 요원 필터 모달 함수들
window.openAgentFilterModal = function() {
    document.getElementById('agentFilterModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    if (window.valorantFavorites) {
        window.valorantFavorites.loadAgentsForFilter();
    }
};

window.closeAgentFilterModal = function() {
    document.getElementById('agentFilterModal').style.display = 'none';
    document.body.style.overflow = '';
};

window.clearAllAgents = function() {
    document.querySelectorAll('.agent-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('selectedAgentsCount').textContent = '0개 요원 선택됨';
};

window.applyAgentFilter = function() {
    const selectedAgents = Array.from(document.querySelectorAll('.agent-card.selected'))
                                .map(card => card.dataset.agentId);
    
    if (window.valorantFavorites) {
        window.valorantFavorites.setAgentFilter(selectedAgents);
    }
    
    window.closeAgentFilterModal();
};

window.toggleAgentSelection = function(element) {
    element.classList.toggle('selected');
    
    const selectedCount = document.querySelectorAll('.agent-card.selected').length;
    document.getElementById('selectedAgentsCount').textContent = `${selectedCount}개 요원 선택됨`;
};

})();
