// 📈 습관 트래커 JavaScript

class HabitTracker {
    constructor() {
        this.habits = JSON.parse(localStorage.getItem('habits')) || [];
        this.currentFilter = 'all';
        this.selectedHabitId = null;
        
        this.categoryEmojis = {
            health: '🏃',
            study: '📚',
            work: '💼',
            creative: '🎨',
            social: '👥',
            personal: '🌱',
            other: '🔄'
        };
        
        this.categoryNames = {
            health: '건강',
            study: '학습',
            work: '업무',
            creative: '창작',
            social: '인간관계',
            personal: '자기계발',
            other: '기타'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderHabits();
        this.updateOverallStats();
        this.showNotification('습관 트래커가 준비되었습니다! 📈', 'success');
    }
    
    setupEventListeners() {
        // 습관 추가 폼
        document.getElementById('habitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addHabit();
        });
        
        // 카테고리 필터
        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderHabits();
        });
        
        // 모달 관련
        document.getElementById('habitModal').addEventListener('click', (e) => {
            if (e.target.id === 'habitModal') {
                this.closeModal();
            }
        });
        
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('deleteHabitBtn').addEventListener('click', () => {
            this.deleteHabit();
        });
        
        document.getElementById('resetHabitBtn').addEventListener('click', () => {
            this.resetHabit();
        });
    }
    
    addHabit() {
        const name = document.getElementById('habitName').value.trim();
        const category = document.getElementById('habitCategory').value;
        const target = document.getElementById('habitTarget').value.trim();
        
        if (!name) {
            this.showNotification('습관명을 입력해주세요!', 'error');
            return;
        }
        
        const habit = {
            id: Date.now().toString(),
            name: name,
            category: category,
            target: target,
            completedDays: [],
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        this.habits.push(habit);
        this.saveHabits();
        this.renderHabits();
        this.updateOverallStats();
        
        // 폼 초기화
        document.getElementById('habitForm').reset();
        
        this.showNotification(`"${name}" 습관이 추가되었습니다! 🎯`, 'success');
    }
    
    toggleHabit(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const today = new Date().toISOString().split('T')[0];
        const isCompleted = habit.completedDays.includes(today);
        
        if (isCompleted) {
            habit.completedDays = habit.completedDays.filter(day => day !== today);
            this.showNotification('체크를 해제했습니다!', 'info');
        } else {
            habit.completedDays.push(today);
            habit.completedDays.sort();
            
            const dayCount = habit.completedDays.length;
            if (dayCount >= 66) {
                this.showNotification(`🎉 축하합니다! "${habit.name}" 습관을 완성했어요!`, 'success');
                habit.isActive = false;
            } else {
                this.showNotification(`${dayCount}/66일 달성! 👏`, 'success');
            }
        }
        
        this.saveHabits();
        this.renderHabits();
        this.updateOverallStats();
    }
    
    renderHabits() {
        const container = document.getElementById('habitsContainer');
        const filteredHabits = this.currentFilter === 'all' 
            ? this.habits 
            : this.habits.filter(h => h.category === this.currentFilter);
        
        if (filteredHabits.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🌱</div>
                    <h4>아직 습관이 없어요</h4>
                    <p>새로운 습관을 추가해서 66일 챌린지를 시작해보세요!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredHabits
            .sort((a, b) => b.isActive - a.isActive) // 활성 습관을 위로
            .map(habit => this.createHabitCard(habit))
            .join('');
        
        // 이벤트 리스너 추가
        filteredHabits.forEach(habit => {
            const card = document.querySelector(`[data-habit-id="${habit.id}"]`);
            const checkBtn = card.querySelector('.check-btn');
            
            checkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleHabit(habit.id);
            });
            
            card.addEventListener('click', () => {
                this.showHabitModal(habit.id);
            });
        });
    }
    
    createHabitCard(habit) {
        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = habit.completedDays.includes(today);
        const progress = Math.min((habit.completedDays.length / 66) * 100, 100);
        const currentStreak = this.calculateCurrentStreak(habit);
        const longestStreak = this.calculateLongestStreak(habit);
        
        const categoryEmoji = this.categoryEmojis[habit.category];
        const categoryName = this.categoryNames[habit.category];
        
        return `
            <div class="habit-card ${habit.isActive ? '' : 'completed'}" data-habit-id="${habit.id}">
                <div class="habit-card-header">
                    <div class="habit-info">
                        <h4>${habit.name}</h4>
                        <div class="habit-category">${categoryEmoji} ${categoryName}</div>
                        ${habit.target ? `<div class="habit-target">목표: ${habit.target}</div>` : ''}
                    </div>
                    <div class="habit-actions">
                        <button class="check-btn ${isCompletedToday ? 'completed' : ''}"
                                ${!habit.isActive ? 'disabled' : ''}>
                            ${isCompletedToday ? '✓' : ''}
                        </button>
                    </div>
                </div>
                
                <div class="habit-progress">
                    <div class="progress-info">
                        <div class="progress-text">
                            ${habit.completedDays.length} / 66일 완료
                        </div>
                        <div class="progress-percentage">${Math.round(progress)}%</div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                
                <div class="habit-streak">
                    <span class="streak-current">🔥 현재: ${currentStreak}일</span>
                    <span class="streak-best">⭐ 최고: ${longestStreak}일</span>
                </div>
            </div>
        `;
    }
    
    showHabitModal(habitId) {
        const habit = this.habits.find(h => h.id === habitId);
        if (!habit) return;
        
        this.selectedHabitId = habitId;
        const modal = document.getElementById('habitModal');
        
        // 모달 정보 업데이트
        document.getElementById('modalTitle').textContent = habit.name;
        document.getElementById('modalDayCount').textContent = habit.completedDays.length;
        document.getElementById('modalPercentage').textContent = `${Math.round((habit.completedDays.length / 66) * 100)}%`;
        document.getElementById('modalProgressFill').style.width = `${Math.min((habit.completedDays.length / 66) * 100, 100)}%`;
        
        // 통계 업데이트
        const currentStreak = this.calculateCurrentStreak(habit);
        const longestStreak = this.calculateLongestStreak(habit);
        const successRate = this.calculateSuccessRate(habit);
        
        document.getElementById('modalCurrentStreak').textContent = `${currentStreak}일`;
        document.getElementById('modalLongestStreak').textContent = `${longestStreak}일`;
        document.getElementById('modalSuccessRate').textContent = `${Math.round(successRate)}%`;
        
        // 캘린더 생성
        this.generateCalendar(habit);
        
        modal.style.display = 'block';
    }
    
    generateCalendar(habit) {
        const container = document.getElementById('modalCalendar');
        const today = new Date();
        const startDate = new Date(habit.createdAt);
        
        // 66일간의 캘린더 생성
        const days = [];
        for (let i = 0; i < 66; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            const isCompleted = habit.completedDays.includes(dateStr);
            const isToday = dateStr === today.toISOString().split('T')[0];
            const isFuture = date > today;
            
            let className = 'calendar-day';
            if (isCompleted) className += ' completed';
            if (isToday) className += ' today';
            if (isFuture) className += ' future';
            
            days.push(`
                <div class="${className}" title="${date.toLocaleDateString()}">
                    ${i + 1}
                </div>
            `);
        }
        
        container.innerHTML = days.join('');
    }
    
    calculateCurrentStreak(habit) {
        if (habit.completedDays.length === 0) return 0;
        
        const sortedDays = [...habit.completedDays].sort().reverse();
        const today = new Date().toISOString().split('T')[0];
        
        let streak = 0;
        let currentDate = new Date();
        
        // 오늘부터 역순으로 확인
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            
            if (!sortedDays.includes(dateStr)) {
                break;
            }
            
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    }
    
    calculateLongestStreak(habit) {
        if (habit.completedDays.length === 0) return 0;
        
        const sortedDays = [...habit.completedDays].sort();
        let longestStreak = 0;
        let currentStreak = 1;
        
        for (let i = 1; i < sortedDays.length; i++) {
            const prevDate = new Date(sortedDays[i-1]);
            const currentDate = new Date(sortedDays[i]);
            const diffDays = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
            
            if (diffDays === 1) {
                currentStreak++;
            } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
            }
        }
        
        return Math.max(longestStreak, currentStreak);
    }
    
    calculateSuccessRate(habit) {
        if (habit.completedDays.length === 0) return 0;
        
        const startDate = new Date(habit.createdAt);
        const today = new Date();
        const daysPassed = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const maxPossibleDays = Math.min(daysPassed, 66);
        
        return (habit.completedDays.length / maxPossibleDays) * 100;
    }
    
    updateOverallStats() {
        const activeHabits = this.habits.filter(h => h.isActive);
        const completedHabits = this.habits.filter(h => !h.isActive);
        
        // 활성 습관 수
        document.getElementById('totalHabits').textContent = activeHabits.length;
        
        // 최장 연속 기록
        const longestStreak = Math.max(0, ...this.habits.map(h => this.calculateLongestStreak(h)));
        document.getElementById('longestStreak').textContent = longestStreak;
        
        // 오늘 달성률
        const today = new Date().toISOString().split('T')[0];
        const todayCompleted = activeHabits.filter(h => h.completedDays.includes(today)).length;
        const todayCompletion = activeHabits.length > 0 ? Math.round((todayCompleted / activeHabits.length) * 100) : 0;
        document.getElementById('todayCompletion').textContent = `${todayCompletion}%`;
        
        // 완료된 습관 수
        document.getElementById('completedHabits').textContent = completedHabits.length;
    }
    
    deleteHabit() {
        if (!this.selectedHabitId) return;
        
        const habit = this.habits.find(h => h.id === this.selectedHabitId);
        if (!habit) return;
        
        if (confirm(`"${habit.name}" 습관을 삭제하시겠습니까?\n모든 진행상황이 사라집니다.`)) {
            this.habits = this.habits.filter(h => h.id !== this.selectedHabitId);
            this.saveHabits();
            this.renderHabits();
            this.updateOverallStats();
            this.closeModal();
            
            this.showNotification('습관이 삭제되었습니다.', 'info');
        }
    }
    
    resetHabit() {
        if (!this.selectedHabitId) return;
        
        const habit = this.habits.find(h => h.id === this.selectedHabitId);
        if (!habit) return;
        
        if (confirm(`"${habit.name}" 습관의 진행상황을 초기화하시겠습니까?`)) {
            habit.completedDays = [];
            habit.isActive = true;
            
            this.saveHabits();
            this.renderHabits();
            this.updateOverallStats();
            this.closeModal();
            
            this.showNotification('진행상황이 초기화되었습니다.', 'info');
        }
    }
    
    closeModal() {
        document.getElementById('habitModal').style.display = 'none';
        this.selectedHabitId = null;
    }
    
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.habit-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `habit-notification habit-notification-${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196F3'
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
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                    &times;
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
    
    saveHabits() {
        localStorage.setItem('habits', JSON.stringify(this.habits));
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.habit-card.completed {
    opacity: 0.7;
    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
}

.habit-card.completed::after {
    content: '🏆 완료됨';
    position: absolute;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
}

.habit-card.completed .check-btn {
    opacity: 0.5;
    cursor: not-allowed;
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.habitTracker = new HabitTracker();
});
