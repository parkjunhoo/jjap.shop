<?php
$page_title = '습관 트래커 - 짭샵 유틸리티';
$page_description = '66일 습관 형성 체크리스트로 목표를 달성하세요. 진행률 시각화와 동기부여 기능으로 꾸준한 습관을 만들어보세요.';
$page_keywords = '습관 트래커, 습관 형성, 66일 챌린지, 목표 달성, 체크리스트, 진행률';
$page_css = 'assets/css/habit-tracker.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="habit-container">
    <div class="habit-header">
        <h1>📈 습관 트래커</h1>
        <p>66일 동안 꾸준히 실천하여 새로운 습관을 만들어보세요</p>
    </div>

    <div class="habit-main">
        <div class="habit-form-section">
            <div class="add-habit-card">
                <h3>➕ 새로운 습관 추가</h3>
                <form id="habitForm" class="habit-form">
                    <div class="form-group">
                        <label for="habitName">습관명</label>
                        <input type="text" id="habitName" placeholder="예: 매일 운동하기" required>
                    </div>
                    <div class="form-group">
                        <label for="habitCategory">카테고리</label>
                        <select id="habitCategory">
                            <option value="health">🏃 건강</option>
                            <option value="study">📚 학습</option>
                            <option value="work">💼 업무</option>
                            <option value="creative">🎨 창작</option>
                            <option value="social">👥 인간관계</option>
                            <option value="personal">🌱 자기계발</option>
                            <option value="other">🔄 기타</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="habitTarget">목표 (예: 30분, 10페이지)</label>
                        <input type="text" id="habitTarget" placeholder="목표량을 입력하세요">
                    </div>
                    <button type="submit" class="btn-add">습관 추가하기</button>
                </form>
            </div>

            <div class="stats-overview">
                <h3>📊 전체 통계</h3>
                <div class="overview-grid">
                    <div class="overview-card">
                        <div class="overview-icon">🎯</div>
                        <div class="overview-value" id="totalHabits">0</div>
                        <div class="overview-label">활성 습관</div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">🔥</div>
                        <div class="overview-value" id="longestStreak">0</div>
                        <div class="overview-label">최장 연속</div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">📈</div>
                        <div class="overview-value" id="todayCompletion">0%</div>
                        <div class="overview-label">오늘 달성률</div>
                    </div>
                    <div class="overview-card">
                        <div class="overview-icon">⭐</div>
                        <div class="overview-value" id="completedHabits">0</div>
                        <div class="overview-label">완료된 습관</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="habits-display">
            <div class="habits-header">
                <h3>📋 내 습관 목록</h3>
                <div class="habits-filter">
                    <select id="filterCategory">
                        <option value="all">전체 카테고리</option>
                        <option value="health">🏃 건강</option>
                        <option value="study">📚 학습</option>
                        <option value="work">💼 업무</option>
                        <option value="creative">🎨 창작</option>
                        <option value="social">👥 인간관계</option>
                        <option value="personal">🌱 자기계발</option>
                        <option value="other">🔄 기타</option>
                    </select>
                </div>
            </div>
            
            <div id="habitsContainer" class="habits-container">
                <div class="empty-state">
                    <div class="empty-icon">🌱</div>
                    <h4>아직 습관이 없어요</h4>
                    <p>새로운 습관을 추가해서 66일 챌린지를 시작해보세요!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 습관 상세 모달 -->
    <div id="habitModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">습관 상세정보</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="habit-progress">
                    <div class="progress-info">
                        <div class="progress-text">
                            <span id="modalDayCount">0</span> / 66일 완료
                        </div>
                        <div class="progress-percentage" id="modalPercentage">0%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="modalProgressFill"></div>
                    </div>
                </div>
                
                <div class="calendar-grid" id="modalCalendar"></div>
                
                <div class="habit-stats">
                    <div class="stat-item">
                        <span class="stat-label">현재 연속:</span>
                        <span class="stat-value" id="modalCurrentStreak">0일</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">최장 연속:</span>
                        <span class="stat-value" id="modalLongestStreak">0일</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">성공률:</span>
                        <span class="stat-value" id="modalSuccessRate">0%</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="deleteHabitBtn" class="btn-delete">습관 삭제</button>
                <button id="resetHabitBtn" class="btn-reset">진행상황 초기화</button>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/habit-tracker.js"></script>

<?php include_once '../includes/footer.php'; ?>
