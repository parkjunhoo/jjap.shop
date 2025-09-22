<?php
$page_title = '포모도로 타이머 - 짭샵 유틸리티';
$page_description = '25분 집중 + 5분 휴식의 포모도로 기법으로 생산성을 극대화하세요. 통계 추적과 알림 기능 포함.';
$page_keywords = '포모도로 타이머, 집중 타이머, 생산성 도구, 시간 관리, 25분 타이머';
$page_css = 'assets/css/pomodoro-timer.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="pomodoro-container">
    <div class="pomodoro-header">
        <h1>🍅 포모도로 타이머</h1>
        <p>25분 집중 + 5분 휴식으로 생산성을 극대화하세요</p>
    </div>

    <div class="pomodoro-main">
        <div class="timer-section">
            <div class="timer-display">
                <div class="timer-circle">
                    <svg class="progress-ring" width="280" height="280">
                        <circle class="progress-ring-circle"
                                stroke="#e6e6e6"
                                stroke-width="8"
                                fill="transparent"
                                r="130"
                                cx="140"
                                cy="140"/>
                        <circle class="progress-ring-circle progress-ring-bar"
                                stroke="#ff6b6b"
                                stroke-width="8"
                                fill="transparent"
                                r="130"
                                cx="140"
                                cy="140"/>
                    </svg>
                    <div class="timer-text">
                        <div id="timeDisplay">25:00</div>
                        <div id="sessionType">집중 시간</div>
                    </div>
                </div>
            </div>
            
            <div class="timer-controls">
                <button id="startBtn" class="control-btn start">
                    <span class="btn-icon">▶️</span>
                    <span class="btn-text">시작</span>
                </button>
                <button id="pauseBtn" class="control-btn pause" disabled>
                    <span class="btn-icon">⏸️</span>
                    <span class="btn-text">일시정지</span>
                </button>
                <button id="resetBtn" class="control-btn reset">
                    <span class="btn-icon">🔄</span>
                    <span class="btn-text">리셋</span>
                </button>
            </div>

            <div class="session-info">
                <div class="session-count">
                    <span>완료한 포모도로: </span>
                    <strong id="completedSessions">0</strong>개
                </div>
            </div>
        </div>

        <div class="settings-section">
            <h3>⚙️ 설정</h3>
            <div class="setting-group">
                <label for="focusTime">집중 시간</label>
                <input type="range" id="focusTime" min="0.5" max="60" step="0.5" value="25">
                <span id="focusTimeValue">25분</span>
            </div>
            <div class="setting-group">
                <label for="breakTime">휴식 시간</label>
                <input type="range" id="breakTime" min="0.5" max="30" step="0.5" value="5">
                <span id="breakTimeValue">5분</span>
            </div>
            <div class="setting-group">
                <label for="longBreakTime">긴 휴식 시간</label>
                <input type="range" id="longBreakTime" min="1" max="60" step="0.5" value="15">
                <span id="longBreakTimeValue">15분</span>
            </div>
            <div class="setting-group checkbox">
                <input type="checkbox" id="soundEnabled" checked>
                <label for="soundEnabled">알림음 켜기</label>
            </div>
            <div class="setting-group checkbox">
                <input type="checkbox" id="autoStart">
                <label for="autoStart">자동으로 다음 세션 시작</label>
            </div>
        </div>
    </div>

    <div class="stats-section">
        <div class="stats-header">
            <h3>📊 오늘의 통계</h3>
            <button id="resetStatsBtn" class="reset-stats-btn">🗑️ 통계 리셋</button>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🍅</div>
                <div class="stat-value" id="todayPomodoros">0</div>
                <div class="stat-label">완료한 포모도로</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⏰</div>
                <div class="stat-value" id="todayFocusTime">0분</div>
                <div class="stat-label">집중 시간</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">☕</div>
                <div class="stat-value" id="todayBreaks">0</div>
                <div class="stat-label">휴식 횟수</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">🎯</div>
                <div class="stat-value" id="productivity">0%</div>
                <div class="stat-label">생산성</div>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/pomodoro-timer.js"></script>

<?php include_once '../includes/footer.php'; ?>
