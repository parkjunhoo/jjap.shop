<?php
$page_title = '구인구직 글쓰기 - 짭샵';
$page_description = '구인/구직 글을 등록하세요.';
$page_css = '../assets/css/common.css';
include_once '../includes/section-headers/creator-header.php';
?>

<link href="https://cdn.quilljs.com/1.3.7/quill.snow.css" rel="stylesheet">
<style>
        .write-job-container{padding:20px}
        .write-header{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border-radius:20px;padding:24px;margin-bottom:20px}
        .form-card{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:16px;padding:16px}
        .form-row{display:flex;gap:12px;flex-wrap:wrap}
        .form-group{flex:1;min-width:220px;display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
        .form-group label{color:#1a202c;font-weight:600}
        .form-group input,.form-group select{padding:10px 12px;border:1px solid rgba(0,0,0,.12);border-radius:10px;color:#1a202c;background:#fff}
        .form-group input::placeholder{color:#a0aec0}
        .quill-wrapper{border:1px solid rgba(0,0,0,.12);border-radius:12px;overflow:hidden;background:#fff}
        .ql-container{min-height:300px}
        .ql-editor{color:#1a202c;background:#fff}
        .ql-editor p,.ql-editor li,.ql-editor span{color:#1a202c}
        .ql-editor.ql-blank::before{color:#a0aec0;opacity:1}
        .form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:14px}
        .btn{padding:10px 14px;border-radius:12px;border:1px solid rgba(0,0,0,.12);cursor:pointer}
        .btn-primary{background:linear-gradient(135deg,#667eea,#764ba2);border-color:#667eea;color:#fff}
        .btn-secondary{background:#fff}
        .contacts-box{border:1px dashed rgba(0,0,0,.12);border-radius:12px;padding:12px}
        .contact-row{display:flex;gap:8px;align-items:center;margin-bottom:8px}
        .contact-row select,.contact-row input{padding:8px 10px;border:1px solid rgba(0,0,0,.12);border-radius:10px}
        .contact-type{min-width:160px}
        .contact-custom{min-width:140px;display:none}
        .contact-value{flex:1}
        .remove-contact{border:1px solid rgba(0,0,0,.12);background:#fff;border-radius:10px;padding:8px 10px;cursor:pointer}
    </style>

<div class="write-job-container">
    <div class="write-header">
        <h1>🧾 구인구직 글쓰기</h1>
        <p>필수 항목을 입력하고 글을 등록하세요.</p>
    </div>

    <div class="form-card">
        <form id="writeJobForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="postType">구분</label>
                    <select id="postType" required>
                        <option value="recruit">구인</option>
                        <option value="job_seek">구직</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="category">카테고리</label>
                    <select id="category" required>
                        <option value="">선택</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="title">제목</label>
                <input id="title" type="text" maxlength="150" placeholder="제목을 입력하세요" required>
            </div>

            <div class="form-group">
                <label for="editor">내용</label>
                <div class="quill-wrapper"><div id="editor"></div></div>
                <textarea id="content" style="display:none" required></textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="nickname">닉네임</label>
                    <input id="nickname" type="text" maxlength="20" placeholder="닉네임" required>
                </div>
                <div class="form-group">
                    <label for="password">게시글 비밀번호</label>
                    <input id="password" type="password" minlength="4" maxlength="20" placeholder="수정/삭제용 비밀번호" required>
                </div>
            </div>

            <div class="form-group">
                <label>연락처</label>
                <div class="contacts-box">
                    <div id="contactsList"></div>
                    <button type="button" class="btn" id="addContactBtn">+ 연락처 추가</button>
                    <div style="margin-top:6px;color:#718096;font-size:.9rem">연락처는 최소 1개 이상 필요합니다. (전화번호/이메일/디스코드/카카오톡ID/직접입력)</div>
                </div>
            </div>

            <div class="form-row" id="payRow">
                <div class="form-group">
                    <label for="rateType">급여</label>
                    <select id="rateType">
                        <option value="per_minute">분당</option>
                        <option value="per_video">영상 건당</option>
                        <option value="negotiable">협의 후 결정</option>
                    </select>
                </div>
                <div class="form-group" id="minuteRateGroup">
                    <label for="minuteRate">분당(원)</label>
                    <input id="minuteRate" type="number" min="0" step="1" placeholder="예: 1000">
                </div>
                <div class="form-group" id="videoRateGroup">
                    <label for="videoRate">영상 건당(원)</label>
                    <input id="videoRate" type="number" min="0" step="1" placeholder="예: 50000">
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="history.back()">취소</button>
                <button type="submit" class="btn btn-primary">등록</button>
            </div>
        </form>
    </div>
</div>

<?php include_once '../includes/footer.php'; ?>

<script src="https://cdn.quilljs.com/1.3.7/quill.min.js"></script>
<script src="../assets/js/job-board-write.js"></script>


