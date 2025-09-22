// 🎲 랜덤 조언 생성기 JavaScript

class RandomAdviceGenerator {
    constructor() {
        // 100가지 조언 데이터
        this.advices = [
            { text: "성공은 준비된 자에게만 기회를 준다.", source: "루이 파스퇴르" },
            { text: "실패는 성공의 어머니다.", source: "토마스 에디슨" },
            { text: "꿈을 포기하지 마라. 꿈이 없으면 희망이 없고, 희망이 없으면 인생이 없다.", source: "헨리 데이비드 소로" },
            { text: "변화는 생명이고, 완벽한 안전은 죽음이다.", source: "허버트 조지 웰스" },
            { text: "당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신이 옳다.", source: "헨리 포드" },
            { text: "인생의 목적은 행복이 아니라 성장이다.", source: "프리드리히 니체" },
            { text: "오늘을 붙잡아라. 가능한 한 내일에 의존하지 마라.", source: "호라티우스" },
            { text: "강한 사람이 되려고 하지 말고, 현명한 사람이 되어라.", source: "공자" },
            { text: "문제는 방향을 바꿀 기회일 뿐이다.", source: "존 C. 맥스웰" },
            { text: "행동은 모든 성공의 기초다.", source: "파블로 피카소" },
            
            { text: "불가능한 일이란 존재하지 않는다. 단지 더 오랜 시간이 필요할 뿐이다.", source: "나폴레옹" },
            { text: "지식에 투자하는 것이 최고의 이익을 가져다준다.", source: "벤저민 프랭클린" },
            { text: "행복은 습관이다. 그것을 몸에 지녀라.", source: "허런 그린" },
            { text: "시작이 반이다.", source: "아리스토텔레스" },
            { text: "자신을 믿는 것이 성공의 첫 번째 비결이다.", source: "랄프 월도 에머슨" },
            { text: "과거에서 배우고, 현재를 살며, 미래에 희망을 가져라.", source: "아인슈타인" },
            { text: "용기란 두려움에도 불구하고 행동하는 것이다.", source: "마크 트웨인" },
            { text: "긍정적으로 생각하면 긍정적인 일이 일어난다.", source: "노먼 빈센트 필" },
            { text: "실수를 두려워하지 마라. 실수야말로 성공으로 가는 계단이다.", source: "찰스 케터링" },
            { text: "인내는 쓰나, 그 열매는 달다.", source: "아리스토텔레스" },
            
            { text: "하루에 조금씩이라도 발전하라. 작은 진보가 큰 변화를 만든다.", source: "데일 카네기" },
            { text: "꿈을 이루는 방법은 깨어있는 것이다.", source: "존 레논" },
            { text: "성공하려면 실패를 경험해야 한다.", source: "윌리엄 셰익스피어" },
            { text: "어제보다 나은 오늘을 만들어라.", source: "일본 속담" },
            { text: "모든 성취의 시작점은 욕망이다.", source: "나폴레온 힐" },
            { text: "다른 사람과 비교하지 말고, 어제의 자신과 비교하라.", source: "조던 피터슨" },
            { text: "좋은 습관은 인생을 만들고, 나쁜 습관은 인생을 망친다.", source: "제임스 클리어" },
            { text: "집중하라. 집중이야말로 천재성의 비밀이다.", source: "찰스 디킨스" },
            { text: "시간은 가장 소중한 자원이다. 낭비하지 마라.", source: "피터 드러커" },
            { text: "완벽을 추구하지 말고, 꾸준함을 추구하라.", source: "벤저민 프랭클린" },
            
            { text: "마음이 바뀌면 태도가 바뀌고, 태도가 바뀌면 인생이 바뀐다.", source: "윌리엄 제임스" },
            { text: "기회는 준비된 자에게만 온다.", source: "알렉산더 그레이엄 벨" },
            { text: "자신만의 길을 걸어라. 다른 사람들이 따라올 것이다.", source: "랄프 월도 에머슨" },
            { text: "큰 일을 하려면 작은 일부터 시작하라.", source: "마틴 루터 킹" },
            { text: "실패는 성공으로 가는 연습이다.", source: "마이클 조던" },
            { text: "배움에는 끝이 없다. 평생 학습하라.", source: "소크라테스" },
            { text: "감사하는 마음이 행복을 부른다.", source: "오프라 윈프리" },
            { text: "목표가 없으면 인생은 방향을 잃는다.", source: "지그 지글러" },
            { text: "열정 없이는 위대함을 이룰 수 없다.", source: "게오르크 빌헬름 프리드리히 헤겔" },
            { text: "자신의 한계를 뛰어넘어라. 그곳에 진짜 삶이 있다.", source: "로빈 샤르마" },
            
            { text: "성공은 99%의 노력과 1%의 영감이다.", source: "토마스 에디슨" },
            { text: "단순함이야말로 궁극의 세련됨이다.", source: "레오나르도 다 빈치" },
            { text: "건강한 몸에 건강한 정신이 깃든다.", source: "유베날리스" },
            { text: "창의성은 실수를 하는 것이고, 예술은 어떤 실수를 남길 것인지 아는 것이다.", source: "스콧 아담스" },
            { text: "가장 암울한 시간은 새벽 직전이다.", source: "토마스 풀러" },
            { text: "당신이 생각하는 것보다 더 강하고, 더 똑똑하고, 더 용감하다.", source: "A.A. 밀른" },
            { text: "인생은 10%의 일어나는 일과 90%의 반응하는 방식으로 이루어진다.", source: "찰스 스윈돌" },
            { text: "도전 없이는 변화도 없다.", source: "더글러스 맥아더" },
            { text: "최고의 시간은 지금이다.", source: "중국 속담" },
            { text: "끈기는 모든 재능을 능가한다.", source: "앤젤라 더크워스" },
            
            { text: "자신을 사랑하라. 그러면 세상도 당신을 사랑할 것이다.", source: "루미" },
            { text: "웃음은 최고의 치료제다.", source: "찰리 채플린" },
            { text: "꿈이 있다면 그것을 지켜라.", source: "크리스 가드너" },
            { text: "매일 새로운 것을 배우려 노력하라.", source: "알베르트 아인슈타인" },
            { text: "친절함은 약자가 강자에게 줄 수 있는 가장 강력한 무기다.", source: "마크 트웨인" },
            { text: "인생의 의미는 목적을 찾는 것이다.", source: "빅터 프랭클" },
            { text: "운은 노력하는 자에게 온다.", source: "세네카" },
            { text: "실패를 두려워하는 자는 성공할 자격이 없다.", source: "찰스 바클리" },
            { text: "지혜는 경험에서 나온다.", source: "소포클레스" },
            { text: "꾸준함이 재능을 이긴다.", source: "케빈 듀란트" },
            
            { text: "자신의 가치를 남에게서 찾지 마라.", source: "오스카 와일드" },
            { text: "모든 전문가는 한때 초보자였다.", source: "헬렌 헤이즈" },
            { text: "변명은 성공을 방해한다.", source: "로버트 키요사키" },
            { text: "현재 순간이 인생의 전부다.", source: "에크하르트 톨레" },
            { text: "두려움은 마음의 산물이다. 위험은 현실의 산물이다.", source: "프랭클린 루즈벨트" },
            { text: "성공의 열쇠는 다른 사람들의 의견에 휘둘리지 않는 것이다.", source: "스티브 잡스" },
            { text: "고난은 강함을 만들고, 강함은 지도력을 만든다.", source: "존 맥스웰" },
            { text: "매 순간을 선물처럼 받아들여라.", source: "앤 프랭크" },
            { text: "진정한 실패는 시도조차 하지 않는 것이다.", source: "조지 클루니" },
            { text: "성장하려면 편안한 영역을 벗어나야 한다.", source: "로빈 샤르마" },
            
            { text: "생각을 바꾸면 세상이 바뀐다.", source: "마하트마 간디" },
            { text: "어려움 속에서도 기회를 찾아라.", source: "알베르트 아인슈타인" },
            { text: "작은 발걸음도 계속 걸으면 큰 여행이 된다.", source: "라오쯔" },
            { text: "자신에게 투자하는 것이 최고의 투자다.", source: "워런 버핏" },
            { text: "완벽한 사람은 없다. 하지만 완벽을 추구할 수는 있다.", source: "빈스 롬바르디" },
            { text: "포기하는 것은 언제든 할 수 있다. 그러니까 오늘은 계속해보자.", source: "존 템플턴" },
            { text: "습관이 운명을 만든다.", source: "아리스토텔레스" },
            { text: "가장 큰 위험은 위험을 감수하지 않는 것이다.", source: "마크 저커버그" },
            { text: "성공은 목적지가 아니라 여행이다.", source: "지그 지글러" },
            { text: "자신의 운명을 스스로 만들어가라.", source: "율리우스 카이사르" },
            
            { text: "어제는 역사고, 내일은 신비다. 오늘은 선물이다.", source: "엘레노어 루즈벨트" },
            { text: "자신을 믿는 순간, 어떻게 살아야 할지 알게 된다.", source: "괴테" },
            { text: "문제를 만난 것에 감사하라. 문제가 당신을 성장시킨다.", source: "존 C. 맥스웰" },
            { text: "행복은 선택이다. 매일 행복을 선택하라.", source: "웨인 다이어" },
            { text: "모든 순간이 새로운 시작이다.", source: "T.S. 엘리엇" },
            { text: "꿈꾸는 자만이 현실을 바꿀 수 있다.", source: "월트 디즈니" },
            { text: "인내심을 가져라. 모든 것이 제때 일어난다.", source: "랄프 월도 에머슨" },
            { text: "자신만의 속도로 가라. 비교는 기쁨의 도둑이다.", source: "테오도어 루즈벨트" },
            { text: "실수는 배움의 기회다. 실수를 두려워하지 마라.", source: "헨리 포드" },
            { text: "매일 감사할 이유를 하나씩 찾아라.", source: "오프라 윈프리" },
            
            { text: "당신의 유일한 한계는 당신 자신이다.", source: "나폴레온 힐" },
            { text: "성공의 비밀은 시작하는 것이다.", source: "마크 트웨인" },
            { text: "긍정적 사고는 긍정적 결과를 만든다.", source: "지그 지글러" },
            { text: "오늘의 고통은 내일의 힘이다.", source: "일본 속담" },
            { text: "변화를 두려워하지 마라. 성장을 위해서는 변화가 필요하다.", source: "존 맥스웰" },
            { text: "자신의 가치를 알고, 그에 맞게 행동하라.", source: "마야 안젤루" },
            { text: "매 순간이 기적이다. 기적을 놓치지 마라.", source: "알베르트 아인슈타인" },
            { text: "열정이 있으면 길이 보인다.", source: "파울로 코엘료" },
            { text: "성공은 준비와 기회가 만나는 지점이다.", source: "보비 유니슨" },
            { text: "인생은 용감한 자의 것이다.", source: "조지 S. 패튼" }
        ];
        
        this.stats = {
            totalGenerated: parseInt(localStorage.getItem('adviceGenerated') || '0'),
            favorites: JSON.parse(localStorage.getItem('adviceFavorites') || '[]')
        };
        
        this.currentAdvice = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
        this.updateFavoritesDisplay();
    }
    
