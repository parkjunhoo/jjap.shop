<?php
$page_title = '구인구직 상세 - 짭샵';
$page_description = '구인구직 게시글의 상세 내용을 확인하세요.';
$page_css = '../assets/css/common.css';
include_once '../includes/section-headers/creator-header.php';
?>

<style>
        /* 다크 테마 */
        body{background:linear-gradient(180deg,#0f1120 0%, #14162a 60%, #0f1120 100%);}
        .job-view{padding:28px}
        .back-btn{display:inline-block;margin-bottom:18px;padding:10px 16px;border-radius:12px;text-decoration:none;color:#e9e9ff;background:linear-gradient(135deg,#5b6cea,#7a3fd6);box-shadow:0 12px 28px rgba(90,108,234,.25);border:1px solid rgba(123,97,255,.35)}
        .back-btn:hover{transform:translateY(-1px);box-shadow:0 18px 36px rgba(90,108,234,.32)}
        .job-card{background:#ffffff;border:1px solid rgba(0,0,0,.08);border-radius:22px;padding:28px;box-shadow:0 16px 40px rgba(0,0,0,.12)}
        .job-card h1{color:#1a202c;margin:0 0 14px 0}
        .job-meta{color:#4a5568;display:flex;gap:16px;margin:14px 0 18px 0}
        .badge{display:inline-block;background:linear-gradient(135deg, rgba(102,126,234,.10), rgba(118,75,162,.08));border:1px solid rgba(102,126,234,.25);padding:6px 12px;border-radius:999px;color:#2d3748;font-weight:700}
        .job-content{color:#1a202c;line-height:1.9;margin-top:12px}
        .contacts{margin-top:22px}
        .contacts h4{color:#1a202c;margin:0 0 10px 0}
        .contact-item{display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.03);border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:12px 14px;margin-bottom:10px;color:#2d3748}
        .contact-item .icon{width:20px;height:20px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,.35))}
        .contact-item .emoji{font-size:18px}
        /* 액션 버튼 강화 */
        .job-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:16px}
        .job-actions .btn{padding:12px 16px;border-radius:12px;border:1px solid rgba(0,0,0,.14);cursor:pointer;font-weight:700}
        #jobEditBtn{background:linear-gradient(135deg, rgba(102,126,234,.25), rgba(118,75,162,.25));color:#1a202c}
        #jobEditBtn:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(102,126,234,.25)}
        #jobDeleteBtn{background:linear-gradient(135deg, rgba(245,101,101,.28), rgba(229,62,62,.28));color:#1a202c;border-color:rgba(245,101,101,.45)}
        #jobDeleteBtn:hover{transform:translateY(-1px);box-shadow:0 12px 28px rgba(229,62,62,.28)}
        .job-actions .btn:focus{outline:none;box-shadow:0 0 0 3px rgba(123,97,255,.28)}
        #jobShareBtn{color:#1a202c}
    </style>

<div class="job-view">
    <a href="/creator/job-board" class="back-btn">← 목록으로</a>
    <!-- Google AdSense 수평 광고 -->
    <?php include_once '../includes/ads/horizontal-ad.php'; ?>
    
    <div class="job-card" id="jobCard">불러오는 중...</div>
    <div style="height:24px"></div>
</div>
<?php include_once '../includes/footer.php'; ?>
<script src="../assets/js/job-view.js"></script>


