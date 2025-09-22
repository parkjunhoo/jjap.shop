<?php
// 게시글 ID 받기
$post_id = (int)($_GET['id'] ?? 0);

if (!$post_id) {
    header('HTTP/1.0 404 Not Found');
    exit('게시글을 찾을 수 없습니다.');
}

// 기본 메타 정보 (API 로드 전)
$page_title = '발로란트 팁 - 짭샵';
$page_description = '발로란트 공략 팁을 확인해보세요.';
$page_keywords = '발로란트, VALORANT, 팁, 공략, 가이드, 게임';
$page_css = ['assets/css/valorant.css', 'assets/css/valorant-post.css'];
$page_js = 'assets/js/valorant-post.js';
?>

<?php include_once '../../includes/section-headers/game-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../../includes/ads/horizontal-ad.php'; ?>

<div class="valorant-post-container">
    <!-- 로딩 상태 -->
    <div class="loading-post" id="loadingPost">
        <div class="loading-spinner">🎮</div>
        <p>팁을 불러오는 중...</p>
    </div>
    
    <!-- 게시글 내용 -->
    <div class="post-content" id="postContent" style="display: none;">
        <!-- JavaScript로 동적 로드됨 -->
    </div>
    
    <!-- 오류 상태 -->
    <div class="error-post" id="errorPost" style="display: none;">
        <div class="error-content">
            <div class="error-icon">😢</div>
            <h3>팁을 찾을 수 없어요</h3>
            <p>삭제되었거나 존재하지 않는 팁입니다.</p>
            <a href="/game/valorant/board" class="back-btn">← 게시판으로 돌아가기</a>
        </div>
    </div>
</div>