    setupEventListeners() {
        // 조언 생성 버튼
        document.getElementById('generateAdvice').addEventListener('click', () => {
            this.generateAdvice();
        });
        
        // 즐겨찾기 추가 버튼
        document.getElementById('favoriteAdvice').addEventListener('click', () => {
            this.addToFavorites();
        });
        
        // 즐겨찾기 모두 삭제 버튼
        document.getElementById('clearFavorites').addEventListener('click', () => {
            this.clearFavorites();
        });
    }
    
    generateAdvice() {
        const button = document.getElementById('generateAdvice');
        const card = document.querySelector('.advice-card');
        const adviceText = document.getElementById('adviceText');
        const adviceSource = document.getElementById('adviceSource');
        const favoriteBtn = document.getElementById('favoriteAdvice');
        
        // 애니메이션 시작
        button.disabled = true;
        button.innerHTML = '<span class="btn-icon">⏳</span> 조언 생성 중...';
        card.classList.add('updating');
        
        setTimeout(() => {
            // 랜덤 조언 선택
            const randomIndex = Math.floor(Math.random() * this.advices.length);
            this.currentAdvice = { ...this.advices[randomIndex], index: randomIndex };
            
            // 조언 표시
            adviceText.textContent = `"${this.currentAdvice.text}"`;
            adviceSource.textContent = `— ${this.currentAdvice.source} —`;
            
            // 통계 업데이트
            this.stats.totalGenerated++;
            localStorage.setItem('adviceGenerated', this.stats.totalGenerated.toString());
            this.updateStats();
            
            // 애니메이션 완료
            card.classList.remove('updating');
            card.classList.add('updated');
            
            setTimeout(() => {
                card.classList.remove('updated');
            }, 600);
            
            // 버튼 원상복구
            button.disabled = false;
            button.innerHTML = '<span class="btn-icon">🎯</span> 조언 생성';
            
            // 즐겨찾기 버튼 표시
            favoriteBtn.style.display = 'flex';
            
        }, 800);
    }
    
