<?php
$page_title = 'OBS 브라우저 소스 - 짭샵';
$page_description = 'OBS 스트리밍을 위한 브라우저 소스 도구. 이미지+텍스트, 주사위, 사다리타기, 랜덤숫자 등을 설정하고 팝업으로 실행할 수 있습니다.';
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OBS 브라우저 소스 - 짭샵</title>
    
    <!-- 파비콘 -->
    <link rel="icon" type="image/x-icon" href="../assets/images/obs.webp">
    <link rel="shortcut icon" type="image/x-icon" href="../assets/images/obs.webp">
    <link rel="apple-touch-icon" href="../assets/images/obs.webp">
    
    <!-- SEO 메타 태그 -->
    <meta name="description" content="OBS 스트리밍을 위한 브라우저 소스 도구. 주사위 굴리기 등을 설정하고 팝업으로 실행할 수 있습니다.">
    <meta name="keywords" content="OBS, 브라우저소스, 스트리밍, 오버레이, 주사위">
    <meta name="author" content="짭샵">
    
    <!-- Open Graph 메타 태그 -->
    <meta property="og:title" content="OBS 브라우저 소스 - 짭샵">
    <meta property="og:description" content="OBS 스트리밍을 위한 브라우저 소스 도구. 주사위 굴리기 등을 설정하고 팝업으로 실행할 수 있습니다.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://jjap.shop/obs-browser-source">
    <meta property="og:image" content="https://jjap.shop/assets/images/obs.webp">
    
    <!-- 폰트 -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
    
    <!-- 공용 CSS -->
    <link rel="stylesheet" href="../assets/css/common.css">
    
    <!-- OBS 브라우저 소스 전용 CSS -->
    <link rel="stylesheet" href="../assets/css/obs-browser-source.css">
</head>
<body>
    <!-- 공용 헤더 -->
    <?php include_once '../includes/section-headers/creator-header.php'; ?>

    <div class="obs-container">
        <!-- 헤더 -->
        <div class="obs-header">
            <h1>🎮 OBS 브라우저 소스</h1>
            <p>OBS 스트리밍을 위한 주사위 굴리기 도구를 설정하고 팝업으로 실행하세요!</p>
        </div>

        <!-- 사용법 안내 -->
        <div class="instructions">
            <h4>📖 사용 방법</h4>
            <ol>
                <li>원하는 기능의 탭을 선택하세요</li>
                <li>설정값을 입력하고 미리보기를 확인하세요</li>
                <li>"팝업 주소 복사" 버튼을 클릭하여 설정된 내용의 팝업 주소를 복사하세요</li>
                <li>OBS에서 브라우저 소스를 추가하고 복사한 주소를 입력하세요</li>
            </ol>
        </div>

        <!-- 탭 네비게이션 -->
        <div class="obs-tabs">
            <button class="obs-tab active" data-tab="dice">🎲 주사위</button>
        </div>



        <!-- 주사위 탭 -->
        <div id="dice" class="obs-content active">
            <div class="obs-section">
                <h3>주사위 설정</h3>
                <div class="control-row">
                    <div class="control-group">
                        <label for="dice-min">최소값:</label>
                        <input type="number" id="dice-min" value="1" min="-999" max="999">
                        <small class="help-text">포함됩니다</small>
                    </div>
                    <div class="control-group">
                        <label for="dice-max">최대값:</label>
                        <input type="number" id="dice-max" value="6" min="-999" max="999">
                        <small class="help-text">포함됩니다</small>
                    </div>
                </div>
            </div>

            <div class="preview-section">
                <div class="preview-title">미리보기</div>
                <div class="preview-content">
                    <div class="dice-preview" id="dice-preview" style="font-size: 4rem;">🎲</div>
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn btn-primary" onclick="rollDice()">🎲 주사위 굴리기</button>
                <button class="btn btn-success" onclick="copyPopupUrl(this)">📋 팝업 주소 복사</button>
            </div>
        </div>


    </div>

    <!-- 공용 푸터 -->
    <?php include_once '../includes/footer.php'; ?>

    <!-- OBS 브라우저 소스 전용 JavaScript -->
    <script src="../assets/js/obs-browser-source.js"></script>
</body>
</html>


