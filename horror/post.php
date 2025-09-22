<?php
// 게시글 ID 받기
$post_id = (int)($_GET['id'] ?? 0);

if (!$post_id) {
    header('HTTP/1.0 404 Not Found');
    exit('게시글을 찾을 수 없습니다.');
}

// 기본 메타 정보 (API 로드 전)
$page_title = '무서운 이야기 - 짭샵';
$page_description = '무서운 이야기를 읽어보세요.';
$page_keywords = '무서운이야기, 괴담, 게시판, 짭샵';
$page_css = 'assets/css/horror.css';
$page_js = 'assets/js/horror.js';
?>

<?php include_once '../includes/section-headers/horror-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="horror-post-container">
    <!-- 로딩 상태 -->
    <div class="loading-post" id="loadingPost">
        <div class="loading-spinner">👻</div>
        <p>무서운 이야기를 불러오는 중...</p>
    </div>
    
    <!-- 게시글 내용 -->
    <div class="post-content" id="postContent" style="display: none;">
        <!-- JavaScript로 동적 로드됨 -->
    </div>
    
    <!-- 오류 상태 -->
    <div class="error-post" id="errorPost" style="display: none;">
        <div class="error-content">
            <div class="error-icon">😢</div>
            <h3>이야기를 찾을 수 없어요</h3>
            <p>삭제되었거나 존재하지 않는 이야기입니다.</p>
            <a href="/horror" class="back-btn">← 게시판으로 돌아가기</a>
        </div>
    </div>
</div>

<!-- 공용 푸터 -->
<?php include_once '../includes/footer.php'; ?>

<style>
/* 게시글 상세보기 전용 스타일 */
.horror-post-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
    min-height: 60vh;
}

.loading-post, .error-post {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
}

.loading-spinner {
    font-size: 3rem;
    animation: bounce 1s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.error-content h3 {
    color: #ff6b6b;
    margin-bottom: 1rem;
}

.back-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: transform 0.2s ease;
    margin-top: 1rem;
}

.back-btn:hover {
    transform: translateY(-2px);
    color: white;
}

/* 게시글 내용 스타일 */
.post-header {
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(40, 40, 70, 0.9) 100%);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.post-category-badge {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(10px);
}

.post-title {
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 1rem;
    line-height: 1.3;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.post-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.post-info {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.post-author {
    color: #fff;
    font-weight: 500;
}

.post-body {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    color: #333;
    line-height: 1.8;
    font-size: 1.1rem;
}

/* 게시글 내 이미지 크기 제한 및 스타일링 */
.post-body img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin: 1.5rem auto;
    display: block;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.post-body img:hover {
    transform: scale(1.03);
    cursor: zoom-in;
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.4);
}

/* YouTube 임베드 스타일링 */
.post-body iframe[src*="youtube.com"] {
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
    transition: all 0.3s ease;
}

.post-body iframe[src*="youtube.com"]:hover {
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.5);
    transform: translateY(-2px);
}

.post-body h1, .post-body h2, .post-body h3 {
    color: #2c3e50;
    margin: 2rem 0 1rem 0;
}

.post-body p {
    margin-bottom: 1rem;
}

.post-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.action-buttons {
    display: flex;
    gap: 1rem;
}

.action-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
}

.like-btn {
    background: #ff6b6b;
    color: white;
}

.share-btn {
    background: #4ecdc4;
    color: white;
}

.back-to-list-btn {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.action-btn:hover, .back-to-list-btn:hover {
    transform: translateY(-2px);
}

/* 댓글 섹션 */
.comments-section {
    margin-top: 3rem;
}

.comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.comments-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
}

.comment-count {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
}

.comment-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-left: 3px solid rgba(255, 255, 255, 0.2);
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.8rem;
}

.comment-author {
    font-weight: 500;
    color: #fff;
}

.comment-time {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.5);
}

.comment-content {
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
    margin-bottom: 0.5rem;
}


.no-comments {
    text-align: center;
    padding: 3rem 2rem;
    color: rgba(255, 255, 255, 0.5);
}

