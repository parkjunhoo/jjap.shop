<?php
$page_title = '네이밍 생성기 - 짭샵 유틸리티';
$page_description = '브랜드명, 닉네임, 프로젝트명을 자동으로 생성하세요. 창의적이고 기억하기 쉬운 이름을 만들어 드립니다.';
$page_keywords = '네이밍 생성기, 브랜드명 생성, 닉네임 만들기, 프로젝트명, 회사명, 제품명, 이름 추천';
$page_css = 'assets/css/name-generator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="naming-container">
    <div class="naming-header">
        <h1>📝 네이밍 생성기</h1>
        <p>창의적이고 기억하기 쉬운 이름을 자동으로 생성해드립니다</p>
    </div>

    <div class="naming-main">
        <div class="naming-controls">
            <div class="generation-section">
                <h3>🎯 이름 생성 설정</h3>
                
                <div class="option-group">
                    <label for="nameType">이름 유형</label>
                    <select id="nameType">
                        <option value="brand">🏢 브랜드/회사명</option>
                        <option value="product">📦 제품명</option>
                        <option value="project">💼 프로젝트명</option>
                        <option value="nickname">👤 닉네임</option>
                        <option value="app">📱 앱 이름</option>
                        <option value="website">🌐 웹사이트명</option>
                        <option value="youtube">📺 유튜브 채널</option>
                        <option value="game">🎮 게임명</option>
                    </select>
                </div>

                <div class="option-group">
                    <label for="nameStyle">스타일</label>
                    <select id="nameStyle">
                        <option value="creative">🎨 창의적</option>
                        <option value="professional">💼 전문적</option>
                        <option value="fun">😄 재미있는</option>
                        <option value="modern">✨ 모던</option>
                        <option value="classic">🏛️ 클래식</option>
                        <option value="tech">💻 기술적</option>
                        <option value="cute">🥰 귀여운</option>
                        <option value="powerful">💪 강력한</option>
                    </select>
                </div>

                <div class="option-group">
                    <label for="nameLength">길이</label>
                    <select id="nameLength">
                        <option value="short">짧음 (3-6자)</option>
                        <option value="medium" selected>보통 (7-12자)</option>
                        <option value="long">긺 (13-20자)</option>
                    </select>
                </div>

                <div class="option-group">
                    <label for="nameLanguage">언어</label>
                    <select id="nameLanguage">
                        <option value="korean" selected>한국어</option>
                        <option value="english">영어</option>
                        <option value="mixed">한영 혼합</option>
                        <option value="japanese">일본어 스타일</option>
                    </select>
                </div>

                <div class="option-group">
                    <label for="keywordInput">키워드 (선택)</label>
                    <input type="text" id="keywordInput" placeholder="포함하고 싶은 키워드를 입력하세요">
                    <small>예: 카페, 기술, 디자인 등</small>
                </div>

                <div class="option-group">
                    <label for="generateCount">생성 개수</label>
                    <select id="generateCount">
                        <option value="5">5개</option>
                        <option value="10" selected>10개</option>
                        <option value="15">15개</option>
                        <option value="20">20개</option>
                    </select>
                </div>

                <button id="generateNamesBtn" class="generate-btn">
                    <span class="btn-icon">🎲</span>
                    <span class="btn-text">이름 생성하기</span>
                </button>
            </div>

            <div class="quick-presets">
                <h3>⚡ 빠른 생성</h3>
                <div class="preset-grid">
                    <button class="preset-btn" data-preset="startup">
                        <span class="preset-icon">🚀</span>
                        <span class="preset-name">스타트업</span>
                    </button>
                    <button class="preset-btn" data-preset="cafe">
                        <span class="preset-icon">☕</span>
                        <span class="preset-name">카페</span>
                    </button>
                    <button class="preset-btn" data-preset="fashion">
                        <span class="preset-icon">👗</span>
                        <span class="preset-name">패션</span>
                    </button>
                    <button class="preset-btn" data-preset="game">
                        <span class="preset-icon">🎮</span>
                        <span class="preset-name">게임</span>
                    </button>
                    <button class="preset-btn" data-preset="beauty">
                        <span class="preset-icon">💄</span>
                        <span class="preset-name">뷰티</span>
                    </button>
                    <button class="preset-btn" data-preset="food">
                        <span class="preset-icon">🍔</span>
                        <span class="preset-name">음식</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="naming-display">
            <div id="nameResults" class="name-results">
                <div class="welcome-state">
                    <div class="welcome-icon">✨</div>
                    <h3>완벽한 이름을 찾아드릴게요!</h3>
                    <p>왼쪽에서 원하는 설정을 선택하고<br>"이름 생성하기" 버튼을 클릭하세요.</p>
                </div>
            </div>

            <div class="name-tools" id="nameTools" style="display: none;">
                <div class="tools-header">
                    <h4>🛠️ 이름 도구</h4>
                </div>
                <div class="tools-grid">
                    <button class="tool-btn" onclick="nameGenerator.checkDomain()">
                        <span class="tool-icon">🌐</span>
                        <span class="tool-text">도메인 확인</span>
                    </button>
                    <button class="tool-btn" onclick="nameGenerator.analyzeNames()">
                        <span class="tool-icon">📊</span>
                        <span class="tool-text">이름 분석</span>
                    </button>
                    <button class="tool-btn" onclick="nameGenerator.exportNames()">
                        <span class="tool-icon">💾</span>
                        <span class="tool-text">내보내기</span>
                    </button>
                    <button class="tool-btn" onclick="nameGenerator.shareNames()">
                        <span class="tool-icon">🔗</span>
                        <span class="tool-text">공유하기</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="naming-features">
        <div class="favorites-section">
            <div class="section-header">
                <h3>⭐ 즐겨찾기 이름</h3>
                <button id="clearFavoritesBtn" class="btn-clear">모두 삭제</button>
            </div>
            <div id="favoriteNamesList" class="favorites-list">
                <div class="empty-favorites">
                    <div class="empty-icon">⭐</div>
                    <p>마음에 드는 이름을 ⭐ 버튼으로 저장해보세요!</p>
                </div>
            </div>
        </div>

        <div class="history-section">
            <div class="section-header">
                <h3>📜 생성 기록</h3>
                <button id="clearHistoryBtn" class="btn-clear">기록 삭제</button>
            </div>
            <div id="nameHistoryList" class="history-list">
                <div class="empty-history">
                    <div class="empty-icon">📝</div>
                    <p>아직 생성 기록이 없습니다.<br>이름을 생성하면 기록이 저장됩니다!</p>
                </div>
            </div>
        </div>
    </div>

    <!-- 도구 모달 -->
    <div id="toolModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">도구</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- 도구별 내용이 여기에 표시됩니다 -->
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/name-generator.js"></script>

<?php include_once '../includes/footer.php'; ?>
