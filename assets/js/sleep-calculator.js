// 😴 수면 시간 계산기 JavaScript

class SleepCalculator {
    constructor() {
        this.currentMode = 'wakeup';
        this.bedtimeOption = 'now';
        this.fallAsleepTime = 15; // minutes
        this.sleepCycles = 5;
        this.ageGroup = 'adult';
        this.sleepQuality = 'average';
        this.cycleLength = 90; // minutes
        this.currentPlan = null;

        // 나이대별 권장 수면 시간 (분)
        this.recommendedSleep = {
            teen: { min: 480, max: 600 }, // 8-10시간
            adult: { min: 420, max: 540 }, // 7-9시간
            senior: { min: 420, max: 480 }  // 7-8시간
        };

        this.sleepTips = {
            bedtime: [
                { icon: '🌙', text: '잠들기 1시간 전부터 조명을 어둡게 해보세요.' },
                { icon: '📱', text: '전자기기 사용을 자제하고 블루라이트를 피하세요.' },
                { icon: '🛁', text: '따뜻한 샤워나 목욕으로 체온을 살짝 낮춰보세요.' },
                { icon: '📖', text: '가벼운 독서나 명상으로 마음을 진정시키세요.' },
                { icon: '☕', text: '카페인이나 무거운 음식 섭취를 피하세요.' }
            ],
            wakeup: [
                { icon: '🌅', text: '기상 후 즉시 밝은 빛에 노출되도록 하세요.' },
                { icon: '💧', text: '일어나자마자 물 한 잔으로 수분을 보충하세요.' },
                { icon: '🧘', text: '가벼운 스트레칭으로 몸을 깨워보세요.' },
                { icon: '⏰', text: '스누즈 버튼보다는 한 번에 일어나는 습관을 기르세요.' },
                { icon: '🌱', text: '규칙적인 기상 시간을 유지하세요.' }
            ],
            quality: {
                poor: [
                    { icon: '🌡️', text: '침실 온도를 18-20도로 유지하세요.' },
                    { icon: '🔇', text: '소음을 차단하거나 백색소음을 활용하세요.' },
                    { icon: '🛏️', text: '매트리스와 베개의 상태를 점검해보세요.' }
                ],
                average: [
                    { icon: '⏰', text: '일정한 수면 패턴을 유지하는 것이 중요합니다.' },
                    { icon: '🏃', text: '적당한 운동은 수면의 질을 향상시킵니다.' }
                ],
                good: [
                    { icon: '🎯', text: '현재의 좋은 수면 습관을 계속 유지하세요.' },
                    { icon: '📊', text: '수면 패턴을 기록하여 더욱 최적화해보세요.' }
                ]
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.loadSettings();
        this.loadSleepLog();
    }

    setupEventListeners() {
        // 모드 선택
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentMode = e.currentTarget.dataset.mode;
                this.switchMode();
            });
        });

        // 잠들 시간 옵션
        document.querySelectorAll('.bedtime-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.bedtime-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.bedtimeOption = e.currentTarget.dataset.bedtime;
                this.toggleCustomBedtime();
            });
        });

        // 설정 변경
        document.getElementById('fallAsleepTime').addEventListener('change', (e) => {
            this.fallAsleepTime = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('sleepCycles').addEventListener('change', (e) => {
            this.sleepCycles = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('ageGroup').addEventListener('change', (e) => {
            this.ageGroup = e.target.value;
            this.saveSettings();
        });

        document.getElementById('sleepQuality').addEventListener('change', (e) => {
            this.sleepQuality = e.target.value;
            this.saveSettings();
        });

        // 계산 버튼
        document.getElementById('calculateSleep').addEventListener('click', () => {
            this.calculateOptimalSleep();
        });

        // 결과 액션 버튼들
        document.getElementById('savePlan').addEventListener('click', () => {
            this.saveSleepPlan();
        });

        document.getElementById('sharePlan').addEventListener('click', () => {
            this.shareSleepPlan();
        });

        document.getElementById('setAlarm').addEventListener('click', () => {
            this.setAlarmReminder();
        });

        // 로그 삭제
        document.getElementById('clearSleepLog').addEventListener('click', () => {
            this.clearSleepLog();
        });
    }

    setDefaultDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('wakeupDate').value = tomorrow.toISOString().split('T')[0];
    }

    switchMode() {
        document.querySelectorAll('.input-mode').forEach(mode => {
            mode.classList.remove('active');
        });
        
        document.getElementById(`${this.currentMode}Mode`).classList.add('active');
    }

    toggleCustomBedtime() {
        const customInput = document.getElementById('customBedtimeInput');
        if (this.bedtimeOption === 'custom') {
            customInput.style.display = 'block';
            this.setCurrentTimeAsBedtime();
        } else {
            customInput.style.display = 'none';
        }
    }

    setCurrentTimeAsBedtime() {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        document.getElementById('bedTime').value = timeString;
    }

    calculateOptimalSleep() {
        if (this.currentMode === 'wakeup') {
            this.calculateFromWakeupTime();
        } else {
            this.calculateFromBedtime();
        }
    }

    calculateFromWakeupTime() {
        const wakeupTime = document.getElementById('wakeupTime').value;
        const wakeupDate = document.getElementById('wakeupDate').value;

        if (!wakeupTime || !wakeupDate) {
            this.showToast('기상 시간과 날짜를 모두 입력해주세요!', 'error');
            return;
        }

        const wakeupDateTime = new Date(`${wakeupDate}T${wakeupTime}`);
        
        // 수면 주기와 잠들기까지 걸리는 시간을 고려
        const sleepDurationMinutes = this.sleepCycles * this.cycleLength;
        const totalTimeNeeded = sleepDurationMinutes + this.fallAsleepTime;

        const bedtime = new Date(wakeupDateTime.getTime() - totalTimeNeeded * 60000);

        this.currentPlan = {
            mode: 'wakeup',
            bedtime: bedtime,
            wakeupTime: wakeupDateTime,
            sleepDuration: sleepDurationMinutes,
            cycles: this.sleepCycles,
            fallAsleepTime: this.fallAsleepTime
        };

        this.displaySleepPlan();
    }

    calculateFromBedtime() {
        let bedtime;
        
        if (this.bedtimeOption === 'now') {
            bedtime = new Date();
        } else {
            const bedTimeValue = document.getElementById('bedTime').value;
            if (!bedTimeValue) {
                this.showToast('잠들 시간을 입력해주세요!', 'error');
                return;
            }
            
            const today = new Date();
            const [hours, minutes] = bedTimeValue.split(':');
            bedtime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
            
            // 만약 입력된 시간이 현재 시간보다 이르다면 다음날로 설정
            if (bedtime < today) {
                bedtime.setDate(bedtime.getDate() + 1);
            }
        }

        // 실제 잠들 시간 계산
        const sleepStartTime = new Date(bedtime.getTime() + this.fallAsleepTime * 60000);
        
        // 수면 주기를 고려한 최적 기상 시간들 계산
        const wakeupOptions = [];
        for (let cycles = 4; cycles <= 6; cycles++) {
            const wakeupTime = new Date(sleepStartTime.getTime() + cycles * this.cycleLength * 60000);
            wakeupOptions.push({
                cycles: cycles,
                wakeupTime: wakeupTime,
                sleepDuration: cycles * this.cycleLength
            });
        }

        // 권장 주기 선택
        const optimalOption = wakeupOptions.find(option => option.cycles === this.sleepCycles) || wakeupOptions[1];

        this.currentPlan = {
            mode: 'bedtime',
            bedtime: bedtime,
            wakeupTime: optimalOption.wakeupTime,
            sleepDuration: optimalOption.sleepDuration,
            cycles: optimalOption.cycles,
            fallAsleepTime: this.fallAsleepTime,
            alternatives: wakeupOptions
        };

        this.displaySleepPlan();
    }

    displaySleepPlan() {
        const plan = this.currentPlan;
        
        // 환영 카드 숨기기
        document.getElementById('welcomeCard').style.display = 'none';

        // 제목 설정
        const title = plan.mode === 'wakeup' ? '기상 시간 기준 수면 계획' : '잠들 시간 기준 수면 계획';
        document.getElementById('resultTitle').textContent = `💤 ${title}`;

        // 타임라인 생성
        this.createSleepTimeline(plan);

        // 분석 카드 업데이트
        this.updateAnalysisCards(plan);

        // 대안 시간 생성
        this.createAlternatives(plan);

        // 개인화된 팁 생성
        this.generatePersonalizedTips(plan);

        // 결과 섹션 표시
        document.getElementById('sleepResult').style.display = 'block';

        // 부드러운 스크롤
        document.getElementById('sleepResult').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    createSleepTimeline(plan) {
        const container = document.getElementById('sleepTimeline');
        container.innerHTML = '';

        const sleepStartTime = new Date(plan.bedtime.getTime() + plan.fallAsleepTime * 60000);
        
        const timelineItems = [
            {
                icon: '🛏️',
                title: '잠자리에 들기',
                time: this.formatTime(plan.bedtime),
                desc: `${plan.fallAsleepTime}분 후 잠들 예정`
            },
            {
                icon: '💤',
                title: '수면 시작',
                time: this.formatTime(sleepStartTime),
                desc: `${plan.cycles}주기 수면 시작`
            },
            {
                icon: '🌅',
                title: '최적 기상 시간',
                time: this.formatTime(plan.wakeupTime),
                desc: `총 ${Math.floor(plan.sleepDuration / 60)}시간 ${plan.sleepDuration % 60}분 수면`
            }
        ];

        timelineItems.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-marker">${item.icon}</div>
                <div class="timeline-content">
                    <div class="timeline-title">${item.title}</div>
                    <div class="timeline-time">${item.time}</div>
                    <div class="timeline-desc">${item.desc}</div>
                </div>
            `;
            
            container.appendChild(timelineItem);
        });
    }

    updateAnalysisCards(plan) {
        document.getElementById('optimalBedtime').textContent = this.formatTime(plan.bedtime);
        document.getElementById('optimalWakeup').textContent = this.formatTime(plan.wakeupTime);
        
        const totalHours = Math.floor(plan.sleepDuration / 60);
        const totalMinutes = plan.sleepDuration % 60;
        document.getElementById('totalSleepTime').textContent = `${totalHours}시간 ${totalMinutes > 0 ? totalMinutes + '분' : ''}`;
        
        document.getElementById('cycleCount').textContent = `${plan.cycles}주기`;
    }

    createAlternatives(plan) {
        const container = document.getElementById('alternativeTimes');
        container.innerHTML = '';

        if (plan.mode === 'wakeup') {
            // 기상 시간 기준 - 다른 주기 옵션들
            const alternatives = [4, 5, 6].filter(cycles => cycles !== plan.cycles);
            
            alternatives.forEach(cycles => {
                const sleepDuration = cycles * this.cycleLength;
                const bedtime = new Date(plan.wakeupTime.getTime() - (sleepDuration + plan.fallAsleepTime) * 60000);
                
                const altItem = document.createElement('div');
                altItem.className = 'alternative-item';
                altItem.innerHTML = `
                    <div class="alternative-time">${this.formatTime(bedtime)}</div>
                    <div class="alternative-desc">${cycles}주기 (${Math.floor(sleepDuration / 60)}시간 ${sleepDuration % 60}분)</div>
                `;
                
                altItem.addEventListener('click', () => {
                    this.applyAlternative('bedtime', bedtime, cycles, sleepDuration);
                });
                
                container.appendChild(altItem);
            });
        } else {
            // 잠들 시간 기준 - 대안 기상 시간들
            plan.alternatives.filter(alt => alt.cycles !== plan.cycles).forEach(alt => {
                const altItem = document.createElement('div');
                altItem.className = 'alternative-item';
                altItem.innerHTML = `
                    <div class="alternative-time">${this.formatTime(alt.wakeupTime)}</div>
                    <div class="alternative-desc">${alt.cycles}주기 (${Math.floor(alt.sleepDuration / 60)}시간 ${alt.sleepDuration % 60}분)</div>
                `;
                
                altItem.addEventListener('click', () => {
                    this.applyAlternative('wakeup', alt.wakeupTime, alt.cycles, alt.sleepDuration);
                });
                
                container.appendChild(altItem);
            });
        }
    }

    applyAlternative(type, time, cycles, duration) {
        if (type === 'bedtime') {
            this.currentPlan.bedtime = time;
        } else {
            this.currentPlan.wakeupTime = time;
        }
        
        this.currentPlan.cycles = cycles;
        this.currentPlan.sleepDuration = duration;
        
        this.displaySleepPlan();
        this.showToast('대안 시간이 적용되었습니다! ⏰');
    }

    generatePersonalizedTips(plan) {
        const container = document.getElementById('personalizedTips');
        container.innerHTML = '';

        const tips = [];
        
        // 잠들기까지 시간에 따른 팁
        if (plan.fallAsleepTime > 20) {
            tips.push({ icon: '🧘', text: '잠들기까지 시간이 오래 걸리시네요. 취침 전 명상이나 이완 요법을 시도해보세요.' });
        }

        // 수면 품질에 따른 팁
        if (this.sleepQuality === 'poor') {
            tips.push(...this.sleepTips.quality.poor);
        } else if (this.sleepQuality === 'average') {
            tips.push(...this.sleepTips.quality.average);
        } else {
            tips.push(...this.sleepTips.quality.good);
        }

        // 수면 주기에 따른 팁
        if (plan.cycles < 5) {
            tips.push({ icon: '⚠️', text: '수면 시간이 다소 짧습니다. 가능하면 5-6주기를 목표로 해보세요.' });
        }

        // 시간대별 팁
        const bedHour = plan.bedtime.getHours();
        if (bedHour > 23 || bedHour < 2) {
            tips.push({ icon: '🌙', text: '늦은 시간 취침이네요. 가능하면 11시 이전 취침을 권장합니다.' });
        }

        // 기본 팁 추가
        tips.push(...this.sleepTips.bedtime.slice(0, 2));
        tips.push(...this.sleepTips.wakeup.slice(0, 2));

        // 중복 제거 및 최대 8개까지만 표시
        const uniqueTips = tips.slice(0, 8);

        uniqueTips.forEach(tip => {
            const tipItem = document.createElement('div');
            tipItem.className = 'tip-item';
            tipItem.innerHTML = `
                <div class="tip-icon">${tip.icon}</div>
                <div class="tip-text">${tip.text}</div>
            `;
            container.appendChild(tipItem);
        });
    }

    saveSleepPlan() {
        if (!this.currentPlan) return;

        const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
        
        const record = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            plan: this.currentPlan,
            settings: {
                fallAsleepTime: this.fallAsleepTime,
                sleepCycles: this.sleepCycles,
                ageGroup: this.ageGroup,
                sleepQuality: this.sleepQuality
            },
            timestamp: new Date().toISOString()
        };

        sleepLog.unshift(record);
        
        // 최대 20개까지만 저장
        if (sleepLog.length > 20) {
            sleepLog.splice(20);
        }

        localStorage.setItem('sleepLog', JSON.stringify(sleepLog));
        this.loadSleepLog();
        this.showToast('수면 계획이 저장되었습니다! 😴');
    }

    loadSleepLog() {
        const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
        const container = document.getElementById('sleepLog');

        if (sleepLog.length === 0) {
            container.innerHTML = `
                <div class="empty-log">
                    <div class="empty-icon">😴</div>
                    <p>아직 수면 계획 기록이 없습니다.<br>첫 번째 수면 계획을 세워보세요!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        sleepLog.forEach(record => {
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            
            const bedtime = new Date(record.plan.bedtime);
            const wakeupTime = new Date(record.plan.wakeupTime);
            
            logItem.innerHTML = `
                <div class="log-header">
                    <span class="log-date">${record.date}</span>
                    <button class="log-delete" onclick="sleepCalculator.deleteSleepLog(${record.id})">🗑️</button>
                </div>
                <div class="log-summary">
                    <span>취침: ${this.formatTime(bedtime)}</span>
                    <span>기상: ${this.formatTime(wakeupTime)}</span>
                </div>
            `;
            
            // 클릭시 해당 계획으로 복원
            logItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('log-delete')) {
                    this.restoreFromLog(record);
                }
            });
            
            container.appendChild(logItem);
        });
    }

    deleteSleepLog(id) {
        const sleepLog = JSON.parse(localStorage.getItem('sleepLog') || '[]');
        const filteredLog = sleepLog.filter(record => record.id !== id);
        localStorage.setItem('sleepLog', JSON.stringify(filteredLog));
        this.loadSleepLog();
        this.showToast('기록이 삭제되었습니다.');
    }

    restoreFromLog(record) {
        // 설정 복원
        this.fallAsleepTime = record.settings.fallAsleepTime;
        this.sleepCycles = record.settings.sleepCycles;
        this.ageGroup = record.settings.ageGroup;
        this.sleepQuality = record.settings.sleepQuality;

        // UI 업데이트
        document.getElementById('fallAsleepTime').value = this.fallAsleepTime;
        document.getElementById('sleepCycles').value = this.sleepCycles;
        document.getElementById('ageGroup').value = this.ageGroup;
        document.getElementById('sleepQuality').value = this.sleepQuality;

        // 계획 복원
        this.currentPlan = {
            ...record.plan,
            bedtime: new Date(record.plan.bedtime),
            wakeupTime: new Date(record.plan.wakeupTime)
        };

        this.displaySleepPlan();
        this.showToast('수면 계획이 복원되었습니다! 😴');
    }

    clearSleepLog() {
        if (confirm('모든 수면 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('sleepLog');
            this.loadSleepLog();
            this.showToast('모든 기록이 삭제되었습니다.');
        }
    }

    shareSleepPlan() {
        if (!this.currentPlan) return;

        const plan = this.currentPlan;
        const shareText = `😴 나의 수면 계획\n\n` +
                         `🛏️ 잠자리: ${this.formatTime(plan.bedtime)}\n` +
                         `⏰ 기상: ${this.formatTime(plan.wakeupTime)}\n` +
                         `💤 총 수면: ${Math.floor(plan.sleepDuration / 60)}시간 ${plan.sleepDuration % 60}분\n` +
                         `🔄 수면 주기: ${plan.cycles}주기\n\n` +
                         `짭샵 수면 계산기로 최적의 수면 시간을 찾았어요!`;

        if (navigator.share) {
            navigator.share({
                title: '수면 계획',
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('수면 계획이 클립보드에 복사되었습니다! 📋');
            });
        }
    }

    setAlarmReminder() {
        if (!this.currentPlan) return;

        // 브라우저 알림 권한 요청
        if (Notification.permission === 'granted') {
            this.scheduleAlarmNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.scheduleAlarmNotification();
                }
            });
        } else {
            this.showToast('브라우저 알림 권한을 허용해주세요!', 'error');
        }
    }

    scheduleAlarmNotification() {
        const plan = this.currentPlan;
        const now = new Date();
        
        // 잠들 시간 30분 전 알림
        const bedtimeReminder = new Date(plan.bedtime.getTime() - 30 * 60000);
        if (bedtimeReminder > now) {
            const timeUntilReminder = bedtimeReminder.getTime() - now.getTime();
            setTimeout(() => {
                new Notification('😴 곧 잠들 시간입니다!', {
                    body: `30분 후 잠자리에 들 시간입니다. 준비를 시작하세요.`,
                    icon: '/favicon.ico'
                });
            }, timeUntilReminder);
            
            this.showToast(`${this.formatTime(bedtimeReminder)}에 취침 알림이 설정되었습니다! ⏰`);
        } else {
            this.showToast('취침 시간이 이미 지났거나 너무 가깝습니다.', 'error');
        }
    }

    saveSettings() {
        const settings = {
            fallAsleepTime: this.fallAsleepTime,
            sleepCycles: this.sleepCycles,
            ageGroup: this.ageGroup,
            sleepQuality: this.sleepQuality
        };
        
        localStorage.setItem('sleepSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('sleepSettings') || '{}');
        
        this.fallAsleepTime = settings.fallAsleepTime || 15;
        this.sleepCycles = settings.sleepCycles || 5;
        this.ageGroup = settings.ageGroup || 'adult';
        this.sleepQuality = settings.sleepQuality || 'average';
        
        // UI 업데이트
        document.getElementById('fallAsleepTime').value = this.fallAsleepTime;
        document.getElementById('sleepCycles').value = this.sleepCycles;
        document.getElementById('ageGroup').value = this.ageGroup;
        document.getElementById('sleepQuality').value = this.sleepQuality;
    }

    formatTime(date) {
        return date.toLocaleTimeString('ko-KR', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let backgroundColor;
        switch (type) {
            case 'error':
                backgroundColor = '#f44336';
                break;
            default:
                backgroundColor = 'linear-gradient(135deg, #673AB7, #3F51B5)';
        }

        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(103, 58, 183, 0.3);
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
        }, 3000);
    }
}

// 전역 인스턴스 생성
const sleepCalculator = new SleepCalculator();

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 알림 권한 요청
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
