<?php 
$page_title = '월급루팡 테스트 - 직장생활 스타일 분석 | 짭샵';
$page_description = '나는 진짜 월급루팡일까? 7가지 직장 상황으로 알아보는 월급루팡 테스트! SSS부터 F등급까지 포켓몬 카드 스타일 결과와 함께 재미있게 확인해보세요.';
$page_keywords = '월급루팡 테스트, 직장생활 테스트, 직장인 심리테스트, 월급 도둑 테스트, 회사 생활 테스트, 직장 스타일 분석, 재미있는 테스트, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/test/salary-lupang';
$page_css = ['assets/css/salary-lupang.css', 'assets/css/salary-lupang-mobile.css'];
$page_js = 'assets/js/salary-lupang.js';
?>

<?php include_once '../includes/section-headers/test-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="salary-lupang-container">
    <!-- 테스트 소개 섹션 -->
    <div class="intro-section">
        <div class="main-image-container">
            <img src="/assets/images/test/salarylupine/main.png" alt="월급루팡 테스트 메인 이미지" class="main-image">
            <div class="image-glow-effect"></div>
        </div>
        
        <h1 class="test-title">💰 월급루팡 테스트</h1>
        <p class="test-subtitle">당신의 직장 생활 스타일을 분석해드립니다!</p>
        <p class="test-description">
            7가지 상황별 질문을 통해 당신이 어떤 타입의 직장인인지 알아보세요.<br>
            과연 당신은 진정한 월급루팡일까요? 🎭
        </p>
        <button class="start-test-btn" onclick="startTest()">🚀 테스트 시작하기</button>
    </div>

    <!-- 테스트 진행 섹션 -->
    <div class="test-section" id="testSection" style="display: none;">
        <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
            <span class="progress-text" id="progressText">1/7</span>
        </div>

        <div class="question-card" id="questionCard">
            <div class="question-image-container" id="questionImageContainer">
                <img src="" alt="질문 이미지" id="questionImage" class="question-image">
                <div class="question-image-overlay"></div>
            </div>
            
            <div class="question-number" id="questionNumber">질문 1</div>
            <div class="question-text" id="questionText"></div>
            
            <div class="answers-grid" id="answersGrid">
                <!-- 답변 옵션들이 여기에 동적으로 생성됩니다 -->
            </div>
        </div>

        <!-- 자동 진행 시스템 - 버튼 제거됨 -->
    </div>

    <!-- 결과 섹션 -->
    <div class="result-section" id="resultSection" style="display: none;">
        <div class="result-card" id="resultCard">
            <div class="card-glow"></div>
            <div class="card-background"></div>
            
            <div class="card-header">
                <div class="card-title">월급루팡 테스트 결과</div>
                <div class="card-score" id="cardScore"></div>
            </div>
            
            <div class="card-content">
                <div class="result-image-container">
                    <img class="result-image" id="resultImage" alt="결과 이미지">
                    <div class="holographic-effect"></div>
                </div>
                
                <div class="result-grade" id="resultGrade"></div>
                <div class="result-title" id="resultTitle"></div>
                <div class="result-description" id="resultDescription"></div>
            </div>
            
            <div class="card-footer">
                <div class="result-stats">
                    <div class="stat-item">
                        <span class="stat-label">등급</span>
                        <span class="stat-value" id="gradeValue"></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">점수</span>
                        <span class="stat-value" id="scoreValue"></span>
                    </div>
                </div>
            </div>
        </div>

        <div class="result-actions">
            <button class="action-btn share-btn" onclick="shareResult()">
                📋 링크 복사
            </button>
            <button class="action-btn save-btn" onclick="saveResultImage()">
                💾 이미지 저장
            </button>
            <button class="action-btn retry-btn" onclick="retryTest()">
                🔄 다시 테스트
            </button>
        </div>
    </div>
</div>

<!-- 구조화된 데이터 -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "월급루팡 테스트",
  "description": "직장생활 스타일을 분석하는 재미있는 심리테스트",
  "url": "https://jjap.shop/test/salary-lupang",
  "applicationCategory": "Entertainment",
  "operatingSystem": "Web browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  },
  "provider": {
    "@type": "Organization",
    "name": "짭샵",
    "url": "https://jjap.shop"
  }
}
</script>

<link rel="stylesheet" href="/assets/css/salary-lupang.css">
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="/assets/js/salary-lupang.js"></script>

<?php include_once '../includes/footer.php'; ?>