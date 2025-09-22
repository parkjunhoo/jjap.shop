<?php
// URL에서 요원 이름 추출 (쿼리 파라미터)
$selected_agent = $_GET['agent'] ?? '';

// 페이지 메타 정보
$page_title = '발로란트 팁 작성하기 - 게임 공략 - 짭샵';
$page_description = '발로란트 요원별 공략과 팁을 작성하고 공유해보세요. 초보부터 고수까지 모든 게이머들과 노하우를 나눠보세요.';
$page_keywords = '발로란트, 발로란트 팁 작성, 발로란트 공략 작성, 게임 팁 작성, 발로란트 가이드, 게임 공략, 짭샵';
$canonical_url = 'https://jjap.shop/game/valorant/write';

// 페이지별 CSS, JS
$page_css = 'assets/css/valorant-write.css';
$page_js = 'assets/js/valorant-write.js';
?>

<?php include_once '../../includes/section-headers/game-header.php'; ?>

<!-- Quill 에디터 CSS -->
<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">

<main class="valorant-write-main">
    <div class="write-container">
        <div class="write-header">
            <h1 class="write-title">⚡ 발로란트 팁 작성하기</h1>
            <p class="write-subtitle">다른 게이머들과 유용한 팁과 전략을 공유해보세요!</p>
        </div>

        <!-- AdSense 광고 -->
        <?php include_once '../../includes/ads/horizontal-ad.php'; ?>

        <div class="write-form-container">
            <form id="writeForm" class="write-form">
                <!-- 요원 선택 -->
                <div class="form-group">
                    <label class="form-label">
                        <i class="label-icon">🎯</i>
                        요원 선택
                        <span class="required">*</span>
                    </label>
                    <div class="agent-selector-container">
                        <!-- 로딩 상태 -->
                        <div id="agentSelectorLoading" class="agent-selector-loading">
                            <div class="loading-spinner">⚡</div>
                            <span>요원 목록을 불러오는 중...</span>
                        </div>
                        
                        <!-- 선택된 요원 미리보기 -->
                        <div id="selectedAgentCard" class="selected-agent-card" style="display: none;">
                            <div class="agent-card-image">
                                <img id="selectedAgentImage" src="" alt="">
                            </div>
                            <div class="agent-card-info">
                                <h4 id="selectedAgentName"></h4>
                                <p id="selectedAgentRole"></p>
                            </div>
                            <button type="button" id="changeAgentBtn" class="change-agent-btn">
                                <i class="change-icon">🔄</i>
                                변경
                            </button>
                        </div>
                        
                        <!-- 요원 선택 버튼 -->
                        <button type="button" id="selectAgentBtn" class="select-agent-btn">
                            <i class="select-icon">🎯</i>
                            요원 선택하기
                        </button>
                        
                        <!-- 숨겨진 입력 필드 -->
                        <input type="hidden" id="selectedAgentId" name="agent_id" required>
                    </div>
                </div>

                <!-- 제목 -->
                <div class="form-group">
                    <label for="titleInput" class="form-label">
                        <i class="label-icon">📝</i>
                        제목
                        <span class="required">*</span>
                    </label>
                    <input type="text" 
                           id="titleInput" 
                           name="title" 
                           class="form-input" 
                           placeholder="팁의 제목을 입력해주세요 (예: 제트 대시 활용법, 사이퍼 원웨이 스모크 위치)" 
                           maxlength="100" 
                           required>
                    <div class="input-counter">
                        <span id="titleCounter">0</span> / 100
                    </div>
                </div>

                <!-- 팁 카테고리 -->
                <div class="form-group">
                    <label for="categorySelect" class="form-label">
                        <i class="label-icon">📂</i>
                        카테고리
                    </label>
                    <select id="categorySelect" name="tip_category" class="form-select">
                        <option value="general">일반</option>
                        <option value="strategy">전략</option>
                        <option value="skill">스킬</option>
                        <option value="map">맵</option>
                    </select>
                </div>

                <!-- 난이도 -->
                <div class="form-group">
                    <label for="difficultySelect" class="form-label">
                        <i class="label-icon">⭐</i>
                        난이도
                    </label>
                    <div class="difficulty-options">
                        <label class="difficulty-option">
                            <input type="radio" name="tip_difficulty" value="beginner" checked>
                            <span class="difficulty-badge difficulty-beginner">초급</span>
                        </label>
                        <label class="difficulty-option">
                            <input type="radio" name="tip_difficulty" value="intermediate">
                            <span class="difficulty-badge difficulty-intermediate">중급</span>
                        </label>
                        <label class="difficulty-option">
                            <input type="radio" name="tip_difficulty" value="advanced">
                            <span class="difficulty-badge difficulty-advanced">고급</span>
                        </label>
                    </div>
                    <div class="difficulty-help">
                        <small>초급: 입문자용 기본 팁 | 중급: 어느 정도 익숙한 플레이어용 | 고급: 숙련자용 고난도 전략</small>
                    </div>
                </div>

                <!-- 내용 에디터 -->
                <div class="form-group">
                    <label class="form-label">
                        <i class="label-icon">✍️</i>
                        내용
                        <span class="required">*</span>
                    </label>
                    <div class="editor-container">
                        <div id="editor" class="editor"></div>
                    </div>
                </div>

                <!-- 작성자 정보 -->
                <div class="author-section">
                    <h3 class="section-title">
                        <i class="section-icon">👤</i>
                        작성자 정보
                    </h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="nicknameInput" class="form-label">
                                닉네임
                                <span class="required">*</span>
                            </label>
                            <input type="text" 
                                   id="nicknameInput" 
                                   name="nickname" 
                                   class="form-input" 
                                   placeholder="닉네임을 입력해주세요" 
                                   maxlength="20" 
                                   required>
                        </div>
                        <div class="form-group">
                            <label for="passwordInput" class="form-label">
                                비밀번호
                                <span class="required">*</span>
                            </label>
                            <input type="password" 
                                   id="passwordInput" 
                                   name="password" 
                                   class="form-input" 
                                   placeholder="수정/삭제시 사용할 비밀번호" 
                                   minlength="4" 
                                   required>
                        </div>
                    </div>
                </div>

                <!-- CAPTCHA -->
                <div class="form-group">
                    <label class="form-label">
                        <i class="label-icon">🔐</i>
                        자동입력방지문구
                        <span class="required">*</span>
                    </label>
                    <div class="captcha-container">
                        <div class="captcha-display">
                            <div class="captcha-image" id="captchaImage">AB</div>
                            <button type="button" class="captcha-refresh" id="refreshCaptcha">
                                <i class="refresh-icon">🔄</i>
                            </button>
                        </div>
                        <input type="text" id="captchaInput" name="captcha" class="form-input" placeholder="위의 2글자를 입력하세요" required maxlength="2" minlength="2" pattern="[A-Z0-9]{2}" oninput="this.value = this.value.toUpperCase()">
                        <div class="help-text">위의 2글자를 정확히 입력해주세요</div>
                    </div>
                </div>

                <!-- 제출 버튼 -->
                <div class="submit-section">
                    <div class="submit-buttons">
                        <button type="button" class="btn btn-cancel" onclick="history.back()">
                            <i class="btn-icon">↩️</i>
                            취소
                        </button>
                        <button type="submit" class="btn btn-submit" id="submitBtn">
                            <i class="btn-icon">🚀</i>
                            <span class="btn-text">팁 등록하기</span>
                            <div class="btn-loading" style="display: none;">
                                <div class="loading-spinner">⚡</div>
                                등록 중...
                            </div>
                        </button>
                    </div>
                    <div class="submit-notice">
                        <p>⚠️ 작성하신 내용은 다른 사용자들에게 공개됩니다.</p>
                        <p>📝 비밀번호는 게시글 수정/삭제 시 사용되니 기억해 두세요.</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</main>

