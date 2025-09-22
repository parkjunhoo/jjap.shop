// 발로란트 메인 페이지 JavaScript

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    // 요원 데이터 로드
    loadAgents();
    // 최신 팁 로드
    loadLatestTips();
});

// 요원 데이터 (임시 데이터 - 나중에 API로 교체)
let agentsData = {
    duelist: ['네온', '레이나', '레이즈', '아이소', '요루', '제트', '피닉스'],
    initiator: ['게코', '브리치', '소바', '스카이', '케이오', '페이드'],
    sentinel: ['데드록', '바이스', '사이퍼', '세이지', '체임버', '킬조이'],
    controller: ['바이퍼', '브림스톤', '아스트라', '오멘', '클로브', '하버']
};

// 모바일 체크 함수
function isMobile() {
    return window.innerWidth <= 768;
}

// 요원 데이터 로드
function loadAgents() {
    Object.entries(agentsData).forEach(([type, agents]) => {
        const container = document.getElementById(`${type}Agents`);
        if (!container) return;

        const agentsGrid = document.createElement('div');
        
        // 모바일에서는 슬라이더 클래스 추가
        if (isMobile()) {
            agentsGrid.className = 'agents-grid mobile-slider';
            
            // 무한 슬라이드를 위해 요원 목록 복제 (3번 반복)
            const tripleAgents = [...agents, ...agents, ...agents];
            
            tripleAgents.forEach(agent => {
                const agentItem = document.createElement('a');
                agentItem.className = 'agent-item';
                agentItem.href = `/game/valorant/board?agent=${encodeURIComponent(agent)}`;
                agentItem.innerHTML = `
                    <img src="/assets/images/valorant/charactor/${agent}.webp" alt="${agent}" class="agent-avatar" loading="lazy" onerror="this.src='/assets/images/valorant/default-agent.webp'">
                    <span class="agent-name">${agent}</span>
                `;
                agentsGrid.appendChild(agentItem);
            });
            
        } else {
            // 데스크톱에서는 기본 그리드
            agentsGrid.className = 'agents-grid';
            
            agents.forEach(agent => {
                const agentItem = document.createElement('a');
                agentItem.className = 'agent-item';
                agentItem.href = `/game/valorant/board?agent=${encodeURIComponent(agent)}`;
                agentItem.innerHTML = `
                    <img src="/assets/images/valorant/charactor/${agent}.webp" alt="${agent}" class="agent-avatar" loading="lazy" onerror="this.src='/assets/images/valorant/default-agent.webp'">
                    <span class="agent-name">${agent}</span>
                `;
                agentsGrid.appendChild(agentItem);
            });
        }
        
        container.innerHTML = '';
        container.appendChild(agentsGrid);
    });
    
    // 모바일에서 슬라이더 초기화
    if (isMobile()) {
        initMobileSliders();
    }
}

// 모바일 슬라이더 초기화
function initMobileSliders() {
    const sliders = document.querySelectorAll('.agents-grid.mobile-slider');
    
    sliders.forEach((slider, index) => {
        // 각 슬라이더마다 다른 애니메이션 지연 시간 설정
        const delay = index * 3; // 3초씩 지연
        slider.style.animationDelay = `${delay}s`;
        
        // 호버 시 일시정지
        slider.addEventListener('mouseenter', () => {
            slider.style.animationPlayState = 'paused';
        });
        
        slider.addEventListener('mouseleave', () => {
            slider.style.animationPlayState = 'running';
        });
        
        // 터치 시작 시 일시정지
        slider.addEventListener('touchstart', () => {
            slider.style.animationPlayState = 'paused';
        });
        
        slider.addEventListener('touchend', () => {
            setTimeout(() => {
                slider.style.animationPlayState = 'running';
            }, 1000); // 1초 후 다시 시작
        });
    });
    
}

// 창 크기 변경 시 리로드
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const wasMobile = document.querySelector('.agents-grid.mobile-slider') !== null;
        const nowMobile = isMobile();
        
        if (wasMobile !== nowMobile) {
            loadAgents();
        }
    }, 300);
});

