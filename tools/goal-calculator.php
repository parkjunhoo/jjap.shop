<?php
$page_title = '목표 달성 계산기 - 짭샵 유틸리티';
$page_description = '목표까지 매일 얼마나 해야 할지 계산해보세요. 돈 모으기, 책 읽기, 운동 등 다양한 목표에 활용할 수 있습니다.';
$page_keywords = '목표 달성 계산기, 목표 설정, 일일 목표, 계획 세우기, 진행률 계산';
$page_css = 'assets/css/goal-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="goal-container">
    <div class="goal-header">
        <h1>🎯 목표 달성 계산기</h1>
        <p>목표까지 매일 얼마나 해야 할지 계산하고 진행상황을 추적해보세요</p>
    </div>

    <div class="goal-main">
        <div class="goal-input-section">
            <div class="calculator-card">
                <h3>📊 목표 설정하기</h3>
                <form id="goalForm" class="goal-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="goalType">목표 유형</label>
                            <select id="goalType">
                                <option value="money">💰 돈 모으기</option>
                                <option value="book">📚 책 읽기</option>
                                <option value="exercise">🏃 운동하기</option>
                                <option value="study">📝 공부하기</option>
                                <option value="weight">⚖️ 체중 관리</option>
                                <option value="saving">🏦 적금/투자</option>
                                <option value="custom">🎯 사용자 정의</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="goalUnit">단위</label>
                            <input type="text" id="goalUnit" placeholder="예: 원, 권, 시간, kg" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="currentAmount">현재 상황</label>
                            <input type="number" id="currentAmount" placeholder="0" step="any" required>
                        </div>
                        <div class="form-group">
                            <label for="targetAmount">목표</label>
                            <input type="number" id="targetAmount" placeholder="목표값 입력" step="any" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="startDate">시작일</label>
                            <input type="date" id="startDate" required>
                        </div>
                        <div class="form-group">
                            <label for="endDate">목표일</label>
                            <input type="date" id="endDate" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="goalTitle">목표 제목 (선택)</label>
                        <input type="text" id="goalTitle" placeholder="예: 해외여행 자금 모으기">
                    </div>

                    <button type="submit" class="btn-calculate">📊 계산하기</button>
                </form>
            </div>

            <div class="presets-card">
                <h3>🎯 목표 프리셋</h3>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="emergency-fund">
                        💰 비상자금 1000만원
                    </button>
                    <button class="preset-btn" data-preset="book-challenge">
                        📚 1년 50권 독서
                    </button>
                    <button class="preset-btn" data-preset="weight-loss">
                        ⚖️ 3개월 5kg 감량
                    </button>
                    <button class="preset-btn" data-preset="study-time">
                        📝 자격증 준비 300시간
                    </button>
                    <button class="preset-btn" data-preset="vacation-fund">
                        ✈️ 여행자금 300만원
                    </button>
                    <button class="preset-btn" data-preset="fitness-goal">
                        🏃 100일 운동 챌린지
                    </button>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="resultCard" class="result-card" style="display: none;">
                <div class="result-header">
                    <h3 id="resultTitle">목표 달성 계획</h3>
                    <div class="goal-status" id="goalStatus">
                        <span class="status-badge" id="statusBadge">계획 중</span>
                    </div>
                </div>

                <div class="result-content">
                    <div class="key-metrics">
                        <div class="metric-card primary">
                            <div class="metric-label">매일 필요량</div>
                            <div class="metric-value" id="dailyTarget">0</div>
                            <div class="metric-unit" id="dailyTargetUnit">단위</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">남은 기간</div>
                            <div class="metric-value" id="remainingDays">0</div>
                            <div class="metric-unit">일</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">남은 목표</div>
                            <div class="metric-value" id="remainingAmount">0</div>
                            <div class="metric-unit" id="remainingAmountUnit">단위</div>
                        </div>
                    </div>

                    <div class="progress-section">
                        <div class="progress-info">
                            <span class="progress-label">진행률</span>
                            <span class="progress-percentage" id="progressPercentage">0%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="progress-details">
                            <span id="progressCurrent">0</span> / <span id="progressTarget">0</span>
                        </div>
                    </div>

                    <div class="timeline-section">
                        <h4>📅 주요 마일스톤</h4>
                        <div id="milestones" class="milestones-list"></div>
                    </div>

                    <div class="tips-section">
                        <h4>💡 달성 팁</h4>
                        <div id="achievementTips" class="tips-list"></div>
                    </div>

                    <div class="action-buttons">
                        <button id="saveGoalBtn" class="btn-save">💾 목표 저장</button>
                        <button id="updateProgressBtn" class="btn-update">📊 진행상황 업데이트</button>
                        <button id="shareGoalBtn" class="btn-share">🔗 목표 공유</button>
                    </div>
                </div>
            </div>

            <div class="saved-goals-section">
                <h3>📋 저장된 목표들</h3>
                <div id="savedGoalsList" class="saved-goals-list">
                    <div class="empty-goals">
                        <div class="empty-icon">🎯</div>
                        <p>아직 저장된 목표가 없습니다.<br>새로운 목표를 계산하고 저장해보세요!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 진행상황 업데이트 모달 -->
    <div id="progressModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>📊 진행상황 업데이트</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="currentProgress">현재 달성한 양</label>
                    <input type="number" id="currentProgress" step="any" placeholder="현재 상황을 입력하세요">
                </div>
                <div class="form-group">
                    <label for="progressNote">메모 (선택)</label>
                    <textarea id="progressNote" placeholder="진행상황이나 느낀 점을 적어보세요"></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button id="cancelUpdateBtn" class="btn-cancel">취소</button>
                <button id="confirmUpdateBtn" class="btn-confirm">업데이트</button>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/goal-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