<!-- 공용 푸터 -->
<?php include_once '../../includes/footer.php'; ?>

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
        const response = await fetch(`/api/valorant.php?action=get_post&id=${postId}`);
        const data = await response.json();
        
        if (data.success) {
            const post = data.data.post;
            currentPost = post; // 전역 변수에 저장
            displayPost(post);
            
            // 메타 태그 업데이트
            document.title = `${post.title} - ${post.agent_name} 팁 - 발로란트 - 짭샵`;
            updateMetaTags(post);
            
            loadingElement.style.display = 'none';
            contentElement.style.display = 'block';
            
            // 댓글 시스템 초기화
            setTimeout(() => {
                initCommentSystem();
                updateFavoriteButton();
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
    
    // 난이도 아이콘
    const difficultyIcons = {
        beginner: '🟢',
        intermediate: '🟡', 
        advanced: '🔴',
        expert: '⚫'
    };
    
    const difficultyNames = {
        beginner: '초급',
        intermediate: '중급',
        advanced: '고급', 
        expert: '전문가'
    };
    
    const commentsHTML = post.comments?.length > 0 
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
            <div class="post-meta-badges">
                <div class="agent-badge">
                    <img src="/assets/images/valorant/charactor/${post.agent_name}.webp" 
                         alt="${post.agent_name}" class="agent-avatar" 
                         onerror="this.src='/assets/images/valorant/default-agent.webp'">
                    <span class="agent-name">${post.agent_name}</span>
                </div>
                <div class="difficulty-badge ${post.tip_difficulty}">
                    ${difficultyIcons[post.tip_difficulty] || '🟢'} ${difficultyNames[post.tip_difficulty] || '초급'}
                </div>
                <div class="category-badge">
                    📝 ${post.tip_category}
                </div>
            </div>
            
            <h1 class="post-title">${escapeHtml(post.title)}</h1>
            
            <div class="post-meta">
                <div class="post-stats">
                    <span>👀 ${post.view_count.toLocaleString()}</span>
                    <span>👍 ${post.like_count}</span>
                    <span>💬 ${post.comment_count}</span>
                </div>
                <div class="post-info">
                    <span class="post-author">${escapeHtml(post.nickname)}</span> • 
                    <span>${post.time_ago}</span>
                </div>
            </div>
        </div>
        
        <div class="post-body" id="postBodyContent">
            ${post.content}
        </div>
        
        <div class="post-actions">
            <div class="action-buttons">
                <button class="action-btn favorite-btn" id="favoriteBtn" onclick="toggleFavorite()">
                    <span class="favorite-icon">⭐</span> 
                    <span class="favorite-text">즐겨찾기</span>
                </button>
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
            <a href="/game/valorant/board" class="back-to-list-btn">
                ← 게시판 목록
            </a>
        </div>

        <div class="comments-section">
            <div class="comments-header">
                <h3 class="comments-title">💬 댓글</h3>
                <span class="comment-count">${post.comment_count || 0}개</span>
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
                    <textarea id="commentContent" placeholder="이 팁에 대한 생각을 남겨보세요..." class="form-textarea" required maxlength="500"></textarea>
                    <div class="comment-form-footer">
                        <div class="char-counter">
                            <span id="commentCharCount">0</span>/500
                        </div>
                        <button type="submit" class="comment-submit-btn">
                            🎮 댓글 등록
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="comments-list">
                ${commentsHTML}
            </div>
        </div>
    `;

    // YouTube 임베드 처리
    processYouTubeLinks(document.getElementById('postBodyContent'));
    
    // 이미지 크기 조정
    adjustPostImages(document.getElementById('postBodyContent'));
}

function updateMetaTags(post) {
    // Open Graph 메타 태그 업데이트
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = post.summary || `${post.agent_name} 발로란트 팁: ${post.title}`;
    }
    
    // 기존 OG 태그들 업데이트
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = `${post.title} - ${post.agent_name} 팁 - 발로란트`;
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.content = post.summary || `${post.agent_name} 발로란트 팁을 확인해보세요.`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 댓글 시스템 관련 함수들은 valorant-post.js에서 구현

// 즐겨찾기 관련 함수들
function toggleFavorite() {
    if (!currentPost) return;
    
    // 즐겨찾기 ID 목록 관리 (ID만 저장하여 효율성 향상)
    const favoriteIds = JSON.parse(localStorage.getItem('jjapshop_valorant_favorites') || '[]');
    const postId = String(currentPost.id);
    const existingIndex = favoriteIds.indexOf(postId);
    
    if (existingIndex >= 0) {
        // 즐겨찾기 제거
        favoriteIds.splice(existingIndex, 1);
        localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(favoriteIds));
        showToast('즐겨찾기에서 제거되었습니다! 💔', 'info');
        console.log('🗑️ 즐겨찾기 제거:', postId);
    } else {
        // 즐겨찾기 추가 (배열 맨 앞에 추가)
        favoriteIds.unshift(postId);
        localStorage.setItem('jjapshop_valorant_favorites', JSON.stringify(favoriteIds));
        showToast('즐겨찾기에 추가되었습니다! ⭐', 'success');
        console.log('⭐ 즐겨찾기 추가:', postId);
    }
    
    console.log('📋 현재 즐겨찾기 IDs:', favoriteIds);
    updateFavoriteButton();
}

function updateFavoriteButton() {
    if (!currentPost) return;
    
    const favoriteIds = JSON.parse(localStorage.getItem('jjapshop_valorant_favorites') || '[]');
    const postId = String(currentPost.id);
    const isFavorite = favoriteIds.includes(postId);
    
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favoriteIcon = favoriteBtn?.querySelector('.favorite-icon');
    const favoriteText = favoriteBtn?.querySelector('.favorite-text');
    
    if (favoriteBtn && favoriteIcon && favoriteText) {
        if (isFavorite) {
            favoriteBtn.classList.add('favorited');
            favoriteIcon.textContent = '⭐';
            favoriteText.textContent = '즐겨찾기 됨';
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteIcon.textContent = '☆';
            favoriteText.textContent = '즐겨찾기';
        }
    }
    
    console.log('🔍 즐겨찾기 버튼 상태 업데이트:', { postId, isFavorite });
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        info: 'linear-gradient(135deg, #FF4655, #FFD700)',
        error: 'linear-gradient(135deg, #F44336, #FF5722)'
    };
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: colors[type] || colors.info,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: '99999',
        animation: 'slideInRight 0.3s ease-out',
        fontSize: '0.95rem',
        maxWidth: '300px'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .favorite-btn.favorited {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1)) !important;
        border-color: rgba(255, 215, 0, 0.6) !important;
        color: #FFD700 !important;
    }
    
    .favorite-btn.favorited:hover {
        background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 215, 0, 0.2)) !important;
        box-shadow: 0 8px 25px rgba(255, 215, 0, 0.4) !important;
    }
`;
document.head.appendChild(style);

</script>
