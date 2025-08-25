<?php
$page_title = '개인정보처리방침 - 짭샵';
$page_description = '짭샵 개인정보처리방침입니다.';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title; ?></title>
    <link rel="stylesheet" href="../assets/css/common.css">
    <style>
        body{background:linear-gradient(135deg,#0b1020 0%,#1b2336 100%);color:#e5e7eb}
        .policy-container{max-width:900px;margin:0 auto;padding:24px}
        .policy-card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.4);backdrop-filter:blur(10px)}
        h1{margin:0 0 12px 0;color:#f9fafb}
        h2{margin:24px 0 8px 0;color:#f9fafb}
        p,li{color:#e5e7eb;line-height:1.8}
        .muted{color:#9ca3af}
        a{color:#93c5fd;text-decoration:underline}
    </style>
</head>
<body>
<?php include '../includes/header.php'; ?>
<div class="policy-container">
  <div class="policy-card">
    <h1>개인정보처리방침</h1>
    <p class="muted">시행일: 2025-08-25</p>

    <p>짭샵(이하 “회사”)은 이용자의 개인정보를 소중히 여기며, 개인정보 보호법 등 관련 법령을 준수합니다. 본 방침은 회사가 어떤 정보를 어떤 목적으로 처리하며, 안전하게 보호하기 위해 어떤 조치를 취하는지 설명합니다.</p>

    <h2>1. 수집하는 개인정보 항목</h2>
    <ul>
      <li>필수: 접속 IP, 쿠키, 브라우저가 제공하는 헤더정보(언어/기기 정보 등)</li>
      <li>선택: 이용자가 입력하는 닉네임, 게시글/댓글 내용, 연락처(구인구직 작성 시)</li>
    </ul>

    <h2>2. 개인정보의 수집 및 이용목적</h2>
    <ul>
      <li>서비스 제공 및 품질 향상: 언어/지역 자동 설정, 오류 분석, 사용성 개선</li>
      <li>커뮤니티/구인구직 기능 제공: 게시글·댓글 등록 및 관리, 게시물 노출</li>
      <li>통계 분석: 접속 빈도, 기능 이용 현황 분석(개인 개별 식별 없이)</li>
    </ul>

    <h2>3. 개인정보 보유 및 이용기간</h2>
    <p>법령에 특별한 규정이 있거나 이용자가 게시물을 삭제하기 전까지 서비스 제공을 위해 보유·이용합니다. 단, 서버 로그(IP 등)는 최대 6개월 보관 후 파기합니다.</p>

    <h2>4. 개인정보의 제3자 제공</h2>
    <p>회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다. 다만, 법령에 따른 요청, 수사기관의 적법한 절차에 의한 요청 시 예외로 제공될 수 있습니다.</p>

    <h2>5. 개인정보 처리의 위탁</h2>
    <p>현재 개인정보 처리 업무를 외부에 위탁하지 않습니다. 위탁이 필요해지는 경우, 위탁업무의 내용과 수탁사 정보를 본 방침에 추가 고지하고 필요한 경우 사전 동의를 받겠습니다.</p>

    <h2>6. 쿠키의 사용 및 거부</h2>
    <p>서비스 이용 편의와 통계 분석을 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저 설정에서 쿠키 저장을 거부할 수 있으며, 이 경우 일부 기능 이용에 제한이 있을 수 있습니다.</p>

    <h2>7. 이용자의 권리</h2>
    <p>이용자는 자신의 게시물/댓글에 대해 수정·삭제를 요청할 수 있습니다. 비회원 게시물의 경우 게시 시 설정한 비밀번호 확인 절차를 진행합니다.</p>

    <h2>8. 안전성 확보조치</h2>
    <ul>
      <li>접근 통제 및 최소권한 원칙 적용</li>
      <li>전송 구간 암호화(HTTPS) 권장</li>
      <li>로그 점검 및 이상 징후 모니터링</li>
    </ul>

    <h2>9. 개인정보 보호책임자</h2>
    <p>문의: sssultalk@gmail.com (개인정보 보호 관련 문의는 위 메일로 연락 주세요)</p>

    <h2>10. 고지의 의무</h2>
    <p>본 방침은 2025-08-25부터 적용됩니다. 내용 변경 시 웹사이트 공지사항 또는 본 페이지를 통해 고지합니다.</p>
  </div>
</div>
<?php include '../includes/footer.php'; ?>
</body>
</html>


