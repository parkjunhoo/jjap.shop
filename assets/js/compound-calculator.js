// 📊 복리 계산기 JavaScript

class CompoundCalculator {
    constructor() {
        this.currentResult = null;
        this.savedCalculations = JSON.parse(localStorage.getItem('compoundCalculations')) || [];
        this.comparisonData = [];
        this.growthChart = null;
        this.comparisonChart = null;
        
        // 프리셋 데이터
        this.presets = {
            conservative: {
                initialAmount: 5000000,
                monthlyContribution: 500000,
                annualReturn: 4,
                investmentPeriod: 10,
                compoundFrequency: 12,
                taxRate: 15.4,
                inflationRate: 2.5
            },
            balanced: {
                initialAmount: 3000000,
                monthlyContribution: 400000,
                annualReturn: 7,
                investmentPeriod: 15,
                compoundFrequency: 12,
                taxRate: 15.4,
                inflationRate: 2.5
            },
            aggressive: {
                initialAmount: 2000000,
                monthlyContribution: 300000,
                annualReturn: 10,
                investmentPeriod: 20,
                compoundFrequency: 12,
                taxRate: 15.4,
                inflationRate: 2.5
            },
            retirement: {
                initialAmount: 10000000,
                monthlyContribution: 1000000,
                annualReturn: 6,
                investmentPeriod: 30,
                compoundFrequency: 12,
                taxRate: 15.4,
                inflationRate: 2.5
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderSavedCalculations();
        this.renderComparisons();
        this.showNotification('복리 계산기가 준비되었습니다! 📊', 'success');
    }
    
    setupEventListeners() {
        // 계산 폼
        document.getElementById('compoundForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateCompound();
        });
        
        // 프리셋 버튼들
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.loadPreset(preset);
            });
        });
        
        // 결과 액션 버튼들
        document.getElementById('saveResultBtn').addEventListener('click', () => {
            this.saveResult();
        });
        
        document.getElementById('shareResultBtn').addEventListener('click', () => {
            this.shareResult();
        });
        
        document.getElementById('compareBtn').addEventListener('click', () => {
            this.addToComparison();
        });
        
        // 뷰 옵션 버튼들
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
        
        // 비교 및 저장 관련
        document.getElementById('clearComparisonsBtn').addEventListener('click', () => {
            this.clearComparisons();
        });
        
        document.getElementById('clearSavedBtn').addEventListener('click', () => {
            this.clearSavedCalculations();
        });
        
        // 모달 관련
        document.getElementById('comparisonModal').addEventListener('click', (e) => {
            if (e.target.id === 'comparisonModal') {
                this.closeComparisonModal();
            }
        });
        
        document.querySelector('#comparisonModal .modal-close').addEventListener('click', () => {
            this.closeComparisonModal();
        });
        
        // 입력값 변경 시 실시간 계산
        this.setupRealTimeCalculation();
    }
    
    setupRealTimeCalculation() {
        const inputs = ['initialAmount', 'monthlyContribution', 'annualReturn', 'investmentPeriod'];
        inputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => {
                // 500ms 딜레이 후 자동 계산
                clearTimeout(this.calcTimeout);
                this.calcTimeout = setTimeout(() => {
                    if (this.isFormValid()) {
                        this.calculateCompound(true); // silent 모드
                    }
                }, 500);
            });
        });
    }
    
    loadPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;
        
        Object.keys(preset).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = preset[key];
            }
        });
        
        this.showNotification(`${presetKey} 시나리오가 적용되었습니다! 🎯`, 'success');
        
        // 자동 계산
        setTimeout(() => {
            this.calculateCompound();
        }, 100);
    }
    
    isFormValid() {
        const required = ['initialAmount', 'annualReturn', 'investmentPeriod'];
        return required.every(id => {
            const element = document.getElementById(id);
            return element && element.value && parseFloat(element.value) > 0;
        });
    }
    
    calculateCompound(silent = false) {
        if (!this.isFormValid()) {
            if (!silent) {
                this.showNotification('필수 입력 값을 확인해주세요!', 'error');
            }
            return;
        }
        
        const data = this.getFormData();
        const result = this.performCalculation(data);
        
        this.currentResult = {
            ...result,
            inputData: data,
            calculatedAt: new Date().toISOString()
        };
        
        this.displayResult(result);
        
        if (!silent) {
            this.showNotification('계산이 완료되었습니다! 📈', 'success');
        }
    }
    
    getFormData() {
        return {
            initialAmount: parseFloat(document.getElementById('initialAmount').value) || 0,
            monthlyContribution: parseFloat(document.getElementById('monthlyContribution').value) || 0,
            annualReturn: parseFloat(document.getElementById('annualReturn').value),
            investmentPeriod: parseInt(document.getElementById('investmentPeriod').value),
            compoundFrequency: parseInt(document.getElementById('compoundFrequency').value),
            taxRate: parseFloat(document.getElementById('taxRate').value) || 0,
            inflationRate: parseFloat(document.getElementById('inflationRate').value) || 0
        };
    }
    
    performCalculation(data) {
        const {
            initialAmount,
            monthlyContribution,
            annualReturn,
            investmentPeriod,
            compoundFrequency,
            taxRate,
            inflationRate
        } = data;
        
        const monthlyRate = annualReturn / 100 / 12;
        const totalMonths = investmentPeriod * 12;
        
        let yearlyData = [];
        let currentAmount = initialAmount;
        let totalInvestment = initialAmount;
        
        for (let year = 1; year <= investmentPeriod; year++) {
            const yearStartAmount = currentAmount;
            const yearStartInvestment = totalInvestment;
            
            // 월별 복리 계산
            for (let month = 1; month <= 12; month++) {
                // 기존 금액에 대한 복리
                currentAmount *= (1 + monthlyRate);
                
                // 월 적립금 추가
                if (monthlyContribution > 0) {
                    currentAmount += monthlyContribution;
                    totalInvestment += monthlyContribution;
                }
            }
            
            // 세금 적용 (연말에 한 번)
            const yearlyGain = currentAmount - yearStartAmount - (monthlyContribution * 12);
            const taxAmount = yearlyGain * (taxRate / 100);
            currentAmount -= taxAmount;
            
            // 연도별 데이터 저장
            yearlyData.push({
                year: year,
                amount: Math.round(currentAmount),
                investment: Math.round(totalInvestment),
                gain: Math.round(currentAmount - totalInvestment),
                realAmount: Math.round(currentAmount / Math.pow(1 + inflationRate / 100, year)),
                yearlyContribution: monthlyContribution * 12,
                yearlyReturn: Math.round(yearlyGain),
                taxPaid: Math.round(taxAmount)
            });
        }
        
        const finalAmount = currentAmount;
        const totalProfit = finalAmount - totalInvestment;
        const totalReturn = ((finalAmount - totalInvestment) / totalInvestment) * 100;
        const realPurchasingPower = finalAmount / Math.pow(1 + inflationRate / 100, investmentPeriod);
        
        return {
            finalAmount: Math.round(finalAmount),
            totalInvestment: Math.round(totalInvestment),
            totalProfit: Math.round(totalProfit),
            totalReturn: Math.round(totalReturn * 100) / 100,
            realPurchasingPower: Math.round(realPurchasingPower),
            yearlyData: yearlyData,
            averageAnnualReturn: Math.round((Math.pow(finalAmount / initialAmount, 1 / investmentPeriod) - 1) * 10000) / 100
        };
    }
    
    displayResult(result) {
        // 결과 카드 표시
        document.getElementById('resultCard').style.display = 'block';
        
        // 주요 지표 업데이트
        document.getElementById('finalAmount').textContent = this.formatCurrency(result.finalAmount);
        document.getElementById('totalInvestment').textContent = this.formatCurrency(result.totalInvestment);
        document.getElementById('totalProfit').textContent = this.formatCurrency(result.totalProfit);
        document.getElementById('realPurchasingPower').textContent = this.formatCurrency(result.realPurchasingPower);
        document.getElementById('totalReturn').textContent = `+${result.totalReturn}%`;
        
        // 차트 생성
        this.createGrowthChart(result);
        
        // 상세 테이블 생성
        this.createBreakdownTable(result);
        
        // 요약 보기 생성
        this.createSummaryView(result);
    }
    
    createGrowthChart(result) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        
        // 기존 차트 제거
        if (this.growthChart) {
            this.growthChart.destroy();
        }
        
        const years = result.yearlyData.map(d => `${d.year}년`);
        const amounts = result.yearlyData.map(d => d.amount);
        const investments = result.yearlyData.map(d => d.investment);
        const realAmounts = result.yearlyData.map(d => d.realAmount);
        
        this.growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: '총 자산',
                    data: amounts,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '투자원금',
                    data: investments,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: '실질 구매력',
                    data: realAmounts,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    borderDash: [5, 5]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + 
                                       new Intl.NumberFormat('ko-KR').format(context.parsed.y) + '원';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('ko-KR', {
                                    notation: 'compact',
                                    compactDisplay: 'short'
                                }).format(value) + '원';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    createBreakdownTable(result) {
        const container = document.getElementById('breakdownTable');
        
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>연도</th>
                        <th>연간 적립</th>
                        <th>누적 투자</th>
                        <th>연간 수익</th>
                        <th>세금</th>
                        <th>총 자산</th>
                        <th>실질 가치</th>
                    </tr>
                </thead>
                <tbody>
                    ${result.yearlyData.map(data => `
                        <tr>
                            <td>${data.year}년</td>
                            <td>${this.formatCurrency(data.yearlyContribution)}</td>
                            <td>${this.formatCurrency(data.investment)}</td>
                            <td style="color: ${data.yearlyReturn > 0 ? '#4CAF50' : '#f44336'}">
                                ${this.formatCurrency(data.yearlyReturn)}
                            </td>
                            <td>${this.formatCurrency(data.taxPaid)}</td>
                            <td><strong>${this.formatCurrency(data.amount)}</strong></td>
                            <td>${this.formatCurrency(data.realAmount)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    createSummaryView(result) {
        const container = document.getElementById('summaryView');
        
        const avgMonthlyGain = result.totalProfit / (result.yearlyData.length * 12);
        const monthsToDoubleInvestment = result.totalInvestment / avgMonthlyGain;
        const effectiveAnnualRate = result.averageAnnualReturn;
        
        container.innerHTML = `
            <div class="summary-card">
                <h5>평균 연 수익률</h5>
                <div style="font-size: 1.5rem; color: #4CAF50; font-weight: bold;">
                    ${effectiveAnnualRate}%
                </div>
            </div>
            <div class="summary-card">
                <h5>월 평균 수익</h5>
                <div style="font-size: 1.2rem; color: #2196F3;">
                    ${this.formatCurrency(Math.round(avgMonthlyGain))}
                </div>
            </div>
            <div class="summary-card">
                <h5>투자금 2배 달성</h5>
                <div style="font-size: 1.2rem; color: #FF9800;">
                    약 ${Math.round(monthsToDoubleInvestment / 12 * 10) / 10}년
                </div>
            </div>
            <div class="summary-card">
                <h5>인플레이션 대비</h5>
                <div style="font-size: 1.2rem; color: ${result.realPurchasingPower > result.totalInvestment ? '#4CAF50' : '#f44336'};">
                    ${result.realPurchasingPower > result.totalInvestment ? '양호' : '주의'}
                </div>
            </div>
        `;
    }
    
    switchView(viewType) {
        // 버튼 활성화 상태 변경
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
        
        // 뷰 전환
        if (viewType === 'table') {
            document.getElementById('breakdownTable').style.display = 'block';
            document.getElementById('summaryView').style.display = 'none';
        } else {
            document.getElementById('breakdownTable').style.display = 'none';
            document.getElementById('summaryView').style.display = 'block';
        }
    }
    
    saveResult() {
        if (!this.currentResult) {
            this.showNotification('저장할 계산 결과가 없습니다!', 'error');
            return;
        }
        
        const name = prompt('계산 결과의 이름을 입력하세요:', 
            `${this.currentResult.inputData.annualReturn}% ${this.currentResult.inputData.investmentPeriod}년 투자`);
        
        if (!name) return;
        
        const savedItem = {
            id: Date.now().toString(),
            name: name,
            result: this.currentResult,
            savedAt: new Date().toISOString()
        };
        
        this.savedCalculations.push(savedItem);
        this.savesToStorage();
        this.renderSavedCalculations();
        
        this.showNotification(`"${name}" 계산 결과가 저장되었습니다! 💾`, 'success');
    }
    
    shareResult() {
        if (!this.currentResult) {
            this.showNotification('공유할 계산 결과가 없습니다!', 'error');
            return;
        }
        
        const result = this.currentResult;
        const shareText = `💰 복리 투자 계산 결과

📊 투자 조건:
• 초기 투자금: ${this.formatCurrency(result.inputData.initialAmount)}
• 월 적립금: ${this.formatCurrency(result.inputData.monthlyContribution)}
• 연 수익률: ${result.inputData.annualReturn}%
• 투자 기간: ${result.inputData.investmentPeriod}년

💎 최종 결과:
• 최종 자산: ${this.formatCurrency(result.finalAmount)}
• 총 수익: ${this.formatCurrency(result.totalProfit)} (+${result.totalReturn}%)
• 실질 구매력: ${this.formatCurrency(result.realPurchasingPower)}

짭샵 복리 계산기로 계산했습니다!`;
        
        if (navigator.share) {
            navigator.share({
                title: '복리 투자 계산 결과',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('계산 결과가 클립보드에 복사되었습니다! 📋', 'success');
            });
        }
    }
    
    addToComparison() {
        if (!this.currentResult) {
            this.showNotification('비교에 추가할 계산 결과가 없습니다!', 'error');
            return;
        }
        
        const name = prompt('비교 항목의 이름을 입력하세요:', 
            `시나리오 ${this.comparisonData.length + 1}`);
        
        if (!name) return;
        
        this.comparisonData.push({
            id: Date.now().toString(),
            name: name,
            result: { ...this.currentResult }
        });
        
        this.renderComparisons();
        this.showNotification(`"${name}"이 비교 목록에 추가되었습니다! ⚖️`, 'success');
    }
    
    showComparisonModal() {
        if (this.comparisonData.length < 2) {
            this.showNotification('비교하려면 최소 2개의 시나리오가 필요합니다!', 'error');
            return;
        }
        
        document.getElementById('comparisonModal').style.display = 'block';
        this.createComparisonChart();
        this.createComparisonTable();
    }
    
    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        
        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }
        
        const maxYears = Math.max(...this.comparisonData.map(item => 
            item.result.yearlyData.length));
        
        const datasets = this.comparisonData.map((item, index) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#f44336'];
            const color = colors[index % colors.length];
            
            return {
                label: item.name,
                data: item.result.yearlyData.map(d => d.amount),
                borderColor: color,
                backgroundColor: color + '20',
                tension: 0.4
            };
        });
        
        this.comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: maxYears}, (_, i) => `${i + 1}년`),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('ko-KR', {
                                    notation: 'compact'
                                }).format(value) + '원';
                            }
                        }
                    }
                }
            }
        });
    }
    
    createComparisonTable() {
        const container = document.getElementById('comparisonTable');
        
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>시나리오</th>
                        <th>투자 기간</th>
                        <th>연 수익률</th>
                        <th>최종 자산</th>
                        <th>총 수익</th>
                        <th>수익률</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.comparisonData.map(item => `
                        <tr>
                            <td><strong>${item.name}</strong></td>
                            <td>${item.result.inputData.investmentPeriod}년</td>
                            <td>${item.result.inputData.annualReturn}%</td>
                            <td>${this.formatCurrency(item.result.finalAmount)}</td>
                            <td>${this.formatCurrency(item.result.totalProfit)}</td>
                            <td style="color: #4CAF50"><strong>+${item.result.totalReturn}%</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }
    
    closeComparisonModal() {
        document.getElementById('comparisonModal').style.display = 'none';
    }
    
    renderSavedCalculations() {
        const container = document.getElementById('savedCalculationsList');
        
        if (this.savedCalculations.length === 0) {
            container.innerHTML = `
                <div class="empty-saved">
                    <div class="empty-icon">💰</div>
                    <p>계산 결과를 저장하여<br>나중에 다시 확인해보세요!</p>
                </div>
            `;
            return;
        }
        
        const sortedItems = [...this.savedCalculations].sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt));
        
        container.innerHTML = sortedItems.map(item => {
            const savedDate = new Date(item.savedAt).toLocaleDateString('ko-KR');
            const result = item.result;
            
            return `
                <div class="saved-item">
                    <div class="item-header">
                        <div class="item-name">${item.name}</div>
                        <div class="item-actions">
                            <button class="item-action-btn" onclick="compoundCalculator.loadSavedCalculation('${item.id}')" title="불러오기">📂</button>
                            <button class="item-action-btn" onclick="compoundCalculator.removeSavedCalculation('${item.id}')" title="삭제">🗑️</button>
                        </div>
                    </div>
                    <div class="item-details">
                        <span>최종: ${this.formatCurrency(result.finalAmount)}</span>
                        <span>수익률: +${result.totalReturn}%</span>
                        <span>기간: ${result.inputData.investmentPeriod}년</span>
                        <span>${savedDate}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    renderComparisons() {
        const container = document.getElementById('comparisonList');
        
        if (this.comparisonData.length === 0) {
            container.innerHTML = `
                <div class="empty-comparison">
                    <div class="empty-icon">⚖️</div>
                    <p>여러 투자 시나리오를 계산하고<br>"비교" 버튼을 눌러 비교해보세요!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = `
            <div style="margin-bottom: 15px;">
                <button onclick="compoundCalculator.showComparisonModal()" 
                        class="action-btn" style="width: 100%; background: #4CAF50; color: white; border: none;">
                    📊 ${this.comparisonData.length}개 시나리오 비교하기
                </button>
            </div>
            ${this.comparisonData.map(item => {
                const result = item.result;
                
                return `
                    <div class="comparison-item">
                        <div class="item-header">
                            <div class="item-name">${item.name}</div>
                            <button class="item-action-btn" onclick="compoundCalculator.removeComparison('${item.id}')" title="제거">✕</button>
                        </div>
                        <div class="item-details">
                            <span>최종: ${this.formatCurrency(result.finalAmount)}</span>
                            <span>수익률: +${result.totalReturn}%</span>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }
    
    loadSavedCalculation(itemId) {
        const item = this.savedCalculations.find(calc => calc.id === itemId);
        if (!item) return;
        
        const inputData = item.result.inputData;
        
        // 폼에 데이터 로드
        Object.keys(inputData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = inputData[key];
            }
        });
        
        // 결과 표시
        this.currentResult = item.result;
        this.displayResult(item.result);
        
        this.showNotification(`"${item.name}" 계산이 불러와졌습니다! 📂`, 'success');
    }
    
    removeSavedCalculation(itemId) {
        if (confirm('저장된 계산을 삭제하시겠습니까?')) {
            this.savedCalculations = this.savedCalculations.filter(item => item.id !== itemId);
            this.savesToStorage();
            this.renderSavedCalculations();
            this.showNotification('계산이 삭제되었습니다', 'info');
        }
    }
    
    removeComparison(itemId) {
        this.comparisonData = this.comparisonData.filter(item => item.id !== itemId);
        this.renderComparisons();
        this.showNotification('비교 항목이 제거되었습니다', 'info');
    }
    
    clearSavedCalculations() {
        if (this.savedCalculations.length === 0) {
            this.showNotification('삭제할 계산이 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 저장된 계산을 삭제하시겠습니까?')) {
            this.savedCalculations = [];
            this.savesToStorage();
            this.renderSavedCalculations();
            this.showNotification('모든 계산이 삭제되었습니다', 'info');
        }
    }
    
    clearComparisons() {
        if (this.comparisonData.length === 0) {
            this.showNotification('비교할 항목이 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 비교 항목을 초기화하시겠습니까?')) {
            this.comparisonData = [];
            this.renderComparisons();
            this.showNotification('비교가 초기화되었습니다', 'info');
        }
    }
    
    savesToStorage() {
        localStorage.setItem('compoundCalculations', JSON.stringify(this.savedCalculations));
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('ko-KR').format(Math.round(amount)) + '원';
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.compound-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `compound-notification compound-notification-${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#4CAF50'
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
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">
                    &times;
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.compoundCalculator = new CompoundCalculator();
});
