<?php
$page_title = '이름 궁합 테스트 - 짭샵';
$page_description = '두 사람의 이름으로 알아보는 운명의 궁합도! -10000%부터 +10000%까지 정확한 궁합 분석을 해드립니다.';
$page_keywords = '이름 궁합, 궁합 테스트, 이름 궁합 계산기, 사랑 궁합, 연애 궁합, 이름으로 보는 궁합';
$page_css = 'assets/css/name-compatibility.css';
$page_js = 'assets/js/name-compatibility.js';
?>

<?php include_once '../includes/section-headers/test-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="compatibility-container">
    <div class="compatibility-hero">
        <div class="hero-content">
            <h1 class="hero-title">💕 이름 궁합 테스트</h1>
            <p class="hero-subtitle">두 사람의 이름으로 알아보는 운명적 궁합도!</p>
        </div>
    </div>

    <div class="name-compatibility-test">
        <div class="compatibility-header">
            <div class="header-icon">💕</div>
            <h2>이름 궁합 테스트</h2>
            <p>두 사람의 이름으로 알아보는 운명의 궁합도!</p>
        </div>

        <div class="name-input-section">
            <div class="input-group">
                <div class="name-input-wrapper">
                    <label for="name1">첫 번째 이름</label>
                    <input type="text" id="name1" placeholder="이름을 입력하세요" maxlength="10">
                </div>
                
                <div class="vs-divider">
                    <span>VS</span>
                </div>
                
                <div class="name-input-wrapper">
                    <label for="name2">두 번째 이름</label>
                    <input type="text" id="name2" placeholder="이름을 입력하세요" maxlength="10">
                </div>
            </div>
            
            <button id="testCompatibilityBtn" class="compatibility-btn">
                <span>💖 궁합 테스트하기 💖</span>
            </button>
        </div>

        <div id="compatibilityResult" class="result-section" style="display: none;">
            <div class="result-header">
                <h3 id="resultTitle"></h3>
                <div id="compatibilityPercentage" class="percentage-display"></div>
                <div id="emotionEffects" class="emotion-effects"></div>
            </div>
            
            <div class="result-content">
                <div id="compatibilityMessage" class="compatibility-message"></div>
                <div class="compatibility-details">
                    <div class="detail-item">
                        <span class="detail-label">궁합 점수</span>
                        <span id="detailScore" class="detail-value"></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">궁합 등급</span>
                        <span id="detailGrade" class="detail-value"></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">추천도</span>
                        <span id="detailRecommendation" class="detail-value"></span>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button id="saveImageBtn" class="save-image-btn">📷 이미지 저장</button>
                    <button id="shareUrlBtn" class="share-url-btn">🔗 링크 공유</button>
                    <button id="retestBtn" class="retest-btn">다시 테스트하기</button>
                </div>
            </div>
        </div>
    </div>

    <div class="test-notice">
        <div class="notice-content">
            <h3>🔔 테스트 결과에 대한 안내</h3>
            <p>모든 심리테스트 결과는 재미와 참고용이며, 전문적인 심리상담이나 진단을 대체할 수 없습니다.</p>
        </div>
    </div>
</div>

    <!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>

<!-- html2canvas 라이브러리 -->
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>

</main>
</body>
</html>