// 최신 팁 로드
async function loadLatestTips() {
    const tipsContainer = document.getElementById('latestTips');
    if (!tipsContainer) return;
    
    try {
        // 실제 API에서 최신 팁 데이터 가져오기
        const response = await fetch('/api/valorant.php?action=get_posts&sort=latest&limit=3');
        const data = await response.json();
        
        if (data.success && data.data.posts && data.data.posts.length > 0) {
            displayTips(data.data.posts);
        } else {
            // 데이터가 없을 경우 기본 메시지 표시
            tipsContainer.innerHTML = '<div class="no-tips">아직 등록된 팁이 없습니다. 첫 번째 팁을 작성해보세요!</div>';
        }
    } catch (error) {
        console.error('최신 팁 로드 오류:', error);
        // 에러 시 기본 메시지 표시
        tipsContainer.innerHTML = '<div class="no-tips">팁을 불러오는 중 오류가 발생했습니다.</div>';
    }
}

// 팁 데이터 표시 함수
function displayTips(tips) {
    const tipsContainer = document.getElementById('latestTips');
    if (!tipsContainer) return;
    
    // 팁 카드 생성 및 표시
    const tipsGrid = document.createElement('div');
    tipsGrid.className = 'tips-grid';
    
    tips.forEach(tip => {
        const tipCard = document.createElement('div');
        tipCard.className = 'tip-card';
        tipCard.innerHTML = `
            <div class="tip-header">
                <div class="tip-agent-badge">
                    <span class="tip-agent">${tip.agent_name || '일반'}</span>
                </div>
                <span class="tip-difficulty ${tip.difficulty || 'beginner'}">${getDifficultyText(tip.difficulty || 'beginner')}</span>
            </div>
            <div class="tip-content">
                <h3 class="tip-title">${escapeHtml(tip.title)}</h3>
                <p class="tip-summary">${escapeHtml(generateExcerpt(tip.content, 100))}</p>
            </div>
            <div class="tip-footer">
                <div class="tip-stats">
                    <div class="tip-stats-row">
                        <span class="tip-stat"><i class="icon">👀</i> ${(parseInt(tip.view_count) || 0).toLocaleString()}</span>
                        <span class="tip-stat"><i class="icon">❤️</i> ${parseInt(tip.like_count) || 0}</span>
                        <span class="tip-stat"><i class="icon">💬</i> ${parseInt(tip.comment_count) || 0}</span>
                    </div>
                    <div class="tip-stats-row">
                        <span class="tip-stat"><i class="icon">⭐</i> ${parseInt(tip.rating) || 0}/5</span>
                        <span class="tip-stat"><i class="icon">📅</i> ${formatTimeAgo(tip.created_at)}</span>
                    </div>
                </div>
                <div class="tip-author">
                    <span class="author-name">by ${escapeHtml(tip.nickname || '익명')}</span>
                </div>
            </div>
        `;
        
        // 클릭 이벤트 추가
        tipCard.addEventListener('click', () => {
            window.location.href = `/game/valorant/post/${tip.id}`;
        });
        
        tipsGrid.appendChild(tipCard);
    });
    
    tipsContainer.innerHTML = '';
    tipsContainer.appendChild(tipsGrid);
}

// 유틸리티 함수들
function getDifficultyText(difficulty) {
    const difficulties = {
        'beginner': '초급',
        'intermediate': '중급',
        'advanced': '고급'
    };
    return difficulties[difficulty] || '초급';
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    } else if (diffHours < 24) {
        return `${diffHours}시간 전`;
    } else if (diffDays < 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR');
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function generateExcerpt(content, length = 100) {
    // HTML 태그 제거
    const plainText = content.replace(/<[^>]*>/g, '');
    // 길이 제한
    return plainText.length > length ? plainText.substring(0, length) + '...' : plainText;
}
