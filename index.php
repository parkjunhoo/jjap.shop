<?php
$page_title = '짭샵 - 크리에이터 도구, 생활 유틸리티, 심리테스트, 무서운이야기 종합 플랫폼';
$page_description = '모든 것을 한 곳에서! 크리에이터 도구, 생활 유틸리티, 재미있는 심리테스트, 무서운이야기까지. 일상과 창작 활동에 필요한 모든 도구와 콘텐츠를 무료로 제공하는 종합 웹 플랫폼입니다.';
$page_keywords = '종합 웹플랫폼, 크리에이터 도구, 생활 유틸리티, 심리테스트, 무서운이야기, 썸네일 생성기, 생활계획표, 포모도로 타이머, 이름 궁합, 월급루팡 테스트, 로또번호 생성기, 무료 도구, 온라인 서비스, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/';
?>

<?php include_once 'includes/section-headers/main-header.php'; ?>

<div class="main-container">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-background"></div>
        <div class="hero-content">
            <div class="hero-logo">
                <img src="/assets/images/jjapshoplogo.webp" alt="짭샵 로고" class="logo-image">
            </div>
            <h1 class="hero-title">
                <span class="title-main">짭샵</span>
                <span class="title-sub">JJAP.SHOP</span>
            </h1>
            <p class="hero-subtitle">모든 것을 한 곳에서 해결하는 종합 웹 플랫폼</p>
            <p class="hero-description">
                크리에이터 도구부터 생활 유틸리티, 재미있는 테스트, 무서운이야기까지<br>
                일상과 창작에 필요한 모든 서비스를 무료로 제공합니다
            </p>
        </div>
        <div class="scroll-indicator">
            <div class="scroll-arrow">↓</div>
            <span>서비스 둘러보기</span>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
        <div class="section-header">
            <h2 class="section-title">주요 서비스</h2>
            <p class="section-subtitle">다양한 분야의 전문적인 도구와 콘텐츠를 제공합니다</p>
        </div>

        <div class="services-grid">
            <!-- 크리에이터 도구 -->
            <div class="service-card creator" onclick="location.href='/creator'">
                <div class="card-background"></div>
                <div class="card-icon">🎨</div>
                <h3 class="card-title">크리에이터 도구</h3>
                <p class="card-description">유튜버, 스트리머를 위한 전문 도구들</p>
                <div class="card-features">
                    <span class="feature-tag">카카오톡 꾸미기</span>
                    <span class="feature-tag">썸네일 생성기</span>
                    <span class="feature-tag">OBS 브라우저 소스</span>
                    <span class="feature-tag">커뮤니티</span>
                </div>
                <div class="card-arrow">→</div>
            </div>

            <!-- 생활 유틸리티 -->
            <div class="service-card tools" onclick="location.href='/tools'">
                <div class="card-background"></div>
                <div class="card-icon">🛠️</div>
                <h3 class="card-title">생활 유틸리티</h3>
                <p class="card-description">일상을 편리하게 만드는 실용 도구들</p>
                <div class="card-features">
                    <span class="feature-tag">생활계획표</span>
                    <span class="feature-tag">포모도로 타이머</span>
                    <span class="feature-tag">로또번호 생성기</span>
                    <span class="feature-tag">오늘의 운세</span>
                </div>
                <div class="card-arrow">→</div>
            </div>

            <!-- 심리테스트 -->
            <div class="service-card tests" onclick="location.href='/test'">
                <div class="card-background"></div>
                <div class="card-icon">🧠</div>
                <h3 class="card-title">심리테스트</h3>
                <p class="card-description">재미있고 정확한 심리 분석 테스트</p>
                <div class="card-features">
                    <span class="feature-tag">이름 궁합</span>
                    <span class="feature-tag">월급루팡 테스트</span>
                    <span class="feature-tag">포켓몬카드 결과</span>
                    <span class="feature-tag">이미지 저장</span>
                </div>
                <div class="card-arrow">→</div>
            </div>

            <!-- 게임 공략 -->
            <div class="service-card games" onclick="location.href='/game'">
                <div class="card-background"></div>
                <div class="card-icon">🎮</div>
                <h3 class="card-title">게임 공략</h3>
                <p class="card-description">다양한 게임의 팁과 공략 가이드</p>
                <div class="card-features">
                    <span class="feature-tag">발로란트 팁</span>
                    <span class="feature-tag">요원별 공략</span>
                    <span class="feature-tag">즐겨찾기</span>
                    <span class="feature-tag">커뮤니티</span>
                </div>
                <div class="card-arrow">→</div>
            </div>

            <!-- 무서운이야기 -->
            <div class="service-card horror" onclick="location.href='/horror'">
                <div class="card-background"></div>
                <div class="card-icon">👻</div>
                <h3 class="card-title">무서운이야기</h3>
                <p class="card-description">소름 끼치는 공포 스토리 게시판</p>
                <div class="card-features">
                    <span class="feature-tag">도시전설</span>
                    <span class="feature-tag">실화 이야기</span>
                    <span class="feature-tag">번역 괴담</span>
                    <span class="feature-tag">커뮤니티</span>
                </div>
                <div class="card-arrow">→</div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="section-header">
            <h2 class="section-title">짭샵만의 특별함</h2>
            <p class="section-subtitle">다양한 영역을 아우르는 종합 플랫폼의 강점</p>
        </div>

        <div class="features-grid">
            <div class="feature-item">
                <div class="feature-icon">🎯</div>
                <h4 class="feature-title">올인원 솔루션</h4>
                <p class="feature-description">크리에이터부터 일반 사용자까지, 모든 니즈를 한 곳에서 해결</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🚀</div>
                <h4 class="feature-title">실용성 중심</h4>
                <p class="feature-description">실제로 사용할 수 있는 유용한 기능들만 엄선하여 제공</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🎨</div>
                <h4 class="feature-title">직관적 인터페이스</h4>
                <p class="feature-description">누구나 쉽게 사용할 수 있는 깔끔하고 현대적인 디자인</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">⚡</div>
                <h4 class="feature-title">즉시 사용 가능</h4>
                <p class="feature-description">회원가입 없이 바로 이용할 수 있는 간편한 접근성</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🔄</div>
                <h4 class="feature-title">지속적 발전</h4>
                <p class="feature-description">사용자 피드백을 반영한 꾸준한 기능 개선과 업데이트</p>
            </div>
            <div class="feature-item">
                <div class="feature-icon">🌟</div>
                <h4 class="feature-title">독창적 컨텐츠</h4>
                <p class="feature-description">다른 곳에서 찾기 힘든 유니크하고 재미있는 콘텐츠</p>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="cta-content">
            <h2 class="cta-title">지금 바로 시작해보세요</h2>
            <p class="cta-description">짭샵의 다양한 서비스로 더 편리하고 재미있는 디지털 생활을 경험하세요</p>
            <div class="cta-buttons">
                <a href="/creator" class="cta-btn primary">크리에이터 도구 시작</a>
                <a href="/tools" class="cta-btn secondary">유틸리티 둘러보기</a>
            </div>
        </div>
    </section>
