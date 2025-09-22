<?php
$page_title = 'BMI & 기초대사율 계산기 - 짭샵 유틸리티';
$page_description = '나의 건강 지수를 확인하고 맞춤형 건강 팁을 얻으세요. BMI, 기초대사율, 이상체중, 일일 칼로리 요구량을 계산해드립니다.';
$page_keywords = 'BMI 계산기, 기초대사율, 건강 지수, 체질량 지수, 다이어트, 칼로리, 이상체중, 건강관리';
$page_css = 'assets/css/bmi-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="bmi-container">
    <div class="bmi-header">
        <h1>⚖️ BMI & 기초대사율 계산기</h1>
        <p>체질량지수와 기초대사율을 계산하여 개인 맞춤형 건강 관리 계획을 세워보세요</p>
    </div>

    <div class="bmi-main">
        <div class="input-section">
            <div class="personal-info-card">
                <h3>👤 개인정보 입력</h3>
                <div class="info-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="height">키 (cm)</label>
                            <div class="input-with-unit">
                                <input type="number" id="height" min="100" max="250" step="0.1" placeholder="170" class="info-input">
                                <span class="unit">cm</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="weight">몸무게 (kg)</label>
                            <div class="input-with-unit">
                                <input type="number" id="weight" min="30" max="300" step="0.1" placeholder="65" class="info-input">
                                <span class="unit">kg</span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="age">나이</label>
                            <div class="input-with-unit">
                                <input type="number" id="age" min="10" max="100" placeholder="25" class="info-input">
                                <span class="unit">세</span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="gender">성별</label>
                            <div class="gender-select">
                                <button type="button" class="gender-btn" data-gender="male">
                                    <span class="gender-icon">♂️</span>
                                    <span>남성</span>
                                </button>
                                <button type="button" class="gender-btn" data-gender="female">
                                    <span class="gender-icon">♀️</span>
                                    <span>여성</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group full-width">
                            <label for="activityLevel">활동 수준</label>
                            <select id="activityLevel" class="activity-select">
                                <option value="1.2">좌식 생활 (운동 거의 안함)</option>
                                <option value="1.375" selected>가벼운 활동 (주 1-3회 운동)</option>
                                <option value="1.55">보통 활동 (주 3-5회 운동)</option>
                                <option value="1.725">활발한 활동 (주 6-7회 운동)</option>
                                <option value="1.9">매우 활발 (하루 2회 운동)</option>
                            </select>
                        </div>
                    </div>

                    <button id="calculateBMI" class="calculate-btn">
                        <span class="btn-icon">📊</span>
                        <span class="btn-text">건강 지수 계산하기</span>
                    </button>
                </div>
            </div>

            <div class="quick-check-card">
                <h3>⚡ 빠른 체크</h3>
                <div class="quick-buttons">
                    <button class="quick-btn" data-preset="underweight">
                        <div class="quick-info">
                            <div class="quick-icon">📏</div>
                            <div class="quick-text">
                                <strong>저체중</strong>
                                <small>BMI 18.5 미만</small>
                            </div>
                        </div>
                    </button>
                    <button class="quick-btn" data-preset="normal">
                        <div class="quick-info">
                            <div class="quick-icon">✅</div>
                            <div class="quick-text">
                                <strong>정상</strong>
                                <small>BMI 18.5-23</small>
                            </div>
                        </div>
                    </button>
                    <button class="quick-btn" data-preset="overweight">
                        <div class="quick-info">
                            <div class="quick-icon">⚠️</div>
                            <div class="quick-text">
                                <strong>과체중</strong>
                                <small>BMI 23-25</small>
                            </div>
                        </div>
                    </button>
                    <button class="quick-btn" data-preset="obese">
                        <div class="quick-info">
                            <div class="quick-icon">🚨</div>
                            <div class="quick-text">
                                <strong>비만</strong>
                                <small>BMI 25 이상</small>
                            </div>
                        </div>
                    </button>
                </div>
                <p class="quick-note">* WHO 아시아-태평양 기준</p>
            </div>

            <div class="goal-setting-card" id="goalCard" style="display: none;">
                <h3>🎯 목표 설정</h3>
                <div class="goal-form">
                    <div class="form-group">
                        <label for="targetWeight">목표 체중 (kg)</label>
                        <div class="input-with-unit">
                            <input type="number" id="targetWeight" min="30" max="300" step="0.1" class="info-input">
                            <span class="unit">kg</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="timeframe">목표 기간</label>
                        <select id="timeframe" class="timeframe-select">
                            <option value="1">1개월</option>
                            <option value="2">2개월</option>
                            <option value="3" selected>3개월</option>
                            <option value="6">6개월</option>
                            <option value="12">12개월</option>
                        </select>
                    </div>
                    <button id="calculateGoal" class="goal-btn">목표 분석하기</button>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="bmiResult" class="bmi-result" style="display: none;">
                <div class="result-header">
                    <h3 id="resultTitle">📊 건강 분석 결과</h3>
                    <div class="result-actions">
                        <button id="saveResult" class="action-btn">💾 저장</button>
                        <button id="shareResult" class="action-btn">📤 공유</button>
                        <button id="printResult" class="action-btn">🖨️ 출력</button>
                    </div>
                </div>

                <div class="bmi-display">
                    <div class="bmi-gauge">
                        <div class="gauge-container">
                            <canvas id="bmiGauge" width="300" height="200"></canvas>
                        </div>
                        <div class="bmi-value">
                            <div id="bmiNumber" class="bmi-number">22.5</div>
                            <div id="bmiStatus" class="bmi-status">정상</div>
                        </div>
                    </div>
                </div>

                <div class="health-metrics">
                    <div class="metrics-grid">
                        <div class="metric-card primary">
                            <div class="metric-icon">⚖️</div>
                            <div class="metric-content">
                                <div class="metric-value" id="currentBMI">22.5</div>
                                <div class="metric-label">현재 BMI</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">🔥</div>
                            <div class="metric-content">
                                <div class="metric-value" id="bmrValue">1,580</div>
                                <div class="metric-label">기초대사율</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">💪</div>
                            <div class="metric-content">
                                <div class="metric-value" id="idealWeight">65</div>
                                <div class="metric-label">이상체중</div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon">🍽️</div>
                            <div class="metric-content">
                                <div class="metric-value" id="dailyCalories">2,200</div>
                                <div class="metric-label">권장 칼로리</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="detailed-analysis">
                    <div class="analysis-tabs">
                        <button class="tab-btn active" data-tab="overview">📋 종합분석</button>
                        <button class="tab-btn" data-tab="nutrition">🍎 영양관리</button>
                        <button class="tab-btn" data-tab="exercise">🏃 운동계획</button>
                        <button class="tab-btn" data-tab="goal">🎯 목표관리</button>
                    </div>

                    <div class="tab-content active" id="overviewTab">
                        <div class="overview-grid">
                            <div class="overview-item">
                                <h4>📊 현재 상태</h4>
                                <div id="currentStatus" class="status-content"></div>
                            </div>
                            <div class="overview-item">
                                <h4>⚖️ 체중 범위</h4>
                                <div id="weightRange" class="range-content"></div>
                            </div>
                            <div class="overview-item">
                                <h4>🎯 권장사항</h4>
                                <div id="recommendations" class="recommendations-content"></div>
                            </div>
                            <div class="overview-item">
                                <h4>⚠️ 주의사항</h4>
                                <div id="healthWarnings" class="warnings-content"></div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="nutritionTab">
                        <div class="nutrition-grid">
                            <div class="nutrition-card">
                                <h4>🔥 일일 칼로리</h4>
                                <div id="calorieBreakdown" class="calorie-breakdown"></div>
                            </div>
                            <div class="nutrition-card">
                                <h4>🍽️ 영양소 비율</h4>
                                <div id="macronutrients" class="macro-chart">
                                    <canvas id="macroChart" width="200" height="200"></canvas>
                                </div>
                            </div>
                            <div class="nutrition-card full-width">
                                <h4>💡 식단 가이드</h4>
                                <div id="dietGuide" class="diet-guide"></div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="exerciseTab">
                        <div class="exercise-grid">
                            <div class="exercise-card">
                                <h4>🏃 권장 운동</h4>
                                <div id="exerciseRecommendations" class="exercise-list"></div>
                            </div>
                            <div class="exercise-card">
                                <h4>⏱️ 운동 계획</h4>
                                <div id="workoutPlan" class="workout-plan"></div>
                            </div>
                            <div class="exercise-card full-width">
                                <h4>📈 운동 효과</h4>
                                <div id="exerciseEffects" class="exercise-effects"></div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-content" id="goalTab">
                        <div id="goalAnalysis" class="goal-analysis">
                            <p class="goal-message">목표 체중을 설정하면 구체적인 계획을 제공해드립니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="welcome-card" id="welcomeCard">
                <div class="welcome-content">
                    <div class="welcome-icon">⚖️</div>
                    <h3>나의 건강 지수를 확인하세요!</h3>
                    <p>키, 몸무게, 나이, 성별을 입력하면<br>정확한 BMI와 맞춤형 건강 정보를 제공해드립니다.</p>
                    <div class="health-indicators">
                        <div class="indicator-item">
                            <span class="indicator-icon">📊</span>
                            <span>체질량지수 (BMI)</span>
                        </div>
                        <div class="indicator-item">
                            <span class="indicator-icon">🔥</span>
                            <span>기초대사율 (BMR)</span>
                        </div>
                        <div class="indicator-item">
                            <span class="indicator-icon">🎯</span>
                            <span>개인 맞춤 목표</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bmi-features">
        <div class="history-section">
            <div class="section-header">
                <h3>📈 건강 기록</h3>
                <button id="clearHistory" class="btn-clear">기록 삭제</button>
            </div>
            <div id="healthHistory" class="health-history">
                <div class="empty-history">
                    <div class="empty-icon">📊</div>
                    <p>아직 건강 기록이 없습니다.<br>첫 번째 건강 측정을 시작해보세요!</p>
                </div>
            </div>
        </div>

        <div class="tips-section">
            <h3>💡 건강 관리 가이드</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">🍎</div>
                    <div class="tip-content">
                        <h4>균형 잡힌 식단</h4>
                        <p>탄수화물, 단백질, 지방을 적절한 비율로 섭취하고 다양한 영양소를 골고루 드세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🏃</div>
                    <div class="tip-content">
                        <h4>규칙적인 운동</h4>
                        <p>주 3-5회, 30분 이상의 유산소 운동과 주 2-3회의 근력 운동을 병행하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">💧</div>
                    <div class="tip-content">
                        <h4>충분한 수분</h4>
                        <p>하루 8-10잔의 물을 마시고, 운동 시에는 더 많은 수분을 섭취하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">😴</div>
                    <div class="tip-content">
                        <h4>양질의 수면</h4>
                        <p>규칙적인 수면 패턴을 유지하고 하루 7-8시간의 충분한 잠을 취하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🧘</div>
                    <div class="tip-content">
                        <h4>스트레스 관리</h4>
                        <p>명상, 요가, 취미 활동을 통해 스트레스를 관리하고 정신 건강을 챙기세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">📏</div>
                    <div class="tip-content">
                        <h4>정기적인 측정</h4>
                        <p>주기적으로 체중과 건강 지표를 측정하여 변화를 추적하고 관리하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/bmi-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
