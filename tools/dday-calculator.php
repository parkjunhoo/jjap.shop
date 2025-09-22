<?php
$page_title = 'D-Day 계산기 - 짭샵 유틸리티';
$page_description = '중요한 날까지 남은 시간을 계산하고 특별한 순간을 준비하세요. 기념일, 시험, 출산 예정일 등 다양한 D-Day를 관리할 수 있습니다.';
$page_keywords = 'D-Day 계산기, 디데이 계산, 기념일 계산, 남은 시간, 카운트다운, 기념일 관리, 중요한 날';
$page_css = 'assets/css/dday-calculator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="dday-container">
    <div class="dday-header">
        <h1>📅 D-Day 계산기</h1>
        <p>중요한 날까지 남은 시간을 계산하고 특별한 순간을 준비하세요</p>
    </div>

    <div class="dday-main">
        <div class="input-section">
            <div class="dday-input-card">
                <h3>🎯 D-Day 설정</h3>
                <div class="dday-form">
                    <div class="form-group">
                        <label for="eventName">이벤트 이름</label>
                        <input type="text" id="eventName" placeholder="예: 생일, 결혼기념일, 시험일..." class="text-input">
                    </div>

                    <div class="form-group">
                        <label for="targetDate">목표 날짜</label>
                        <input type="date" id="targetDate" class="date-input">
                    </div>

                    <div class="form-group">
                        <label for="eventType">이벤트 종류</label>
                        <div class="event-type-buttons">
                            <button type="button" class="event-btn active" data-type="celebration">
                                <span class="event-icon">🎉</span>
                                <span>축하/기념일</span>
                            </button>
                            <button type="button" class="event-btn" data-type="deadline">
                                <span class="event-icon">⏰</span>
                                <span>마감/시험</span>
                            </button>
                            <button type="button" class="event-btn" data-type="travel">
                                <span class="event-icon">✈️</span>
                                <span>여행/휴가</span>
                            </button>
                            <button type="button" class="event-btn" data-type="other">
                                <span class="event-icon">📌</span>
                                <span>기타</span>
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>알림 설정</label>
                        <div class="reminder-options">
                            <label class="reminder-option">
                                <input type="checkbox" name="reminder" value="100" checked>
                                <span>100일 전</span>
                            </label>
                            <label class="reminder-option">
                                <input type="checkbox" name="reminder" value="30" checked>
                                <span>30일 전</span>
                            </label>
                            <label class="reminder-option">
                                <input type="checkbox" name="reminder" value="7" checked>
                                <span>7일 전</span>
                            </label>
                            <label class="reminder-option">
                                <input type="checkbox" name="reminder" value="1" checked>
                                <span>1일 전</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="eventNote">메모 (선택)</label>
                        <textarea id="eventNote" placeholder="이벤트에 대한 간단한 메모를 작성하세요..." rows="3" class="memo-input"></textarea>
                    </div>

                    <div class="action-buttons">
                        <button id="calculateDday" class="calculate-btn">
                            <span class="btn-icon">🧮</span>
                            <span class="btn-text">D-Day 계산하기</span>
                        </button>
                        <button id="addToDdayList" class="add-btn" style="display: none;">
                            <span class="btn-icon">📝</span>
                            <span class="btn-text">목록에 추가</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="preset-card">
                <h3>✨ 빠른 설정</h3>
                <div class="preset-buttons">
                    <button class="preset-btn" data-preset="birthday">
                        <div class="preset-info">
                            <div class="preset-icon">🎂</div>
                            <div class="preset-text">
                                <strong>다음 생일</strong>
                                <small>생년월일 입력하면 자동 계산</small>
                            </div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="newyear">
                        <div class="preset-info">
                            <div class="preset-icon">🎊</div>
                            <div class="preset-text">
                                <strong>새해</strong>
                                <small>다음 년도 1월 1일</small>
                            </div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="christmas">
                        <div class="preset-info">
                            <div class="preset-icon">🎄</div>
                            <div class="preset-text">
                                <strong>크리스마스</strong>
                                <small>12월 25일</small>
                            </div>
                        </div>
                    </button>
                    <button class="preset-btn" data-preset="valentine">
                        <div class="preset-info">
                            <div class="preset-icon">💕</div>
                            <div class="preset-text">
                                <strong>발렌타인데이</strong>
                                <small>2월 14일</small>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <div class="birthday-card" id="birthdayCard" style="display: none;">
                <h3>🎂 생일 설정</h3>
                <div class="birthday-form">
                    <div class="form-group">
                        <label for="birthDate">생년월일</label>
                        <input type="date" id="birthDate" class="date-input">
                    </div>
                    <button id="setBirthday" class="birthday-btn">생일 D-Day 설정하기</button>
                </div>
            </div>
        </div>

        <div class="result-section">
            <div id="ddayResult" class="dday-result" style="display: none;">
                <div class="result-header">
                    <h3 id="resultTitle">📊 D-Day 계산 결과</h3>
                    <div class="result-actions">
                        <button id="saveDday" class="action-btn">💾 저장</button>
                        <button id="shareDday" class="action-btn">📤 공유</button>
                        <button id="resetDday" class="action-btn">🔄 초기화</button>
                    </div>
                </div>

                <div class="main-dday-display">
                    <div class="dday-card main-card">
                        <div class="event-info">
                            <h2 id="displayEventName" class="event-name">생일</h2>
                            <p id="displayEventDate" class="event-date">2024년 12월 25일</p>
                        </div>
                        <div class="dday-counter">
                            <div id="ddayNumber" class="dday-number">D-365</div>
                            <div id="ddayStatus" class="dday-status">앞으로 365일 남았습니다</div>
                        </div>
                        <div class="progress-section">
                            <div class="time-progress">
                                <div id="progressBar" class="progress-bar" style="width: 25%"></div>
                            </div>
                            <div id="progressText" class="progress-text">25% 지났습니다</div>
                        </div>
                    </div>
                </div>

                <div class="detailed-countdown">
                    <h4>⏰ 상세 카운트다운</h4>
                    <div class="countdown-grid">
                        <div class="countdown-item">
                            <div id="yearsLeft" class="countdown-number">0</div>
                            <div class="countdown-label">년</div>
                        </div>
                        <div class="countdown-item">
                            <div id="monthsLeft" class="countdown-number">12</div>
                            <div class="countdown-label">개월</div>
                        </div>
                        <div class="countdown-item">
                            <div id="daysLeft" class="countdown-number">365</div>
                            <div class="countdown-label">일</div>
                        </div>
                        <div class="countdown-item">
                            <div id="hoursLeft" class="countdown-number">8760</div>
                            <div class="countdown-label">시간</div>
                        </div>
                        <div class="countdown-item">
                            <div id="minutesLeft" class="countdown-number">525600</div>
                            <div class="countdown-label">분</div>
                        </div>
                        <div class="countdown-item">
                            <div id="secondsLeft" class="countdown-number">31536000</div>
                            <div class="countdown-label">초</div>
                        </div>
                    </div>
                </div>

                <div class="timeline-section">
                    <h4>📈 타임라인</h4>
                    <div class="timeline-container">
                        <div class="timeline-item today">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">오늘</div>
                                <div id="todayDate" class="timeline-date">2024년 9월 22일</div>
                            </div>
                        </div>
                        <div id="reminderTimeline" class="reminder-timeline">
                            <!-- 알림 타임라인이 여기에 추가됩니다 -->
                        </div>
                        <div class="timeline-item target">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">목표일</div>
                                <div id="targetDateDisplay" class="timeline-date">2024년 12월 25일</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="suggestions-section">
                    <h4>💡 준비 제안</h4>
                    <div id="preparationSuggestions" class="suggestions-grid">
                        <!-- 준비 제안이 여기에 추가됩니다 -->
                    </div>
                </div>
            </div>

            <div class="welcome-card" id="welcomeCard">
                <div class="welcome-content">
                    <div class="welcome-icon">📅</div>
                    <h3>중요한 날을 기억하세요!</h3>
                    <p>생일, 기념일, 시험일 등 중요한 날까지<br>남은 시간을 정확히 계산해드립니다.</p>
                    <div class="welcome-features">
                        <div class="feature-item">
                            <span class="feature-icon">⏰</span>
                            <span>실시간 카운트다운</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📋</span>
                            <span>D-Day 목록 관리</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔔</span>
                            <span>알림 기능</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dday-features">
        <div class="dday-list-section">
            <div class="section-header">
                <h3>📋 D-Day 목록</h3>
                <div class="list-actions">
                    <button id="sortDdayList" class="btn-sort">📊 정렬</button>
                    <button id="clearDdayList" class="btn-clear">🗑️ 전체 삭제</button>
                </div>
            </div>
            <div id="ddayList" class="dday-list">
                <div class="empty-list">
                    <div class="empty-icon">📅</div>
                    <p>아직 등록된 D-Day가 없습니다.<br>중요한 날을 추가해보세요!</p>
                </div>
            </div>
        </div>

        <div class="tips-section">
            <h3>💡 D-Day 활용 팁</h3>
            <div class="tips-grid">
                <div class="tip-card">
                    <div class="tip-icon">🎯</div>
                    <div class="tip-content">
                        <h4>목표 설정</h4>
                        <p>중요한 시험이나 프로젝트 마감일을 설정하여 체계적으로 준비하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">🎉</div>
                    <div class="tip-content">
                        <h4>기념일 준비</h4>
                        <p>생일이나 기념일을 미리 등록하여 선물이나 이벤트를 준비할 시간을 확보하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">⏰</div>
                    <div class="tip-content">
                        <h4>알림 활용</h4>
                        <p>여러 단계의 알림을 설정하여 중요한 날을 놓치지 않도록 관리하세요.</p>
                    </div>
                </div>
                <div class="tip-card">
                    <div class="tip-icon">📱</div>
                    <div class="tip-content">
                        <h4>공유 기능</h4>
                        <p>가족이나 친구들과 D-Day를 공유하여 함께 기대하고 준비하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/dday-calculator.js"></script>

<?php include_once '../includes/footer.php'; ?>
