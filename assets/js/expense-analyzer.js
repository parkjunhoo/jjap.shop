// 📋 생활비 분석기 JavaScript

class ExpenseAnalyzer {
    constructor() {
        this.currentChart = null;
        this.currentChartType = 'pie';
        this.analysisData = null;
        this.presets = {
            single: {
                income: 2500000,
                housing: 800000,
                food: 300000,
                transportation: 150000,
                necessities: 100000,
                clothing: 50000,
                medical: 30000,
                entertainment: 200000,
                education: 50000,
                others: 80000
            },
            couple: {
                income: 4500000,
                housing: 1200000,
                food: 500000,
                transportation: 250000,
                necessities: 180000,
                clothing: 120000,
                medical: 80000,
                entertainment: 350000,
                education: 100000,
                others: 150000
            },
            family: {
                income: 6000000,
                housing: 1500000,
                food: 800000,
                transportation: 350000,
                necessities: 250000,
                clothing: 200000,
                medical: 120000,
                entertainment: 400000,
                education: 300000,
                others: 200000
            }
        };
        
        this.averageRatios = {
            housing: 30,
            food: 15,
            transportation: 10,
            necessities: 8,
            clothing: 5,
            medical: 3,
            entertainment: 12,
            education: 7,
            others: 10
        };

        this.categoryColors = {
            housing: '#FF6384',
            food: '#36A2EB',
            transportation: '#FFCE56',
            necessities: '#4BC0C0',
            clothing: '#9966FF',
            medical: '#FF9F40',
            entertainment: '#FF6384',
            education: '#C9CBCF',
            others: '#4BC0C0'
        };

        this.categoryInfo = {
            housing: { icon: '🏠', name: '주거비' },
            food: { icon: '🍽️', name: '식비' },
            transportation: { icon: '🚗', name: '교통비' },
            necessities: { icon: '🛒', name: '생필품' },
            clothing: { icon: '👕', name: '의류' },
            medical: { icon: '🏥', name: '의료비' },
            entertainment: { icon: '🎮', name: '여가/문화' },
            education: { icon: '📚', name: '교육' },
            others: { icon: '💳', name: '기타' }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHistory();
    }

    setupEventListeners() {
        // 분석 버튼
        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeExpenses();
        });

