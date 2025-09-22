<?php
$page_title = '물 섭취량 트래커 - 짭샵 유틸리티';
$page_description = '하루 권장 물 섭취량을 기록하고 건강한 습관을 만드세요. 개인 맞춤형 수분 섭취 목표 설정과 실시간 추적이 가능합니다.';
$page_keywords = '물 섭취량, 수분 섭취, 물 트래커, 건강 관리, 수분 보충, 물 마시기, 하이드레이션';
$page_css = 'assets/css/water-tracker.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="water-container">
    <div class="water-header">
        <h1>💧 물 섭취량 트래커</h1>
        <p>하루 권장 수분량을 체계적으로 관리하고 건강한 습관을 만들어보세요</p>
    </div>

    <div class="water-main">
        <div class="tracker-section">
            <div class="water-bottle-card">
                <h3>🚰 오늘의 수분 섭취</h3>
                <div class="bottle-container">
                    <div class="water-bottle">
                        <div id="waterLevel" class="water-level" style="height: 0%"></div>
                        <div class="bottle-labels">
                            <div class="label" style="bottom: 80%">2000ml</div>
                            <div class="label" style="bottom: 60%">1500ml</div>
                            <div class="label" style="bottom: 40%">1000ml</div>
                            <div class="label" style="bottom: 20%">500ml</div>
                            <div class="label" style="bottom: 0%">0ml</div>
                        </div>
                    </div>
                    <div class="bottle-info">
                        <div class="current-intake">
                            <span id="currentAmount" class="amount-text">0</span>
                            <span class="unit-text">ml</span>
                        </div>
                        <div class="goal-info">
                            <span>목표: </span>
                            <span id="goalAmount">2000</span>
                            <span>ml</span>
                        </div>
                        <div class="progress-percentage">
                            <span id="progressPercent">0</span>%
                        </div>
                    </div>
                </div>
            </div>

            <div class="intake-controls">
                <h4>💦 물 마시기</h4>
                <div class="quick-amounts">
                    <button class="quick-btn" data-amount="200">
                        <span class="amount-icon">🥤</span>
                        <span>200ml</span>
                        <small>컵 1잔</small>
                    </button>
                    <button class="quick-btn" data-amount="250">
                        <span class="amount-icon">☕</span>
                        <span>250ml</span>
                        <small>머그컵</small>
                    </button>
                    <button class="quick-btn" data-amount="500">
                        <span class="amount-icon">🍼</span>
                        <span>500ml</span>
                        <small>물병</small>
                    </button>
                    <button class="quick-btn" data-amount="350">
                        <span class="amount-icon">🥤</span>
                        <span>350ml</span>
                        <small>캔음료</small>
                    </button>
                </div>
                
                <div class="custom-amount">
                    <div class="amount-input-group">
                        <input type="number" id="customAmount" placeholder="직접 입력" min="1" max="1000" class="amount-input">
                        <span class="input-unit">ml</span>
                        <button id="addCustomAmount" class="add-btn">추가</button>
                    </div>
                </div>

                <div class="control-buttons">
                    <button id="resetDay" class="control-btn reset">
                        <span class="btn-icon">🔄</span>
                        <span>오늘 기록 초기화</span>
                    </button>
                    <button id="undoLast" class="control-btn undo" disabled>
                        <span class="btn-icon">⬅️</span>
                        <span>마지막 취소</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="info-section">
            <div class="goal-settings-card">
                <h3>🎯 목표 설정</h3>
                <div class="goal-form">
                    <div class="personal-info">
                        <div class="info-row">
                            <div class="info-group">
                                <label for="userWeight">체중 (kg)</label>
                                <input type="number" id="userWeight" min="30" max="200" step="0.1" placeholder="70">
                            </div>
                            <div class="info-group">
                                <label for="activityLevel">활동량</label>
                                <select id="activityLevel" class="activity-select">
                                    <option value="low">낮음 (앉아서 생활)</option>
                                    <option value="moderate" selected>보통 (가벼운 운동)</option>
                                    <option value="high">높음 (격한 운동)</option>
                                </select>
                            </div>
                        </div>
                        <div class="info-row">
                            <div class="info-group">
                                <label for="weatherCondition">날씨</label>
                                <select id="weatherCondition" class="weather-select">
                                    <option value="normal" selected>보통</option>
                                    <option value="hot">더운 날씨</option>
                                    <option value="cold">추운 날씨</option>
                                </select>
                            </div>
                            <div class="info-group custom-goal-group">
                                <label for="customGoal">직접 설정</label>
                                <input type="number" id="customGoal" min="1000" max="5000" step="100" placeholder="2000" class="custom-goal-input">
                            </div>
                        </div>
                    </div>
                    
                    <button id="calculateGoal" class="calculate-btn">
                        <span class="btn-icon">🧮</span>
                        <span>권장량 계산하기</span>
                    </button>

                    <div id="goalRecommendation" class="goal-recommendation" style="display: none;">
                        <div class="recommendation-text">
                            <span>권장 수분 섭취량: </span>
                            <span id="recommendedAmount" class="recommended-amount">2000ml</span>
                        </div>
                        <button id="applyRecommendation" class="apply-btn">목표로 설정하기</button>
                    </div>
                </div>
            </div>

            <div class="stats-card">
                <h3>📊 오늘의 통계</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon">💧</div>
                        <div class="stat-content">
                            <div class="stat-value" id="totalIntake">0ml</div>
                            <div class="stat-label">총 섭취량</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">📈</div>
                        <div class="stat-content">
                            <div class="stat-value" id="remainingAmount">2000ml</div>
                            <div class="stat-label">남은 목표량</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-value" id="achievementRate">0%</div>
                            <div class="stat-label">달성률</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-content">
                            <div class="stat-value" id="streakDays">0일</div>
                            <div class="stat-label">연속 달성</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="intake-log-card">
                <h3>📝 섭취 기록</h3>
                <div id="intakeLog" class="intake-log">
                    <div class="empty-log">
                        <div class="empty-icon">💧</div>
                        <p>아직 오늘 물을 마신 기록이 없습니다.<br>첫 번째 물을 마셔보세요!</p>
                    </div>
                </div>
            </div>

            <div class="reminders-card">
                <h3>⏰ 물 마시기 알림</h3>
                <div class="reminder-settings">
                    <div class="reminder-toggle">
                        <label class="toggle-switch">
                            <input type="checkbox" id="reminderEnabled">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="toggle-label">알림 켜기</span>
                    </div>
                    <div class="reminder-interval">
                        <label for="reminderInterval">알림 간격</label>
                        <select id="reminderInterval" class="interval-select" disabled>
                            <option value="30">30분마다</option>
                            <option value="60" selected>1시간마다</option>
                            <option value="90">1시간 30분마다</option>
                            <option value="120">2시간마다</option>
                        </select>
                    </div>
                </div>
                <div id="nextReminder" class="next-reminder" style="display: none;">
                    <span>다음 알림: </span>
                    <span id="nextReminderTime">--:--</span>
                </div>
            </div>
        </div>
    </div>

    <div class="water-features">
        <div class="history-section">
            <div class="section-header">
                <h3>📈 주간 기록</h3>
                <div class="history-controls">
                    <button id="exportData" class="btn-export">📊 데이터 내보내기</button>
                </div>
            </div>
            <div class="weekly-chart">
                <canvas id="weeklyChart" width="400" height="200"></canvas>
            </div>
            <div class="weekly-summary" id="weeklySummary">
                <!-- 주간 요약이 여기에 표시됩니다 -->
            </div>
        </div>

        <div class="tips-section">
            <h3>💡 건강한 수분 섭취 팁</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">⏰</div>
                    <div class="tip-content">
                        <h4>규칙적인 섭취</h4>
                        <p>한 번에 많은 양보다는 조금씩 자주 마시는 것이 흡수에 도움됩니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🌅</div>
                    <div class="tip-content">
                        <h4>기상 직후</h4>
                        <p>잠에서 깬 직후 한 잔의 물은 신진대사를 활성화시키고 하루를 상쾌하게 시작합니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🍽️</div>
                    <div class="tip-content">
                        <h4>식사 전후</h4>
                        <p>식사 30분 전에 물을 마시면 소화에 도움이 되고, 포만감도 높아집니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🏃</div>
                    <div class="tip-content">
                        <h4>운동 시</h4>
                        <p>운동 전, 중, 후에 충분한 수분 보충으로 탈수를 예방하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🌡️</div>
                    <div class="tip-content">
                        <h4>체온 조절</h4>
                        <p>더운 날씨나 발열 시에는 평소보다 더 많은 수분 섭취가 필요합니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">💊</div>
                    <div class="tip-content">
                        <h4>수분 품질</h4>
                        <p>순수한 물이 최고이지만, 허브차나 레몬물도 좋은 수분 공급원입니다.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="../assets/js/water-tracker.js"></script>

<?php include_once '../includes/footer.php'; ?>