/* 댓글 작성 폼 스타일 */
.comment-write-form {
    background: rgba(255, 255, 255, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-form-header {
    margin-bottom: 1rem;
}

.comment-form-header h4 {
    color: #fff;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
}

.comment-form .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.comment-form .form-input {
    padding: 0.8rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.comment-form .form-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.comment-form .form-input:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.comment-form .form-textarea {
    width: 100%;
    min-height: 80px;
    padding: 0.8rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 0.95rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;
    margin-bottom: 0.8rem;
}

.comment-form .form-textarea::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.comment-form .form-textarea:focus {
    outline: none;
    border-color: #667eea;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.comment-form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.char-counter {
    font-size: 0.85rem;
    color: #999;
}

.comment-submit-btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.comment-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.comment-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .horror-post-container {
        margin: 1rem auto;
        padding: 0 0.5rem;
    }
    
    .post-header, .post-body {
        padding: 1.5rem;
    }
    
    .post-title {
        font-size: 1.5rem;
    }
    
    .post-meta {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .post-actions {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
    }
    
    .action-buttons {
        justify-content: center;
    }
    
    .comment-form .form-row {
        grid-template-columns: 1fr;
        gap: 0.8rem;
    }
    
    .comment-write-form {
        padding: 1rem;
    }
    
    .comment-form-footer {
        flex-direction: column;
        gap: 0.8rem;
        align-items: stretch;
    }
}
</style>

<script>
// 현재 게시글 ID
const postId = <?php echo $post_id; ?>;

// 페이지 로드 시 게시글 데이터 가져오기
document.addEventListener('DOMContentLoaded', function() {
    loadPost();
});

async function loadPost() {
    const loadingElement = document.getElementById('loadingPost');
    const contentElement = document.getElementById('postContent');
    const errorElement = document.getElementById('errorPost');
    
    try {
        const response = await fetch(`/api/horror_v2.php?action=get_post&id=${postId}`);
        const data = await response.json();
        
        if (data.success) {
            const post = data.data.post;
            displayPost(post);
            
            // 메타 태그 업데이트
            document.title = `${post.title} - 무서운이야기 - 짭샵`;
            updateMetaTags(post);
            
            loadingElement.style.display = 'none';
            contentElement.style.display = 'block';
            
            // 댓글 시스템 초기화
            setTimeout(() => {
                initCommentSystem();
            }, 100);
        } else {
            throw new Error(data.error || '게시글을 불러올 수 없습니다.');
        }
    } catch (error) {
        console.error('게시글 로드 오류:', error);
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
    }
}

function displayPost(post) {
    const contentElement = document.getElementById('postContent');
    
    const commentsHTML = post.comments.length > 0 
        ? post.comments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.nickname)}</span>
                    <span class="comment-time">${comment.time_ago}</span>
                </div>
                <div class="comment-content">${escapeHtml(comment.content)}</div>
            </div>
        `).join('')
        : '<div class="no-comments">아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!</div>';
    
    contentElement.innerHTML = `
        <div class="post-header">
            <div class="post-category-badge">
                ${post.category_icon} ${post.category_name}
            </div>
            <h1 class="post-title">${escapeHtml(post.title)}</h1>
            <div class="post-meta">
                <div class="post-stats">
                    <span>👀 ${post.view_count.toLocaleString()}</span>
                    <span>💬 ${post.comment_count}</span>
                </div>
                <div class="post-info">
                    <span class="post-author">${escapeHtml(post.nickname)}</span> • 
                    <span>${post.formatted_date}</span>
                </div>
            </div>
        </div>
        
        <div class="post-body" id="postBodyContent">
            ${post.content}
        </div>
        
                <div class="post-actions">
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editPost()">
                            ✏️ 수정
                        </button>
                        <button class="action-btn delete-btn" onclick="deletePost()">
                            🗑️ 삭제
                        </button>
                        <button class="action-btn share-btn" onclick="sharePost()">
                            📤 링크 공유
                        </button>
                    </div>
                    <a href="/horror/category/${post.category_slug}" class="back-to-list-btn">
                        ← ${post.category_name} 목록
                    </a>
                </div>
        
        <div class="comments-section">
            <div class="comments-header">
                <h3 class="comments-title">💬 댓글</h3>
                <span class="comment-count">${post.comments.length}개</span>
            </div>
            
            <!-- 댓글 작성 폼 -->
            <div class="comment-write-form">
                <div class="comment-form-header">
                    <h4>댓글 남기기</h4>
                </div>
                <form id="commentForm" class="comment-form">
                    <div class="form-row">
                        <input type="text" id="commentNickname" placeholder="닉네임" class="form-input nickname-input" required maxlength="20">
                        <input type="password" id="commentPassword" placeholder="비밀번호 (4자 이상)" class="form-input password-input" required minlength="4">
                    </div>
                    <textarea id="commentContent" placeholder="무서운 이야기에 대한 생각을 남겨보세요..." class="form-textarea" required maxlength="500"></textarea>
                    <div class="comment-form-footer">
                        <div class="char-counter">
                            <span id="commentCharCount">0</span>/500
                        </div>
                        <button type="submit" class="comment-submit-btn">
                            👻 댓글 등록
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="comments-list">
                ${commentsHTML}
            </div>
        </div>
    `;
    
    // YouTube 링크를 임베드로 변환 및 첫 번째 이미지 썸네일 설정
    const postBodyElement = document.getElementById('postBodyContent');
    if (postBodyElement) {
        enhanceYouTubeEmbeds(postBodyElement);
        setFirstImageAsThumbnail(postBodyElement, post);
    }
}

function updateMetaTags(post) {
    // Description 업데이트
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', post.excerpt);
    }
    
    // Keywords 업데이트
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
        metaKeywords.setAttribute('content', `무서운이야기, 괴담, ${post.category_name}, ${post.nickname}, 짭샵`);
    }
    
    // Open Graph 업데이트
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.setAttribute('content', `${post.title} - 무서운이야기`);
    }
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
        ogDesc.setAttribute('content', post.excerpt);
    }
}

function sharePost() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            // SweetAlert2로 메시지 표시
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '링크가 복사되었습니다!',
                    text: '다른 사람들과 무서운 이야기를 공유해보세요.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#667eea',
                    background: '#2d3748',
                    color: '#fff',
                    timer: 2000,
                    timerProgressBar: true
                });
            } else {
                alert('링크가 복사되었습니다! 📋');
            }
        }).catch(() => {
            // 클립보드 접근 실패 시 대안
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '링크가 복사되었습니다!',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#667eea'
                });
            } else {
                alert('링크가 복사되었습니다! 📋');
            }
        });
    } else if (navigator.share) {
        navigator.share({
            title: document.title,
            url: url
        });
    } else {
        // 최후의 수단
        prompt('링크를 복사하세요:', url);
    }
}

// 댓글 작성 기능
function initCommentSystem() {
    const commentForm = document.getElementById('commentForm');
    const commentContent = document.getElementById('commentContent');
    const commentCharCount = document.getElementById('commentCharCount');
    
    if (!commentForm || !commentContent || !commentCharCount) return;
    
    // 글자수 카운터
    commentContent.addEventListener('input', function() {
        const count = this.value.length;
        commentCharCount.textContent = count;
        
        if (count > 450) {
            commentCharCount.style.color = '#ff6b6b';
        } else if (count > 400) {
            commentCharCount.style.color = '#ffa500';
        } else {
            commentCharCount.style.color = '#999';
        }
    });
    
    // 댓글 제출
    commentForm.addEventListener('submit', handleCommentSubmit);
}

async function handleCommentSubmit(e) {
    e.preventDefault();
    
    const nickname = document.getElementById('commentNickname').value.trim();
    const password = document.getElementById('commentPassword').value;
    const content = document.getElementById('commentContent').value.trim();
    const submitBtn = document.querySelector('.comment-submit-btn');
    
    // 유효성 검사
    if (!nickname || nickname.length < 2) {
        alert('닉네임을 2자 이상 입력해주세요.');
        return;
    }
    
    if (!password || password.length < 4) {
        alert('비밀번호를 4자 이상 입력해주세요.');
        return;
    }
    
    if (!content || content.length < 2) {
        alert('댓글 내용을 2자 이상 입력해주세요.');
        return;
    }
    
    // 제출 중 상태
    submitBtn.disabled = true;
    submitBtn.innerHTML = '👻 등록 중...';
    
    try {
        const formData = new FormData();
        formData.append('post_id', postId);
        formData.append('nickname', nickname);
        formData.append('password', password);
        formData.append('content', content);
        
        const response = await fetch('/api/horror_v2.php?action=submit_comment', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // 성공 시 폼 초기화
            document.getElementById('commentForm').reset();
            document.getElementById('commentCharCount').textContent = '0';
            
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: '댓글이 등록되었습니다!',
                    text: '무서운 이야기에 참여해주셔서 감사합니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#667eea',
                    background: '#2d3748',
                    color: '#fff',
                    timer: 2000
                });
            } else {
                alert('댓글이 등록되었습니다! 👻');
            }
            
            // 페이지 새로고침으로 새 댓글 표시
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } else {
            throw new Error(result.error || '댓글 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('댓글 등록 오류:', error);
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '오류가 발생했습니다',
                text: error.message,
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: '#ff6b6b'
            });
        } else {
            alert('오류: ' + error.message);
        }
    } finally {
        // 버튼 상태 복원
        submitBtn.disabled = false;
        submitBtn.innerHTML = '👻 댓글 등록';
    }
}


// 게시글 수정 (바로 수정 페이지로 이동)
async function editPost() {
    window.location.href = `/horror/write?id=${postId}`;
}

// 게시글 삭제
async function deletePost() {
    const password = await promptPassword('게시글을 삭제하려면 비밀번호를 입력하세요.');
    if (!password) return;
    
    // 삭제 확인
    const confirmResult = await Swal.fire({
        title: '삭제하시겠습니까?',
        text: '삭제 후에는 복구할 수 없습니다.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소',
        confirmButtonColor: '#ff6b6b',
        cancelButtonColor: '#6c757d',
        background: '#2d3748',
        color: '#fff'
    });
    
    if (!confirmResult.isConfirmed) return;
    
    try {
        const response = await fetch(`/api/horror_v2.php?action=delete_post`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: postId, password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            await Swal.fire({
                title: '삭제 완료',
                text: '게시글이 삭제되었습니다.',
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#667eea',
                background: '#2d3748',
                color: '#fff',
                timer: 2000
            });
            // 카테고리 목록으로 이동
            window.location.href = '/horror';
        } else {
            throw new Error(result.error || '삭제에 실패했습니다.');
        }
    } catch (error) {
        Swal.fire({
            title: '오류',
            text: error.message,
            icon: 'error',
            confirmButtonText: '확인',
            confirmButtonColor: '#ff6b6b'
        });
    }
}

// 비밀번호 입력 프롬프트
async function promptPassword(title) {
    const { value: password } = await Swal.fire({
        title: title || '비밀번호를 입력하세요',
        input: 'password',
        inputLabel: '비밀번호',
        inputPlaceholder: '비밀번호를 입력하세요',
        inputAttributes: { maxlength: 20 },
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
        confirmButtonColor: '#667eea',
        cancelButtonColor: '#6c757d',
        background: '#2d3748',
        color: '#fff'
    });
    
    return password;
}

// YouTube 링크를 임베드로 변환
function enhanceYouTubeEmbeds(rootEl) {
    if (!rootEl) return;
    
    // 1) a 태그 변환
    rootEl.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach(a => {
        const href = a.getAttribute('href') || '';
        const embed = buildYouTubeIframe(href);
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
                let last = 0; 
                let m; 
                let changed = false;
                const frag = document.createDocumentFragment();
                
                while ((m = re.exec(text)) !== null) {
                    const before = text.slice(last, m.index);
                    if (before) frag.appendChild(document.createTextNode(before));
                    
                    const raw = m[0];
                    const url = raw.startsWith('http') ? raw : ('https://' + raw.replace(/^\/\//,'').replace(/^www\./,'www.'));
                    const iframe = buildYouTubeIframe(url);
                    
                    if (iframe) { 
                        const span = document.createElement('div');
                        span.style.margin = '12px 0';
                        span.innerHTML = iframe; 
                        frag.appendChild(span); 
                        changed = true; 
                    } else { 
                        frag.appendChild(document.createTextNode(raw)); 
                    }
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

function buildYouTubeIframe(url) {
    const id = extractYouTubeId(url);
    if (!id) return '';
    
    const src = `https://www.youtube.com/embed/${id}`;
    return `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;box-shadow:0 8px 32px rgba(255, 107, 107, 0.3);">
        <iframe src="${src}" 
                title="YouTube video" 
                style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
        </iframe>
    </div>`;
}

function extractYouTubeId(url) {
    try {
        const u = new URL(url);
        if (u.hostname.includes('youtu.be')) {
            return u.pathname.split('/')[1] || '';
        }
        if (u.hostname.includes('youtube.com')) {
            if (u.pathname.startsWith('/watch')) return u.searchParams.get('v') || '';
            if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || '';
        }
    } catch (_) { 
        // 간단한 정규식 방식으로 재시도
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
        return match ? match[1] : '';
    }
    return '';
}

// 첫 번째 이미지를 썸네일로 설정
function setFirstImageAsThumbnail(rootEl, post) {
    if (!rootEl) return;
    
    const firstImage = rootEl.querySelector('img');
    if (firstImage && firstImage.src) {
        // 이미지에 썸네일 스타일 적용
        firstImage.style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.4)';
        firstImage.style.border = '2px solid rgba(255, 255, 255, 0.1)';
        firstImage.style.borderRadius = '12px';
        
        // 썸네일 표시를 위한 배지 추가
        const badge = document.createElement('div');
        badge.innerHTML = '📸 대표 이미지';
        badge.style.cssText = `
            position: relative;
            background: linear-gradient(135deg, #ff6b6b, #ff5252);
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            display: inline-block;
            margin: 0 0 8px 0;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
        `;
        
        // 이미지 앞에 배지 삽입
        firstImage.parentNode.insertBefore(badge, firstImage);
        
        // Open Graph 이미지 메타 태그 업데이트
        updateOGImage(firstImage.src, post.title);
    }
}