</div>

<style>
/* 다크 테마 메인 스타일 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background: #0a0a0a;
    color: #ffffff;
    font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
}

.main-container {
    width: 100%;
    min-height: 100vh;
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    z-index: -2;
}

.hero-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
        radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 192, 203, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.2) 0%, transparent 50%);
    animation: gradientShift 8s ease-in-out infinite alternate;
    z-index: -1;
}

@keyframes gradientShift {
    0% { opacity: 0.3; transform: scale(1) rotate(0deg); }
    100% { opacity: 0.6; transform: scale(1.1) rotate(5deg); }
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
    padding: 0 2rem;
}

.hero-logo {
    margin-bottom: 2rem;
}

.logo-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: logoFloat 6s ease-in-out infinite;
}

@keyframes logoFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-10px) scale(1.05); }
}

.hero-title {
    margin-bottom: 1.5rem;
}

.title-main {
    display: block;
    font-size: 5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    animation: titleGlow 3s ease-in-out infinite alternate;
}

.title-sub {
    display: block;
    font-size: 1.5rem;
    font-weight: 300;
    color: #a8b2d1;
    letter-spacing: 0.3em;
    text-transform: uppercase;
}

@keyframes titleGlow {
    0% { filter: brightness(1); }
    100% { filter: brightness(1.3); }
}

.hero-subtitle {
    font-size: 1.8rem;
    font-weight: 600;
    color: #e6f1ff;
    margin-bottom: 1rem;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.hero-description {
    font-size: 1.2rem;
    color: #8892b0;
    margin-bottom: 3rem;
    line-height: 1.8;
}


.scroll-indicator {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #8892b0;
    animation: bounce 2s infinite;
    cursor: pointer;
}

.scroll-arrow {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
    40% { transform: translateX(-50%) translateY(-10px); }
    60% { transform: translateX(-50%) translateY(-5px); }
}

/* Services Section */
.services-section {
    padding: 8rem 2rem;
    background: #0a0a0a;
    position: relative;
}

.section-header {
    text-align: center;
    margin-bottom: 5rem;
}

.section-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: #e6f1ff;
    margin-bottom: 1.5rem;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 2px;
}

.section-subtitle {
    font-size: 1.3rem;
    color: #8892b0;
    max-width: 600px;
    margin: 0 auto;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.service-card {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 3rem 2rem;
    cursor: pointer;
    transition: all 0.4s ease;
    overflow: hidden;
    backdrop-filter: blur(20px);
}

.service-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
}

