// 📅 D-Day 계산기 JavaScript

class DdayCalculator {
    constructor() {
        this.selectedEventType = 'celebration';
        this.selectedReminders = ['100', '30', '7', '1'];
        this.currentEvent = null;
        this.ddayList = [];
        this.countdownInterval = null;

        // 준비 제안 데이터
        this.preparationSuggestions = {
            celebration: {
                long: ['선물 준비하기', '레스토랑 예약하기', '파티 계획 세우기', '축하 카드 준비하기'],
                medium: ['케이크 주문하기', '장소 예약하기', '게스트 초대하기'],
                short: ['꽃 주문하기', '의상 준비하기', '사진 준비하기'],
                urgent: ['축하 메시지 준비', '마지막 점검', '기대감 갖기']
            },
            deadline: {
                long: ['학습 계획 세우기', '자료 수집하기', '스터디 그룹 만들기', '목표 설정하기'],
                medium: ['집중 공부하기', '모의고사 보기', '약점 보완하기'],
                short: ['최종 정리하기', '컨디션 조절하기', '준비물 챙기기'],
                urgent: ['마지막 복습', '일찍 잠자리에 들기', '자신감 갖기']
            },
            travel: {
                long: ['여행지 연구하기', '항공편 예약하기', '숙소 예약하기', '여권/비자 확인'],
                medium: ['여행용품 구입하기', '일정표 작성하기', '환전하기'],
                short: ['짐 준비하기', '여행 보험 가입', '날씨 확인하기'],
                urgent: ['최종 점검', '충전기 준비', '설렘 즐기기']
            },
            other: {
                long: ['목표 구체화하기', '계획 세우기', '준비물 리스트 작성'],
                medium: ['단계별 준비하기', '진행상황 점검하기'],
                short: ['마지막 준비하기', '컨디션 관리하기'],
                urgent: ['최종 확인', '긍정적 마인드', '준비 완료']
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDdayList();
        this.setDefaultDate();
        this.startRealtimeUpdate();
    }

    setupEventListeners() {
        // 이벤트 타입 선택
        document.querySelectorAll('.event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.event-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.selectedEventType = e.currentTarget.dataset.type;
            });
        });

