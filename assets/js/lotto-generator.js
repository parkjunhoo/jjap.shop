// 🎰 로또 번호 생성기 JavaScript

class LottoGenerator {
    constructor() {
        this.excludedNumbers = new Set();
        this.generatedHistory = [];
        this.totalGames = 0;
        
        this.init();
    }

    init() {
        this.createNumbersGrid();
        this.updateStatistics();
        this.bindEvents();
        this.loadHistory();
    }

    // 번호 그리드 생성 (1-45)
    createNumbersGrid() {
        const grid = document.getElementById('numbersGrid');
        grid.innerHTML = '';
        
        for (let i = 1; i <= 45; i++) {
            const btn = document.createElement('button');
            btn.className = 'number-btn';
            btn.textContent = i;
            btn.dataset.number = i;
            
            btn.addEventListener('click', () => this.toggleExclude(i));
            
            grid.appendChild(btn);
        }
    }

    // 제외수 토글
    toggleExclude(number) {
        const btn = document.querySelector(`[data-number="${number}"]`);
        
        if (this.excludedNumbers.has(number)) {
            this.excludedNumbers.delete(number);
            btn.classList.remove('excluded');
        } else {
            this.excludedNumbers.add(number);
            btn.classList.add('excluded');
        }
        
        this.updateExcludeCount();
        this.updateStatistics();
    }

    // 랜덤 제외수 생성
    randomExclude() {
        // 기존 제외수 초기화
        this.clearExclude();
        
        // 1-45 중 랜덤하게 5개 선택
        const randomCount = 5;
        const selected = new Set();
        
        while (selected.size < randomCount) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            selected.add(randomNum);
        }
        
        // 제외수로 설정
        selected.forEach(num => {
            this.excludedNumbers.add(num);
            const btn = document.querySelector(`[data-number="${num}"]`);
            btn.classList.add('excluded');
        });
        
        this.updateExcludeCount();
        this.updateStatistics();
        
