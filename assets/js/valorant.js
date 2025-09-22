// 발로란트 메인 페이지 JavaScript

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 요원 데이터 로드
    loadAgents();
    // 최신 팁 로드
    loadLatestTips();
});

// 요원 데이터 (임시 데이터 - 나중에 API로 교체)
const agentsData = {
    duelist: [
        { name: '네온', image: '/assets/images/valorant/charactor/네온.webp' },
        { name: '레이나', image: '/assets/images/valorant/charactor/레이나.webp' },
        { name: '레이즈', image: '/assets/images/valorant/charactor/레이즈.webp' },
        { name: '아이소', image: '/assets/images/valorant/charactor/아이소.webp' },
        { name: '요루', image: '/assets/images/valorant/charactor/요루.webp' },
        { name: '웨이레이', image: '/assets/images/valorant/charactor/웨이레이.webp' },
        { name: '제트', image: '/assets/images/valorant/charactor/제트.webp' },
        { name: '피닉스', image: '/assets/images/valorant/charactor/피닉스.webp' }
    ],
    initiator: [
        { name: '게코', image: '/assets/images/valorant/charactor/게코.webp' },
        { name: '브리치', image: '/assets/images/valorant/charactor/브리치.webp' },
        { name: '소바', image: '/assets/images/valorant/charactor/소바.webp' },
        { name: '스카이', image: '/assets/images/valorant/charactor/스카이.webp' },
        { name: '케이오', image: '/assets/images/valorant/charactor/케이오.webp' },
        { name: '테호', image: '/assets/images/valorant/charactor/테호.webp' },
        { name: '페이드', image: '/assets/images/valorant/charactor/페이드.webp' }
    ],
    sentinel: [
        { name: '데드록', image: '/assets/images/valorant/charactor/데드록.webp' },
        { name: '바이스', image: '/assets/images/valorant/charactor/바이스.webp' },
        { name: '사이퍼', image: '/assets/images/valorant/charactor/사이퍼.webp' },
        { name: '세이지', image: '/assets/images/valorant/charactor/세이지.webp' },
        { name: '체임버', image: '/assets/images/valorant/charactor/체임버.webp' },
        { name: '킬조이', image: '/assets/images/valorant/charactor/킬조이.webp' }
    ],
    controller: [
        { name: '바이퍼', image: '/assets/images/valorant/charactor/바이퍼.webp' },
        { name: '브림스톤', image: '/assets/images/valorant/charactor/브림스톤.webp' },
        { name: '아스트라', image: '/assets/images/valorant/charactor/아스트라.webp' },
        { name: '오멘', image: '/assets/images/valorant/charactor/오멘.webp' },
        { name: '클로브', image: '/assets/images/valorant/charactor/클로브.webp' },
        { name: '하버', image: '/assets/images/valorant/charactor/하버.webp' }
    ]
};

// 요원 정보 로드
function loadAgents() {
    const types = ['duelist', 'initiator', 'sentinel', 'controller'];
    
    types.forEach(type => {
        const container = document.getElementById(`${type}Agents`);
        if (!container) return;
        
        // 로딩 상태 제거
        container.innerHTML = '';
        
        // 요원 그리드 생성
        const agentsGrid = document.createElement('div');
        agentsGrid.className = 'agents-grid';
        
        const agents = agentsData[type] || [];
        
        agents.forEach(agent => {
            const agentItem = document.createElement('a');
            agentItem.className = 'agent-item';
            agentItem.href = `/game/valorant/board?agent=${encodeURIComponent(agent.name)}`;
            agentItem.title = `${agent.name} 공략 보기`;
            
            agentItem.innerHTML = `
                <img src="${agent.image}" alt="${agent.name}" class="agent-avatar" onerror="this.src='/assets/images/placeholder-agent.webp'">
                <span class="agent-name">${agent.name}</span>
            `;
            
            agentsGrid.appendChild(agentItem);
        });
        
        container.appendChild(agentsGrid);
    });
}

