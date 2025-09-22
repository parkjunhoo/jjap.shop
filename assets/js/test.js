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

        testBtn.addEventListener('click', () => this.performCompatibilityTest());
        retestBtn.addEventListener('click', () => this.resetTest());

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
        // 🎯 이름 기반 궁합 알고리즘
        let score = 0;
        
        // 1. 이름 길이 기반 점수
        const lengthDiff = Math.abs(name1.length - name2.length);
        score += (5 - lengthDiff) * 1000; // 길이가 비슷할수록 좋음
        
        // 2. 문자 호환성 점수
        for (let i = 0; i < Math.max(name1.length, name2.length); i++) {
            const char1 = name1[i] || '';
            const char2 = name2[i] || '';
            
            if (char1 && char2) {
                // 유니코드 값 기반 계산
                const unicode1 = char1.charCodeAt(0);
                const unicode2 = char2.charCodeAt(0);
                const unicodeDiff = Math.abs(unicode1 - unicode2);
                
                // 유니코드 차이가 적을수록 궁합이 좋음
                score += Math.max(0, 500 - unicodeDiff);
            }
        }
        
        // 3. 자음/모음 분석 (한글 기준)
        const consonantCompatibility = this.analyzeKoreanCompatibility(name1, name2);
        score += consonantCompatibility;
        
        // 4. 특별한 조합 보너스/패널티
        score += this.getSpecialCombinationBonus(name1, name2);
        
        // 5. 랜덤 요소 추가 (이름 조합마다 일정한 시드)
        const seed = this.getNameSeed(name1, name2);
        score += Math.sin(seed) * 2000;
        
        // 6. -10000% ~ +10000% 범위로 조정
        score = Math.max(-10000, Math.min(10000, Math.floor(score)));
        
        return score;
    }

    analyzeKoreanCompatibility(name1, name2) {
        let bonus = 0;
        
        // 한글 자음/모음 분석
        for (let char of name1 + name2) {
            const code = char.charCodeAt(0);
            if (code >= 0xAC00 && code <= 0xD7A3) { // 한글 완성형
                const base = code - 0xAC00;
                const initial = Math.floor(base / 588); // 초성
                const medial = Math.floor((base % 588) / 28); // 중성
                const final = base % 28; // 종성
                
                // 특정 초성/중성 조합에 보너스
                if ([0, 1, 3, 6, 7, 9].includes(initial)) bonus += 200; // ㄱ,ㄴ,ㄷ,ㅁ,ㅂ,ㅅ
                if ([0, 8, 20].includes(medial)) bonus += 150; // ㅏ,ㅓ,ㅣ
            }
        }
        
        return bonus;
    }

    getSpecialCombinationBonus(name1, name2) {
        let bonus = 0;
        const combined = name1 + name2;
        
        // 특별한 조합들
        const luckyPatterns = ['사랑', '행복', '운명', '천국', '달콤', '예쁜', '멋진', '좋은'];
        const unluckyPatterns = ['이별', '슬픔', '미움', '지옥', '쓴맛', '나쁜', '싫은'];
        
        luckyPatterns.forEach(pattern => {
            if (combined.includes(pattern)) bonus += 2000;
        });
        
        unluckyPatterns.forEach(pattern => {
            if (combined.includes(pattern)) bonus -= 2000;
        });
        
        // 이름에 같은 글자가 있으면 보너스
        for (let char of name1) {
            if (name2.includes(char)) bonus += 500;
        }
        
        return bonus;
    }

    getNameSeed(name1, name2) {
        let seed = 0;
        for (let i = 0; i < name1.length; i++) {
            seed += name1.charCodeAt(i) * (i + 1);
        }
        for (let i = 0; i < name2.length; i++) {
            seed += name2.charCodeAt(i) * (i + 1) * 2;
        }
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
        document.getElementById('name1').focus();
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new NameCompatibilityTest();
});
