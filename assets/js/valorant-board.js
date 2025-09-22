
class ValorantBoard {
    constructor(agentName = '') {
        this.agentName = agentName;
        this.currentPage = 1;
        this.currentSort = 'latest';
        this.selectedAgents = [];
        this.isLoading = false;
        this.favorites = this.loadFavorites();
        this.currentViewMode = 'list'; // list or feed
        this.agentFilterModalOpen = false;
        
        this.setupEventListeners();
    }

    // 정렬 토글 버튼 설정
    setupSortToggle() {
        const latestBtn = document.getElementById('latestBtn');
        const popularBtn = document.getElementById('popularBtn');
        
        if (latestBtn) {
            latestBtn.addEventListener('click', () => {
                this.handleSortToggle('latest', latestBtn);
            });
        }
        
        if (popularBtn) {
            popularBtn.addEventListener('click', () => {
                this.handleSortToggle('popular', popularBtn);
            });
        }
    }
    
    // 정렬 토글 처리
    handleSortToggle(sortType, clickedBtn) {
        // 현재와 같은 정렬이면 무시
        if (this.currentSort === sortType) return;
        
        // 모든 정렬 버튼의 active 클래스 제거
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 클릭된 버튼에 active 클래스 추가
        clickedBtn.classList.add('active');
        
        // 정렬 변경 및 게시글 로드
        this.currentSort = sortType;
        this.currentPage = 1;
        this.loadPosts();
    }
    
    init() {
        // URL 파라미터에서 요원 필터 확인
        this.checkURLParameters();
        
        if (this.agentName) {
            this.loadAgentInfo();
            this.loadPosts();
        } else {
            // 전체 발로란트 게시판인 경우
            this.loadAgents();
            this.loadPosts();
            this.updateBoardStats();
        }
        this.updateFavoriteCount();
    }
    
    // URL 파라미터 확인 및 처리
    checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const agentParam = urlParams.get('agent');
        