function updateOGImage(imageSrc, postTitle) {
    // 기존 og:image 태그 제거
    document.querySelectorAll('meta[property="og:image"]').forEach(tag => tag.remove());
    
    // 새로운 og:image 태그 추가
    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', imageSrc);
    document.head.appendChild(ogImage);
    
    // og:image:width, og:image:height 추가
    const ogImageWidth = document.createElement('meta');
    ogImageWidth.setAttribute('property', 'og:image:width');
    ogImageWidth.setAttribute('content', '1200');
    document.head.appendChild(ogImageWidth);
    
    const ogImageHeight = document.createElement('meta');
    ogImageHeight.setAttribute('property', 'og:image:height');
    ogImageHeight.setAttribute('content', '630');
    document.head.appendChild(ogImageHeight);
    
    // og:image:alt 추가
    const ogImageAlt = document.createElement('meta');
    ogImageAlt.setAttribute('property', 'og:image:alt');
    ogImageAlt.setAttribute('content', `${postTitle} - 무서운이야기`);
    document.head.appendChild(ogImageAlt);
    
    // Twitter Card 이미지도 업데이트
    document.querySelectorAll('meta[name="twitter:image"]').forEach(tag => tag.remove());
    
    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    twitterImage.setAttribute('content', imageSrc);
    document.head.appendChild(twitterImage);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
</script>