        // 알림 설정
        document.querySelectorAll('input[name="reminder"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.selectedReminders = Array.from(document.querySelectorAll('input[name="reminder"]:checked'))
                    .map(cb => cb.value);
            });
        });

        // D-Day 계산 버튼
        document.getElementById('calculateDday').addEventListener('click', () => {
            this.calculateDday();
        });

        // 목록에 추가 버튼
        document.getElementById('addToDdayList').addEventListener('click', () => {
            this.addToList();
        });

        // 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.applyPreset(preset);
            });
        });

        // 생일 설정
        document.getElementById('setBirthday').addEventListener('click', () => {
            this.setBirthdayDday();
        });

        // 결과 액션 버튼들
        document.getElementById('saveDday').addEventListener('click', () => {
            this.saveDday();
        });

        document.getElementById('shareDday').addEventListener('click', () => {
            this.shareDday();
        });

        document.getElementById('resetDday').addEventListener('click', () => {
            this.resetDday();
        });

        // D-Day 목록 관리
        document.getElementById('sortDdayList').addEventListener('click', () => {
            this.sortDdayList();
        });

        document.getElementById('clearDdayList').addEventListener('click', () => {
            this.clearDdayList();
        });
    }

    setDefaultDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formattedDate = tomorrow.toISOString().split('T')[0];
        document.getElementById('targetDate').value = formattedDate;
    }

    calculateDday() {
        const eventName = document.getElementById('eventName').value.trim();
        const targetDate = document.getElementById('targetDate').value;
        const eventNote = document.getElementById('eventNote').value.trim();

        if (!eventName) {
            this.showToast('이벤트 이름을 입력해주세요!', 'error');
            return;
        }

        if (!targetDate) {
            this.showToast('목표 날짜를 선택해주세요!', 'error');
            return;
        }

        const target = new Date(targetDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        target.setHours(0, 0, 0, 0);

        this.currentEvent = {
            name: eventName,
            date: targetDate,
            type: this.selectedEventType,
            reminders: this.selectedReminders,
            note: eventNote,
            target: target,
            today: today
        };

        this.displayDdayResult();
    }

    displayDdayResult() {
        const event = this.currentEvent;
        const diffTime = event.target - event.today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 환영 카드 숨기기
        document.getElementById('welcomeCard').style.display = 'none';

        // 결과 제목
        document.getElementById('resultTitle').textContent = `📊 ${event.name} D-Day`;

        // 이벤트 정보 업데이트
        document.getElementById('displayEventName').textContent = event.name;
        document.getElementById('displayEventDate').textContent = this.formatDate(event.target);

        // D-Day 번호와 상태
        let ddayText, statusText, statusClass;
        
        if (diffDays > 0) {
            ddayText = `D-${diffDays}`;
            statusText = `앞으로 ${diffDays}일 남았습니다`;
            statusClass = 'upcoming';
        } else if (diffDays === 0) {
            ddayText = 'D-DAY';
            statusText = '오늘이 바로 그 날입니다!';
            statusClass = 'today';
        } else {
            ddayText = `D+${Math.abs(diffDays)}`;
            statusText = `${Math.abs(diffDays)}일 지났습니다`;
            statusClass = 'past';
        }

        document.getElementById('ddayNumber').textContent = ddayText;
        document.getElementById('ddayStatus').textContent = statusText;

        // 진행률 계산 (1년 기준)
        const yearAgo = new Date(event.today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        const totalTime = event.target - yearAgo;
        const elapsedTime = event.today - yearAgo;
        const progress = Math.max(0, Math.min(100, (elapsedTime / totalTime) * 100));

        document.getElementById('progressBar').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${progress.toFixed(1)}% 지났습니다`;

        // 상세 카운트다운
        this.updateDetailedCountdown();

        // 오늘 날짜 표시
        document.getElementById('todayDate').textContent = this.formatDate(event.today);
        document.getElementById('targetDateDisplay').textContent = this.formatDate(event.target);

        // 알림 타임라인 생성
        this.generateReminderTimeline();

        // 준비 제안 생성
        this.generatePreparationSuggestions();

        // 목록에 추가 버튼 표시
        document.getElementById('addToDdayList').style.display = 'block';

        // 결과 섹션 표시
        document.getElementById('ddayResult').style.display = 'block';

        // 부드러운 스크롤
        document.getElementById('ddayResult').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });

        // 실시간 업데이트 시작
        this.startDetailedCountdown();
    }

    updateDetailedCountdown() {
        const event = this.currentEvent;
        if (!event) return;

        const now = new Date();
        const target = new Date(event.target);
        target.setHours(23, 59, 59, 999); // 목표일 마지막 시각

        const diff = target - now;

        if (diff <= 0) {
            // 목표일이 지났을 때
            document.getElementById('yearsLeft').textContent = '0';
            document.getElementById('monthsLeft').textContent = '0';
            document.getElementById('daysLeft').textContent = '0';
            document.getElementById('hoursLeft').textContent = '0';
            document.getElementById('minutesLeft').textContent = '0';
            document.getElementById('secondsLeft').textContent = '0';
            return;
        }

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('yearsLeft').textContent = years;
        document.getElementById('monthsLeft').textContent = months;
        document.getElementById('daysLeft').textContent = days;
        document.getElementById('hoursLeft').textContent = hours;
        document.getElementById('minutesLeft').textContent = minutes;
        document.getElementById('secondsLeft').textContent = seconds;
    }

    startDetailedCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = setInterval(() => {
            this.updateDetailedCountdown();
        }, 1000);
    }

    startRealtimeUpdate() {
        // 매분마다 D-Day 목록 업데이트
        setInterval(() => {
            this.updateDdayListDisplay();
        }, 60000);
    }

    generateReminderTimeline() {
        const container = document.getElementById('reminderTimeline');
        const event = this.currentEvent;
        
        container.innerHTML = '';

        if (!event.reminders || event.reminders.length === 0) return;

        event.reminders.forEach(days => {
            const reminderDate = new Date(event.target);
            reminderDate.setDate(reminderDate.getDate() - parseInt(days));

            const reminderItem = document.createElement('div');
            reminderItem.className = 'reminder-item timeline-item';
            
            reminderItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-title">${days}일 전 알림</div>
                    <div class="timeline-date">${this.formatDate(reminderDate)}</div>
                </div>
            `;
            
            container.appendChild(reminderItem);
        });
    }

    generatePreparationSuggestions() {
        const container = document.getElementById('preparationSuggestions');
        const event = this.currentEvent;
        
        const diffTime = event.target - event.today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let suggestionType;
        if (diffDays > 100) suggestionType = 'long';
        else if (diffDays > 30) suggestionType = 'medium';
        else if (diffDays > 7) suggestionType = 'short';
        else suggestionType = 'urgent';

        const suggestions = this.preparationSuggestions[event.type][suggestionType] || [];

        container.innerHTML = '';
        suggestions.forEach(suggestion => {
            const card = document.createElement('div');
            card.className = 'suggestion-card';
            card.innerHTML = `
                <div class="suggestion-title">${suggestion}</div>
                <div class="suggestion-desc">${this.getSuggestionDescription(suggestion, diffDays)}</div>
            `;
            container.appendChild(card);
        });
    }

    getSuggestionDescription(suggestion, daysLeft) {
        const descriptions = {
            '선물 준비하기': `${daysLeft}일 전이니 충분한 시간을 가지고 의미있는 선물을 골라보세요.`,
            '학습 계획 세우기': `${daysLeft}일 동안 체계적으로 준비할 수 있는 계획을 세워보세요.`,
            '여행지 연구하기': `${daysLeft}일 후 떠날 여행지에 대해 자세히 알아보세요.`,
            '마지막 복습': '이제 얼마 남지 않았으니 핵심 내용을 다시 한번 점검해보세요.',
            '충전기 준비': '여행에 필요한 필수품들을 미리 준비해두세요.',
            '기대감 갖기': '특별한 날이 다가오고 있어요. 설렘을 즐기세요!'
        };
        
        return descriptions[suggestion] || `${daysLeft}일 후를 위해 미리 준비해보세요.`;
    }

    applyPreset(preset) {
        const today = new Date();
        let targetDate, eventName;

        switch (preset) {
            case 'birthday':
                document.getElementById('birthdayCard').style.display = 'block';
                return;
                
            case 'newyear':
                targetDate = new Date(today.getFullYear() + 1, 0, 1);
                eventName = '새해';
                this.selectedEventType = 'celebration';
                break;
                
            case 'christmas':
                targetDate = new Date(today.getFullYear(), 11, 25);
                if (targetDate <= today) {
                    targetDate.setFullYear(targetDate.getFullYear() + 1);
                }
                eventName = '크리스마스';
                this.selectedEventType = 'celebration';
                break;
                
            case 'valentine':
                targetDate = new Date(today.getFullYear(), 1, 14);
                if (targetDate <= today) {
                    targetDate.setFullYear(targetDate.getFullYear() + 1);
                }
                eventName = '발렌타인데이';
                this.selectedEventType = 'celebration';
                break;
        }

        if (targetDate && eventName) {
            document.getElementById('eventName').value = eventName;
            document.getElementById('targetDate').value = targetDate.toISOString().split('T')[0];
            
            // 이벤트 타입 버튼 업데이트
            document.querySelectorAll('.event-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.type === this.selectedEventType) {
                    btn.classList.add('active');
                }
            });

            this.showToast(`${eventName} D-Day가 설정되었습니다! 🎉`);
        }
    }

    setBirthdayDday() {
        const birthDate = document.getElementById('birthDate').value;
        
        if (!birthDate) {
            this.showToast('생년월일을 입력해주세요!', 'error');
            return;
        }

        const today = new Date();
        const birth = new Date(birthDate);
        const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
        
        if (nextBirthday <= today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }

        const age = nextBirthday.getFullYear() - birth.getFullYear();

        document.getElementById('eventName').value = `${age}번째 생일`;
        document.getElementById('targetDate').value = nextBirthday.toISOString().split('T')[0];
        
        this.selectedEventType = 'celebration';
        document.querySelectorAll('.event-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === 'celebration') {
                btn.classList.add('active');
            }
        });

        document.getElementById('birthdayCard').style.display = 'none';
        this.showToast(`${age}번째 생일 D-Day가 설정되었습니다! 🎂`);
    }

    addToList() {
        if (!this.currentEvent) return;

        const ddayItem = {
            id: Date.now(),
            name: this.currentEvent.name,
            date: this.currentEvent.date,
            type: this.currentEvent.type,
            note: this.currentEvent.note,
            reminders: this.currentEvent.reminders,
            createdAt: new Date().toISOString()
        };

        this.ddayList.unshift(ddayItem);
        this.saveDdayList();
        this.updateDdayListDisplay();
        this.showToast('D-Day가 목록에 추가되었습니다! 📝');
    }

    updateDdayListDisplay() {
        const container = document.getElementById('ddayList');
        
        if (this.ddayList.length === 0) {
            container.innerHTML = `
                <div class="empty-list">
                    <div class="empty-icon">📅</div>
                    <p>아직 등록된 D-Day가 없습니다.<br>중요한 날을 추가해보세요!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        this.ddayList.forEach(item => {
            const itemElement = this.createDdayListItem(item);
            container.appendChild(itemElement);
        });
    }

    createDdayListItem(item) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(item.date);
        targetDate.setHours(0, 0, 0, 0);
        
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let ddayText, statusClass;
        if (diffDays > 0) {
            ddayText = `D-${diffDays}`;
            statusClass = diffDays <= 7 ? 'urgent' : diffDays <= 30 ? 'soon' : 'normal';
        } else if (diffDays === 0) {
            ddayText = 'D-DAY';
            statusClass = 'urgent';
        } else {
            ddayText = `D+${Math.abs(diffDays)}`;
            statusClass = 'normal';
        }

        const itemElement = document.createElement('div');
        itemElement.className = `dday-item ${statusClass}`;
        
        itemElement.innerHTML = `
            <div class="dday-item-header">
                <div class="dday-item-name">${item.name}</div>
                <div class="dday-item-actions">
                    <button class="dday-action-btn" onclick="ddayCalculator.editDdayItem(${item.id})" title="편집">✏️</button>
                    <button class="dday-action-btn" onclick="ddayCalculator.deleteDdayItem(${item.id})" title="삭제">🗑️</button>
                </div>
            </div>
            <div class="dday-item-info">
                <div class="dday-item-date">${this.formatDate(targetDate)}</div>
                <div class="dday-item-counter ${statusClass}">${ddayText}</div>
            </div>
            ${item.note ? `<div class="dday-item-note">${item.note}</div>` : ''}
        `;

        // 클릭시 해당 D-Day로 계산
        itemElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('dday-action-btn')) {
                this.loadDdayFromList(item);
            }
        });

        return itemElement;
    }

    loadDdayFromList(item) {
        document.getElementById('eventName').value = item.name;
        document.getElementById('targetDate').value = item.date;
        document.getElementById('eventNote').value = item.note || '';

        // 이벤트 타입 설정
        this.selectedEventType = item.type;
        document.querySelectorAll('.event-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === item.type) {
                btn.classList.add('active');
            }
        });

        // 알림 설정
        document.querySelectorAll('input[name="reminder"]').forEach(cb => {
            cb.checked = item.reminders?.includes(cb.value);
        });
        this.selectedReminders = item.reminders || [];

        // 자동으로 계산 실행
        this.calculateDday();
        this.showToast('D-Day가 로드되었습니다! 📅');
    }

    editDdayItem(id) {
        const item = this.ddayList.find(d => d.id === id);
        if (item) {
            this.loadDdayFromList(item);
        }
    }

    deleteDdayItem(id) {
        if (confirm('이 D-Day를 삭제하시겠습니까?')) {
            this.ddayList = this.ddayList.filter(item => item.id !== id);
            this.saveDdayList();
            this.updateDdayListDisplay();
            this.showToast('D-Day가 삭제되었습니다.');
        }
    }

    sortDdayList() {
        this.ddayList.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        this.saveDdayList();
        this.updateDdayListDisplay();
        this.showToast('D-Day 목록이 날짜순으로 정렬되었습니다.');
    }

    clearDdayList() {
        if (confirm('모든 D-Day 목록을 삭제하시겠습니까?')) {
            this.ddayList = [];
            this.saveDdayList();
            this.updateDdayListDisplay();
            this.showToast('모든 D-Day가 삭제되었습니다.');
        }
    }

    saveDday() {
        if (!this.currentEvent) return;
        this.addToList();
    }

    shareDday() {
        if (!this.currentEvent) return;

        const event = this.currentEvent;
        const diffTime = event.target - event.today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let ddayText;
        if (diffDays > 0) {
            ddayText = `D-${diffDays} (${diffDays}일 남음)`;
        } else if (diffDays === 0) {
            ddayText = 'D-DAY (오늘!)';
        } else {
            ddayText = `D+${Math.abs(diffDays)} (${Math.abs(diffDays)}일 지남)`;
        }

        const shareText = `📅 ${event.name} ${ddayText}\n` +
                         `📆 ${this.formatDate(event.target)}\n\n` +
                         `${event.note ? `📝 ${event.note}\n\n` : ''}` +
                         `짭샵 D-Day 계산기로 계산했어요!`;

        if (navigator.share) {
            navigator.share({
                title: `${event.name} D-Day`,
                text: shareText
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('D-Day 정보가 클립보드에 복사되었습니다! 📋');
            });
        }
    }

    resetDday() {
        if (confirm('D-Day 계산을 초기화하시겠습니까?')) {
            // 폼 초기화
            document.getElementById('eventName').value = '';
            document.getElementById('eventNote').value = '';
            this.setDefaultDate();

            // 이벤트 타입 초기화
            document.querySelectorAll('.event-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.event-btn[data-type="celebration"]').classList.add('active');
            this.selectedEventType = 'celebration';

            // 알림 초기화
            document.querySelectorAll('input[name="reminder"]').forEach(cb => {
                cb.checked = ['100', '30', '7', '1'].includes(cb.value);
            });
            this.selectedReminders = ['100', '30', '7', '1'];

            // 현재 이벤트 초기화
            this.currentEvent = null;

            // 카운트다운 정지
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }

            // 결과 숨기고 환영 카드 표시
            document.getElementById('ddayResult').style.display = 'none';
            document.getElementById('welcomeCard').style.display = 'block';
            document.getElementById('addToDdayList').style.display = 'none';

            this.showToast('D-Day 계산이 초기화되었습니다.');
        }
    }

    loadDdayList() {
        const saved = localStorage.getItem('ddayList');
        if (saved) {
            this.ddayList = JSON.parse(saved);
        }
        this.updateDdayListDisplay();
    }

    saveDdayList() {
        localStorage.setItem('ddayList', JSON.stringify(this.ddayList));
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];
        
        return `${year}년 ${month}월 ${day}일 (${dayName})`;
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : 'linear-gradient(135deg, #E91E63, #9C27B0)'};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(233, 30, 99, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
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
const ddayCalculator = new DdayCalculator();

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 추가 초기화가 필요한 경우
});
