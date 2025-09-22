<?php
$page_title = '랜덤 아이디어 생성기 - 짭샵 유틸리티';
$page_description = '오늘 뭐 할까? 다양한 활동 아이디어를 랜덤으로 추천받으세요. 데이트, 요리, 취미활동, 운동 등 카테고리별 아이디어 제공.';
$page_keywords = '아이디어 생성기, 랜덤 추천, 데이트 아이디어, 요리 추천, 취미활동, 심심할 때';
$page_css = 'assets/css/idea-generator.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="idea-container">
    <div class="idea-header">
        <h1>💡 랜덤 아이디어 생성기</h1>
        <p>오늘 뭐 할까? 다양한 활동 아이디어를 랜덤으로 추천받으세요</p>
    </div>

    <div class="idea-main">
        <div class="idea-controls">
            <div class="category-section">
                <h3>🎯 카테고리 선택</h3>
                <div class="category-grid">
                    <button class="category-btn active" data-category="all">
                        <div class="category-icon">🎲</div>
                        <div class="category-name">전체</div>
                    </button>
                    <button class="category-btn" data-category="date">
                        <div class="category-icon">💕</div>
                        <div class="category-name">데이트</div>
                    </button>
                    <button class="category-btn" data-category="food">
                        <div class="category-icon">🍽️</div>
                        <div class="category-name">요리</div>
                    </button>
                    <button class="category-btn" data-category="hobby">
                        <div class="category-icon">🎨</div>
                        <div class="category-name">취미</div>
                    </button>
                    <button class="category-btn" data-category="exercise">
                        <div class="category-icon">🏃</div>
                        <div class="category-name">운동</div>
                    </button>
                    <button class="category-btn" data-category="travel">
                        <div class="category-icon">✈️</div>
                        <div class="category-name">여행</div>
                    </button>
                    <button class="category-btn" data-category="study">
                        <div class="category-icon">📚</div>
                        <div class="category-name">학습</div>
                    </button>
                    <button class="category-btn" data-category="creative">
                        <div class="category-icon">🎭</div>
                        <div class="category-name">창작</div>
                    </button>
                    <button class="category-btn" data-category="social">
                        <div class="category-icon">👥</div>
                        <div class="category-name">사교</div>
                    </button>
                    <button class="category-btn" data-category="relax">
                        <div class="category-icon">🧘</div>
                        <div class="category-name">휴식</div>
                    </button>
                    <button class="category-btn" data-category="challenge">
                        <div class="category-icon">🏆</div>
                        <div class="category-name">도전</div>
                    </button>
                    <button class="category-btn" data-category="indoor">
                        <div class="category-icon">🏠</div>
                        <div class="category-name">실내</div>
                    </button>
                </div>
            </div>

            <div class="generation-section">
                <button id="generateBtn" class="generate-btn">
                    <span class="btn-icon">🎲</span>
                    <span class="btn-text">아이디어 생성</span>
                </button>
                
                <div class="generation-options">
                    <div class="option-group">
                        <label for="ideaCount">생성 개수</label>
                        <select id="ideaCount">
                            <option value="1">1개</option>
                            <option value="3" selected>3개</option>
                            <option value="5">5개</option>
                            <option value="10">10개</option>
                        </select>
                    </div>
                    <div class="option-group">
                        <label for="difficultyLevel">난이도</label>
                        <select id="difficultyLevel">
                            <option value="all">모든 난이도</option>
                            <option value="easy">쉬움</option>
                            <option value="medium">보통</option>
                            <option value="hard">어려움</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="idea-display">
            <div id="ideaResults" class="idea-results">
                <div class="welcome-state">
                    <div class="welcome-icon">🌟</div>
                    <h3>아이디어를 기다리고 있어요!</h3>
                    <p>카테고리를 선택하고 "아이디어 생성" 버튼을 눌러보세요.<br>
                    새로운 활동과 경험을 발견할 수 있을 거예요!</p>
                </div>
            </div>
        </div>
    </div>

    <div class="idea-features">
        <div class="feature-section">
            <h3>📊 생성 통계</h3>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">🎲</div>
                    <div class="stat-value" id="totalGenerated">0</div>
                    <div class="stat-label">생성된 아이디어</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-value" id="favoriteCount">0</div>
                    <div class="stat-label">즐겨찾기</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🔥</div>
                    <div class="stat-value" id="streakCount">0</div>
                    <div class="stat-label">연속 생성일</div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🏆</div>
                    <div class="stat-value" id="categoryMaster">-</div>
                    <div class="stat-label">주 카테고리</div>
                </div>
            </div>
        </div>

        <div class="favorites-section">
            <div class="favorites-header">
                <h3>⭐ 즐겨찾기 아이디어</h3>
                <button id="clearFavoritesBtn" class="btn-clear">모두 삭제</button>
            </div>
            <div id="favoritesList" class="favorites-list">
                <div class="empty-favorites">
                    <div class="empty-icon">⭐</div>
                    <p>아직 즐겨찾기한 아이디어가 없어요.<br>마음에 드는 아이디어를 ⭐ 버튼으로 저장해보세요!</p>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/idea-generator.js"></script>

<?php include_once '../includes/footer.php'; ?>
