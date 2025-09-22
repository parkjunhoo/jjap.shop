// 📝 네이밍 생성기 JavaScript

class NameGenerator {
    constructor() {
        this.currentNames = [];
        this.favorites = JSON.parse(localStorage.getItem('favoriteNames')) || [];
        this.history = JSON.parse(localStorage.getItem('nameHistory')) || [];
        
        // 이름 구성 요소 데이터베이스
        this.nameData = {
            korean: {
                prefixes: ['새로운', '밝은', '푸른', '황금', '달콤한', '신선한', '행복한', '완벽한', '특별한', '멋진'],
                suffixes: ['랩', '샵', '하우스', '스튜디오', '팩토리', '센터', '월드', '존', '플레이스', '코리아'],
                adjectives: ['빠른', '스마트', '창의적인', '혁신적인', '전문적인', '친근한', '신뢰할 수 있는', '고품질'],
                nouns: ['기술', '디자인', '솔루션', '서비스', '플랫폼', '네트워크', '시스템', '프로젝트', '브랜드']
            },
            english: {
                prefixes: ['Smart', 'Quick', 'Pro', 'Ultra', 'Super', 'Mega', 'Prime', 'Elite', 'Max', 'Neo'],
                suffixes: ['Lab', 'Hub', 'Zone', 'Spot', 'Point', 'Base', 'Core', 'Link', 'Flow', 'Wave'],
                adjectives: ['Creative', 'Dynamic', 'Innovative', 'Bright', 'Bold', 'Swift', 'Pure', 'Fresh'],
                nouns: ['Tech', 'Design', 'Studio', 'Works', 'Solutions', 'Systems', 'Digital', 'Media', 'Labs']
            },
            tech: {
                prefixes: ['Cyber', 'Data', 'Cloud', 'Web', 'Net', 'Code', 'Bit', 'Pixel', 'Digital', 'Tech'],
                suffixes: ['Tek', 'Soft', 'Ware', 'System', 'Logic', 'Code', 'Net', 'Lab', 'Hub', 'Core'],
                words: ['Algorithm', 'Binary', 'Crypto', 'Database', 'Engine', 'Firebase', 'Gateway', 'Hash', 'Interface', 'Kernel']
            },
            creative: {
                prefixes: ['Art', 'Color', 'Dream', 'Magic', 'Wonder', 'Spark', 'Glow', 'Shine', 'Star', 'Moon'],
                suffixes: ['Studio', 'House', 'Space', 'Room', 'Gallery', 'Workshop', 'Atelier', 'Craft', 'Arts', 'Design'],
                words: ['Canvas', 'Brush', 'Palette', 'Sketch', 'Vision', 'Imagine', 'Create', 'Inspire', 'Beautiful', 'Harmony']
            }
        };

        // 업종별 특화 키워드
        this.industryKeywords = {
            startup: ['Innovation', 'Growth', 'Scale', 'Venture', 'Launch', 'Boost', 'Rise', 'Leap', 'Sprint', 'Rocket'],
            cafe: ['Bean', 'Brew', 'Roast', 'Grind', 'Steam', 'Aroma', 'Morning', 'Warm', 'Cozy', 'Corner'],
            fashion: ['Style', 'Trend', 'Chic', 'Elegant', 'Mode', 'Couture', 'Boutique', 'Wardrobe', 'Look', 'Fashion'],
            game: ['Play', 'Quest', 'Level', 'Hero', 'Battle', 'Adventure', 'Arena', 'Champion', 'Victory', 'Power'],
            beauty: ['Glow', 'Beauty', 'Radiant', 'Pure', 'Skin', 'Care', 'Cosmetic', 'Natural', 'Bright', 'Fresh'],
            food: ['Taste', 'Flavor', 'Delicious', 'Fresh', 'Kitchen', 'Recipe', 'Cook', 'Spice', 'Sweet', 'Savory']
        };

        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderFavorites();
        this.renderHistory();
        this.showNotification('네이밍 생성기가 준비되었습니다! 📝', 'success');
    }
    
