<?php
// 편집 모드 확인
$postId = isset($_GET['id']) ? (int)$_GET['id'] : null;
$isEditMode = $postId ? true : false;

$page_title = $isEditMode ? '무서운 이야기 수정 - 짭샵' : '무서운 이야기 쓰기 - 짭샵';
$page_description = $isEditMode ? '무서운 이야기를 수정해보세요.' : '무서운 이야기를 작성하고 다른 사람들과 공유해보세요. 실화, 도시전설, 창작 괴담 등 모든 장르 환영!';
$page_keywords = '무서운이야기, 괴담 쓰기, 실화 작성, 도시전설, 창작, 호러 스토리';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <meta name="description" content="<?php echo $page_description; ?>">
    
    <!-- Quill Editor CSS -->
    <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="/assets/css/common.css">
    <link rel="stylesheet" href="/assets/css/two-line-header.css">
    <link rel="stylesheet" href="/assets/css/mobile-menu.css">
    <link rel="stylesheet" href="/assets/css/horror.css">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 파비콘 설정 -->
    <link rel="icon" type="image/webp" sizes="16x16" href="/assets/images/jjapshoplogo.webp">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/jjapshoplogo.webp">
    
    <style>
        /* 공포 테마 Quill 에디터 */
        .horror-quill-wrapper {
            border: 2px solid rgba(139, 0, 0, 0.3);
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(139, 0, 0, 0.2);
            background: rgba(42, 42, 74, 0.8);
        }
        
        .ql-toolbar.ql-snow { 
            border: none; 
            background: linear-gradient(135deg, #8b0000, #dc143c);
        }
        
        .ql-container.ql-snow { 
            border: none; 
            min-height: 400px; 
        }
        
        .ql-editor {
            color: #e0e6ed;
            background: rgba(42, 42, 74, 0.9);
            min-height: 380px;
            font-size: 1rem;
            line-height: 1.6;
        }
        
        .ql-editor.ql-blank::before { 
            color: #999; 
            opacity: 1; 
            font-style: italic;
        }
        
        .ql-toolbar .ql-stroke {
            stroke: white;
        }
        
        .ql-toolbar .ql-fill {
            fill: white;
        }
        
        .ql-toolbar button:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>

<body class="horror-section">
    <!-- 무서운이야기 헤더 -->
    <?php include_once '../includes/section-headers/horror-header.php'; ?>

    <!-- Google AdSense 수평 광고 -->
    <?php include_once '../includes/ads/horizontal-ad.php'; ?>

    <div class="horror-write-container">
        <!-- 글쓰기 헤더 -->
        <div class="write-header">
            <div class="header-content">
                <h1 class="write-title"><?php echo $isEditMode ? '✏️ 무서운 이야기 수정' : '✍️ 무서운 이야기 쓰기'; ?></h1>
                <p class="write-subtitle"><?php echo $isEditMode ? '무서운 이야기를 수정하여 더욱 완성도 있게 만들어보세요...' : '당신만의 소름 끼치는 이야기를 들려주세요...'; ?></p>
            </div>
        </div>

        <!-- 글쓰기 폼 -->
        <form class="horror-write-form" id="horrorWriteForm" action="/api/horror_v2.php?action=submit_post" method="POST">
            <!-- 카테고리 선택 -->
            <div class="form-group category-section">
                <label for="category" class="form-label">
                    📚 이야기 카테고리 <span class="required">*</span>
                </label>
                <div class="category-select-wrapper">
                    <select name="category" id="categorySelect" class="form-input category-select" required>
                        <option value="">카테고리를 선택하세요</option>
                        <option value="urban-legends">🏙️ 도시 전설</option>
                        <option value="true-stories">😨 실화 이야기</option>
                        <option value="scary-when-understood">🤔 이해하면 무서운 이야기</option>
                        <option value="translated-horror">🌏 번역 괴담</option>
                    </select>
                </div>
            </div>

            <!-- 제목 -->
            <div class="form-group">
                <label for="title" class="form-label">
                    📝 이야기 제목 <span class="required">*</span>
                </label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    class="form-input title-input"
                    placeholder="무서운 이야기의 제목을 입력하세요..."
                    required
                    maxlength="200"
                >
                <div class="char-counter">
                    <span id="titleCounter">0</span>/200
                </div>
            </div>

            <!-- 작성자 정보 -->
            <div class="form-row">
                <div class="form-group">
                    <label for="nickname" class="form-label">
                        👤 닉네임 <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="nickname" 
                        name="nickname" 
                        class="form-input"
                        placeholder="닉네임을 입력하세요"
                        required
                        maxlength="20"
                    >
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">
                        🔐 글 비밀번호 <span class="required">*</span>
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-input"
                        placeholder="글 수정/삭제용 비밀번호"
                        required
                        minlength="4"
                    >
                </div>
            </div>


            <!-- 이야기 내용 (Quill Editor) -->
            <div class="form-group">
                <label for="content" class="form-label">
                    📖 이야기 내용 <span class="required">*</span>
                </label>
                <div class="horror-quill-wrapper">
                    <div id="editor" style="height: 400px;"></div>
                </div>
                <textarea id="content" name="content" style="display: none;"></textarea>
            </div>

            <!-- CAPTCHA -->
            <div class="form-group">
                <label class="form-label">
                    🔒 보안 확인 <span class="required">*</span>
                </label>
                <div class="captcha-container">
                    <div class="captcha-question" id="captchaQuestion">로딩 중...</div>
                    <input 
                        type="text" 
                        name="captcha_answer" 
                        class="form-input captcha-input"
                        placeholder="위 문제의 답을 입력하세요"
                        required
                    >
                    <button type="button" class="captcha-refresh" onclick="refreshCaptcha()">🔄</button>
                </div>
            </div>

            <!-- 제출 버튼 -->
            <div class="form-actions">
                <button type="submit" class="btn btn-primary submit-btn">
                    <?php echo $isEditMode ? '✏️ 무서운 이야기 수정하기' : '👻 무서운 이야기 등록하기'; ?>
                </button>
            </div>
        </form>
    </div>

    <!-- 공용 푸터 -->
    <?php include_once '../includes/footer.php'; ?>

    <!-- Quill Editor JS -->
    <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    
    <script>
    // Quill 에디터 초기화
    let quill;
    const isEditMode = <?php echo $isEditMode ? 'true' : 'false'; ?>;
    const postId = <?php echo $postId ? $postId : 'null'; ?>;
    
    document.addEventListener('DOMContentLoaded', function() {
        // Quill 에디터 설정
        quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '무서운 이야기를 자세히 들려주세요...\n\n팁:\n- 상황을 생생하게 묘사해보세요\n- 독자가 몰입할 수 있도록 써보세요\n- 실화라면 언제, 어디서 일어났는지 알려주세요\n- 번역글이라면 출처를 명시해주세요',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    [{ 'align': [] }],
                    ['clean']
                ]
            }
        });

        // 폼 제출 시 Quill 내용을 textarea에 복사
        document.getElementById('horrorWriteForm').addEventListener('submit', function() {
            document.getElementById('content').value = quill.root.innerHTML;
        });

        initializeWritePage();
        
        // 편집 모드인 경우 데이터 로드
        if (isEditMode && postId) {
            // 편집 모드일 때는 먼저 비밀번호 검증
            showPasswordVerificationForm();
        }
    });

    function initializeWritePage() {
        // 제목 글자수 카운터
        const titleInput = document.getElementById('title');
        const titleCounter = document.getElementById('titleCounter');
        
        titleInput.addEventListener('input', function() {
            titleCounter.textContent = this.value.length;
            if (this.value.length > 180) {
                titleCounter.style.color = '#ff6666';
            } else {
                titleCounter.style.color = '#999';
            }
        });

        // CAPTCHA 로드
        refreshCaptcha();

        // 카테고리 URL 파라미터 처리
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            const categorySelect = document.getElementById('categorySelect');
            if (categorySelect) {
                categorySelect.value = categoryParam;
            }
        }

        // 폼 제출 처리
        const form = document.getElementById('horrorWriteForm');
        form.addEventListener('submit', handleFormSubmit);
    }

    function refreshCaptcha() {
        // 간단한 수학 문제 CAPTCHA
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let answer;
        switch(operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '×': answer = num1 * num2; break;
        }
        
        document.getElementById('captchaQuestion').textContent = `${num1} ${operator} ${num2} = ?`;
        document.getElementById('captchaQuestion').dataset.answer = answer;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // 편집 모드가 아닌 경우에만 CAPTCHA 검증
        let captchaAnswer = '';
        if (!isEditMode) {
            captchaAnswer = document.querySelector('input[name="captcha_answer"]').value;
            const correctAnswer = document.getElementById('captchaQuestion').dataset.answer;
            
            if (captchaAnswer !== correctAnswer) {
                alert('보안 확인 답이 올바르지 않습니다. 다시 확인해주세요.');
                refreshCaptcha();
                return;
            }
        }
        
        // 폼 데이터 검증
        const title = document.getElementById('title').value.trim();
        const content = quill.getText().trim();
        const categorySelect = document.getElementById('categorySelect');
        const category = categorySelect.value;
        const nickname = document.getElementById('nickname').value.trim();
        
        // 편집 모드가 아닌 경우에만 비밀번호 검증
        let password = '';
        if (!isEditMode) {
            password = document.getElementById('password').value;
        }
        
        // 개별 필드 검증
        if (!title) {
            alert('제목을 입력해주세요.');
            document.getElementById('title').focus();
            return;
        }
        
        if (!content || content.length < 10) {
            alert('이야기 내용을 10자 이상 입력해주세요.');
            quill.focus();
            return;
        }
        
        if (!category) {
            alert('카테고리를 선택해주세요.');
            categorySelect.focus();
            return;
        }
        
        if (!nickname) {
            alert('닉네임을 입력해주세요.');
            document.getElementById('nickname').focus();
            return;
        }
        
        // 새 글 작성 모드에서만 비밀번호 검증
        if (!isEditMode) {
            if (!password) {
                alert('비밀번호를 입력해주세요.');
                document.getElementById('password').focus();
                return;
            }
            
            if (password.length < 4) {
                alert('비밀번호는 4자 이상 입력해주세요.');
                return;
            }
        }
        
        // 제출 진행
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = isEditMode ? '✏️ 수정 중...' : '👻 등록 중...';
        
        // Quill 내용을 textarea에 복사
        document.getElementById('content').value = quill.root.innerHTML;
        
        // AJAX로 서버에 전송
        const sessionId = isEditMode ? '' : document.getElementById('captchaQuestion').dataset.sessionId;
        submitPostToServer(title, quill.root.innerHTML, category, nickname, password, captchaAnswer, sessionId);
    }

        // AJAX 제출 함수
        async function submitPostToServer(title, content, category, nickname, password, captchaAnswer, sessionId) {
            const submitBtn = document.querySelector('.submit-btn');
            
            try {
                let response;
                
                if (isEditMode && postId) {
                    // 수정 모드: PUT 요청으로 update_post 호출
                    const payload = {
                        id: postId,
                        title: title,
                        content: content,
                        category: category
                    };
                    
                    response = await fetch('/api/horror_v2.php?action=update_post', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                } else {
                    // 새 글 작성 모드: FormData로 submit_post 호출
                    const formData = new FormData();
                    formData.append('title', title);
                    formData.append('content', content);
                    formData.append('category', category);
                    formData.append('nickname', nickname);
                    formData.append('password', password);
                    formData.append('captcha_answer', captchaAnswer);
                    formData.append('captcha_session_id', sessionId);
                    
                    response = await fetch('/api/horror_v2.php?action=submit_post', {
                        method: 'POST',
                        body: formData
                    });
                }
                
                const result = await response.json();
                
                if (result.success) {
                    const successMessage = isEditMode ? '무서운 이야기가 성공적으로 수정되었습니다! ✏️' : '무서운 이야기가 성공적으로 등록되었습니다! 👻';
                    alert(successMessage);
                    
                    // 리다이렉트
                    setTimeout(() => {
                        if (isEditMode) {
                            window.location.href = `/horror/post/${postId}`;
                        } else {
                            window.location.href = `/horror/category/${category}`;
                        }
                    }, 1000);
                } else {
                    throw new Error(result.error || (isEditMode ? '게시글 수정에 실패했습니다.' : '게시글 등록에 실패했습니다.'));
                }
            } catch (error) {
                console.error(isEditMode ? '게시글 수정 오류:' : '게시글 등록 오류:', error);
                alert('오류가 발생했습니다: ' + error.message);
                
                // 버튼 상태 복원
                submitBtn.disabled = false;
                submitBtn.innerHTML = isEditMode ? '✏️ 무서운 이야기 수정하기' : '👻 무서운 이야기 등록하기';
                
                // 새 글 작성 모드에서만 CAPTCHA 새로고침
                if (!isEditMode) {
                    refreshCaptcha();
                }
            }
        }

        // 편집 모드용 게시글 데이터 로드
        async function loadPostForEdit(postId) {
            try {
                const response = await fetch(`/api/horror_v2.php?action=get_post&id=${postId}`);
                const data = await response.json();
                
                if (data.success && data.data.post) {
                    const post = data.data.post;
                    
                    // 폼에 기존 데이터 채워넣기
                    document.getElementById('categorySelect').value = post.category_slug;
                    document.getElementById('title').value = post.title;
                    document.getElementById('nickname').value = post.nickname;
                    
                    // Quill 에디터에 내용 설정
                    quill.root.innerHTML = post.content;
                    document.getElementById('content').value = post.content;
                    
                    // 닉네임 필드를 읽기 전용으로 설정
                    document.getElementById('nickname').readOnly = true;
                    document.getElementById('nickname').style.backgroundColor = '#f8f9fa';
                    document.getElementById('nickname').style.cursor = 'not-allowed';
                    
                    // 폼 액션을 수정 API로 변경
                    document.getElementById('horrorWriteForm').setAttribute('data-edit-mode', 'true');
                    
                } else {
                    throw new Error(data.error || '게시글을 불러올 수 없습니다.');
                }
            } catch (error) {
                console.error('게시글 로드 오류:', error);
                alert('게시글을 불러오는데 실패했습니다: ' + error.message);
                window.location.href = '/horror';
            }
        }

        // 편집 모드에서 CAPTCHA 숨기기
        function hideCaptchaForEdit() {
            const captchaGroup = document.querySelector('.captcha-group');
            if (captchaGroup) {
                captchaGroup.style.display = 'none';
            }
            const captchaInput = document.querySelector('input[name="captcha_answer"]');
            if (captchaInput) {
                captchaInput.removeAttribute('required');
            }
        }

        // 편집 모드에서 비밀번호 필드 숨기기
        function hidePasswordForEdit() {
            const passwordGroup = document.querySelector('.form-group:has(input[name="password"])');
            if (passwordGroup) {
                passwordGroup.style.display = 'none';
            }
            const passwordInput = document.querySelector('input[name="password"]');
            if (passwordInput) {
                passwordInput.removeAttribute('required');
            }
        }
        
        // 비밀번호 검증 폼 표시
        function showPasswordVerificationForm() {
            const container = document.querySelector('.horror-write-container');
            
            // 기존 폼 숨기기
            const writeForm = document.querySelector('.horror-write-form');
            if (writeForm) {
                writeForm.style.display = 'none';
            }
            
            // 비밀번호 검증 폼 생성
            const verificationHtml = `
                <div class="password-verification-container" style="max-width: 500px; margin: 2rem auto; padding: 2rem; background: rgba(20, 20, 30, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px; text-align: center;">
                    <h2 style="color: #ff6b6b; margin-bottom: 1.5rem; font-size: 1.5rem;">🔐 게시글 수정 인증</h2>
                    <p style="color: rgba(255, 255, 255, 0.8); margin-bottom: 2rem; line-height: 1.6;">
                        게시글을 수정하려면 작성 시 입력했던 비밀번호를 입력해주세요.
                    </p>
                    
                    <div class="verification-form">
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <input type="password" id="verifyPassword" placeholder="비밀번호를 입력하세요" 
                                   style="width: 100%; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(0, 0, 0, 0.3); color: white; border-radius: 10px; font-size: 1rem;" required>
                        </div>
                        
                        <div class="form-actions" style="display: flex; gap: 1rem; justify-content: center;">
                            <button type="button" onclick="verifyPasswordAndLoad()" class="btn-verify" 
                                    style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                ✅ 확인
                            </button>
                            <button type="button" onclick="history.back()" class="btn-cancel"
                                    style="background: rgba(255, 107, 107, 0.8); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                                ❌ 취소
                            </button>
                        </div>
                        
                        <div class="loading-verification" id="loadingVerification" style="display: none; margin-top: 1rem;">
                            <p style="color: #667eea;">비밀번호 확인 중...</p>
                        </div>
                    </div>
                </div>
            `;
            
            // 헤더 다음에 삽입
            const headerDiv = container.querySelector('.write-header');
            if (headerDiv) {
                headerDiv.insertAdjacentHTML('afterend', verificationHtml);
            }
            
            // Enter 키로 확인 버튼 작동
            document.getElementById('verifyPassword').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    verifyPasswordAndLoad();
                }
            });
        }
        
        // 비밀번호 검증 후 게시글 로드
        async function verifyPasswordAndLoad() {
            const passwordInput = document.getElementById('verifyPassword');
            const password = passwordInput.value.trim();
            
            if (!password) {
                alert('비밀번호를 입력해주세요.');
                passwordInput.focus();
                return;
            }
            
            const loadingDiv = document.getElementById('loadingVerification');
            const verifyBtn = document.querySelector('.btn-verify');
            
            try {
                loadingDiv.style.display = 'block';
                verifyBtn.disabled = true;
                verifyBtn.textContent = '확인 중...';
                
                // 비밀번호 검증
                const response = await fetch('/api/horror_v2.php?action=verify_password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: postId, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // 비밀번호 검증 성공 - 검증 폼 숨기고 실제 폼 표시
                    document.querySelector('.password-verification-container').style.display = 'none';
                    document.querySelector('.horror-write-form').style.display = 'block';
                    
                    // 게시글 데이터 로드
                    await loadPostForEdit(postId);
                    hideCaptchaForEdit();
                    hidePasswordForEdit();
                    
                } else {
                    throw new Error(result.error || '비밀번호가 올바르지 않습니다.');
                }
                
            } catch (error) {
                console.error('비밀번호 검증 오류:', error);
                alert('오류: ' + error.message);
                
                // 비밀번호 입력란 초기화
                passwordInput.value = '';
                passwordInput.focus();
                
            } finally {
                loadingDiv.style.display = 'none';
                verifyBtn.disabled = false;
                verifyBtn.textContent = '✅ 확인';
            }
        }
    </script>

    <style>
    /* 무서운 이야기 글쓰기 페이지 간소화된 스타일 */
    .horror-write-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f0f23);
        min-height: 100vh;
        color: #e0e6ed;
    }

    .write-header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: linear-gradient(135deg, #2c1810, #4a0e2d, #1a0b2e);
        border-radius: 15px;
        border: 2px solid rgba(139, 0, 0, 0.3);
    }

    .write-title {
        font-size: 2.2rem;
        color: #ff6b6b;
        margin-bottom: 10px;
        text-shadow: 0 0 20px rgba(220, 20, 60, 0.8);
    }

    .write-subtitle {
        color: #ccc;
        font-size: 1.1rem;
    }

    .horror-write-form {
        background: linear-gradient(135deg, #2a2a4a, #1f1f3a);
        border-radius: 20px;
        padding: 30px;
        border: 2px solid rgba(139, 0, 0, 0.3);
    }

    .form-group {
        margin-bottom: 25px;
    }

    .form-label {
        display: block;
        color: #ff6b6b;
        font-weight: 600;
        margin-bottom: 10px;
        font-size: 1rem;
    }

    .required {
        color: #ff4444;
    }

    .category-select-wrapper {
        position: relative;
    }

    .category-select {
        width: 100%;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ff6b6b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 12px center;
        background-repeat: no-repeat;
        background-size: 16px;
        cursor: pointer;
    }

    .category-select:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.2);
    }

    .form-input {
        width: 100%;
        padding: 15px;
        background: rgba(42, 42, 74, 0.8);
        border: 2px solid rgba(139, 0, 0, 0.2);
        border-radius: 10px;
        color: #e0e6ed;
        font-size: 1rem;
        font-family: 'Noto Sans KR', sans-serif;
        transition: border-color 0.3s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: #ff6b6b;
        box-shadow: 0 0 15px rgba(255, 107, 107, 0.2);
    }

    .title-input {
        font-size: 1.2rem;
        font-weight: 600;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .char-counter {
        text-align: right;
        color: #999;
        font-size: 0.85rem;
        margin-top: 5px;
    }


    .captcha-container {
        display: flex;
        align-items: center;
        gap: 15px;
        background: rgba(42, 42, 74, 0.5);
        padding: 20px;
        border-radius: 10px;
    }

    .captcha-question {
        background: rgba(139, 0, 0, 0.8);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        font-size: 1.2rem;
        min-width: 120px;
        text-align: center;
    }

    .captcha-input {
        flex: 1;
        max-width: 200px;
    }

    .captcha-refresh {
        background: rgba(139, 0, 0, 0.6);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: background-color 0.3s ease;
    }

    .captcha-refresh:hover {
        background: rgba(220, 20, 60, 0.8);
    }

    .form-actions {
        text-align: center;
        padding-top: 20px;
        border-top: 2px solid rgba(139, 0, 0, 0.2);
    }

    .btn {
        padding: 15px 40px;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: linear-gradient(135deg, #8b0000, #dc143c);
        color: white;
    }

    .btn-primary:hover {
        background: linear-gradient(135deg, #dc143c, #ff4444);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 0, 0, 0.4);
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    /* 반응형 */
    @media (max-width: 768px) {
        .horror-write-container {
            padding: 15px;
        }
        
        .horror-write-form {
            padding: 20px;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        
        .captcha-container {
            flex-direction: column;
            gap: 10px;
            text-align: center;
        }
    }
    </style>

</body>
</html>