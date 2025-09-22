<?php
$page_title = '색상 팔레트 생성기 - 짭샵 유틸리티';
$page_description = '아름다운 색상 조합을 자동으로 생성하고 hex 코드를 확인하세요. 디자인, 인테리어, 웹 개발에 활용할 수 있는 완벽한 색상 팔레트.';
$page_keywords = '색상 팔레트, 컬러 생성기, hex 코드, RGB, 디자인 도구, 색상 조합, 팔레트 추천';
$page_css = 'assets/css/color-palette.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<div class="palette-container">
    <div class="palette-header">
        <h1>🎨 색상 팔레트 생성기</h1>
        <p>아름다운 색상 조합을 만들고 hex 코드를 확인하세요</p>
    </div>

    <div class="palette-main">
        <div class="palette-controls">
            <div class="generation-section">
                <h3>🎯 팔레트 생성</h3>
                
                <div class="generation-options">
                    <div class="option-group">
                        <label for="paletteType">팔레트 유형</label>
                        <select id="paletteType">
                            <option value="random">랜덤</option>
                            <option value="monochromatic">단색 조화</option>
                            <option value="analogous">인접 조화</option>
                            <option value="complementary">보색 조화</option>
                            <option value="triadic">삼각 조화</option>
                            <option value="tetradic">사각 조화</option>
                            <option value="warm">따뜻한 톤</option>
                            <option value="cool">시원한 톤</option>
                            <option value="pastel">파스텔</option>
                            <option value="dark">다크 톤</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label for="colorCount">색상 개수</label>
                        <select id="colorCount">
                            <option value="3">3개</option>
                            <option value="4">4개</option>
                            <option value="5" selected>5개</option>
                            <option value="6">6개</option>
                            <option value="8">8개</option>
                        </select>
                    </div>
                </div>

                <div class="base-color-section">
                    <label for="baseColor">기준 색상 (선택)</label>
                    <div class="color-input-group">
                        <input type="color" id="baseColor" value="#3498db">
                        <input type="text" id="baseColorHex" value="#3498db" placeholder="#000000">
                        <button id="randomizeBase" class="btn-randomize">🎲</button>
                    </div>
                </div>

                <button id="generatePaletteBtn" class="generate-btn">
                    <span class="btn-icon">🎨</span>
                    <span class="btn-text">팔레트 생성</span>
                </button>
            </div>

            <div class="presets-section">
                <h3>🎭 테마 프리셋</h3>
                <div class="preset-grid">
                    <button class="preset-btn" data-preset="sunset">
                        <div class="preset-colors">
                            <div style="background: #ff6b6b"></div>
                            <div style="background: #ffa726"></div>
                            <div style="background: #ffeb3b"></div>
                            <div style="background: #ff7043"></div>
                            <div style="background: #8e24aa"></div>
                        </div>
                        <div class="preset-name">🌅 석양</div>
                    </button>
                    
                    <button class="preset-btn" data-preset="ocean">
                        <div class="preset-colors">
                            <div style="background: #006064"></div>
                            <div style="background: #00838f"></div>
                            <div style="background: #26c6da"></div>
                            <div style="background: #4fc3f7"></div>
                            <div style="background: #81d4fa"></div>
                        </div>
                        <div class="preset-name">🌊 바다</div>
                    </button>
                    
                    <button class="preset-btn" data-preset="forest">
                        <div class="preset-colors">
                            <div style="background: #2e7d32"></div>
                            <div style="background: #388e3c"></div>
                            <div style="background: #43a047"></div>
                            <div style="background: #66bb6a"></div>
                            <div style="background: #81c784"></div>
                        </div>
                        <div class="preset-name">🌲 숲</div>
                    </button>
                    
                    <button class="preset-btn" data-preset="candy">
                        <div class="preset-colors">
                            <div style="background: #f8bbd9"></div>
                            <div style="background: #f3d2c1"></div>
                            <div style="background: #fef9e7"></div>
                            <div style="background: #d4f1f4"></div>
                            <div style="background: #c2e7d9"></div>
                        </div>
                        <div class="preset-name">🍭 캔디</div>
                    </button>
                </div>
            </div>
        </div>

        <div class="palette-display">
            <div id="currentPalette" class="current-palette">
                <div class="palette-welcome">
                    <div class="welcome-icon">🌈</div>
                    <h3>아름다운 색상 팔레트를 생성해보세요!</h3>
                    <p>왼쪽에서 원하는 설정을 선택하고<br>"팔레트 생성" 버튼을 클릭하세요.</p>
                </div>
            </div>
            
            <div class="palette-info" id="paletteInfo" style="display: none;">
                <div class="info-header">
                    <h4>📋 팔레트 정보</h4>
                    <div class="palette-actions">
                        <button id="copyAllBtn" class="action-btn">📋 전체 복사</button>
                        <button id="downloadBtn" class="action-btn">💾 다운로드</button>
                        <button id="saveBtn" class="action-btn">⭐ 저장</button>
                    </div>
                </div>
                
                <div class="color-details" id="colorDetails">
                    <!-- 색상 상세 정보가 여기에 표시됩니다 -->
                </div>
            </div>
        </div>
    </div>

    <div class="palette-features">
        <div class="saved-palettes-section">
            <div class="section-header">
                <h3>💾 저장된 팔레트</h3>
                <button id="clearSavedBtn" class="btn-clear">모두 삭제</button>
            </div>
            <div id="savedPalettesList" class="saved-palettes-list">
                <div class="empty-saved">
                    <div class="empty-icon">🎨</div>
                    <p>아직 저장된 팔레트가 없어요.<br>마음에 드는 팔레트를 저장해보세요!</p>
                </div>
            </div>
        </div>

        <div class="tools-section">
            <h3>🛠️ 색상 도구</h3>
            <div class="tools-grid">
                <div class="tool-card" onclick="colorPalette.showColorConverter()">
                    <div class="tool-icon">🔄</div>
                    <div class="tool-name">색상 변환기</div>
                    <div class="tool-desc">HEX ↔ RGB ↔ HSL</div>
                </div>
                
                <div class="tool-card" onclick="colorPalette.showContrastChecker()">
                    <div class="tool-icon">👁️</div>
                    <div class="tool-name">대비 검사</div>
                    <div class="tool-desc">접근성 확인</div>
                </div>
                
                <div class="tool-card" onclick="colorPalette.showGradientGenerator()">
                    <div class="tool-icon">🌈</div>
                    <div class="tool-name">그라디언트</div>
                    <div class="tool-desc">CSS 그라디언트</div>
                </div>
                
                <div class="tool-card" onclick="colorPalette.showColorHistory()">
                    <div class="tool-icon">📜</div>
                    <div class="tool-name">생성 기록</div>
                    <div class="tool-desc">최근 팔레트</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 색상 도구 모달들 -->
    <div id="toolModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">색상 도구</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body" id="modalBody">
                <!-- 도구별 내용이 여기에 표시됩니다 -->
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/color-palette.js"></script>

<?php include_once '../includes/footer.php'; ?>
