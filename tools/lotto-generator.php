<?php
$page_title = '로또 번호 생성기 - 유틸리티 - 짭샵';
$page_description = '제외수 설정 가능한 스마트 로또 번호 생성기! 랜덤 제외, 수동 제외 기능으로 더욱 정교한 번호 선택이 가능합니다.';
$page_keywords = '로또, 로또번호생성기, 로또번호, 제외수, 랜덤번호, 유틸리티, 짭샵';
$page_css = 'assets/css/lotto-generator.css';
$page_js = 'assets/js/lotto-generator.js';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="lotto-generator-container">
    <!-- 헤더 -->
    <div class="lotto-header">
        <h1>🎰 로또 번호 생성기</h1>
        <p>제외수를 설정하여 더욱 정교한 로또 번호를 생성하세요!</p>
    </div>

    <!-- 메인 컨트롤 -->
    <div class="lotto-main-controls">
        <div class="generate-section">
            <button id="generateBtn" class="generate-btn">
                🎲 로또 번호 생성
            </button>
            <div class="quick-actions">
                <button id="quickGenBtn" class="quick-btn">⚡ 빠른 생성 (1게임)</button>
                <button id="multiGenBtn" class="multi-btn">🎯 다중 생성 (5게임)</button>
            </div>
        </div>
    </div>

    <!-- 생성된 번호 표시 -->
    <div class="generated-numbers" id="generatedNumbers">
        <!-- JavaScript로 동적 생성 -->
    </div>

    <!-- 제외수 설정 -->
    <div class="exclude-section">
        <div class="exclude-header">
            <h3>🚫 제외수 설정</h3>
            <div class="exclude-controls">
                <button id="randomExcludeBtn" class="exclude-btn random">
                    🎲 랜덤 제외 (5개)
                </button>
                <button id="clearExcludeBtn" class="exclude-btn clear">
                    🗑️ 전체 해제
                </button>
                <span class="exclude-count">선택된 제외수: <span id="excludeCount">0</span>개</span>
            </div>
        </div>

        <!-- 번호 선택 그리드 -->
        <div class="numbers-grid" id="numbersGrid">
            <!-- 1-45번까지 JavaScript로 생성 -->
        </div>
    </div>

    <!-- 통계 및 옵션 -->
    <div class="lotto-options">
        <div class="statistics">
            <h4>📊 생성 통계</h4>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">총 생성 게임</span>
                    <span class="stat-value" id="totalGames">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">현재 제외수</span>
                    <span class="stat-value" id="currentExcludes">0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">생성 가능 조합</span>
                    <span class="stat-value" id="possibleCombos">8,145,060</span>
                </div>
            </div>
        </div>

        <div class="options">
            <h4>⚙️ 생성 옵션</h4>
            <div class="option-group">
                <label class="option-item">
                    <input type="checkbox" id="autoSort" checked>
                    <span class="checkmark"></span>
                    번호 자동 정렬
                </label>
                <label class="option-item">
                    <input type="checkbox" id="showStats">
                    <span class="checkmark"></span>
                    번호별 통계 표시
                </label>
                <label class="option-item">
                    <input type="checkbox" id="saveHistory" checked>
                    <span class="checkmark"></span>
                    생성 기록 저장
                </label>
            </div>
        </div>
    </div>

    <!-- 최근 생성 기록 -->
    <div class="history-section" id="historySection" style="display: none;">
        <div class="history-header">
            <h4>📋 최근 생성 기록</h4>
            <button id="clearHistoryBtn" class="clear-history-btn">🗑️ 기록 삭제</button>
        </div>
        <div class="history-list" id="historyList">
            <!-- JavaScript로 동적 생성 -->
        </div>
    </div>

    <!-- 도움말 -->
    <div class="help-section">
        <h4>💡 사용법</h4>
        <div class="help-content">
            <div class="help-item">
                <strong>🎲 기본 생성:</strong> "로또 번호 생성" 버튼을 눌러 1~45 중 6개 번호를 랜덤 생성
            </div>
            <div class="help-item">
                <strong>🚫 제외수 설정:</strong> 아래 번호판에서 원하지 않는 번호를 클릭하여 제외
            </div>
            <div class="help-item">
                <strong>🎲 랜덤 제외:</strong> "랜덤 제외" 버튼으로 임의의 번호 5개를 자동 제외
            </div>
            <div class="help-item">
                <strong>⚡ 빠른 생성:</strong> 제외수를 고려한 1게임 빠른 생성
            </div>
            <div class="help-item">
                <strong>🎯 다중 생성:</strong> 한 번에 5게임을 생성하여 다양한 조합 확인
            </div>
        </div>
    </div>
</div>

<!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>