        // 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.applyPreset(preset);
            });
        });

        // 차트 탭 전환
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const chartType = e.currentTarget.dataset.chart;
                this.switchChartType(chartType);
            });
        });

        // 예산 설정 버튼
        document.getElementById('setBudgetBtn').addEventListener('click', () => {
            this.showBudgetPlanner();
        });

        // 예산 플래너 닫기
        document.getElementById('closeBudgetBtn').addEventListener('click', () => {
            this.hideBudgetPlanner();
        });

        // 예산 적용 버튼
        document.getElementById('applyBudgetBtn').addEventListener('click', () => {
            this.applyBudget();
        });

        // 분석 저장
        document.getElementById('saveAnalysisBtn').addEventListener('click', () => {
            this.saveAnalysis();
        });

        // 리포트 다운로드
        document.getElementById('downloadReportBtn').addEventListener('click', () => {
            this.downloadReport();
        });

        // 기록 삭제
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // 입력값 변경시 자동 계산 (디바운스)
        const inputs = document.querySelectorAll('#monthlyIncome, #additionalIncome, .category-item input');
        inputs.forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.updateInputSummary();
                }, 500);
            });
        });
    }

    applyPreset(presetType) {
        const preset = this.presets[presetType];
        if (!preset) return;

        // 수입 설정
        document.getElementById('monthlyIncome').value = preset.income;
        document.getElementById('additionalIncome').value = 0;

        // 지출 카테고리 설정
        Object.keys(preset).forEach(key => {
            if (key !== 'income') {
                const input = document.getElementById(key);
                if (input) {
                    input.value = preset[key];
                }
            }
        });

        this.showToast(`${presetType === 'single' ? '1인' : presetType === 'couple' ? '2인' : '4인'} 가구 평균 데이터가 적용되었습니다!`);
        this.updateInputSummary();
    }

    updateInputSummary() {
        const totalIncome = this.getTotalIncome();
        const totalExpense = this.getTotalExpense();
        const remaining = totalIncome - totalExpense;

        // 실시간으로 간단한 요약 업데이트 (필요시)
    }

    getTotalIncome() {
        const monthly = parseFloat(document.getElementById('monthlyIncome').value) || 0;
        const additional = parseFloat(document.getElementById('additionalIncome').value) || 0;
        return monthly + additional;
    }

    getTotalExpense() {
        const categories = ['housing', 'food', 'transportation', 'necessities', 
                          'clothing', 'medical', 'entertainment', 'education', 'others'];
        return categories.reduce((total, category) => {
            const value = parseFloat(document.getElementById(category).value) || 0;
            return total + value;
        }, 0);
    }

    analyzeExpenses() {
        const totalIncome = this.getTotalIncome();
        const totalExpense = this.getTotalExpense();
        const remaining = totalIncome - totalExpense;
        const savingsRate = totalIncome > 0 ? (remaining / totalIncome) * 100 : 0;

        if (totalIncome <= 0) {
            this.showToast('월 수입을 입력해주세요!', 'error');
            return;
        }

        // 카테고리별 데이터 수집
        const categories = ['housing', 'food', 'transportation', 'necessities', 
                          'clothing', 'medical', 'entertainment', 'education', 'others'];
        
        const expenseData = {};
        categories.forEach(category => {
            const amount = parseFloat(document.getElementById(category).value) || 0;
            const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
            const incomeRatio = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
            
            expenseData[category] = {
                amount,
                percentage,
                incomeRatio,
                averageRatio: this.averageRatios[category],
                status: this.getSpendingStatus(incomeRatio, this.averageRatios[category])
            };
        });

        this.analysisData = {
            totalIncome,
            totalExpense,
            remaining,
            savingsRate,
            categories: expenseData,
            timestamp: new Date().toISOString()
        };

        this.displayAnalysisResult();
        this.generateChart();
        this.generateRecommendations();
    }

    getSpendingStatus(ratio, averageRatio) {
        if (ratio <= averageRatio) return 'normal';
        if (ratio <= averageRatio * 1.3) return 'high';
        return 'very-high';
    }

    displayAnalysisResult() {
        const data = this.analysisData;

        // 요약 정보 업데이트
        document.getElementById('totalExpense').textContent = 
            `${data.totalExpense.toLocaleString()}원`;
        document.getElementById('remainingMoney').textContent = 
            `${data.remaining.toLocaleString()}원`;
        document.getElementById('savingsRate').textContent = 
            `${data.savingsRate.toFixed(1)}%`;
        document.getElementById('expenseRatio').textContent = 
            `월 수입의 ${(data.totalExpense / data.totalIncome * 100).toFixed(1)}%`;

        // 카테고리별 상세 정보
        this.displayCategoryDetails();

        // 결과 섹션 표시
        document.getElementById('analysisResult').style.display = 'block';
    }

    displayCategoryDetails() {
        const container = document.getElementById('categoryDetails');
        const data = this.analysisData;
        
        container.innerHTML = '';

        Object.keys(data.categories).forEach(category => {
            const categoryData = data.categories[category];
            const info = this.categoryInfo[category];
            
            const card = document.createElement('div');
            card.className = 'detail-card';
            
            const statusText = {
                'normal': '적정',
                'high': '주의',
                'very-high': '과다'
            };

            card.innerHTML = `
                <div class="detail-header">
                    <span class="detail-icon">${info.icon}</span>
                    <span class="detail-name">${info.name}</span>
                </div>
                <div class="detail-amount">${categoryData.amount.toLocaleString()}원</div>
                <div class="detail-percentage">전체의 ${categoryData.percentage.toFixed(1)}%</div>
                <div class="detail-percentage">수입의 ${categoryData.incomeRatio.toFixed(1)}% (평균: ${categoryData.averageRatio}%)</div>
                <span class="detail-status ${categoryData.status}">${statusText[categoryData.status]}</span>
            `;
            
            container.appendChild(card);
        });
    }

    generateChart() {
        const canvas = document.getElementById('expenseChart');
        const ctx = canvas.getContext('2d');

        if (this.currentChart) {
            this.currentChart.destroy();
        }

        this.renderChart(this.currentChartType);
    }

    renderChart(type) {
        const canvas = document.getElementById('expenseChart');
        const ctx = canvas.getContext('2d');
        const data = this.analysisData;

        const labels = Object.keys(data.categories).map(key => this.categoryInfo[key].name);
        const values = Object.keys(data.categories).map(key => data.categories[key].amount);
        const colors = Object.keys(data.categories).map(key => this.categoryColors[key]);

        let chartConfig;

        switch (type) {
            case 'pie':
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels,
                        datasets: [{
                            data: values,
                            backgroundColor: colors,
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    usePointStyle: true,
                                    padding: 15
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const percentage = (context.parsed / data.totalExpense * 100).toFixed(1);
                                        return `${context.label}: ${context.parsed.toLocaleString()}원 (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                };
                break;

            case 'bar':
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [{
                            label: '지출 금액',
                            data: values,
                            backgroundColor: colors,
                            borderColor: colors,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => `${value.toLocaleString()}원`
                                }
                            }
                        },
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.parsed.y.toLocaleString()}원`
                                }
                            }
                        }
                    }
                };
                break;

            case 'comparison':
                const currentRatios = Object.keys(data.categories).map(key => data.categories[key].incomeRatio);
                const averageRatios = Object.keys(data.categories).map(key => this.averageRatios[key]);

                chartConfig = {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [
                            {
                                label: '내 지출 비율',
                                data: currentRatios,
                                backgroundColor: 'rgba(33, 150, 243, 0.6)',
                                borderColor: '#2196F3',
                                borderWidth: 1
                            },
                            {
                                label: '평균 지출 비율',
                                data: averageRatios,
                                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                                borderColor: '#4CAF50',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => `${value}%`
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top'
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
                                }
                            }
                        }
                    }
                };
                break;
        }

        this.currentChart = new Chart(ctx, chartConfig);
    }

    switchChartType(type) {
        this.currentChartType = type;
        
        // 탭 활성화 상태 업데이트
        document.querySelectorAll('.chart-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-chart="${type}"]`).classList.add('active');

        // 차트 다시 그리기
        if (this.analysisData) {
            this.renderChart(type);
        }
    }

    generateRecommendations() {
        const container = document.getElementById('savingTips');
        const data = this.analysisData;
        const tips = [];

        // 각 카테고리별 추천사항 생성
        Object.keys(data.categories).forEach(category => {
            const categoryData = data.categories[category];
            const info = this.categoryInfo[category];
            
            if (categoryData.status === 'high' || categoryData.status === 'very-high') {
                const potentialSaving = categoryData.amount - (data.totalIncome * categoryData.averageRatio / 100);
                if (potentialSaving > 0) {
                    tips.push({
                        category: info.name,
                        icon: info.icon,
                        priority: categoryData.status === 'very-high' ? 'HIGH' : 'MID',
                        description: this.getCategoryTip(category),
                        potentialSaving: Math.round(potentialSaving)
                    });
                }
            }
        });

        // 저축률 기반 추천
        if (data.savingsRate < 10) {
            tips.unshift({
                category: '긴급 절약',
                icon: '🚨',
                priority: 'HIGH',
                description: '저축률이 10% 미만입니다. 비상금 확보를 위해 즉시 지출을 줄이세요.',
                potentialSaving: data.totalIncome * 0.1 - data.remaining
            });
        }

        this.displayRecommendations(tips);
    }

    getCategoryTip(category) {
        const tips = {
            housing: '더 저렴한 지역으로 이사하거나 룸메이트와 함께 살아보세요. 전세 대출을 활용하거나 관리비 절약 방법을 찾아보세요.',
            food: '외식을 줄이고 집에서 요리하세요. 할인 마트 이용하고 냉장고 재료를 활용한 요리를 해보세요.',
            transportation: '대중교통 정기권을 이용하거나 자전거, 도보를 늘려보세요. 카셰어링이나 택시 대신 버스/지하철을 이용하세요.',
            necessities: '할인점이나 온라인 쇼핑을 통해 더 저렴하게 구매하고, 불필요한 용품 구매를 줄여보세요.',
            clothing: '세일 기간을 노리거나 중고 옷을 활용해보세요. 옷장을 정리해 이미 있는 옷들을 더 활용하세요.',
            medical: '건강 관리를 통해 병원비를 예방하고, 건강보험 혜택을 최대한 활용하세요.',
            entertainment: '무료 문화 행사나 할인 혜택을 활용하고, 구독 서비스를 정리해보세요.',
            education: '온라인 강의나 도서관을 활용하고, 교육비 지원 정책을 찾아보세요.',
            others: '가계부를 작성해 불필요한 지출을 찾고, 충동구매를 줄여보세요.'
        };
        return tips[category] || '지출을 줄일 수 있는 방법을 찾아보세요.';
    }

    displayRecommendations(tips) {
        const container = document.getElementById('savingTips');
        container.innerHTML = '';

        if (tips.length === 0) {
            container.innerHTML = `
                <div class="tip-item">
                    <div class="tip-priority" style="background: #4CAF50;">GOOD</div>
                    <div class="tip-content">
                        <div class="tip-title">🎉 훌륭한 가계 관리!</div>
                        <div class="tip-description">모든 카테고리에서 적정 수준의 지출을 유지하고 있습니다. 현재 패턴을 유지하세요!</div>
                    </div>
                </div>
            `;
            return;
        }

        // 우선순위별 정렬
        tips.sort((a, b) => {
            const priorityOrder = { HIGH: 3, MID: 2, LOW: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'tip-item';
            
            const priorityColor = {
                HIGH: '#f44336',
                MID: '#ff9800',
                LOW: '#4caf50'
            };

            tipElement.innerHTML = `
                <div class="tip-priority" style="background: ${priorityColor[tip.priority]}">${tip.priority}</div>
                <div class="tip-content">
                    <div class="tip-title">${tip.icon} ${tip.category}</div>
                    <div class="tip-description">${tip.description}</div>
                    <div class="tip-saving">💰 예상 절약액: ${tip.potentialSaving.toLocaleString()}원/월</div>
                </div>
            `;
            
            container.appendChild(tipElement);
        });
    }

    showBudgetPlanner() {
        document.getElementById('budgetPlanner').style.display = 'block';
        this.setupBudgetPlanner();
    }

    hideBudgetPlanner() {
        document.getElementById('budgetPlanner').style.display = 'none';
    }

    setupBudgetPlanner() {
        const container = document.getElementById('budgetCategories');
        const data = this.analysisData;
        
        container.innerHTML = '';

        Object.keys(data.categories).forEach(category => {
            const categoryData = data.categories[category];
            const info = this.categoryInfo[category];
            
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-item';
            
            budgetItem.innerHTML = `
                <div class="budget-info">
                    <span>${info.icon} ${info.name}</span>
                    <span class="budget-current">(현재: ${categoryData.amount.toLocaleString()}원)</span>
                </div>
                <div class="input-with-unit">
                    <input type="number" id="budget_${category}" value="${categoryData.amount}" min="0" step="10000">
                    <span class="unit">원</span>
                </div>
            `;
            
            container.appendChild(budgetItem);
        });

        // 예산 입력값 변경 이벤트
        const budgetInputs = container.querySelectorAll('input');
        budgetInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateBudgetSummary();
            });
        });

        // 목표 저축액 변경 이벤트
        document.getElementById('targetSaving').addEventListener('input', () => {
            this.updateBudgetSummary();
        });

        this.updateBudgetSummary();
    }

    updateBudgetSummary() {
        const data = this.analysisData;
        const targetSaving = parseFloat(document.getElementById('targetSaving').value) || 0;
        
        let adjustedTotal = 0;
        Object.keys(data.categories).forEach(category => {
            const budgetInput = document.getElementById(`budget_${category}`);
            if (budgetInput) {
                adjustedTotal += parseFloat(budgetInput.value) || 0;
            }
        });

        const projectedSavings = data.totalIncome - adjustedTotal;

        document.getElementById('adjustedTotal').textContent = `${adjustedTotal.toLocaleString()}원`;
        document.getElementById('projectedSavings').textContent = `${projectedSavings.toLocaleString()}원`;

        // 색상 변경
        const projectedElement = document.getElementById('projectedSavings');
        if (projectedSavings >= targetSaving) {
            projectedElement.style.color = '#4CAF50';
        } else {
            projectedElement.style.color = '#f44336';
        }
    }

    applyBudget() {
        const data = this.analysisData;
        
        // 예산 값을 실제 입력 필드에 적용
        Object.keys(data.categories).forEach(category => {
            const budgetInput = document.getElementById(`budget_${category}`);
            const actualInput = document.getElementById(category);
            if (budgetInput && actualInput) {
                actualInput.value = budgetInput.value;
            }
        });

        this.hideBudgetPlanner();
        this.analyzeExpenses(); // 다시 분석
        this.showToast('예산이 적용되었습니다!');
    }

    saveAnalysis() {
        if (!this.analysisData) return;

        const history = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        
        const analysisRecord = {
            ...this.analysisData,
            id: Date.now(),
            date: new Date().toLocaleDateString()
        };

        history.unshift(analysisRecord);
        
        // 최대 20개까지만 저장
        if (history.length > 20) {
            history.splice(20);
        }

        localStorage.setItem('expenseHistory', JSON.stringify(history));
        this.loadHistory();
        this.showToast('분석 결과가 저장되었습니다!');
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        const container = document.getElementById('analysisHistory');

        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">📊</div>
                    <p>아직 분석 기록이 없습니다.<br>지출을 분석하면 기록이 저장됩니다!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        history.forEach(record => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-header">
                    <span class="history-date">${record.date}</span>
                    <button class="history-delete" onclick="expenseAnalyzer.deleteHistory(${record.id})">🗑️</button>
                </div>
                <div class="history-summary">
                    <span>수입: ${record.totalIncome.toLocaleString()}원</span>
                    <span>지출: ${record.totalExpense.toLocaleString()}원</span>
                    <span>저축률: ${record.savingsRate.toFixed(1)}%</span>
                </div>
            `;
            
            // 클릭시 해당 데이터로 복원
            historyItem.addEventListener('click', () => {
                this.restoreFromHistory(record);
            });
            
            container.appendChild(historyItem);
        });
    }

    deleteHistory(id) {
        const history = JSON.parse(localStorage.getItem('expenseHistory') || '[]');
        const filteredHistory = history.filter(record => record.id !== id);
        localStorage.setItem('expenseHistory', JSON.stringify(filteredHistory));
        this.loadHistory();
        this.showToast('기록이 삭제되었습니다.');
    }

    restoreFromHistory(record) {
        // 수입 복원
        document.getElementById('monthlyIncome').value = record.totalIncome;
        document.getElementById('additionalIncome').value = 0;

        // 카테고리 복원
        Object.keys(record.categories).forEach(category => {
            const input = document.getElementById(category);
            if (input) {
                input.value = record.categories[category].amount;
            }
        });

        // 분석 실행
        this.analyzeExpenses();
        this.showToast('기록이 복원되었습니다!');
    }

    clearHistory() {
        if (confirm('모든 분석 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('expenseHistory');
            this.loadHistory();
            this.showToast('모든 기록이 삭제되었습니다.');
        }
    }

    downloadReport() {
        if (!this.analysisData) return;

        const reportData = this.generateReportData();
        this.downloadAsImage(reportData);
    }

    generateReportData() {
        const data = this.analysisData;
        const date = new Date().toLocaleDateString();

        return {
            title: `생활비 분석 리포트 - ${date}`,
            summary: {
                totalIncome: data.totalIncome,
                totalExpense: data.totalExpense,
                remaining: data.remaining,
                savingsRate: data.savingsRate
            },
            categories: data.categories,
            categoryInfo: this.categoryInfo
        };
    }

    downloadAsImage(reportData) {
        // Canvas로 리포트 이미지 생성
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');

        // 배경
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 제목
        ctx.fillStyle = '#2196F3';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(reportData.title, 400, 50);

        // 요약 정보
        let y = 100;
        ctx.fillStyle = '#333';
        ctx.font = '18px Arial';
        ctx.textAlign = 'left';
        
        ctx.fillText(`총 수입: ${reportData.summary.totalIncome.toLocaleString()}원`, 50, y);
        y += 30;
        ctx.fillText(`총 지출: ${reportData.summary.totalExpense.toLocaleString()}원`, 50, y);
        y += 30;
        ctx.fillText(`남은 돈: ${reportData.summary.remaining.toLocaleString()}원`, 50, y);
        y += 30;
        ctx.fillText(`저축률: ${reportData.summary.savingsRate.toFixed(1)}%`, 50, y);

        // 카테고리별 상세
        y += 60;
        ctx.fillStyle = '#2196F3';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('카테고리별 지출', 50, y);

        y += 40;
        ctx.font = '16px Arial';
        Object.keys(reportData.categories).forEach(category => {
            const categoryData = reportData.categories[category];
            const info = reportData.categoryInfo[category];
            
            ctx.fillStyle = '#333';
            ctx.fillText(`${info.icon} ${info.name}:`, 50, y);
            ctx.fillText(`${categoryData.amount.toLocaleString()}원`, 300, y);
            ctx.fillText(`(${categoryData.percentage.toFixed(1)}%)`, 500, y);
            y += 25;
        });

        // 다운로드
        const link = document.createElement('a');
        link.download = `생활비분석_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL();
        link.click();

        this.showToast('리포트가 다운로드되었습니다!');
    }

    showToast(message, type = 'success') {
        // 토스트 메시지 표시
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 애니메이션
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
const expenseAnalyzer = new ExpenseAnalyzer();

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 추가 초기화가 필요한 경우
});
