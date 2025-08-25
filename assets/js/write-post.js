// =====================================================
// 게시글 작성 JavaScript - TinyMCE 에디터 + 폼 처리
// =====================================================

class WritePostManager {
    constructor() {
        this.tags = [];
        this.files = [];
        this.postId = this.getPostIdFromQuery();
        this.init();
    }

    async init() {
        this.initQuill();
        this.initEventListeners();
        this.initCharacterCounters();
        // 파일 업로드/태그 입력 제거
        this.loadCategories();
        if (this.postId) {
            // 편집 모드: 캡차/비밀번호 필드 비활성화 및 숨김, 기존 데이터 로드, 미인증 접근 차단
            this.hideCaptchaSection();
            this.disableCaptchaValidation();
            this.hidePasswordField();
            const ok = await this.guardEditAccess();
            if (!ok) return;
            this.loadPostForEdit();
            this.setSubmitButtonToUpdate();
        } else {
            // 작성 모드: 캡차 사용
            this.initCaptcha();
        }
        
        // 페이지 로드 완료 후 CAPTCHA 한 번 더 생성 (보장)
        setTimeout(() => {
            this.generateCaptcha();
        }, 100);
    }
    async guardEditAccess() {
        try {
            // 세션 기반 인증이 없다면 비밀번호 입력 받아 선검증
            const res = await fetch('/api/community?action=verify_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // 초기 접근 시 비밀번호가 없으므로 실패가 정상. UI에서 입력 받도록 함.
                body: JSON.stringify({ id: this.postId, password: '' })
            });
            if (res.ok) return true; // 이미 세션 인증이 있는 경우 (서버가 OK를 줄 수 없지만 안전 상 false 처리)
        } catch (_) {}
        // 비밀번호 입력 요청
        const { value: password } = await Swal.fire({
            title: '비밀번호 확인',
            input: 'password',
            inputLabel: '수정 비밀번호',
            inputPlaceholder: '비밀번호를 입력하세요',
            inputAttributes: { maxlength: 20 },
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        });
        if (!password) {
            await Swal.fire({icon:'info',title:'접근 취소',timer:1000,showConfirmButton:false});
            window.location.href = `/community/${this.postId}`;
            return false;
        }
        try {
            const res2 = await fetch('/api/community?action=verify_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.postId, password })
            });
            if (!res2.ok) throw new Error();
            return true;
        } catch (_) {
            await Swal.fire({icon:'error',title:'비밀번호 불일치',text:'올바른 비밀번호가 아닙니다.'});
            window.location.href = `/community/${this.postId}`;
            return false;
        }
    }
    // 쿼리에서 id 추출
    getPostIdFromQuery() {
        const params = new URLSearchParams(window.location.search);
        const id = parseInt(params.get('id'), 10);
        return Number.isFinite(id) ? id : null;
    }
    // 카테고리 로드
    async loadCategories() {
        try {
            const select = document.getElementById('category');
            if (!select) return;

            // 초기화
            select.innerHTML = '<option value="">카테고리를 선택하세요</option>';

            const res = await fetch('/api/community?action=categories');
            if (!res.ok) throw new Error('카테고리 로드 실패');
            const json = await res.json();
            const categories = (json.data && json.data.categories) || json.categories || [];

            categories.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                select.appendChild(opt);
            });

            // 기본값: 일반 잡담으로 선택
            const defaultCat = categories.find(c => c.slug === 'general-chat' || c.name.includes('일반'));
            if (!this.postId && defaultCat) select.value = defaultCat.id;
        } catch (err) {
            console.error('카테고리 로드 오류:', err);
        }
    }

    // Quill 에디터 초기화
    initQuill() {
        const toolbarOptions = [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ];
        this.quill = new Quill('#editor', {
            theme: 'snow',
            modules: { toolbar: toolbarOptions }
        });

        // 에디터 변경 시 hidden textarea 동기화
        this.quill.on('text-change', () => {
            const html = this.quill.root.innerHTML;
            const hidden = document.getElementById('content');
            if (hidden) hidden.value = html;
            this.updateContentCounter();
        });
    }

    // 이벤트 리스너 초기화
    initEventListeners() {
        // 제목 글자 수 카운터
        const titleInput = document.getElementById('title');
        if (titleInput) {
            titleInput.addEventListener('input', () => {
                this.updateTitleCounter();
            });
        }

        // 에디터 컨트롤 버튼
        const editorControls = document.querySelectorAll('.editor-control-btn');
        editorControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleEditorControl(e.target);
            });
        });

        // 폼 제출
        const form = document.getElementById('writePostForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.postId) {
                    this.handleUpdateSubmit();
                } else {
                    this.handleFormSubmit();
                }
            });
        }

        // 닉네임/비번 로컬스토리지 불러오기
        const nicknameInput = document.getElementById('nickname');
        const passwordInput = document.getElementById('password');
        if (nicknameInput) {
            const savedNick = localStorage.getItem('community_nickname');
            if (savedNick) nicknameInput.value = savedNick;
            nicknameInput.addEventListener('change', () => {
                localStorage.setItem('community_nickname', nicknameInput.value.trim());
            });
        }
        if (passwordInput) {
            const savedPwd = localStorage.getItem('community_post_password');
            if (savedPwd) passwordInput.value = savedPwd;
            passwordInput.addEventListener('change', () => {
                localStorage.setItem('community_post_password', passwordInput.value);
            });
        }

        // 태그 입력 제거됨
        
        // CAPTCHA 입력 실시간 검증
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            captchaInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (value.length > 2) {
                    e.target.value = value.slice(0, 2);
                }
                
                // 실시간 피드백
                const captchaImage = document.getElementById('captchaImage');
                if (captchaImage && captchaImage.dataset.captcha) {
                    if (value === captchaImage.dataset.captcha) {
                        e.target.style.borderColor = '#48bb78';
                        e.target.style.boxShadow = '0 0 10px rgba(72, 187, 120, 0.3)';
                    } else if (value.length === 2) {
                        e.target.style.borderColor = '#f56565';
                        e.target.style.boxShadow = '0 0 10px rgba(245, 101, 101, 0.3)';
                    } else {
                        e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                        e.target.style.boxShadow = 'none';
                    }
                }
            });
            
            // 포커스 시 스타일 초기화
            captchaInput.addEventListener('focus', (e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.2)';
            });
            
            // 블러 시 스타일 초기화
            captchaInput.addEventListener('blur', (e) => {
                e.target.style.borderColor = 'rgba(102, 126, 234, 0.2)';
                e.target.style.boxShadow = 'none';
            });
            
            // 엔터 키 이벤트
            captchaInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // 폼 제출 버튼 클릭
                    const submitBtn = document.querySelector('button[type="submit"]');
                    if (submitBtn) {
                        submitBtn.click();
                    }
                }
            });
        }
    }

    hideCaptchaSection() {
        const group = document.querySelector('.captcha-group');
        if (group) group.style.display = 'none';
    }

    disableCaptchaValidation() {
        const captchaInput = document.getElementById('captcha');
        if (captchaInput) {
            captchaInput.disabled = true;
            captchaInput.removeAttribute('required');
            captchaInput.removeAttribute('pattern');
            captchaInput.removeAttribute('minlength');
        }
    }

    hidePasswordField() {
        const pwdGroup = document.getElementById('password-group');
        const pwd = document.getElementById('password');
        if (pwd) {
            pwd.disabled = true;
            pwd.removeAttribute('required');
        }
        if (pwdGroup) pwdGroup.style.display = 'none';
    }

    async loadPostForEdit() {
        try {
            const res = await fetch(`/api/community?action=post&id=${this.postId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data = json.data || json;
            const post = data.post || data;
            // 값 채우기: 카테고리/제목/내용, 닉네임/비번/작성일은 고정
            const category = document.getElementById('category');
            if (category) category.value = post.category_id;
            const title = document.getElementById('title');
            if (title) title.value = post.title || '';
            if (this.quill) this.quill.root.innerHTML = post.content || '';
            const hidden = document.getElementById('content');
            if (hidden) hidden.value = post.content || '';

            // 닉네임 입력 비활성화 및 값 유지, 비밀번호는 검증용 입력만 허용(값 변경 저장 안 함)
            const nick = document.getElementById('nickname');
            if (nick) {
                nick.value = post.nickname || '';
                nick.readOnly = true; // 닉네임 변경 불가
                nick.style.backgroundColor = '#f7fafc';
                nick.style.cursor = 'not-allowed';
                // 시각적 안내 배지 추가
                if (!document.getElementById('nick-lock-indicator')) {
                    const badge = document.createElement('div');
                    badge.id = 'nick-lock-indicator';
                    badge.style.fontSize = '0.85rem';
                    badge.style.color = '#718096';
                    badge.style.marginTop = '6px';
                    badge.textContent = '닉네임은 수정할 수 없습니다.';
                    nick.parentElement.appendChild(badge);
                }
            }
            // 편집 모드에서 비밀번호 입력은 검증용이므로 폼 필드 제거 처리(별도 SweetAlert에서 수행)
            // 라벨 문구 업데이트
            const header = document.querySelector('.write-header h1');
            if (header) header.innerHTML = '<i class="fas fa-edit"></i> 게시글 수정';
            const desc = document.querySelector('.write-header p');
            if (desc) desc.textContent = '게시된 날짜, 작성자, 비밀번호는 변경되지 않습니다.';
        } catch (e) {
            console.error('편집용 게시글 로드 오류:', e);
            Swal.fire({icon:'error',title:'오류',text:'게시글 정보를 불러오지 못했습니다.'});
        }
    }

    setSubmitButtonToUpdate() {
        const btn = document.querySelector('.form-buttons .btn.btn-primary');
        if (btn) btn.innerHTML = '<i class="fas fa-save"></i> 수정 저장';
    }

    // 글자 수 카운터 초기화
    initCharacterCounters() {
        this.updateTitleCounter();
        this.updateContentCounter();
    }

    // 제목 글자 수 카운터 업데이트
    updateTitleCounter() {
        const titleInput = document.getElementById('title');
        const titleCount = document.getElementById('titleCount');
        if (titleInput && titleCount) {
            const count = titleInput.value.length;
            titleCount.textContent = count;
            
            // 글자 수에 따른 색상 변경
            if (count > 80) {
                titleCount.style.color = '#f56565';
            } else if (count > 60) {
                titleCount.style.color = '#ed8936';
            } else {
                titleCount.style.color = '#667eea';
            }
        }
    }

    // 내용 글자 수 카운터 업데이트
    updateContentCounter() {
        const contentCount = document.getElementById('contentCount');
        const contentProgress = document.getElementById('contentProgress');
        
        if (contentCount && contentProgress) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = (document.getElementById('content')?.value || '');
            const text = tempDiv.textContent || tempDiv.innerText || '';
            const count = text.length;
            const maxCount = 10000;
            const percentage = Math.min((count / maxCount) * 100, 100);
            
            contentCount.textContent = count.toLocaleString();
            contentProgress.style.width = percentage + '%';
            
            // 진행률 바 색상 변경
            if (percentage > 90) {
                contentProgress.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
            } else if (percentage > 70) {
                contentProgress.style.background = 'linear-gradient(135deg, #ed8936, #dd6b20)';
            } else {
                contentProgress.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            }
        }
    }

    // 에디터 컨트롤 처리
    handleEditorControl(target) {
        // 미리보기 제거됨
    }

    // 태그/파일 업로드 관련 함수 제거

    // 파일 업로드 관련 함수 제거

    // 파일 업로드 관련 함수 제거

    // 파일 업로드 관련 함수 제거

    // 파일 업로드 관련 함수 제거

    // 파일 업로드 관련 함수 제거

    // CAPTCHA 초기화
    initCaptcha() {
        // 페이지 로드 시마다 새로운 CAPTCHA 생성
        this.generateCaptcha();
        
        const refreshBtn = document.getElementById('refreshCaptcha');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.generateCaptcha();
            });
        }
        
        // 페이지 포커스 시에도 CAPTCHA 새로 생성
        window.addEventListener('focus', () => {
            this.generateCaptcha();
        });
    }

    // CAPTCHA 생성 (2글자로 제한)
    generateCaptcha() {
        const captchaImage = document.getElementById('captchaImage');
        if (!captchaImage) return;
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let captcha = '';
        for (let i = 0; i < 2; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        captchaImage.textContent = captcha;
        // 드래그/선택 방지
        captchaImage.style.userSelect = 'none';
        captchaImage.setAttribute('unselectable', 'on');
        captchaImage.onselectstart = () => false;
        captchaImage.onmousedown = () => false;
        captchaImage.dataset.captcha = captcha;
    }

    // 폼 제출 처리
    async handleFormSubmit() {
        try {
            // 필드 값 수집
            const categoryValue = document.getElementById('category').value;
            const payload = {
                category_id: categoryValue ? parseInt(categoryValue, 10) : null,
                title: document.getElementById('title').value.trim(),
                content: document.getElementById('content').value, // Quill의 HTML
                nickname: document.getElementById('nickname').value.trim(),
                password: document.getElementById('password').value,
                captcha: document.getElementById('captcha').value.trim()
            };
            
            // CAPTCHA 검증
            const captchaImage = document.getElementById('captchaImage');
            const userCaptcha = document.getElementById('captcha').value;
            
            if (!userCaptcha || userCaptcha.length !== 2) {
                Swal.fire({icon:'warning',title:'입력 필요',text:'CAPTCHA를 정확히 2글자 입력해주세요.'});
                document.getElementById('captcha').focus();
                return;
            }
            
            if (captchaImage.dataset.captcha !== userCaptcha) {
                Swal.fire({icon:'error',title:'CAPTCHA 불일치',text:'다시 입력해주세요.'});
                this.generateCaptcha();
                document.getElementById('captcha').value = '';
                document.getElementById('captcha').focus();
                return;
            }
            // 기본 유효성 검사
            if (!payload.category_id) { return Swal.fire({icon:'warning',title:'입력 필요',text:'카테고리를 선택해주세요.'}); }
            if (!payload.title) { return Swal.fire({icon:'warning',title:'입력 필요',text:'제목을 입력해주세요.'}); }
            if (!payload.content || payload.content === '<p><br></p>') { return Swal.fire({icon:'warning',title:'입력 필요',text:'내용을 입력해주세요.'}); }
            if (!payload.nickname) { return Swal.fire({icon:'warning',title:'입력 필요',text:'닉네임을 입력해주세요.'}); }
            if (!payload.password) { return Swal.fire({icon:'warning',title:'입력 필요',text:'게시글 비밀번호를 입력해주세요.'}); }

            // API 호출 (JSON)
            const res = await fetch('/api/community?action=create_post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json().catch(() => ({}));

            if (!res.ok || (json.status && json.status >= 400)) {
                const msg = (json && (json.message || json.error)) || `오류가 발생했습니다. (HTTP ${res.status})`;
                throw new Error(msg);
            }

            // 로컬스토리지 저장
            localStorage.setItem('community_nickname', payload.nickname);
            localStorage.setItem('community_post_password', payload.password);

            await Swal.fire({icon:'success',title:'등록 완료',timer:1200,showConfirmButton:false});
            const postId = (json.data && json.data.post_id) || json.post_id;
            if (postId) {
                window.location.href = `/community/${postId}`;
            } else {
                window.location.href = '/community';
            }
            
        } catch (error) {
            console.error('폼 제출 오류:', error);
            Swal.fire({icon:'error',title:'오류',text:'게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.'});
        }
    }

    // 수정 제출 처리
    async handleUpdateSubmit() {
        try {
            const payload = {
                id: this.postId,
                title: document.getElementById('title').value.trim(),
                content: document.getElementById('content').value,
                category_id: (() => { const v = document.getElementById('category')?.value; return v ? parseInt(v,10) : null; })()
            };

            if (!payload.title) { return Swal.fire({icon:'warning',title:'입력 필요',text:'제목을 입력해주세요.'}); }
            if (!payload.content || payload.content === '<p><br></p>') { return Swal.fire({icon:'warning',title:'입력 필요',text:'내용을 입력해주세요.'}); }
            // 비밀번호는 선검증 세션으로 대체됨

            const res = await fetch('/api/community?action=update_post', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || (json.status && json.status >= 400)) {
                const msg = (json && (json.message || json.error)) || `오류가 발생했습니다. (HTTP ${res.status})`;
                throw new Error(msg);
            }
            await Swal.fire({icon:'success',title:'수정 완료',timer:1200,showConfirmButton:false});
            window.location.href = `/community/${this.postId}`;
        } catch (e) {
            console.error('수정 제출 오류:', e);
            Swal.fire({icon:'error',title:'오류',text: e.message || '수정 중 오류가 발생했습니다.'});
        }
    }
}

// 전역 인스턴스 생성
let writePostManager;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    writePostManager = new WritePostManager();
});

// 전역 함수들 (HTML에서 직접 호출)
function removeTag(tag) {
    if (writePostManager) {
        writePostManager.removeTag(tag);
    }
}

function removeFile(index) {
    if (writePostManager) {
        writePostManager.removeFile(index);
    }
}
