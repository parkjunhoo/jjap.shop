// 새로운 모바일 메뉴 v2 - 왼쪽 슬라이드 메뉴

class MobileSidebarMenu {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.isOpen = false;
        this.currentSection = this.getCurrentSection();
        this.favorites = this.loadFavorites();
        
        this.init();
    }
    
    init() {
        this.createElements();
        this.bindEvents();
        this.populateMenu();
        this.loadFavorites();
    }
    
    getCurrentSection() {
        const path = window.location.pathname;
        if (path.includes('/creator')) return 'creator';
        if (path.includes('/tools')) return 'tools';
        if (path.includes('/test')) return 'test';
        if (path.includes('/game')) return 'game';
        if (path.includes('/horror')) return 'horror';
        return 'main';
    }
    
    createElements() {
        // 오버레이
        this.overlay = document.createElement('div');
        this.overlay.className = 'mobile-overlay';
        this.overlay.id = 'mobileOverlay';
        
        // 사이드바
        this.sidebar = document.createElement('div');
        this.sidebar.className = `mobile-sidebar ${this.currentSection}-theme`;
        this.sidebar.id = 'mobileSidebar';
        
        this.sidebar.innerHTML = this.createSidebarHTML();
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.sidebar);
    }
    
    createSidebarHTML() {
        return `
            <!-- 헤더 -->
            <div class="mobile-menu-header">
                <div class="mobile-logo-section">
                    <img src="/assets/images/jjapshoplogo.webp" alt="짭샵" class="mobile-logo">
                    <span class="mobile-logo-text">짭샵</span>
                </div>
                <button class="mobile-close-btn" id="mobileCloseBtn">×</button>
            </div>
            
            <!-- 섹션 변경 -->
            <div class="section-switcher">
                <div class="section-switcher-title">섹션 변경</div>
                <div class="section-buttons">
                    <a href="/creator" class="section-btn ${this.currentSection === 'creator' ? 'active' : ''}">
                        <span class="section-icon">🎨</span>
                        크리에이터
                    </a>
                    <a href="/tools" class="section-btn ${this.currentSection === 'tools' ? 'active' : ''}">
                        <span class="section-icon">🛠️</span>
                        유틸리티
                    </a>
                    <a href="/test" class="section-btn ${this.currentSection === 'test' ? 'active' : ''}">
                        <span class="section-icon">🧠</span>
                        심리테스트
                    </a>
                    <a href="/game" class="section-btn ${this.currentSection === 'game' ? 'active' : ''}">
                        <span class="section-icon">🎮</span>
                        게임
                    </a>
                    <a href="/horror" class="section-btn ${this.currentSection === 'horror' ? 'active' : ''}">
                        <span class="section-icon">👻</span>
                        무서운이야기
                    </a>
                </div>
            </div>
            
            <!-- 현재 섹션 메뉴 -->
            <div class="current-section-menu">
                ${this.renderSectionMenu()}
            </div>
            
            <!-- 푸터 -->
            <div class="menu-footer">
                <div class="footer-info">
                    © 2025 짭샵<br>
                    All rights reserved
                </div>
            </div>
        `;
    }
    
    // renderFavorites() 함수는 더 이상 사용하지 않음 (발로란트 하위 메뉴로 이동)
    
    renderSectionMenu() {
        const menus = this.getSectionMenus();
        
        return menus.map((menu, index) => `
            <div class="menu-category ${index === 0 ? 'expanded' : ''}" data-category="${menu.id}">
                <div class="category-header">
                    <div class="category-title">
                        <span class="category-icon">${menu.icon}</span>
                        ${menu.title}
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="category-items">
                    ${menu.items.map(item => `
                        <a href="${item.url}" class="menu-item ${this.isCurrentPage(item.url) ? 'active' : ''}">
                            <span class="menu-item-icon">${item.icon}</span>
                            ${item.title}
                        </a>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
    
    getSectionMenus() {
        const menus = {
            creator: [
                {
                    id: 'creator-tools',
                    title: '크리에이터 도구',
                    icon: '🎨',
                    items: [
                        { title: '홈', url: '/creator', icon: '🏠' },
                        { title: '카카오톡 대화', url: '/creator/kakao-chat', icon: '💬' },
                        { title: '썸네일 텍스트', url: '/creator/thumbnail-text', icon: '🖼️' },
                        { title: 'OBS 브라우저 소스', url: '/creator/obs-browser-source', icon: '🎥' },
                        { title: 'OBS 팝업', url: '/creator/obs-popup', icon: '📺' }
                    ]
                },
                {
                    id: 'creator-community',
                    title: '커뮤니티',
                    icon: '🌐',
                    items: [
                        { title: '자유게시판', url: '/creator/community', icon: '💬' },
                        { title: '구인구직', url: '/creator/job-board', icon: '💼' },
                        { title: '글쓰기', url: '/creator/write-post', icon: '✍️' },
                        { title: '구인 등록', url: '/creator/write-job', icon: '📝' }
                    ]
                }
            ],
            tools: [
                {
                    id: 'productivity',
                    title: '생산성 도구',
                    icon: '📅',
                    items: [
                        { title: '홈', url: '/tools', icon: '🏠' },
                        { title: '일일 스케줄러', url: '/tools/daily-scheduler', icon: '📋' },
                        { title: '포모도로 타이머', url: '/tools/pomodoro-timer', icon: '🍅' }
                    ]
                },
                {
                    id: 'fun-tools',
                    title: '재미있는 도구',
                    icon: '🎲',
                    items: [
                        { title: '오늘의 운세', url: '/tools/daily-fortune', icon: '🔮' },
                        { title: '랜덤 조언', url: '/tools/random-advice', icon: '💡' },
                        { title: '음식 추천', url: '/tools/food-picker', icon: '🍽️' },
                        { title: '로또 번호', url: '/tools/lotto-generator', icon: '🎰' }
                    ]
                }
            ],
            test: [
                {
                    id: 'personality-tests',
                    title: '심리 테스트',
                    icon: '🧠',
                    items: [
                        { title: '홈', url: '/test', icon: '🏠' },
                        { title: '이름 궁합 테스트', url: '/test/name-compatibility', icon: '💕' },
                        { title: '월급루팡 테스트', url: '/test/salary-lupang', icon: '💰' }
                    ]
                }
            ],
            game: [
                {
                    id: 'valorant',
                    title: '발로란트',
                    icon: '🎯',
                    items: [
                        { title: '홈', url: '/game', icon: '🏠' },
                        { title: '발로란트 홈', url: '/game/valorant', icon: '🎯' },
                        { title: '팁 게시판', url: '/game/valorant/board', icon: '📋' },
                        { title: '팁 작성', url: '/game/valorant/write', icon: '✍️' },
                        { title: '내 즐겨찾기', url: '/game/valorant/favorites', icon: '⭐' }
                    ]
                },
                // {
                //     id: 'valorant-agents',
                //     title: '요원별 공략',
                //     icon: '🎭',
                //     items: [
                //         { title: '타격대', url: '/game/valorant/board?type=duelist', icon: '🔥' },
                //         { title: '척후대', url: '/game/valorant/board?type=initiator', icon: '🎯' },
                //         { title: '감시자', url: '/game/valorant/board?type=sentinel', icon: '🛡️' },
                //         { title: '연막', url: '/game/valorant/board?type=controller', icon: '💨' }
                //     ]
                // }
            ],
            horror: [
                {
                    id: 'horror-categories',
                    title: '무서운 이야기',
                    icon: '👻',
                    items: [
                        { title: '홈', url: '/horror', icon: '🏠' },
                        { title: '도시 전설', url: '/horror/category/urban-legends', icon: '🏙️' },
                        { title: '실화 이야기', url: '/horror/category/real-stories', icon: '📖' },
                        { title: '이해하면 무서운', url: '/horror/category/scary-when-understood', icon: '🧠' },
                        { title: '번역 괴담', url: '/horror/category/translated-stories', icon: '🌍' },
                        { title: '글쓰기', url: '/horror/write', icon: '✍️' }
                    ]
                }
            ]
        };
        
        return menus[this.currentSection] || [];
    }
    
    isCurrentPage(url) {
        return window.location.pathname === url || 
               window.location.pathname.startsWith(url + '/');
    }
    
    bindEvents() {
        // DOM이 준비된 후 햄버거 메뉴 버튼 이벤트 등록
        const bindMenuBtn = () => {
            const menuBtn = document.getElementById('mobileMenuBtn');
            
            if (menuBtn) {
                menuBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.open();
                });
            } else {
                console.warn('❌ 햄버거 메뉴 버튼을 찾을 수 없습니다');
                // 0.5초 후 다시 시도
                setTimeout(bindMenuBtn, 500);
            }
        };
        
        // DOM이 준비되면 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindMenuBtn);
        } else {
            bindMenuBtn();
        }
        
        // 백업용 글로벌 이벤트 리스너
        document.addEventListener('click', (e) => {
            if (e.target.closest('#mobileMenuBtn')) {
                e.preventDefault();
                this.open();
            }
        });
        
        // 닫기 버튼
        document.addEventListener('click', (e) => {
            if (e.target.closest('#mobileCloseBtn')) {
                e.preventDefault();
                this.close();
            }
        });
        
        // 오버레이 클릭
        this.overlay.addEventListener('click', () => {
            this.close();
        });
        
        // 카테고리 토글
        document.addEventListener('click', (e) => {
            const categoryHeader = e.target.closest('.category-header');
            if (categoryHeader) {
                e.preventDefault();
                const category = categoryHeader.closest('.menu-category');
                category.classList.toggle('expanded');
            }
        });
        
        // 즐겨찾기 추가/제거
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.add-favorite');
            if (favoriteBtn) {
                e.preventDefault();
                this.toggleFavorite(favoriteBtn);
            }
        });
        
        // ESC 키로 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }
    
    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.sidebar.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('jjapshop_favorites');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('jjapshop_favorites', JSON.stringify(this.favorites));
    }
    
    toggleFavorite(btn) {
        const title = btn.dataset.title;
        const url = btn.dataset.url;
        const icon = btn.dataset.icon;
        
        const existingIndex = this.favorites.findIndex(fav => fav.url === url);
        
        if (existingIndex > -1) {
            // 제거
            this.favorites.splice(existingIndex, 1);
            btn.innerHTML = '☆';
            btn.title = '즐겨찾기 추가';
        } else {
            // 추가
            this.favorites.push({ title, url, icon });
            btn.innerHTML = '★';
            btn.title = '즐겨찾기 제거';
        }
        
        this.saveFavorites();
    }
    
    // updateFavoritesList() 함수는 더 이상 사용하지 않음 (즐겨찾기 섹션 제거됨)
    
    populateMenu() {
        // 첫 번째 카테고리 자동 확장
        const firstCategory = this.sidebar.querySelector('.menu-category');
        if (firstCategory) {
            firstCategory.classList.add('expanded');
        }
    }
}

// 전역 인스턴스
let mobileSidebarMenu;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    
    // 항상 초기화 (모바일에서만 보이도록 CSS로 처리)
    mobileSidebarMenu = new MobileSidebarMenu();
    
    // 전역 접근 가능하게 설정 (디버깅용)
    window.mobileSidebarMenu = mobileSidebarMenu;
    
});

// 리사이즈 시 처리  
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileSidebarMenu) {
        mobileSidebarMenu.close();
    }
});
