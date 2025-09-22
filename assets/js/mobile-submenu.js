// 모바일 슬라이딩 서브메뉴 공통 JavaScript
class MobileSubmenu {
    constructor(sliderId = 'mobileSubmenuSlider') {
        this.slider = document.getElementById(sliderId);
        this.indicators = document.querySelectorAll('.submenu-indicator');
        this.currentSlide = 0;
        this.startX = 0;
        this.isDragging = false;
        this.slideCount = this.indicators.length;
        
        if (this.slider) {
            this.init();
        }
    }
    
    init() {
        this.setupIndicators();
        this.setupTouchEvents();
        this.setupMouseEvents();
        this.setupKeyboardEvents();
        this.goToSlide(0); // 초기 슬라이드
    }
    
    goToSlide(slideIndex) {
        // 슬라이드 범위 제한
        if (slideIndex < 0) slideIndex = 0;
        if (slideIndex >= this.slideCount) slideIndex = this.slideCount - 1;
        
        this.currentSlide = slideIndex;
        
        // 슬라이더 이동
        this.slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        
        // 인디케이터 업데이트
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === slideIndex);
        });
        
        // 접근성을 위한 스크린리더 안내
        this.announceSlideChange(slideIndex);
    }
    
    setupIndicators() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
            
            // 접근성 개선
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `슬라이드 ${index + 1}로 이동`);
            indicator.setAttribute('tabindex', '0');
            
            // 키보드 지원
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goToSlide(index);
                }
            });
        });
    }
    
    setupTouchEvents() {
        this.slider.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.isDragging = true;
            this.slider.style.transition = 'none';
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const diffX = this.startX - currentX;
            const slideWidth = this.slider.offsetWidth;
            const movePercent = (diffX / slideWidth) * 100;
            
            // 슬라이드 경계 체크
            const newTransform = this.currentSlide * 100 + movePercent;
            
            if (newTransform < 0) {
                // 첫 번째 슬라이드에서 더 이상 오른쪽으로 못 가게
                this.slider.style.transform = `translateX(0%)`;
            } else if (newTransform > (this.slideCount - 1) * 100) {
                // 마지막 슬라이드에서 더 이상 왼쪽으로 못 가게
                this.slider.style.transform = `translateX(-${(this.slideCount - 1) * 100}%)`;
            } else {
                this.slider.style.transform = `translateX(-${newTransform}%)`;
            }
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = this.startX - endX;
            const threshold = 50; // 최소 스와이프 거리
            
            this.slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // 왼쪽으로 스와이프 (다음 슬라이드)
                    this.goToSlide(this.currentSlide + 1);
                } else {
                    // 오른쪽으로 스와이프 (이전 슬라이드)
                    this.goToSlide(this.currentSlide - 1);
                }
            } else {
                // 스와이프가 충분하지 않음, 원래 위치로
                this.goToSlide(this.currentSlide);
            }
            
            this.isDragging = false;
        }, { passive: true });
    }
    
    setupMouseEvents() {
        // 데스크톱에서의 드래그 지원
        this.slider.addEventListener('mousedown', (e) => {
            this.startX = e.clientX;
            this.isDragging = true;
            this.slider.style.transition = 'none';
            this.slider.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const currentX = e.clientX;
            const diffX = this.startX - currentX;
            const slideWidth = this.slider.offsetWidth;
            const movePercent = (diffX / slideWidth) * 100;
            
            const newTransform = this.currentSlide * 100 + movePercent;
            
            if (newTransform < 0) {
                this.slider.style.transform = `translateX(0%)`;
            } else if (newTransform > (this.slideCount - 1) * 100) {
                this.slider.style.transform = `translateX(-${(this.slideCount - 1) * 100}%)`;
            } else {
                this.slider.style.transform = `translateX(-${newTransform}%)`;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!this.isDragging) return;
            
            const endX = e.clientX;
            const diffX = this.startX - endX;
            const threshold = 50;
            
            this.slider.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            this.slider.style.cursor = 'grab';
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.goToSlide(this.currentSlide + 1);
                } else {
                    this.goToSlide(this.currentSlide - 1);
                }
            } else {
                this.goToSlide(this.currentSlide);
            }
            
            this.isDragging = false;
        });
        
        // 마우스 커서 스타일
        this.slider.style.cursor = 'grab';
    }
    
    setupKeyboardEvents() {
        // 전역 키보드 내비게이션
        document.addEventListener('keydown', (e) => {
            // 포커스가 입력 요소에 있을 때는 무시
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                return;
            }
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.goToSlide(this.currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.goToSlide(this.currentSlide + 1);
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.slideCount - 1);
            }
        });
    }
    
    announceSlideChange(slideIndex) {
        // 스크린리더를 위한 실시간 안내
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        
        const slideNames = ['메인 메뉴', '타격대', '척후대', '감시자', '연막'];
        announcement.textContent = `${slideNames[slideIndex] || '슬라이드'} ${slideIndex + 1} of ${this.slideCount}`;
        
        document.body.appendChild(announcement);
        
        // 1초 후 제거
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // 외부에서 슬라이드 변경할 수 있는 메서드
    next() {
        this.goToSlide(this.currentSlide + 1);
    }
    
    prev() {
        this.goToSlide(this.currentSlide - 1);
    }
    
    // 자동 슬라이드 기능 (필요시 사용)
    startAutoSlide(interval = 5000) {
        this.autoSlideInterval = setInterval(() => {
            const nextSlide = (this.currentSlide + 1) % this.slideCount;
            this.goToSlide(nextSlide);
        }, interval);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 모바일 서브메뉴가 있는 경우에만 초기화
    if (document.getElementById('mobileSubmenuSlider')) {
        window.mobileSubmenu = new MobileSubmenu();
    }
});

// 리사이즈 시 슬라이더 위치 재조정
window.addEventListener('resize', () => {
    if (window.mobileSubmenu) {
        window.mobileSubmenu.goToSlide(window.mobileSubmenu.currentSlide);
    }
});
