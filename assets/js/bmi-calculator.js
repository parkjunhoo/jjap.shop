// ⚖️ BMI & 기초대사율 계산기 JavaScript

class BMICalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadHealthHistory();
        this.initializeCanvas();
    }

    initializeElements() {
        // Input elements
        this.heightInput = document.getElementById('height');
        this.weightInput = document.getElementById('weight');
        this.ageInput = document.getElementById('age');
        this.genderBtns = document.querySelectorAll('.gender-btn');
        this.activityLevel = document.getElementById('activityLevel');
        
        // Control buttons
        this.calculateBtn = document.getElementById('calculateBMI');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        
        // Goal elements
        this.goalCard = document.getElementById('goalCard');
        this.targetWeightInput = document.getElementById('targetWeight');
        this.timeframeSelect = document.getElementById('timeframe');
        this.calculateGoalBtn = document.getElementById('calculateGoal');
        
        // Result elements
        this.welcomeCard = document.getElementById('welcomeCard');
        this.bmiResult = document.getElementById('bmiResult');
        this.bmiGauge = document.getElementById('bmiGauge');
        this.bmiNumber = document.getElementById('bmiNumber');
        this.bmiStatus = document.getElementById('bmiStatus');
        this.currentBMI = document.getElementById('currentBMI');
        this.bmrValue = document.getElementById('bmrValue');
        this.idealWeight = document.getElementById('idealWeight');
        this.dailyCalories = document.getElementById('dailyCalories');
        
        // Tab elements
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // History elements
        this.healthHistory = document.getElementById('healthHistory');
        
        // Action buttons
        this.saveResultBtn = document.getElementById('saveResult');
        this.shareResultBtn = document.getElementById('shareResult');
        this.printResultBtn = document.getElementById('printResult');
        
        // Current data
        this.currentData = {};
        this.selectedGender = null;
    }

    bindEvents() {
        // Gender selection
        this.genderBtns.forEach(btn => {
            btn.addEventListener('click', () => this.selectGender(btn));
        });
        
        // Calculate BMI
        this.calculateBtn.addEventListener('click', () => this.calculateBMI());
        
        // Goal calculation
        this.calculateGoalBtn.addEventListener('click', () => this.calculateGoal());
        
        // Tab switching
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Quick check buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => this.showQuickInfo(btn.dataset.preset));
        });
        
        // Action buttons
        this.saveResultBtn?.addEventListener('click', () => this.saveResult());
        this.shareResultBtn?.addEventListener('click', () => this.shareResult());
        this.printResultBtn?.addEventListener('click', () => this.printResult());
        
        // Clear history
        this.clearHistoryBtn?.addEventListener('click', () => this.clearHistory());
        
        // Real-time updates
        [this.heightInput, this.weightInput, this.ageInput].forEach(input => {
            input.addEventListener('input', () => this.onInputChange());
        });
        
        this.activityLevel.addEventListener('change', () => this.onInputChange());
    }

    selectGender(btn) {
        this.genderBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedGender = btn.dataset.gender;
        this.onInputChange();
    }

    onInputChange() {
        // Show goal card if all inputs are filled
        if (this.heightInput.value && this.weightInput.value && 
            this.ageInput.value && this.selectedGender) {
            this.goalCard.style.display = 'block';
        }
    }

    calculateBMI() {
        const height = parseFloat(this.heightInput.value);
        const weight = parseFloat(this.weightInput.value);
        const age = parseInt(this.ageInput.value);
        const gender = this.selectedGender;
        const activityLevel = parseFloat(this.activityLevel.value);

        if (!height || !weight || !age || !gender) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        // Calculate BMI
        const bmi = weight / Math.pow(height / 100, 2);
        
        // Calculate BMR (Harris-Benedict Equation)
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Calculate daily calories
        const dailyCalories = Math.round(bmr * activityLevel);
        
        // Calculate ideal weight (BMI 22 기준)
        const idealWeight = Math.round(22 * Math.pow(height / 100, 2) * 10) / 10;
        
        // Store current data
        this.currentData = {
            height,
            weight,
            age,
            gender,
            activityLevel,
            bmi: Math.round(bmi * 10) / 10,
            bmr: Math.round(bmr),
            dailyCalories,
            idealWeight,
            date: new Date().toLocaleDateString()
        };

        // Show results
        this.showResults();
        
        // Save to history
        this.saveToHistory();
    }

    showResults() {
        const { bmi, bmr, idealWeight, dailyCalories } = this.currentData;
        
        // Hide welcome, show result
        this.welcomeCard.style.display = 'none';
        this.bmiResult.style.display = 'block';
        
        // Update main values
        this.bmiNumber.textContent = bmi;
        this.currentBMI.textContent = bmi;
        this.bmrValue.textContent = bmr.toLocaleString();
        this.idealWeight.textContent = idealWeight + 'kg';
        this.dailyCalories.textContent = dailyCalories.toLocaleString();
        
        // Update status and color
        const status = this.getBMIStatus(bmi);
        this.bmiStatus.textContent = status.text;
        this.bmiStatus.style.background = status.color;
        
        // Draw gauge
        this.drawBMIGauge(bmi);
        
        // Update detailed analysis
        this.updateDetailedAnalysis();
        
        // Scroll to results
        this.bmiResult.scrollIntoView({ behavior: 'smooth' });
    }

    getBMIStatus(bmi) {
        if (bmi < 18.5) {
            return { text: '저체중', color: 'rgba(33, 150, 243, 0.2)', gauge: '#2196F3' };
        } else if (bmi < 23) {
            return { text: '정상', color: 'rgba(76, 175, 80, 0.2)', gauge: '#4CAF50' };
        } else if (bmi < 25) {
            return { text: '과체중', color: 'rgba(255, 152, 0, 0.2)', gauge: '#FF9800' };
        } else {
            return { text: '비만', color: 'rgba(244, 67, 54, 0.2)', gauge: '#F44336' };
        }
    }

    initializeCanvas() {
        if (!this.bmiGauge) return;
        
        this.ctx = this.bmiGauge.getContext('2d');
        this.bmiGauge.width = 300;
        this.bmiGauge.height = 200;
    }

    drawBMIGauge(bmi) {
        if (!this.ctx) return;
        
        const ctx = this.ctx;
        const centerX = 150;
        const centerY = 160;
        const radius = 120;
        
        // Clear canvas
        ctx.clearRect(0, 0, 300, 200);
        
        // Define BMI ranges and colors
        const ranges = [
            { min: 0, max: 18.5, color: '#2196F3', label: '저체중' },
            { min: 18.5, max: 23, color: '#4CAF50', label: '정상' },
            { min: 23, max: 25, color: '#FF9800', label: '과체중' },
            { min: 25, max: 40, color: '#F44336', label: '비만' }
        ];
        
        // Draw gauge background
        ranges.forEach((range, index) => {
            const startAngle = Math.PI + (index * Math.PI / 4);
            const endAngle = Math.PI + ((index + 1) * Math.PI / 4);
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 20;
            ctx.strokeStyle = range.color;
            ctx.globalAlpha = 0.3;
            ctx.stroke();
        });
        
        // Draw needle
        const needleAngle = Math.PI + (Math.min(Math.max(bmi, 15), 30) - 15) * Math.PI / 15;
        
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        const needleX = centerX + Math.cos(needleAngle) * (radius - 10);
        const needleY = centerY + Math.sin(needleAngle) * (radius - 10);
        ctx.lineTo(needleX, needleY);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#333';
        ctx.stroke();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        // Draw labels
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        
        ranges.forEach((range, index) => {
            const labelAngle = Math.PI + (index * Math.PI / 4) + (Math.PI / 8);
            const labelX = centerX + Math.cos(labelAngle) * (radius + 25);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 25);
            
            ctx.fillText(range.label, labelX, labelY);
        });
    }

    updateDetailedAnalysis() {
        const { bmi, weight, idealWeight, gender, age, bmr, dailyCalories } = this.currentData;
        
        // Update overview tab
        this.updateOverviewTab(bmi, weight, idealWeight);
        
        // Update nutrition tab
        this.updateNutritionTab(dailyCalories);
        
        // Update exercise tab
        this.updateExerciseTab(bmi, weight, idealWeight);
    }

    updateOverviewTab(bmi, weight, idealWeight) {
        const status = this.getBMIStatus(bmi);
        const weightDiff = Math.round((weight - idealWeight) * 10) / 10;
        
        document.getElementById('currentStatus').innerHTML = `
            <div class="status-highlight">BMI ${bmi} - ${status.text}</div>
            <p>현재 체중: ${weight}kg</p>
            <p>이상체중: ${idealWeight}kg</p>
            <p>체중 차이: ${weightDiff > 0 ? '+' : ''}${weightDiff}kg</p>
        `;
        
        document.getElementById('weightRange').innerHTML = `
            <p>저체중: ~${Math.round(18.5 * Math.pow(this.currentData.height / 100, 2))}kg</p>
            <p>정상: ${Math.round(18.5 * Math.pow(this.currentData.height / 100, 2))}~${Math.round(23 * Math.pow(this.currentData.height / 100, 2))}kg</p>
            <p>과체중: ${Math.round(23 * Math.pow(this.currentData.height / 100, 2))}~${Math.round(25 * Math.pow(this.currentData.height / 100, 2))}kg</p>
            <p>비만: ${Math.round(25 * Math.pow(this.currentData.height / 100, 2))}kg~</p>
        `;
        
        let recommendations = '';
        if (bmi < 18.5) {
            recommendations = '<p>• 균형 잡힌 식단으로 건강한 체중 증가</p><p>• 단백질 섭취 늘리기</p><p>• 근력 운동으로 근육량 증가</p>';
        } else if (bmi < 23) {
            recommendations = '<p>• 현재 체중 유지</p><p>• 규칙적인 운동 계속하기</p><p>• 균형 잡힌 식단 유지</p>';
        } else if (bmi < 25) {
            recommendations = '<p>• 점진적인 체중 감량 (월 1-2kg)</p><p>• 유산소 운동 늘리기</p><p>• 칼로리 조절</p>';
        } else {
            recommendations = '<p>• 전문가 상담 권장</p><p>• 체계적인 다이어트 계획</p><p>• 꾸준한 운동과 식단 관리</p>';
        }
        
        document.getElementById('recommendations').innerHTML = recommendations;
        
        let warnings = '';
        if (bmi >= 30) {
            warnings = '<div class="warning-text">• 고도비만으로 건강 위험도가 높습니다</div><div class="warning-text">• 의료진 상담을 받아보세요</div>';
        } else if (bmi >= 25) {
            warnings = '<div class="warning-text">• 비만 관련 질환 위험이 증가합니다</div>';
        } else if (bmi < 18.5) {
            warnings = '<div class="warning-text">• 영양 부족 위험이 있습니다</div>';
        } else {
            warnings = '<p>• 건강한 체중 범위입니다</p>';
        }
        
        document.getElementById('healthWarnings').innerHTML = warnings;
    }

    updateNutritionTab(dailyCalories) {
        // Calorie breakdown
        const maintainCalories = Math.round(dailyCalories);
        const loseCalories = Math.round(dailyCalories - 500);
        const gainCalories = Math.round(dailyCalories + 500);
        
        document.getElementById('calorieBreakdown').innerHTML = `
            <div class="calorie-item">
                <span>체중 유지</span>
                <span>${maintainCalories} kcal</span>
            </div>
            <div class="calorie-item">
                <span>체중 감량 (주 0.5kg)</span>
                <span>${loseCalories} kcal</span>
            </div>
            <div class="calorie-item">
                <span>체중 증가 (주 0.5kg)</span>
                <span>${gainCalories} kcal</span>
            </div>
        `;
        
        // Macronutrient chart
        this.drawMacroChart();
        
        // Diet guide
        const bmi = this.currentData.bmi;
        let dietTips = [];
        
        if (bmi < 18.5) {
            dietTips = [
                '단백질 함량이 높은 음식 섭취 (닭가슴살, 계란, 견과류)',
                '건강한 지방 섭취 (아보카도, 올리브오일)',
                '복합탄수화물 위주의 식단 (현미, 통밀)',
                '소량씩 자주 식사하기'
            ];
        } else if (bmi >= 25) {
            dietTips = [
                '섬유질이 풍부한 채소 위주 식단',
                '가공식품과 당분 섭취 제한',
                '물 충분히 마시기 (하루 8잔 이상)',
                '식사 전 물 한 잔 마시기'
            ];
        } else {
            dietTips = [
                '균형 잡힌 영양소 섭취',
                '규칙적인 식사 시간 유지',
                '신선한 과일과 채소 섭취',
                '적당한 단백질 섭취'
            ];
        }
        
        document.getElementById('dietGuide').innerHTML = dietTips
            .map(tip => `<div class="diet-tip">${tip}</div>`)
            .join('');
    }

    drawMacroChart() {
        const canvas = document.getElementById('macroChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        // Clear canvas
        ctx.clearRect(0, 0, 200, 200);
        
        // Macronutrient data (carbs: 50%, protein: 25%, fat: 25%)
        const data = [
            { label: '탄수화물', value: 50, color: '#4CAF50' },
            { label: '단백질', value: 25, color: '#2196F3' },
            { label: '지방', value: 25, color: '#FF9800' }
        ];
        
        let startAngle = -Math.PI / 2;
        
        data.forEach((segment) => {
            const sliceAngle = (segment.value / 100) * 2 * Math.PI;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.fillStyle = segment.color;
            ctx.fill();
            
            // Draw label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 15);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 15);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${segment.label}\n${segment.value}%`, labelX, labelY);
            
            startAngle += sliceAngle;
        });
    }

    updateExerciseTab(bmi, weight, idealWeight) {
        let exercises = [];
        let workoutPlan = [];
        
        if (bmi < 18.5) {
            exercises = [
                '근력 운동 (웨이트 트레이닝)',
                '복합 운동 (스쿼트, 데드리프트)',
                '단백질 보충과 함께하는 운동',
                '점진적 부하 증가'
            ];
            workoutPlan = [
                '월/수/금: 근력 운동 (1시간)',
                '화/목: 가벼운 유산소 (30분)',
                '주말: 휴식 또는 가벼운 활동'
            ];
        } else if (bmi >= 25) {
            exercises = [
                '유산소 운동 (걷기, 자전거, 수영)',
                'HIIT (고강도 간헐적 운동)',
                '근력 운동 (기초대사량 증가)',
                '일상 활동량 늘리기'
            ];
            workoutPlan = [
                '매일: 유산소 운동 (30-60분)',
                '주 3회: 근력 운동 (45분)',
                '주 2회: HIIT (20-30분)',
                '일상: 계단 이용, 도보 늘리기'
            ];
        } else {
            exercises = [
                '유산소와 무산소 운동 병행',
                '주 3-5회 규칙적인 운동',
                '다양한 운동으로 재미 유지',
                '운동 강도 점진적 증가'
            ];
            workoutPlan = [
                '주 3-4회: 유산소 운동 (45분)',
                '주 2-3회: 근력 운동 (1시간)',
                '주 1회: 플렉시빌리티 운동',
                '주말: 야외 활동 또는 스포츠'
            ];
        }
        
        document.getElementById('exerciseRecommendations').innerHTML = exercises
            .map(exercise => `<div class="exercise-item">${exercise}</div>`)
            .join('');
            
        document.getElementById('workoutPlan').innerHTML = workoutPlan
            .map(plan => `<div class="workout-day">${plan}</div>`)
            .join('');
            
        // Exercise effects
        const effects = [
            { icon: '🔥', title: '칼로리 소모', desc: '일일 에너지 소비량 증가' },
            { icon: '💪', title: '근육량 증가', desc: '기초대사율 향상' },
            { icon: '❤️', title: '심혈관 건강', desc: '혈압과 콜레스테롤 개선' },
            { icon: '🧠', title: '정신 건강', desc: '스트레스 감소, 기분 개선' }
        ];
        
        document.getElementById('exerciseEffects').innerHTML = effects
            .map(effect => `
                <div class="effect-item">
                    <div class="effect-icon">${effect.icon}</div>
                    <strong>${effect.title}</strong>
                    <p>${effect.desc}</p>
                </div>
            `).join('');
    }

    calculateGoal() {
        const targetWeight = parseFloat(this.targetWeightInput.value);
        const timeframe = parseInt(this.timeframeSelect.value);
        const currentWeight = this.currentData.weight;
        
        if (!targetWeight || !currentWeight) {
            alert('현재 체중을 먼저 계산하고 목표 체중을 입력해주세요.');
            return;
        }
        
        const weightDiff = targetWeight - currentWeight;
        const weeklyGoal = (weightDiff / (timeframe * 4)).toFixed(1);
        const dailyCalorieChange = Math.abs(weightDiff) * 7700 / (timeframe * 30); // 1kg = 7700kcal
        
        let goalAnalysis = '';
        if (Math.abs(parseFloat(weeklyGoal)) > 1) {
            goalAnalysis = `
                <div class="goal-details">
                    <h4>⚠️ 주의: 과도한 목표</h4>
                    <p>주간 ${Math.abs(weeklyGoal)}kg ${weightDiff > 0 ? '증가' : '감량'}는 건강에 위험할 수 있습니다.</p>
                    <p>권장: 주간 0.5-1kg 이내의 점진적 변화</p>
                </div>
            `;
        } else {
            goalAnalysis = `
                <div class="goal-details">
                    <h4>🎯 목표 분석</h4>
                    <p>현재 체중: ${currentWeight}kg</p>
                    <p>목표 체중: ${targetWeight}kg</p>
                    <p>목표 기간: ${timeframe}개월</p>
                    <p>주간 목표: ${weightDiff > 0 ? '+' : ''}${weeklyGoal}kg</p>
                    <p>일일 칼로리 조절: ${weightDiff > 0 ? '+' : '-'}${Math.round(dailyCalorieChange)}kcal</p>
                </div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <p>목표까지 ${Math.abs(weightDiff)}kg ${weightDiff > 0 ? '증가' : '감량'} 필요</p>
                </div>
            `;
        }
        
        document.getElementById('goalAnalysis').innerHTML = goalAnalysis;
        this.switchTab('goal');
    }

    switchTab(tabName) {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        this.tabContents.forEach(content => {
            content.classList.toggle('active', content.id === tabName + 'Tab');
        });
    }

    showQuickInfo(preset) {
        const info = {
            underweight: {
                title: '저체중 정보',
                content: 'BMI 18.5 미만으로 체중이 부족한 상태입니다. 균형 잡힌 영양 섭취와 근력 운동을 통해 건강한 체중 증가가 필요합니다.'
            },
            normal: {
                title: '정상 체중 정보', 
                content: 'BMI 18.5-23으로 건강한 체중 범위입니다. 현재 상태를 유지하기 위해 규칙적인 운동과 균형 잡힌 식단을 지속하세요.'
            },
            overweight: {
                title: '과체중 정보',
                content: 'BMI 23-25로 정상보다 약간 높은 상태입니다. 칼로리 조절과 유산소 운동을 통해 점진적인 체중 감량을 권장합니다.'
            },
            obese: {
                title: '비만 정보',
                content: 'BMI 25 이상으로 건강 위험이 증가하는 상태입니다. 전문가 상담을 받아 체계적인 다이어트 계획을 수립하는 것을 권장합니다.'
            }
        };
        
        const selectedInfo = info[preset];
        alert(`${selectedInfo.title}\n\n${selectedInfo.content}`);
    }

    saveToHistory() {
        let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
        
        // Add current data
        history.unshift({
            ...this.currentData,
            id: Date.now()
        });
        
        // Keep only last 10 records
        history = history.slice(0, 10);
        
        localStorage.setItem('bmiHistory', JSON.stringify(history));
        this.loadHealthHistory();
    }

    loadHealthHistory() {
        const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
        
        if (history.length === 0) {
            this.healthHistory.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">📊</div>
                    <p>아직 건강 기록이 없습니다.<br>첫 번째 건강 측정을 시작해보세요!</p>
                </div>
            `;
            return;
        }
        
        this.healthHistory.innerHTML = history.map(record => {
            const status = this.getBMIStatus(record.bmi);
            const statusClass = status.text === '정상' ? 'status-normal' : 
                               status.text === '저체중' ? 'status-underweight' :
                               status.text === '과체중' ? 'status-overweight' : 'status-obese';
            
            return `
                <div class="history-item" data-id="${record.id}">
                    <div class="history-header">
                        <span class="history-date">${record.date}</span>
                        <button class="history-delete" onclick="bmiCalculator.deleteHistoryItem(${record.id})">🗑️</button>
                    </div>
                    <div class="history-metrics">
                        <span>BMI: ${record.bmi}</span>
                        <span>체중: ${record.weight}kg</span>
                        <span>BMR: ${record.bmr}</span>
                        <span>칼로리: ${record.dailyCalories}</span>
                    </div>
                    <div class="history-status ${statusClass}">
                        ${status.text}
                    </div>
                </div>
            `;
        }).join('');
    }

    deleteHistoryItem(id) {
        let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
        history = history.filter(record => record.id !== id);
        localStorage.setItem('bmiHistory', JSON.stringify(history));
        this.loadHealthHistory();
    }

    clearHistory() {
        if (confirm('모든 건강 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('bmiHistory');
            this.loadHealthHistory();
        }
    }

    saveResult() {
        if (!this.currentData.bmi) {
            alert('먼저 건강 지수를 계산해주세요.');
            return;
        }
        
        const resultData = {
            ...this.currentData,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(resultData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BMI_결과_${new Date().toLocaleDateString().replace(/\//g, '')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('결과가 저장되었습니다!');
    }

    shareResult() {
        if (!this.currentData.bmi) {
            alert('먼저 건강 지수를 계산해주세요.');
            return;
        }
        
        const { bmi, bmr, idealWeight, dailyCalories } = this.currentData;
        const status = this.getBMIStatus(bmi);
        
        const shareText = `
나의 건강 지수 📊

BMI: ${bmi} (${status.text})
기초대사율: ${bmr.toLocaleString()} kcal
이상체중: ${idealWeight}kg  
권장 칼로리: ${dailyCalories.toLocaleString()} kcal

#건강관리 #BMI계산기 #짭샵
        `.trim();
        
        if (navigator.share) {
            navigator.share({
                title: '나의 건강 지수 결과',
                text: shareText
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('결과가 클립보드에 복사되었습니다!');
            });
        } else {
            alert(shareText);
        }
    }

    printResult() {
        if (!this.currentData.bmi) {
            alert('먼저 건강 지수를 계산해주세요.');
            return;
        }
        
        const printWindow = window.open('', '_blank');
        const { bmi, bmr, idealWeight, dailyCalories, date, height, weight, age, gender } = this.currentData;
        const status = this.getBMIStatus(bmi);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>BMI 건강 분석 결과</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #4CAF50; text-align: center; }
                    .result-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
                    .result-item { padding: 15px; border: 2px solid #e0e0e0; border-radius: 8px; }
                    .result-item h3 { color: #4CAF50; margin-top: 0; }
                    .highlight { font-size: 1.2em; font-weight: bold; color: #4CAF50; }
                    .footer { text-align: center; margin-top: 30px; color: #666; }
                </style>
            </head>
            <body>
                <h1>⚖️ BMI & 기초대사율 분석 결과</h1>
                
                <div class="result-grid">
                    <div class="result-item">
                        <h3>📋 기본 정보</h3>
                        <p>측정일: ${date}</p>
                        <p>키: ${height}cm</p>
                        <p>몸무게: ${weight}kg</p>
                        <p>나이: ${age}세</p>
                        <p>성별: ${gender === 'male' ? '남성' : '여성'}</p>
                    </div>
                    
                    <div class="result-item">
                        <h3>📊 건강 지표</h3>
                        <p class="highlight">BMI: ${bmi} (${status.text})</p>
                        <p>기초대사율: ${bmr.toLocaleString()} kcal</p>
                        <p>이상체중: ${idealWeight}kg</p>
                        <p>권장 칼로리: ${dailyCalories.toLocaleString()} kcal</p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>이 결과는 참고용이며, 정확한 건강 상담은 전문의와 상의하시기 바랍니다.</p>
                    <p>생성일: ${new Date().toLocaleString()} | 짭샵 유틸리티</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bmiCalculator = new BMICalculator();
});