        // 시각적 효과
        this.showToast('🎲 랜덤 제외수가 선택되었습니다!');
    }

    // 제외수 전체 해제
    clearExclude() {
        this.excludedNumbers.clear();
        document.querySelectorAll('.number-btn.excluded').forEach(btn => {
            btn.classList.remove('excluded');
        });
        
        this.updateExcludeCount();
        this.updateStatistics();
    }

    // 제외수 개수 업데이트
    updateExcludeCount() {
        document.getElementById('excludeCount').textContent = this.excludedNumbers.size;
    }

    // 로또 번호 생성 (메인 함수)
    generateLottoNumbers(gameCount = 1) {
        const availableNumbers = [];
        
        // 제외수를 제외한 사용 가능한 번호들 생성
        for (let i = 1; i <= 45; i++) {
            if (!this.excludedNumbers.has(i)) {
                availableNumbers.push(i);
            }
        }
        
        // 사용 가능한 번호가 6개 미만이면 경고
        if (availableNumbers.length < 6) {
            this.showToast('⚠️ 제외수가 너무 많습니다. 최소 6개 번호는 선택 가능해야 합니다.', 'error');
            return null;
        }
        
        const games = [];
        
        for (let game = 0; game < gameCount; game++) {
            const selectedNumbers = this.selectRandomNumbers(availableNumbers, 6);
            games.push(selectedNumbers.sort((a, b) => a - b));
        }
        
        this.displayGeneratedNumbers(games);
        
        // 기록에 추가
        if (document.getElementById('saveHistory').checked) {
            games.forEach(numbers => {
                this.generatedHistory.unshift({
                    numbers: numbers,
                    time: new Date(),
                    excludedCount: this.excludedNumbers.size
                });
            });
            
            // 최대 50개만 보관
            if (this.generatedHistory.length > 50) {
                this.generatedHistory = this.generatedHistory.slice(0, 50);
            }
            
            this.saveHistory();
            this.displayHistory();
        }
        
        this.totalGames += gameCount;
        this.updateStatistics();
        
        return games;
    }

    // 랜덤 번호 선택 (Fisher-Yates 셔플 알고리즘 사용)
    selectRandomNumbers(availableNumbers, count) {
        const shuffled = [...availableNumbers];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled.slice(0, count);
    }

    // 번호별 색상 클래스 반환
    getNumberColorClass(number) {
        if (number >= 1 && number <= 10) return 'yellow';       // 1~10: 노란색
        if (number >= 11 && number <= 20) return 'skyblue';     // 11~20: 하늘색  
        if (number >= 21 && number <= 30) return 'tomato';      // 21~30: 토마토색
        if (number >= 31 && number <= 40) return 'gray';        // 31~40: 회색
        if (number >= 41 && number <= 45) return 'lightgreen';  // 41~45: 연두색
        return 'yellow'; // 기본값
    }

    // 생성된 번호 표시
    displayGeneratedNumbers(games) {
        const container = document.getElementById('generatedNumbers');
        
        const gamesHTML = games.map((numbers, index) => {
            const gameNum = games.length > 1 ? ` (${index + 1}게임)` : '';
            const currentTime = new Date().toLocaleString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const ballsHTML = numbers.map(num => 
                `<div class="lotto-ball ${this.getNumberColorClass(num)}">${num}</div>`
            ).join('');
            
            return `
                <div class="number-game">
                    <div class="game-header">
                        <span>🎰 로또 번호${gameNum}</span>
                        <span class="game-time">${currentTime}</span>
                    </div>
                    <div class="lotto-balls">
                        ${ballsHTML}
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = gamesHTML;
        
        // 번호 생성 애니메이션
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }

    // 통계 업데이트
    updateStatistics() {
        document.getElementById('totalGames').textContent = this.totalGames.toLocaleString();
        document.getElementById('currentExcludes').textContent = this.excludedNumbers.size;
        
        // 가능한 조합 수 계산 (nCr)
        const availableCount = 45 - this.excludedNumbers.size;
        const possibleCombos = this.calculateCombination(availableCount, 6);
        document.getElementById('possibleCombos').textContent = possibleCombos.toLocaleString();
    }

    // 조합 계산 (nCr = n! / (r!(n-r)!))
    calculateCombination(n, r) {
        if (n < r) return 0;
        if (r === 0 || r === n) return 1;
        
        // 최적화: r > n-r이면 r = n-r로 계산
        if (r > n - r) r = n - r;
        
        let result = 1;
        for (let i = 0; i < r; i++) {
            result = result * (n - i) / (i + 1);
        }
        
        return Math.round(result);
    }

    // 기록 표시
    displayHistory() {
        const historySection = document.getElementById('historySection');
        const historyList = document.getElementById('historyList');
        
        if (this.generatedHistory.length === 0) {
            historySection.style.display = 'none';
            return;
        }
        
        historySection.style.display = 'block';
        
        const historyHTML = this.generatedHistory.slice(0, 10).map(item => {
            const timeString = item.time.toLocaleString('ko-KR', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const ballsHTML = item.numbers.map(num => 
                `<div class="history-ball ${this.getNumberColorClass(num)}">${num}</div>`
            ).join('');
            
            return `
                <div class="history-item">
                    <div class="history-numbers">${ballsHTML}</div>
                    <div class="history-time">${timeString}</div>
                </div>
            `;
        }).join('');
        
        historyList.innerHTML = historyHTML;
    }

    // 기록 저장 (로컬 스토리지)
    saveHistory() {
        const historyData = this.generatedHistory.map(item => ({
            numbers: item.numbers,
            time: item.time.getTime(),
            excludedCount: item.excludedCount
        }));
        
        localStorage.setItem('lotto_generator_history', JSON.stringify(historyData));
        localStorage.setItem('lotto_generator_total_games', this.totalGames.toString());
    }

    // 기록 로드 (로컬 스토리지)
    loadHistory() {
        try {
            const historyData = localStorage.getItem('lotto_generator_history');
            const totalGames = localStorage.getItem('lotto_generator_total_games');
            
            if (historyData) {
                this.generatedHistory = JSON.parse(historyData).map(item => ({
                    numbers: item.numbers,
                    time: new Date(item.time),
                    excludedCount: item.excludedCount
                }));
                this.displayHistory();
            }
            
            if (totalGames) {
                this.totalGames = parseInt(totalGames, 10);
            }
        } catch (error) {
            console.warn('기록 로드 중 오류:', error);
        }
    }

    // 기록 삭제
    clearHistory() {
        if (confirm('모든 생성 기록을 삭제하시겠습니까?')) {
            this.generatedHistory = [];
            this.totalGames = 0;
            localStorage.removeItem('lotto_generator_history');
            localStorage.removeItem('lotto_generator_total_games');
            
            this.displayHistory();
            this.updateStatistics();
            this.showToast('🗑️ 모든 기록이 삭제되었습니다.');
        }
    }

    // 토스트 메시지 표시
    showToast(message, type = 'success') {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.lotto-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = `lotto-toast lotto-toast-${type}`;
        toast.textContent = message;
        
        // 스타일 설정
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            background: type === 'error' 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
                : 'linear-gradient(135deg, #10ac84 0%, #06a3d2 100%)'
        });
        
        document.body.appendChild(toast);
        
        // 애니메이션
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // 자동 제거
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // 이벤트 바인딩
    bindEvents() {
        // 메인 생성 버튼
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateLottoNumbers(1);
        });
        
        // 빠른 생성 버튼
        document.getElementById('quickGenBtn').addEventListener('click', () => {
            this.generateLottoNumbers(1);
        });
        
        // 다중 생성 버튼
        document.getElementById('multiGenBtn').addEventListener('click', () => {
            this.generateLottoNumbers(5);
        });
        
        // 랜덤 제외 버튼
        document.getElementById('randomExcludeBtn').addEventListener('click', () => {
            this.randomExclude();
        });
        
        // 제외수 전체 해제 버튼
        document.getElementById('clearExcludeBtn').addEventListener('click', () => {
            this.clearExclude();
            this.showToast('🗑️ 모든 제외수가 해제되었습니다.');
        });
        
        // 기록 삭제 버튼
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });
        
        // 키보드 단축키
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.generateLottoNumbers(1);
                    break;
                case 'r':
                case 'R':
                    this.randomExclude();
                    break;
                case 'c':
                case 'C':
                    this.clearExclude();
                    break;
                case 'm':
                case 'M':
                    this.generateLottoNumbers(5);
                    break;
            }
        });
        
        // 옵션 변경 시 통계 업데이트
        document.querySelectorAll('.option-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateStatistics();
            });
        });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const lottoGenerator = new LottoGenerator();
    
    // 전역에서 접근 가능하도록
    window.lottoGenerator = lottoGenerator;
    
    // 도움말 키보드 단축키 정보 표시
});