    addToFavorites() {
        if (!this.currentAdvice) return;
        
        // 이미 즐겨찾기에 있는지 확인
        const exists = this.stats.favorites.find(fav => fav.index === this.currentAdvice.index);
        if (exists) {
            this.showMessage('이미 즐겨찾기에 추가된 조언입니다!', 'warning');
            return;
        }
        
        // 즐겨찾기 추가
        this.stats.favorites.push(this.currentAdvice);
        localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
        
        this.updateStats();
        this.updateFavoritesDisplay();
        this.showMessage('즐겨찾기에 추가되었습니다! ❤️', 'success');
    }
    
    removeFromFavorites(index) {
        const favoriteItem = document.querySelector(`[data-index="${index}"]`);
        favoriteItem.classList.add('removing');
        
        setTimeout(() => {
            this.stats.favorites = this.stats.favorites.filter(fav => fav.index !== index);
            localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
            
            this.updateStats();
            this.updateFavoritesDisplay();
        }, 300);
    }
    
    clearFavorites() {
        if (this.stats.favorites.length === 0) {
            this.showMessage('삭제할 즐겨찾기가 없습니다!', 'info');
            return;
        }
        
        if (confirm('모든 즐겨찾기를 삭제하시겠습니까?')) {
            this.stats.favorites = [];
            localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
            
            this.updateStats();
            this.updateFavoritesDisplay();
            this.showMessage('모든 즐겨찾기가 삭제되었습니다!', 'info');
        }
    }
    
