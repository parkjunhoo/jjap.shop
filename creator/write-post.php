<?php
$page_title = '게시글 작성 - 크리에이터 커뮤니티';
$page_description = '크리에이터 커뮤니티에 새로운 글을 작성하세요.';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>게시글 작성 - 크리에이터 커뮤니티</title>
    <meta name="description" content="크리에이터들을 위한 소통 공간에서 게시글을 작성해보세요">
    
    <!-- Open Graph -->
    <meta property="og:title" content="게시글 작성 - 크리에이터 커뮤니티">
    <meta property="og:description" content="크리에이터들을 위한 소통 공간에서 게시글을 작성해보세요">
    <meta property="og:type" content="website">
    
     <!-- Quill Editor CSS -->
     <link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
     <!-- Bootstrap CSS -->
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/community.css">
    
    <style>
        /* Quill 래퍼 */
        .quill-wrapper {
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            background: rgba(255,255,255,0.95);
        }
        .ql-toolbar.ql-snow { border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .ql-container.ql-snow { border: none; min-height: 420px; }
        /* 에디터 내용 가독성 보장 */
        .ql-editor {
            color: #1a202c; /* 다크 그레이 */
            background: rgba(255,255,255,0.98);
            min-height: 400px; /* 클릭 가능한 영역 확대 */
        }
        .ql-editor p,
        .ql-editor li,
        .ql-editor span {
            color: #1a202c;
        }
        .ql-editor a { color: #4c51bf; text-decoration: underline; }
        .ql-editor.ql-blank::before { color: #a0aec0; opacity: 1; }
        
        /* 에디터 미리보기 */
        .editor-preview {
            background: rgba(255,255,255,0.95);
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 20px;
            padding: 30px;
            margin-top: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            display: none;
        }
        
        .editor-preview h3 {
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: 700;
            border-bottom: 3px solid rgba(102, 126, 234, 0.2);
            padding-bottom: 15px;
        }
        
        .editor-preview-content {
            line-height: 1.8;
            color: #4a5568;
            font-size: 1.1rem;
        }
        
        /* 에디터 컨트롤 버튼 */
        .editor-controls {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            justify-content: center;
        }
        
        .editor-control-btn {
            padding: 12px 25px;
            border: 2px solid rgba(102, 126, 234, 0.3);
            background: rgba(255,255,255,0.9);
            color: #667eea;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 0.95rem;
        }
        
        .editor-control-btn:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .editor-control-btn.active {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-color: #667eea;
            box-shadow: 0 6px 15px rgba(102, 126, 234, 0.4);
        }
        
        /* 글자 수 카운터 */
        .char-counter {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
            padding: 15px 20px;
            border-radius: 15px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            margin-top: 20px;
            text-align: center;
        }
        
        .char-counter .counter-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .char-counter .counter-bar {
            width: 100%;
            height: 8px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .char-counter .counter-progress {
            height: 100%;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .char-counter .counter-text {
            color: #667eea;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        /* 태그 입력 */
        .tags-input-container {
            position: relative;
        }
        
        .tags-input {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 15px;
            border: 2px solid rgba(102, 126, 234, 0.2);
            border-radius: 15px;
            background: rgba(255,255,255,0.9);
            min-height: 60px;
        }
        
        .tag-item {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
        }
        
        .tag-remove {
            background: rgba(255,255,255,0.3);
            border: none;
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            transition: all 0.3s ease;
        }
        
        .tag-remove:hover {
            background: rgba(255,255,255,0.5);
            transform: scale(1.1);
        }
        
        .tag-input {
            border: none;
            outline: none;
            background: transparent;
            font-size: 0.95rem;
            color: #2d3748;
            flex: 1;
            min-width: 120px;
        }
        
        .tag-input::placeholder {
            color: #a0aec0;
        }
        
        /* 파일 업로드 스타일 제거 */
    </style>
</head>
<body>
    <?php include '../includes/section-headers/creator-header.php'; ?>
    
    <div class="write-post-container">
        <!-- 헤더 -->
        <div class="write-header">
            <h1><i class="fas fa-edit"></i> 게시글 작성</h1>
            <p>크리에이터들과 소통할 멋진 글을 작성해보세요!</p>
        </div>
        
        <!-- 게시글 작성 폼 -->
        <form class="write-post-form" id="writePostForm">
            <!-- 카테고리 선택 -->
            <div class="form-group">
                <label for="category"><i class="fas fa-tag"></i> 카테고리</label>
                <select id="category" name="category" required>
                    <option value="">카테고리를 선택하세요</option>
                </select>
            </div>
            
            <!-- 제목 입력 -->
            <div class="form-group">
                <label for="title"><i class="fas fa-heading"></i> 제목</label>
                <input type="text" id="title" name="title" placeholder="흥미로운 제목을 입력하세요" required maxlength="100">
                <div class="char-count">
                    <span id="titleCount">0</span> / 100자
                </div>
            </div>
            
            <!-- 태그 입력 제거 -->
            
            <!-- 미리보기 제거 -->
            
            <!-- 내용 입력 (Quill) -->
            <div class="form-group">
                <label for="content"><i class="fas fa-pen-fancy"></i> 내용</label>
                <div class="quill-wrapper">
                    <div id="editor"></div>
                </div>
                <textarea id="content" name="content" style="display:none" required></textarea>
                <div class="char-counter">
                    <div class="counter-info">
                        <span class="counter-text">글자 수</span>
                        <span class="counter-text">
                            <span id="contentCount">0</span> / 10,000자
                        </span>
                    </div>
                    <div class="counter-bar">
                        <div class="counter-progress" id="contentProgress" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            
            <!-- 파일 업로드 제거 -->
            
            <!-- 작성자 정보 (제목 아래로 이동) -->
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label for="nickname"><i class="fas fa-user"></i> 닉네임</label>
                    <input type="text" id="nickname" name="nickname" placeholder="닉네임을 입력하세요" required maxlength="20">
                </div>
                <div class="form-group" style="flex:1;" id="password-group">
                    <label for="password"><i class="fas fa-lock"></i> 게시글 비밀번호</label>
                    <input type="password" id="password" name="password" placeholder="게시글 수정/삭제용 비밀번호" minlength="4" maxlength="20">
                    <div class="help-text">게시글을 수정하거나 삭제할 때 필요합니다</div>
                </div>
            </div>
            
            <!-- CAPTCHA -->
            <div class="form-group">
                <div class="captcha-group">
                    <label><i class="fas fa-shield-alt"></i> 자동입력방지문구</label>
                    <div class="captcha-container">
                        <div class="captcha-image" id="captchaImage">ABC123</div>
                        <button type="button" class="refresh-captcha" id="refreshCaptcha">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                                         <input type="text" id="captcha" name="captcha" placeholder="위의 문자를 입력하세요" required maxlength="2" minlength="2" pattern="[A-Z0-9]{2}" style="margin-top: 15px;" oninput="this.value = this.value.toUpperCase()">
                     <div class="help-text" style="margin-top: 8px; text-align: center;">위의 2글자를 정확히 입력해주세요</div>
                </div>
            </div>
            
            <!-- 폼 버튼 -->
            <div class="form-buttons">
                <button type="button" class="btn btn-secondary" onclick="history.back()">
                    <i class="fas fa-arrow-left"></i> 취소
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> 게시글 등록
                </button>
            </div>
        </form>
        
        <!-- 미리보기 제거 -->
    </div>
    
    <?php include '../includes/footer.php'; ?>
    
         <!-- jQuery -->
     <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
     <!-- Bootstrap JS -->
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
     <!-- Quill JS -->
     <script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
    
    <script src="../assets/js/community.js"></script>
    <script src="../assets/js/write-post.js"></script>
</body>
</html>
