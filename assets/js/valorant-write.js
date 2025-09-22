// 발로란트 팁 작성 페이지 JavaScript

class ValorantWrite {
    constructor() {
        this.agents = [];
        this.quill = null;
        this.selectedAgent = null;
        this.isSubmitting = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 ValorantWrite init() 호출됨');
        
        try {
            this.bindEvents();
            console.log('✅ bindEvents() 완료');
            
            this.loadAgents();
            console.log('✅ loadAgents() 호출됨');
            
            this.initQuillEditor();
            console.log('✅ initQuillEditor() 완료');
            
            this.setupFormValidation();
            console.log('✅ setupFormValidation() 완료');
            
            this.initCaptcha();
            console.log('✅ initCaptcha() 완료');
            
            this.initAgentModal();
            console.log('✅ initAgentModal() 완료');
            
        } catch (error) {
            console.error('❌ ValorantWrite init() 오류:', error);
        }
    }
    
    bindEvents() {
        // 폼 제출
        const form = document.getElementById('writeForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // 취소 버튼
        const cancelBtn = document.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.handleCancel());
        }
        
        
        // 제목 입력 문자수 체크
        const titleInput = document.getElementById('titleInput');
        if (titleInput) {
            titleInput.addEventListener('input', () => this.updateCharCount('titleInput', 100));
        }
        
