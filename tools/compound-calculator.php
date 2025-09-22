<?php
$page_title = '복리 계산기 - 짭샵 유틸리티';
$page_description = '투자 수익률을 시뮬레이션하고 복리의 마법을 확인해보세요. 그래프로 시각화된 투자 성장 과정을 한눈에 볼 수 있습니다.';
$page_keywords = '복리 계산기, 투자 수익률, 투자 시뮬레이션, 복리 효과, 투자 계산, 재테크';
$page_css = 'assets/css/compound-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="compound-container">
    <div class="compound-header">
        <h1>📊 복리 계산기</h1>
        <p>복리의 마법으로 투자 수익률을 시뮬레이션하고 미래 자산을 예측해보세요</p>
    </div>

    <div class="compound-main">
        <div class="input-section">
            <div class="calculator-card">
                <h3>💰 투자 정보 입력</h3>
                <form id="compoundForm" class="compound-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="initialAmount">초기 투자금</label>
                            <div class="input-with-unit">
                                <input type="number" id="initialAmount" value="1000000" min="0" step="10000" required>
                                <span class="unit">원</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="monthlyContribution">월 적립금</label>
                            <div class="input-with-unit">
                                <input type="number" id="monthlyContribution" value="300000" min="0" step="10000">
                                <span class="unit">원</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="annualReturn">연 수익률</label>
                            <div class="input-with-unit">
                                <input type="number" id="annualReturn" value="7" min="0" max="50" step="0.1" required>
                                <span class="unit">%</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="investmentPeriod">투자 기간</label>
                            <div class="input-with-unit">
                                <input type="number" id="investmentPeriod" value="10" min="1" max="50" required>
                                <span class="unit">년</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="compoundFrequency">복리 적용 주기</label>
                            <select id="compoundFrequency">
                                <option value="1">연 1회</option>
                                <option value="4">분기별 (연 4회)</option>
                                <option value="12" selected>월별 (연 12회)</option>
                                <option value="365">일별 (연 365회)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="taxRate">세율 (선택)</label>
                            <div class="input-with-unit">
                                <input type="number" id="taxRate" value="15.4" min="0" max="50" step="0.1">
                                <span class="unit">%</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="inflationRate">물가상승률 (선택)</label>
                        <div class="input-with-unit">
                            <input type="number" id="inflationRate" value="2.5" min="0" max="20" step="0.1">
                            <span class="unit">%</span>
                        </div>
                        <small>실질 구매력을 계산하기 위한 물가상승률</small>
                    </div>

                    <button type="submit" class="calculate-btn">
                        <span class="btn-icon">🧮</span>
                        <span class="btn-text">계산하기</span>
                    </button>
                </form>
            </div>

            <div class="presets-card">
                <h3>💡 투자 시나리오</h3>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="conservative">
                        <div class="preset-info">
                            <div class="preset-name">안정형</div>
                            <div class="preset-desc">연 4% • 10년</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="balanced">
                        <div class="preset-info">
                            <div class="preset-name">균형형</div>
                            <div class="preset-desc">연 7% • 15년</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="aggressive">
                        <div class="preset-info">
                            <div class="preset-name">적극형</div>
                            <div class="preset-desc">연 10% • 20년</div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="retirement">
                        <div class="preset-info">
                            <div class="preset-name">은퇴준비</div>
                            <div class="preset-desc">연 6% • 30년</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="resultCard" class="result-card" style="display: none;">
                <div class="result-header">
                    <h3>📈 투자 결과</h3>
                    <div class="result-actions">
                        <button id="saveResultBtn" class="action-btn">💾 저장</button>
                        <button id="shareResultBtn" class="action-btn">🔗 공유</button>
                        <button id="compareBtn" class="action-btn">⚖️ 비교</button>
                    </div>
                </div>

                <div class="key-metrics">
                    <div class="metric-card primary">
                        <div class="metric-label">최종 자산</div>
                        <div class="metric-value" id="finalAmount">0원</div>
                        <div class="metric-change" id="totalReturn">+0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">총 투자원금</div>
                        <div class="metric-value" id="totalInvestment">0원</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">투자 수익</div>
                        <div class="metric-value" id="totalProfit">0원</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">실질 구매력</div>
                        <div class="metric-value" id="realPurchasingPower">0원</div>
                    </div>
                </div>

                <div class="chart-section">
                    <canvas id="growthChart" width="800" height="400"></canvas>
                </div>

                <div class="breakdown-section">
                    <div class="breakdown-header">
                        <h4>📋 연도별 상세 내역</h4>
                        <div class="view-options">
                            <button class="view-btn active" data-view="table">표 보기</button>
                            <button class="view-btn" data-view="summary">요약 보기</button>
                        </div>
                    </div>
                    <div id="breakdownTable" class="breakdown-table"></div>
                    <div id="summaryView" class="summary-view" style="display: none;"></div>
                </div>
            </div>

            <div class="tips-section">
                <h3>💡 복리 투자 팁</h3>
                <div class="tips-grid">
                    <div class="tip-card">
                        <div class="tip-icon">⏰</div>
                        <div class="tip-content">
                            <h4>시간의 힘</h4>
                            <p>투자에서 가장 중요한 것은 시간입니다. 일찍 시작할수록 복리 효과가 극대화됩니다.</p>
                        </div>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">📈</div>
                        <div class="tip-content">
                            <h4>꾸준한 적립</h4>
                            <p>매월 일정 금액을 꾸준히 투자하는 것이 장기적으로 더 안정적인 수익을 가져다줍니다.</p>
                        </div>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">🎯</div>
                        <div class="tip-content">
                            <h4>현실적 목표</h4>
                            <p>과도하게 높은 수익률보다는 현실적이고 달성 가능한 수익률을 목표로 하세요.</p>
                        </div>
                    </div>
                    <div class="tip-card">
                        <div class="tip-icon">🛡️</div>
                        <div class="tip-content">
                            <h4>분산 투자</h4>
                            <p>위험을 줄이기 위해 여러 투자처에 분산하여 투자하는 것이 중요합니다.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="compound-features">
        <div class="comparison-section">
            <div class="section-header">
                <h3>⚖️ 시나리오 비교</h3>
                <button id="clearComparisonsBtn" class="btn-clear">비교 초기화</button>
            </div>
            <div id="comparisonList" class="comparison-list">
                <div class="empty-comparison">
                    <div class="empty-icon">⚖️</div>
                    <p>여러 투자 시나리오를 계산하고<br>"비교" 버튼을 눌러 비교해보세요!</p>
                </div>
            </div>
        </div>

        <div class="saved-calculations">
            <div class="section-header">
                <h3>💾 저장된 계산</h3>
                <button id="clearSavedBtn" class="btn-clear">모두 삭제</button>
            </div>
            <div id="savedCalculationsList" class="saved-list">
                <div class="empty-saved">
                    <div class="empty-icon">💰</div>
                    <p>계산 결과를 저장하여<br>나중에 다시 확인해보세요!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 비교 모달 -->
    <div id="comparisonModal" class="modal">
        <div class="modal-content large">
            <div class="modal-header">
                <h3>⚖️ 시나리오 비교</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <canvas id="comparisonChart" width="900" height="500"></canvas>
                <div id="comparisonTable" class="comparison-table"></div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/compound-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