<!-- Quill 에디터 JS -->
<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>

<!-- 선택된 요원 정보를 JavaScript로 전달 -->
<script>
window.preSelectedAgent = '<?php echo addslashes($selected_agent); ?>';
</script>

<style>
.valorant-write-main {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
    color: #ffffff;
    padding: 2rem 0;
}

.write-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
}

.write-header {
    text-align: center;
    margin-bottom: 3rem;
}

.write-title {
    font-size: 2.5rem;
    font-weight: 900;
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 1rem 0;
}

.write-subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.write-form-container {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(30, 30, 50, 0.8));
    border: 1px solid rgba(255, 70, 85, 0.2);
    border-radius: 20px;
    padding: 2.5rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.write-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
}

.label-icon {
    font-size: 1.1rem;
}

.required {
    color: #FF4655;
    font-weight: 700;
}

.form-input, .form-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 12px;
    color: #ffffff;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus {
    outline: none;
    border-color: #FF4655;
    box-shadow: 0 0 0 3px rgba(255, 70, 85, 0.2);
    background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.input-counter {
    align-self: flex-end;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.6);
}

/* 요원 선택 관련 */
.agent-select-container {
    position: relative;
}

.select-loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.selected-agent-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 70, 85, 0.1);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 12px;
}

.preview-agent-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 2px solid rgba(255, 70, 85, 0.5);
    object-fit: cover;
}

