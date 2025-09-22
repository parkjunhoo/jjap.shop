// 생활계획표 만들기 JavaScript

class DailyScheduler {
    constructor() {
        this.canvas = document.getElementById('scheduleChart');
        this.ctx = this.canvas.getContext('2d');
        this.activities = [];
        this.currentEditingIndex = -1;
        this.timeInterval = 2; // 1 또는 2 (시간 단위)
        this.timeFormat = 24; // 24 또는 12 (시간 형식)
        this.fontSize = 12; // 기본 폰트 크기
        this.fontColor = '#ffffff'; // 기본 폰트 색상 (흰색)
        
        // 캔버스 크기 동적 조정
        this.resizeCanvas();
        
        // 기본 활동들 (시간 겹침 없이 수정 + 개별 폰트 설정 포함)
        this.defaultActivities = [
            { name: '수면', icon: '😴', startTime: 22, duration: 8, color: '#4ECDC4', fontSize: 14, fontColor: '#ffffff', fontWeight: '500' },
            { name: '아침식사', icon: '🌅', startTime: 8, duration: 1, color: '#FFEAA7', fontSize: 12, fontColor: '#333333', fontWeight: '400' },
            { name: '출근/등교', icon: '🚗', startTime: 9, duration: 1, color: '#FF6B6B', fontSize: 12, fontColor: '#ffffff', fontWeight: '400' },
            { name: '업무/수업', icon: '💼', startTime: 10, duration: 2, color: '#45B7D1', fontSize: 14, fontColor: '#ffffff', fontWeight: '600' },
            { name: '점심식사', icon: '🍽️', startTime: 12, duration: 1, color: '#96CEB4', fontSize: 12, fontColor: '#333333', fontWeight: '400' },
            { name: '오후업무', icon: '💻', startTime: 13, duration: 4, color: '#5DADE2', fontSize: 14, fontColor: '#ffffff', fontWeight: '600' },
            { name: '퇴근', icon: '🏃', startTime: 17, duration: 1, color: '#F39C12', fontSize: 12, fontColor: '#ffffff', fontWeight: '400' },
            { name: '저녁식사', icon: '🍽️', startTime: 18, duration: 1, color: '#A8E6CF', fontSize: 12, fontColor: '#333333', fontWeight: '400' },
            { name: '자유시간', icon: '🎮', startTime: 19, duration: 2, color: '#DDA0DD', fontSize: 14, fontColor: '#ffffff', fontWeight: '500' },
            { name: '개인시간', icon: '📖', startTime: 21, duration: 1, color: '#98D8C8', fontSize: 12, fontColor: '#333333', fontWeight: '500' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadDefaultActivities();
        this.drawChart();
        this.updateActivityList();
        this.updateStats();
        
        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.drawChart();
        });
    }
    
