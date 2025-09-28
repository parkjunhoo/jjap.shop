// 발로란트 게시글 상세 페이지 JavaScript

let currentPost = null;

// 댓글 시스템 초기화
function initCommentSystem() {
    // 댓글 글자 수 카운터
    const commentContent = document.getElementById('commentContent');
    const charCount = document.getElementById('commentCharCount');
    
    if (commentContent && charCount) {
        commentContent.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 450) {
                charCount.style.color = '#FF4655';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        });
    }
    
    // 댓글 작성 폼 제출
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
}

// 댓글 작성 처리
async function handleCommentSubmit(e) {
    e.preventDefault();
    
    const nickname = document.getElementById('commentNickname').value.trim();
    const password = document.getElementById('commentPassword').value;
    const content = document.getElementById('commentContent').value.trim();
    
    if (!nickname || !password || !content) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    if (password.length < 4) {
        alert('비밀번호는 4자 이상 입력해주세요.');
        return;
    }
    
    if (content.length > 500) {
        alert('댓글은 500자 이하로 입력해주세요.');
        return;
    }
    
    const submitBtn = document.querySelector('.comment-submit-btn');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.textContent = '등록 중...';
        submitBtn.disabled = true;
        
        const formData = new FormData();
        formData.append('post_id', postId);
        formData.append('nickname', nickname);
        formData.append('password', password);
        formData.append('content', content);
        
        const response = await fetch('/api/valorant.php?action=create_comment', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 폼 초기화
            document.getElementById('commentForm').reset();
            document.getElementById('commentCharCount').textContent = '0';
            
            // 성공 메시지
            showSuccessMessage('댓글이 등록되었습니다! 🎮');
            
            // 페이지 새로고침으로 댓글 목록 업데이트
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            throw new Error(data.error || '댓글 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('댓글 등록 오류:', error);
        alert('댓글 등록 중 오류가 발생했습니다: ' + error.message);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// 게시글 수정
async function editPost() {
    const password = prompt('게시글 비밀번호를 입력해주세요:');
    if (!password) return;

    const data = await postRequest('verify_password', { post_id: postId, password });
    if (!data) return;

    if (data.success) {
        window.location.href = `/game/valorant/write?id=${postId}`;
    } else {
        alert(data.error || '비밀번호 확인 실패');
    }
}

// 게시글 삭제
async function deletePost() {
    if (!confirm('정말로 이 팁을 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.')) return;

    const password = prompt('게시글 비밀번호를 입력해주세요:');
    if (!password) return;

    const data = await postRequest('delete_post', { post_id: postId, password });
    if (!data) return;

    if (data.success) {
        showSuccessMessage('팁이 삭제되었습니다. 게시판으로 이동합니다...');
        setTimeout(() => {
            window.location.href = '/game/valorant/board';
        }, 1500);
    } else {
        alert(data.error || '삭제에 실패했습니다.');
    }
}


// 게시글 공유
async function sharePost() {
    const currentUrl = window.location.href;
    
    try {
        if (navigator.share) {
            // Web Share API 지원하는 경우
            await navigator.share({
                title: currentPost ? `${currentPost.title} - ${currentPost.agent_name} 팁` : '발로란트 팁',
                text: currentPost ? currentPost.summary || '발로란트 공략 팁을 확인해보세요!' : '발로란트 공략 팁',
                url: currentUrl
            });
        } else {
            // 클립보드 복사
            await navigator.clipboard.writeText(currentUrl);
            showSuccessMessage('링크 복사 완료! 📋');
        }
    } catch (error) {
        console.error('공유 오류:', error);
        
        // 폴백: 수동 복사
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        showSuccessMessage('링크 복사 완료! 📋');
    }
}

// YouTube 링크 임베드 처리
function processYouTubeLinks(container) {
    if (!container) return;
    
    // YouTube URL 패턴들
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/g,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g
    ];
    
    let html = container.innerHTML;
    
    patterns.forEach(pattern => {
        html = html.replace(pattern, (match, videoId) => {
            return `
                <div class="youtube-embed-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        class="youtube-iframe">
                    </iframe>
                </div>
            `;
        });
    });
    
    container.innerHTML = html;
    
    // YouTube 임베드 스타일 적용
    if (container.querySelector('.youtube-embed-container')) {
        const style = document.createElement('style');
        style.textContent = `
            .youtube-embed-container {
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%; /* 16:9 비율 */
                margin: 1rem 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            .youtube-iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// 이미지 크기 조정
function adjustPostImages(container) {
    if (!container) return;
    
    const images = container.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        
        // 이미지 로드 에러 처리
        img.onerror = function() {
            this.style.display = 'none';
        };
        
        // 이미지 클릭 시 모달로 확대 보기
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            showImageModal(img.src, img.alt);
        });
    });
}

// 이미지 모달 표시
function showImageModal(src, alt) {
    // 모달이 이미 있으면 제거
    const existingModal = document.getElementById('imageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.innerHTML = `
        <div class="image-modal-overlay" onclick="closeImageModal()">
            <div class="image-modal-content" onclick="event.stopPropagation()">
                <button class="image-modal-close" onclick="closeImageModal()">×</button>
                <img src="${src}" alt="${alt}" class="modal-image">
            </div>
        </div>
    `;
    
    // 모달 스타일
    const style = document.createElement('style');
    style.textContent = `
        #imageModal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
        }
        .image-modal-overlay {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        .image-modal-content {
            position: relative;
            max-width: 95vw;
            max-height: 95vh;
            cursor: default;
        }
        .modal-image {
            max-width: 100%;
            max-height: 95vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .image-modal-close {
            position: absolute;
            top: -15px;
            right: -15px;
            background: #FF4655;
            color: white;
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(255, 70, 85, 0.4);
            transition: all 0.3s ease;
        }
        .image-modal-close:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(255, 70, 85, 0.6);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.remove();
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    // 기존 메시지가 있으면 제거
    const existing = document.querySelector('.success-toast');
    if (existing) {
        existing.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    
    // 토스트 스타일
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        fontWeight: '600',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        fontSize: '0.95rem'
    });
    
    // 애니메이션 키프레임 추가
    if (!document.querySelector('#toast-animations')) {
        const animations = document.createElement('style');
        animations.id = 'toast-animations';
        animations.textContent = `
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
        `;
        document.head.appendChild(animations);
    }
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// 전역 함수로 내보내기
window.initCommentSystem = initCommentSystem;
window.editPost = editPost;
window.deletePost = deletePost;
window.sharePost = sharePost;
window.processYouTubeLinks = processYouTubeLinks;
window.adjustPostImages = adjustPostImages;
