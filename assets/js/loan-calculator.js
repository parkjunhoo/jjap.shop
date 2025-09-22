// 🏦 할부/대출 계산기 JavaScript

class LoanCalculator {
    constructor() {
        this.currentChart = null;
        this.currentChartType = 'payment';
        this.loanData = null;
        this.comparisonLoans = [];
        
        this.presets = {
            house: {
                amount: 100000000,
                rate: 3.5,
                term: 30,
                type: 'equal_payment'
            },
            car: {
                amount: 50000000,
                rate: 4.8,
                term: 5,
                type: 'equal_payment'
            },
            credit: {
                amount: 30000000,
                rate: 6.5,
                term: 3,
                type: 'equal_payment'
            },
            jeonse: {
                amount: 500000000,
                rate: 2.8,
                term: 20,
                type: 'equal_payment'
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setDefaultDate();
        this.loadHistory();
    }

    setupEventListeners() {
        // 계산 버튼
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateLoan();
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

        // 조기상환 시뮬레이션
        document.getElementById('earlyPaymentBtn').addEventListener('click', () => {
            this.showEarlyPaymentModal();
        });

        document.getElementById('closeEarlyPaymentBtn').addEventListener('click', () => {
            this.hideEarlyPaymentModal();
        });

        document.getElementById('simulateEarlyBtn').addEventListener('click', () => {
            this.simulateEarlyPayment();
        });

        // 비교 기능
        document.getElementById('addLoanBtn').addEventListener('click', () => {
            this.addLoanToComparison();
        });

        document.getElementById('compareBtn').addEventListener('click', () => {
            this.showComparisonResult();
        });

        document.getElementById('closeComparisonBtn').addEventListener('click', () => {
            this.hideComparisonResult();
        });

        // 상환 일정표 보기 변경
        document.getElementById('scheduleView').addEventListener('change', (e) => {
            this.updateScheduleView(e.target.value);
        });

        // 저장 및 다운로드
        document.getElementById('saveResultBtn').addEventListener('click', () => {
            this.saveResult();
        });

        document.getElementById('downloadScheduleBtn').addEventListener('click', () => {
            this.downloadSchedule();
        });

        // 기록 삭제
        document.getElementById('clearLoanHistoryBtn').addEventListener('click', () => {
            this.clearHistory();
        });

        // 조기상환 방식 변경
        const earlyTypeRadios = document.querySelectorAll('input[name="earlyType"]');
        earlyTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.toggleEarlyPaymentInputs();
            });
        });

        // 실시간 계산 (디바운스)
        const inputs = document.querySelectorAll('#loanAmount, #interestRate, #loanTerm');
        inputs.forEach(input => {
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.updateQuickPreview();
                }, 500);
            });
        });
    }

    setDefaultDate() {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('startDate').value = formattedDate;
    }

    applyPreset(presetType) {
        const preset = this.presets[presetType];
        if (!preset) return;

        document.getElementById('loanAmount').value = preset.amount;
        document.getElementById('interestRate').value = preset.rate;
        document.getElementById('loanTerm').value = preset.term;
        document.getElementById('repaymentType').value = preset.type;

        this.showToast(`${presetType === 'house' ? '주택담보대출' : 
                        presetType === 'car' ? '자동차대출' : 
                        presetType === 'credit' ? '신용대출' : '전세자금대출'} 조건이 적용되었습니다!`);
        this.updateQuickPreview();
    }

    updateQuickPreview() {
        // 간단한 미리보기 (필요시 구현)
    }

    calculateLoan() {
        const amount = parseFloat(document.getElementById('loanAmount').value);
        const rate = parseFloat(document.getElementById('interestRate').value);
        const term = parseFloat(document.getElementById('loanTerm').value);
        const type = document.getElementById('repaymentType').value;
        const bonusPayment = parseFloat(document.getElementById('bonusPayment').value) || 0;

        if (!amount || !rate || !term) {
            this.showToast('모든 필수 항목을 입력해주세요!', 'error');
            return;
        }

        if (amount < 1000000) {
            this.showToast('대출 원금은 최소 100만원 이상이어야 합니다!', 'error');
            return;
        }

        // 계산 실행
        const monthlyRate = rate / 100 / 12;
        const totalMonths = term * 12;

        let calculation;
        switch (type) {
            case 'equal_payment':
                calculation = this.calculateEqualPayment(amount, monthlyRate, totalMonths, bonusPayment);
                break;
            case 'equal_principal':
                calculation = this.calculateEqualPrincipal(amount, monthlyRate, totalMonths, bonusPayment);
                break;
            case 'interest_only':
                calculation = this.calculateInterestOnly(amount, monthlyRate, totalMonths);
                break;
        }

        this.loanData = {
            amount,
            rate,
            term,
            type,
            bonusPayment,
            calculation,
            timestamp: new Date().toISOString()
        };

        this.displayResult();
    }

    calculateEqualPayment(principal, monthlyRate, months, bonusPayment) {
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                               (Math.pow(1 + monthlyRate, months) - 1);
        
        let balance = principal;
        let totalInterest = 0;
        let totalPayment = 0;
        const schedule = [];

        for (let month = 1; month <= months; month++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            
            // 연 1회 보너스 상환 처리
            let bonusThisMonth = 0;
            if (bonusPayment > 0 && month % 12 === 0) {
                bonusThisMonth = Math.min(bonusPayment, balance - principalPayment);
            }

            balance -= (principalPayment + bonusThisMonth);
            totalInterest += interestPayment;
            totalPayment += (monthlyPayment + bonusThisMonth);

            schedule.push({
                month,
                monthlyPayment: monthlyPayment + bonusThisMonth,
                principalPayment: principalPayment + bonusThisMonth,
                interestPayment,
                balance: Math.max(0, balance),
                totalInterest,
                totalPayment
            });

            if (balance <= 0) break;
        }

        return {
            monthlyPayment,
            totalPayment,
            totalInterest,
            schedule,
            actualMonths: schedule.length
        };
    }

    calculateEqualPrincipal(principal, monthlyRate, months, bonusPayment) {
        const principalPayment = principal / months;
        let balance = principal;
        let totalInterest = 0;
        let totalPayment = 0;
        const schedule = [];

        for (let month = 1; month <= months; month++) {
            const interestPayment = balance * monthlyRate;
            const monthlyPayment = principalPayment + interestPayment;
            
            // 연 1회 보너스 상환 처리
            let bonusThisMonth = 0;
            if (bonusPayment > 0 && month % 12 === 0) {
                bonusThisMonth = Math.min(bonusPayment, balance - principalPayment);
            }

            balance -= (principalPayment + bonusThisMonth);
            totalInterest += interestPayment;
            totalPayment += (monthlyPayment + bonusThisMonth);

            schedule.push({
                month,
                monthlyPayment: monthlyPayment + bonusThisMonth,
                principalPayment: principalPayment + bonusThisMonth,
                interestPayment,
                balance: Math.max(0, balance),
                totalInterest,
                totalPayment
            });
        }

        return {
            monthlyPayment: principalPayment + (principal * monthlyRate), // 첫 달 상환액
            totalPayment,
            totalInterest,
            schedule,
            actualMonths: schedule.length
        };
    }

    calculateInterestOnly(principal, monthlyRate, months) {
        const monthlyPayment = principal * monthlyRate;
        let totalInterest = monthlyPayment * months;
        let totalPayment = totalInterest + principal;
        const schedule = [];

        for (let month = 1; month <= months; month++) {
            const interestPayment = monthlyPayment;
            const principalPayment = month === months ? principal : 0; // 마지막 달에만 원금 상환
            const balance = month === months ? 0 : principal;

            schedule.push({
                month,
                monthlyPayment: month === months ? monthlyPayment + principal : monthlyPayment,
                principalPayment,
                interestPayment,
                balance,
                totalInterest: interestPayment * month,
                totalPayment: interestPayment * month + (month === months ? principal : 0)
            });
        }

        return {
            monthlyPayment,
            totalPayment,
            totalInterest,
            schedule,
            actualMonths: months
        };
    }

    displayResult() {
        const data = this.loanData;
        const calc = data.calculation;

        // 요약 정보 업데이트
        document.getElementById('monthlyPayment').textContent = 
            `${Math.round(calc.monthlyPayment).toLocaleString()}원`;
        document.getElementById('totalInterest').textContent = 
            `${Math.round(calc.totalInterest).toLocaleString()}원`;
        document.getElementById('totalPayment').textContent = 
            `${Math.round(calc.totalPayment).toLocaleString()}원`;
        document.getElementById('interestRatio').textContent = 
            `${(calc.totalInterest / data.amount * 100).toFixed(1)}%`;

        // 상환 일정표 생성
        this.generateSchedule();
        
        // 차트 생성
        this.generateChart();

        // 결과 섹션 표시
        document.getElementById('calculationResult').style.display = 'block';
    }

    generateSchedule() {
        this.updateScheduleView('yearly');
    }

    updateScheduleView(viewType) {
        const container = document.getElementById('repaymentSchedule');
        const schedule = this.loanData.calculation.schedule;
        
        container.innerHTML = '';

        let tableHTML = '<table class="schedule-table">';
        
        if (viewType === 'yearly') {
            tableHTML += `
                <thead>
                    <tr>
                        <th>연도</th>
                        <th>원금상환</th>
                        <th>이자납부</th>
                        <th>연간상환</th>
                        <th>잔여원금</th>
                    </tr>
                </thead>
                <tbody>
            `;

            const yearlyData = this.aggregateByYear(schedule);
            yearlyData.forEach((year, index) => {
                tableHTML += `
                    <tr>
                        <td>${year.year}년</td>
                        <td>${year.principal.toLocaleString()}원</td>
                        <td>${year.interest.toLocaleString()}원</td>
                        <td>${year.total.toLocaleString()}원</td>
                        <td>${year.balance.toLocaleString()}원</td>
                    </tr>
                `;
            });

        } else if (viewType === 'monthly') {
            tableHTML += `
                <thead>
                    <tr>
                        <th>회차</th>
                        <th>월상환액</th>
                        <th>원금상환</th>
                        <th>이자납부</th>
                        <th>잔여원금</th>
                    </tr>
                </thead>
                <tbody>
            `;

            const monthsToShow = Math.min(24, schedule.length);
            for (let i = 0; i < monthsToShow; i++) {
                const month = schedule[i];
                tableHTML += `
                    <tr>
                        <td>${month.month}회</td>
                        <td>${Math.round(month.monthlyPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.principalPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.interestPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.balance).toLocaleString()}원</td>
                    </tr>
                `;
            }

        } else { // all
            tableHTML += `
                <thead>
                    <tr>
                        <th>회차</th>
                        <th>월상환액</th>
                        <th>원금상환</th>
                        <th>이자납부</th>
                        <th>잔여원금</th>
                    </tr>
                </thead>
                <tbody>
            `;

            schedule.forEach(month => {
                tableHTML += `
                    <tr>
                        <td>${month.month}회</td>
                        <td>${Math.round(month.monthlyPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.principalPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.interestPayment).toLocaleString()}원</td>
                        <td>${Math.round(month.balance).toLocaleString()}원</td>
                    </tr>
                `;
            });
        }

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    aggregateByYear(schedule) {
        const years = [];
        let currentYear = 1;
        let yearData = { year: currentYear, principal: 0, interest: 0, total: 0, balance: 0 };

        schedule.forEach((month, index) => {
            yearData.principal += month.principalPayment;
            yearData.interest += month.interestPayment;
            yearData.total += month.monthlyPayment;
            yearData.balance = month.balance;

            if (month.month % 12 === 0 || index === schedule.length - 1) {
                years.push({...yearData});
                currentYear++;
                yearData = { year: currentYear, principal: 0, interest: 0, total: 0, balance: 0 };
            }
        });

        return years;
    }

    generateChart() {
        this.renderChart(this.currentChartType);
    }

    renderChart(type) {
        const canvas = document.getElementById('loanChart');
        const ctx = canvas.getContext('2d');
        const data = this.loanData;
        const schedule = data.calculation.schedule;

        if (this.currentChart) {
            this.currentChart.destroy();
        }

        let chartConfig;

        switch (type) {
            case 'payment':
                const years = this.aggregateByYear(schedule);
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: years.map(y => `${y.year}년`),
                        datasets: [
                            {
                                label: '원금상환',
                                data: years.map(y => Math.round(y.principal)),
                                backgroundColor: 'rgba(25, 118, 210, 0.6)',
                                borderColor: '#1976D2',
                                borderWidth: 1
                            },
                            {
                                label: '이자납부',
                                data: years.map(y => Math.round(y.interest)),
                                backgroundColor: 'rgba(244, 67, 54, 0.6)',
                                borderColor: '#f44336',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: { stacked: true },
                            y: { 
                                stacked: true,
                                ticks: {
                                    callback: (value) => `${(value / 1000000).toFixed(0)}백만원`
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}원`
                                }
                            }
                        }
                    }
                };
                break;

            case 'balance':
                const monthlyBalances = schedule.map(s => Math.round(s.balance));
                const monthLabels = schedule.map(s => `${Math.ceil(s.month/12)}년`);
                
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: monthLabels,
                        datasets: [{
                            label: '잔여 원금',
                            data: monthlyBalances,
                            borderColor: '#1976D2',
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            borderWidth: 2,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                ticks: {
                                    callback: (value) => `${(value / 1000000).toFixed(0)}백만원`
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (context) => `잔여원금: ${context.parsed.y.toLocaleString()}원`
                                }
                            }
                        }
                    }
                };
                break;

            case 'pie':
                chartConfig = {
                    type: 'doughnut',
                    data: {
                        labels: ['원금', '이자'],
                        datasets: [{
                            data: [data.amount, Math.round(data.calculation.totalInterest)],
                            backgroundColor: ['#1976D2', '#f44336'],
                            borderWidth: 2,
                            borderColor: '#fff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    usePointStyle: true,
                                    padding: 20
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const total = data.amount + data.calculation.totalInterest;
                                        const percentage = (context.parsed / total * 100).toFixed(1);
                                        return `${context.label}: ${context.parsed.toLocaleString()}원 (${percentage}%)`;
                                    }
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
        if (this.loanData) {
            this.renderChart(type);
        }
    }

    showEarlyPaymentModal() {
        if (!this.loanData) {
            this.showToast('먼저 대출을 계산해주세요!', 'error');
            return;
        }
        document.getElementById('earlyPaymentModal').style.display = 'flex';
        this.toggleEarlyPaymentInputs();
    }

    hideEarlyPaymentModal() {
        document.getElementById('earlyPaymentModal').style.display = 'none';
        document.getElementById('earlyPaymentResult').style.display = 'none';
    }

    toggleEarlyPaymentInputs() {
        const isPartial = document.querySelector('input[name="earlyType"]:checked').value === 'partial';
        const partialGroup = document.getElementById('partialPaymentGroup');
        partialGroup.style.display = isPartial ? 'block' : 'none';
    }

    simulateEarlyPayment() {
        const earlyType = document.querySelector('input[name="earlyType"]:checked').value;
        const earlyMonth = parseInt(document.getElementById('earlyMonth').value);
        const afterEarly = document.querySelector('input[name="afterEarly"]:checked').value;
        const earlyAmount = earlyType === 'partial' ? parseFloat(document.getElementById('earlyAmount').value) : 0;

        if (earlyMonth <= 0 || earlyMonth > this.loanData.calculation.schedule.length) {
            this.showToast('유효한 조기상환 시점을 입력해주세요!', 'error');
            return;
        }

        if (earlyType === 'partial' && (!earlyAmount || earlyAmount <= 0)) {
            this.showToast('조기상환 금액을 입력해주세요!', 'error');
            return;
        }

        // 조기상환 시뮬레이션 실행
        const original = this.loanData.calculation;
        const earlyResult = this.calculateEarlyPayment(earlyType, earlyMonth, earlyAmount, afterEarly);

        this.displayEarlyPaymentResult(original, earlyResult);
    }

    calculateEarlyPayment(type, month, amount, afterOption) {
        const data = this.loanData;
        const monthlyRate = data.rate / 100 / 12;
        
        // 조기상환 시점까지의 잔액 계산
        let balance = data.amount;
        let totalInterest = 0;
        let totalPayment = 0;

        for (let i = 0; i < month; i++) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = data.calculation.schedule[i].principalPayment;
            balance -= principalPayment;
            totalInterest += interestPayment;
            totalPayment += data.calculation.schedule[i].monthlyPayment;
        }

        if (type === 'full') {
            // 전체 조기상환
            const totalEarlyPayment = totalPayment + balance;
            const savedInterest = data.calculation.totalInterest - totalInterest;
            
            return {
                type: 'full',
                month,
                earlyPayment: balance,
                totalPayment: totalEarlyPayment,
                totalInterest,
                savedInterest,
                savedMonths: data.calculation.schedule.length - month,
                newMonthlyPayment: 0,
                newTotalMonths: month
            };
        } else {
            // 일부 조기상환
            const newBalance = balance - amount;
            const remainingMonths = data.term * 12 - month;
            
            let newMonthlyPayment, newTotalMonths;
            
            if (afterOption === 'reduce_term') {
                // 기간 단축
                newMonthlyPayment = data.calculation.monthlyPayment;
                newTotalMonths = month + Math.ceil(Math.log(1 + newBalance * monthlyRate / newMonthlyPayment) / Math.log(1 + monthlyRate));
            } else {
                // 월 상환액 감소
                newTotalMonths = data.term * 12;
                const remainingMonthsAfterEarly = newTotalMonths - month;
                newMonthlyPayment = (newBalance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonthsAfterEarly)) / 
                                   (Math.pow(1 + monthlyRate, remainingMonthsAfterEarly) - 1);
            }

            // 새로운 총 이자 계산 (간단한 추정)
            const newTotalInterest = totalInterest + (newMonthlyPayment * (newTotalMonths - month)) - newBalance;
            const savedInterest = data.calculation.totalInterest - newTotalInterest;

            return {
                type: 'partial',
                month,
                earlyPayment: amount,
                newBalance,
                newMonthlyPayment,
                newTotalMonths,
                totalInterest: newTotalInterest,
                savedInterest,
                savedMonths: data.calculation.schedule.length - newTotalMonths
            };
        }
    }

    displayEarlyPaymentResult(original, earlyResult) {
        const beforeDiv = document.getElementById('beforeEarly');
        const afterDiv = document.getElementById('afterEarly');
        const savingsDiv = document.getElementById('earlySavings');

        beforeDiv.innerHTML = `
            <div>총 상환액: ${Math.round(original.totalPayment).toLocaleString()}원</div>
            <div>총 이자: ${Math.round(original.totalInterest).toLocaleString()}원</div>
            <div>상환 기간: ${original.schedule.length}개월</div>
        `;

        if (earlyResult.type === 'full') {
            afterDiv.innerHTML = `
                <div>총 상환액: ${Math.round(earlyResult.totalPayment).toLocaleString()}원</div>
                <div>총 이자: ${Math.round(earlyResult.totalInterest).toLocaleString()}원</div>
                <div>상환 기간: ${earlyResult.newTotalMonths}개월</div>
            `;
        } else {
            afterDiv.innerHTML = `
                <div>월 상환액: ${Math.round(earlyResult.newMonthlyPayment).toLocaleString()}원</div>
                <div>총 이자: ${Math.round(earlyResult.totalInterest).toLocaleString()}원</div>
                <div>상환 기간: ${earlyResult.newTotalMonths}개월</div>
            `;
        }

        savingsDiv.innerHTML = `
            <div>💰 ${Math.round(earlyResult.savedInterest).toLocaleString()}원 절약</div>
            <div>⏰ ${earlyResult.savedMonths}개월 단축</div>
            <div>📊 ${(earlyResult.savedInterest / original.totalInterest * 100).toFixed(1)}% 절약</div>
        `;

        document.getElementById('earlyPaymentResult').style.display = 'block';
    }

    addLoanToComparison() {
        if (!this.loanData) {
            this.showToast('먼저 대출을 계산해주세요!', 'error');
            return;
        }

        const loanCopy = {
            ...this.loanData,
            id: Date.now(),
            name: `대출 ${this.comparisonLoans.length + 1}`
        };

        this.comparisonLoans.push(loanCopy);
        this.updateLoanList();
        
        if (this.comparisonLoans.length >= 2) {
            document.getElementById('compareBtn').style.display = 'block';
        }

        this.showToast('비교 목록에 추가되었습니다!');
    }

    updateLoanList() {
        const container = document.getElementById('loanList');
        container.innerHTML = '';

        this.comparisonLoans.forEach((loan, index) => {
            const loanItem = document.createElement('div');
            loanItem.className = 'loan-item';
            
            loanItem.innerHTML = `
                <div class="loan-info">
                    <div class="loan-name">${loan.name}</div>
                    <div class="loan-details">
                        ${loan.amount.toLocaleString()}원 / ${loan.term}년 / ${loan.rate}%
                        <br>월 상환액: ${Math.round(loan.calculation.monthlyPayment).toLocaleString()}원
                    </div>
                </div>
                <button class="remove-loan-btn" onclick="loanCalculator.removeLoanFromComparison(${loan.id})">삭제</button>
            `;
            
            container.appendChild(loanItem);
        });
    }

    removeLoanFromComparison(id) {
        this.comparisonLoans = this.comparisonLoans.filter(loan => loan.id !== id);
        this.updateLoanList();
        
        if (this.comparisonLoans.length < 2) {
            document.getElementById('compareBtn').style.display = 'none';
            this.hideComparisonResult();
        }
    }

    showComparisonResult() {
        if (this.comparisonLoans.length < 2) return;

        const container = document.getElementById('comparisonTable');
        
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>구분</th>
                        ${this.comparisonLoans.map(loan => `<th>${loan.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>대출 원금</td>
                        ${this.comparisonLoans.map(loan => `<td>${loan.amount.toLocaleString()}원</td>`).join('')}
                    </tr>
                    <tr>
                        <td>연이자율</td>
                        ${this.comparisonLoans.map(loan => `<td>${loan.rate}%</td>`).join('')}
                    </tr>
                    <tr>
                        <td>대출 기간</td>
                        ${this.comparisonLoans.map(loan => `<td>${loan.term}년</td>`).join('')}
                    </tr>
                    <tr>
                        <td>월 상환액</td>
                        ${this.comparisonLoans.map((loan, index) => {
                            const isLowest = Math.round(loan.calculation.monthlyPayment) === 
                                Math.min(...this.comparisonLoans.map(l => Math.round(l.calculation.monthlyPayment)));
                            return `<td class="${isLowest ? 'comparison-best' : ''}">${Math.round(loan.calculation.monthlyPayment).toLocaleString()}원</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>총 이자</td>
                        ${this.comparisonLoans.map((loan, index) => {
                            const isLowest = Math.round(loan.calculation.totalInterest) === 
                                Math.min(...this.comparisonLoans.map(l => Math.round(l.calculation.totalInterest)));
                            return `<td class="${isLowest ? 'comparison-best' : ''}">${Math.round(loan.calculation.totalInterest).toLocaleString()}원</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td>총 상환액</td>
                        ${this.comparisonLoans.map((loan, index) => {
                            const isLowest = Math.round(loan.calculation.totalPayment) === 
                                Math.min(...this.comparisonLoans.map(l => Math.round(l.calculation.totalPayment)));
                            return `<td class="${isLowest ? 'comparison-best' : ''}">${Math.round(loan.calculation.totalPayment).toLocaleString()}원</td>`;
                        }).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
        document.getElementById('comparisonResult').style.display = 'block';
    }

    hideComparisonResult() {
        document.getElementById('comparisonResult').style.display = 'none';
    }

    saveResult() {
        if (!this.loanData) return;

        const history = JSON.parse(localStorage.getItem('loanHistory') || '[]');
        
        const record = {
            ...this.loanData,
            id: Date.now(),
            date: new Date().toLocaleDateString()
        };

        history.unshift(record);
        
        // 최대 10개까지만 저장
        if (history.length > 10) {
            history.splice(10);
        }

        localStorage.setItem('loanHistory', JSON.stringify(history));
        this.loadHistory();
        this.showToast('계산 결과가 저장되었습니다!');
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('loanHistory') || '[]');
        const container = document.getElementById('loanHistory');

        if (history.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <div class="empty-icon">🏦</div>
                    <p>아직 계산 기록이 없습니다.<br>대출을 계산하면 기록이 저장됩니다!</p>
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
                    <button class="history-delete" onclick="loanCalculator.deleteHistory(${record.id})">🗑️</button>
                </div>
                <div class="history-summary">
                    <span>원금: ${record.amount.toLocaleString()}원</span>
                    <span>월상환: ${Math.round(record.calculation.monthlyPayment).toLocaleString()}원</span>
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
        const history = JSON.parse(localStorage.getItem('loanHistory') || '[]');
        const filteredHistory = history.filter(record => record.id !== id);
        localStorage.setItem('loanHistory', JSON.stringify(filteredHistory));
        this.loadHistory();
        this.showToast('기록이 삭제되었습니다.');
    }

    restoreFromHistory(record) {
        document.getElementById('loanAmount').value = record.amount;
        document.getElementById('interestRate').value = record.rate;
        document.getElementById('loanTerm').value = record.term;
        document.getElementById('repaymentType').value = record.type;
        document.getElementById('bonusPayment').value = record.bonusPayment || 0;

        this.loanData = record;
        this.displayResult();
        this.showToast('기록이 복원되었습니다!');
    }

    clearHistory() {
        if (confirm('모든 계산 기록을 삭제하시겠습니까?')) {
            localStorage.removeItem('loanHistory');
            this.loadHistory();
            this.showToast('모든 기록이 삭제되었습니다.');
        }
    }

    downloadSchedule() {
        if (!this.loanData) return;

        const schedule = this.loanData.calculation.schedule;
        const yearlyData = this.aggregateByYear(schedule);
        
        // CSV 데이터 생성
        let csvContent = '연도,원금상환,이자납부,연간상환,잔여원금\n';
        yearlyData.forEach(year => {
            csvContent += `${year.year},${Math.round(year.principal)},${Math.round(year.interest)},${Math.round(year.total)},${Math.round(year.balance)}\n`;
        });

        // 다운로드
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `대출상환계획_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();

        this.showToast('상환 일정표가 다운로드되었습니다!');
    }

    showToast(message, type = 'success') {
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
const loanCalculator = new LoanCalculator();

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 추가 초기화가 필요한 경우
});