    setupEventListeners() {
        // 시간 간격 변경 이벤트
        document.getElementById('timeInterval').addEventListener('change', (e) => {
            this.timeInterval = parseInt(e.target.value);
            this.drawChart();
        });
        
        // 시간 형식 변경 이벤트
        document.getElementById('timeFormat').addEventListener('change', (e) => {
            this.timeFormat = parseInt(e.target.value);
            this.drawChart();
        });
        
        // 전역 폰트 컨트롤 제거됨 - 개별 활동별로만 설정 가능
        
        // 버튼 이벤트들
        document.getElementById('addActivity').addEventListener('click', () => this.showAddActivityModal());
        document.getElementById('loadSample').addEventListener('click', () => this.loadSample());
        document.getElementById('saveChart').addEventListener('click', () => this.saveChart());
        document.getElementById('downloadChart').addEventListener('click', () => this.downloadChart());
        document.getElementById('resetChart').addEventListener('click', () => this.resetChart());
        
        // 캔버스 클릭 이벤트
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // 모달 이벤트들
        document.getElementById('saveActivity').addEventListener('click', () => this.saveActivity());
        document.getElementById('deleteActivity').addEventListener('click', () => this.deleteActivity());
        
        // 색상 프리셋 선택
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                document.getElementById('activityColor').value = e.target.dataset.color;
            });
        });
        
        // 이모지 프리셋 선택
        document.querySelectorAll('.emoji-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                document.getElementById('activityIcon').value = e.target.dataset.emoji;
            });
        });
        
        // 개별 폰트 크기 변경 이벤트
        document.getElementById('activityFontSize').addEventListener('input', (e) => {
            const fontSize = e.target.value;
            document.getElementById('activityFontSizeValue').textContent = fontSize + 'px';
        });
        
        // 소요 시간 프리셋 버튼 이벤트
        document.querySelectorAll('.duration-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                e.preventDefault();
                const hours = e.target.dataset.hours;
                const minutes = e.target.dataset.minutes;
                document.getElementById('activityHours').value = hours;
                document.getElementById('activityMinutes').value = minutes;
            });
        });
    }
    
    
    loadDefaultActivities() {
        // 기본적으로 빈 배열로 시작
        this.activities = [];
    }
    
    drawChart() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 180;
        
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 배경 원 그리기
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fill();
        
        // 활동이 없을 때 빈 원과 안내 메시지
        if (this.activities.length === 0) {
            // 빈 원
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fill();
            this.ctx.strokeStyle = '#e9ecef';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // 안내 메시지
            this.ctx.fillStyle = '#999';
            this.ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('📝 활동 추가하기', centerX, centerY - 10);
            this.ctx.font = '14px "Noto Sans KR", sans-serif';
            this.ctx.fillStyle = '#4a90e2';
            this.ctx.fillText('클릭하여 활동을 추가해보세요', centerX, centerY + 15);
            
            // 빈 차트 영역에 클릭 가능 표시
            this.ctx.strokeStyle = '#4a90e2';
            this.ctx.setLineDash([5, 5]);
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            this.drawTimeLabels(centerX, centerY, radius + 25);
            return;
        }
        
        // 활동별로 파이 차트 그리기 - 정확한 시간 위치에 배치
        this.activities.forEach((activity, index) => {
            const sliceAngle = (activity.duration / 24) * 2 * Math.PI;
            // 0시를 12시 방향(-π/2)으로, 시계방향으로 시간 진행
            let startAngle = (activity.startTime / 24) * 2 * Math.PI - Math.PI / 2;
            const endAngle = startAngle + sliceAngle;

            // 파이 슬라이스 그리기
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = activity.color;
            this.ctx.fill();
            
            // 테두리
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
             // 🎯 완전히 새로운 글씨 안 잘리게 하는 시스템
             const percentage = (activity.duration / 24) * 100;
             const textAngle = startAngle + sliceAngle / 2;
             
             // 텍스트 위치를 좀 더 안쪽으로 (반지름의 65%)
             let textRadius = radius * 0.65;
             
             const textX = centerX + Math.cos(textAngle) * textRadius;
             const textY = centerY + Math.sin(textAngle) * textRadius;
             
             this.ctx.save();
             this.ctx.translate(textX, textY);
             
             // 텍스트 회전 (읽기 편하도록)
             let rotation = textAngle;
             if (textAngle > Math.PI / 2 && textAngle < 3 * Math.PI / 2) {
                 rotation = textAngle + Math.PI;
             }
             this.ctx.rotate(rotation);
             
             this.ctx.textAlign = 'center';
             this.ctx.textBaseline = 'middle';
             
             // 개별 활동의 폰트 설정
             const activityFontSize = activity.fontSize || 12;
             const activityFontColor = activity.fontColor || '#ffffff';
             const activityFontWeight = activity.fontWeight || '400';
             
             // 아이콘과 텍스트 준비
             const iconText = activity.icon || '';
             const displayText = iconText ? `${iconText} ${activity.name}` : activity.name;
             
             this.ctx.fillStyle = activityFontColor;
             
             // 🚀 동적 폰트 크기 조정 시스템 (글씨가 절대 안 잘리게!)
             const maxTextWidth = textRadius * 1.8; // 허용 최대 너비
             let currentFontSize = activityFontSize;
             let finalText = displayText;
             
             // 1단계: 원본 텍스트로 폰트 크기 조정 시도
             for (let fontSize = currentFontSize; fontSize >= 8; fontSize -= 1) {
                 this.ctx.font = `${activityFontWeight} ${fontSize}px "Noto Sans KR", Arial, sans-serif`;
                 const textWidth = this.ctx.measureText(displayText).width;
                 
                 if (textWidth <= maxTextWidth) {
                     finalText = displayText;
                     currentFontSize = fontSize;
                     break;
                 }
             }
             
             // 2단계: 폰트 크기가 너무 작아지면 텍스트 축약
             if (currentFontSize < 10) {
                 currentFontSize = Math.max(activityFontSize - 2, 10); // 최소 10px
                 
                 let textCandidates = [];
                 if (iconText) {
                     textCandidates = [
                         displayText,
                         `${iconText} ${activity.name.substring(0, 6)}`,
                         `${iconText} ${activity.name.substring(0, 4)}`,
                         `${iconText} ${activity.name.substring(0, 3)}`,
                         `${iconText} ${activity.name.substring(0, 2)}`,
                         activity.name.substring(0, 5),
                         activity.name.substring(0, 4),
                         activity.name.substring(0, 3),
                         activity.name.substring(0, 2),
                         iconText
                     ];
                 } else {
                     textCandidates = [
                         activity.name,
                         activity.name.substring(0, 8),
                         activity.name.substring(0, 6),
                         activity.name.substring(0, 5),
                         activity.name.substring(0, 4),
                         activity.name.substring(0, 3),
                         activity.name.substring(0, 2),
                         activity.name.substring(0, 1)
                     ];
                 }
                 
                 this.ctx.font = `${activityFontWeight} ${currentFontSize}px "Noto Sans KR", Arial, sans-serif`;
                 finalText = activity.name.substring(0, 1); // 기본값
                 
                 for (let candidate of textCandidates) {
                     if (!candidate) continue;
                     const candidateWidth = this.ctx.measureText(candidate).width;
                     if (candidateWidth <= maxTextWidth) {
                         finalText = candidate;
                         break;
                     }
                 }
             }
             
             // 3단계: 여전히 길면 여러줄 처리 (큰 영역만)
             if (percentage > 8 && this.ctx.measureText(finalText).width > maxTextWidth) {
                 // 여러 줄로 나누기
                 const words = finalText.split(' ');
                 if (words.length > 1) {
                     const firstLine = iconText ? `${iconText} ${words[1]}` : words[0];
                     const secondLine = words.slice(iconText ? 2 : 1).join(' ').substring(0, 4);
                     
                     this.ctx.font = `${activityFontWeight} ${Math.max(currentFontSize - 2, 8)}px "Noto Sans KR", Arial, sans-serif`;
                     
                     // 첫 번째 줄
                     this.ctx.fillText(firstLine, 0, -6);
                     // 두 번째 줄
                     if (secondLine) {
                         this.ctx.fillText(secondLine, 0, 6);
                     }
                 } else {
                     // 한 단어인 경우 그냥 표시
                     this.ctx.font = `${activityFontWeight} ${currentFontSize}px "Noto Sans KR", Arial, sans-serif`;
                     this.ctx.fillText(finalText, 0, 0);
                 }
             } else {
                 // 최종 텍스트 표시
                 this.ctx.font = `${activityFontWeight} ${currentFontSize}px "Noto Sans KR", Arial, sans-serif`;
                 this.ctx.fillText(finalText, 0, 0);
             }
             
             this.ctx.restore();
        });
        
        // 시간 라벨 그리기
        this.drawTimeLabels(centerX, centerY, radius + 25);
    }
    
     drawTimeLabels(centerX, centerY, labelRadius) {
         for (let hour = 0; hour < 24; hour += this.timeInterval) {
             const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2; // 12시부터 시작
             
             const x = centerX + Math.cos(angle) * labelRadius;
             const y = centerY + Math.sin(angle) * labelRadius;
             
             // 시간 형식에 따라 표시 텍스트 결정 (아이콘 제거)
             let timeText;
             if (this.timeFormat === 12) {
                 if (hour === 0) {
                     timeText = '12AM';
                 } else if (hour === 12) {
                     timeText = '12PM';
                 } else if (hour < 12) {
                     timeText = hour + 'AM';
                 } else {
                     timeText = (hour - 12) + 'PM';
                 }
             } else {
                 timeText = hour.toString();
             }
             
             this.ctx.save();
             this.ctx.fillStyle = '#666';
             this.ctx.font = 'bold 12px "Noto Sans KR", Arial, sans-serif';
             this.ctx.textAlign = 'center';
             this.ctx.textBaseline = 'middle';
             this.ctx.fillText(timeText, x, y);
             this.ctx.restore();
         }
     }
    
    getStartAngle() {
        // 항상 12시 방향부터 시작 (0시부터 시작)
        return -Math.PI / 2;
    }
    
    getContrastColor(hexColor) {
        // 색상의 밝기에 따라 텍스트 색상 결정
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#333' : '#fff';
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const clickRadius = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // 활동이 없을 때는 전체 차트 영역에서 클릭 허용
        if (this.activities.length === 0) {
            this.showAddActivityModal();
            return;
        }
        
        // 차트 영역 밖 클릭 시 활동 추가 모달 열기
        if (clickRadius > 190) {
            this.showAddActivityModal();
            return;
        }
        
        // 클릭된 각도 계산 (12시 방향 기준)
        let clickAngle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
        if (clickAngle < 0) clickAngle += 2 * Math.PI;
        if (clickAngle >= 2 * Math.PI) clickAngle -= 2 * Math.PI;
        
        // 클릭된 시간 계산
        const clickedHour = (clickAngle / (2 * Math.PI)) * 24;
        
        // 어떤 활동이 클릭되었는지 찾기
        let activityFound = false;
        for (let i = 0; i < this.activities.length; i++) {
            const activity = this.activities[i];
            const startHour = activity.startTime;
            const endHour = (activity.startTime + activity.duration) % 24;
            
            // 24시를 넘어가는 활동 처리
            if (startHour < endHour) {
                if (clickedHour >= startHour && clickedHour < endHour) {
                    this.editActivity(i);
                    activityFound = true;
                    return;
                }
            } else {
                if (clickedHour >= startHour || clickedHour < endHour) {
                    this.editActivity(i);
                    activityFound = true;
                    return;
                }
            }
        }
        
        // 빈 공간을 클릭했을 때 활동 추가 모달 열기
        if (!activityFound) {
            this.showAddActivityModal();
        }
    }
    
    showAddActivityModal() {
        this.currentEditingIndex = -1;
        document.getElementById('activityName').value = '';
        document.getElementById('activityIcon').value = '';  // 기본값을 빈 문자열로 변경
        document.getElementById('activityStartTime').value = '09:00';
        document.getElementById('activityHours').value = 1;
        document.getElementById('activityMinutes').value = 0;
        document.getElementById('activityColor').value = this.getRandomColor();
        document.getElementById('activityFontSize').value = 12;
        document.getElementById('activityFontSizeValue').textContent = '12px';
        document.getElementById('activityFontColor').value = '#ffffff';
        document.getElementById('activityFontWeight').value = '400';
        document.getElementById('deleteActivity').style.display = 'none';
        this.showModal();
    }
    
    editActivity(index) {
        this.currentEditingIndex = index;
        const activity = this.activities[index];
        
        document.getElementById('activityName').value = activity.name;
        document.getElementById('activityIcon').value = activity.icon || '⭐';
        document.getElementById('activityStartTime').value = this.formatTimeInput(activity.startTime);
        
        // 소요 시간을 시간:분으로 분리
        const totalMinutes = Math.round(activity.duration * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        document.getElementById('activityHours').value = hours;
        document.getElementById('activityMinutes').value = minutes;
        
        document.getElementById('activityColor').value = activity.color;
        document.getElementById('activityFontSize').value = activity.fontSize || 12;
        document.getElementById('activityFontSizeValue').textContent = (activity.fontSize || 12) + 'px';
        document.getElementById('activityFontColor').value = activity.fontColor || '#ffffff';
        document.getElementById('activityFontWeight').value = activity.fontWeight || '400';
        document.getElementById('deleteActivity').style.display = 'inline-block';
        
        this.showModal();
    }
    
    formatTimeInput(hour) {
        return hour.toString().padStart(2, '0') + ':00';
    }
    
    parseTimeInput(timeString) {
        return parseInt(timeString.split(':')[0]);
    }
    
    saveActivity() {
        const name = document.getElementById('activityName').value.trim();
        const icon = document.getElementById('activityIcon').value.trim();
        const startTime = this.parseTimeInput(document.getElementById('activityStartTime').value);
        
        // 시간:분 단위로 소요 시간 계산
        const hours = parseInt(document.getElementById('activityHours').value) || 0;
        const minutes = parseInt(document.getElementById('activityMinutes').value) || 0;
        const duration = hours + (minutes / 60);
        
        const color = document.getElementById('activityColor').value;
        const fontSize = parseInt(document.getElementById('activityFontSize').value) || 12;
        const fontColor = document.getElementById('activityFontColor').value || '#ffffff';
        
        if (!name || duration <= 0 || duration > 24) {
            alert('활동 이름과 올바른 소요 시간을 입력해주세요.\n(최대 24시간까지 가능)');
            return;
        }
        
        const fontWeight = document.getElementById('activityFontWeight').value || '400';
        const activityData = { name, icon, startTime, duration, color, fontSize, fontColor, fontWeight };
        
        if (this.currentEditingIndex >= 0) {
            this.activities[this.currentEditingIndex] = activityData;
        } else {
            this.activities.push(activityData);
        }
        
        this.sortActivitiesByTime();
        this.drawChart();
        this.updateActivityList();
        this.updateStats();
        this.closeModal();
    }
    
    deleteActivity() {
        if (this.currentEditingIndex >= 0) {
            this.activities.splice(this.currentEditingIndex, 1);
            this.drawChart();
            this.updateActivityList();
            this.updateStats();
            this.closeModal();
        }
    }
    
    sortActivitiesByTime() {
        this.activities.sort((a, b) => {
            // 시작 시간에 따라 정렬 (0시부터 23시 순서)
            return a.startTime - b.startTime;
        });
    }
    
    updateActivityList() {
        const list = document.getElementById('activityList');
        list.innerHTML = '';
        
        if (this.activities.length === 0) {
            list.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #999;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                    <div style="font-size: 16px; margin-bottom: 8px; font-weight: 600;">활동이 없습니다</div>
                    <div style="font-size: 14px;">활동 추가 버튼을 눌러 계획을 세워보세요!</div>
                </div>
            `;
            return;
        }
        
        this.activities.forEach((activity, index) => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.onclick = () => this.editActivity(index);
            
            const endTime = (activity.startTime + activity.duration) % 24;
            const timeText = `${activity.startTime}:00 - ${endTime}:00`;
            
            item.innerHTML = `
                <div class="activity-color" style="background-color: ${activity.color}"></div>
                <div class="activity-icon">${activity.icon || '⭐'}</div>
                <div class="activity-info">
                    <div class="activity-name">${activity.name}</div>
                    <div class="activity-time">${timeText} (${activity.duration}시간)</div>
                </div>
            `;
            
            list.appendChild(item);
        });
    }
    
    
    updateStats() {
        const stats = document.getElementById('statsContent');
        
        if (this.activities.length === 0) {
            stats.innerHTML = `
                <div style="text-align: center; color: #999; font-size: 14px;">
                    📊 활동을 추가하면<br>통계가 표시됩니다
                </div>
            `;
            return;
        }
        
        const totalHours = this.activities.reduce((sum, activity) => sum + activity.duration, 0);
        const remainingHours = 24 - totalHours;
        
        let statsHTML = `
            <div class="stat-item">
                <span>총 계획된 시간</span>
                <span>${totalHours}시간</span>
            </div>
            <div class="stat-item">
                <span>남은 시간</span>
                <span>${remainingHours}시간</span>
            </div>
        `;
        
        // 활동별 비율
        statsHTML += '<hr style="margin: 15px 0;">';
        this.activities.forEach(activity => {
            const percentage = ((activity.duration / 24) * 100).toFixed(1);
            statsHTML += `
                <div class="stat-item">
                    <span style="display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; background: ${activity.color}; margin-right: 8px; border-radius: 2px;"></div>
                        ${activity.name}
                    </span>
                    <span>${percentage}%</span>
                </div>
            `;
        });
        
        stats.innerHTML = statsHTML;
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        const size = Math.min(containerRect.width - 40, containerRect.height - 40, 560);
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.canvas.style.width = size + 'px';
        this.canvas.style.height = size + 'px';
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#A8E6CF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    showModal() {
        document.getElementById('editActivityModal').style.display = 'block';
        document.getElementById('modalOverlay').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('editActivityModal').style.display = 'none';
        document.getElementById('modalOverlay').style.display = 'none';
    }
    
    saveChart() {
        // 활동 목록을 이미지로 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        
        // 동적으로 높이 계산: 기본 여백 + 활동 목록 + 통계 섹션  
        const baseHeight = 120; // 제목 영역만 (날짜 제거로 감소)
        const activityHeight = this.activities.length * 70; // 각 활동당 70px
        const statsHeight = this.activities.length > 0 ? 200 + (this.activities.length * 25) : 0; // 통계 섹션
        canvas.height = baseHeight + activityHeight + statsHeight;
        
        // 배경
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 제목
        ctx.fillStyle = '#333';
        ctx.font = 'bold 28px "Noto Sans KR", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('📋 활동 목록', canvas.width / 2, 50);
        
        // 활동 목록
        let y = 140;
        this.activities.forEach((activity, index) => {
            // 배경
            ctx.fillStyle = index % 2 === 0 ? '#f8f9fa' : '#ffffff';
            ctx.fillRect(20, y - 25, canvas.width - 40, 65);
            
            // 색상 표시
            ctx.fillStyle = activity.color;
            ctx.fillRect(30, y - 15, 20, 30);
            
            // 아이콘
            ctx.font = '24px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.fillText(activity.icon || '⭐', 75, y + 5);
            
            // 활동명
            ctx.fillStyle = '#333';
            ctx.font = 'bold 20px "Noto Sans KR", Arial, sans-serif';
            ctx.fillText(activity.name, 110, y - 5);
            
            // 시간 정보
            const endTime = (activity.startTime + activity.duration) % 24;
            const timeText = `${activity.startTime}:00 - ${endTime}:00 (${activity.duration}시간)`;
            ctx.font = '16px "Noto Sans KR", Arial, sans-serif';
            ctx.fillStyle = '#666';
            ctx.fillText(timeText, 110, y + 20);
            
            y += 65;
        });
        
        // 통계 정보
        if (this.activities.length > 0) {
            y += 20;
            ctx.fillStyle = '#333';
            ctx.font = 'bold 20px "Noto Sans KR", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📊 통계 분석', canvas.width / 2, y);
            
            const totalHours = this.activities.reduce((sum, activity) => sum + activity.duration, 0);
            const remainingHours = 24 - totalHours;
            
            y += 35;
            ctx.font = '16px "Noto Sans KR", Arial, sans-serif';
            ctx.fillStyle = '#666';
            ctx.fillText(`총 계획 시간: ${totalHours}시간`, canvas.width / 2, y);
            ctx.fillText(`남은 시간: ${remainingHours}시간`, canvas.width / 2, y + 25);
            
        // 각 활동별 비율 표시
        y += 70; // 30px 추가 여백
        ctx.font = 'bold 18px "Noto Sans KR", Arial, sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText('🎯 활동별 비율', canvas.width / 2, y);
            
            y += 25;
            this.activities.forEach((activity, index) => {
                const percentage = ((activity.duration / 24) * 100).toFixed(1);
                
                // 색상 박스
                ctx.fillStyle = activity.color;
                ctx.fillRect(50, y - 8, 16, 16);
                
                // 아이콘
                ctx.font = '16px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'left';
                ctx.fillText(activity.icon || '⭐', 75, y + 3);
                
                // 활동명과 비율
                ctx.font = '16px "Noto Sans KR", Arial, sans-serif';
                ctx.fillText(`${activity.name}: ${percentage}%`, 105, y + 3);
                
                y += 22;
            });
        }
        
        // 다운로드
        const today_str = new Date().toISOString().split('T')[0];
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `활동목록_${today_str}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        alert('활동 목록이 이미지로 저장됩니다!');
    }
    
    downloadChart() {
        // 임시 캔버스 생성 (차트 크기에 맞춰 최적화)
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 800;
        tempCanvas.height = 800;
        
        // 흰색 배경 그리기
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        const centerX = tempCanvas.width / 2;
        const centerY = tempCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        
        // 배경 원 그리기
        tempCtx.beginPath();
        tempCtx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
        tempCtx.fillStyle = '#f8f9fa';
        tempCtx.fill();
        
        // 활동이 있으면 그리기
        if (this.activities.length > 0) {
            this.activities.forEach((activity, index) => {
                const sliceAngle = (activity.duration / 24) * 2 * Math.PI;
                // 정확한 시간 위치 계산: 0시=12시방향, 시계방향 진행
                let startAngle = (activity.startTime / 24) * 2 * Math.PI - Math.PI / 2;
                const endAngle = startAngle + sliceAngle;
                
                // 파이 슬라이스 그리기
                tempCtx.beginPath();
                tempCtx.moveTo(centerX, centerY);
                tempCtx.arc(centerX, centerY, radius, startAngle, endAngle);
                tempCtx.closePath();
                tempCtx.fillStyle = activity.color;
                tempCtx.fill();
                
                // 테두리
                tempCtx.strokeStyle = 'white';
                tempCtx.lineWidth = 3;
                tempCtx.stroke();
                
                 // 아이콘과 텍스트 (다운로드용 고해상도)
                 const percentage = (activity.duration / 24) * 100;
                 const sliceAngleInDegrees = (sliceAngle * 180) / Math.PI;
                 const textAngle = startAngle + sliceAngle / 2;
                 
                 // 비율에 따라 텍스트 위치와 크기 결정
                 let textRadius, fontSize, showText = true;
                 
                 if (percentage < 6 || sliceAngleInDegrees < 20) {
                     showText = false;
                 } else if (percentage < 10) {
                     textRadius = radius * 0.8;
                     fontSize = 14;
                 } else if (percentage < 15) {
                     textRadius = radius * 0.75;
                     fontSize = 16;
                 } else {
                     textRadius = radius * 0.7;
                     fontSize = 18;
                 }
                 
                 if (showText) {
                     const textX = centerX + Math.cos(textAngle) * textRadius;
                     const textY = centerY + Math.sin(textAngle) * textRadius;
                     
                     tempCtx.save();
                     tempCtx.translate(textX, textY);
                     
                     let rotation = textAngle;
                     if (textAngle > Math.PI / 2 && textAngle < 3 * Math.PI / 2) {
                         rotation = textAngle + Math.PI;
                     }
                     tempCtx.rotate(rotation);
                     
                     tempCtx.fillStyle = this.getContrastColor(activity.color);
                     tempCtx.textAlign = 'center';
                     tempCtx.textBaseline = 'middle';
                     
                     // 개별 활동의 폰트 설정 사용 (다운로드용)
                     const activityFontSize = (activity.fontSize || 12) + 4; // 다운로드용으로 조금 더 크게
                     const activityFontColor = activity.fontColor || '#ffffff';
                     
                     // 아이콘과 텍스트를 함께 표시
                     const iconText = activity.icon || '⭐';
                     const displayText = `${iconText} ${activity.name}`;
                     
                     // 개별 활동의 폰트 색상 사용
                     tempCtx.fillStyle = activityFontColor;
                     
                    // 개별 폰트 설정 적용 (굵기 포함)
                    const activityFontWeight = activity.fontWeight || '400';
                    tempCtx.font = `${activityFontWeight} ${activityFontSize}px "Noto Sans KR", Arial, sans-serif`;
                     
                     // 🚀 다운로드용 개선된 텍스트 공간 계산
                     const textWidth = tempCtx.measureText(displayText).width;
                     const sliceAngleInRadians = sliceAngle;
                     
                     // 다운로드용 더 관대한 공간 계산
                     const angleDegrees = sliceAngleInRadians * 180 / Math.PI;
                     let downloadAvailableWidth = 0;
                     
                     if (angleDegrees >= 45) {
                         downloadAvailableWidth = textRadius * 2.0; // 더 넉넉하게
                     } else if (angleDegrees >= 30) {
                         downloadAvailableWidth = textRadius * 1.5;
                     } else if (angleDegrees >= 15) {
                         downloadAvailableWidth = textRadius * 1.0;
                     } else {
                         downloadAvailableWidth = textRadius * 0.5;
                     }
                     
                     // 다운로드용 적극적인 텍스트 표시
                     if (textWidth > downloadAvailableWidth) {
                         if (percentage < 4) {
                             // 매우 작은 영역: 아이콘만
                             tempCtx.font = `${Math.max(activityFontSize + 4, 20)}px Arial`;
                             tempCtx.fillText(iconText, 0, 0);
                         } else {
                             // 다운로드용 텍스트 시도 시퀀스
                             let attempts = [
                                 displayText,
                                 `${iconText} ${activity.name}`,
                                 `${iconText} ${activity.name.substring(0, 5)}`,
                                 `${iconText} ${activity.name.substring(0, 4)}`,
                                 `${iconText} ${activity.name.substring(0, 3)}`,
                                 activity.name.substring(0, 4),
                                 iconText
                             ];
                             
                             let finalText = iconText;
                             for (let text of attempts) {
                                 tempCtx.font = `${activityFontWeight} ${activityFontSize}px "Noto Sans KR", Arial, sans-serif`;
                                 const testWidth = tempCtx.measureText(text).width;
                                 if (testWidth <= downloadAvailableWidth) {
                                     finalText = text;
                                     break;
                                 }
                             }
                             tempCtx.fillText(finalText, 0, 0);
                         }
                     } else {
                         // 전체 텍스트 표시
                         tempCtx.fillText(displayText, 0, 0);
                     }
                     
                     tempCtx.restore();
                 }
            });
            
            // 시간 라벨 표시 (활동이 있는 차트용)
            for (let hour = 0; hour < 24; hour += this.timeInterval) {
                const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius + 35);
                const y = centerY + Math.sin(angle) * (radius + 35);
                
                let timeText;
                if (this.timeFormat === 12) {
                    if (hour === 0) {
                        timeText = '12AM';
                    } else if (hour === 12) {
                        timeText = '12PM';
                    } else if (hour < 12) {
                        timeText = hour + 'AM';
                    } else {
                        timeText = (hour - 12) + 'PM';
                    }
                } else {
                    timeText = hour.toString();
                }
                
                tempCtx.save();
                tempCtx.fillStyle = '#666';
                tempCtx.font = 'bold 16px "Noto Sans KR", Arial, sans-serif';
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                tempCtx.fillText(timeText, x, y);
                tempCtx.restore();
            }
        } else {
            // 빈 원과 메시지
            tempCtx.beginPath();
            tempCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fill();
            tempCtx.strokeStyle = '#e9ecef';
            tempCtx.lineWidth = 3;
            tempCtx.stroke();
            
            tempCtx.fillStyle = '#999';
            tempCtx.font = 'bold 24px "Noto Sans KR", Arial, sans-serif';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillText('📝 활동 추가하기', centerX, centerY - 15);
            tempCtx.font = '18px "Noto Sans KR", Arial, sans-serif';
            tempCtx.fillText('버튼을 눌러 활동을 추가해보세요', centerX, centerY + 20);
            
            // 시간 라벨 표시 (빈 차트용)
            for (let hour = 0; hour < 24; hour += this.timeInterval) {
                const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius + 35);
                const y = centerY + Math.sin(angle) * (radius + 35);
                
                let timeText;
                if (this.timeFormat === 12) {
                    if (hour === 0) {
                        timeText = '12AM';
                    } else if (hour === 12) {
                        timeText = '12PM';
                    } else if (hour < 12) {
                        timeText = hour + 'AM';
                    } else {
                        timeText = (hour - 12) + 'PM';
                    }
                } else {
                    timeText = hour.toString();
                }
                
                tempCtx.save();
                tempCtx.fillStyle = '#666';
                tempCtx.font = 'bold 16px "Noto Sans KR", Arial, sans-serif';
                tempCtx.textAlign = 'center';
                tempCtx.textBaseline = 'middle';
                tempCtx.fillText(timeText, x, y);
                tempCtx.restore();
            }
        }
        
        const today = new Date().toISOString().split('T')[0];
        tempCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `생활계획표_차트_${today}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
        
        alert('생활계획표 차트가 저장됩니다!');
    }
    
    loadSample() {
        if (this.activities.length > 0 && !confirm('현재 활동을 모두 지우고 샘플을 불러오시겠습니까?')) {
            return;
        }
        
        this.activities = [...this.defaultActivities];
        this.drawChart();
        this.updateActivityList();
        this.updateStats();
        alert('📋 샘플 활동이 로드되었습니다!');
    }
    
    resetChart() {
        if (confirm('모든 활동을 삭제하시겠습니까?')) {
            this.activities = [];
            this.drawChart();
            this.updateActivityList();
            this.updateStats();
        }
    }
}

// 모달 전역 함수
function closeModal() {
    document.getElementById('editActivityModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

// 모달 오버레이 클릭 시 닫기
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modalOverlay').addEventListener('click', closeModal);
});

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.scheduler = new DailyScheduler();
});