    setupEventListeners() {
        // 이름 생성 버튼
        document.getElementById('generateNamesBtn').addEventListener('click', () => {
            this.generateNames();
        });
        
        // 빠른 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.loadPreset(preset);
            });
        });
        
        // 즐겨찾기 삭제
        document.getElementById('clearFavoritesBtn').addEventListener('click', () => {
            this.clearFavorites();
        });
        
        // 기록 삭제
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
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
        
        // 이름 유형 변경 시 적절한 기본값 설정
        document.getElementById('nameType').addEventListener('change', (e) => {
            this.adjustSettingsForType(e.target.value);
        });
    }
    
    adjustSettingsForType(type) {
        const styleSelect = document.getElementById('nameStyle');
        const languageSelect = document.getElementById('nameLanguage');
        
        // 유형별 추천 설정
        const recommendations = {
            brand: { style: 'professional', language: 'english' },
            product: { style: 'creative', language: 'mixed' },
            project: { style: 'modern', language: 'english' },
            nickname: { style: 'fun', language: 'korean' },
            app: { style: 'tech', language: 'english' },
            website: { style: 'modern', language: 'english' },
            youtube: { style: 'fun', language: 'korean' },
            game: { style: 'powerful', language: 'english' }
        };
        
        if (recommendations[type]) {
            styleSelect.value = recommendations[type].style;
            languageSelect.value = recommendations[type].language;
        }
    }
    
    loadPreset(preset) {
        const presetConfigs = {
            startup: { 
                type: 'brand', 
                style: 'modern', 
                language: 'english', 
                keyword: 'innovation',
                count: 10
            },
            cafe: { 
                type: 'brand', 
                style: 'cute', 
                language: 'mixed', 
                keyword: 'coffee',
                count: 10
            },
            fashion: { 
                type: 'brand', 
                style: 'creative', 
                language: 'english', 
                keyword: 'style',
                count: 10
            },
            game: { 
                type: 'game', 
                style: 'powerful', 
                language: 'english', 
                keyword: 'adventure',
                count: 15
            },
            beauty: { 
                type: 'brand', 
                style: 'cute', 
                language: 'mixed', 
                keyword: 'beauty',
                count: 10
            },
            food: { 
                type: 'brand', 
                style: 'fun', 
                language: 'korean', 
                keyword: 'delicious',
                count: 10
            }
        };
        
        const config = presetConfigs[preset];
        if (!config) return;
        
        document.getElementById('nameType').value = config.type;
        document.getElementById('nameStyle').value = config.style;
        document.getElementById('nameLanguage').value = config.language;
        document.getElementById('keywordInput').value = config.keyword;
        document.getElementById('generateCount').value = config.count;
        
        this.showNotification(`${preset} 프리셋이 적용되었습니다! 🎯`, 'success');
    }
    
    generateNames() {
        const generateBtn = document.getElementById('generateNamesBtn');
        const nameType = document.getElementById('nameType').value;
        const nameStyle = document.getElementById('nameStyle').value;
        const nameLength = document.getElementById('nameLength').value;
        const nameLanguage = document.getElementById('nameLanguage').value;
        const keyword = document.getElementById('keywordInput').value.trim();
        const count = parseInt(document.getElementById('generateCount').value);
        
        // 버튼 애니메이션
        generateBtn.classList.add('generating');
        generateBtn.querySelector('.btn-text').textContent = '생성 중...';
        
        setTimeout(() => {
            const names = this.createNames({
                type: nameType,
                style: nameStyle,
                length: nameLength,
                language: nameLanguage,
                keyword: keyword,
                count: count
            });
            
            this.currentNames = names;
            this.displayNames(names);
            this.addToHistory({ type: nameType, style: nameStyle, count: names.length });
            
            // 버튼 원상복구
            generateBtn.classList.remove('generating');
            generateBtn.querySelector('.btn-text').textContent = '이름 생성하기';
            
            // 도구 섹션 표시
            document.getElementById('nameTools').style.display = 'block';
            
            this.showNotification(`${names.length}개의 이름을 생성했습니다! ✨`, 'success');
        }, 1200);
    }
    
    createNames(options) {
        const names = new Set();
        let attempts = 0;
        const maxAttempts = options.count * 10;
        
        while (names.size < options.count && attempts < maxAttempts) {
            attempts++;
            
            let name = '';
            
            // 언어별 생성 방식
            if (options.language === 'korean') {
                name = this.generateKoreanName(options);
            } else if (options.language === 'english') {
                name = this.generateEnglishName(options);
            } else if (options.language === 'mixed') {
                name = Math.random() > 0.5 ? 
                    this.generateMixedName(options) : 
                    this.generateEnglishName(options);
            } else if (options.language === 'japanese') {
                name = this.generateJapaneseStyleName(options);
            }
            
            // 키워드 포함
            if (options.keyword && Math.random() > 0.3) {
                name = this.incorporateKeyword(name, options.keyword, options.language);
            }
            
            // 길이 조정
            name = this.adjustNameLength(name, options.length);
            
            if (name && name.length >= 2) {
                names.add(name);
            }
        }
        
        return Array.from(names).map(name => ({
            name: name,
            type: options.type,
            style: options.style,
            language: options.language,
            description: this.generateDescription(name, options),
            id: Date.now() + Math.random()
        }));
    }
    
    generateKoreanName(options) {
        const korean = this.nameData.korean;
        const styles = {
            creative: () => this.randomChoice(korean.prefixes) + this.randomChoice(korean.nouns),
            professional: () => this.randomChoice(korean.adjectives) + this.randomChoice(korean.suffixes),
            fun: () => this.randomChoice(['해피', '럭키', '스마일', '선샤인', '레인보우']) + 
                        this.randomChoice(['카페', '샵', '스튜디오', '하우스']),
            modern: () => this.randomChoice(['뉴', '넥스트', '퓨처', '모던']) + 
                          this.randomChoice(korean.nouns),
            cute: () => this.randomChoice(['꼬마', '작은', '귀여운']) + 
                        this.randomChoice(['베어', '캣', '스타', '문']),
            powerful: () => this.randomChoice(['강력한', '최고의', '킹']) + 
                            this.randomChoice(['파워', '포스', '엔진'])
        };
        
        return styles[options.style]?.() || styles.creative();
    }
    
    generateEnglishName(options) {
        const english = this.nameData.english;
        const tech = this.nameData.tech;
        const creative = this.nameData.creative;
        
        const styles = {
            creative: () => this.randomChoice(creative.prefixes) + this.randomChoice(creative.suffixes),
            professional: () => this.randomChoice(english.prefixes) + this.randomChoice(english.nouns),
            tech: () => this.randomChoice(tech.prefixes) + this.randomChoice(tech.suffixes),
            modern: () => this.randomChoice(['Neo', 'Ultra', 'Meta', 'Quantum']) + 
                          this.randomChoice(english.nouns),
            fun: () => this.randomChoice(['Happy', 'Lucky', 'Sunny', 'Bouncy']) + 
                       this.randomChoice(english.suffixes),
            powerful: () => this.randomChoice(['Power', 'Force', 'Thunder', 'Lightning']) + 
                            this.randomChoice(['X', 'Pro', 'Max', 'Ultra']),
            classic: () => this.randomChoice(['Royal', 'Grand', 'Elite', 'Premier']) + 
                           this.randomChoice(['Group', 'House', 'Company'])
        };
        
        return styles[options.style]?.() || styles.professional();
    }
    
    generateMixedName(options) {
        const koreanParts = ['스마트', '뉴', '프리미엄', '골드', '실버'];
        const englishParts = ['Lab', 'Studio', 'House', 'Works', 'Pro'];
        
        return this.randomChoice(koreanParts) + this.randomChoice(englishParts);
    }
    
    generateJapaneseStyleName(options) {
        const japanesePrefixes = ['사쿠라', '하나', '유키', '아키', '히로'];
        const japaneseSuffixes = ['야', '코', '상', '짱', '군'];
        
        return this.randomChoice(japanesePrefixes) + this.randomChoice(japaneseSuffixes);
    }
    
    incorporateKeyword(name, keyword, language) {
        if (Math.random() > 0.5) {
            return keyword + name;
        } else {
            return name + keyword;
        }
    }
    
    adjustNameLength(name, lengthType) {
        const lengths = {
            short: [3, 6],
            medium: [7, 12],
            long: [13, 20]
        };
        
        const [min, max] = lengths[lengthType];
        
        if (name.length < min) {
            // 이름이 너무 짧으면 접미사 추가
            const suffixes = ['Pro', 'Plus', 'Max', 'Lab', '플러스', '프로'];
            name += this.randomChoice(suffixes);
        } else if (name.length > max) {
            // 이름이 너무 길면 줄이기
            name = name.substring(0, max);
        }
        
        return name;
    }
    
    generateDescription(name, options) {
        const descriptions = {
            brand: [`${options.style} 스타일의 브랜드명`, '기억하기 쉬운 브랜드 이름', '독특하고 전문적인 느낌'],
            product: ['혁신적인 제품명', '사용자 친화적인 이름', '시장성이 높은 네이밍'],
            project: ['프로젝트의 특성을 담은 이름', '협업에 적합한 명칭', '목표를 반영한 네이밍'],
            nickname: ['개성 있는 닉네임', '친근하고 기억하기 쉬운 별명', '유니크한 온라인 아이덴티티'],
            app: ['직관적인 앱 이름', '사용자 경험을 고려한 네이밍', '앱스토어에서 눈에 띄는 이름'],
            website: ['도메인으로 활용 가능한 이름', 'SEO에 유리한 네이밍', '웹사이트 특성을 반영'],
            youtube: ['구독자가 기억하기 쉬운 채널명', '콘텐츠 특성을 담은 이름', '검색에 유리한 채널명'],
            game: ['플레이어들이 선호하는 게임명', '장르를 반영한 타이틀', '임팩트 있는 게임 이름']
        };
        
        return this.randomChoice(descriptions[options.type] || descriptions.brand);
    }
    
    displayNames(names) {
        const container = document.getElementById('nameResults');
        
        container.innerHTML = `
            <div class="names-grid">
                ${names.map((nameData, index) => this.createNameCard(nameData, index)).join('')}
            </div>
        `;
        
        // 이벤트 리스너 추가
        names.forEach((nameData, index) => {
            const card = container.querySelector(`[data-name-id="${nameData.id}"]`);
            
            // 즐겨찾기 버튼
            card.querySelector('.favorite-btn').addEventListener('click', () => {
                this.toggleFavorite(nameData);
            });
            
            // 복사 버튼
            card.querySelector('.copy-btn').addEventListener('click', () => {
                this.copyName(nameData.name);
            });
            
            // 공유 버튼
            card.querySelector('.share-btn').addEventListener('click', () => {
                this.shareName(nameData);
            });
        });
    }
    
    createNameCard(nameData, index) {
        const isFavorited = this.favorites.some(fav => fav.name === nameData.name);
        
        const styleNames = {
            creative: '창의적', professional: '전문적', fun: '재미있는', 
            modern: '모던', classic: '클래식', tech: '기술적', 
            cute: '귀여운', powerful: '강력한'
        };
        
        const lengthNames = {
            short: '짧음', medium: '보통', long: '긺'
        };
        
        const languageNames = {
            korean: '한국어', english: '영어', mixed: '한영혼합', japanese: '일본어'
        };
        
        return `
            <div class="name-card" data-name-id="${nameData.id}" style="animation-delay: ${index * 0.1}s">
                <div class="name-card-header">
                    <div class="name-title">${nameData.name}</div>
                    <div class="name-actions">
                        <button class="name-action-btn favorite-btn ${isFavorited ? 'favorited' : ''}" title="즐겨찾기">
                            ${isFavorited ? '⭐' : '☆'}
                        </button>
                        <button class="name-action-btn copy-btn" title="복사">📋</button>
                        <button class="name-action-btn share-btn" title="공유">🔗</button>
                    </div>
                </div>
                
                <div class="name-info">
                    <span class="name-tag style">${styleNames[nameData.style] || nameData.style}</span>
                    <span class="name-tag language">${languageNames[nameData.language] || nameData.language}</span>
                </div>
                
                <div class="name-description">${nameData.description}</div>
            </div>
        `;
    }
    
    toggleFavorite(nameData) {
        const existingIndex = this.favorites.findIndex(fav => fav.name === nameData.name);
        
        if (existingIndex !== -1) {
            this.favorites.splice(existingIndex, 1);
            this.showNotification('즐겨찾기에서 제거되었습니다', 'info');
        } else {
            this.favorites.push({
                ...nameData,
                savedAt: new Date().toISOString()
            });
            this.showNotification(`"${nameData.name}"이 즐겨찾기에 추가되었습니다! ⭐`, 'success');
        }
        
        this.saveFavorites();
        this.renderFavorites();
        this.updateCurrentNames();
    }
    
    copyName(name) {
        navigator.clipboard.writeText(name).then(() => {
            this.showNotification(`"${name}"이 복사되었습니다! 📋`, 'success');
        }).catch(() => {
            this.showNotification('복사에 실패했습니다', 'error');
        });
    }
    
    shareName(nameData) {
        const shareText = `💡 추천 이름: "${nameData.name}"

스타일: ${nameData.style}
언어: ${nameData.language}
설명: ${nameData.description}

짭샵 네이밍 생성기에서 생성했어요!`;
        
        if (navigator.share) {
            navigator.share({
                title: `추천 이름: ${nameData.name}`,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('공유 텍스트가 복사되었습니다! 📋', 'success');
            });
        }
    }
    
    updateCurrentNames() {
        // 현재 표시된 이름들의 즐겨찾기 상태 업데이트
        if (this.currentNames.length > 0) {
            this.displayNames(this.currentNames);
        }
    }
    
    // 도구 기능들
    checkDomain() {
        if (this.currentNames.length === 0) {
            this.showNotification('도메인을 확인할 이름이 없습니다!', 'error');
            return;
        }
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '🌐 도메인 가용성 확인';
        modalBody.innerHTML = `
            <div class="domain-check">
                <p>도메인 확인은 실제 도메인 등록 서비스를 통해 확인해주세요.</p>
                <div class="domain-suggestions">
                    <h4>추천 도메인:</h4>
                    ${this.currentNames.slice(0, 5).map(name => {
                        const cleanName = name.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                        return `
                            <div class="domain-item">
                                <span class="domain-name">${cleanName}.com</span>
                                <button onclick="window.open('https://www.namecheap.com/domains/registration/results/?domain=${cleanName}', '_blank')" 
                                        class="domain-check-btn">확인</button>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
    }
    
    analyzeNames() {
        if (this.currentNames.length === 0) {
            this.showNotification('분석할 이름이 없습니다!', 'error');
            return;
        }
        
        const analysis = this.performNameAnalysis();
        
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = '📊 이름 분석';
        modalBody.innerHTML = `
            <div class="name-analysis">
                <div class="analysis-section">
                    <h4>📈 통계</h4>
                    <div class="analysis-stats">
                        <div>총 이름 개수: ${analysis.totalCount}개</div>
                        <div>평균 길이: ${analysis.averageLength.toFixed(1)}자</div>
                        <div>가장 인기있는 스타일: ${analysis.popularStyle}</div>
                        <div>언어 분포: ${analysis.languageDistribution}</div>
                    </div>
                </div>
                
                <div class="analysis-section">
                    <h4>🏆 추천 이름 TOP 3</h4>
                    <div class="top-names">
                        ${analysis.topNames.map((name, index) => `
                            <div class="top-name-item">
                                <span class="rank">${index + 1}위</span>
                                <span class="name">${name.name}</span>
                                <span class="reason">${name.reason}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('toolModal').style.display = 'block';
    }
    
    performNameAnalysis() {
        const names = this.currentNames;
        const totalCount = names.length;
        const averageLength = names.reduce((sum, name) => sum + name.name.length, 0) / totalCount;
        
        // 스타일 분포 계산
        const styleCount = {};
        names.forEach(name => {
            styleCount[name.style] = (styleCount[name.style] || 0) + 1;
        });
        const popularStyle = Object.keys(styleCount).reduce((a, b) => 
            styleCount[a] > styleCount[b] ? a : b);
        
        // 언어 분포
        const languageCount = {};
        names.forEach(name => {
            languageCount[name.language] = (languageCount[name.language] || 0) + 1;
        });
        const languageDistribution = Object.keys(languageCount)
            .map(lang => `${lang}(${languageCount[lang]})`)
            .join(', ');
        
        // TOP 3 이름 선정 (길이, 발음 용이성, 기억 용이성 기준)
        const topNames = names
            .map(name => ({
                ...name,
                score: this.calculateNameScore(name)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(name => ({
                name: name.name,
                reason: this.getNameReason(name)
            }));
        
        return {
            totalCount,
            averageLength,
            popularStyle,
            languageDistribution,
            topNames
        };
    }
    
    calculateNameScore(nameData) {
        let score = 0;
        const name = nameData.name;
        
        // 길이 점수 (8-12자가 최적)
        const lengthScore = name.length >= 8 && name.length <= 12 ? 10 : 
                           Math.max(0, 10 - Math.abs(name.length - 10));
        score += lengthScore;
        
        // 발음 용이성 (자음/모음 비율)
        const consonantCount = (name.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
        const vowelCount = (name.match(/[aeiou]/gi) || []).length;
        const pronunciationScore = consonantCount > 0 && vowelCount > 0 ? 10 : 5;
        score += pronunciationScore;
        
        // 기억 용이성 (반복되는 글자 패턴)
        const uniqueChars = new Set(name.toLowerCase()).size;
        const memoryScore = uniqueChars / name.length * 10;
        score += memoryScore;
        
        return score;
    }
    
    getNameReason(nameData) {
        const reasons = [
            '기억하기 쉬운 길이',
            '발음하기 좋음',
            '독특하고 매력적',
            '브랜딩에 적합',
            '도메인 확보 가능성 높음'
        ];
        return this.randomChoice(reasons);
    }
    
    exportNames() {
        if (this.currentNames.length === 0) {
            this.showNotification('내보낼 이름이 없습니다!', 'error');
            return;
        }
        
        const data = {
            names: this.currentNames,
            generatedAt: new Date().toISOString(),
            totalCount: this.currentNames.length
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated_names_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('이름 목록이 다운로드되었습니다! 💾', 'success');
    }
    
    shareNames() {
        if (this.currentNames.length === 0) {
            this.showNotification('공유할 이름이 없습니다!', 'error');
            return;
        }
        
        const nameList = this.currentNames.slice(0, 10).map(name => name.name).join(', ');
        const shareText = `🎯 생성된 이름들:

${nameList}

총 ${this.currentNames.length}개의 이름을 생성했어요!

짭샵 네이밍 생성기로 만들었습니다.`;
        
        if (navigator.share) {
            navigator.share({
                title: '생성된 이름들',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('이름 목록이 클립보드에 복사되었습니다! 📋', 'success');
            });
        }
    }
    
    closeModal() {
        document.getElementById('toolModal').style.display = 'none';
    }
    
    // 즐겨찾기 및 기록 관리
    renderFavorites() {
        const container = document.getElementById('favoriteNamesList');
        
        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <div class="empty-icon">⭐</div>
                    <p>마음에 드는 이름을 ⭐ 버튼으로 저장해보세요!</p>
                </div>
            `;
            return;
        }
        
        const sortedFavorites = [...this.favorites].sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt));
        
        container.innerHTML = sortedFavorites.map(favorite => {
            const savedDate = new Date(favorite.savedAt).toLocaleDateString('ko-KR');
            
            return `
                <div class="favorite-item">
                    <div class="favorite-item-header">
                        <div class="favorite-item-name">${favorite.name}</div>
                        <div class="favorite-item-actions">
                            <button class="favorite-action-btn" onclick="nameGenerator.copyName('${favorite.name}')" title="복사">📋</button>
                            <button class="favorite-action-btn" onclick="nameGenerator.removeFavorite('${favorite.name}')" title="삭제">🗑️</button>
                        </div>
                    </div>
                    <div class="favorite-item-info">
                        <span>${favorite.type} • ${favorite.style}</span>
                        <span>${savedDate}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderHistory() {
        const container = document.getElementById('nameHistoryList');
        
        if (this.history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">📝</div>
                    <p>아직 생성 기록이 없습니다.<br>이름을 생성하면 기록이 저장됩니다!</p>
                </div>
            `;
            return;
        }
        
        const sortedHistory = [...this.history].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt));
        
        container.innerHTML = sortedHistory.slice(0, 10).map(item => {
            const createdDate = new Date(item.createdAt).toLocaleDateString('ko-KR');
            
            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <div class="history-item-name">${item.type} 이름 생성</div>
                        <button class="history-action-btn" onclick="nameGenerator.removeHistoryItem('${item.id}')" title="삭제">🗑️</button>
                    </div>
                    <div class="history-item-info">
                        <div class="history-item-stats">
                            <span>${item.style} 스타일</span>
                            <span>${item.count}개 생성</span>
                        </div>
                        <span>${createdDate}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    removeFavorite(name) {
        this.favorites = this.favorites.filter(fav => fav.name !== name);
        this.saveFavorites();
        this.renderFavorites();
        this.updateCurrentNames();
        this.showNotification('즐겨찾기에서 제거되었습니다', 'info');
    }
    
    removeHistoryItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
        this.renderHistory();
    }
    
    clearFavorites() {
        if (this.favorites.length === 0) {
            this.showNotification('삭제할 즐겨찾기가 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 즐겨찾기를 삭제하시겠습니까?')) {
            this.favorites = [];
            this.saveFavorites();
            this.renderFavorites();
            this.updateCurrentNames();
            this.showNotification('모든 즐겨찾기가 삭제되었습니다', 'info');
        }
    }
    
    clearHistory() {
        if (this.history.length === 0) {
            this.showNotification('삭제할 기록이 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 생성 기록을 삭제하시겠습니까?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showNotification('모든 기록이 삭제되었습니다', 'info');
        }
    }
    
    addToHistory(data) {
        this.history.push({
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
        });
        
        // 최대 50개까지만 저장
        if (this.history.length > 50) {
            this.history.shift();
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    saveFavorites() {
        localStorage.setItem('favoriteNames', JSON.stringify(this.favorites));
    }
    
    saveHistory() {
        localStorage.setItem('nameHistory', JSON.stringify(this.history));
    }
    
    // 유틸리티 함수
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.naming-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `naming-notification naming-notification-${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#FF9800'
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

.domain-check {
    text-align: center;
}

.domain-suggestions {
    margin-top: 20px;
    text-align: left;
}

.domain-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
}

.domain-name {
    font-family: monospace;
    font-weight: 600;
}

.domain-check-btn {
    background: #FF9800;
    color: white;
    border: none;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
}

.name-analysis {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.analysis-section h4 {
    color: #FF9800;
    margin-bottom: 10px;
}

.analysis-stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
}

.top-names {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.top-name-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 8px;
}

.rank {
    background: #FF9800;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    min-width: 35px;
    text-align: center;
}

.top-name-item .name {
    font-weight: 600;
    flex: 1;
}

.reason {
    color: #666;
    font-size: 0.8rem;
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.nameGenerator = new NameGenerator();
});
