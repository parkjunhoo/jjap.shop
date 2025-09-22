// 🍅 포모도로 타이머 JavaScript

class PomodoroTimer {
    constructor() {
        // 기본 설정값
        this.settings = {
            focusTime: 25,
            breakTime: 5,
            longBreakTime: 15,
            soundEnabled: true,
            autoStart: false
        };
        
        // 타이머 상태
        this.isRunning = false;
        this.isPaused = false;
        this.currentSession = 'focus'; // 'focus', 'break', 'longBreak'
        this.completedPomodoros = 0;
        this.timeRemaining = this.settings.focusTime * 60;
        this.timerId = null;
        
        // 통계 데이터
        this.stats = this.loadStats();
        
        // DOM 요소
        this.elements = {
            timeDisplay: document.getElementById('timeDisplay'),
            sessionType: document.getElementById('sessionType'),
            startBtn: document.getElementById('startBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            resetBtn: document.getElementById('resetBtn'),
            completedSessions: document.getElementById('completedSessions'),
            progressBar: document.querySelector('.progress-ring-bar'),
            focusTime: document.getElementById('focusTime'),
            breakTime: document.getElementById('breakTime'),
            longBreakTime: document.getElementById('longBreakTime'),
            focusTimeValue: document.getElementById('focusTimeValue'),
            breakTimeValue: document.getElementById('breakTimeValue'),
            longBreakTimeValue: document.getElementById('longBreakTimeValue'),
            soundEnabled: document.getElementById('soundEnabled'),
            autoStart: document.getElementById('autoStart'),
            todayPomodoros: document.getElementById('todayPomodoros'),
            todayFocusTime: document.getElementById('todayFocusTime'),
            todayBreaks: document.getElementById('todayBreaks'),
            productivity: document.getElementById('productivity'),
            resetStatsBtn: document.getElementById('resetStatsBtn')
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateStats();
        this.showNotification('포모도로 타이머가 준비되었습니다! 🍅', 'success');
    }
    
    setupEventListeners() {
        // 타이머 컨트롤
        this.elements.startBtn.addEventListener('click', () => this.start());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.resetBtn.addEventListener('click', () => this.reset());
        
        // 설정 변경
        this.elements.focusTime.addEventListener('input', (e) => {
            this.settings.focusTime = parseFloat(e.target.value);
            this.elements.focusTimeValue.textContent = this.formatTimeValue(this.settings.focusTime);
            if (this.currentSession === 'focus' && !this.isRunning) {
                this.timeRemaining = this.settings.focusTime * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });
        
        this.elements.breakTime.addEventListener('input', (e) => {
            this.settings.breakTime = parseFloat(e.target.value);
            this.elements.breakTimeValue.textContent = this.formatTimeValue(this.settings.breakTime);
            if (this.currentSession === 'break' && !this.isRunning) {
                this.timeRemaining = this.settings.breakTime * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });
        
        this.elements.longBreakTime.addEventListener('input', (e) => {
            this.settings.longBreakTime = parseFloat(e.target.value);
            this.elements.longBreakTimeValue.textContent = this.formatTimeValue(this.settings.longBreakTime);
            if (this.currentSession === 'longBreak' && !this.isRunning) {
                this.timeRemaining = this.settings.longBreakTime * 60;
                this.updateDisplay();
            }
            this.saveSettings();
        });
        
        this.elements.soundEnabled.addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.saveSettings();
        });
        
        this.elements.autoStart.addEventListener('change', (e) => {
            this.settings.autoStart = e.target.checked;
            this.saveSettings();
        });
        
        // 통계 리셋 버튼
        this.elements.resetStatsBtn.addEventListener('click', () => {
            this.resetStats();
        });
        
        // 브라우저 종료 시 설정 저장
        window.addEventListener('beforeunload', () => {
            this.saveSettings();
            this.saveStats();
        });
    }
    
    start() {
        if (this.isPaused) {
            // 일시정지 상태에서 재시작
            this.isPaused = false;
            this.isRunning = true;
            
            this.elements.startBtn.disabled = true;
            this.elements.pauseBtn.disabled = false;
            this.elements.startBtn.querySelector('.btn-text').textContent = '시작';
            
            this.timerId = setInterval(() => {
                this.timeRemaining--;
                this.updateDisplay();
                
                if (this.timeRemaining <= 0) {
                    this.complete();
                }
            }, 1000);
            
            this.showNotification('타이머가 재시작되었습니다', 'info');
            return;
        }
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        
        this.timerId = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            if (this.timeRemaining <= 0) {
                this.complete();
            }
        }, 1000);
        
        this.showNotification(this.getSessionMessage('시작'), 'info');
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.isPaused = true;
        
        clearInterval(this.timerId);
        
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        
        // 버튼 텍스트 변경
        this.elements.startBtn.querySelector('.btn-text').textContent = '계속';
        
        this.showNotification('타이머가 일시정지되었습니다', 'warning');
    }
    