.service-card:hover::before {
    transform: translateX(100%);
}

.service-card:hover {
    transform: translateY(-10px);
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
}

.card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 20px;
}

.service-card.creator .card-background {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
}

.service-card.tools .card-background {
    background: linear-gradient(135deg, rgba(54, 209, 220, 0.1), rgba(91, 134, 229, 0.1));
}

.service-card.tests .card-background {
    background: linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1));
}

.service-card.games .card-background {
    background: linear-gradient(135deg, rgba(255, 70, 85, 0.1), rgba(255, 107, 107, 0.1));
}

.service-card.horror .card-background {
    background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 62, 62, 0.1));
}

.service-card:hover .card-background {
    opacity: 1;
}

.card-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    display: block;
}

.card-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #e6f1ff;
    margin-bottom: 1rem;
}

.card-description {
    font-size: 1.1rem;
    color: #8892b0;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.card-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.feature-tag {
    background: rgba(255, 255, 255, 0.1);
    color: #a8b2d1;
    padding: 0.3rem 0.8rem;
    border-radius: 15px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.service-card:hover .feature-tag {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
    color: #e6f1ff;
}

.card-arrow {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    font-size: 1.5rem;
    color: #667eea;
    transition: transform 0.3s ease;
}

.service-card:hover .card-arrow {
    transform: translateX(5px);
}

/* Features Section */
.features-section {
    padding: 8rem 2rem;
    background: #111;
    position: relative;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.feature-item {
    text-align: center;
    padding: 2rem;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
}

.feature-item:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(102, 126, 234, 0.2);
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #e6f1ff;
    margin-bottom: 0.8rem;
}

.feature-description {
    color: #8892b0;
    line-height: 1.6;
}

/* CTA Section */
.cta-section {
    padding: 8rem 2rem;
    background: #0a0a0a;
    text-align: center;
}

.cta-content {
    max-width: 600px;
    margin: 0 auto;
}

.cta-title {
    font-size: 3rem;
    font-weight: 700;
    color: #e6f1ff;
    margin-bottom: 1.5rem;
}

.cta-description {
    font-size: 1.3rem;
    color: #8892b0;
    margin-bottom: 3rem;
    line-height: 1.6;
}

.cta-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
}

.cta-btn {
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.cta-btn.primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.cta-btn.secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
}

.cta-btn:hover {
    transform: translateY(-3px);
}

.cta-btn.primary:hover {
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.cta-btn.secondary:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #764ba2;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .title-main {
        font-size: 3.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.4rem;
    }
    
    .hero-description {
        font-size: 1.1rem;
    }
    
    
    .section-title {
        font-size: 2.5rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .service-card {
        padding: 2rem 1.5rem;
    }
    
    .cta-title {
        font-size: 2.2rem;
    }
    
    .cta-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .cta-btn {
        width: 100%;
        max-width: 300px;
    }
}

@media (max-width: 480px) {
    .hero-content {
        padding: 0 1rem;
    }
    
    .title-main {
        font-size: 2.8rem;
    }
    
    .title-sub {
        font-size: 1.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    
    .services-section,
    .features-section,
    .cta-section {
        padding: 4rem 1rem;
    }
}

/* 애니메이션 성능 최적화 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>

<!-- 구조화된 데이터 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "짭샵",
  "alternateName": "JJAP.SHOP",
  "description": "크리에이터 도구, 생활 유틸리티, 심리테스트, 무서운이야기를 제공하는 종합 웹 플랫폼",
  "url": "https://jjap.shop",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://jjap.shop/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
    "@type": "ItemList",
    "name": "짭샵 서비스 목록",
    "itemListElement": [
      {
        "@type": "WebApplication",
        "name": "크리에이터 도구",
        "description": "유튜버, 스트리머를 위한 전문 도구",
        "url": "https://jjap.shop/creator",
        "applicationCategory": "DesignApplication"
      },
      {
        "@type": "WebApplication", 
        "name": "생활 유틸리티",
        "description": "일상을 편리하게 만드는 실용 도구",
        "url": "https://jjap.shop/tools",
        "applicationCategory": "UtilitiesApplication"
      },
      {
        "@type": "WebApplication",
        "name": "심리테스트",
        "description": "재미있고 정확한 심리 분석 테스트",
        "url": "https://jjap.shop/test", 
        "applicationCategory": "EntertainmentApplication"
      },
      {
        "@type": "WebSite",
        "name": "무서운이야기",
        "description": "공포 스토리 게시판",
        "url": "https://jjap.shop/horror"
      }
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "짭샵",
    "url": "https://jjap.shop"
  }
}
</script>

<?php include_once 'includes/footer.php'; ?>