.preview-agent-info {
    flex: 1;
}

.preview-agent-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: #FF4655;
}

.preview-agent-type {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.change-agent-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.change-agent-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* 난이도 선택 */
.difficulty-options {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.difficulty-option {
    cursor: pointer;
}

.difficulty-option input[type="radio"] {
    display: none;
}

.difficulty-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.difficulty-beginner {
    background: rgba(76, 175, 80, 0.2);
    color: #81C784;
}

.difficulty-intermediate {
    background: rgba(255, 152, 0, 0.2);
    color: #FFB74D;
}

.difficulty-advanced {
    background: rgba(244, 67, 54, 0.2);
    color: #E57373;
}

.difficulty-option input[type="radio"]:checked + .difficulty-badge {
    border-color: currentColor;
    box-shadow: 0 0 10px rgba(255, 70, 85, 0.3);
}

.difficulty-help {
    margin-top: 0.5rem;
}

.difficulty-help small {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    line-height: 1.4;
}

/* 에디터 */
.editor-container {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 70, 85, 0.3);
    border-radius: 12px;
    overflow: hidden;
}

.editor {
    min-height: 300px;
    background: #ffffff;
}

.editor-help {
    padding: 1rem;
    background: rgba(255, 70, 85, 0.05);
    border-top: 1px solid rgba(255, 70, 85, 0.1);
}

.help-item strong {
    color: #FF4655;
    display: block;
    margin-bottom: 0.5rem;
}

.help-item ul {
    margin: 0;
    padding-left: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
}

.help-item li {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 0.25rem;
}

/* 작성자 섹션 */
.author-section {
    background: rgba(255, 70, 85, 0.05);
    border: 1px solid rgba(255, 70, 85, 0.2);
    border-radius: 15px;
    padding: 1.5rem;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
    font-weight: 700;
    color: #FF4655;
    margin: 0 0 1.5rem 0;
}

.section-icon {
    font-size: 1.3rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

/* 제출 섹션 */
.submit-section {
    text-align: center;
}

.submit-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.btn-cancel {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
}

.btn-submit {
    background: linear-gradient(135deg, #FF4655, #FF8A80);
    color: #ffffff;
    min-width: 160px;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 70, 85, 0.3);
}

.btn-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-loading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.submit-notice {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
}

.submit-notice p {
    margin: 0.25rem 0;
}

/* 반응형 */
@media (max-width: 768px) {
    .write-form-container {
        padding: 1.5rem;
    }
    
    .write-title {
        font-size: 2rem;
    }
    
    .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .submit-buttons {
        flex-direction: column;
    }
    
    .difficulty-options {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .write-container {
        padding: 0 15px;
    }
    
    .write-form-container {
        padding: 1rem;
    }
    
    .write-title {
        font-size: 1.8rem;
    }
    
    .btn {
        padding: 0.75rem 1.5rem;
    }
}
</style>
</head>
<body>
    <div class="write-container">
        <!-- 페이지 타이틀 -->
        <h1 class="write-title">
            <i class="title-icon">🎯</i>
            발로란트 팁 작성
        </h1>

    </div>

    <!-- 요원 선택 모달 -->
    <div id="agentSelectModal" class="agent-modal" style="display: none;">
        <div class="modal-overlay" id="agentModalOverlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>요원 선택</h2>
                <button type="button" id="closeAgentModal" class="modal-close">
                    <i class="close-icon">✕</i>
                </button>
            </div>
            <div class="modal-body">
                <div id="agentModalLoading" class="modal-loading">
                    <div class="loading-spinner">⚡</div>
                    <span>요원 목록을 불러오는 중...</span>
                </div>
                <div id="agentGrid" class="agent-grid" style="display: none;">
                    <!-- 요원들이 여기에 동적으로 추가됩니다 -->
                </div>
            </div>
        </div>
    </div>

</body>
</html>