// 최신 팁 로드
function loadLatestTips() {
    const tipsContainer = document.getElementById('latestTips');
    if (!tipsContainer) return;
    
    // 임시 팁 데이터 (나중에 API로 교체)
    const sampleTips = [
        {
            id: 1,
            title: '제트 대쉬 활용법: 완벽한 진입 타이밍',
            summary: '제트의 대쉬를 활용해 상대방이 예측하지 못하는 순간에 진입하는 방법을 알아보세요. 맵별 최적의 대쉬 포인트와 함께 설명합니다.',
            agentName: '제트',
            agentImage: '/assets/images/valorant/charactor/제트.webp',
            author: '프로게이머123',
            date: '2025-09-22',
            views: 1247,
            likes: 89,
            comments: 23,
            difficulty: 'intermediate',
            category: 'skill'
        },
        {
            id: 2,
            title: '사이퍼 트랩 최적 배치법 - 바인드 맵',
            summary: '바인드 맵에서 사이퍼의 트랩을 효과적으로 배치하여 적의 움직임을 완벽하게 차단하는 전략을 공유합니다.',
            agentName: '사이퍼',
            agentImage: '/assets/images/valorant/charactor/사이퍼.webp',
            author: '전략마스터',
            date: '2025-09-21',
            views: 892,
            likes: 67,
            comments: 15,
            difficulty: 'advanced',
            category: 'strategy'
        },
        {
            id: 3,
            title: '오멘 연막 활용: 초보자를 위한 완벽 가이드',
            summary: '오멘의 연막을 처음 사용하는 초보자들을 위한 기본기부터 고급 테크닉까지 모든 것을 담았습니다.',
            agentName: '오멘',
            agentImage: '/assets/images/valorant/charactor/오멘.webp',
            author: '발로초보탈출',
            date: '2025-09-20',
            views: 2156,
            likes: 134,
            comments: 41,
            difficulty: 'beginner',
            category: 'skill'
        }
    ];
    
    // 로딩 상태 제거
    tipsContainer.innerHTML = '';
    
    // 팁 카드 생성
    sampleTips.forEach(tip => {
        const tipCard = document.createElement('a');
        tipCard.className = 'tip-card';
        tipCard.href = `/game/valorant/post/${tip.id}`;
        
        const difficultyText = {
            'beginner': '초급',
            'intermediate': '중급', 
            'advanced': '고급'
        };
        
        const categoryText = {
            'skill': '스킬',
            'strategy': '전략',
            'map': '맵',
            'general': '일반'
        };
        
        tipCard.innerHTML = `
            <div class="tip-header">
                <img src="${tip.agentImage}" alt="${tip.agentName}" class="tip-agent-avatar" onerror="this.src='/assets/images/placeholder-agent.webp'">
                <div class="tip-meta">
                    <div class="tip-agent-name">${tip.agentName}</div>
                    <div class="tip-date">${formatDate(tip.date)}</div>
                </div>
            </div>
            <h3 class="tip-title">${tip.title}</h3>
            <p class="tip-summary">${tip.summary}</p>
            <div class="tip-stats">
                <span>👁️ ${formatNumber(tip.views)}</span>
                <span>❤️ ${formatNumber(tip.likes)}</span>
                <span>💬 ${formatNumber(tip.comments)}</span>
                <span>📈 ${difficultyText[tip.difficulty]}</span>
                <span>🎯 ${categoryText[tip.category]}</span>
            </div>
        `;
        
        tipsContainer.appendChild(tipCard);
    });
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return '오늘';
    } else if (diffDays === 1) {
        return '어제';
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric'
        });
    }
}

// 숫자 포맷팅
function formatNumber(num) {
    if (num >= 1000000) {
        return Math.floor(num / 100000) / 10 + 'M';
    } else if (num >= 1000) {
        return Math.floor(num / 100) / 10 + 'K';
    }
    return num.toString();
}

// 요원 타입 카드 클릭 이벤트
document.addEventListener('click', function(e) {
    const typeCard = e.target.closest('.agent-type-card');
    if (typeCard) {
        const type = typeCard.getAttribute('data-type');
        if (type) {
            // 클릭 애니메이션
            typeCard.style.transform = 'scale(0.95)';
            setTimeout(() => {
                typeCard.style.transform = '';
            }, 150);
        }
    }
});

// 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 애니메이션 대상 요소들 관찰
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.agent-type-card, .tip-card, .quick-action-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 에러 처리
window.addEventListener('error', function(e) {
    console.error('Valorant page error:', e.error);
});
