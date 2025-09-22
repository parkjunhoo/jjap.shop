<?php
$page_title = '게시글 보기 - 크리에이터 커뮤니티';
$page_description = '크리에이터 커뮤니티의 게시글을 확인하고 댓글을 남겨보세요.';
$page_css = '../assets/css/common.css';
include_once '../includes/section-headers/creator-header.php';
?>
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="../assets/css/common.css">
    
    <!-- 커뮤니티 전용 CSS -->
    <link rel="stylesheet" href="../assets/css/community.css">
    <style>
        /* 댓글 다크모드 오버라이드 (이 페이지 한정) */
        .view-post-container .comments-section {
            background: linear-gradient(180deg, #191c34 0%, #151830 100%);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            padding: 22px;
            color: #e8e9ff;
            box-shadow: 0 24px 60px rgba(30,35,80,.35);
            margin-top: 20px;
        }
        .comments-section h3 { color: #e8e9ff; margin: 0 0 14px 0; }
        .comments-section .comment-form input,
        .comments-section .comment-form textarea {
            background: #0f1328;
            border: 1px solid rgba(255,255,255,.12);
            color: #e8e9ff;
            border-radius: 12px;
        }
        .comments-section .comment-form input::placeholder,
        .comments-section .comment-form textarea::placeholder { color: #9aa3d9; }
        .comments-section .comment-form input:focus,
        .comments-section .comment-form textarea:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(123,97,255,.28);
            border-color: rgba(162,143,255,.65);
        }
        .comments-section .comment-submit .btn-primary {
            background: linear-gradient(135deg, #5b6cea, #7a3fd6);
            border: 1px solid rgba(123,97,255,.45);
            color: #e8e9ff;
        }
        .comments-section .comment-submit .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 12px 28px rgba(90,108,234,.32);
        }
        .comments-list .comment-item {
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            padding: 12px 14px;
            margin-bottom: 10px;
            color: #e8e9ff;
        }
        .comments-list .comment-item .comment-head { display: flex; gap: 10px; margin-bottom: 6px; }
        .comments-list .comment-item .comment-head .nick { color: #cfd2ff; font-weight: 700; }
        .comments-list .comment-item .comment-head .time { color: #9aa3d9; }
        .comments-list .comment-item .comment-body { color: #e8e9ff; line-height: 1.7; }
        
        /* 모바일 최적화 */
        @media (max-width: 768px) {
            .view-post-container .comments-section {
                padding: 20px;
                border-radius: 16px;
                margin-top: 15px;
            }
            .comments-section .comment-form {
                padding: 15px;
            }
            .comments-list .comment-item {
                padding: 15px;
                margin-bottom: 12px;
                border-radius: 12px;
            }
            .comments-list .comment-item .comment-head {
                gap: 8px;
                margin-bottom: 8px;
                flex-wrap: wrap;
            }
            .comments-list .comment-item .comment-head .nick {
                font-size: 1rem;
            }
            .comments-list .comment-item .comment-head .time {
                font-size: 0.85rem;
            }
            .comments-list .comment-item .comment-body {
                font-size: 0.95rem;
                line-height: 1.6;
            }
        }
        
        @media (max-width: 480px) {
            .view-post-container .comments-section {
                padding: 15px;
                border-radius: 12px;
            }
            .comments-section .comment-form {
                padding: 12px;
            }
            .comments-list .comment-item {
                padding: 12px;
                margin-bottom: 10px;
                border-radius: 10px;
            }
            .comments-list .comment-item .comment-head .nick {
                font-size: 0.9rem;
            }
            .comments-list .comment-item .comment-head .time {
                font-size: 0.8rem;
            }
            .comments-list .comment-item .comment-body {
                font-size: 0.9rem;
                line-height: 1.5;
            }
        }
    </style>

    <div class="view-post-container">
        <!-- 뒤로가기 버튼 -->
        <div class="back-button-container">
            <a href="/community" class="btn btn-secondary back-btn">← 커뮤니티로 돌아가기</a>
        </div>

        <!-- 게시글 내용 -->
        <!-- Google AdSense 수평 광고 -->
        <?php include_once '../includes/ads/horizontal-ad.php'; ?>
        
        <div class="post-content" id="post-content">
            <!-- 게시글이 여기에 동적으로 로드됩니다 -->
            <div class="loading">게시글을 불러오는 중...</div>
        </div>

        <!-- 게시글 액션 섹션 제거됨 (공유 버튼은 상단 우측으로 이동) -->

        <!-- 댓글 섹션 -->
        <div class="comments-section">
            <h3>💬 댓글</h3>
            
            <!-- 댓글 작성 폼 -->
            <div class="comment-form">
                <form id="comment-form">
                    <div class="comment-input-row">
                        <div class="comment-input-group">
                            <input type="text" id="comment-nickname" name="nickname" placeholder="닉네임" required maxlength="20">
                        </div>
                        <div class="comment-input-group">
                            <input type="password" id="comment-password" name="password" placeholder="댓글 비밀번호" required minlength="4" maxlength="20">
                        </div>
                    </div>
                    <div class="comment-content-group">
                        <textarea id="comment-content" name="content" placeholder="댓글을 입력하세요..." required rows="3"></textarea>
                    </div>
                    <div class="comment-submit">
                        <button type="submit" class="btn btn-primary">댓글 작성</button>
                    </div>
                </form>
            </div>

            <!-- 댓글 목록 -->
            <div class="comments-list" id="comments-list">
                <!-- 댓글들이 여기에 동적으로 로드됩니다 -->
            </div>
        </div>
    </div>

    <!-- 수정/삭제 비밀번호 확인 모달 -->
    <div class="modal" id="password-modal" style="display: none;">
        <div class="modal-content">
            <h3>비밀번호 확인</h3>
            <p id="modal-message">게시글을 수정/삭제하려면 비밀번호를 입력하세요.</p>
            <input type="password" id="modal-password" placeholder="비밀번호를 입력하세요" maxlength="20">
            <div class="modal-buttons">
                <button type="button" class="btn btn-secondary" id="modal-cancel">취소</button>
                <button type="button" class="btn btn-primary" id="modal-confirm">확인</button>
            </div>
        </div>
    </div>

    <!-- 공용 푸터 -->
    <?php include_once '../includes/footer.php'; ?>

    <!-- 커뮤니티 전용 JavaScript -->
    <script src="../assets/js/community.js"></script>
    <script src="../assets/js/view-post.js"></script>
