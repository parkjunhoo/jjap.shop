// 💧 물 섭취량 트래커 JavaScript

class WaterTracker {
    constructor() {
        this.dailyGoal = 2000; // ml
        this.currentIntake = 0; // ml
        this.intakeLog = [];
        this.reminderEnabled = false;
        this.reminderInterval = 60; // minutes
        this.reminderTimer = null;
        this.weeklyData = [];
        this.streakCount = 0;
        this.currentChart = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTodayData();
        this.loadWeeklyData();
        this.updateDisplay();
        this.createWeeklyChart();
        this.checkReminders();
    }

    setupEventListeners() {
        // 빠른 추가 버튼들
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.currentTarget.dataset.amount);
                this.addWaterIntake(amount);
            });
        });

        // 커스텀 양 추가
        document.getElementById('addCustomAmount').addEventListener('click', () => {
            this.addCustomAmount();
        });

        // 엔터키로 커스텀 양 추가
        document.getElementById('customAmount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCustomAmount();
            }
        });

        // 컨트롤 버튼들
        document.getElementById('resetDay').addEventListener('click', () => {
            this.resetDay();
        });

        document.getElementById('undoLast').addEventListener('click', () => {
            this.undoLast();
        });

        // 목표 계산
        document.getElementById('calculateGoal').addEventListener('click', () => {
            this.calculateRecommendedGoal();
        });

        // 목표 적용
        document.getElementById('applyRecommendation').addEventListener('click', () => {
            this.applyRecommendation();
        });

        // 알림 설정
        document.getElementById('reminderEnabled').addEventListener('change', (e) => {
            this.reminderEnabled = e.target.checked;
            document.getElementById('reminderInterval').disabled = !this.reminderEnabled;
            this.updateReminderDisplay();
            this.saveSettings();
            
            if (this.reminderEnabled) {
                this.startReminder();
                this.showToast('물 마시기 알림이 켜졌습니다! 💧');
            } else {
                this.stopReminder();
                this.showToast('물 마시기 알림이 꺼졌습니다.');
            }
        });

        document.getElementById('reminderInterval').addEventListener('change', (e) => {
            this.reminderInterval = parseInt(e.target.value);
            this.saveSettings();
            if (this.reminderEnabled) {
                this.startReminder();
            }
        });

        // 데이터 내보내기
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        // 커스텀 목표 입력
        document.getElementById('customGoal').addEventListener('input', (e) => {
            const customGoal = parseInt(e.target.value);
            if (customGoal && customGoal >= 1000 && customGoal <= 5000) {
                this.dailyGoal = customGoal;
                this.updateDisplay();
                this.saveSettings();
            }
        });
    }

    addWaterIntake(amount) {
        if (amount <= 0) return;

        const now = new Date();
        const logEntry = {
            time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            amount: amount,
            timestamp: now.toISOString()
        };

        this.currentIntake += amount;
        this.intakeLog.push(logEntry);
        
        this.updateDisplay();
        this.updateIntakeLog();
        this.saveTodayData();
        this.checkGoalAchievement();

        // 커스텀 입력 필드 초기화
        document.getElementById('customAmount').value = '';

        // 성취감 피드백
        this.showIntakeAnimation(amount);
    }

    addCustomAmount() {
        const customAmount = parseInt(document.getElementById('customAmount').value);
        
        if (!customAmount || customAmount <= 0) {
            this.showToast('올바른 양을 입력해주세요!', 'error');
            return;
        }

        if (customAmount > 1000) {
            this.showToast('한 번에 1000ml 이하로 입력해주세요!', 'error');
            return;
        }

        this.addWaterIntake(customAmount);
    }

    undoLast() {
        if (this.intakeLog.length === 0) return;

        const lastEntry = this.intakeLog.pop();
        this.currentIntake -= lastEntry.amount;
        
        this.updateDisplay();
        this.updateIntakeLog();
        this.saveTodayData();

        this.showToast(`마지막 섭취 ${lastEntry.amount}ml가 취소되었습니다.`);
    }

    resetDay() {
        if (confirm('오늘의 물 섭취 기록을 모두 초기화하시겠습니까?')) {
            this.currentIntake = 0;
            this.intakeLog = [];
            
            this.updateDisplay();
            this.updateIntakeLog();
            this.saveTodayData();

            this.showToast('오늘의 기록이 초기화되었습니다.');
        }
    }

    updateDisplay() {
        // 현재 섭취량
        document.getElementById('currentAmount').textContent = this.currentIntake;
        document.getElementById('goalAmount').textContent = this.dailyGoal;
        
        // 진행률
        const progressPercent = Math.min(100, (this.currentIntake / this.dailyGoal) * 100);
        document.getElementById('progressPercent').textContent = Math.round(progressPercent);
        
        // 물병 레벨
        document.getElementById('waterLevel').style.height = `${progressPercent}%`;
        
        // 통계
        document.getElementById('totalIntake').textContent = `${this.currentIntake}ml`;
        
        const remaining = Math.max(0, this.dailyGoal - this.currentIntake);
        document.getElementById('remainingAmount').textContent = `${remaining}ml`;
        
        document.getElementById('achievementRate').textContent = `${Math.round(progressPercent)}%`;
        document.getElementById('streakDays').textContent = `${this.streakCount}일`;

        // Undo 버튼 상태
        document.getElementById('undoLast').disabled = this.intakeLog.length === 0;

        // 목표 달성시 특별 효과
        if (progressPercent >= 100) {
            document.getElementById('waterLevel').style.background = 'linear-gradient(to top, #4CAF50, #8BC34A)';
        } else {
            document.getElementById('waterLevel').style.background = 'linear-gradient(to top, #00BCD4, #4DD0E1)';
        }
    }

    updateIntakeLog() {
        const container = document.getElementById('intakeLog');
        
        if (this.intakeLog.length === 0) {
            container.innerHTML = `
                <div class="empty-log">
                    <div class="empty-icon">💧</div>
                    <p>아직 오늘 물을 마신 기록이 없습니다.<br>첫 번째 물을 마셔보세요!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        // 최신 기록부터 표시 (역순)
        [...this.intakeLog].reverse().forEach((entry, index) => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            
            logItem.innerHTML = `
                <div class="log-time">${entry.time}</div>
                <div class="log-amount">${entry.amount}ml</div>
                <button class="log-delete" onclick="waterTracker.deleteLogEntry(${this.intakeLog.length - 1 - index})" title="삭제">🗑️</button>
            `;
            
            container.appendChild(logItem);
        });
    }

    deleteLogEntry(index) {
        if (index < 0 || index >= this.intakeLog.length) return;

        const deletedEntry = this.intakeLog.splice(index, 1)[0];
        this.currentIntake -= deletedEntry.amount;
        
        this.updateDisplay();
        this.updateIntakeLog();
        this.saveTodayData();

        this.showToast(`${deletedEntry.amount}ml 기록이 삭제되었습니다.`);
    }

    calculateRecommendedGoal() {
        const weight = parseFloat(document.getElementById('userWeight').value);
        const activityLevel = document.getElementById('activityLevel').value;
        const weatherCondition = document.getElementById('weatherCondition').value;

        if (!weight || weight < 30 || weight > 200) {
            this.showToast('올바른 체중을 입력해주세요! (30-200kg)', 'error');
            return;
        }

        // 기본 계산: 체중 * 35ml
        let recommendedAmount = weight * 35;

        // 활동량에 따른 조정
        switch (activityLevel) {
            case 'low':
                recommendedAmount *= 0.9;
                break;
            case 'moderate':
                recommendedAmount *= 1.0;
                break;
            case 'high':
                recommendedAmount *= 1.2;
                break;
        }

        // 날씨에 따른 조정
        switch (weatherCondition) {
            case 'normal':
                recommendedAmount *= 1.0;
                break;
            case 'hot':
                recommendedAmount *= 1.15;
                break;
            case 'cold':
                recommendedAmount *= 0.95;
                break;
        }

        // 100ml 단위로 반올림
        recommendedAmount = Math.round(recommendedAmount / 100) * 100;

        // 최소 1500ml, 최대 4000ml로 제한
        recommendedAmount = Math.max(1500, Math.min(4000, recommendedAmount));

        document.getElementById('recommendedAmount').textContent = `${recommendedAmount}ml`;
        document.getElementById('goalRecommendation').style.display = 'block';

        // 임시로 추천량 저장
        this.tempRecommendedGoal = recommendedAmount;

        this.showToast(`체중 ${weight}kg 기준으로 권장량이 계산되었습니다!`);
    }

    applyRecommendation() {
        if (this.tempRecommendedGoal) {
            this.dailyGoal = this.tempRecommendedGoal;
            document.getElementById('customGoal').value = this.dailyGoal;
            document.getElementById('goalRecommendation').style.display = 'none';
            
            this.updateDisplay();
            this.saveSettings();
            
            this.showToast(`일일 목표가 ${this.dailyGoal}ml로 설정되었습니다! 🎯`);
        }
    }

    checkGoalAchievement() {
        const progressPercent = (this.currentIntake / this.dailyGoal) * 100;

        if (progressPercent >= 100 && this.currentIntake >= this.dailyGoal) {
            this.celebrateGoalAchievement();
        } else if (progressPercent >= 75 && progressPercent < 100) {
            // 75% 달성시 격려 메시지
            if (Math.floor(progressPercent) === 75) {
                this.showToast('목표의 75%를 달성했습니다! 조금만 더 화이팅! 🔥');
            }
        } else if (progressPercent >= 50 && progressPercent < 75) {
            // 50% 달성시 격려 메시지
            if (Math.floor(progressPercent) === 50) {
                this.showToast('목표의 절반을 달성했습니다! 계속 하세요! 💪');
            }
        }
    }

    celebrateGoalAchievement() {
        // 목표 달성 축하 효과
        this.showToast('🎉 오늘의 수분 섭취 목표를 달성했습니다! 축하합니다!', 'success');
        
        // 연속 달성 일수 업데이트
        this.updateStreak();

        // 특별 효과
        this.triggerCelebrationEffect();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastAchievementDate = localStorage.getItem('lastWaterAchievement');

        if (lastAchievementDate === today) {
            // 이미 오늘 달성 기록이 있음
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastAchievementDate === yesterday.toDateString()) {
            // 연속 달성
            this.streakCount++;
        } else if (!lastAchievementDate) {
            // 첫 번째 달성
            this.streakCount = 1;
        } else {
            // 연속 끊어짐
            this.streakCount = 1;
        }

        localStorage.setItem('lastWaterAchievement', today);
        localStorage.setItem('waterStreak', this.streakCount.toString());
        
        this.updateDisplay();
    }

    triggerCelebrationEffect() {
        // 물병에 특별 효과 추가
        const waterLevel = document.getElementById('waterLevel');
        waterLevel.style.animation = 'celebration 2s ease-in-out';
        
        setTimeout(() => {
            waterLevel.style.animation = '';
        }, 2000);

        // CSS에서 celebration 키프레임 정의 필요
    }

    showIntakeAnimation(amount) {
        const amountText = document.getElementById('currentAmount');
        amountText.style.transform = 'scale(1.2)';
        amountText.style.color = '#4CAF50';

        setTimeout(() => {
            amountText.style.transform = 'scale(1)';
            amountText.style.color = '#00BCD4';
        }, 500);

        // +amount 애니메이션
        const plusElement = document.createElement('div');
        plusElement.textContent = `+${amount}ml`;
        plusElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #4CAF50;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            animation: plusAnimation 2s ease-out forwards;
            z-index: 100;
        `;

        const bottleInfo = document.querySelector('.bottle-info');
        bottleInfo.style.position = 'relative';
        bottleInfo.appendChild(plusElement);

        setTimeout(() => {
            bottleInfo.removeChild(plusElement);
        }, 2000);
    }

    // 알림 기능
    startReminder() {
        this.stopReminder(); // 기존 타이머 정지

        if (!this.reminderEnabled) return;

        const intervalMs = this.reminderInterval * 60 * 1000;
        
        this.reminderTimer = setInterval(() => {
            this.showWaterReminder();
        }, intervalMs);

        // 다음 알림 시간 업데이트
        this.updateReminderDisplay();
    }

    stopReminder() {
        if (this.reminderTimer) {
            clearInterval(this.reminderTimer);
            this.reminderTimer = null;
        }
        document.getElementById('nextReminder').style.display = 'none';
    }

    updateReminderDisplay() {
        const nextReminderDiv = document.getElementById('nextReminder');
        
        if (this.reminderEnabled) {
            const nextTime = new Date();
            nextTime.setMinutes(nextTime.getMinutes() + this.reminderInterval);
            
            document.getElementById('nextReminderTime').textContent = 
                nextTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            nextReminderDiv.style.display = 'block';
        } else {
            nextReminderDiv.style.display = 'none';
        }
    }

    showWaterReminder() {
        // 브라우저 알림 권한 요청
        if (Notification.permission === 'granted') {
            new Notification('💧 물 마실 시간!', {
                body: '건강한 수분 섭취를 위해 물을 마셔보세요!',
                icon: '/favicon.ico'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('💧 물 마실 시간!', {
                        body: '건강한 수분 섭취를 위해 물을 마셔보세요!',
                        icon: '/favicon.ico'
                    });
                }
            });
        }

        // 페이지 내 알림도 표시
        this.showToast('💧 물 마실 시간이에요! 수분을 보충해주세요 🥤', 'reminder');
        
        // 다음 알림 시간 업데이트
        this.updateReminderDisplay();
    }

    checkReminders() {
        // 알림 설정 불러오기
        const savedSettings = JSON.parse(localStorage.getItem('waterSettings') || '{}');
        this.reminderEnabled = savedSettings.reminderEnabled || false;
        this.reminderInterval = savedSettings.reminderInterval || 60;

        document.getElementById('reminderEnabled').checked = this.reminderEnabled;
        document.getElementById('reminderInterval').value = this.reminderInterval;
        document.getElementById('reminderInterval').disabled = !this.reminderEnabled;

        if (this.reminderEnabled) {
            this.startReminder();
        }
        
        this.updateReminderDisplay();
    }

    // 주간 차트
    createWeeklyChart() {
        const ctx = document.getElementById('weeklyChart').getContext('2d');
        
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        const weeklyAmounts = this.getWeeklyAmounts();

        if (this.currentChart) {
            this.currentChart.destroy();
        }

        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weekDays,
                datasets: [{
                    label: '섭취량 (ml)',
                    data: weeklyAmounts,
                    backgroundColor: weeklyAmounts.map(amount => 
                        amount >= this.dailyGoal ? '#4CAF50' : '#00BCD4'
                    ),
                    borderColor: '#0097A7',
                    borderWidth: 1,
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.parsed.y}ml`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(this.dailyGoal * 1.2, Math.max(...weeklyAmounts) * 1.1),
                        ticks: {
                            callback: (value) => `${value}ml`
                        },
                        grid: {
                            color: 'rgba(0, 188, 212, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        this.updateWeeklySummary(weeklyAmounts);
    }

    getWeeklyAmounts() {
        const amounts = new Array(7).fill(0);
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toDateString();
            
            const dayData = localStorage.getItem(`waterData_${dateStr}`);
            if (dayData) {
                const parsed = JSON.parse(dayData);
                amounts[i] = parsed.totalIntake || 0;
            }
        }
        
        return amounts;
    }

    updateWeeklySummary(weeklyAmounts) {
        const container = document.getElementById('weeklySummary');
        const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
        
        container.innerHTML = '';
        weeklyAmounts.forEach((amount, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = `day-summary ${amount >= this.dailyGoal ? 'achieved' : ''}`;
            
            dayElement.innerHTML = `
                <div class="day-name">${weekDays[index]}</div>
                <div class="day-amount">${amount}ml</div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    // 데이터 관리
    saveTodayData() {
        const today = new Date().toDateString();
        const data = {
            totalIntake: this.currentIntake,
            intakeLog: this.intakeLog,
            goal: this.dailyGoal,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`waterData_${today}`, JSON.stringify(data));
    }

    loadTodayData() {
        const today = new Date().toDateString();
        const savedData = localStorage.getItem(`waterData_${today}`);
        
        if (savedData) {
            const data = JSON.parse(savedData);
            this.currentIntake = data.totalIntake || 0;
            this.intakeLog = data.intakeLog || [];
            if (data.goal) {
                this.dailyGoal = data.goal;
                document.getElementById('customGoal').value = this.dailyGoal;
            }
        }

        // 연속 달성 일수 로드
        this.streakCount = parseInt(localStorage.getItem('waterStreak') || '0');
    }

    loadWeeklyData() {
        // 주간 데이터는 getWeeklyAmounts에서 동적으로 로드
    }

    saveSettings() {
        const settings = {
            dailyGoal: this.dailyGoal,
            reminderEnabled: this.reminderEnabled,
            reminderInterval: this.reminderInterval
        };
        
        localStorage.setItem('waterSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('waterSettings') || '{}');
        
        this.dailyGoal = settings.dailyGoal || 2000;
        this.reminderEnabled = settings.reminderEnabled || false;
        this.reminderInterval = settings.reminderInterval || 60;
        
        document.getElementById('customGoal').value = this.dailyGoal;
    }

    exportData() {
        const weeklyAmounts = this.getWeeklyAmounts();
        const weekDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        
        let csvContent = '날짜,섭취량(ml),목표달성\n';
        
        const today = new Date();
        weeklyAmounts.forEach((amount, index) => {
            const date = new Date(today);
            date.setDate(date.getDate() - (6 - index));
            const achieved = amount >= this.dailyGoal ? '달성' : '미달성';
            csvContent += `${weekDays[index]} (${date.toLocaleDateString()}),${amount},${achieved}\n`;
        });

        // CSV 다운로드
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `물섭취기록_${today.toISOString().slice(0, 10)}.csv`;
        link.click();

        this.showToast('주간 데이터가 CSV 파일로 다운로드되었습니다! 📊');
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let backgroundColor;
        switch (type) {
            case 'error':
                backgroundColor = '#f44336';
                break;
            case 'reminder':
                backgroundColor = '#FF9800';
                break;
            default:
                backgroundColor = 'linear-gradient(135deg, #00BCD4, #0097A7)';
        }

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 188, 212, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 300px;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, type === 'reminder' ? 5000 : 3000);
    }
}

// 전역 인스턴스 생성
const waterTracker = new WaterTracker();

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.05); }
        50% { transform: scale(1.1); }
        75% { transform: scale(1.05); }
    }
    
    @keyframes plusAnimation {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-50px);
        }
    }
`;
document.head.appendChild(style);

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    waterTracker.loadSettings();
    
    // 알림 권한 요청
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
