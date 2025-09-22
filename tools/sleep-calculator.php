<?php
$page_title = '수면 시간 계산기 - 짭샵 유틸리티';
$page_description = '최적의 기상 시간을 위해 언제 잠들어야 할지 알려드립니다. 수면 주기를 고려한 개인 맞춤형 수면 계획을 세워보세요.';
$page_keywords = '수면 시간, 기상 시간, 잠들 시간, 수면 주기, 수면 계산기, 수면 패턴, REM 수면';
$page_css = 'assets/css/sleep-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="sleep-container">
    <div class="sleep-header">
        <h1>😴 수면 시간 계산기</h1>
        <p>최적의 수면을 위한 완벽한 잠들기와 기상 시간을 찾아보세요</p>
    </div>

    <div class="sleep-main">
        <div class="calculator-section">
            <div class="sleep-mode-card">
                <h3>🎯 계산 모드 선택</h3>
                <div class="mode-buttons">
                    <button class="mode-btn active" data-mode="wakeup">
                        <div class="mode-icon">⏰</div>
                        <div class="mode-text">
                            <strong>기상 시간 설정</strong>
                            <small>언제 일어날지 정해서 잠들 시간 찾기</small>
                        </div>
                    </button>
                    <button class="mode-btn" data-mode="bedtime">
                        <div class="mode-icon">🛏️</div>
                        <div class="mode-text">
                            <strong>잠들 시간 설정</strong>
                            <small>지금 자면 언제 일어나는게 좋을지 찾기</small>
                        </div>
                    </button>
                </div>
            </div>

            <div class="time-input-card">
                <div id="wakeupMode" class="input-mode active">
                    <h3>⏰ 언제 일어나고 싶나요?</h3>
                    <div class="time-input-group">
                        <div class="time-picker">
                            <label for="wakeupTime">기상 희망 시간</label>
                            <input type="time" id="wakeupTime" value="07:00" class="time-input">
                        </div>
                        <div class="date-picker">
                            <label for="wakeupDate">날짜</label>
                            <input type="date" id="wakeupDate" class="date-input">
                        </div>
                    </div>
                </div>

                <div id="bedtimeMode" class="input-mode">
                    <h3>🛏️ 지금 잠들 계획인가요?</h3>
                    <div class="bedtime-options">
                        <button class="bedtime-btn active" data-bedtime="now">
                            <span class="bedtime-icon">🌙</span>
                            <span>지금 바로</span>
                        </button>
                        <button class="bedtime-btn" data-bedtime="custom">
                            <span class="bedtime-icon">🕘</span>
                            <span>시간 설정</span>
                        </button>
                    </div>
                    <div id="customBedtimeInput" class="custom-bedtime" style="display: none;">
                        <label for="bedTime">잠들 시간</label>
                        <input type="time" id="bedTime" class="time-input">
                    </div>
                </div>

                <button id="calculateSleep" class="calculate-btn">
                    <span class="btn-icon">💤</span>
                    <span class="btn-text">최적 시간 계산하기</span>
                </button>
            </div>

            <div class="sleep-settings-card">
                <h3>⚙️ 개인 설정</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label for="fallAsleepTime">잠드는 시간</label>
                        <select id="fallAsleepTime" class="setting-select">
                            <option value="5">5분</option>
                            <option value="10">10분</option>
                            <option value="15" selected>15분</option>
                            <option value="20">20분</option>
                            <option value="30">30분</option>
                        </select>
                        <small>보통 침대에 누워서 잠들기까지 걸리는 시간</small>
                    </div>
                    
                    <div class="setting-item">
                        <label for="sleepCycles">수면 주기</label>
                        <select id="sleepCycles" class="setting-select">
                            <option value="4">4주기 (6시간)</option>
                            <option value="5" selected>5주기 (7.5시간)</option>
                            <option value="6">6주기 (9시간)</option>
                        </select>
                        <small>개인에 따라 4-6주기가 이상적</small>
                    </div>

                    <div class="setting-item">
                        <label for="ageGroup">나이대</label>
                        <select id="ageGroup" class="setting-select">
                            <option value="teen">10대 (8-10시간)</option>
                            <option value="adult" selected>성인 (7-9시간)</option>
                            <option value="senior">시니어 (7-8시간)</option>
                        </select>
                        <small>나이에 따른 권장 수면 시간</small>
                    </div>

                    <div class="setting-item">
                        <label for="sleepQuality">평소 수면의 질</label>
                        <select id="sleepQuality" class="setting-select">
                            <option value="poor">나쁨 (자주 깨거나 피곤)</option>
                            <option value="average" selected>보통 (가끔 피곤함)</option>
                            <option value="good">좋음 (깊게 잘 잠)</option>
                        </select>
                        <small>수면의 질에 따라 필요 시간 조정</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="sleepResult" class="sleep-result" style="display: none;">
                <div class="result-header">
                    <h3 id="resultTitle">💤 최적 수면 계획</h3>
                    <div class="result-actions">
                        <button id="savePlan" class="action-btn">💾 저장</button>
                        <button id="sharePlan" class="action-btn">📤 공유</button>
                        <button id="setAlarm" class="action-btn">⏰ 알람</button>
                    </div>
                </div>

                <div class="sleep-timeline">
                    <div class="timeline-container" id="sleepTimeline">
                        <!-- 타임라인이 여기에 생성됩니다 -->
                    </div>
                </div>

                <div class="sleep-analysis">
                    <div class="analysis-grid">
                        <div class="analysis-card primary">
                            <div class="card-icon">🛏️</div>
                            <div class="card-content">
                                <div class="card-value" id="optimalBedtime">23:00</div>
                                <div class="card-label">권장 잠자리 시간</div>
                            </div>
                        </div>
                        <div class="analysis-card">
                            <div class="card-icon">⏰</div>
                            <div class="card-content">
                                <div class="card-value" id="optimalWakeup">07:00</div>
                                <div class="card-label">최적 기상 시간</div>
                            </div>
                        </div>
                        <div class="analysis-card">
                            <div class="card-icon">💤</div>
                            <div class="card-content">
                                <div class="card-value" id="totalSleepTime">8시간</div>
                                <div class="card-label">총 수면 시간</div>
                            </div>
                        </div>
                        <div class="analysis-card">
                            <div class="card-icon">🔄</div>
                            <div class="card-content">
                                <div class="card-value" id="cycleCount">5주기</div>
                                <div class="card-label">수면 주기</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="alternatives-section">
                    <h4>🔄 다른 옵션들</h4>
                    <div id="alternativeTimes" class="alternatives-grid">
                        <!-- 대안 시간들이 여기에 표시됩니다 -->
                    </div>
                </div>

                <div class="sleep-tips-section">
                    <h4>💡 더 나은 수면을 위한 팁</h4>
                    <div id="personalizedTips" class="tips-list">
                        <!-- 개인화된 팁들이 여기에 표시됩니다 -->
                    </div>
                </div>
            </div>

            <div class="welcome-card" id="welcomeCard">
                <div class="welcome-content">
                    <div class="welcome-icon">😴</div>
                    <h3>완벽한 수면 계획을 세워보세요!</h3>
                    <p>수면 주기를 고려한 과학적인 접근으로<br>최적의 잠들기와 기상 시간을 찾아드립니다.</p>
                    <div class="sleep-facts">
                        <div class="fact-item">
                            <span class="fact-icon">🧠</span>
                            <span>수면 주기는 약 90분</span>
                        </div>
                        <div class="fact-item">
                            <span class="fact-icon">⏰</span>
                            <span>주기 끝에서 깨면 개운함</span>
                        </div>
                        <div class="fact-item">
                            <span class="fact-icon">😌</span>
                            <span>규칙적인 수면이 중요</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="sleep-features">
        <div class="sleep-log-section">
            <div class="section-header">
                <h3>📊 수면 기록</h3>
                <button id="clearSleepLog" class="btn-clear">기록 삭제</button>
            </div>
            <div id="sleepLog" class="sleep-log">
                <div class="empty-log">
                    <div class="empty-icon">😴</div>
                    <p>아직 수면 계획 기록이 없습니다.<br>첫 번째 수면 계획을 세워보세요!</p>
                </div>
            </div>
        </div>

        <div class="tips-section">
            <h3>🌙 건강한 수면 가이드</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">📱</div>
                    <div class="tip-content">
                        <h4>디지털 디톡스</h4>
                        <p>잠들기 1시간 전부터는 스마트폰, TV 등 전자기기 사용을 피하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🌡️</div>
                    <div class="tip-content">
                        <h4>적정 온도</h4>
                        <p>침실 온도는 18-20도가 이상적입니다. 너무 덥거나 춥지 않게 유지하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">☕</div>
                    <div class="tip-content">
                        <h4>카페인 주의</h4>
                        <p>오후 2시 이후의 카페인 섭취는 피하고, 대신 허브차를 드셔보세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🧘</div>
                    <div class="tip-content">
                        <h4>릴렉스 타임</h4>
                        <p>잠들기 전 명상, 독서, 가벼운 스트레칭으로 몸과 마음을 진정시키세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🌅</div>
                    <div class="tip-content">
                        <h4>규칙적인 패턴</h4>
                        <p>주말에도 비슷한 시간에 자고 일어나는 것이 생체 리듬에 도움됩니다.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🛏️</div>
                    <div class="tip-content">
                        <h4>수면 환경</h4>
                        <p>어둡고 조용한 환경을 만들고, 편안한 침구로 수면의 질을 높이세요.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/sleep-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
