// 🎯 목표 달성 계산기 JavaScript

class GoalCalculator {
    constructor() {
        this.savedGoals = JSON.parse(localStorage.getItem('savedGoals')) || [];
        this.currentGoal = null;
        this.selectedGoalId = null;
        
        this.goalPresets = {
            'emergency-fund': {
                type: 'money',
                title: '비상자금 1000만원',
                unit: '원',
                current: 0,
                target: 10000000,
                days: 365
            },
            'book-challenge': {
                type: 'book',
                title: '1년 50권 독서',
                unit: '권',
                current: 0,
                target: 50,
                days: 365
            },
            'weight-loss': {
                type: 'weight',
                title: '3개월 5kg 감량',
                unit: 'kg',
                current: 0,
                target: -5,
                days: 90
            },
            'study-time': {
                type: 'study',
                title: '자격증 준비 300시간',
                unit: '시간',
                current: 0,
                target: 300,
                days: 180
            },
            'vacation-fund': {
                type: 'money',
                title: '여행자금 300만원',
                unit: '원',
                current: 0,
                target: 3000000,
                days: 180
            },
            'fitness-goal': {
                type: 'exercise',
                title: '100일 운동 챌린지',
                unit: '일',
                current: 0,
                target: 100,
                days: 100
            }
        };
        
        this.goalTypeUnits = {
            money: '원',
            book: '권',
            exercise: '시간',
            study: '시간',
            weight: 'kg',
            saving: '원',
            custom: '단위'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupGoalTypeDefaults();
        this.renderSavedGoals();
        this.setDefaultDates();
        this.showNotification('목표 달성 계산기가 준비되었습니다! 🎯', 'success');
    }
    
    setupEventListeners() {
        // 목표 계산 폼
        document.getElementById('goalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateGoal();
        });
        
        // 목표 유형 변경 시 단위 자동 설정
        document.getElementById('goalType').addEventListener('change', (e) => {
            const unit = this.goalTypeUnits[e.target.value] || '단위';
            document.getElementById('goalUnit').value = unit;
        });
        
        // 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.loadPreset(preset);
            });
        });
        
        // 액션 버튼들
        document.getElementById('saveGoalBtn').addEventListener('click', () => {
            this.saveCurrentGoal();
        });
        
        document.getElementById('updateProgressBtn').addEventListener('click', () => {
            this.showProgressModal();
        });
        
        document.getElementById('shareGoalBtn').addEventListener('click', () => {
            this.shareGoal();
        });
        
        // 모달 관련
        document.getElementById('progressModal').addEventListener('click', (e) => {
            if (e.target.id === 'progressModal') {
                this.closeProgressModal();
            }
        });
        
        document.querySelector('.modal-close').addEventListener('click', () => {
            this.closeProgressModal();
        });
        
        document.getElementById('cancelUpdateBtn').addEventListener('click', () => {
            this.closeProgressModal();
        });
        
        document.getElementById('confirmUpdateBtn').addEventListener('click', () => {
            this.updateProgress();
        });
    }
    
    setupGoalTypeDefaults() {
        const goalType = document.getElementById('goalType');
        goalType.dispatchEvent(new Event('change'));
    }
    
    setDefaultDates() {
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 6); // 6개월 후
        
        document.getElementById('startDate').value = today.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }
    
    loadPreset(presetKey) {
        const preset = this.goalPresets[presetKey];
        if (!preset) return;
        
        document.getElementById('goalType').value = preset.type;
        document.getElementById('goalUnit').value = preset.unit;
        document.getElementById('currentAmount').value = preset.current;
        document.getElementById('targetAmount').value = preset.target;
        document.getElementById('goalTitle').value = preset.title;
        
        // 날짜 설정
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + preset.days);
        
        document.getElementById('startDate').value = today.toISOString().split('T')[0];
        document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
        
        this.showNotification(`프리셋 "${preset.title}"이 적용되었습니다!`, 'success');
    }
    
    calculateGoal() {
        const formData = {
            type: document.getElementById('goalType').value,
            unit: document.getElementById('goalUnit').value.trim(),
            current: parseFloat(document.getElementById('currentAmount').value),
            target: parseFloat(document.getElementById('targetAmount').value),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            title: document.getElementById('goalTitle').value.trim()
        };
        
        // 입력값 검증
        if (!this.validateGoalData(formData)) return;
        
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const today = new Date();
        
        // 기간 계산
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const remainingDays = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)) + 1);
        
        // 목표 계산
        const totalNeeded = formData.target - formData.current;
        const dailyTarget = totalNeeded / totalDays;
        const remainingTarget = formData.target - formData.current;
        const dailyRemainingTarget = remainingDays > 0 ? remainingTarget / remainingDays : 0;
        
        // 진행률 계산
        const progress = totalNeeded !== 0 ? Math.max(0, ((formData.current - (formData.current)) / totalNeeded) * 100) : 0;
        
        this.currentGoal = {
            id: Date.now().toString(),
            ...formData,
            totalDays,
            remainingDays,
            dailyTarget: Math.abs(dailyTarget),
            remainingTarget,
            progress: 0, // 시작 시점이므로 0%
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        this.displayResults();
        this.showNotification('목표가 계산되었습니다! 📊', 'success');
    }
    
    validateGoalData(data) {
        if (!data.unit) {
            this.showNotification('단위를 입력해주세요!', 'error');
            return false;
        }
        
        if (isNaN(data.current) || isNaN(data.target)) {
            this.showNotification('현재 상황과 목표를 숫자로 입력해주세요!', 'error');
            return false;
        }
        
        if (!data.startDate || !data.endDate) {
            this.showNotification('시작일과 목표일을 설정해주세요!', 'error');
            return false;
        }
        
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        if (endDate <= startDate) {
            this.showNotification('목표일은 시작일보다 늦어야 합니다!', 'error');
            return false;
        }
        
        if (data.current === data.target) {
            this.showNotification('이미 목표를 달성하셨네요! 🎉', 'success');
            return false;
        }
        
        return true;
    }
    
    displayResults() {
        const goal = this.currentGoal;
        const resultCard = document.getElementById('resultCard');
        
        // 결과 카드 표시
        resultCard.style.display = 'block';
        
        // 제목과 상태
        document.getElementById('resultTitle').textContent = 
            goal.title || `${goal.target}${goal.unit} 목표 달성 계획`;
        
        const statusBadge = document.getElementById('statusBadge');
        const today = new Date();
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        
        if (today < startDate) {
            statusBadge.textContent = '시작 전';
            statusBadge.className = 'status-badge planning';
        } else if (today <= endDate) {
            statusBadge.textContent = '진행 중';
            statusBadge.className = 'status-badge active';
        } else {
            statusBadge.textContent = '기한 만료';
            statusBadge.className = 'status-badge overdue';
        }
        
        // 주요 지표
        document.getElementById('dailyTarget').textContent = 
            this.formatNumber(goal.dailyTarget);
        document.getElementById('dailyTargetUnit').textContent = goal.unit;
        document.getElementById('remainingDays').textContent = goal.remainingDays;
        document.getElementById('remainingAmount').textContent = 
            this.formatNumber(Math.abs(goal.remainingTarget));
        document.getElementById('remainingAmountUnit').textContent = goal.unit;
        
        // 진행률
        document.getElementById('progressPercentage').textContent = `${Math.round(goal.progress)}%`;
        document.getElementById('progressFill').style.width = `${goal.progress}%`;
        document.getElementById('progressCurrent').textContent = this.formatNumber(goal.current);
        document.getElementById('progressTarget').textContent = this.formatNumber(goal.target);
        
        // 마일스톤 생성
        this.generateMilestones(goal);
        
        // 성취 팁 생성
        this.generateAchievementTips(goal);
        
        // 스크롤
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    generateMilestones(goal) {
        const container = document.getElementById('milestones');
        const milestones = [];
        
        const startDate = new Date(goal.startDate);
        const endDate = new Date(goal.endDate);
        const totalDays = goal.totalDays;
        const totalAmount = Math.abs(goal.target - goal.current);
        
        // 25%, 50%, 75%, 100% 마일스톤 생성
        [25, 50, 75, 100].forEach(percentage => {
            const targetDate = new Date(startDate);
            const daysToAdd = Math.round((totalDays * percentage) / 100);
            targetDate.setDate(startDate.getDate() + daysToAdd - 1);
            
            const targetAmount = goal.current + (totalAmount * percentage) / 100;
            const formattedDate = targetDate.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric'
            });
            
            milestones.push(`
                <div class="milestone-item">
                    <div class="milestone-date">${formattedDate}</div>
                    <div class="milestone-target">${percentage}% 달성: ${this.formatNumber(targetAmount)}${goal.unit}</div>
                    <div class="milestone-progress">${daysToAdd}일차</div>
                </div>
            `);
        });
        
        container.innerHTML = milestones.join('');
    }
    
    generateAchievementTips(goal) {
        const container = document.getElementById('achievementTips');
        const tips = [];
        
        // 목표 유형별 맞춤 팁
        const goalTips = {
            money: [
                '매일 고정 금액을 저축하는 습관을 만드세요',
                '가계부를 작성하여 불필요한 지출을 줄이세요',
                '목표 달성 시 자신에게 줄 보상을 미리 정해두세요'
            ],
            book: [
                '매일 일정한 시간에 독서하는 습관을 만드세요',
                '독서 목록을 미리 준비해두세요',
                '독서 후 간단한 감상문을 작성해보세요'
            ],
            exercise: [
                '운동 일지를 작성하여 진행상황을 기록하세요',
                '친구나 가족과 함께 운동 목표를 공유하세요',
                '작은 목표부터 시작하여 점차 늘려가세요'
            ],
            study: [
                '학습 계획표를 세우고 매일 체크하세요',
                '집중할 수 있는 환경을 조성하세요',
                '정기적으로 자신을 테스트해보세요'
            ],
            weight: [
                '식단 일기를 작성하여 식습관을 점검하세요',
                '규칙적인 운동 스케줄을 만드세요',
                '체중 변화를 주기적으로 기록하세요'
            ]
        };
        
        const specificTips = goalTips[goal.type] || [
            '매일 조금씩이라도 꾸준히 실천하세요',
            '진행상황을 정기적으로 점검하세요',
            '목표 달성을 위한 동기를 명확히 하세요'
        ];
        
        // 공통 팁 추가
        const commonTips = [
            '매일의 작은 성취를 인정하고 격려하세요',
            '어려움이 생기면 목표를 세분화해보세요'
        ];
        
        const allTips = [...specificTips, ...commonTips];
        
        allTips.forEach((tip, index) => {
            tips.push(`
                <div class="tip-item">
                    <div class="tip-icon">${index + 1}.</div>
                    <div class="tip-text">${tip}</div>
                </div>
            `);
        });
        
        container.innerHTML = tips.join('');
    }
    
    saveCurrentGoal() {
        if (!this.currentGoal) {
            this.showNotification('저장할 목표가 없습니다!', 'error');
            return;
        }
        
        // 중복 확인
        const existingGoal = this.savedGoals.find(g => 
            g.title === this.currentGoal.title && 
            g.startDate === this.currentGoal.startDate
        );
        
        if (existingGoal) {
            if (!confirm('같은 제목과 시작일의 목표가 이미 있습니다. 덮어쓰시겠습니까?')) {
                return;
            }
            // 기존 목표 업데이트
            Object.assign(existingGoal, this.currentGoal);
        } else {
            // 새 목표 추가
            this.savedGoals.push(this.currentGoal);
        }
        
        this.savesToLocalStorage();
        this.renderSavedGoals();
        this.showNotification('목표가 저장되었습니다! 💾', 'success');
    }
    
    showProgressModal() {
        if (!this.currentGoal) {
            this.showNotification('진행상황을 업데이트할 목표가 없습니다!', 'error');
            return;
        }
        
        document.getElementById('currentProgress').value = this.currentGoal.current;
        document.getElementById('progressNote').value = '';
        document.getElementById('progressModal').style.display = 'block';
    }
    
    updateProgress() {
        const newProgress = parseFloat(document.getElementById('currentProgress').value);
        const note = document.getElementById('progressNote').value.trim();
        
        if (isNaN(newProgress)) {
            this.showNotification('올바른 숫자를 입력해주세요!', 'error');
            return;
        }
        
        this.currentGoal.current = newProgress;
        this.currentGoal.lastUpdated = new Date().toISOString();
        
        if (note) {
            this.currentGoal.notes = this.currentGoal.notes || [];
            this.currentGoal.notes.push({
                date: new Date().toISOString(),
                text: note,
                value: newProgress
            });
        }
        
        // 진행률 재계산
        const totalNeeded = Math.abs(this.currentGoal.target - this.currentGoal.current);
        const totalAmount = Math.abs(this.currentGoal.target - parseFloat(document.getElementById('currentAmount').value));
        this.currentGoal.progress = totalAmount !== 0 ? 
            Math.min(100, Math.max(0, ((totalAmount - totalNeeded) / totalAmount) * 100)) : 100;
        
        this.displayResults();
        this.closeProgressModal();
        
        // 목표 달성 확인
        if (this.currentGoal.current >= this.currentGoal.target) {
            this.showNotification('🎉 축하합니다! 목표를 달성하셨네요!', 'success');
        } else {
            this.showNotification('진행상황이 업데이트되었습니다! 📊', 'success');
        }
    }
    
    closeProgressModal() {
        document.getElementById('progressModal').style.display = 'none';
    }
    
    shareGoal() {
        if (!this.currentGoal) {
            this.showNotification('공유할 목표가 없습니다!', 'error');
            return;
        }
        
        const goal = this.currentGoal;
        const shareText = `🎯 내 목표: ${goal.title || '목표 달성'}
        
📊 현재: ${this.formatNumber(goal.current)}${goal.unit}
🎯 목표: ${this.formatNumber(goal.target)}${goal.unit}
📅 기한: ${new Date(goal.endDate).toLocaleDateString('ko-KR')}
⏰ 매일 필요량: ${this.formatNumber(goal.dailyTarget)}${goal.unit}

짭샵 목표 달성 계산기로 계산했어요!`;
        
        if (navigator.share) {
            navigator.share({
                title: '내 목표 달성 계획',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('목표가 클립보드에 복사되었습니다! 📋', 'success');
            }).catch(() => {
                this.showNotification('공유 텍스트를 복사할 수 없습니다.', 'error');
            });
        }
    }
    
    renderSavedGoals() {
        const container = document.getElementById('savedGoalsList');
        
        if (this.savedGoals.length === 0) {
            container.innerHTML = `
                <div class="empty-goals">
                    <div class="empty-icon">🎯</div>
                    <p>아직 저장된 목표가 없습니다.<br>새로운 목표를 계산하고 저장해보세요!</p>
                </div>
            `;
            return;
        }
        
        const sortedGoals = [...this.savedGoals].sort((a, b) => 
            new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        
        container.innerHTML = sortedGoals.map(goal => `
            <div class="saved-goal-card" onclick="goalCalculator.loadSavedGoal('${goal.id}')">
                <div class="saved-goal-header">
                    <div class="saved-goal-title">
                        ${goal.title || `${goal.target}${goal.unit} 목표`}
                    </div>
                    <div class="saved-goal-progress">${Math.round(goal.progress)}%</div>
                </div>
                <div class="saved-goal-details">
                    <span>${this.formatNumber(goal.current)} / ${this.formatNumber(goal.target)}${goal.unit}</span>
                    <span>D-${this.calculateDaysRemaining(goal.endDate)}</span>
                </div>
            </div>
        `).join('');
    }
    
    loadSavedGoal(goalId) {
        const goal = this.savedGoals.find(g => g.id === goalId);
        if (!goal) return;
        
        this.currentGoal = goal;
        
        // 폼에 데이터 로드
        document.getElementById('goalType').value = goal.type;
        document.getElementById('goalUnit').value = goal.unit;
        document.getElementById('currentAmount').value = goal.current;
        document.getElementById('targetAmount').value = goal.target;
        document.getElementById('startDate').value = goal.startDate;
        document.getElementById('endDate').value = goal.endDate;
        document.getElementById('goalTitle').value = goal.title || '';
        
        this.displayResults();
        this.showNotification('저장된 목표를 불러왔습니다! 📂', 'success');
    }
    
    calculateDaysRemaining(endDate) {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    }
    
    formatNumber(num) {
        if (Math.abs(num) >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (Math.abs(num) >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    }
    
    showNotification(message, type = 'info') {
        // 기존 알림 제거
        const existingNotification = document.querySelector('.goal-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `goal-notification goal-notification-${type}`;
        
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
        
        // 4초 후 자동 제거
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
    
    savesToLocalStorage() {
        localStorage.setItem('savedGoals', JSON.stringify(this.savedGoals));
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.preset-btn.selected {
    border-color: #2196F3;
    background: #e3f2fd;
    transform: scale(1.05);
}

.saved-goal-card:hover {
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.goalCalculator = new GoalCalculator();
});
