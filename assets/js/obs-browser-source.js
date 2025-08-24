// OBS 브라우저 소스 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 탭 전환 기능
    const tabs = document.querySelectorAll('.obs-tab');
    const contents = document.querySelectorAll('.obs-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // 모든 탭과 콘텐츠 비활성화
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // 선택된 탭과 콘텐츠 활성화
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // 초기 미리보기 설정
    updateDicePreview();

    // 이벤트 리스너 설정
    document.getElementById('dice-min').addEventListener('input', updateDicePreview);
    document.getElementById('dice-max').addEventListener('input', updateDicePreview);
});

// 주사위 미리보기 업데이트
function updateDicePreview() {
    const min = document.getElementById('dice-min').value;
    const max = document.getElementById('dice-max').value;

    // 팝업 URL 생성 (전역 변수로 저장) - 절대 경로 사용
    const params = new URLSearchParams({
        min: min,
        max: max
    });
    window.dicePopupUrl = `https://jjap.shop/obs-popup/popup-dice.html?${params.toString()}`;
}

// 팝업 주소 복사 함수
function copyPopupUrl(buttonElement) {
    if (!window.dicePopupUrl) {
        updateDicePreview(); // URL이 없으면 먼저 생성
    }
    
    navigator.clipboard.writeText(window.dicePopupUrl).then(function() {
        // 복사 성공 시 버튼 텍스트 변경
        const originalText = buttonElement.textContent;
        buttonElement.textContent = '✅ 복사됨!';
        buttonElement.style.background = '#28a745';
        
        // 2초 후 원래 텍스트로 복원
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
        }, 2000);
    }).catch(function(err) {
        // 복사 실패 시 알림
        alert('주소 복사에 실패했습니다. 수동으로 복사해주세요.');
        console.error('복사 실패:', err);
    });
}

// 주사위 굴리기 함수
function rollDice() {
    const min = parseInt(document.getElementById('dice-min').value);
    const max = parseInt(document.getElementById('dice-max').value);
    const dicePreview = document.getElementById('dice-preview');
    
    // 굴리는 애니메이션 시작
    dicePreview.classList.add('rolling');
    dicePreview.textContent = '🎲';
    
    // 2초 후 결과 표시
    setTimeout(() => {
        dicePreview.classList.remove('rolling');
        
        // 랜덤 결과 생성 (최소값과 최대값 포함)
        const randomResult = Math.floor(Math.random() * (max - min + 1)) + min;
        dicePreview.textContent = randomResult;
        
        // 3초 후 주사위 이모지로 복원
        setTimeout(() => {
            dicePreview.textContent = '🎲';
        }, 3000);
    }, 2000);
}


