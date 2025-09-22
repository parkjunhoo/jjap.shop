// 🎨 색상 팔레트 생성기 JavaScript

class ColorPalette {
    constructor() {
        this.currentPalette = null;
        this.savedPalettes = JSON.parse(localStorage.getItem('savedPalettes')) || [];
        this.colorHistory = JSON.parse(localStorage.getItem('colorHistory')) || [];
        
        this.presets = {
            sunset: ['#ff6b6b', '#ffa726', '#ffeb3b', '#ff7043', '#8e24aa'],
            ocean: ['#006064', '#00838f', '#26c6da', '#4fc3f7', '#81d4fa'],
            forest: ['#2e7d32', '#388e3c', '#43a047', '#66bb6a', '#81c784'],
            candy: ['#f8bbd9', '#f3d2c1', '#fef9e7', '#d4f1f4', '#c2e7d9']
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderSavedPalettes();
        this.showNotification('색상 팔레트 생성기가 준비되었습니다! 🎨', 'success');
    }
    
    setupEventListeners() {
        // 팔레트 생성 버튼
        document.getElementById('generatePaletteBtn').addEventListener('click', () => {
            this.generatePalette();
        });
        
        // 기준 색상 입력
        document.getElementById('baseColor').addEventListener('input', (e) => {
            document.getElementById('baseColorHex').value = e.target.value.toUpperCase();
        });
        
        document.getElementById('baseColorHex').addEventListener('input', (e) => {
            const hex = this.validateHex(e.target.value);
            if (hex) {
                document.getElementById('baseColor').value = hex;
            }
        });
        
        // 랜덤 기준 색상
        document.getElementById('randomizeBase').addEventListener('click', () => {
            const randomColor = this.generateRandomColor();
            document.getElementById('baseColor').value = randomColor;
            document.getElementById('baseColorHex').value = randomColor.toUpperCase();
        });
        
        // 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.loadPreset(preset);
            });
        });
        
        // 팔레트 액션 버튼들
        document.getElementById('copyAllBtn').addEventListener('click', () => {
            this.copyAllColors();
        });
        
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadPalette();
        });
        
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.savePalette();
        });
        
        // 저장된 팔레트 삭제
        document.getElementById('clearSavedBtn').addEventListener('click', () => {
            this.clearSavedPalettes();
        });
        
        // 모달 관련
        document.getElementById('toolModal').addEventListener('click', (e) => {
            if (e.target.id === 'toolModal') {
                this.closeModal();
            }
        });
        
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }
    
    generatePalette() {
        const type = document.getElementById('paletteType').value;
        const count = parseInt(document.getElementById('colorCount').value);
        const baseColor = document.getElementById('baseColor').value;
        
        let colors = [];
        
        switch (type) {
            case 'random':
                colors = this.generateRandomPalette(count);
                break;
            case 'monochromatic':
                colors = this.generateMonochromaticPalette(baseColor, count);
                break;
            case 'analogous':
                colors = this.generateAnalogousPalette(baseColor, count);
                break;
            case 'complementary':
                colors = this.generateComplementaryPalette(baseColor, count);
                break;
            case 'triadic':
                colors = this.generateTriadicPalette(baseColor, count);
                break;
            case 'tetradic':
                colors = this.generateTetradicPalette(baseColor, count);
                break;
            case 'warm':
                colors = this.generateWarmPalette(count);
                break;
            case 'cool':
                colors = this.generateCoolPalette(count);
                break;
            case 'pastel':
                colors = this.generatePastelPalette(count);
                break;
            case 'dark':
                colors = this.generateDarkPalette(count);
                break;
        }
        
        this.currentPalette = {
            id: Date.now().toString(),
            colors: colors,
            type: type,
            createdAt: new Date().toISOString()
        };
        
        this.displayPalette(colors);
        this.addToHistory();
        this.showNotification('새로운 팔레트가 생성되었습니다! 🌈', 'success');
    }
    
    generateRandomPalette(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(this.generateRandomColor());
        }
        return colors;
    }
    
    generateMonochromaticPalette(baseColor, count) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const lightness = Math.max(10, Math.min(90, hsl.l + (i - Math.floor(count/2)) * 15));
            colors.push(this.hslToHex(hsl.h, hsl.s, lightness));
        }
        
        return colors;
    }
    
    generateAnalogousPalette(baseColor, count) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [];
        const step = 30; // 30도 간격
        
        for (let i = 0; i < count; i++) {
            const hue = (hsl.h + (i - Math.floor(count/2)) * step + 360) % 360;
            const saturation = Math.max(20, Math.min(100, hsl.s + Math.random() * 20 - 10));
            const lightness = Math.max(20, Math.min(80, hsl.l + Math.random() * 20 - 10));
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }
    
    generateComplementaryPalette(baseColor, count) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [baseColor];
        
        // 보색 추가
        const complementaryHue = (hsl.h + 180) % 360;
        colors.push(this.hslToHex(complementaryHue, hsl.s, hsl.l));
        
        // 나머지 색상들은 이 두 색을 기준으로 변형
        for (let i = 2; i < count; i++) {
            const baseIndex = i % 2;
            const baseHsl = baseIndex === 0 ? hsl : { h: complementaryHue, s: hsl.s, l: hsl.l };
            
            const saturation = Math.max(20, Math.min(100, baseHsl.s + Math.random() * 30 - 15));
            const lightness = Math.max(20, Math.min(80, baseHsl.l + Math.random() * 30 - 15));
            colors.push(this.hslToHex(baseHsl.h, saturation, lightness));
        }
        
        return colors;
    }
    
    generateTriadicPalette(baseColor, count) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [baseColor];
        
        // 삼각 조화 (120도씩)
        for (let i = 1; i < Math.min(3, count); i++) {
            const hue = (hsl.h + i * 120) % 360;
            colors.push(this.hslToHex(hue, hsl.s, hsl.l));
        }
        
        // 추가 색상이 필요하면 변형 추가
        for (let i = 3; i < count; i++) {
            const baseIndex = i % 3;
            const baseHsl = this.hexToHsl(colors[baseIndex]);
            
            const saturation = Math.max(20, Math.min(100, baseHsl.s + Math.random() * 20 - 10));
            const lightness = Math.max(20, Math.min(80, baseHsl.l + Math.random() * 20 - 10));
            colors.push(this.hslToHex(baseHsl.h, saturation, lightness));
        }
        
        return colors;
    }
    
    generateTetradicPalette(baseColor, count) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [baseColor];
        
        // 사각 조화 (90도씩)
        for (let i = 1; i < Math.min(4, count); i++) {
            const hue = (hsl.h + i * 90) % 360;
            colors.push(this.hslToHex(hue, hsl.s, hsl.l));
        }
        
        // 추가 색상이 필요하면 변형 추가
        for (let i = 4; i < count; i++) {
            const baseIndex = i % 4;
            const baseHsl = this.hexToHsl(colors[baseIndex]);
            
            const saturation = Math.max(20, Math.min(100, baseHsl.s + Math.random() * 20 - 10));
            const lightness = Math.max(20, Math.min(80, baseHsl.l + Math.random() * 20 - 10));
            colors.push(this.hslToHex(baseHsl.h, saturation, lightness));
        }
        
        return colors;
    }
    
    generateWarmPalette(count) {
        const warmHues = [0, 30, 60, 15, 45]; // 빨강, 주황, 노랑 계열
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = warmHues[i % warmHues.length] + Math.random() * 20 - 10;
            const saturation = 60 + Math.random() * 40;
            const lightness = 40 + Math.random() * 40;
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }
    
    generateCoolPalette(count) {
        const coolHues = [180, 210, 240, 270, 300]; // 파랑, 보라 계열
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = coolHues[i % coolHues.length] + Math.random() * 20 - 10;
            const saturation = 60 + Math.random() * 40;
            const lightness = 40 + Math.random() * 40;
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }
    
    generatePastelPalette(count) {
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = Math.random() * 360;
            const saturation = 30 + Math.random() * 40; // 낮은 채도
            const lightness = 70 + Math.random() * 20; // 높은 명도
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }
    
    generateDarkPalette(count) {
        const colors = [];
        
        for (let i = 0; i < count; i++) {
            const hue = Math.random() * 360;
            const saturation = 40 + Math.random() * 60;
            const lightness = 10 + Math.random() * 30; // 낮은 명도
            colors.push(this.hslToHex(hue, saturation, lightness));
        }
        
        return colors;
    }
    
    generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    
    loadPreset(presetKey) {
        const colors = this.presets[presetKey];
        if (!colors) return;
        
        this.currentPalette = {
            id: Date.now().toString(),
            colors: colors,
            type: presetKey,
            createdAt: new Date().toISOString()
        };
        
        this.displayPalette(colors);
        this.addToHistory();
        this.showNotification(`${presetKey} 프리셋이 적용되었습니다! 🎨`, 'success');
    }
    
    displayPalette(colors) {
        const container = document.getElementById('currentPalette');
        
        container.innerHTML = `
            <div class="palette-colors">
                ${colors.map((color, index) => `
                    <div class="palette-color" style="background-color: ${color}" onclick="colorPalette.copyColor('${color}', ${index})">
                        <div class="color-info">${color.toUpperCase()}</div>
                        <div class="copy-indicator" id="copyIndicator${index}">복사됨!</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 팔레트 정보 섹션 표시
        document.getElementById('paletteInfo').style.display = 'block';
        this.displayColorDetails(colors);
    }
    
    displayColorDetails(colors) {
        const container = document.getElementById('colorDetails');
        
        container.innerHTML = colors.map((color, index) => {
            const rgb = this.hexToRgb(color);
            const hsl = this.hexToHsl(color);
            
            return `
                <div class="color-detail-card">
                    <div class="color-preview" style="background-color: ${color}"></div>
                    <div class="color-values">
                        <div class="color-value" onclick="colorPalette.copyToClipboard('${color.toUpperCase()}')">
                            HEX: ${color.toUpperCase()}
                        </div>
                        <div class="color-value" onclick="colorPalette.copyToClipboard('rgb(${rgb.r}, ${rgb.g}, ${rgb.b})')">
                            RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}
                        </div>
                        <div class="color-value" onclick="colorPalette.copyToClipboard('hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)')">
                            HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    copyColor(color, index) {
        this.copyToClipboard(color.toUpperCase());
        
        const indicator = document.getElementById(`copyIndicator${index}`);
        indicator.classList.add('show');
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 1000);
    }
    
    copyAllColors() {
        if (!this.currentPalette) {
            this.showNotification('복사할 팔레트가 없습니다!', 'error');
            return;
        }
        
        const colorsText = this.currentPalette.colors.join(', ');
        this.copyToClipboard(colorsText);
        this.showNotification('모든 색상이 복사되었습니다! 📋', 'success');
    }
    
    downloadPalette() {
        if (!this.currentPalette) {
            this.showNotification('다운로드할 팔레트가 없습니다!', 'error');
            return;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const colorWidth = 100;
        const colorHeight = 400;
        canvas.width = colorWidth * this.currentPalette.colors.length;
        canvas.height = colorHeight;
        
        this.currentPalette.colors.forEach((color, index) => {
            ctx.fillStyle = color;
            ctx.fillRect(index * colorWidth, 0, colorWidth, colorHeight);
            
            // 색상 정보 텍스트
            ctx.fillStyle = this.getContrastColor(color);
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(color.toUpperCase(), (index + 0.5) * colorWidth, colorHeight - 20);
        });
        
        // 다운로드
        const link = document.createElement('a');
        link.download = `palette_${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('팔레트가 다운로드되었습니다! 💾', 'success');
    }
    
    savePalette() {
        if (!this.currentPalette) {
            this.showNotification('저장할 팔레트가 없습니다!', 'error');
            return;
        }
        
        const name = prompt('팔레트 이름을 입력하세요:', `팔레트 ${this.savedPalettes.length + 1}`);
        if (!name) return;
        
        const savedPalette = {
            ...this.currentPalette,
            name: name,
            savedAt: new Date().toISOString()
        };
        
        this.savedPalettes.push(savedPalette);
        this.savePalettesToStorage();
        this.renderSavedPalettes();
        
        this.showNotification(`"${name}" 팔레트가 저장되었습니다! ⭐`, 'success');
    }
    
    renderSavedPalettes() {
        const container = document.getElementById('savedPalettesList');
        
        if (this.savedPalettes.length === 0) {
            container.innerHTML = `
                <div class="empty-saved">
                    <div class="empty-icon">🎨</div>
                    <p>아직 저장된 팔레트가 없어요.<br>마음에 드는 팔레트를 저장해보세요!</p>
                </div>
            `;
            return;
        }
        
        const sortedPalettes = [...this.savedPalettes].sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt));
        
        container.innerHTML = sortedPalettes.map(palette => {
            const savedDate = new Date(palette.savedAt).toLocaleDateString('ko-KR');
            
            return `
                <div class="saved-palette-item" onclick="colorPalette.loadSavedPalette('${palette.id}')">
                    <div class="saved-palette-preview">
                        ${palette.colors.map(color => 
                            `<div style="background-color: ${color}"></div>`
                        ).join('')}
                    </div>
                    <div class="saved-palette-info">
                        <div class="saved-palette-name">${palette.name}</div>
                        <div class="saved-palette-date">${savedDate}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    loadSavedPalette(paletteId) {
        const palette = this.savedPalettes.find(p => p.id === paletteId);
        if (!palette) return;
        
        this.currentPalette = palette;
        this.displayPalette(palette.colors);
        this.showNotification(`"${palette.name}" 팔레트를 불러왔습니다! 📂`, 'success');
    }
    
    clearSavedPalettes() {
        if (this.savedPalettes.length === 0) {
            this.showNotification('삭제할 팔레트가 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 저장된 팔레트를 삭제하시겠습니까?')) {
            this.savedPalettes = [];
            this.savePalettesToStorage();
            this.renderSavedPalettes();
            this.showNotification('모든 팔레트가 삭제되었습니다', 'info');
        }
    }
    
    // 색상 도구들
    showColorConverter() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '🔄 색상 변환기';
        modalBody.innerHTML = `
            <div class="tool-content">
                <div class="converter-section">
                    <label>HEX 입력:</label>
                    <input type="text" id="converterHex" placeholder="#000000">
                </div>
                <div class="converter-section">
                    <label>RGB 출력:</label>
                    <input type="text" id="converterRgb" readonly>
                </div>
                <div class="converter-section">
                    <label>HSL 출력:</label>
                    <input type="text" id="converterHsl" readonly>
                </div>
                <div class="converter-preview" id="converterPreview" style="width: 100%; height: 60px; border-radius: 8px; margin-top: 15px; background: #000;"></div>
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
        
        // 이벤트 리스너
        document.getElementById('converterHex').addEventListener('input', (e) => {
            this.updateColorConverter(e.target.value);
        });
    }
    
    updateColorConverter(hex) {
        const validHex = this.validateHex(hex);
        if (!validHex) return;
        
        const rgb = this.hexToRgb(validHex);
        const hsl = this.hexToHsl(validHex);
        
        document.getElementById('converterRgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        document.getElementById('converterHsl').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        document.getElementById('converterPreview').style.background = validHex;
    }
    
    showContrastChecker() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '👁️ 대비 검사';
        modalBody.innerHTML = `
            <div class="tool-content">
                <div class="contrast-inputs">
                    <div>
                        <label>배경색:</label>
                        <input type="color" id="bgColor" value="#ffffff">
                    </div>
                    <div>
                        <label>텍스트색:</label>
                        <input type="color" id="textColor" value="#000000">
                    </div>
                </div>
                <div class="contrast-preview" id="contrastPreview" style="padding: 20px; border-radius: 8px; margin: 15px 0; text-align: center; font-size: 18px; color: #000; background: #fff;">
                    샘플 텍스트 Sample Text
                </div>
                <div class="contrast-result">
                    <div>대비율: <span id="contrastRatio">21:1</span></div>
                    <div>등급: <span id="contrastGrade">AAA</span></div>
                </div>
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
        
        // 이벤트 리스너
        document.getElementById('bgColor').addEventListener('input', this.updateContrastChecker.bind(this));
        document.getElementById('textColor').addEventListener('input', this.updateContrastChecker.bind(this));
    }
    
    updateContrastChecker() {
        const bgColor = document.getElementById('bgColor').value;
        const textColor = document.getElementById('textColor').value;
        const preview = document.getElementById('contrastPreview');
        
        preview.style.backgroundColor = bgColor;
        preview.style.color = textColor;
        
        const ratio = this.calculateContrastRatio(bgColor, textColor);
        document.getElementById('contrastRatio').textContent = `${ratio.toFixed(2)}:1`;
        
        let grade = 'Fail';
        if (ratio >= 7) grade = 'AAA';
        else if (ratio >= 4.5) grade = 'AA';
        else if (ratio >= 3) grade = 'AA Large';
        
        document.getElementById('contrastGrade').textContent = grade;
    }
    
    showGradientGenerator() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '🌈 그라디언트 생성기';
        modalBody.innerHTML = `
            <div class="tool-content">
                <div class="gradient-controls">
                    <div>
                        <label>시작 색상:</label>
                        <input type="color" id="gradientStart" value="#ff6b6b">
                    </div>
                    <div>
                        <label>끝 색상:</label>
                        <input type="color" id="gradientEnd" value="#4ecdc4">
                    </div>
                    <div>
                        <label>방향:</label>
                        <select id="gradientDirection">
                            <option value="to right">→ 오른쪽</option>
                            <option value="to left">← 왼쪽</option>
                            <option value="to bottom">↓ 아래</option>
                            <option value="to top">↑ 위</option>
                            <option value="45deg">↗ 대각선</option>
                        </select>
                    </div>
                </div>
                <div class="gradient-preview" id="gradientPreview" style="width: 100%; height: 100px; border-radius: 8px; margin: 15px 0;"></div>
                <div class="gradient-code">
                    <label>CSS 코드:</label>
                    <textarea id="gradientCode" readonly style="width: 100%; height: 60px; resize: none; font-family: monospace;"></textarea>
                    <button onclick="colorPalette.copyToClipboard(document.getElementById('gradientCode').value)" style="margin-top: 10px; padding: 8px 16px; background: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer;">복사</button>
                </div>
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
        
        // 이벤트 리스너
        document.getElementById('gradientStart').addEventListener('input', this.updateGradient.bind(this));
        document.getElementById('gradientEnd').addEventListener('input', this.updateGradient.bind(this));
        document.getElementById('gradientDirection').addEventListener('change', this.updateGradient.bind(this));
        
        this.updateGradient();
    }
    
    updateGradient() {
        const start = document.getElementById('gradientStart').value;
        const end = document.getElementById('gradientEnd').value;
        const direction = document.getElementById('gradientDirection').value;
        
        const gradient = `linear-gradient(${direction}, ${start}, ${end})`;
        
        document.getElementById('gradientPreview').style.background = gradient;
        document.getElementById('gradientCode').value = `background: ${gradient};`;
    }
    
    showColorHistory() {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '📜 생성 기록';
        modalBody.innerHTML = `
            <div class="tool-content">
                <div class="history-list" id="historyList">
                    ${this.colorHistory.length === 0 ? 
                        '<p>아직 생성 기록이 없습니다.</p>' :
                        this.colorHistory.slice(-10).reverse().map((palette, index) => `
                            <div class="history-item" style="margin-bottom: 15px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px;">
                                <div class="history-preview" style="display: flex; height: 20px; margin-bottom: 8px; border-radius: 4px; overflow: hidden;">
                                    ${palette.colors.map(color => `<div style="flex: 1; background: ${color};"></div>`).join('')}
                                </div>
                                <div style="font-size: 0.8rem; color: #666;">
                                    ${palette.type} • ${new Date(palette.createdAt).toLocaleString('ko-KR')}
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
                ${this.colorHistory.length > 0 ? 
                    '<button onclick="colorPalette.clearColorHistory()" style="width: 100%; padding: 10px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; margin-top: 15px;">기록 모두 삭제</button>' : 
                    ''
                }
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
    }
    
    clearColorHistory() {
        if (confirm('모든 생성 기록을 삭제하시겠습니까?')) {
            this.colorHistory = [];
            localStorage.setItem('colorHistory', JSON.stringify(this.colorHistory));
            this.closeModal();
            this.showNotification('생성 기록이 모두 삭제되었습니다', 'info');
        }
    }
    
    closeModal() {
        document.getElementById('toolModal').style.display = 'none';
    }
    
    addToHistory() {
        this.colorHistory.push(this.currentPalette);
        // 최대 50개까지만 저장
        if (this.colorHistory.length > 50) {
            this.colorHistory.shift();
        }
        localStorage.setItem('colorHistory', JSON.stringify(this.colorHistory));
    }
    
    savePalettesToStorage() {
        localStorage.setItem('savedPalettes', JSON.stringify(this.savedPalettes));
    }
    
    // 유틸리티 함수들
    validateHex(hex) {
        if (!hex.startsWith('#')) hex = '#' + hex;
        const regex = /^#([A-Fa-f0-9]{6})$/;
        return regex.test(hex) ? hex : null;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;
        
        let { r, g, b } = rgb;
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    calculateContrastRatio(color1, color2) {
        const luminance = (color) => {
            const rgb = this.hexToRgb(color);
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        
        const lum1 = luminance(color1);
        const lum2 = luminance(color2);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }
    
    getContrastColor(hexColor) {
        const rgb = this.hexToRgb(hexColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#ffffff';
    }
    
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('클립보드에 복사되었습니다! 📋', 'success');
        }).catch(() => {
            this.showNotification('복사에 실패했습니다', 'error');
        });
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.palette-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `palette-notification palette-notification-${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#9C27B0'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">
                    &times;
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.tool-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.converter-section,
.contrast-inputs > div,
.gradient-controls > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.contrast-inputs,
.gradient-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
}

.contrast-result {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 6px;
    font-weight: 500;
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.colorPalette = new ColorPalette();
});
