<?php
$page_title = '생활계획표 만들기 - 유틸리티';
$page_description = '하루 24시간을 원형 차트로 시각화하여 생활 계획을 세워보세요. 12시간, 24시간 기준으로 선택 가능하며, 각 활동에 대한 시간 배분을 한눈에 확인할 수 있습니다.';
$page_keywords = '생활계획표, 하루계획, 시간관리, 스케줄러, 일정관리, 시간표, 루틴';
$page_css = '../assets/css/common.css';
include_once '../includes/section-headers/tools-header.php';
?>

    <link rel="stylesheet" href="../assets/css/daily-scheduler.css">
    <link rel="stylesheet" href="../assets/css/time-format-enhancement.css">
    <link rel="stylesheet" href="../assets/css/font-weight-enhancement.css">

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="scheduler-container">
    <div class="scheduler-header">
        <h1>⏰ 생활계획표 만들기</h1>
        <p>하루 24시간을 원형 차트로 시각화하여 완벽한 생활 계획을 세워보세요</p>
    </div>

    <div class="scheduler-controls">
                <div class="time-format-controls">
                    <div class="control-group">
                        <label>⏰ 시간 표시:</label>
                        <div class="custom-select">
                            <select id="timeInterval">
                                <option value="1">1시간 단위</option>
                                <option value="2" selected>2시간 단위</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>🌐 시간 형식:</label>
                        <div class="custom-select">
                            <select id="timeFormat">
                                <option value="24" selected>24시간제 (0-23)</option>
                                <option value="12">12시간제 (AM/PM)</option>
                            </select>
                        </div>
                    </div>
                </div>

        <div class="action-buttons">
            <button id="addActivity" class="btn btn-primary">📝 활동 추가</button>
            <button id="loadSample" class="btn btn-info">🎯 샘플 불러오기</button>
            <button id="saveChart" class="btn btn-secondary">💾 목록 저장</button>
            <button id="downloadChart" class="btn btn-success">💾 차트 저장</button>
            <button id="resetChart" class="btn btn-danger">🔄 모두 삭제</button>
        </div>
    </div>

    <div class="scheduler-main">
        <div class="chart-container">
            <canvas id="scheduleChart"></canvas>
        </div>

        <div class="activity-panel">
            <h3>📋 활동 목록</h3>
            <div class="activity-list" id="activityList">
                <!-- 활동 목록이 여기에 동적으로 추가됩니다 -->
            </div>
            
            <div class="activity-stats">
                <h4>📊 시간 분석</h4>
                <div class="stats-content" id="statsContent">
                    <!-- 통계가 여기에 표시됩니다 -->
                </div>
            </div>
        </div>
    </div>
</div>

