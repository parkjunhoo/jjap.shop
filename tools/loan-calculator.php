<?php
$page_title = '할부/대출 계산기 - 짭샵 유틸리티';
$page_description = '대출 이자, 월 상환액을 계산하고 상환 계획을 세우세요. 여러 대출 상품을 비교하고 조기 상환 효과를 분석해보세요.';
$page_keywords = '대출 계산기, 할부 계산기, 월 상환액, 이자 계산, 대출 비교, 조기 상환, 원리금 균등, 원금 균등';
$page_css = 'assets/css/loan-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="loan-container">
    <div class="loan-header">
        <h1>🏦 할부/대출 계산기</h1>
        <p>대출 조건을 분석하고 최적의 상환 계획을 세워보세요</p>
    </div>

    <div class="loan-main">
        <div class="input-section">
            <div class="loan-input-card">
                <h3>💰 대출 조건 입력</h3>
                <div class="loan-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="loanAmount">대출 원금</label>
                            <div class="input-with-unit">
                                <input type="number" id="loanAmount" value="100000000" min="1000000" step="1000000" required>
                                <span class="unit">원</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="interestRate">연이자율</label>
                            <div class="input-with-unit">
                                <input type="number" id="interestRate" value="3.5" min="0" max="20" step="0.1" required>
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="loanTerm">대출 기간</label>
                            <div class="input-with-unit">
                                <input type="number" id="loanTerm" value="30" min="1" max="50" step="1" required>
                                <span class="unit">년</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="repaymentType">상환 방식</label>
                            <select id="repaymentType" class="custom-select">
                                <option value="equal_payment">원리금 균등상환</option>
                                <option value="equal_principal">원금 균등상환</option>
                                <option value="interest_only">이자만 납부</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="startDate">대출 시작일</label>
                            <input type="date" id="startDate" class="date-input">
                        </div>
                        <div class="form-group">
                            <label for="bonusPayment">보너스 상환 (선택)</label>
                            <div class="input-with-unit">
                                <input type="number" id="bonusPayment" value="0" min="0" step="100000">
                                <span class="unit">원/년</span>
                            </div>
                        </div>
                    </div>

                    <button id="calculateBtn" class="calculate-btn">
                        <span class="btn-icon">🧮</span>
                        <span class="btn-text">상환액 계산하기</span>
                    </button>
                </div>
            </div>

            <div class="preset-card">
                <h3>🏠 대출 상품 예시</h3>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="house">
                        <div class="preset-info">
                            <div class="preset-name">주택담보대출</div>
                            <div class="preset-desc">1억원 / 30년 / 3.5%</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="car">
                        <div class="preset-info">
                            <div class="preset-name">자동차대출</div>
                            <div class="preset-desc">5천만원 / 5년 / 4.8%</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="credit">
                        <div class="preset-info">
                            <div class="preset-name">신용대출</div>
                            <div class="preset-desc">3천만원 / 3년 / 6.5%</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="jeonse">
                        <div class="preset-info">
                            <div class="preset-name">전세자금대출</div>
                            <div class="preset-desc">5억원 / 20년 / 2.8%</div>
                        </div>
                    </button>
                </div>
            </div>

            <div class="comparison-card">
                <h3>⚖️ 대출 상품 비교</h3>
                <div class="comparison-controls">
                    <button id="addLoanBtn" class="add-loan-btn">+ 대출 상품 추가</button>
                    <button id="compareBtn" class="compare-btn" style="display: none;">비교 분석</button>
                </div>
                <div id="loanList" class="loan-list"></div>
            </div>
        </div>

        <div class="result-section">
            <div id="calculationResult" class="calculation-result" style="display: none;">
                <div class="result-header">
                    <h3>📊 계산 결과</h3>
                    <div class="result-actions">
                        <button id="saveResultBtn" class="action-btn">💾 저장</button>
                        <button id="downloadScheduleBtn" class="action-btn">📄 일정표</button>
                        <button id="earlyPaymentBtn" class="action-btn">⚡ 조기상환</button>
                    </div>
                </div>

                <div class="summary-cards">
                    <div class="summary-card primary">
                        <div class="summary-label">월 상환액</div>
                        <div class="summary-value" id="monthlyPayment">0원</div>
                        <div class="summary-change">고정 상환액</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">총 이자</div>
                        <div class="summary-value" id="totalInterest">0원</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">총 상환액</div>
                        <div class="summary-value" id="totalPayment">0원</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-label">이자 비율</div>
                        <div class="summary-value" id="interestRatio">0%</div>
                    </div>
                </div>

                <div class="chart-section">
                    <div class="chart-tabs">
                        <button class="chart-tab active" data-chart="payment">📈 상환 추이</button>
                        <button class="chart-tab" data-chart="balance">💰 잔액 변화</button>
                        <button class="chart-tab" data-chart="pie">🥧 원금/이자 비율</button>
                    </div>
                    <div class="chart-container">
                        <canvas id="loanChart" width="800" height="400"></canvas>
                    </div>
                </div>

                <div class="schedule-section">
                    <div class="schedule-header">
                        <h4>📅 상환 일정표</h4>
                        <div class="schedule-controls">
                            <select id="scheduleView" class="schedule-select">
                                <option value="yearly">연도별 보기</option>
                                <option value="monthly">월별 보기 (처음 24개월)</option>
                                <option value="all">전체 보기</option>
                            </select>
                        </div>
                    </div>
                    <div class="schedule-container">
                        <div id="repaymentSchedule" class="schedule-table"></div>
                    </div>
                </div>
            </div>

            <div class="early-payment-modal" id="earlyPaymentModal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>⚡ 조기상환 시뮬레이션</h3>
                        <button id="closeEarlyPaymentBtn" class="close-btn">✕</button>
                    </div>
                    
                    <div class="modal-body">
                        <div class="early-payment-form">
                            <div class="form-group">
                                <label>조기상환 방식</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="earlyType" value="partial" checked>
                                        <span>일부 조기상환</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="earlyType" value="full">
                                        <span>전체 조기상환</span>
                                    </label>
                                </div>
                            </div>

                            <div class="form-group" id="partialPaymentGroup">
                                <label for="earlyAmount">조기상환 금액</label>
                                <div class="input-with-unit">
                                    <input type="number" id="earlyAmount" value="10000000" min="1000000" step="1000000">
                                    <span class="unit">원</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="earlyMonth">조기상환 시점</label>
                                <div class="input-with-unit">
                                    <input type="number" id="earlyMonth" value="60" min="1" max="360" step="1">
                                    <span class="unit">개월 후</span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>상환 후 옵션</label>
                                <div class="radio-group">
                                    <label class="radio-label">
                                        <input type="radio" name="afterEarly" value="reduce_term" checked>
                                        <span>기간 단축</span>
                                    </label>
                                    <label class="radio-label">
                                        <input type="radio" name="afterEarly" value="reduce_payment">
                                        <span>월 상환액 감소</span>
                                    </label>
                                </div>
                            </div>

                            <button id="simulateEarlyBtn" class="simulate-btn">시뮬레이션 실행</button>
                        </div>

                        <div id="earlyPaymentResult" class="early-result" style="display: none;">
                            <h4>💡 조기상환 효과</h4>
                            <div class="effect-comparison">
                                <div class="effect-before">
                                    <h5>조기상환 전</h5>
                                    <div id="beforeEarly"></div>
                                </div>
                                <div class="effect-after">
                                    <h5>조기상환 후</h5>
                                    <div id="afterEarly"></div>
                                </div>
                                <div class="effect-savings">
                                    <h5>절약 효과</h5>
                                    <div id="earlySavings"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="comparison-result" id="comparisonResult" style="display: none;">
                <div class="result-header">
                    <h3>⚖️ 대출 상품 비교</h3>
                    <button id="closeComparisonBtn" class="close-btn">✕</button>
                </div>
                <div id="comparisonTable" class="comparison-table"></div>
            </div>
        </div>
    </div>

    <div class="loan-features">
        <div class="tips-section">
            <h3>💡 대출 관리 팁</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">📊</div>
                    <div class="tip-content">
                        <h4>이자율 비교</h4>
                        <p>여러 금융기관의 대출 상품을 꼼꼼히 비교하세요. 0.1%만 낮아도 큰 차이가 납니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">⚡</div>
                    <div class="tip-content">
                        <h4>조기상환 전략</h4>
                        <p>여유 자금이 생기면 조기상환을 고려하세요. 특히 초기에는 이자 절약 효과가 큽니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🔄</div>
                    <div class="tip-content">
                        <h4>중도상환 수수료</h4>
                        <p>조기상환 시 수수료를 확인하고, 절약되는 이자와 비교해 결정하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">📈</div>
                    <div class="tip-content">
                        <h4>변동금리 주의</h4>
                        <p>변동금리 대출은 금리 상승 위험을 고려해 여유 있는 상환 계획을 세우세요.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="history-section">
            <div class="section-header">
                <h3>📈 계산 기록</h3>
                <button id="clearLoanHistoryBtn" class="btn-clear">기록 삭제</button>
            </div>
            <div id="loanHistory" class="loan-history">
                <div class="empty-history">
                    <div class="empty-icon">🏦</div>
                    <p>아직 계산 기록이 없습니다.<br>대출을 계산하면 기록이 저장됩니다!</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/loan-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
