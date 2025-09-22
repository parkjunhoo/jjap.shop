// =====================================================
// 게시글 보기 JS - 단일 게시글/댓글 로드 및 액션
// =====================================================

class ViewPostPage {
    constructor() {
        this.postId = this.extractPostIdFromPath();
        this.currentAction = null;
        this.cachedPassword = '';
        this.init();
    }

    extractPostIdFromPath() {
        // URL이 리다이렉트된 경우를 고려한 ID 추출
        // 1. 기존 /community/123 형태
        let m = window.location.pathname.match(/\/community\/(\d+)/);
        if (m) return parseInt(m[1], 10);
        
        // 2. 리다이렉트된 /creator/view-post?id=123 형태
        m = window.location.pathname.match(/\/creator\/view-post/);
        if (m) {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            return id ? parseInt(id, 10) : null;
        }
        
        return null;
    }

    async init() {
        if (!this.postId) {
            this.renderError('잘못된 게시글 주소입니다.');
            return;
        }
        await this.increaseViewOnce();
        await this.loadPost();
        await this.loadComments();
        this.bindEvents();
    }

    async increaseViewOnce() {
        try {
            const key = `viewed_post_${this.postId}`;
            if (localStorage.getItem(key)) return;
            const res = await fetch('/api/community?action=increase_view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: this.postId })
            });
            if (res.ok) localStorage.setItem(key, '1');
        } catch (e) {
            // ignore
        }
    }

    async loadPost() {
        try {
            const res = await fetch(`/api/community?action=post&id=${this.postId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data = json.data || json;
            const post = data.post || data;
            this.renderPost(post);
        } catch (e) {
            console.error('게시글 로드 오류:', e);
            this.renderError('게시글을 불러오는 중 오류가 발생했습니다.');
        }
    }

    renderPost(post) {
        const wrap = document.getElementById('post-content');
        if (!wrap) return;
        if (!post) {
            this.renderError('게시글을 찾을 수 없습니다.');
            return;
        }
        
        // 페이지 타이틀을 게시글 제목으로 동적 설정
        this.updatePageTitle(post.title, post.category_name);
        
        wrap.innerHTML = `
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
                <div>
                    <h1 class="post-title">${this.escape(post.title)}</h1>
                    <div class="post-meta">
                        <span class="meta-item">👤 ${this.escape(post.nickname || '익명')}</span>
                        <span class="meta-item">🕒 ${this.formatDate(post.created_at)}</span>
                        <span class="meta-item">👁️ ${post.view_count ?? 0}</span>
                        <span class="post-category">${this.escape(post.category_name || '')}</span>
                    </div>
                </div>
                <div style="display:flex;gap:8px;">
                    <button type="button" class="btn btn-outline" id="share-btn" title="공유하기" style="padding:8px 12px;font-size:.9rem;">📤 공유</button>
                    <button type="button" class="btn btn-outline" id="edit-btn" title="수정" style="padding:8px 12px;font-size:.9rem;">✏️ 수정</button>
                    <button type="button" class="btn btn-outline" id="delete-btn" title="삭제" style="padding:8px 12px;font-size:.9rem;">🗑️ 삭제</button>
                </div>
            </div>
            <div class="post-body">${post.content || ''}</div>
        `;
        this.bindHeaderActions();
        // Safely enhance embeds after DOM injection
        try { this.enhanceYouTubeEmbeds(wrap.querySelector('.post-body')); } catch (_) {}
    }

    updatePageTitle(title, categoryName) {
        if (!title) return;
        
        // 페이지 타이틀 업데이트
        const pageTitle = `${title} - ${categoryName || '커뮤니티'} | 짭샵`;
        document.title = pageTitle;
        
        // 메타 description 업데이트
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const newDesc = `${title} - 짭샵 크리에이터 커뮤니티에서 ${categoryName || '다양한 주제'}에 대해 이야기해보세요.`;
            metaDesc.setAttribute('content', newDesc);
        }
        
        // Open Graph 태그 업데이트 (동적 생성)
        this.updateOGTags(title, categoryName);
    }

    updateOGTags(title, categoryName) {
        // 기존 OG 태그 제거
        document.querySelectorAll('meta[property^="og:"]').forEach(tag => {
            if (tag.getAttribute('property') === 'og:title' || 
                tag.getAttribute('property') === 'og:description' ||
                tag.getAttribute('property') === 'og:url') {
                tag.remove();
            }
        });
        
        // 새로운 OG 태그 추가
        const ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', `${title} - ${categoryName || '커뮤니티'} | 짭샵`);
        document.head.appendChild(ogTitle);
        
        const ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        ogDesc.setAttribute('content', `${title} - 짭샵 크리에이터 커뮤니티에서 ${categoryName || '다양한 주제'}에 대해 이야기해보세요.`);
        document.head.appendChild(ogDesc);
        
        const ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        ogUrl.setAttribute('content', window.location.href);
        document.head.appendChild(ogUrl);
    }

    // YouTube 링크를 임베드로 변환
    enhanceYouTubeEmbeds(rootEl) {
        if (!rootEl) return;
        // 1) a 태그 변환
        rootEl.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach(a => {
            const href = a.getAttribute('href') || '';
            const embed = this.buildYouTubeIframe(href);
            if (embed) {
                const wrapper = document.createElement('div');
                wrapper.style.margin = '12px 0';
                wrapper.innerHTML = embed;
                a.replaceWith(wrapper);
            }
        });
        // 2) 텍스트 노드 내 URL 변환 (재귀)
        const walk = (el) => {
            Array.from(el.childNodes).forEach(node => {
                if (node.nodeType === 3) { // TEXT_NODE
                    const text = node.textContent || '';
                    const re = /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=[^\s<>&]+|youtu\.be\/[^\s<>&]+|youtube\.com\/shorts\/[^\s<>&]+)/gi;
                    let last = 0; let m; let changed = false;
                    const frag = document.createDocumentFragment();
                    while ((m = re.exec(text)) !== null) {
                        const before = text.slice(last, m.index);
                        if (before) frag.appendChild(document.createTextNode(before));
                        const raw = m[0];
                        const url = raw.startsWith('http') ? raw : ('https://' + raw.replace(/^\/\//,'').replace(/^www\./,'www.'));
                        const iframe = this.buildYouTubeIframe(url);
                        if (iframe) { const span = document.createElement('span'); span.innerHTML = iframe; frag.appendChild(span); changed = true; }
                        else { frag.appendChild(document.createTextNode(raw)); }
                        last = re.lastIndex;
                    }
                    if (changed) {
                        const rest = text.slice(last);
                        if (rest) frag.appendChild(document.createTextNode(rest));
                        node.replaceWith(frag);
                    }
                } else if (node.nodeType === 1 && node.tagName !== 'IFRAME' && node.tagName !== 'A') { // ELEMENT_NODE
                    walk(node);
                }
            });
        };
        walk(rootEl);
    }

    buildYouTubeIframe(url) {
        const id = this.extractYouTubeId(url);
        if (!id) return '';
        const src = `https://www.youtube.com/embed/${id}`;
        return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
  <iframe src="${src}" title="YouTube video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>`;
    }

    extractYouTubeId(url) {
        try {
            const u = new URL(url);
            if (u.hostname.includes('youtu.be')) {
                return u.pathname.split('/')[1] || '';
            }
            if (u.hostname.includes('youtube.com')) {
                if (u.pathname.startsWith('/watch')) return u.searchParams.get('v') || '';
                if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || '';
            }
        } catch (_) { /* noop */ }
        return '';
    }

    async loadComments() {
        try {
            const res = await fetch(`/api/community?action=comments&post_id=${this.postId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const data = json.data || json;
            const comments = data.comments || [];
            this.renderComments(comments);
        } catch (e) {
            console.error('댓글 로드 오류:', e);
            this.renderComments([]);
        }
    }

    renderComments(comments) {
        const list = document.getElementById('comments-list');
        if (!list) return;
        if (!comments.length) {
            list.innerHTML = '<div class="no-posts">아직 댓글이 없습니다.</div>';
            return;
        }
        list.innerHTML = '';
        comments.forEach(c => {
            const item = document.createElement('div');
            item.className = 'comment-item';
            item.innerHTML = `
                <div class="comment-head">
                    <span class="nick"><i class="fas fa-user"></i> ${this.escape(c.nickname)}</span>
                    <span class="time"><i class="fas fa-clock"></i> ${new Date(c.created_at).toLocaleString('ko-KR')}</span>
                    <span style="flex:1"></span>
                    <button class="btn btn-outline btn-sm" data-action="edit-comment" data-id="${c.id}">✏️ 수정</button>
                    <button class="btn btn-outline btn-sm" data-action="delete-comment" data-id="${c.id}">🗑️ 삭제</button>
                </div>
                <div class="comment-body" id="comment-body-${c.id}">${this.escape(c.content)}</div>
            `;
            list.appendChild(item);
        });
        this.bindCommentActions();
    }

    bindCommentActions() {
        document.querySelectorAll('[data-action="edit-comment"]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                const pw = await this.promptPassword('댓글을 수정하려면 비밀번호를 입력하세요.');
                if (!pw) return;
                const current = document.getElementById(`comment-body-${id}`)?.textContent || '';
                const { value: content } = await Swal.fire({
                    title: '댓글 수정',
                    input: 'textarea',
                    inputValue: current,
                    inputAttributes: { rows: 4 },
                    showCancelButton: true,
                    confirmButtonText: '저장',
                    cancelButtonText: '취소'
                });
                if (content == null) return;
                await this.updateComment(id, pw, content);
            });
        });
        document.querySelectorAll('[data-action="delete-comment"]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
                const pw = await this.promptPassword('댓글을 삭제하려면 비밀번호를 입력하세요.');
                if (!pw) return;
                const ok = await Swal.fire({icon:'warning',title:'삭제하시겠습니까?',showCancelButton:true,confirmButtonText:'삭제',cancelButtonText:'취소'});
                if (!ok.isConfirmed) return;
                await this.deleteComment(id, pw);
            });
        });
    }

    async promptPassword(title) {
        const { value: pw } = await Swal.fire({
            title: title || '비밀번호를 입력하세요',
            input: 'password',
            inputPlaceholder: '비밀번호',
            inputAttributes: { maxlength: 20 },
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        });
        return pw;
    }

    async updateComment(id, password, content) {
        try {
            const res = await fetch('/api/community?action=update_comment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password, content })
            });
            const json = await res.json().catch(()=>({}));
            if (!res.ok || (json.status && json.status>=400)) throw new Error(json.message||'수정 실패');
            await Swal.fire({icon:'success',title:'수정되었습니다.',timer:1200,showConfirmButton:false});
            await this.loadComments();
        } catch (e) {
            console.error(e);
            Swal.fire({icon:'error',title:'오류',text:'댓글 수정 중 오류가 발생했습니다.'});
        }
    }

    async deleteComment(id, password) {
        try {
            const res = await fetch('/api/community?action=delete_comment', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password })
            });
            const json = await res.json().catch(()=>({}));
            if (!res.ok || (json.status && json.status>=400)) throw new Error(json.message||'삭제 실패');
            await Swal.fire({icon:'success',title:'삭제되었습니다.',timer:1000,showConfirmButton:false});
            await this.loadComments();
        } catch (e) {
            console.error(e);
            Swal.fire({icon:'error',title:'오류',text:'댓글 삭제 중 오류가 발생했습니다.'});
        }
    }

    bindEvents() {
        const form = document.getElementById('comment-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitComment();
            });
        }
        const cancelBtn = document.getElementById('modal-cancel');
        const confirmBtn = document.getElementById('modal-confirm');
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.closePasswordModal());
        if (confirmBtn) confirmBtn.addEventListener('click', () => this.handlePasswordConfirm());
        this.ensureEditModal();
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) shareBtn.addEventListener('click', () => this.copyLink());
    }

    async copyLink() {
        const url = window.location.href;
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                const ta = document.createElement('textarea');
                ta.value = url;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            Swal.fire({ icon: 'success', title: '링크가 복사되었습니다', timer: 1200, showConfirmButton: false });
        } catch (e) {
            console.error('링크 복사 실패:', e);
            Swal.fire({ icon: 'error', title: '복사 실패', text: '다시 시도해주세요.' });
        }
    }

    async submitComment() {
        try {
            const nickname = document.getElementById('comment-nickname').value.trim();
            const password = document.getElementById('comment-password').value;
            const content = document.getElementById('comment-content').value.trim();
            if (!nickname || !password || !content) return Swal.fire({icon:'warning',title:'입력 필요',text:'닉네임/비밀번호/내용을 입력하세요.'});

            const res = await fetch('/api/community?action=create_comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: this.postId, nickname, password, content })
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok || (json.status && json.status >= 400)) throw new Error(json.message || '댓글 작성 실패');
            document.getElementById('comment-content').value = '';
            await this.loadComments();
            Swal.fire({icon:'success',title:'작성 완료',timer:1200,showConfirmButton:false});
        } catch (e) {
            console.error('댓글 작성 오류:', e);
            Swal.fire({icon:'error',title:'오류',text:'댓글 작성 중 오류가 발생했습니다.'});
        }
    }

    // 좋아요 제거

    renderError(msg) {
        const wrap = document.getElementById('post-content');
        if (wrap) wrap.innerHTML = `<div class="error-message">${this.escape(msg)}</div>`;
    }

    formatDate(dateString) {
        const d = new Date(dateString);
        const now = new Date();
        const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
        if (sameDay) {
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            return `${hh}:${mm}`;
        }
        const yy = String(d.getFullYear()).slice(-2);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yy}.${mm}.${dd}`;
    }

    escape(s) {
        return String(s || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    bindHeaderActions() {
        const editBtn = document.getElementById('edit-btn');
        const deleteBtn = document.getElementById('delete-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                // 수정은 작성 페이지에서 검증하도록 바로 이동
                window.location.href = `/write-post?id=${this.postId}`;
            });
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.currentAction = 'delete';
                this.openPasswordModal('게시글을 삭제하려면 비밀번호를 입력하세요.');
            });
        }
    }

    async verifyPassword(password) {
        try {
            const res = await fetch('/api/community?action=verify_password', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ id: this.postId, password })
            });
            if (!res.ok) return false;
            const json = await res.json().catch(()=>({}));
            return res.ok && (!json.status || json.status < 400);
        } catch (e) {
            return false;
        }
    }

    openPasswordModal(message) {
        const modal = document.getElementById('password-modal');
        const msg = document.getElementById('modal-message');
        const input = document.getElementById('modal-password');
        if (msg) msg.textContent = message || '비밀번호를 입력하세요';
        if (input) input.value = '';
        if (modal) modal.style.display = 'flex';
        if (input) input.focus();
    }
    closePasswordModal() {
        const modal = document.getElementById('password-modal');
        if (modal) modal.style.display = 'none';
    }
    async handlePasswordConfirm() {
        const pw = (document.getElementById('modal-password')?.value || '').trim();
        if (!pw) return;
        this.cachedPassword = pw;
        this.closePasswordModal();
        if (this.currentAction === 'delete') {
            await this.requestDelete();
        } else if (this.currentAction === 'edit') {
            this.openEditModal();
        }
    }

    ensureEditModal() {
        if (document.getElementById('edit-modal')) return;
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'edit-modal';
        modal.style.display = 'none';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>게시글 수정</h3>
                <input type="text" id="edit-title" placeholder="제목" />
                <textarea id="edit-content" rows="8" placeholder="내용"></textarea>
                <div class="modal-buttons">
                    <button type="button" class="btn btn-secondary" id="edit-cancel">취소</button>
                    <button type="button" class="btn btn-primary" id="edit-save">저장</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('edit-cancel').addEventListener('click', () => this.closeEditModal());
        document.getElementById('edit-save').addEventListener('click', () => this.requestUpdate());
    }
    openEditModal() {
        const titleEl = document.querySelector('#post-content .post-title');
        const bodyEl = document.querySelector('#post-content .post-body');
        const t = document.getElementById('edit-title');
        const c = document.getElementById('edit-content');
        if (t && titleEl) t.value = titleEl.textContent || '';
        if (c && bodyEl) c.value = bodyEl.innerHTML || '';
        const modal = document.getElementById('edit-modal');
        if (modal) modal.style.display = 'flex';
    }
    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) modal.style.display = 'none';
    }

    async requestUpdate() {
        try {
            const title = document.getElementById('edit-title').value.trim();
            const content = document.getElementById('edit-content').value;
            if (!title || !content) return Swal.fire({icon:'warning',title:'입력 필요',text:'제목과 내용을 입력하세요.'});
            const res = await fetch(`/api/community?action=update_post`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.postId, password: this.cachedPassword, title, content })
            });
            const json = await res.json().catch(()=>({}));
            if (!res.ok || (json.status && json.status>=400)) throw new Error(json.message||'수정 실패');
            this.closeEditModal();
            await this.loadPost();
            Swal.fire({icon:'success',title:'수정 완료',timer:1200,showConfirmButton:false});
        } catch (e) {
            console.error(e);
            Swal.fire({icon:'error',title:'오류',text:'수정 중 오류가 발생했습니다.'});
        }
    }

    async requestDelete() {
        try {
            const confirmRes = await Swal.fire({
                icon:'warning',title:'삭제하시겠습니까?',text:'삭제 후에는 목록에서 숨겨집니다.',
                showCancelButton:true,confirmButtonText:'삭제',cancelButtonText:'취소'
            });
            if (!confirmRes.isConfirmed) return;
            const res = await fetch(`/api/community?action=delete_post`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.postId, password: this.cachedPassword })
            });
            const json = await res.json().catch(()=>({}));
            if (!res.ok || (json.status && json.status>=400)) throw new Error(json.message||'삭제 실패');
            await Swal.fire({icon:'success',title:'삭제 완료',timer:1000,showConfirmButton:false});
            window.location.href = '/community';
        } catch (e) {
            console.error(e);
            Swal.fire({icon:'error',title:'오류',text:'삭제 중 오류가 발생했습니다.'});
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ViewPostPage());


