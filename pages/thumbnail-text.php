<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>썸네일 텍스트 편집기 - JJAP.SHOP</title>
    
    <!-- 파비콘 설정 -->
            <link rel="icon" type="image/webp" sizes="16x16" href="../assets/images/jjapshoplogo.webp">
        <link rel="icon" type="image/webp" sizes="32x32" href="../assets/images/jjapshoplogo.webp">
        <link rel="icon" type="image/webp" sizes="48x48" href="../assets/images/jjapshoplogo.webp">
    
    <!-- Apple Touch Icon -->
            <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/jjapshoplogo.webp">
    
    <link rel="stylesheet" href="../assets/css/common.css">
    <link rel="stylesheet" href="../assets/css/thumbnail-text.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
    <?php include '../includes/header.php'; ?>

    <main class="thumbnail-editor">
        <div class="container">
            <h1 class="page-title">썸네일 텍스트 편집기</h1>
            <p class="page-description">유튜브 썸네일에 들어갈 텍스트를 예쁘게 꾸며서 PNG로 다운로드하세요!</p>

            <div class="editor-layout">
                <!-- 미리보기 영역 -->
                <div class="preview-panel">
                    <h2>미리보기</h2>
                    <div class="preview-container" id="preview-container">
                        <div id="text-preview" class="text-preview">
                            죄송합니다.
                        </div>
                    </div>
                    
                                         <!-- 프리뷰 배경색 설정 -->
                     <div class="preview-background-setting">
                         <label for="preview-bg-color">프리뷰 배경색:</label>
                         <div class="color-picker-wrapper">
                             <input type="color" id="preview-bg-color" value="#333333" class="color-picker">
                         </div>
                         
                         <!-- 텍스트 색상 -->
                         <div class="color-picker-wrapper">
                             <label for="text-color">텍스트 색상:</label>
                             <input type="color" id="text-color" value="#ffffff" class="color-picker">
                         </div>
                         
                         <!-- 아웃라인 색상 -->
                         <div class="color-picker-wrapper">
                             <label for="outline-color">아웃라인 색상:</label>
                             <input type="color" id="outline-color" value="#000000" class="color-picker">
                         </div>
                         
                         <!-- 아웃라인 두께 -->
                         <div class="outline-width-setting">
                             <label for="outline-width">아웃라인 두께: <span id="outline-width-value">3px</span></label>
                             <input type="range" id="outline-width" class="form-range" min="1" max="10" value="3">
                         </div>
                         
                         <!-- 폰트 크기 -->
                         <div class="font-size-setting">
                             <label for="font-size">폰트 크기: <span id="font-size-value">124px</span></label>
                             <input type="range" id="font-size" class="form-range" min="20" max="240" value="124">
                         </div>
                     </div>

                    <!-- 텍스트 입력 -->
                    <div class="setting-group">
                        <label for="text-input">텍스트 내용:</label>
                        <textarea id="text-input" class="form-control" placeholder="여기에 썸네일 텍스트를 입력하세요...&#10;Shift+Enter로 줄바꿈" rows="3">죄송합니다.</textarea>
                    </div>

                                         <!-- 폰트 설정 -->
                     <div class="setting-group">
                         <label for="font-family">폰트:</label>
                         <input type="text" id="font-family" class="form-control" placeholder="예: Arial, 나눔고딕, 맑은 고딕" value="맑은 고딕">
                         <small class="help-text">
                             💡 <strong>로컬 폰트 사용법:</strong><br>
                             • Windows: "맑은 고딕", "나눔고딕", "궁서체" 등<br>
                             • Mac: "AppleGothic", "Helvetica" 등<br>
                             • <strong>컴퓨터에 설치된 폰트 사용 가능합니다</strong><br>
                             • <strong>'SB어그로' 폰트를 추천합니다</strong> - <a href="https://sandbox.co.kr/font" target="_blank" rel="noopener noreferrer">https://sandbox.co.kr/font</a>
                         </small>
                     </div>
                     
                     <!-- 템플릿 고르기 -->
                     <div class="template-examples">
                         <h4>템플릿 고르기:</h4>
                         <div class="template-grid">
                             <div class="template-example" data-template="impact">
                                 <div class="example-preview template-impact">임팩트</div>
                                 <span>임팩트 스타일</span>
                             </div>
                             <div class="template-example" data-template="fire">
                                 <div class="example-preview template-fire">파이어</div>
                                 <span>파이어 글로우</span>
                             </div>
                             <div class="template-example" data-template="ice">
                                 <div class="example-preview template-ice">아이스</div>
                                 <span>아이스 글로우</span>
                             </div>
                             <div class="template-example" data-template="neon-purple">
                                 <div class="example-preview template-neon-purple">네온</div>
                                 <span>보라빛 네온</span>
                             </div>
                             <div class="template-example" data-template="neon-blue">
                                 <div class="example-preview template-neon-blue">네온</div>
                                 <span>파란빛 네온</span>
                             </div>
                             <div class="template-example" data-template="neon-green">
                                 <div class="example-preview template-neon-green">네온</div>
                                 <span>초록빛 네온</span>
                             </div>
                             <div class="template-example" data-template="3d-layered">
                                 <div class="example-preview template-3d-layered">3D</div>
                                 <span>3D 레이어드</span>
                             </div>
                             <div class="template-example" data-template="royal-metallic">
                                 <div class="example-preview template-royal-metallic">ROYAL</div>
                                 <span>로얄 메탈릭</span>
                             </div>
                             <div class="template-example" data-template="holographic-3d">
                                 <div class="example-preview template-holographic-3d">SHINE</div>
                                 <span>홀로그래픽 3D</span>
                             </div>
                             <div class="template-example" data-template="blood-drip">
                                 <div class="example-preview template-blood-drip">BLOOD</div>
                                 <span>피 떨어지는</span>
                             </div>

                         </div>
                     </div>

                </div>

                <!-- 설정 패널 -->
                <div class="settings-panel">
                    <h2>다운로드</h2>
                    
                    <!-- 다운로드 버튼 -->
                    <button id="download-btn" class="btn btn-primary">PNG 다운로드</button>
                </div>
            </div>
        </div>
    </main>

    <?php include '../includes/footer.php'; ?>
    <script src="../assets/js/thumbnail-text.js"></script>
</body>
</html>