        // 닉네임 입력 문자수 체크
        const nicknameInput = document.getElementById('nicknameInput');
        if (nicknameInput) {
            nicknameInput.addEventListener('input', () => this.updateCharCount('nicknameInput', 20));
        }
    }
    
    async loadAgents() {
        try {
            // 디버그 정보 추가
            const loadingDiv = document.getElementById('agentSelectorLoading');
            if (loadingDiv) {
                loadingDiv.innerHTML = `
                    <div class="agent-selector-loading">
                        <div class="loading-spinner">⚡</div>
                        <span>API 호출 중... (/api/valorant.php?action=get_agents)</span>
                    </div>
                `;
            }
            
            const response = await fetch('/api/valorant.php?action=get_agents');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 응답 데이터를 콘솔에 출력 (디버깅용)
            if (window.location.hostname === 'localhost' || window.location.hostname.includes('jjap.shop')) {
                const agentsArray = data.data?.agents || data.agents;
                console.group('🎯 발로란트 API 응답');
                console.log('Status:', response.status);
                console.log('Data:', data);
                console.log('Success:', data.success);
                console.log('Agents Array:', agentsArray);
                console.log('Agents count:', agentsArray ? agentsArray.length : 0);
                console.log('Data structure check:');
                console.log('  - data.agents:', data.agents ? `Array(${data.agents.length})` : 'undefined');
                console.log('  - data.data.agents:', data.data?.agents ? `Array(${data.data.agents.length})` : 'undefined');
                console.groupEnd();
            }
            
            // API 응답 구조 확인: data.data.agents 또는 data.agents
            const agentsArray = data.data?.agents || data.agents;
            
            if (data.success && agentsArray) {
                this.agentsData = agentsArray;
                this.hideAgentLoading();
                
                // 요원 목록이 비어있는지 확인
                if (agentsArray.length === 0) {
                    this.showAgentEmptyMessage();
                    return;
                }
                
                // 성공 메시지 잠시 표시
                if (loadingDiv) {
                    loadingDiv.innerHTML = `
                        <div class="agent-selector-loading">
                            <span style="color: #27ae60;">✅ ${agentsArray.length}명의 요원 로드 완료</span>
                        </div>
                    `;
                    setTimeout(() => {
                        this.hideAgentLoading();
                    }, 1000);
                }
                
                // 미리 선택된 요원이 있으면 설정
                const preSelectedAgent = window.preSelectedAgent || '';
                if (preSelectedAgent) {
                    this.setPreSelectedAgent(preSelectedAgent);
                }
            } else {
                // API 응답에서 구체적인 오류 메시지가 있으면 표시
                const errorMsg = data.error || data.data?.error || '요원 목록을 불러올 수 없습니다';
                this.handleAgentLoadError(`API 오류: ${errorMsg}`, {
                    response_structure: {
                        success: data.success,
                        has_data: !!data.data,
                        has_agents: !!(data.data?.agents || data.agents),
                        agents_count: (data.data?.agents || data.agents)?.length || 0
                    }
                });
            }
            
        } catch (error) {
            this.handleAgentLoadError(`네트워크 오류: ${error.message} | API 테스트: /admin/test_api.php`);
        }
    }
    
    hideAgentLoading() {
        const loadingDiv = document.getElementById('agentSelectorLoading');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
    }
    
    handleAgentLoadError(message = '요원 목록을 불러올 수 없습니다.', debugInfo = null) {
        const loadingDiv = document.getElementById('agentSelectorLoading');
        if (loadingDiv) {
            let html = `
                <div class="agent-selector-loading">
                    <span style="color: #FF4655; font-size: 1.5rem;">❌</span>
                    <span>${message}</span>
            `;
            
            // 디버그 정보가 있으면 추가
            if (debugInfo && debugInfo.response_structure) {
                const rs = debugInfo.response_structure;
                html += `
                    <div style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.6);">
                        <div>🔍 디버그 정보:</div>
                        <div>Success: ${rs.success}</div>
                        <div>Has Data: ${rs.has_data}</div>
                        <div>Has Agents: ${rs.has_agents}</div>
                        <div>Agents Count: ${rs.agents_count}</div>
                    </div>
                `;
            }
            
            html += `
                    <div style="margin-top: 10px;">
                        <small style="color: rgba(255,255,255,0.7);">
                            DB 설정이 필요할 수 있습니다. 
                            <a href="/admin/test_api.php" target="_blank" style="color: #FF4655;">API 테스트</a>를 확인하세요.
                        </small>
                    </div>
                </div>
            `;
            
            loadingDiv.innerHTML = html;
        }
    }
    
    showAgentEmptyMessage() {
        const loadingDiv = document.getElementById('agentSelectorLoading');
        if (loadingDiv) {
            loadingDiv.innerHTML = `
                <div class="agent-selector-loading">
                    <span style="color: #FFD700; font-size: 1.5rem;">⚠️</span>
                    <span>등록된 요원이 없습니다.</span>
                    <div style="margin-top: 10px;">
                        <small style="color: rgba(255,255,255,0.7);">
                            <a href="/admin/test_api.php" target="_blank" style="color: #FF4655;">API 테스트 페이지</a>에서 요원 데이터를 확인하세요.
                        </small>
                    </div>
                </div>
            `;
        }
    }
    
    initQuillEditor() {
        // Quill 라이브러리가 로드되었는지 확인
        if (typeof Quill === 'undefined') {
            this.showQuillError();
            return;
        }
        
        const editorElement = document.getElementById('editor');
        if (!editorElement) {
            this.showQuillError();
            return;
        }
        
        // 기존 에디터가 있으면 제거
        if (this.quill) {
            try {
                const existingToolbar = document.querySelector('.ql-toolbar');
                const existingContainer = document.querySelector('.ql-container');
                if (existingToolbar) existingToolbar.remove();
                if (existingContainer) existingContainer.remove();
                this.quill = null;
            } catch (e) {
                // 무시
            }
        }
        
        // 에디터 컨테이너 초기화
        editorElement.innerHTML = '';
        editorElement.className = 'editor';
        
        try {
            this.quill = new Quill(editorElement, {
                theme: 'snow',
                placeholder: '유용한 팁과 전략을 자세히 작성해주세요...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['clean']
                    ]
                }
            });
            
            // Quill 객체가 제대로 생성되었는지 확인
            if (!this.quill || typeof this.quill.on !== 'function') {
                throw new Error('Quill editor initialization failed');
            }
            
            // 에디터 포커스 이벤트
            const editorContainer = document.querySelector('.editor-container');
            if (editorContainer) {
                this.quill.on('selection-change', (range) => {
                    if (range) {
                        editorContainer.classList.add('focused');
                    } else {
                        editorContainer.classList.remove('focused');
                    }
                });
            }
            
            // 이미지 업로드 핸들러
            const toolbar = this.quill.getModule('toolbar');
            if (toolbar && typeof toolbar.addHandler === 'function') {
                toolbar.addHandler('image', () => this.handleImageUpload());
            }
            
        } catch (error) {
            this.showQuillError();
        }
    }
    
    showQuillError() {
        const editorElement = document.getElementById('editor');
        if (editorElement) {
            editorElement.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: #FF4655; background: rgba(255, 70, 85, 0.1); border: 2px solid rgba(255, 70, 85, 0.3); border-radius: 12px;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">❌</div>
                    <div style="font-size: 1.1rem; margin-bottom: 0.5rem;">에디터를 불러올 수 없습니다</div>
                    <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">페이지를 새로고침 해보세요</div>
                </div>
            `;
        }
    }
    
    handleImageUpload() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
            const file = input.files[0];
            if (file) {
                this.uploadImage(file);
            }
        };
    }
    
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('/api/valorant.php?action=upload_image', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                const range = this.quill.getSelection(true);
                this.quill.insertEmbed(range.index, 'image', data.data.url);
                this.quill.setSelection(range.index + 1);
            } else {
                this.showAlert('이미지 업로드 실패: ' + data.error, 'error');
            }
            
        } catch (error) {
            this.showAlert('이미지 업로드 중 오류가 발생했습니다.', 'error');
        }
    }
    
    setupFormValidation() {
        // 실시간 유효성 검사는 여기서 설정
    }
    
    updateCharCount(inputId, maxLength) {
        const input = document.getElementById(inputId);
        const countElement = input?.parentElement?.querySelector('.char-count');
        
        if (input && countElement) {
            const currentLength = input.value.length;
            countElement.textContent = `${currentLength} / ${maxLength}`;
            
            // 경고 색상 적용
            countElement.classList.remove('warning', 'error');
            if (currentLength > maxLength * 0.9) {
                countElement.classList.add('warning');
            }
            if (currentLength > maxLength) {
                countElement.classList.add('error');
            }
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // 폼 유효성 검사
        const validationResult = this.validateForm();
        if (!validationResult.isValid) {
            this.showAlert(validationResult.message, 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.showLoading(true);
        
        try {
            const formData = this.getFormData();
            console.log('🚀 글 작성 시작 - FormData:', Object.fromEntries(formData));
            
            const response = await fetch('/api/valorant.php?action=create_post', {
                method: 'POST',
                body: formData
            });
            
            console.log('📡 API 응답 상태:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const responseText = await response.text();
            console.log('📝 API 응답 원문:', responseText);
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('❌ JSON 파싱 오류:', jsonError);
                throw new Error(`잘못된 JSON 응답: ${responseText.substring(0, 200)}...`);
            }
            
            console.log('📊 파싱된 응답 데이터:', data);
            
            if (data.success) {
                console.log('✅ 글 작성 성공!');
                this.showAlert('팁이 성공적으로 등록되었습니다!', 'success');
                
                // 2초 후 게시판으로 이동
                setTimeout(() => {
                    window.location.href = '/game/valorant/board';
                }, 2000);
                
            } else {
                console.error('❌ API 오류:', data.error);
                this.showAlert('팁 등록 실패: ' + (data.error || '알 수 없는 오류'), 'error');
            }
            
        } catch (error) {
            console.error('❌ 글 작성 오류:', error);
            this.showAlert('팁 등록 중 오류가 발생했습니다: ' + error.message, 'error');
        } finally {
            this.isSubmitting = false;
            this.showLoading(false);
        }
    }
    
    validateForm() {
        // 요원 선택 검사
        const selectedAgentId = document.getElementById('selectedAgentId')?.value;
        if (!selectedAgentId) {
            return { isValid: false, message: '요원을 선택해주세요.' };
        }
        
        // 제목 검사
        const title = document.getElementById('titleInput')?.value?.trim();
        if (!title) {
            return { isValid: false, message: '제목을 입력해주세요.' };
        }
        if (title.length > 100) {
            return { isValid: false, message: '제목은 100자 이하로 입력해주세요.' };
        }
        
        // 내용 검사
        const content = this.quill?.getText()?.trim();
        if (!content || content.length < 10) {
            return { isValid: false, message: '내용을 10자 이상 입력해주세요.' };
        }
        
        // 닉네임 검사
        const nickname = document.getElementById('nicknameInput')?.value?.trim();
        if (!nickname) {
            return { isValid: false, message: '닉네임을 입력해주세요.' };
        }
        if (nickname.length > 20) {
            return { isValid: false, message: '닉네임은 20자 이하로 입력해주세요.' };
        }
        
        // 비밀번호 검사
        const password = document.getElementById('passwordInput')?.value;
        if (!password) {
            return { isValid: false, message: '비밀번호를 입력해주세요.' };
        }
        if (password.length < 4) {
            return { isValid: false, message: '비밀번호는 4자 이상 입력해주세요.' };
        }
        
        // CAPTCHA 검사
        const captchaInput = document.getElementById('captchaInput')?.value?.trim();
        const captchaImage = document.getElementById('captchaImage');
        
        if (!captchaInput || captchaInput.length !== 2) {
            return { isValid: false, message: 'CAPTCHA를 정확히 2글자 입력해주세요.' };
        }
        
        if (!captchaImage || captchaImage.dataset.captcha !== captchaInput) {
            // CAPTCHA 새로고침
            this.generateCaptcha();
            document.getElementById('captchaInput').value = '';
            return { isValid: false, message: '자동입력방지문구가 일치하지 않습니다. 다시 입력해주세요.' };
        }
        
        return { isValid: true };
    }
    
    getFormData() {
        const formData = new FormData();
        
        // 안전한 요소 접근 함수
        const getElementValue = (id, defaultValue = '') => {
            const element = document.getElementById(id);
            return element ? element.value : defaultValue;
        };
        
        const getRadioValue = (name, defaultValue = '') => {
            const element = document.querySelector(`input[name="${name}"]:checked`);
            return element ? element.value : defaultValue;
        };
        
        formData.append('agent_id', getElementValue('selectedAgentId'));
        formData.append('title', getElementValue('titleInput').trim());
        formData.append('content', this.quill ? this.quill.root.innerHTML : '');
        formData.append('tip_category', getElementValue('categorySelect', 'general'));
        formData.append('tip_difficulty', getRadioValue('tip_difficulty', 'beginner'));
        formData.append('nickname', getElementValue('nicknameInput').trim());
        formData.append('password', getElementValue('passwordInput'));
        formData.append('captcha', getElementValue('captchaInput').trim());
        
        return formData;
    }
    
    handleCancel() {
        if (confirm('작성을 취소하시겠습니까? 작성된 내용이 모두 사라집니다.')) {
            window.location.href = '/game/valorant/board';
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        }
        
        // 제출 버튼 비활성화
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = show;
        }
    }
    
    showAlert(message, type = 'info') {
        // SweetAlert2가 있으면 사용
        if (typeof Swal !== 'undefined') {
            const config = {
                text: message,
                timer: type === 'success' ? 2000 : 5000,
                showConfirmButton: type !== 'success'
            };
            
            if (type === 'success') {
                config.title = '성공!';
                config.icon = 'success';
            } else if (type === 'error') {
                config.title = '오류';
                config.icon = 'error';
            } else {
                config.title = '알림';
                config.icon = 'info';
            }
            
            Swal.fire(config);
        } else {
            alert(message);
        }
    }
    
    // CAPTCHA 관련 메서드
    initCaptcha() {
        this.generateCaptcha();
        
        const refreshBtn = document.getElementById('refreshCaptcha');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.generateCaptcha();
            });
        }
        
        // CAPTCHA 실시간 검증
        const captchaInput = document.getElementById('captchaInput');
        if (captchaInput) {
            captchaInput.addEventListener('input', (e) => {
                this.validateCaptchaInput(e);
            });
        }
    }
    
    generateCaptcha() {
        const captchaImage = document.getElementById('captchaImage');
        if (!captchaImage) return;
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 2; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        captchaImage.textContent = captcha;
        captchaImage.dataset.captcha = captcha;
        
        // 입력 필드 초기화
        const captchaInput = document.getElementById('captchaInput');
        if (captchaInput) {
            captchaInput.value = '';
            captchaInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }
    }
    
    validateCaptchaInput(e) {
        const value = e.target.value;
        if (value.length > 2) {
            e.target.value = value.slice(0, 2);
        }
        
        const captchaImage = document.getElementById('captchaImage');
        if (captchaImage && captchaImage.dataset.captcha) {
            if (value === captchaImage.dataset.captcha) {
                e.target.style.borderColor = '#48bb78';
                e.target.style.boxShadow = '0 0 10px rgba(72, 187, 120, 0.3)';
            } else if (value.length === 2) {
                e.target.style.borderColor = '#f56565';
                e.target.style.boxShadow = '0 0 10px rgba(245, 101, 101, 0.3)';
            } else {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = 'none';
            }
        }
    }
    
    // 요원 선택 모달 관련 메서드
    initAgentModal() {
        console.log('🎯 initAgentModal() 호출됨');
        
        const selectAgentBtn = document.getElementById('selectAgentBtn');
        const changeAgentBtn = document.getElementById('changeAgentBtn');
        const closeModalBtn = document.getElementById('closeAgentModal');
        const modalOverlay = document.getElementById('agentModalOverlay');
        
        console.log('🔍 요소 찾기 결과:');
        console.log('  - selectAgentBtn:', selectAgentBtn);
        console.log('  - changeAgentBtn:', changeAgentBtn);
        console.log('  - closeModalBtn:', closeModalBtn);
        console.log('  - modalOverlay:', modalOverlay);
        
        if (selectAgentBtn) {
            console.log('✅ selectAgentBtn 이벤트 리스너 추가');
            selectAgentBtn.addEventListener('click', (e) => {
                console.log('🖱️ selectAgentBtn 클릭됨!', e);
                this.openAgentModal();
            });
        } else {
            console.error('❌ selectAgentBtn을 찾을 수 없습니다!');
        }
        
        if (changeAgentBtn) {
            console.log('✅ changeAgentBtn 이벤트 리스너 추가');
            changeAgentBtn.addEventListener('click', (e) => {
                console.log('🖱️ changeAgentBtn 클릭됨!', e);
                this.openAgentModal();
            });
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.closeAgentModal();
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeAgentModal();
            });
        }
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAgentModal();
            }
        });
    }
    
    async openAgentModal() {
        console.log('🚀 openAgentModal() 호출됨');
        
        const modal = document.getElementById('agentSelectModal');
        const agentGrid = document.getElementById('agentGrid');
        const modalLoading = document.getElementById('agentModalLoading');
        
        console.log('🔍 모달 요소 찾기 결과:');
        console.log('  - modal:', modal);
        console.log('  - agentGrid:', agentGrid);
        console.log('  - modalLoading:', modalLoading);
        
        if (!modal) {
            console.error('❌ agentSelectModal을 찾을 수 없습니다!');
            return;
        }
        
        console.log('✅ 모달 열기 - active 클래스 추가 및 display 설정');
        modal.classList.add('active');
        modal.style.display = 'block'; // 인라인 display: none 제거
        
        console.log('📊 요원 데이터 상태:', {
            hasAgentsData: !!this.agentsData,
            agentsLength: this.agentsData?.length || 0
        });
        
        if (!this.agentsData || this.agentsData.length === 0) {
            console.log('📥 요원 데이터 없음 - 로딩 표시 및 데이터 로드');
            if (modalLoading) modalLoading.style.display = 'block';
            if (agentGrid) agentGrid.style.display = 'none';
            await this.loadAgentsForModal();
        } else {
            this.renderAgentGrid();
        }
    }
    
    closeAgentModal() {
        console.log('🚪 closeAgentModal() 호출됨');
        
        const modal = document.getElementById('agentSelectModal');
        if (modal) {
            console.log('✅ 모달 닫기 - active 클래스 제거 및 display 설정');
            modal.classList.remove('active');
            modal.style.display = 'none'; // 명시적으로 display: none 설정
        } else {
            console.error('❌ agentSelectModal을 찾을 수 없습니다!');
        }
    }
    
    async loadAgentsForModal() {
        try {
            const response = await fetch('/api/valorant.php?action=get_agents');
            const data = await response.json();
            
            if (data.success && data.agents) {
                this.agentsData = data.agents;
                this.renderAgentGrid();
            } else {
                throw new Error('요원 데이터 로드 실패');
            }
        } catch (error) {
            this.showAgentLoadError();
        }
    }
    
    renderAgentGrid() {
        console.log('🎨 renderAgentGrid() 호출됨');
        
        const agentGrid = document.getElementById('agentGrid');
        const modalLoading = document.getElementById('agentModalLoading');
        
        console.log('🔍 렌더링 요소 확인:');
        console.log('  - agentGrid:', agentGrid);
        console.log('  - modalLoading:', modalLoading);
        console.log('  - 요원 데이터 수:', this.agentsData?.length || 0);
        
        if (!agentGrid || !this.agentsData) {
            console.error('❌ renderAgentGrid 실패 - agentGrid:', !!agentGrid, 'agentsData:', !!this.agentsData);
            return;
        }
        
        modalLoading.style.display = 'none';
        agentGrid.style.display = 'grid';
        
        agentGrid.innerHTML = '';
        
        this.agentsData.forEach(agent => {
            const agentCard = document.createElement('div');
            agentCard.className = 'agent-card';
            agentCard.innerHTML = `
                <img src="${agent.image || '../../assets/images/valorant/default-agent.webp'}" 
                     alt="${agent.name}" 
                     class="agent-card-img"
                     onerror="this.src='../../assets/images/valorant/default-agent.webp'">
                <div class="agent-card-name">${agent.name}</div>
                <div class="agent-card-role">${agent.type_name || '요원'}</div>
            `;
            
            agentCard.addEventListener('click', () => {
                this.selectAgent(agent);
            });
            
            agentGrid.appendChild(agentCard);
        });
    }
    
    selectAgent(agent) {
        console.log('✅ selectAgent() 호출됨:', agent.name);
        
        // 숨겨진 입력 필드에 값 설정
        const hiddenInput = document.getElementById('selectedAgentId');
        if (hiddenInput) {
            hiddenInput.value = agent.id;
            console.log('✅ hiddenInput 설정 완료:', agent.id);
        } else {
            console.error('❌ selectedAgentId 입력 필드를 찾을 수 없습니다!');
        }
        
        // 선택된 요원 카드 표시
        const agentCard = document.getElementById('selectedAgentCard');
        const selectBtn = document.getElementById('selectAgentBtn');
        const agentImage = document.getElementById('selectedAgentImage');
        const agentName = document.getElementById('selectedAgentName');
        const agentRole = document.getElementById('selectedAgentRole');
        
        if (agentCard && selectBtn && agentImage && agentName && agentRole) {
            agentImage.src = agent.image || '../../assets/images/valorant/default-agent.webp';
            agentImage.alt = agent.name;
            agentName.textContent = agent.name;
            agentRole.textContent = agent.type_name || '요원';
            
            agentCard.style.display = 'flex';
            selectBtn.style.display = 'none';
        }
        
        // 모달 닫기
        this.closeAgentModal();
    }
    
    showAgentLoadError() {
        const modalLoading = document.getElementById('agentModalLoading');
        if (modalLoading) {
            modalLoading.innerHTML = `
                <div style="color: #FF4655;">
                    <span style="font-size: 2rem;">❌</span>
                    <div>요원 목록을 불러올 수 없습니다</div>
                </div>
            `;
        }
    }
    
    setPreSelectedAgent(agentName) {
        if (!agentName || !this.agentsData) return;
        
        const agent = this.agentsData.find(a => 
            a.name.toLowerCase() === agentName.toLowerCase()
        );
        
        if (agent) {
            this.selectAgent(agent);
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOMContentLoaded 이벤트 발생');
    
    // 중복 초기화 방지
    if (window.valorantWrite) {
        console.log('⚠️ 이미 초기화됨 - 중복 방지');
        return;
    }
    
    // Quill 라이브러리가 로드될 때까지 대기
    const initEditor = () => {
        console.log('🔄 Quill 라이브러리 확인 중...');
        
        if (typeof Quill === 'undefined') {
            console.log('⏳ Quill 라이브러리 로드 대기 중... 100ms 후 재시도');
            setTimeout(initEditor, 100);
            return;
        }
        
        console.log('✅ Quill 라이브러리 로드 완료');
        
        // 기존 툴바 중복 제거
        const existingToolbars = document.querySelectorAll('.ql-toolbar');
        console.log('🧹 기존 툴바 개수:', existingToolbars.length);
        existingToolbars.forEach((toolbar, index) => {
            if (index > 0) {
                console.log('🗑️ 중복 툴바 제거:', index);
                toolbar.remove();
            }
        });
        
        // ValorantWrite 인스턴스 생성
        console.log('🚀 ValorantWrite 인스턴스 생성 시작');
        window.valorantWrite = new ValorantWrite();
        console.log('✅ ValorantWrite 인스턴스 생성 완료');
        
        // 디버깅용 전역 함수 추가
        window.testAgentButton = function() {
            console.log('🧪 수동 테스트 실행');
            const btn = document.getElementById('selectAgentBtn');
            console.log('버튼 찾기 결과:', btn);
            if (btn) {
                console.log('버튼 클릭 이벤트 시뮬레이션');
                btn.click();
            } else {
                console.error('selectAgentBtn을 찾을 수 없습니다');
            }
        };
        
        // DOM 상태 확인 함수
        window.checkDOM = function() {
            console.log('🔍 DOM 상태 확인');
            console.log('- selectAgentBtn:', document.getElementById('selectAgentBtn'));
            console.log('- agentSelectModal:', document.getElementById('agentSelectModal'));
            console.log('- valorantWrite 인스턴스:', window.valorantWrite);
            console.log('- Quill 라이브러리:', typeof Quill);
        };
        
        console.log('💡 디버깅 함수 사용법:');
        console.log('  - testAgentButton(): 요원 선택 버튼 테스트');
        console.log('  - checkDOM(): DOM 상태 확인');
    };
    
    initEditor();
});