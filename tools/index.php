<?php
$page_title = '생활 유틸리티 도구 모음 - 생활계획표, 포모도로, 운세, 로또 | 짭샵';
$page_description = '일상생활을 더 편리하게! 생활계획표 작성, 포모도로 타이머, 오늘의 운세, 음식 추천, 로또번호 생성기, 랜덤 조언까지. 모든 유틸리티 도구를 무료로 이용하세요.';
$page_keywords = '생활 유틸리티, 생활계획표, 포모도로 타이머, 오늘의 운세, 음식 추천, 로또번호 생성기, 랜덤 조언, 생산성 도구, 일상 도구, 무료 유틸리티, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/tools';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="tools-container">
    <div class="tools-hero">
        <div class="hero-content">
            <h1 class="hero-title">🛠️ 유틸리티 도구 모음</h1>
            <p class="hero-subtitle">일상생활에 꼭 필요한 6개의 핵심 도구</p>
        </div>
    </div>

    <!-- Google AdSense 수평 광고 -->
    <?php include_once '../includes/ads/horizontal-ad.php'; ?>

    <div class="tools-content">
        <div class="tools-grid">
            <a href="/tools/daily-scheduler" class="tool-card">
                <div class="tool-icon">⏰</div>
                <h3>생활계획표 만들기</h3>
                <p>하루 24시간을 원형 차트로 시각화하여 계획을 세워보세요</p>
            </a>
            
            <a href="/tools/pomodoro-timer" class="tool-card">
                <div class="tool-icon">🍅</div>
                <h3>포모도로 타이머</h3>
                <p>25분 집중 + 5분 휴식으로 생산성을 극대화하세요</p>
            </a>
            
            <a href="/tools/random-advice" class="tool-card">
                <div class="tool-icon">🎲</div>
                <h3>랜덤 조언 생성기</h3>
                <p>1100가지 지혜로운 조언 중 하나를 받아보세요</p>
            </a>
            
            <a href="/tools/daily-fortune" class="tool-card">
                <div class="tool-icon">🔮</div>
                <h3>오늘의 운세</h3>
                <p>사랑, 돈, 건강 등 12가지 카테고리 운세를 확인하세요</p>
            </a>
            
            <a href="/tools/food-picker" class="tool-card">
                <div class="tool-icon">🍽️</div>
                <h3>랜덤 음식 추천기</h3>
                <p>오늘 뭐 먹을까? 고민을 한 번에 해결해드려요</p>
            </a>
            
            <a href="/tools/lotto-generator" class="tool-card">
                <div class="tool-icon">🎰</div>
                <h3>로또 번호 생성기</h3>
                <p>제외수 설정이 가능한 스마트 로또 번호 생성</p>
            </a>
        </div>
    </div>
</div>

<style>
/* 다크 테마 CSS */
body {
    background: #0d1117;
    color: #e6edf3;
    padding: 0;
    margin: 0;
}

.tools-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.tools-hero {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(135deg, #1f2937, #111827);
    margin: -20px -20px 40px;
    color: #e6edf3;
    border-radius: 0 0 20px 20px;
    position: relative;
    overflow: hidden;
}

.tools-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: 2.8rem;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}

.hero-subtitle {
    font-size: 1.3rem;
    opacity: 0.9;
    color: #9ca3af;
}

.tools-content {
    margin-bottom: 40px;
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    padding: 0;
    justify-items: center;
}

.tool-card {
    background: linear-gradient(135deg, #1f2937, #111827);
    border-radius: 20px;
    padding: 35px;
    text-decoration: none;
    color: #e6edf3;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid #374151;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 350px;
}

.tool-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    transform: scaleX(0);
    transition: transform 0.4s ease;
}

.tool-card:hover::before {
    transform: scaleX(1);
}

.tool-card:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    border-color: #4f46e5;
    background: linear-gradient(135deg, #252f3f, #1a202c);
}

.tool-icon {
    font-size: 4rem;
    margin-bottom: 25px;
    display: block;
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
}

.tool-card:hover .tool-icon {
    transform: scale(1.15);
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
}

.tool-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #f3f4f6;
    font-weight: 600;
    line-height: 1.3;
}

.tool-card p {
    color: #9ca3af;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
}

.tool-card:hover h3 {
    background: linear-gradient(135deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tool-card:hover p {
    color: #d1d5db;
}

/* 각 카드별 고유 그라데이션 */
.tool-card:nth-child(1) { 
    background: linear-gradient(135deg, #1e3a8a, #1e1b4b);
}
.tool-card:nth-child(2) { 
    background: linear-gradient(135deg, #b91c1c, #7c2d12);
}
.tool-card:nth-child(3) { 
    background: linear-gradient(135deg, #7c3aed, #5b21b6);
}
.tool-card:nth-child(4) { 
    background: linear-gradient(135deg, #c2410c, #9a3412);
}
.tool-card:nth-child(5) { 
    background: linear-gradient(135deg, #dc2626, #991b1b);
}
.tool-card:nth-child(6) { 
    background: linear-gradient(135deg, #059669, #064e3b);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
    .tools-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 25px;
    }
}

@media (max-width: 768px) {
    .tools-container {
        padding: 15px;
    }
    
    .tools-hero {
        padding: 40px 20px;
    }
    
    .hero-title {
        font-size: 2.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .tools-grid {
        grid-template-columns: 1fr;
        gap: 20px;
        max-width: 400px;
        margin: 0 auto;
    }
    
    .tool-card {
        padding: 30px;
    }
    
    .tool-icon {
        font-size: 3.5rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .tool-card {
        padding: 25px;
    }
    
    .tool-icon {
        font-size: 3rem;
    }
    
    .tool-card h3 {
        font-size: 1.3rem;
    }
}
</style>

<?php include_once '../includes/footer.php'; ?>