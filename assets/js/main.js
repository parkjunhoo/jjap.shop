// 짭샵 메인 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 스무스 스크롤 구현
    setupSmoothScroll();
    
    // 애니메이션 효과
    setupAnimations();
    
    // 도구 카드 호버 효과
    setupToolCardEffects();
});

// 스무스 스크롤 설정
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 외부 링크나 앵커 링크가 아닌 경우에만 스무스 스크롤 적용
            if (targetId.startsWith('#') && !targetId.startsWith('http')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.common-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}



// 애니메이션 효과 설정
function setupAnimations() {
    // Intersection Observer를 사용한 요소 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // 애니메이션을 적용할 요소들
    const animateElements = document.querySelectorAll('.tool-card, .about-content, .contact-item');
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// 도구 카드 호버 효과
function setupToolCardEffects() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // 호버 시 아이콘 애니메이션
            const icon = this.querySelector('.tool-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // 마우스가 벗어날 때 원래 상태로 복원
            const icon = this.querySelector('.tool-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// 스크롤 진행률 표시 (선택사항)
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// 모바일 메뉴 토글 (필요시 구현)
function setupMobileMenu() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-toggle';
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 10px;
    `;
    
    const header = document.querySelector('.header-content');
    header.insertBefore(mobileMenuButton, header.firstChild);
    
    // 모바일에서만 표시
    if (window.innerWidth <= 768) {
        mobileMenuButton.style.display = 'block';
        
        mobileMenuButton.addEventListener('click', function() {
            const nav = document.querySelector('.nav');
            nav.classList.toggle('mobile-open');
        });
    }
    
    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
        } else {
            mobileMenuButton.style.display = 'none';
            document.querySelector('.nav').classList.remove('mobile-open');
        }
    });
}

// 로딩 애니메이션
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>짭샵을 불러오는 중...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-size: 18px;
    `;
    
    document.body.appendChild(loader);
    
    // 페이지 로딩 완료 후 로더 제거
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// 도구 카드 클릭 이벤트
function setupToolCardClicks() {
    const toolCards = document.querySelectorAll('.tool-card:not(.coming-soon)');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // 링크가 아닌 카드 영역을 클릭했을 때만 처리
            if (!e.target.closest('.tool-link')) {
                const link = this.querySelector('.tool-link');
                if (link) {
                    link.click();
                }
            }
        });
        
        // 커서 스타일 변경
        card.style.cursor = 'pointer';
    });
}

// 스크롤 시 요소들 순차적으로 나타나는 효과
function setupStaggeredAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100); // 100ms 간격으로 순차 애니메이션
            }
        });
    }, observerOptions);
    
    // 도구 카드들에 순차 애니메이션 적용
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        observer.observe(card);
    });
}

// 초기화 함수들 실행
document.addEventListener('DOMContentLoaded', function() {
    // 기본 애니메이션 설정
    setupAnimations();
    
    // 도구 카드 효과 설정
    setupToolCardEffects();
    
    // 도구 카드 클릭 이벤트 설정
    setupToolCardClicks();
    
    // 순차 애니메이션 설정
    setupStaggeredAnimation();
    
    // 스크롤 진행률 표시 (선택사항)
    // setupScrollProgress();
    
    // 모바일 메뉴 설정 (필요시)
    // setupMobileMenu();
    
    // 로딩 애니메이션 (선택사항)
    // showLoadingAnimation();
});

// CSS 애니메이션 클래스 추가
if (!document.getElementById('jjapshop-animation-styles')) {
    const jjapshopAnimationStyle = document.createElement('style');
    jjapshopAnimationStyle.id = 'jjapshop-animation-styles';
    jjapshopAnimationStyle.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .mobile-open {
            display: block !important;
        }
        
        @media (max-width: 768px) {
            .nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
            }
            
            .nav-list {
                flex-direction: column;
                gap: 15px;
            }
            
            .nav-list li {
                text-align: center;
            }
        }
    `;

    document.head.appendChild(jjapshopAnimationStyle);
}

// 이메일 클립보드 복사 함수
function copyEmailToClipboard(email) {
    // navigator.clipboard가 지원되는지 확인
    if (navigator.clipboard && window.isSecureContext) {
        // HTTPS 환경에서 navigator.clipboard 사용
        navigator.clipboard.writeText(email).then(function() {
            // 복사 성공 시 SweetAlert2로 메시지 표시
            Swal.fire({
                icon: 'success',
                title: '복사되었습니다!',
                text: 'sssultalk@gmail.com이 클립보드에 복사되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
        }).catch(function(err) {
            // 복사 실패 시 대체 방법 사용
            fallbackCopyTextToClipboard(email);
        });
    } else {
        // HTTP 환경이나 navigator.clipboard가 지원되지 않는 경우 대체 방법 사용
        fallbackCopyTextToClipboard(email);
    }
}

// 대체 클립보드 복사 방법 (구형 브라우저 지원)
function fallbackCopyTextToClipboard(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            Swal.fire({
                icon: 'success',
                title: '복사되었습니다!',
                text: 'sssultalk@gmail.com이 클립보드에 복사되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '복사 실패',
                text: '클립보드 복사에 실패했습니다. 수동으로 복사해주세요.',
                confirmButtonText: '확인',
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (err) {
        console.error('클립보드 복사 오류:', err);
        Swal.fire({
            icon: 'error',
            title: '복사 실패',
            text: '클립보드 복사에 실패했습니다. 수동으로 복사해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#dc3545'
        });
    }
}


