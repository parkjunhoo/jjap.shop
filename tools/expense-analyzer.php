<?php
$page_title = '생활비 분석기 - 짭샵 유틸리티';
$page_description = '월 지출을 카테고리별로 분석하고 절약 목표를 세우세요. 가계부 분석과 예산 관리로 스마트한 재정관리를 시작해보세요.';
$page_keywords = '생활비 분석, 가계부, 예산 관리, 지출 분석, 절약, 재정 관리, 소비 패턴';
$page_css = 'assets/css/expense-analyzer.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="expense-container">
    <div class="expense-header">
        <h1>📋 생활비 분석기</h1>
        <p>월 지출을 체계적으로 분석하고 스마트한 절약 계획을 세워보세요</p>
    </div>

    <div class="expense-main">
        <div class="input-section">
            <div class="income-card">
                <h3>💰 수입 정보</h3>
                <div class="income-form">
                    <div class="form-group">
                        <label for="monthlyIncome">월 수입</label>
                        <div class="input-with-unit">
                            <input type="number" id="monthlyIncome" value="3500000" min="0" step="10000" required>
                            <span class="unit">원</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="additionalIncome">기타 수입 (선택)</label>
                        <div class="input-with-unit">
                            <input type="number" id="additionalIncome" value="0" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="expenses-card">
                <h3>💸 지출 입력</h3>
                <div class="expense-categories">
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🏠</span>
                            <span class="category-name">주거비</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="housing" value="1000000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🍽️</span>
                            <span class="category-name">식비</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="food" value="400000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🚗</span>
                            <span class="category-name">교통비</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="transportation" value="200000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🛒</span>
                            <span class="category-name">생필품</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="necessities" value="150000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">👕</span>
                            <span class="category-name">의류</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="clothing" value="100000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🏥</span>
                            <span class="category-name">의료비</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="medical" value="50000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">🎮</span>
                            <span class="category-name">여가/문화</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="entertainment" value="300000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">📚</span>
                            <span class="category-name">교육</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="education" value="100000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="category-item">
                        <div class="category-header">
                            <span class="category-icon">💳</span>
                            <span class="category-name">기타</span>
                        </div>
                        <div class="input-with-unit">
                            <input type="number" id="others" value="100000" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                </div>

                <button id="analyzeBtn" class="analyze-btn">
                    <span class="btn-icon">📊</span>
                    <span class="btn-text">지출 분석하기</span>
                </button>
            </div>

            <div class="preset-card">
                <h3>👥 평균 지출 참고</h3>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="single">
                        <div class="preset-info">
                            <div class="preset-name">1인 가구</div>
                            <div class="preset-desc">월 평균 지출</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="couple">
                        <div class="preset-info">
                            <div class="preset-name">2인 가구</div>
                            <div class="preset-desc">부부 기준</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="family">
                        <div class="preset-info">
                            <div class="preset-name">4인 가구</div>
                            <div class="preset-desc">자녀 2명 기준</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="analysisResult" class="analysis-result" style="display: none;">
                <div class="result-header">
                    <h3>📈 지출 분석 결과</h3>
                    <div class="result-actions">
                        <button id="saveAnalysisBtn" class="action-btn">💾 저장</button>
                        <button id="setBudgetBtn" class="action-btn">🎯 예산설정</button>
                        <button id="downloadReportBtn" class="action-btn">📄 리포트</button>
                    </div>
                </div>

                <div class="summary-cards">
                    <div class="summary-card primary">
                        <div class="summary-label">총 지출</div>
                        <div class="summary-value" id="totalExpense">0원</div>
                        <div class="summary-change" id="expenseRatio">월 수입 대비</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">남는 돈</div>
                        <div class="summary-value" id="remainingMoney">0원</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">저축률</div>
                        <div class="summary-value" id="savingsRate">0%</div>
                    </div>
                </div>

                <div class="chart-section">
                    <div class="chart-tabs">
                        <button class="chart-tab active" data-chart="pie">🥧 비율</button>
                        <button class="chart-tab" data-chart="bar">📊 금액</button>
                        <button class="chart-tab" data-chart="comparison">⚖️ 평균비교</button>
                    </div>
                    <div class="chart-container">
                        <canvas id="expenseChart" width="600" height="400"></canvas>
                    </div>
                </div>

                <div class="details-section">
                    <div class="category-details" id="categoryDetails"></div>
                </div>

                <div class="recommendations-section">
                    <h4>💡 절약 추천사항</h4>
                    <div id="savingTips" class="saving-tips"></div>
                </div>
            </div>

            <div class="budget-planner" id="budgetPlanner" style="display: none;">
                <div class="planner-header">
                    <h3>🎯 예산 계획</h3>
                    <button id="closeBudgetBtn" class="close-btn">✕</button>
                </div>
                
                <div class="budget-form">
                    <div class="target-saving">
                        <label for="targetSaving">목표 저축액</label>
                        <div class="input-with-unit">
                            <input type="number" id="targetSaving" min="0" step="10000">
                            <span class="unit">원</span>
                        </div>
                    </div>
                    
                    <div class="budget-categories" id="budgetCategories"></div>
                    
                    <div class="budget-summary">
                        <div class="budget-result">
                            <span>조정된 총 지출: </span>
                            <span id="adjustedTotal">0원</span>
                        </div>
                        <div class="budget-result">
                            <span>예상 저축액: </span>
                            <span id="projectedSavings">0원</span>
                        </div>
                    </div>
                    
                    <button id="applyBudgetBtn" class="apply-budget-btn">예산 적용하기</button>
                </div>
            </div>
        </div>
    </div>

    <div class="expense-features">
        <div class="history-section">
            <div class="section-header">
                <h3>📈 분석 기록</h3>
                <button id="clearHistoryBtn" class="btn-clear">기록 삭제</button>
            </div>
            <div id="analysisHistory" class="analysis-history">
                <div class="empty-history">
                    <div class="empty-icon">📊</div>
                    <p>아직 분석 기록이 없습니다.<br>지출을 분석하면 기록이 저장됩니다!</p>
                </div>
            </div>
        </div>

        <div class="tips-section">
            <h3>💡 절약 꿀팁</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">🏠</div>
                    <div class="tip-content">
                        <h4>주거비 절약</h4>
                        <p>월세보다는 전세, 불필요한 옵션 제거, 에너지 효율 개선으로 관리비를 줄여보세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🍽️</div>
                    <div class="tip-content">
                        <h4>식비 절약</h4>
                        <p>집밥 늘리기, 할인 시간대 장보기, 냉장고 재료 활용한 요리로 식비를 줄일 수 있어요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🚗</div>
                    <div class="tip-content">
                        <h4>교통비 절약</h4>
                        <p>대중교통 정기권, 자전거 이용, 가까운 거리는 걷기로 교통비를 절약해보세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">💡</div>
                    <div class="tip-content">
                        <h4>스마트 소비</h4>
                        <p>가격 비교 앱 활용, 할인 쿠폰 사용, 필요/욕구 구분하여 현명하게 소비하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/expense-analyzer.js"></script>

<?php include_once '../includes/footer.php'; ?>
