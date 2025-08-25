// 공용 JavaScript - 짭샵

// 테마 관리
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme();
        this.bindEvents();
    }
    
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }
    
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// 모바일 네비게이션 관리
class MobileNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
            
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
}

// 스크롤 이벤트 관리
class ScrollManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        // 헤더 스크롤 효과 제거 - 항상 고정
    }
}

// 유틸리티 함수들
const Utils = {
    // 디바운스 함수
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 스로틀 함수
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 로컬 스토리지 관리
    storage: {
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return null;
            }
        },
        
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error writing to localStorage:', error);
                return false;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        }
    },
    
    // 날짜 포맷팅
    formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },
    
    // 숫자 포맷팅
    formatNumber(num, options = {}) {
        const defaults = {
            decimals: 0,
            thousandsSeparator: ',',
            decimalSeparator: '.'
        };
        
        const opts = { ...defaults, ...options };
        
        let [integerPart, decimalPart] = num.toString().split('.');
        
        // 천 단위 구분자 추가
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousandsSeparator);
        
        // 소수점 처리
        if (opts.decimals > 0 && decimalPart) {
            decimalPart = decimalPart.padEnd(opts.decimals, '0').slice(0, opts.decimals);
            return `${integerPart}${opts.decimalSeparator}${decimalPart}`;
        }
        
        return integerPart;
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 테마 매니저 초기화
    new ThemeManager();
    
    // 모바일 네비게이션 초기화
    new MobileNavigation();
    
    // 스크롤 매니저 초기화
    new ScrollManager();
    
    // 현재 페이지 활성화 표시
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// 전역 객체에 유틸리티 노출
window.Utils = Utils;

// 연락처 함수
window.showContact = function() {
    Swal.fire({
        icon: 'info',
        title: '연락처',
        html: `
            <p>핵돌핀 유튜브 채널을 통해 연락해주세요.</p>
            <p><strong>이메일:</strong> sssultalk@gmail.com</p>
        `,
        confirmButtonText: '확인',
        confirmButtonColor: '#007bff'
    });
}