    resume() {
        // 이 메서드는 더 이상 사용되지 않음 (start 메서드에서 처리)
        this.start();
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.timerId);
        
        this.setSessionTime();
        this.updateDisplay();
        
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
        this.elements.startBtn.querySelector('.btn-text').textContent = '시작';
        
        this.showNotification('타이머가 리셋되었습니다', 'info');
    }
    
    complete() {
        this.isRunning = false;
        clearInterval(this.timerId);
        
        // 통계 업데이트
        this.updateSessionStats();
        
        // 세션 완료 처리
        if (this.currentSession === 'focus') {
            this.completedPomodoros++;
            this.elements.completedSessions.textContent = this.completedPomodoros;
            
            // 4번째 포모도로 완료 시 긴 휴식
            if (this.completedPomodoros % 4 === 0) {
                this.switchSession('longBreak');
            } else {
                this.switchSession('break');
            }
        } else {
            this.switchSession('focus');
        }
        
        // 알림
        this.playNotificationSound();
        this.showNotification(this.getSessionMessage('완료'), 'success');
        
        // 자동 시작
        if (this.settings.autoStart) {
            setTimeout(() => this.start(), 2000);
        } else {
            this.elements.startBtn.disabled = false;
            this.elements.pauseBtn.disabled = true;
        }
        
        this.updateStats();
    }
    
    switchSession(newSession) {
        this.currentSession = newSession;
        this.setSessionTime();
        this.updateDisplay();
        
        // 타이머 컨테이너에 클래스 추가 (CSS 색상 변경용)
        const container = document.querySelector('.pomodoro-container');
        container.className = 'pomodoro-container';
        container.classList.add(`timer-${newSession}`);
    }
    
    setSessionTime() {
        switch (this.currentSession) {
            case 'focus':
                this.timeRemaining = this.settings.focusTime * 60;
                break;
            case 'break':
                this.timeRemaining = this.settings.breakTime * 60;
                break;
            case 'longBreak':
                this.timeRemaining = this.settings.longBreakTime * 60;
                break;
        }
    }
    
    updateDisplay() {
        // 시간 표시
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.elements.timeDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 세션 타입 표시
        const sessionTypes = {
            focus: '집중 시간',
            break: '짧은 휴식',
            longBreak: '긴 휴식'
        };
        this.elements.sessionType.textContent = sessionTypes[this.currentSession];
        
        // 프로그레스 바 업데이트
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const totalTime = this.getTotalSessionTime();
        const progress = ((totalTime - this.timeRemaining) / totalTime) * 100;
        const circumference = 2 * Math.PI * 130; // r = 130
        const strokeDashoffset = circumference - (progress / 100) * circumference;
        
        this.elements.progressBar.style.strokeDashoffset = strokeDashoffset;
    }
    
    getTotalSessionTime() {
        switch (this.currentSession) {
            case 'focus': return this.settings.focusTime * 60;
            case 'break': return this.settings.breakTime * 60;
            case 'longBreak': return this.settings.longBreakTime * 60;
            default: return 0;
        }
    }
    
    updateSessionStats() {
        const today = new Date().toDateString();
        
        if (this.stats.date !== today) {
            // 새로운 날이면 통계 초기화
            this.stats = {
                date: today,
                pomodoros: 0,
                focusTime: 0,
                breaks: 0
            };
        }
        
        if (this.currentSession === 'focus') {
            this.stats.pomodoros++;
            this.stats.focusTime += this.settings.focusTime;
        } else {
            this.stats.breaks++;
        }
        
        this.saveStats();
    }
    
    updateStats() {
        const today = new Date().toDateString();
        
        if (this.stats.date !== today) {
            this.stats = { date: today, pomodoros: 0, focusTime: 0, breaks: 0 };
        }
        
        this.elements.todayPomodoros.textContent = this.stats.pomodoros;
        this.elements.todayFocusTime.textContent = `${this.stats.focusTime}분`;
        this.elements.todayBreaks.textContent = this.stats.breaks;
        
        // 생산성 계산 (목표 8 포모도로 기준)
        const productivity = Math.min((this.stats.pomodoros / 8) * 100, 100);
        this.elements.productivity.textContent = `${Math.round(productivity)}%`;
    }
    
    getSessionMessage(action) {
        const messages = {
            focus: { 
                시작: '🎯 집중 시간이 시작되었습니다!', 
                완료: '✅ 집중 시간이 완료되었습니다!' 
            },
            break: { 
                시작: '☕ 짧은 휴식이 시작되었습니다!', 
                완료: '🔄 휴식이 끝났습니다!' 
            },
            longBreak: { 
                시작: '🌟 긴 휴식이 시작되었습니다!', 
                완료: '💪 긴 휴식이 끝났습니다!' 
            }
        };
        return messages[this.currentSession][action];
    }
    
    playNotificationSound() {
        if (!this.settings.soundEnabled) return;
        
        try {
            // 간단한 비프음 생성
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // 오디오 컨텍스트 실패시 아무것도 하지 않음
        }
    }
    
    formatTimeValue(minutes) {
        const totalSeconds = Math.round(minutes * 60);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        
        if (mins === 0) {
            return `${secs}초`;
        } else if (secs === 0) {
            return `${mins}분`;
        } else {
            return `${mins}분 ${secs}초`;
        }
    }
    
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.pomodoro-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `pomodoro-notification pomodoro-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // CSS 스타일 추가
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // 닫기 버튼 이벤트
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // 3초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    saveSettings() {
        localStorage.setItem('pomodoroSettings', JSON.stringify(this.settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('pomodoroSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        
        // UI에 설정값 반영
        this.elements.focusTime.value = this.settings.focusTime;
        this.elements.breakTime.value = this.settings.breakTime;
        this.elements.longBreakTime.value = this.settings.longBreakTime;
        this.elements.focusTimeValue.textContent = this.formatTimeValue(this.settings.focusTime);
        this.elements.breakTimeValue.textContent = this.formatTimeValue(this.settings.breakTime);
        this.elements.longBreakTimeValue.textContent = this.formatTimeValue(this.settings.longBreakTime);
        this.elements.soundEnabled.checked = this.settings.soundEnabled;
        this.elements.autoStart.checked = this.settings.autoStart;
        
        this.setSessionTime();
    }
    
    saveStats() {
        localStorage.setItem('pomodoroStats', JSON.stringify(this.stats));
    }
    
    loadStats() {
        const saved = localStorage.getItem('pomodoroStats');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            date: new Date().toDateString(),
            pomodoros: 0,
            focusTime: 0,
            breaks: 0
        };
    }
    
    resetStats() {
        if (confirm('정말로 오늘의 통계를 모두 리셋하시겠습니까?')) {
            // 통계 초기화
            this.stats = {
                date: new Date().toDateString(),
                pomodoros: 0,
                focusTime: 0,
                breaks: 0
            };
            
            // 완료한 포모도로 수도 초기화
            this.completedPomodoros = 0;
            this.elements.completedSessions.textContent = '0';
            
            // 로컬 스토리지 저장
            this.saveStats();
            
            // UI 업데이트
            this.updateStats();
            
            this.showNotification('통계가 리셋되었습니다! 🔄', 'info');
        }
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
}
`;
document.head.appendChild(style);

// 페이지 로드 시 타이머 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroTimer = new PomodoroTimer();
});
