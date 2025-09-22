// 월급루팡 테스트 JavaScript
(function() {
    'use strict';
    
    // 테스트 데이터
    const testData = [
        {
            question: "오늘 아침, 출근길 엘리베이터에서 팀장님과 단둘이 마주쳤다면?",
            answers: [
                { text: "어색하게 웃으며 날씨 이야기를 꺼낸다.", score: 3 },
                { text: "못 본 척 폰만 보다가 내린다.", score: 1 },
                { text: '"팀장님! 좋은 아침입니다!" 목소리부터 기합이 넘친다.', score: 4 },
                { text: '"저... 팀장님께 드릴 말씀이 있는데..." 용건부터 꺼낸다.', score: 2 }
            ]
        },
        {
            question: "점심시간 10분 전, 팀장님이 급한 일을 시킨다면?",
            answers: [
                { text: '"점심 먹고 바로 할게요!"라고 웃으며 말한다.', score: 2 },
                { text: '"네!" 하고 바로 자리에 앉는다.', score: 4 },
                { text: '"이건 점심시간에 해야 하는 일인가?" 속으로 계산부터 한다.', score: 1 },
                { text: '"저... 죄송하지만 점심 약속이 있어서..."라고 변명한다.', score: 3 }
            ]
        },
        {
            question: "주말이 끝난 일요일 밤, 당신의 마음은?",
            answers: [
                { text: '"아... 월요일이 오는구나..." 한숨부터 나온다.', score: 1 },
                { text: '"내일 출근하면 무슨 일부터 하지?" 계획부터 세운다.', score: 4 },
                { text: '"밀린 빨래나 해야지..." 무념무상.', score: 2 },
                { text: '"아! 그 서류... 내일 아침 일찍 가서 해야겠다."', score: 3 }
            ]
        },
        {
            question: "팀 회의 중, 당신의 역할은?",
            answers: [
                { text: '"어... 저는..." 고민만 하다가 한마디도 못한다.', score: 2 },
                { text: '"저도 같은 생각입니다!" 동료의 의견에 무조건 동조한다.', score: 1 },
                { text: '핵심을 꿰뚫는 날카로운 질문을 던진다.', score: 3 },
                { text: '모두가 듣고 싶어 하는 의견을 정리해서 발표한다.', score: 4 }
            ]
        },
        {
            question: "일하다가 갑자기 피곤할 때, 당신의 행동은?",
            answers: [
                { text: '회사 화장실로 가서 10분간 쉰다.', score: 1 },
                { text: '탕비실에 가서 커피를 마시며 동료와 수다 떤다.', score: 2 },
                { text: '책상에서 간단하게 스트레칭한다.', score: 3 },
                { text: "'피곤은 사치!'라며 에너지 드링크를 꺼내 마신다.", score: 4 }
            ]
        },
        {
            question: "퇴근 시간 5분 전, 팀장님이 내일 일찍 나오자고 한다면?",
            answers: [
                { text: '"넵! 문제없습니다!"', score: 4 },
                { text: '"어... 제가 내일 아침에 일이 있어서요..."', score: 2 },
                { text: '"꼭 일찍 나와야 할까요? 오늘 끝낼 수는 없을까요?"', score: 3 },
                { text: '"아... 네..." 속으로는 울고 있다.', score: 1 }
            ]
        },
        {
            question: "퇴근 후, 업무용 메신저에서 '팀장님께서 보낸 메시지' 알림이 울린다면?",
            answers: [
                { text: "확인하지 않고 '읽씹'한다.", score: 1 },
                { text: "'확인'만 하고 답장은 내일 한다.", score: 2 },
                { text: "'급한 일인가?' 일단 확인하고, 필요하면 간단히 답장한다.", score: 3 },
                { text: '바로 전화해서 무슨 일인지 확인한다.', score: 4 }
            ]
        }
    ];
    
    // 결과 데이터
    const resultData = {
        'SSS': {
            title: '월급루팡',
            description: '당신은 진정한 월급루팡입니다! 회사와 개인의 완벽한 밸런스를 유지하며, 효율적으로 일하는 방법을 터득했네요. 👑',
            image: '/assets/images/test/salarylupine/SSS.png',
            scoreRange: '7-10점'
        },
        'A': {
            title: '프로 루팡러',
            description: '당신은 프로 루팡러입니다! 일과 개인 시간의 균형을 잘 맞추며, 똑똑하게 직장생활을 하고 있어요. 💎',
            image: '/assets/images/test/salarylupine/A.png',
            scoreRange: '11-14점'
        },
        'B': {
            title: '잠재적 루팡',
            description: '당신은 잠재적 루팡입니다! 조금만 더 요령을 부리면 완벽한 루팡러가 될 수 있어요. 💪',
            image: '/assets/images/test/salarylupine/B.png',
            scoreRange: '15-18점'
        },
        'C': {
            title: '일과 딴짓의 경계인',
            description: '당신은 일과 딴짓의 경계인입니다! 때로는 열심히, 때로는 여유롭게 직장생활을 하고 있네요. 🤔',
            image: '/assets/images/test/salarylupine/C.png',
            scoreRange: '19-22점'
        },
        'D': {
            title: '회사 친화적 노예',
            description: '당신은 회사 친화적 노예입니다! 회사에 너무 충실한 나머지 개인 시간을 잃고 있어요. 조금 더 여유를 가져보세요. 😅',
            image: '/assets/images/test/salarylupine/D.png',
            scoreRange: '23-24점'
        },
        'E': {
            title: '사내 미생',
            description: '당신은 사내 미생입니다! 아직 직장생활에 적응하는 중이거나, 너무 진지하게 임하고 있어요. 😰',
            image: '/assets/images/test/salarylupine/E.png',
            scoreRange: '25-26점'
        },
        'F': {
            title: '뼛속까지 노예',
            description: '당신은 뼛속까지 노예입니다! 회사가 당신의 전부가 되어버린 상태예요. 조금은 자신을 위한 시간을 가져보세요! 😱',
            image: '/assets/images/test/salarylupine/F.png',
            scoreRange: '27-28점'
        }
    };
    
    let currentQuestion = 0;
    let answers = [];
    let totalScore = 0;
    
    // 테스트 시작
    window.startTest = function() {
        document.querySelector('.intro-section').style.display = 'none';
        document.getElementById('testSection').style.display = 'block';
        showQuestion(0);
    };
    
    // 질문 표시
    function showQuestion(questionIndex) {
        const question = testData[questionIndex];
        const questionCard = document.getElementById('questionCard');
        
        // 질문 이미지 업데이트
        const questionImage = document.getElementById('questionImage');
        questionImage.src = `/assets/images/test/salarylupine/q${questionIndex + 1}.png`;
        questionImage.alt = `질문 ${questionIndex + 1} 이미지`;
        
        document.getElementById('questionNumber').textContent = `질문 ${questionIndex + 1}`;
        document.getElementById('questionText').textContent = question.question;
        
        const answersGrid = document.getElementById('answersGrid');
        answersGrid.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('div');
            answerElement.className = 'answer-option';
            answerElement.innerHTML = `
                <span class="answer-option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="answer-option-text">${answer.text}</span>
            `;
            
            answerElement.addEventListener('click', () => selectAnswer(index, answerElement));
            answersGrid.appendChild(answerElement);
        });
        
        // 진행률 업데이트
        updateProgress();
    }
    
    // 답변 선택 (자동 진행)
    function selectAnswer(answerIndex, element) {
        // 이미 답변을 선택했다면 중복 선택 방지
        if (answers[currentQuestion]) {
            return;
        }
        
        // 모든 답변 옵션 비활성화 (중복 선택 방지)
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
            opt.classList.remove('selected');
        });
        
        // 새 선택 적용
        element.classList.add('selected');
        
        // 답변 저장
        answers[currentQuestion] = {
            index: answerIndex,
            score: testData[currentQuestion].answers[answerIndex].score
        };
        
        // 선택 애니메이션을 보여준 후 자동으로 다음 단계 진행
        setTimeout(() => {
            if (currentQuestion < testData.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                // 마지막 질문이면 결과 표시
                showResult();
            }
        }, 1200); // 1.2초 후 자동 진행 (애니메이션 감상 시간)
    }
    
    // 진행률 업데이트
    function updateProgress() {
        const progress = ((currentQuestion + 1) / testData.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${currentQuestion + 1}/${testData.length}`;
    }
    
    // 자동 진행 시스템 - 버튼 네비게이션 제거됨
    // 답변 선택 시 자동으로 다음 단계로 진행
    
    // 점수 계산 및 등급 결정
    function calculateResult() {
        totalScore = answers.reduce((sum, answer) => sum + answer.score, 0);
        
        let grade;
        if (totalScore >= 7 && totalScore <= 10) grade = 'SSS';
        else if (totalScore >= 11 && totalScore <= 14) grade = 'A';
        else if (totalScore >= 15 && totalScore <= 18) grade = 'B';
        else if (totalScore >= 19 && totalScore <= 22) grade = 'C';
        else if (totalScore >= 23 && totalScore <= 24) grade = 'D';
        else if (totalScore >= 25 && totalScore <= 26) grade = 'E';
        else grade = 'F';
        
        return grade;
    }
    
    // 결과 표시
    function showResult() {
        const grade = calculateResult();
        const result = resultData[grade];
        
        // 섹션 전환
        document.getElementById('testSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'block';
        
        // 결과 카드 스타일 적용
        const resultCard = document.getElementById('resultCard');
        resultCard.className = `result-card grade-${grade}`;
        
        // 결과 정보 업데이트
        document.getElementById('cardScore').textContent = `${totalScore}/28점`;
        document.getElementById('resultImage').src = result.image;
        document.getElementById('resultImage').alt = result.title;
        document.getElementById('resultGrade').textContent = grade;
        document.getElementById('resultTitle').textContent = result.title;
        document.getElementById('resultDescription').textContent = result.description;
        document.getElementById('gradeValue').textContent = grade;
        document.getElementById('scoreValue').textContent = `${totalScore}/28`;
        
        // URL 업데이트 (공유용)
        const url = new URL(window.location);
        url.searchParams.set('result', grade);
        url.searchParams.set('score', totalScore);
        window.history.replaceState({}, '', url);
        
        // 카드 애니메이션
        setTimeout(() => {
            resultCard.style.transform = 'scale(1.05)';
            setTimeout(() => {
                resultCard.style.transform = 'scale(1)';
            }, 300);
        }, 100);
    }
    
    // 결과 공유 (링크 복사)
    window.shareResult = function() {
        const url = window.location.href;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                Swal.fire({
                    title: '링크 복사 완료! 📋',
                    text: '친구들과 함께 테스트 결과를 공유해보세요!',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#667eea',
                    background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
                    color: 'white'
                });
            }).catch(() => {
                fallbackCopyTextToClipboard(url);
            });
        } else {
            fallbackCopyTextToClipboard(url);
        }
    };
    
    // 클립보드 복사 폴백
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            Swal.fire({
                title: '링크 복사 완료! 📋',
                text: '친구들과 함께 테스트 결과를 공유해보세요!',
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#667eea',
                background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
                color: 'white'
            });
        } catch (err) {
            Swal.fire({
                title: '복사 실패',
                text: 'URL을 수동으로 복사해주세요: ' + text,
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: '#ff6b6b'
            });
        }
        
        document.body.removeChild(textArea);
    }
    
    // 결과 이미지 저장
    window.saveResultImage = function() {
        const resultCard = document.getElementById('resultCard');
        
        Swal.fire({
            title: '이미지 생성 중...',
            text: '잠시만 기다려주세요.',
            allowOutsideClick: false,
            showConfirmButton: false,
            background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
            color: 'white',
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // html2canvas 옵션
        const options = {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: null,
            width: resultCard.offsetWidth,
            height: resultCard.offsetHeight
        };
        
        html2canvas(resultCard, options).then(canvas => {
            // 캔버스를 이미지로 변환
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const grade = calculateResult();
                a.download = `월급루팡테스트_${grade}등급_${totalScore}점.png`;
                a.href = url;
                
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
                
                Swal.fire({
                    title: '이미지 저장 완료! 💾',
                    text: '결과 카드가 다운로드되었습니다.',
                    icon: 'success',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#667eea',
                    background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
                    color: 'white'
                });
            }, 'image/png');
        }).catch(error => {
            console.error('이미지 저장 오류:', error);
            Swal.fire({
                title: '저장 실패',
                text: '이미지 저장 중 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인',
                confirmButtonColor: '#ff6b6b'
            });
        });
    };
    
    // 테스트 다시하기
    window.retryTest = function() {
        // 초기화
        currentQuestion = 0;
        answers = [];
        totalScore = 0;
        
        // URL 정리
        const url = new URL(window.location);
        url.searchParams.delete('result');
        url.searchParams.delete('score');
        window.history.replaceState({}, '', url);
        
        // 화면 전환
        document.getElementById('resultSection').style.display = 'none';
        document.querySelector('.intro-section').style.display = 'block';
    };
    
    // 페이지 로드 시 URL 파라미터 확인 (공유 링크 지원)
    window.addEventListener('load', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const resultGrade = urlParams.get('result');
        const score = urlParams.get('score');
        
        if (resultGrade && score && resultData[resultGrade]) {
            // 공유된 결과 표시
            totalScore = parseInt(score);
            
            // 가짜 답변 데이터 생성 (점수만 맞춤)
            answers = testData.map(() => ({ score: Math.floor(totalScore / testData.length) }));
            
            showResult();
        }
    });
    
})();
