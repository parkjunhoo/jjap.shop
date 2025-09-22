// 이름 궁합 테스트 JavaScript
class NameCompatibilityTest {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const testBtn = document.getElementById('testCompatibilityBtn');
        const retestBtn = document.getElementById('retestBtn');
        const saveImageBtn = document.getElementById('saveImageBtn');
        const shareUrlBtn = document.getElementById('shareUrlBtn');

        testBtn.addEventListener('click', () => this.performCompatibilityTest());
        retestBtn.addEventListener('click', () => this.resetTest());
        saveImageBtn.addEventListener('click', () => this.saveAsImage());
        shareUrlBtn.addEventListener('click', () => this.shareUrl());

        // 엔터 키로도 테스트 가능하게
        const name1Input = document.getElementById('name1');
        const name2Input = document.getElementById('name2');
        
        [name1Input, name2Input].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performCompatibilityTest();
                }
            });
        });

        // 페이지 로드시 URL 파라미터 확인
        this.checkUrlParams();
    }

    performCompatibilityTest() {
        const name1 = document.getElementById('name1').value.trim();
        const name2 = document.getElementById('name2').value.trim();

        if (!name1 || !name2) {
            alert('두 이름을 모두 입력해주세요! 💕');
            return;
        }

        if (name1 === name2) {
            this.showSpecialResult('똑같은 이름이네요! 🤔', 0, '재미없어요...', '같은 이름', '다른 이름 써보세요');
            return;
        }

        // 궁합 점수 계산
        const compatibility = this.calculateCompatibility(name1, name2);
        this.displayResult(name1, name2, compatibility);
    }

    calculateCompatibility(name1, name2) {
        // 🔄 이름 순서 정규화 (항상 같은 결과가 나오도록)
        const sortedNames = [name1, name2].sort();
        const normalizedName1 = sortedNames[0];
        const normalizedName2 = sortedNames[1];
        
        // 🎯 개선된 궁합 알고리즘 (낮은 %도 잘 나오도록)
        let score = 0;
        
        // 1. 기본 호환성 점수 (-5000 ~ +5000 범위)
        const baseCompatibility = this.calculateBaseCompatibility(normalizedName1, normalizedName2);
        score += baseCompatibility;
        
        // 2. 이름 길이 호환성 (-2000 ~ +2000 범위)
        const lengthCompatibility = this.calculateLengthCompatibility(normalizedName1, normalizedName2);
        score += lengthCompatibility;
        
        // 3. 음성학적 호환성 (-1500 ~ +1500 범위)
        const phoneticCompatibility = this.calculatePhoneticCompatibility(normalizedName1, normalizedName2);
        score += phoneticCompatibility;
        
        // 4. 특별한 조합 보너스/패널티 (-3000 ~ +3000 범위)
        const specialBonus = this.getSpecialCombinationBonus(normalizedName1, normalizedName2);
        score += specialBonus;
        
        // 5. 시드 기반 변동성 (-2500 ~ +2500 범위)
        const seed = this.getNameSeed(normalizedName1, normalizedName2);
        const randomVariation = Math.sin(seed) * 2500;
        score += randomVariation;
        
        // 6. -10000% ~ +10000% 범위로 조정
        score = Math.max(-10000, Math.min(10000, Math.floor(score)));
        
        return score;
    }

    calculateBaseCompatibility(name1, name2) {
        let compatibility = 0;
        const maxLength = Math.max(name1.length, name2.length);
        
        // 문자별 호환성 분석
        for (let i = 0; i < maxLength; i++) {
            const char1 = name1[i] || '';
            const char2 = name2[i] || '';
            
            if (char1 && char2) {
                const unicode1 = char1.charCodeAt(0);
                const unicode2 = char2.charCodeAt(0);
                const unicodeDiff = Math.abs(unicode1 - unicode2);
                
                // 유니코드 차이에 따른 점수 (더 넓은 범위)
                if (unicodeDiff < 50) {
                    compatibility += 800; // 매우 호환
                } else if (unicodeDiff < 100) {
                    compatibility += 400; // 호환
                } else if (unicodeDiff < 200) {
                    compatibility += 0; // 중립
                } else if (unicodeDiff < 500) {
                    compatibility -= 300; // 비호환
                } else {
                    compatibility -= 600; // 매우 비호환
                }
            } else {
                compatibility -= 200; // 길이가 다르면 페널티
            }
        }
        
        return Math.max(-5000, Math.min(5000, compatibility));
    }

    calculateLengthCompatibility(name1, name2) {
        const lengthDiff = Math.abs(name1.length - name2.length);
        
        if (lengthDiff === 0) return 2000; // 같은 길이면 매우 좋음
        else if (lengthDiff === 1) return 500; // 1글자 차이면 좋음
        else if (lengthDiff === 2) return -500; // 2글자 차이면 안좋음
        else return -2000; // 3글자 이상 차이면 매우 안좋음
    }

    calculatePhoneticCompatibility(name1, name2) {
        // 한글 음성학적 호환성
        let phoneticScore = 0;
        
        const consonantScore = this.analyzeKoreanCompatibility(name1, name2);
        phoneticScore += consonantScore;
        
        // 첫 글자와 마지막 글자 호환성
        const firstCharCompat = this.compareChars(name1[0], name2[0]);
        const lastCharCompat = this.compareChars(name1[name1.length-1], name2[name2.length-1]);
        
        phoneticScore += firstCharCompat * 200;
        phoneticScore += lastCharCompat * 150;
        
        return Math.max(-1500, Math.min(1500, phoneticScore));
    }

    compareChars(char1, char2) {
        if (!char1 || !char2) return -2;
        
        const code1 = char1.charCodeAt(0);
        const code2 = char2.charCodeAt(0);
        
        // 한글인 경우 초성 비교
        if (code1 >= 0xAC00 && code1 <= 0xD7A3 && code2 >= 0xAC00 && code2 <= 0xD7A3) {
            const initial1 = Math.floor((code1 - 0xAC00) / 588);
            const initial2 = Math.floor((code2 - 0xAC00) / 588);
            
            if (initial1 === initial2) return 3; // 같은 초성
            else if (Math.abs(initial1 - initial2) <= 2) return 1; // 비슷한 초성
            else return -1; // 다른 초성
        }
        
        // 일반 문자 비교
        const diff = Math.abs(code1 - code2);
        if (diff === 0) return 3;
        else if (diff < 10) return 1;
        else return -1;
    }

    analyzeKoreanCompatibility(name1, name2) {
        let score = 0;
        const allChars = name1 + name2;
        
        // 자음 호환성 분석
        const consonantMap = {};
        const vowelMap = {};
        
        for (let char of allChars) {
            const code = char.charCodeAt(0);
            if (code >= 0xAC00 && code <= 0xD7A3) { // 한글 완성형
                const base = code - 0xAC00;
                const initial = Math.floor(base / 588); // 초성
                const medial = Math.floor((base % 588) / 28); // 중성
                
                consonantMap[initial] = (consonantMap[initial] || 0) + 1;
                vowelMap[medial] = (vowelMap[medial] || 0) + 1;
            }
        }
        
        // 자음/모음 다양성에 따른 점수 조정
        const consonantVariety = Object.keys(consonantMap).length;
        const vowelVariety = Object.keys(vowelMap).length;
        
        if (consonantVariety > 4) score -= 300; // 너무 복잡하면 안좋음
        else if (consonantVariety < 2) score -= 200; // 너무 단조로워도 안좋음
        else score += 100; // 적당하면 좋음
        
        if (vowelVariety > 3) score -= 200;
        else if (vowelVariety < 2) score -= 150;
        else score += 50;
        
        // 특정 조합에 대한 보너스/패널티 (더 균형적으로)
        const harmonicConsonants = [0, 6, 9, 11]; // ㄱ,ㅁ,ㅅ,ㅇ
        const dissonantConsonants = [1, 7, 15, 16]; // ㄴ,ㅂ,ㅋ,ㅌ
        
        for (let consonant of Object.keys(consonantMap)) {
            const consonantNum = parseInt(consonant);
            if (harmonicConsonants.includes(consonantNum)) {
                score += consonantMap[consonant] * 50;
            } else if (dissonantConsonants.includes(consonantNum)) {
                score -= consonantMap[consonant] * 30;
            }
        }
        
        return score;
    }

    getSpecialCombinationBonus(name1, name2) {
        let bonus = 0;
        const combined = name1 + name2;
        
        // 좋은 조합 패턴 (적당한 보너스)
        const luckyPatterns = ['사랑', '행복', '운명', '천국', '달콤', '예쁜', '멋진', '좋은', '희망', '평화'];
        const badPatterns = ['이별', '슬픔', '미움', '지옥', '쓴맛', '나쁜', '싫은', '고통', '절망', '전쟁'];
        
        // 패턴 매칭 (더 균형적인 점수)
        luckyPatterns.forEach(pattern => {
            if (combined.includes(pattern)) bonus += 1500;
        });
        
        badPatterns.forEach(pattern => {
            if (combined.includes(pattern)) bonus -= 1800;
        });
        
        // 공통 글자 분석 (과도한 보너스 방지)
        let commonChars = 0;
        const name1Chars = new Set(name1);
        for (let char of name2) {
            if (name1Chars.has(char)) commonChars++;
        }
        
        if (commonChars === 0) {
            bonus -= 800; // 공통점이 없으면 페널티
        } else if (commonChars === 1) {
            bonus += 300; // 적당한 공통점
        } else if (commonChars === 2) {
            bonus += 600; // 좋은 공통점
        } else {
            bonus -= 400; // 너무 많은 공통점은 오히려 안좋음
        }
        
        // 이름 조합의 음향적 특성
        const soundHarmony = this.analyzeSoundHarmony(name1, name2);
        bonus += soundHarmony;
        
        return Math.max(-3000, Math.min(3000, bonus));
    }

    analyzeSoundHarmony(name1, name2) {
        let harmony = 0;
        
        // 끝음과 시작음의 조화
        const name1Last = name1[name1.length - 1];
        const name2First = name2[0];
        
        if (name1Last && name2First) {
            const lastCode = name1Last.charCodeAt(0);
            const firstCode = name2First.charCodeAt(0);
            
            // 한글인 경우 받침과 초성의 조화
            if (lastCode >= 0xAC00 && lastCode <= 0xD7A3 && firstCode >= 0xAC00 && firstCode <= 0xD7A3) {
                const lastFinal = (lastCode - 0xAC00) % 28; // 받침
                const firstInitial = Math.floor((firstCode - 0xAC00) / 588); // 초성
                
                // 받침이 없고 초성이 부드러우면 좋음
                if (lastFinal === 0 && [0, 3, 6, 9].includes(firstInitial)) {
                    harmony += 400;
                }
                // 받침이 있고 초성이 강하면 안좋음
                else if (lastFinal !== 0 && [1, 7, 16, 17].includes(firstInitial)) {
                    harmony -= 300;
                }
            }
        }
        
        return harmony;
    }

    getNameSeed(name1, name2) {
        // 🔄 순서에 관계없이 동일한 시드 생성
        const sortedNames = [name1, name2].sort();
        const combinedName = sortedNames.join('');
        
        let seed = 0;
        for (let i = 0; i < combinedName.length; i++) {
            seed += combinedName.charCodeAt(i) * (i + 1);
        }
        
        // 시드 값을 더 다양하게 분산
        seed = seed * 7919; // 큰 소수로 곱해서 분산
        return seed;
    }

    displayResult(name1, name2, compatibility) {
        const resultSection = document.getElementById('compatibilityResult');
        const resultTitle = document.getElementById('resultTitle');
        const percentageDisplay = document.getElementById('compatibilityPercentage');
        const emotionEffects = document.getElementById('emotionEffects');
        const compatibilityMessage = document.getElementById('compatibilityMessage');
        const detailScore = document.getElementById('detailScore');
        const detailGrade = document.getElementById('detailGrade');
        const detailRecommendation = document.getElementById('detailRecommendation');

        // 결과 제목
        resultTitle.textContent = `${name1} ❤️ ${name2}`;

        // 퍼센트 표시 및 색상
        percentageDisplay.textContent = `${compatibility > 0 ? '+' : ''}${compatibility}%`;
        this.setPercentageColor(percentageDisplay, compatibility);

        // 이모티콘 효과
        emotionEffects.innerHTML = this.getEmotionEffects(compatibility);

        // 궁합 메시지
        compatibilityMessage.innerHTML = this.getCompatibilityMessage(name1, name2, compatibility);

        // 세부 정보
        detailScore.textContent = `${compatibility > 0 ? '+' : ''}${compatibility}%`;
        detailGrade.textContent = this.getCompatibilityGrade(compatibility);
        detailRecommendation.textContent = this.getRecommendation(compatibility);

        // 결과 섹션 표시
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    showSpecialResult(title, score, message, grade, recommendation) {
        const resultSection = document.getElementById('compatibilityResult');
        const resultTitle = document.getElementById('resultTitle');
        const percentageDisplay = document.getElementById('compatibilityPercentage');
        const emotionEffects = document.getElementById('emotionEffects');
        const compatibilityMessage = document.getElementById('compatibilityMessage');
        const detailScore = document.getElementById('detailScore');
        const detailGrade = document.getElementById('detailGrade');
        const detailRecommendation = document.getElementById('detailRecommendation');

        resultTitle.textContent = title;
        percentageDisplay.textContent = `${score}%`;
        percentageDisplay.style.color = '#6c757d';
        emotionEffects.innerHTML = '😴😴😴';
        compatibilityMessage.innerHTML = message;
        detailScore.textContent = `${score}%`;
        detailGrade.textContent = grade;
        detailRecommendation.textContent = recommendation;

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    setPercentageColor(element, compatibility) {
        if (compatibility >= 7000) {
            element.style.color = '#FF1493'; // 핫핑크
        } else if (compatibility >= 3000) {
            element.style.color = '#FF6B9D'; // 분홍
        } else if (compatibility >= 0) {
            element.style.color = '#FFA500'; // 주황
        } else if (compatibility >= -3000) {
            element.style.color = '#808080'; // 회색
        } else {
            element.style.color = '#8B0000'; // 어두운 빨강
        }
    }

    getEmotionEffects(compatibility) {
        if (compatibility >= 8000) {
            return '💖💖💖💖💖<br>💕💕💕💕💕<br>✨✨✨✨✨';
        } else if (compatibility >= 5000) {
            return '💖💖💖💖<br>💕💕💕💕<br>✨✨✨✨';
        } else if (compatibility >= 2000) {
            return '💖💖💖<br>💕💕💕<br>✨✨✨';
        } else if (compatibility >= 0) {
            return '💖💖<br>💕💕<br>😊😊';
        } else if (compatibility >= -2000) {
            return '😐😐<br>💔💔';
        } else if (compatibility >= -5000) {
            return '😔😔😔<br>💔💔💔<br>☁️☁️☁️';
        } else {
            return '💀💀💀💀💀<br>☠️☠️☠️☠️☠️<br>🖤🖤🖤🖤🖤';
        }
    }

    getCompatibilityMessage(name1, name2, compatibility) {
        const messages = {
            perfect: [
                `🌟 <strong>완벽한 궁합!</strong> ${name1}님과 ${name2}님은 천생연분이에요! 운명이 둘을 만나게 한 것 같아요.`,
                `✨ <strong>최고의 조합!</strong> 이보다 더 완벽한 궁합은 없을 거예요! ${name1}님과 ${name2}님의 사랑은 영원할 거예요.`,
                `🎆 <strong>환상의 궁합!</strong> ${name1}님과 ${name2}님은 서로를 완성시키는 완벽한 파트너예요!`
            ],
            excellent: [
                `💖 <strong>훌륭한 궁합!</strong> ${name1}님과 ${name2}님은 서로에게 딱 맞는 사람이에요! 많은 행복이 기다리고 있어요.`,
                `🌹 <strong>멋진 조합!</strong> 둘 사이의 케미가 정말 좋아요! 함께하면 더욱 빛날 수 있을 거예요.`,
                `💝 <strong>아름다운 인연!</strong> ${name1}님과 ${name2}님은 서로를 행복하게 만들어줄 수 있는 사람들이에요.`
            ],
            good: [
                `😊 <strong>좋은 궁합!</strong> ${name1}님과 ${name2}님은 서로에게 긍정적인 영향을 줄 수 있어요!`,
                `🌸 <strong>괜찮은 조합!</strong> 조금의 노력만 더한다면 훌륭한 관계가 될 수 있어요.`,
                `💫 <strong>발전 가능성이 높은 궁합!</strong> 시간이 지날수록 더욱 좋아질 수 있는 관계예요.`
            ],
            neutral: [
                `😐 <strong>평범한 궁합</strong> ${name1}님과 ${name2}님은 보통 수준의 궁합이에요. 서로의 노력이 필요해요.`,
                `🤷‍♀️ <strong>무난한 조합</strong> 특별히 좋지도 나쁘지도 않은 관계예요. 서로를 더 알아가보세요.`,
                `💭 <strong>애매한 궁합</strong> 좀 더 시간을 두고 서로를 알아보는 것이 좋겠어요.`
            ],
            poor: [
                `😔 <strong>아쉬운 궁합</strong> ${name1}님과 ${name2}님은 서로 다른 점이 많아요. 이해와 배려가 필요해요.`,
                `💔 <strong>어려운 조합</strong> 많은 노력과 인내가 필요한 관계일 것 같아요.`,
                `☁️ <strong>도전이 필요한 궁합</strong> 서로의 차이점을 받아들이는 마음이 중요해요.`
            ],
            terrible: [
                `💀 <strong>최악의 궁합...</strong> ${name1}님과 ${name2}님은 정말 안 맞는 조합이에요... 다른 사람을 찾아보는 게 좋을 것 같아요.`,
                `☠️ <strong>재앙 수준의 궁합</strong> 이 조합은... 권하지 않겠어요. 서로에게 상처만 줄 수 있어요.`,
                `🖤 <strong>끔찍한 조합</strong> ${name1}님과 ${name2}님이 만나면 둘 다 불행해질 수 있어요...`
            ]
        };

        let messageArray;
        if (compatibility >= 7000) messageArray = messages.perfect;
        else if (compatibility >= 3000) messageArray = messages.excellent;
        else if (compatibility >= 1000) messageArray = messages.good;
        else if (compatibility >= -1000) messageArray = messages.neutral;
        else if (compatibility >= -5000) messageArray = messages.poor;
        else messageArray = messages.terrible;

        const randomIndex = Math.floor(Math.random() * messageArray.length);
        return messageArray[randomIndex];
    }

    getCompatibilityGrade(compatibility) {
        if (compatibility >= 8000) return 'SSS급 ✨';
        else if (compatibility >= 6000) return 'SS급 💖';
        else if (compatibility >= 4000) return 'S급 💕';
        else if (compatibility >= 2000) return 'A급 😊';
        else if (compatibility >= 0) return 'B급 😐';
        else if (compatibility >= -2000) return 'C급 😔';
        else if (compatibility >= -5000) return 'D급 💔';
        else return 'F급 💀';
    }

    getRecommendation(compatibility) {
        if (compatibility >= 7000) return '적극 추천! 💖';
        else if (compatibility >= 3000) return '추천해요! 😊';
        else if (compatibility >= 0) return '나쁘지 않아요 🤔';
        else if (compatibility >= -3000) return '고민해보세요 😕';
        else return '권하지 않아요 💀';
    }

    resetTest() {
        document.getElementById('name1').value = '';
        document.getElementById('name2').value = '';
        document.getElementById('compatibilityResult').style.display = 'none';
        
        // URL에서 파라미터 제거
        const url = new URL(window.location);
        url.searchParams.delete('name1');
        url.searchParams.delete('name2');
        window.history.replaceState({}, '', url);
        
        document.getElementById('name1').focus();
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const name1 = urlParams.get('name1');
        const name2 = urlParams.get('name2');
        
        if (name1 && name2) {
            // URL 파라미터에서 받은 이름들을 입력 필드에 설정
            document.getElementById('name1').value = decodeURIComponent(name1);
            document.getElementById('name2').value = decodeURIComponent(name2);
            
            // 자동으로 테스트 수행
            setTimeout(() => {
                this.performCompatibilityTest();
            }, 500);
        }
    }

    async saveAsImage() {
        const resultSection = document.getElementById('compatibilityResult');
        
        if (resultSection.style.display === 'none') {
            alert('먼저 궁합 테스트를 진행해주세요! 💕');
            return;
        }

        try {
            // html2canvas 옵션 설정
            const canvas = await html2canvas(resultSection, {
                backgroundColor: '#ffffff',
                scale: 2, // 고해상도
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                width: resultSection.scrollWidth,
                height: resultSection.scrollHeight
            });

            // 캔버스를 이미지로 변환
            const imgData = canvas.toDataURL('image/png');
            
            // 다운로드 링크 생성
            const downloadLink = document.createElement('a');
            const name1 = document.getElementById('name1').value;
            const name2 = document.getElementById('name2').value;
            const fileName = `${name1}_${name2}_궁합테스트.png`;
            
            downloadLink.href = imgData;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            // 다운로드 실행
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // 성공 메시지
            Swal.fire({
                title: '이미지 저장 완료! 📷',
                text: `${fileName} 파일로 저장되었습니다!`,
                icon: 'success',
                confirmButtonColor: '#FF6B9D'
            });
            
        } catch (error) {
            console.error('이미지 저장 중 오류:', error);
            Swal.fire({
                title: '저장 실패 😢',
                text: '이미지 저장 중 오류가 발생했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmButtonColor: '#FF6B9D'
            });
        }
    }

    shareUrl() {
        const name1 = document.getElementById('name1').value.trim();
        const name2 = document.getElementById('name2').value.trim();
        
        if (!name1 || !name2) {
            alert('먼저 두 이름을 입력하고 테스트를 진행해주세요! 💕');
            return;
        }

        // 현재 URL에 파라미터 추가
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('name1', encodeURIComponent(name1));
        currentUrl.searchParams.set('name2', encodeURIComponent(name2));
        
        const shareUrl = currentUrl.toString();
        
        // 클립보드에 복사
        navigator.clipboard.writeText(shareUrl).then(() => {
            Swal.fire({
                title: '링크 복사 완료! 🔗',
                html: `
                    <p><strong>${name1}</strong> ❤️ <strong>${name2}</strong></p>
                    <p>궁합 테스트 링크가 클립보드에 복사되었습니다!</p>
                    <p style="font-size: 0.9em; color: #666;">링크를 공유하면 같은 결과를 볼 수 있어요.</p>
                `,
                icon: 'success',
                confirmButtonColor: '#FF6B9D'
            });
            
            // URL을 히스토리에 추가 (새로고침 없이)
            window.history.pushState({}, '', shareUrl);
            
        }).catch(() => {
            // 클립보드 복사 실패시 수동으로 선택할 수 있게
            Swal.fire({
                title: '링크 공유 📱',
                html: `
                    <p><strong>${name1}</strong> ❤️ <strong>${name2}</strong></p>
                    <p>아래 링크를 복사해서 공유해주세요:</p>
                    <input type="text" value="${shareUrl}" style="width: 100%; padding: 8px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px;" readonly onclick="this.select()">
                `,
                icon: 'info',
                confirmButtonColor: '#FF6B9D'
            });
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NameCompatibilityTest();
});
