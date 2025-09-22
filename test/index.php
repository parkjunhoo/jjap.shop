<?php
$page_title = '심리테스트 모음 - 이름궁합, 월급루팡테스트 | 짭샵';
$page_description = '재미있고 정확한 심리테스트 모음! 이름 궁합 테스트로 연애 궁합도 확인, 월급루팡 테스트로 직장생활 스타일 분석. 무료로 즐기는 다양한 심리 분석 테스트.';
$page_keywords = '심리테스트, 이름 궁합 테스트, 월급루팡 테스트, 직장생활 테스트, 연애 궁합, 성격 테스트, 무료 심리테스트, 재미있는 테스트, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/test';
?>

<?php include_once '../includes/section-headers/test-header.php'; ?>

<div class="tests-container">
    <div class="tests-hero">
        <div class="hero-content">
            <h1 class="hero-title">🧠 심리테스트 모음</h1>
            <p class="hero-subtitle">나를 알아가는 재미있는 심리 테스트</p>
        </div>
    </div>

    <!-- Google AdSense 수평 광고 -->
    <?php include_once '../includes/ads/horizontal-ad.php'; ?>

    <div class="tests-content">
        <div class="tests-grid">
            <a href="/test/name-compatibility" class="test-card">
                <div class="test-icon">💕</div>
                <h3>이름 궁합 테스트</h3>
                <p>두 사람의 이름으로 알아보는 운명적 궁합도를 -10000%부터 +10000%까지 정확하게 분석해드려요</p>
            </a>
            
            <a href="/test/salary-lupang" class="test-card">
                <div class="test-icon">💰</div>
                <h3>월급루팡 테스트</h3>
                <p>당신의 직장 생활 스타일을 분석해보세요! 진정한 월급루팡부터 뼛속까지 노예까지 7단계로 구분해드립니다</p>
            </a>
        </div>
    </div>
</div>

<!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>

<style>
/* 기본 컨테이너 */
.tests-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.tests-hero {
    text-align: center;
    padding: 60px 0 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: -20px -20px 50px;
    color: white;
    border-radius: 0 0 25px 25px;
    position: relative;
    overflow: hidden;
}

.tests-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="30" cy="40" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    position: relative;
    z-index: 1;
}

.hero-subtitle {
    font-size: 1.3rem;
    opacity: 0.95;
    font-weight: 400;
    position: relative;
    z-index: 1;
}

.tests-content {
    background: transparent;
}

.tests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    padding: 0;
}

.test-card {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border-radius: 20px;
    padding: 40px 30px;
    text-decoration: none;
    color: inherit;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
}

.test-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
}

.test-card:hover::before {
    left: 100%;
}

.test-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    border-color: rgba(102, 126, 234, 0.3);
}

.test-icon {
    font-size: 4rem;
    margin-bottom: 25px;
    display: inline-block;
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.test-card h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: #2d3748;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.test-card p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #4a5568;
    margin: 0;
    font-weight: 400;
}

/* 로딩 애니메이션 효과 */
.test-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
}

.test-card:hover::after {
    transform: translateX(0);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .tests-container {
        padding: 10px;
    }
    
    .tests-hero {
        margin: -10px -10px 40px;
        padding: 40px 0 50px;
    }
    
    .hero-title {
        font-size: 2.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .tests-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .test-card {
        padding: 30px 25px;
    }
    
    .test-icon {
        font-size: 3.5rem;
        margin-bottom: 20px;
    }
    
    .test-card h3 {
        font-size: 1.5rem;
        margin-bottom: 12px;
    }
    
    .test-card p {
        font-size: 1rem;
        line-height: 1.6;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.9rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .test-card {
        padding: 25px 20px;
        margin-bottom: 15px;
    }
    
    .test-icon {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .test-card h3 {
        font-size: 1.3rem;
    }
    
    .test-card p {
        font-size: 0.95rem;
    }
}

/* 추가 시각적 효과 */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.test-card:active {
    animation: pulse 0.3s ease-in-out;
}
</style>

</main>
</body>
</html>