        if (agentParam && !this.agentName) {
            // 요원명이 있으면 해당 요원을 선택된 상태로 설정
            this.preSelectedAgent = decodeURIComponent(agentParam);
        }
    }
    
    setupEventListeners() {
        // 정렬 토글 버튼
        this.setupSortToggle();
        
        // 요원 필터 모달
        this.setupAgentFilterModal();
        
        // 글 작성 버튼
        const writeBtn = document.getElementById('writeBtn');
        if (writeBtn) {
            writeBtn.addEventListener('click', () => {
                window.location.href = `/game/valorant/write${this.agentName ? '?agent=' + encodeURIComponent(this.agentName) : ''}`;
            });
        }
        
        
        // 즐겨찾기 보기 버튼
        const favoriteViewBtn = document.getElementById('favoriteViewBtn');
        if (favoriteViewBtn) {
            favoriteViewBtn.addEventListener('click', () => {
                window.location.href = '/game/valorant/favorites';
            });
        }
        
    }
    
    async loadAgentInfo() {
        try {
            const response = await fetch(`/api/valorant.php?action=get_agents`);
            const data = await response.json();
            
            if (data.success) {
                let foundAgent = null;
                
                // 모든 역할에서 요원 찾기
                for (const roleData of Object.values(data.data.agents)) {
                    const agent = roleData.agents.find(a => a.name === this.agentName);
                    if (agent) {
                        foundAgent = { ...agent, type: roleData.type };
                        break;
                    }
                }
                
                if (foundAgent) {
                    this.displayAgentInfo(foundAgent);
                } else {
                    this.showError('요원 정보를 찾을 수 없습니다.');
                }
            } else {
                this.showError(data.error || '요원 정보 로드 실패');
            }
        } catch (error) {
            console.error('요원 정보 로드 오류:', error);
            this.showError('네트워크 오류가 발생했습니다.');
        }
    }
    
    // 전체 게시판용 요원 목록 로드
    async loadAgents() {
        try {
            const response = await fetch('/api/valorant.php?action=get_agents');
            const data = await response.json();
            
            if (data.success) {
                const agentsArray = data.data?.agents || data.agents || [];
                
                // 배열을 역할별 그룹 객체로 변환
                this.agents = this.groupAgentsByRole(agentsArray);
                
                // URL 파라미터로 넘어온 요원이 있으면 자동으로 선택
                if (this.preSelectedAgent) {
                    this.selectAgentByName(this.preSelectedAgent);
                }
                
                // 전체 게시판인 경우 - 모달에서 사용할 요원 데이터는 이미 로드됨
            } else {
                this.showError(data.error || '요원 정보 로드 실패');
            }
        } catch (error) {
            console.error('요원 정보 로드 오류:', error);
            this.showError('네트워크 오류가 발생했습니다.');
        }
    }
    
    // 요원 배열을 역할별로 그룹화
    groupAgentsByRole(agentsArray) {
        const grouped = {};
        
        agentsArray.forEach(agent => {
            const roleName = agent.type_name || '기타';
            
            if (!grouped[roleName]) {
                grouped[roleName] = {
                    type: {
                        name: roleName,
                        name_en: agent.type_name_en || 'Other',
                        icon: agent.type_icon || '⚡',
                        color: agent.type_color || '#666666'
                    },
                    agents: []
                };
            }
            
            grouped[roleName].agents.push({
                id: agent.id,
                name: agent.name,
                name_en: agent.name_en,
                image: agent.image,
                description: agent.description
            });
        });
        
        return grouped;
    }
    
    populateAgentFilter() {
        const agentFilter = document.getElementById('agentFilter');
        if (!agentFilter) return;
        
        let optionsHtml = '<option value="">모든 요원</option>';
        
        for (const [roleName, roleData] of Object.entries(this.agents)) {
            const roleIcon = {
                '타격대': '🔥',
                '척후대': '🎯', 
                '감시자': '🛡️',
                '연막': '💨'
            }[roleData.type.name] || '⚡';
            
            optionsHtml += `<optgroup label="${roleIcon} ${roleData.type.name}">`;
            
            roleData.agents.forEach(agent => {
                optionsHtml += `<option value="${agent.id}">${agent.name}</option>`;
            });
            
            optionsHtml += '</optgroup>';
        }
        
        agentFilter.innerHTML = optionsHtml;
    }
    
    // 요원 필터 모달 설정
    setupAgentFilterModal() {
        const agentFilterBtn = document.getElementById('agentFilterBtn');
        const agentFilterModal = document.getElementById('agentFilterModal');
        const closeBtn = document.getElementById('closeAgentFilterModal');
        const modalOverlay = agentFilterModal?.querySelector('.modal-overlay');
        const clearBtn = document.getElementById('clearAgentSelection');
        const applyBtn = document.getElementById('applyAgentFilter');
        
        // 모달 열기
        if (agentFilterBtn) {
            agentFilterBtn.addEventListener('click', () => {
                this.openAgentFilterModal();
            });
        }
        
        // 모달 닫기
        const closeModal = () => {
            this.closeAgentFilterModal();
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.agentFilterModalOpen) {
                closeModal();
            }
        });
        
        // 전체 해제 버튼
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAgentSelection();
            });
        }
        
        // 적용 버튼
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyAgentFilter();
            });
        }
    }
    
    // 요원 필터 모달 열기
    async openAgentFilterModal() {
        const modal = document.getElementById('agentFilterModal');
        const agentFilterBtn = document.getElementById('agentFilterBtn');
        
        if (!modal) return;
        
        // 모달 표시
        modal.classList.add('active');
        agentFilterBtn?.classList.add('active');
        this.agentFilterModalOpen = true;
        
        // body 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 요원 목록이 없다면 로드
        if (!this.agents || Object.keys(this.agents).length === 0) {
            await this.loadAgentsForModal();
        } else {
            this.renderAgentFilterModal();
        }
    }
    
    // 요원 필터 모달 닫기
    closeAgentFilterModal() {
        const modal = document.getElementById('agentFilterModal');
        const agentFilterBtn = document.getElementById('agentFilterBtn');
        
        if (!modal) return;
        
        modal.classList.remove('active');
        agentFilterBtn?.classList.remove('active');
        this.agentFilterModalOpen = false;
        
        // body 스크롤 복원
        document.body.style.overflow = '';
    }
    
    // 모달용 요원 목록 로드
    async loadAgentsForModal() {
        const loadingEl = document.getElementById('agentFilterLoading');
        const errorEl = document.getElementById('agentFilterError');
        const gridEl = document.getElementById('agentFilterGrid');
        
        try {
            // 로딩 상태 표시
            if (loadingEl) loadingEl.style.display = 'block';
            if (errorEl) errorEl.style.display = 'none';
            if (gridEl) gridEl.style.display = 'none';
            
            const response = await fetch('/api/valorant.php?action=get_agents');
            const data = await response.json();
            
            if (data.success) {
                const agentsArray = data.data?.agents || data.agents || [];
                this.agents = this.groupAgentsByRole(agentsArray);
                this.renderAgentFilterModal();
            } else {
                throw new Error(data.error || '요원 정보 로드 실패');
            }
        } catch (error) {
            console.error('요원 정보 로드 오류:', error);
            
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) {
                errorEl.style.display = 'block';
                errorEl.querySelector('p').textContent = error.message;
            }
        }
    }
    
    // 요원 필터 모달 렌더링
    renderAgentFilterModal() {
        const loadingEl = document.getElementById('agentFilterLoading');
        const errorEl = document.getElementById('agentFilterError');
        const gridEl = document.getElementById('agentFilterGrid');
        
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        if (gridEl) gridEl.style.display = 'block';
        
        // 요원 그리드 렌더링
        this.renderAgentGrid();
        
        // 선택 카운트 업데이트
        this.updateSelectedCount();
    }
    
    
    // 요원 그리드 렌더링 (역할별 그룹화)
    renderAgentGrid() {
        const gridEl = document.getElementById('agentFilterGrid');
        if (!gridEl || !this.agents) return;
        
        let html = '';
        
        // 역할별 아이콘 매핑
        const roleIcons = {
            '타격대': '🔥',
            '척후대': '🎯',
            '감시자': '🛡️',
            '연막': '💨'
        };
        
        // 역할별로 그룹화하여 표시
        Object.entries(this.agents).forEach(([roleName, roleData]) => {
            const roleIcon = roleIcons[roleName] || '⚡';
            
            // 역할 제목
            html += `
                <div class="agent-role-section">
                    <h4 class="agent-role-title">
                        <i class="role-icon">${roleIcon}</i>
                        <span>${roleName}</span>
                    </h4>
                    <div class="agent-role-grid">
            `;
            
            // 해당 역할의 요원들
            roleData.agents.forEach(agent => {
                const isSelected = this.selectedAgents.includes(agent.id);
                const imageSrc = agent.image || '/assets/images/valorant/default-agent.webp';
                
                html += `
                    <div class="agent-filter-card ${isSelected ? 'selected' : ''}" 
                         data-agent-id="${agent.id}" data-role="${roleName}">
                        <img src="${imageSrc}" alt="${agent.name}" class="agent-filter-image" 
                             onerror="this.src='/assets/images/valorant/default-agent.webp'">
                        <p class="agent-filter-name">${agent.name}</p>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        gridEl.innerHTML = html;
        
        // 요원 카드 클릭 이벤트 리스너
        gridEl.querySelectorAll('.agent-filter-card').forEach(card => {
            card.addEventListener('click', () => {
                const agentId = parseInt(card.dataset.agentId);
                this.toggleAgentSelection(agentId, card);
            });
        });
    }
    
    // 개별 요원 선택/해제
    toggleAgentSelection(agentId, cardEl) {
        const isSelected = this.selectedAgents.includes(agentId);
        
        if (isSelected) {
            const index = this.selectedAgents.indexOf(agentId);
            this.selectedAgents.splice(index, 1);
            cardEl.classList.remove('selected');
        } else {
            this.selectedAgents.push(agentId);
            cardEl.classList.add('selected');
        }
        
        this.updateSelectedCount();
    }
    
    // 선택된 요원 수 업데이트
    updateSelectedCount() {
        const countEl = document.getElementById('selectedAgentCount');
        if (countEl) {
            countEl.textContent = this.selectedAgents.length;
        }
    }
    
    // 전체 선택 해제
    clearAgentSelection() {
        this.selectedAgents = [];
        this.renderAgentGrid();
        this.updateSelectedCount();
    }
    
    // 요원 필터 적용
    applyAgentFilter() {
        this.updateAgentFilterButtonText();
        this.currentPage = 1;
        this.loadPosts();
        this.closeAgentFilterModal();
    }

    // 요원 필터 버튼 텍스트 업데이트
    updateAgentFilterButtonText() {
        const filterTextEl = document.querySelector('.filter-text');
        if (!filterTextEl) return;
        
        const count = this.selectedAgents.length;
        
        if (count === 0) {
            filterTextEl.textContent = '모든 요원';
        } else if (count === 1) {
            const agentId = this.selectedAgents[0];
            const agentName = this.findAgentNameById(agentId);
            filterTextEl.textContent = agentName || '요원 1개';
        } else {
            filterTextEl.textContent = `요원 ${count}개`;
        }
    }
    
    // 요원 ID로 이름 찾기
    findAgentNameById(agentId) {
        for (const roleData of Object.values(this.agents)) {
            const agent = roleData.agents.find(a => a.id === agentId);
            if (agent) return agent.name;
        }
        return null;
    }
    
    // 요원 이름으로 해당 요원을 선택
    selectAgentByName(agentName) {
        
        if (!this.agents) {
            return;
        }
        
        
        for (const [roleName, roleData] of Object.entries(this.agents)) {
            
            const agent = roleData.agents.find(a => a.name === agentName);
            if (agent) {
                
                // 해당 요원을 선택된 목록에 추가
                this.selectedAgents = [agent.id];
                
                // 필터 버튼 텍스트 업데이트
                this.updateAgentFilterButtonText();
                
                // 게시글 다시 로드
                this.currentPage = 1;
                this.loadPosts();
                
                // URL에서 파라미터 제거 (선택적)
                const url = new URL(window.location);
                url.searchParams.delete('agent');
                window.history.replaceState({}, '', url);
                
                return; // 찾았으므로 종료
            }
        }
        
        // 요원을 찾지 못했을 때 전체 게시글 로드
        this.selectedAgents = [];
        this.currentPage = 1;
        this.loadPosts();
    }
    
    async updateBoardStats() {
        try {
            // 간단한 통계 업데이트 (실제로는 API에서 별도로 가져와야 함)
            const totalPostsEl = document.getElementById('totalPosts');
            const totalViewsEl = document.getElementById('totalViews');
            
            if (totalPostsEl) totalPostsEl.textContent = '로딩중...';
            if (totalViewsEl) totalViewsEl.textContent = '로딩중...';
            
            // 실제 통계는 현재 로드된 게시글에서 추정
            // 나중에 별도 API 엔드포인트로 개선 가능
        } catch (error) {
            console.error('통계 업데이트 오류:', error);
        }
    }
    
    displayAgentInfo(agent) {
        const loading = document.querySelector('.agent-info-loading');
        const info = document.querySelector('.agent-info');
        
        if (loading) loading.style.display = 'none';
        if (info) info.style.display = 'flex';
        
        // 요원 정보 표시
        const agentImage = document.getElementById('agentImage');
        const agentName = document.getElementById('agentName');
        const agentType = document.getElementById('agentType');
        const agentTypeBadge = document.getElementById('agentTypeBadge');
        const agentDescription = document.getElementById('agentDescription');
        
        if (agentImage) {
            agentImage.src = agent.image;
            agentImage.alt = agent.name;
        }
        
        if (agentName) {
            agentName.textContent = agent.name;
        }
        
        if (agentType) {
            agentType.textContent = `${agent.type.name} (${agent.type.name_en})`;
        }
        
        if (agentTypeBadge) {
            agentTypeBadge.style.background = agent.type.color;
            agentTypeBadge.innerHTML = this.getTypeEmoji(agent.type.name);
        }
        
        if (agentDescription) {
            agentDescription.textContent = this.getAgentDescription(agent.name);
        }
    }
    
    getTypeEmoji(typeName) {
        const emojiMap = {
            '타격대': '🔥',
            '척후대': '🎯',
            '감시자': '🛡️',
            '연막': '💨'
        };
        return emojiMap[typeName] || '⚡';
    }
    
    getAgentDescription(agentName) {
        const descriptions = {
            '네온': '전광석화 같은 속도로 전장을 누비는 타격대 요원입니다.',
            '레이나': '적을 처치할수록 강해지는 생명력 흡수 능력을 가진 타격대입니다.',
            '레이즈': '강력한 폭발물로 적진을 쑥대밭으로 만드는 파괴의 전문가입니다.',
            '아이소': '적의 공격을 차단하고 반격하는 방어형 타격대 요원입니다.',
            '요루': '차원 이동 능력으로 예측 불가능한 공격을 펼치는 암살자입니다.',
            '제트': '바람의 힘을 이용해 빠르게 이동하며 적을 제압합니다.',
            '피닉스': '화염과 치유 능력을 동시에 지닌 균형잡힌 타격대입니다.',
            '게코': '생명체 친구들과 함께 팀을 지원하는 척후대 요원입니다.',
            '브리치': '강력한 지진 능력으로 적의 위치를 무너뜨립니다.',
            '소바': '정찰 드론과 화살로 적의 위치를 파악하는 정보전의 달인입니다.',
            '스카이': '자연의 힘으로 팀을 치유하고 적을 추적합니다.',
            '케이오': '로봇 요원으로 적의 능력을 무력화시킵니다.',
            '페이드': '악몽과 공포로 적의 정신을 혼란에 빠뜨립니다.',
            '데드록': '나노와이어 기술로 적의 움직임을 제한합니다.',
            '바이스': '금속 조작 능력으로 전장을 통제하는 감시자입니다.',
            '사이퍼': '함정과 감시 장비의 마스터, 정보전의 최고수입니다.',
            '세이지': '치유와 부활 능력을 가진 팀의 수호천사입니다.',
            '체임버': '정밀한 저격과 순간이동을 겸비한 프랑스 무기상입니다.',
            '킬조이': '터렛과 알람봇으로 지역을 수비하는 독일의 천재 발명가입니다.',
            '바이퍼': '독성 가스로 적진을 오염시키는 화학전의 전문가입니다.',
            '브림스톤': '궤도 타격과 연막으로 전장을 장악하는 베테랑 지휘관입니다.',
            '아스트라': '우주의 힘을 빌려 연막과 중력장을 조작합니다.',
            '오멘': '그림자 속에서 나타나 연막으로 시야를 차단합니다.',
            '클로브': '죽음을 초월하는 능력으로 팀을 지원하는 연막 컨트롤러입니다.',
            '하버': '물의 힘으로 방어막과 연막을 생성합니다.'
        };
        return descriptions[agentName] || `${agentName} 요원의 상세한 공략과 팁을 확인해보세요.`;
    }
    
    async loadPosts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showPostsLoading();
        
        try {
            let url = `/api/valorant.php?action=get_posts&page=${this.currentPage}&sort=${this.currentSort}&limit=10`;
            
            // 특정 요원 페이지인 경우
            if (this.agentName) {
                url += `&agent_name=${encodeURIComponent(this.agentName)}`;
            }
            
            // 선택된 요원들이 있는 경우 (다중 선택)
            if (!this.agentName && this.selectedAgents.length > 0) {
                url += `&agent_ids=${this.selectedAgents.join(',')}`;
            }
            
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                this.displayPosts(data.data.posts);
                this.displayPagination(data.data.pagination);
                this.updateStats(data.data.posts);
            } else {
                this.showError(data.error || '게시글을 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('게시글 로드 오류:', error);
            this.showError('네트워크 오류가 발생했습니다.');
        }
        
        this.isLoading = false;
    }
    
    showPostsLoading() {
        const loading = document.getElementById('postsLoading');
        const postsList = document.getElementById('postsList');
        const emptyPosts = document.getElementById('emptyPosts');
        const pagination = document.getElementById('pagination');
        
        if (loading) loading.style.display = 'block';
        if (postsList) postsList.style.display = 'none';
        if (emptyPosts) emptyPosts.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
    }
    
    displayPosts(posts) {
        const loading = document.getElementById('postsLoading');
        const postsList = document.getElementById('postsList');
        const emptyPosts = document.getElementById('emptyPosts');
        
        if (loading) loading.style.display = 'none';
        
        if (!posts || posts.length === 0) {
            if (postsList) postsList.style.display = 'none';
            if (emptyPosts) emptyPosts.style.display = 'block';
            return;
        }
        
        if (emptyPosts) emptyPosts.style.display = 'none';
        if (postsList) {
            postsList.style.display = 'block';
            postsList.innerHTML = posts.map(post => this.renderPostCard(post)).join('');
        }
    }
    
    renderPostCard(post) {
        const difficultyLabels = {
            'beginner': '초급',
            'intermediate': '중급',
            'advanced': '고급'
        };
        
        const categoryLabels = {
            'strategy': '전략',
            'skill': '스킬',
            'map': '맵',
            'general': '일반'
        };
        
        // 타입 일치를 위해 문자열로 변환하여 비교
        const isFavorited = this.favorites.includes(String(post.id));
        
        
        return `
            <div class="post-card" data-post-id="${post.id}">
                ${post.is_notice ? '<div class="notice-badge">📢 공지</div>' : ''}
                ${post.is_featured ? '<div class="featured-badge">⭐ 추천</div>' : ''}
                
                <div class="post-header">
                    <div class="post-meta-info">
                        <div class="agent-info">
                            <img src="${post.agent_image}" alt="${post.agent_name}" class="agent-thumbnail">
                            <span class="agent-name">${post.agent_name}</span>
                        </div>
                        <div class="post-difficulty difficulty-${post.tip_difficulty}">
                            ${difficultyLabels[post.tip_difficulty] || '일반'}
                        </div>
                        <div class="post-category">
                            ${categoryLabels[post.tip_category] || '일반'}
                        </div>
                    </div>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                            onclick="board.toggleFavorite(${post.id}, this)">
                        ${isFavorited ? '⭐' : '☆'}
                    </button>
                </div>
                
                <div class="post-content" onclick="window.location.href='/game/valorant/post/${post.id}'">
                    <h3 class="post-title">
                        <a href="/game/valorant/post/${post.id}" class="post-link">
                            ${this.escapeHtml(post.title)}
                        </a>
                    </h3>
                    <p class="post-summary">${this.escapeHtml(post.summary || '')}</p>
                </div>
                
                <div class="post-stats">
                    <div class="post-author">
                        <i class="author-icon">👤</i>
                        ${this.escapeHtml(post.nickname)}
                    </div>
                    <div class="stats-group">
                        <span class="stat-item">
                            <i class="stat-icon">👁️</i>
                            ${this.formatNumber(post.view_count)}
                        </span>
                        <span class="stat-item">
                            <i class="stat-icon">💬</i>
                            ${this.formatNumber(post.comment_count)}
                        </span>
                        <span class="stat-item">
                            <i class="stat-icon">⭐</i>
                            ${this.formatNumber(post.favorite_count)}
                        </span>
                    </div>
                    <div class="post-time">${post.time_ago}</div>
                </div>
            </div>
        `;
    }
    
    displayPagination(pagination) {
        const paginationDiv = document.getElementById('pagination');
        if (!paginationDiv) return;
        
        if (pagination.total_pages <= 1) {
            paginationDiv.style.display = 'none';
            return;
        }
        
        paginationDiv.style.display = 'block';
        
        let html = '';
        
        // 이전 버튼
        if (pagination.has_prev) {
            html += `<button class="page-btn prev" onclick="board.changePage(${pagination.current_page - 1})">이전</button>`;
        }
        
        // 페이지 번호들
        const startPage = Math.max(1, pagination.current_page - 2);
        const endPage = Math.min(pagination.total_pages, pagination.current_page + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="page-btn ${i === pagination.current_page ? 'current' : ''}" 
                     onclick="board.changePage(${i})">${i}</button>`;
        }
        
        // 다음 버튼
        if (pagination.has_next) {
            html += `<button class="page-btn next" onclick="board.changePage(${pagination.current_page + 1})">다음</button>`;
        }
        
        paginationDiv.innerHTML = html;
    }
    
    changePage(page) {
        this.currentPage = page;
        this.loadPosts();
        
        // 스크롤을 위로
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateStats(posts) {
        if (!posts) return;
        
        // 특정 요원 페이지인 경우
        if (this.agentName) {
            const totalTips = document.getElementById('totalTips');
            const totalViews = document.getElementById('totalViews');
            const totalLikes = document.getElementById('totalLikes');
            
            let views = 0, likes = 0;
            posts.forEach(post => {
                views += parseInt(post.view_count) || 0;
                likes += parseInt(post.like_count) || 0;
            });
            
            if (totalTips) totalTips.textContent = this.formatNumber(posts.length);
            if (totalViews) totalViews.textContent = this.formatNumber(views);
            if (totalLikes) totalLikes.textContent = this.formatNumber(likes);
        } else {
            // 전체 게시판인 경우
            const totalPostsEl = document.getElementById('totalPosts');
            const totalViewsEl = document.getElementById('totalViews');
            
            let views = 0;
            posts.forEach(post => {
                views += parseInt(post.view_count) || 0;
            });
            
            if (totalPostsEl) totalPostsEl.textContent = this.formatNumber(posts.length);
            if (totalViewsEl) totalViewsEl.textContent = this.formatNumber(views);
        }
    }
    
    // 즐겨찾기 관련 메서드들
    loadFavorites() {
        try {
            const saved = localStorage.getItem('jjapshop_valorant_favorites');
            if (!saved) return [];
            
            const favoriteData = JSON.parse(saved);
            
            // 데이터가 배열인지 확인
            if (!Array.isArray(favoriteData)) return [];
            
            // 각 항목에서 ID를 추출
            const ids = favoriteData.map(item => {
                // item이 객체이고 id 속성이 있는 경우
                if (typeof item === 'object' && item.id) {
                    return String(item.id);
                }
                // item이 이미 ID인 경우
                if (typeof item === 'string' || typeof item === 'number') {
                    return String(item);
                }
                return null;
            }).filter(id => id !== null);
            
            return ids;
            
        } catch (error) {
            console.error('❌ 즐겨찾기 로드 오류:', error);
            return [];
        }
    }
    
    saveFavorites() {
        try {
            // 통합된 localStorage 키 사용 및 문자열 배열로 저장
            const idsToSave = this.favorites.map(id => String(id));
            localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(idsToSave));
            this.updateFavoriteCount();
        } catch (error) {
            console.error('❌ 즐겨찾기 저장 오류:', error);
        }
    }

    toggleFavorite(postId, btnElement) {
        const postIdStr = String(postId);
        const index = this.favorites.indexOf(postIdStr);
        
        
        if (index > -1) {
            // 즐겨찾기 제거
            this.favorites.splice(index, 1);
            btnElement.textContent = '☆';
            btnElement.classList.remove('favorited');
            
            this.showToast('즐겨찾기에서 제거되었습니다! 💔', 'info');
        } else {
            // 즐겨찾기 추가
            this.favorites.unshift(postIdStr); // 맨 앞에 추가
            btnElement.textContent = '⭐';
            btnElement.classList.add('favorited');
            
            this.showToast('즐겨찾기에 추가되었습니다! ⭐', 'success');
        }
        
        this.updateFavoriteCount();
        this.saveFavorites();
    }
    
    updateFavoriteCount() {
        const countElement = document.getElementById('favoriteCount');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }
    
    async openFavoritesModal() {
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            modal.style.display = 'block';
            
            // 요원 필터 옵션 로드
            await this.loadAgentFilters();
            
            // 즐겨찾기 목록 렌더링
            this.renderFavorites();
        }
    }
    
    async loadAgentFilters() {
        try {
            const response = await fetch('/api/valorant.php?action=get_agents');
            const data = await response.json();
            
            if (data.success) {
                const filterSelect = document.getElementById('favoritesAgentFilter');
                if (filterSelect) {
                    let options = '<option value="">모든 요원</option>';
                    
                    for (const roleData of Object.values(data.data.agents)) {
                        for (const agent of roleData.agents) {
                            options += `<option value="${agent.name}">${agent.name}</option>`;
                        }
                    }
                    
                    filterSelect.innerHTML = options;
                }
            }
        } catch (error) {
            console.error('요원 필터 로드 오류:', error);
        }
    }
    
    async renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        
        if (this.favorites.length === 0) {
            if (favoritesList) favoritesList.style.display = 'none';
            if (favoritesEmpty) favoritesEmpty.style.display = 'block';
            return;
        }
        
        if (favoritesEmpty) favoritesEmpty.style.display = 'none';
        if (favoritesList) favoritesList.style.display = 'block';
        
        try {
            const postIds = this.favorites.join(',');
            const response = await fetch(`/api/valorant.php?action=get_favorites&post_ids=${postIds}`);
            const data = await response.json();
            
            if (data.success) {
                this.displayFavoritesList(data.data.posts);
            } else {
                console.error('즐겨찾기 로드 실패:', data.error);
            }
        } catch (error) {
            console.error('즐겨찾기 렌더링 오류:', error);
        }
    }
    
    displayFavoritesList(posts) {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;
        
        const className = this.currentViewMode === 'feed' ? 'favorites-feed' : 'favorites-list-view';
        favoritesList.className = `favorites-list ${className}`;
        
        if (this.currentViewMode === 'feed') {
            favoritesList.innerHTML = posts.map(post => this.renderFavoriteFeedCard(post)).join('');
        } else {
            favoritesList.innerHTML = posts.map(post => this.renderFavoriteListItem(post)).join('');
        }
    }
    
    renderFavoriteFeedCard(post) {
        return `
            <div class="favorite-feed-card">
                <div class="feed-card-header">
                    <img src="${post.agent_image}" alt="${post.agent_name}" class="agent-thumbnail">
                    <div class="feed-card-info">
                        <h4 class="feed-card-title">
                            <a href="/game/valorant/post/${post.id}">${this.escapeHtml(post.title)}</a>
                        </h4>
                        <div class="feed-card-meta">
                            <span class="agent-name">${post.agent_name}</span>
                            <span class="post-time">${post.time_ago}</span>
                        </div>
                    </div>
                    <button class="remove-favorite-btn" onclick="board.removeFavorite(${post.id}, this.closest('.favorite-feed-card'))">
                        ✕
                    </button>
                </div>
                <p class="feed-card-summary">${this.escapeHtml(post.summary || '')}</p>
                <div class="feed-card-stats">
                    <span class="stat-item">👁️ ${this.formatNumber(post.view_count)}</span>
                    <span class="stat-item">❤️ ${this.formatNumber(post.like_count)}</span>
                    <span class="stat-item">💬 ${this.formatNumber(post.comment_count)}</span>
                </div>
            </div>
        `;
    }
    
    renderFavoriteListItem(post) {
        return `
            <div class="favorite-list-item">
                <div class="favorite-item-content">
                    <div class="favorite-item-header">
                        <img src="${post.agent_image}" alt="${post.agent_name}" class="agent-thumbnail">
                        <div class="favorite-item-info">
                            <h4 class="favorite-item-title">
                                <a href="/game/valorant/post/${post.id}">${this.escapeHtml(post.title)}</a>
                            </h4>
                            <div class="favorite-item-meta">
                                <span class="agent-name">${post.agent_name}</span>
                                <span class="post-author">${this.escapeHtml(post.nickname)}</span>
                                <span class="post-time">${post.time_ago}</span>
                            </div>
                        </div>
                    </div>
                    <p class="favorite-item-summary">${this.escapeHtml(post.summary || '')}</p>
                </div>
                <div class="favorite-item-actions">
                    <div class="favorite-item-stats">
                        <span class="stat-item">👁️ ${this.formatNumber(post.view_count)}</span>
                        <span class="stat-item">❤️ ${this.formatNumber(post.like_count)}</span>
                        <span class="stat-item">💬 ${this.formatNumber(post.comment_count)}</span>
                    </div>
                    <button class="remove-favorite-btn" onclick="board.removeFavorite(${post.id}, this.closest('.favorite-list-item'))">
                        제거
                    </button>
                </div>
            </div>
        `;
    }
    
    removeFavorite(postId, element) {
        this.toggleFavorite(postId, { 
            textContent: '⭐', 
            classList: { 
                remove: () => {}, 
                add: () => {} 
            } 
        });
        
        // 요소 제거 애니메이션
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            element.remove();
            
            // 즐겨찾기 목록이 비어있다면 빈 상태 표시
            if (this.favorites.length === 0) {
                this.renderFavorites();
            }
        }, 300);
    }
    
    filterFavorites() {
        const searchTerm = document.getElementById('favoritesSearch')?.value || '';
        const agentFilter = document.getElementById('favoritesAgentFilter')?.value || '';
        
        // 클라이언트 사이드 필터링 (간단한 구현)
        const items = document.querySelectorAll('.favorite-feed-card, .favorite-list-item');
        
        items.forEach(item => {
            const title = item.querySelector('.feed-card-title, .favorite-item-title')?.textContent || '';
            const agent = item.querySelector('.agent-name')?.textContent || '';
            
            const matchesSearch = !searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAgent = !agentFilter || agent === agentFilter;
            
            item.style.display = matchesSearch && matchesAgent ? 'block' : 'none';
        });
    }
    
    // 유틸리티 메서드들
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    showError(message) {
        console.error('Valorant Board Error:', message);
        // 에러 토스트나 알림을 표시할 수 있음
        
        // 간단한 알림
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: message,
                background: '#1a1a2e',
                color: '#ffffff'
            });
        } else {
            alert(message);
        }
    }
    
    // 토스트 메시지 표시
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `valorant-toast valorant-toast-${type}`;
        toast.textContent = message;
        
        // 토스트 스타일링
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: '99999',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '400px',
            wordBreak: 'break-word'
        });
        
        // 타입별 색상 설정
        if (type === 'success') {
            Object.assign(toast.style, {
                background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
                color: 'white'
            });
        } else if (type === 'info') {
            Object.assign(toast.style, {
                background: 'linear-gradient(135deg, #2196F3, #64B5F6)',
                color: 'white'
            });
        } else if (type === 'error') {
            Object.assign(toast.style, {
                background: 'linear-gradient(135deg, #F44336, #EF5350)',
                color: 'white'
            });
        }
        
        document.body.appendChild(toast);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
        
    }
}

// ValorantBoard 클래스를 전역으로 export
window.ValorantBoard = ValorantBoard;
window.onload = function() {
    window.ValorantBoard.applyAgentFilter();
};


