// 무서운 이야기 게시판 JavaScript - 공포 효과와 인터랙션

// 중복 로딩 방지
(function() {
    'use strict';
    
    // 이미 로드되어 있으면 중단
    if (window.HorrorBoard) {
        return;
    }

class HorrorBoard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addHorrorEffects();
        this.initScrollEffects();
    }

    setupEventListeners() {
        // 카테고리 카드 호버 효과
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', this.onCategoryHover.bind(this));
            card.addEventListener('mouseleave', this.onCategoryLeave.bind(this));
        });

        // 스토리 카드 클릭 효과
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach(card => {
            card.addEventListener('click', this.onStoryClick.bind(this));
        });

        // 글쓰기 버튼 클릭 효과
        const writeBtn = document.querySelector('.write-btn');
        if (writeBtn) {
            writeBtn.addEventListener('click', this.onWriteBtnClick.bind(this));
        }

        // 경고 알림 클릭으로 숨기기
        const warningElement = document.querySelector('.horror-warning');
        if (warningElement) {
            const closeBtn = this.createCloseButton();
            warningElement.appendChild(closeBtn);
        }

        // 키보드 단축키
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
    }

    onCategoryHover(event) {
        const card = event.currentTarget;
        const icon = card.querySelector('.category-icon');
        
        // 아이콘 애니메이션
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        }

        // 호버 사운드 효과 (선택사항)
                // this.playHoverSound(); // 오디오 비활성화
    }

    onCategoryLeave(event) {
        const card = event.currentTarget;
        const icon = card.querySelector('.category-icon');
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    onStoryClick(event) {
        const card = event.currentTarget;
        const readBtn = card.querySelector('.read-btn');
        
        // 클릭 효과
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // 읽기 버튼이 아닌 다른 곳을 클릭했을 때 읽기 버튼으로 리다이렉트
        if (event.target !== readBtn && !readBtn.contains(event.target)) {
            event.preventDefault();
            if (readBtn && readBtn.href) {
                window.location.href = readBtn.href;
            }
        }
    }

    onWriteBtnClick(event) {
        const btn = event.currentTarget;
        
        // 버튼 클릭 애니메이션
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);

        // 확인 메시지
        const confirmed = confirm('무서운 이야기를 작성하시겠습니까? 👻');
        if (!confirmed) {
            event.preventDefault();
        }
    }

    createCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.className = 'warning-close-btn';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 15px;
            background: transparent;
            border: none;
            color: #ff6666;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        closeBtn.addEventListener('click', () => {
            const warning = document.querySelector('.horror-warning');
            warning.style.transform = 'scale(0)';
            warning.style.opacity = '0';
            setTimeout(() => {
                warning.style.display = 'none';
            }, 300);
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.color = '#ff4444';
            closeBtn.style.transform = 'scale(1.2)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.color = '#ff6666';
            closeBtn.style.transform = 'scale(1)';
        });

        // 경고 박스를 relative position으로 설정
        const warning = document.querySelector('.horror-warning');
        warning.style.position = 'relative';

        return closeBtn;
    }

    addHorrorEffects() {
        // 랜덤한 깜빡임 효과
        this.addRandomFlicker();
        
        // 배경 공포 효과
        this.addBackgroundEffects();
    }

    addRandomFlicker() {
        const elements = document.querySelectorAll('.board-title, .category-name, .story-title');
        
        elements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.02) { // 2% 확률로 깜빡임
                    element.style.opacity = '0.3';
                    setTimeout(() => {
                        element.style.opacity = '';
                    }, 100);
                }
            }, 1000);
        });
    }


    addBackgroundEffects() {
        // 떠다니는 유령 효과
        this.createFloatingGhosts();
        
        // 화면 가장자리 어둡게 하기
        this.addVignette();
    }

    createFloatingGhosts() {
        const ghostCount = 2; // 유령 수 줄임
        
        for (let i = 0; i < ghostCount; i++) {
            const ghost = document.createElement('div');
            ghost.innerHTML = '👻';
            ghost.className = 'floating-ghost';
            ghost.style.cssText = `
                position: fixed;
                font-size: 1.5rem;
                opacity: 0.05;
                z-index: 1;
                pointer-events: none;
                animation: float-ghost ${20 + Math.random() * 15}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${100 + Math.random() * 50}%;
            `;
            
            document.body.appendChild(ghost);
            
            // 애니메이션 추가
            if (!document.querySelector('#ghost-keyframes')) {
                const style = document.createElement('style');
                style.id = 'ghost-keyframes';
                style.textContent = `
                    @keyframes float-ghost {
                        0% { 
                            transform: translateY(0) rotate(0deg); 
                            opacity: 0; 
                        }
                        10% { 
                            opacity: 0.05; 
                        }
                        90% { 
                            opacity: 0.05; 
                        }
                        100% { 
                            transform: translateY(-100vh) rotate(360deg); 
                            opacity: 0; 
                        }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    addVignette() {
        if (!document.querySelector('.horror-vignette')) {
            const vignette = document.createElement('div');
            vignette.className = 'horror-vignette';
            vignette.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at center, transparent 20%, rgba(0, 0, 0, 0.3) 100%);
                pointer-events: none;
                z-index: 1;
            `;
            document.body.appendChild(vignette);
        }
    }

    initScrollEffects() {
        // 스크롤에 따른 parallax 효과
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Intersection Observer로 애니메이션 트리거
        this.setupIntersectionObserver();
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 배경 parallax 효과
        const header = document.querySelector('.horror-board-header');
        if (header) {
            header.style.transform = `translateY(${rate}px)`;
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, { threshold: 0.1 });

        // 관찰할 요소들
        const elements = document.querySelectorAll(
            '.category-card, .story-card, .recent-item'
        );
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });

        // 애니메이션 keyframes 추가
        if (!document.querySelector('#fade-in-keyframes')) {
            const style = document.createElement('style');
            style.id = 'fade-in-keyframes';
            style.textContent = `
                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + W: 글쓰기
        if ((event.ctrlKey || event.metaKey) && event.key === 'w') {
            event.preventDefault();
            const writeBtn = document.querySelector('.write-btn');
            if (writeBtn) {
                writeBtn.click();
            }
        }
        
        // ESC: 경고 닫기
        if (event.key === 'Escape') {
            const warning = document.querySelector('.horror-warning');
            if (warning && warning.style.display !== 'none') {
                const closeBtn = warning.querySelector('.warning-close-btn');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }
    }

    playHoverSound() {
        // 오디오 비활성화 (홈에서 오디오 제거 요청)
        return;
    }

    // 유틸리티 메서드들
    static showLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'horror-loading';
        spinner.innerHTML = '👻';
        spinner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            z-index: 10000;
            animation: spin 1s linear infinite;
        `;
        
        if (!document.querySelector('#loading-keyframes')) {
            const style = document.createElement('style');
            style.id = 'loading-keyframes';
            style.textContent = `
                @keyframes spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(spinner);
        return spinner;
    }

    static hideLoadingSpinner() {
        const spinner = document.querySelector('#horror-loading');
        if (spinner) {
            spinner.remove();
        }
    }

    static showHorrorAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `horror-alert horror-alert-${type}`;
        alert.innerHTML = `
            <div class="alert-icon">${type === 'error' ? '💀' : '👻'}</div>
            <div class="alert-message">${message}</div>
            <button class="alert-close">✕</button>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8b0000, #dc143c);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(139, 0, 0, 0.5);
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(alert);
        
        // 자동 제거
        setTimeout(() => {
            alert.style.animation = 'slideOutRight 0.5s ease forwards';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
        
        // 수동 제거
        alert.querySelector('.alert-close').addEventListener('click', () => {
            alert.remove();
        });
        
        return alert;
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    const horrorBoard = new HorrorBoard();
    
    // 전역에서 사용할 수 있도록
    window.HorrorBoard = HorrorBoard;
    
    // 추가 스타일을 동적으로 추가
    if (!document.querySelector('#dynamic-horror-styles')) {
        const style = document.createElement('style');
        style.id = 'dynamic-horror-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            .horror-alert {
                font-family: 'Noto Sans KR', sans-serif;
            }
            
            .alert-close {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                margin-left: auto;
            }
            
            .alert-close:hover {
                color: #ff6666;
            }
        `;
        document.head.appendChild(style);
    }
});

// IIFE 종료 - 완전 격리
})();