    updateStats() {
        document.getElementById('totalGenerated').textContent = this.stats.totalGenerated;
        document.getElementById('totalFavorites').textContent = this.stats.favorites.length;
    }
    
    updateFavoritesDisplay() {
        const favoritesSection = document.getElementById('adviceFavorites');
        const favoritesList = document.getElementById('favoritesList');
        
        if (this.stats.favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }
        
        favoritesSection.style.display = 'block';
        favoritesList.innerHTML = this.stats.favorites
            .map(fav => `
                <div class="favorite-item" data-index="${fav.index}">
                    <div class="advice-text">"${fav.text}"</div>
                    <div class="advice-source">— ${fav.source} —</div>
                    <button class="favorite-remove" onclick="adviceGenerator.removeFromFavorites(${fav.index})">×</button>
                </div>
            `).join('');
    }
    
    showMessage(message, type = 'info') {
        // 기존 메시지 제거
        const existingMessage = document.querySelector('.advice-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 메시지 생성
        const messageEl = document.createElement('div');
        messageEl.className = `advice-message advice-message-${type}`;
        messageEl.textContent = message;
        
        // 메시지 삽입
        const container = document.querySelector('.advice-container');
        container.appendChild(messageEl);
        
        // 애니메이션
        setTimeout(() => messageEl.classList.add('show'), 100);
        
        // 3초 후 제거
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
let adviceGenerator;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    adviceGenerator = new RandomAdviceGenerator();
});