<!-- 활동 편집 모달 -->
<div class="modal" id="editActivityModal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>✏️ 활동 편집</h3>
            <button class="close-modal" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>활동 이름:</label>
                <input type="text" id="activityName" placeholder="예: 수면, 식사, 공부, 운동 등">
            </div>
            <div class="form-group">
                <label>아이콘:</label>
                <div class="icon-picker">
                    <input type="text" id="activityIcon" placeholder="⭐" maxlength="2">
                    <div class="emoji-presets">
                        <button class="emoji-preset no-icon" data-emoji="" title="아이콘 없음">없음</button>
                        <button class="emoji-preset" data-emoji="😴">😴</button>
                        <button class="emoji-preset" data-emoji="🌅">🌅</button>
                        <button class="emoji-preset" data-emoji="🍽️">🍽️</button>
                        <button class="emoji-preset" data-emoji="🚗">🚗</button>
                        <button class="emoji-preset" data-emoji="💼">💼</button>
                        <button class="emoji-preset" data-emoji="📚">📚</button>
                        <button class="emoji-preset" data-emoji="🏃">🏃</button>
                        <button class="emoji-preset" data-emoji="🎮">🎮</button>
                        <button class="emoji-preset" data-emoji="📖">📖</button>
                        <button class="emoji-preset" data-emoji="🎬">🎬</button>
                        <button class="emoji-preset" data-emoji="🧘">🧘</button>
                        <button class="emoji-preset" data-emoji="🛁">🛁</button>
                        <button class="emoji-preset" data-emoji="☕">☕</button>
                        <button class="emoji-preset" data-emoji="🎵">🎵</button>
                        <button class="emoji-preset" data-emoji="🛒">🛒</button>
                        <button class="emoji-preset" data-emoji="💪">💪</button>
                        <button class="emoji-preset" data-emoji="🧹">🧹</button>
                        <button class="emoji-preset" data-emoji="🍳">🍳</button>
                        <button class="emoji-preset" data-emoji="📱">📱</button>
                        <button class="emoji-preset" data-emoji="🎨">🎨</button>
                        <button class="emoji-preset" data-emoji="⭐">⭐</button>
                        <button class="emoji-preset" data-emoji="🔥">🔥</button>
                        <button class="emoji-preset" data-emoji="⚽">⚽</button>
                        <button class="emoji-preset" data-emoji="🌙">🌙</button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>시작 시간:</label>
                <input type="time" id="activityStartTime">
            </div>
            <div class="form-group">
                <label>⏰ 소요 시간:</label>
                <div class="duration-input-group">
                    <div class="duration-part">
                        <input type="number" id="activityHours" min="0" max="23" value="1" placeholder="0">
                        <label>시간</label>
                    </div>
                    <div class="duration-separator">:</div>
                    <div class="duration-part">
                        <input type="number" id="activityMinutes" min="0" max="59" step="15" value="0" placeholder="0">
                        <label>분</label>
                    </div>
                </div>
                <div class="duration-presets">
                    <button type="button" class="duration-preset" data-hours="0" data-minutes="30">30분</button>
                    <button type="button" class="duration-preset" data-hours="1" data-minutes="0">1시간</button>
                    <button type="button" class="duration-preset" data-hours="1" data-minutes="30">1.5시간</button>
                    <button type="button" class="duration-preset" data-hours="2" data-minutes="0">2시간</button>
                    <button type="button" class="duration-preset" data-hours="8" data-minutes="0">8시간</button>
                </div>
            </div>
            <div class="form-group">
                <label>🎨 배경 색상:</label>
                <div class="color-picker">
                    <input type="color" id="activityColor">
                    <div class="color-presets">
                        <button class="color-preset" data-color="#FF6B6B" style="background: #FF6B6B;"></button>
                        <button class="color-preset" data-color="#4ECDC4" style="background: #4ECDC4;"></button>
                        <button class="color-preset" data-color="#45B7D1" style="background: #45B7D1;"></button>
                        <button class="color-preset" data-color="#96CEB4" style="background: #96CEB4;"></button>
                        <button class="color-preset" data-color="#FFEAA7" style="background: #FFEAA7;"></button>
                        <button class="color-preset" data-color="#DDA0DD" style="background: #DDA0DD;"></button>
                        <button class="color-preset" data-color="#98D8C8" style="background: #98D8C8;"></button>
                        <button class="color-preset" data-color="#A8E6CF" style="background: #A8E6CF;"></button>
                    </div>
                </div>
            </div>
                    <div class="form-group">
                        <label>📝 개별 폰트 크기:</label>
                        <div class="font-size-control">
                            <input type="range" id="activityFontSize" min="8" max="120" value="12" step="2">
                            <span id="activityFontSizeValue">12px</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>📏 글씨 굵기:</label>
                        <div class="font-weight-control">
                            <select id="activityFontWeight" class="font-weight-select">
                                <option value="300">Light (300)</option>
                                <option value="400" selected>Normal (400)</option>
                                <option value="500">Medium (500)</option>
                                <option value="600">Semi Bold (600)</option>
                                <option value="700">Bold (700)</option>
                                <option value="800">Extra Bold (800)</option>
                                <option value="900">Black (900)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>🎨 개별 폰트 색상:</label>
                        <div class="font-color-control">
                            <input type="color" id="activityFontColor" value="#ffffff">
                            <span>텍스트 색상</span>
                        </div>
                    </div>
        </div>
        <div class="modal-footer">
            <button id="saveActivity" class="btn btn-primary">저장</button>
            <button id="deleteActivity" class="btn btn-danger" style="display:none;">삭제</button>
            <button onclick="closeModal()" class="btn btn-secondary">취소</button>
        </div>
    </div>
</div>

<div class="modal-overlay" id="modalOverlay"></div>

<?php include_once '../includes/footer.php'; ?>

<script src="../assets/js/daily-scheduler.js"></script>
