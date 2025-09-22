// 썸네일 텍스트 편집기 JavaScript
document.addEventListener('DOMContentLoaded', function() {
         // DOM 요소들
     const textPreview = document.getElementById('text-preview');
     const textInput = document.getElementById('text-input');
     const fontFamily = document.getElementById('font-family');
     const fontSize = document.getElementById('font-size');
     const fontSizeValue = document.getElementById('font-size-value');
     const textColor = document.getElementById('text-color');
     const outlineColor = document.getElementById('outline-color');
     const outlineWidth = document.getElementById('outline-width');
     const outlineWidthValue = document.getElementById('outline-width-value');
     
     const downloadBtn = document.getElementById('download-btn');
     const previewBgColor = document.getElementById('preview-bg-color');
     const previewContainer = document.getElementById('preview-container');

     // 색상 피커 요소들
     const textColorPicker = document.getElementById('text-color');
     const outlineColorPicker = document.getElementById('outline-color');
     
     // 현재 적용된 템플릿 추적
     let currentTemplate = 'impact';

         // 템플릿 정의
     const templates = {
         impact: {
             fontWeight: '900',
             letterSpacing: '2px',
             textShadow: '4px 4px 0px rgba(0,0,0,0.8), 8px 8px 0px rgba(0,0,0,0.6)'
         },

         fire: {
             fontWeight: '900',
             textShadow: '0 0 10px rgba(255,69,0,0.8), 0 0 20px rgba(255,69,0,0.6), 0 0 30px rgba(255,69,0,0.4)'
         },
         ice: {
             fontWeight: '900',
             textShadow: '0 0 10px rgba(0,191,255,0.8), 0 0 20px rgba(0,191,255,0.6), 0 0 30px rgba(0,191,255,0.4)'
         },
         gold: {
             fontWeight: '900',
             textShadow: '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6), 0 0 20px rgba(255, 215, 0, 0.5)'
         },
         'neon-purple': {
             fontWeight: '900',
             textShadow: '0 0 5px rgba(255,0,255,0.8), 0 0 10px rgba(255,0,255,0.6), 0 0 15px rgba(255,0,255,0.4)'
         },
         'neon-blue': {
             fontWeight: '900',
             textShadow: '0 0 5px rgba(0,191,255,0.8), 0 0 10px rgba(0,191,255,0.6), 0 0 15px rgba(0,191,255,0.4)'
         },
         'neon-green': {
             fontWeight: '900',
             textShadow: '0 0 5px rgba(0,255,127,0.8), 0 0 10px rgba(0,255,127,0.6), 0 0 15px rgba(0,255,127,0.4)'
         },
                 '3d-layered': {
            fontWeight: '900',
            textShadow: '2px 2px 0px rgba(255, 182, 193, 0.8), 4px 4px 0px rgba(255, 105, 180, 0.8), 6px 6px 0px rgba(147, 0, 211, 0.8), 8px 8px 0px rgba(128, 0, 128, 0.8), 10px 10px 0px rgba(147, 0, 211, 0.6)'
        },
        'royal-metallic': {
            fontWeight: '900',
            textShadow: '2px 2px 4px rgba(0,0,0,0.9), 4px 4px 8px rgba(0,0,0,0.7), -2px -2px 4px rgba(255,255,255,0.4), -1px -1px 2px rgba(255,255,255,0.5), 2px 2px 4px rgba(0,0,0,0.6), 4px 4px 8px rgba(0,0,0,0.5), 0 0 8px rgba(192,192,192,0.4), 0 0 16px rgba(192,192,192,0.3), 0 0 24px rgba(192,192,192,0.2), -1px -1px 1px rgba(255,255,255,0.3), 1px 1px 1px rgba(0,0,0,0.4)'
        },
        'holographic-3d': {
            fontWeight: '900',
            textShadow: '2px 2px 0px #FF69B4, 4px 4px 0px #20B2AA, 6px 6px 0px #FF8C00, 8px 8px 0px #8A2BE2, 10px 10px 0px #00CED1, 12px 12px 0px #FF4500'
        },
        'blood-drip': {
            fontWeight: '900',
            textShadow: '2px 2px 4px rgba(139,0,0,0.9), 4px 4px 8px rgba(139,0,0,0.7), 6px 6px 12px rgba(139,0,0,0.5), 8px 8px 16px rgba(139,0,0,0.3), 10px 10px 20px rgba(139,0,0,0.2)'
        },

     };

    // HEX를 RGB로 변환하는 함수
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // 프리뷰 배경색 업데이트 함수
    function updatePreviewBackground() {
        const bgColor = previewBgColor.value;
        previewContainer.style.background = bgColor;

    }

    // 텍스트 업데이트 함수
    function updateText() {
        textPreview.textContent = textInput.value || '죄송합니다.';
    }

         // 폰트 스타일 업데이트 함수
     function updateFontStyle() {
         // 기본 스타일 적용
         textPreview.style.fontFamily = fontFamily.value;
         textPreview.style.fontSize = fontSize.value + 'px';
         
         // 현재 템플릿이 있으면 템플릿 스타일을 먼저 적용
         if (currentTemplate) {
             applyTemplateStyle(currentTemplate);
         }
         
         // 모든 템플릿에서 사용자 설정 아웃라인 적용
         if (currentTemplate) {
             applyOutlineToTemplate(currentTemplate);
         }
         
         // 폰트 크기 값 표시 업데이트
         fontSizeValue.textContent = fontSize.value + 'px';
         outlineWidthValue.textContent = outlineWidth.value + 'px';
     }

    // 기존 스타일을 초기화하는 함수
    function resetTextStyles() {
        textPreview.style.background = 'none';
        textPreview.style.webkitBackgroundClip = 'initial';
        textPreview.style.webkitTextFillColor = 'initial';
        textPreview.style.textShadow = 'none';
        textPreview.style.webkitTextStroke = 'initial';
        textPreview.style.textStroke = 'initial';
        textPreview.style.fontWeight = 'normal';
        textPreview.style.letterSpacing = 'normal';
    }

    // 템플릿별 고유 색상으로 사용자 설정 변경
    function updateTemplateColors(templateName) {
        const templateColors = {
            'impact': { text: '#ffffff', outline: '#000000' },
            'fire': { text: '#ff4500', outline: '#8b0000' },
            'ice': { text: '#ffffff', outline: '#87CEEB' },
            'neon-purple': { text: '#ff00ff', outline: '#4B0082' },
            'neon-blue': { text: '#00bfff', outline: '#000080' },
            'neon-green': { text: '#00ff7f', outline: '#006400' },
            '3d-layered': { text: '#FFB6C1', outline: '#FF69B4' },
            'royal-metallic': { text: '#000000', outline: '#FFD700' },
            'holographic-3d': { text: '#FFFFFF', outline: '#000000' },
            'blood-drip': { text: '#8B0000', outline: '#000000' }
        };
        
        const colors = templateColors[templateName];
        if (colors) {
            textColor.value = colors.text;
            outlineColor.value = colors.outline;
            
            // 템플릿별 기본 아웃라인 두께 설정
            if (templateName === 'impact' || templateName === 'fire') {
                // 임팩트, 파이어 글로우: 기본 아웃라인 3px
                outlineWidth.value = '3';
                outlineWidthValue.textContent = '3px';
            } else if (templateName === 'ice') {
                // 아이스 글로우: 기본 아웃라인 5px
                outlineWidth.value = '5';
                outlineWidthValue.textContent = '5px';
            } else if (templateName.startsWith('neon-')) {
                // 네온 템플릿: 기본 아웃라인 두께 1px
                outlineWidth.value = '1';
                outlineWidthValue.textContent = '1px';
            } else if (templateName === '3d-layered') {
                // 3D 레이어드: 기본 아웃라인 두께 3px
                outlineWidth.value = '3';
                outlineWidthValue.textContent = '3px';
            } else if (templateName === 'royal-metallic') {
                // 로얄 메탈릭: 기본 아웃라인 두께 4px
                outlineWidth.value = '4';
                outlineWidthValue.textContent = '4px';
            } else if (templateName === 'holographic-3d') {
                // 홀로그래픽 3D: 기본 아웃라인 두께 2px
                outlineWidth.value = '2';
                outlineWidthValue.textContent = '2px';
            } else if (templateName === 'blood-drip') {
                // 피 떨어지는: 기본 아웃라인 두께 3px
                outlineWidth.value = '3';
                outlineWidthValue.textContent = '3px';
            }
            
            // 색상 피커 UI 업데이트 (안전하게)
            if (textColorPicker) {
                textColorPicker.style.backgroundColor = colors.text;
            }
            if (outlineColorPicker) {
                outlineColorPicker.style.backgroundColor = colors.outline;
            }
        }
    }

    // 템플릿 스타일만 적용하는 함수 (사용자 설정과 분리)
    function applyTemplateStyle(templateName) {
        // 1단계: 모든 템플릿 스타일 완전 초기화
        textPreview.style.textShadow = 'none';
        textPreview.style.filter = 'none';
        textPreview.style.webkitTextFillColor = 'initial';
        
        // 2단계: 새로운 템플릿 스타일 적용
        if (templateName === 'impact') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            textPreview.style.letterSpacing = '2px';
            textPreview.style.textShadow = '4px 4px 0px rgba(0,0,0,0.8), 8px 8px 0px rgba(0,0,0,0.6)';
        } else if (templateName === 'fire') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            
            // 절제된 파이어 글로우 효과 + 이글거리는 뒷 레이어
            const fireGlow = [
                // 메인 그림자 (가독성)
                '2px 2px 4px rgba(0,0,0,0.8)',
                // 1차 글로우 (사용자 색상)
                '0 0 8px ' + textColor.value + '60',
                '0 0 16px ' + textColor.value + '50',
                '0 0 24px ' + textColor.value + '40',
                // 2차 글로우 (적당한 범위)
                '0 0 32px ' + textColor.value + '30',
                // 이글거리는 뒷 레이어 (절제된 패턴)
                '2px 2px 48px rgba(255, 69, 0, 0.3)',
                '-2px 1px 56px rgba(255, 69, 0, 0.25)',
                '1px -2px 64px rgba(255, 69, 0, 0.2)',
                '-1px 2px 72px rgba(255, 69, 0, 0.15)',
                '0px 3px 80px rgba(255, 69, 0, 0.1)'
            ].join(', ');
            
            textPreview.style.textShadow = fireGlow;
            textPreview.style.letterSpacing = '1px';
        } else if (templateName === 'ice') {
            textPreview.style.fontWeight = '900';
            // 사용자가 설정한 텍스트 색상 우선 적용
            textPreview.style.color = textColor.value;
            textPreview.style.webkitTextFillColor = textColor.value;
            // 사용자 색상을 기반으로 한 글로우 효과
            const userColor = textColor.value;
            const iceGlow = [
                '2px 2px 4px rgba(0,0,0,0.8)',
                `0 0 8px ${userColor}60`,
                `0 0 16px ${userColor}50`,
                `0 0 24px ${userColor}40`,
                `0 0 32px ${userColor}30`,
                `0 0 40px ${userColor}20`,
                // 한기가 서려있는 뒷 레이어 (연한 구름색)
                '2px 2px 48px rgba(209, 232, 255, 0.4)',
                '-2px 1px 56px rgba(209, 232, 255, 0.35)',
                '1px -2px 64px rgba(209, 232, 255, 0.3)',
                '-1px 2px 72px rgba(209, 232, 255, 0.25)',
                '0px 3px 80px rgba(209, 232, 255, 0.2)',
                '3px -1px 88px rgba(209, 232, 255, 0.15)',
                '-3px 2px 96px rgba(209, 232, 255, 0.1)'
            ].join(', ');
            textPreview.style.textShadow = iceGlow;
            textPreview.style.letterSpacing = '1px';
        } else if (templateName === 'neon-purple') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            textPreview.style.webkitTextFillColor = textColor.value; // 웹킷 브라우저 지원
            // 보라빛 네온 글로우 효과 (전체 텍스트용)
            const userColor = textColor.value;
            const neonPurpleGlow = [
                `0 0 8px ${userColor}60`,
                `0 0 16px ${userColor}40`,
                `0 0 24px ${userColor}30`,
                // 보라빛 네온 뒷 레이어 (전체 텍스트에 적용)
                '0 0 32px rgba(147, 0, 211, 0.4)',
                '0 0 40px rgba(147, 0, 211, 0.3)',
                '0 0 48px rgba(147, 0, 211, 0.2)'
            ].join(', ');
            textPreview.style.textShadow = neonPurpleGlow;
            textPreview.style.letterSpacing = '1px';
            // 전체 텍스트에 글로우 효과 적용
            textPreview.style.filter = 'drop-shadow(0 0 8px rgba(147, 0, 211, 0.3))';
        } else if (templateName === 'neon-blue') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            textPreview.style.webkitTextFillColor = textColor.value; // 웹킷 브라우저 지원
            // 파란빛 네온 글로우 효과 (전체 텍스트용)
            const userColor = textColor.value;
            const neonBlueGlow = [
                `0 0 8px ${userColor}60`,
                `0 0 16px ${userColor}40`,
                `0 0 24px ${userColor}30`,
                // 파란빛 네온 뒷 레이어 (전체 텍스트에 적용)
                '0 0 32px rgba(0, 191, 255, 0.4)',
                '0 0 40px rgba(0, 191, 255, 0.3)',
                '0 0 48px rgba(0, 191, 255, 0.2)'
            ].join(', ');
            textPreview.style.textShadow = neonBlueGlow;
            textPreview.style.letterSpacing = '1px';
            // 전체 텍스트에 글로우 효과 적용
            textPreview.style.filter = 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.3))';
        } else if (templateName === 'neon-green') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            textPreview.style.webkitTextFillColor = textColor.value; // 웹킷 브라우저 지원
            // 초록빛 네온 글로우 효과 (전체 텍스트용)
            const userColor = textColor.value;
            const neonGreenGlow = [
                `0 0 8px ${userColor}60`,
                `0 0 16px ${userColor}40`,
                `0 0 24px ${userColor}30`,
                // 초록빛 네온 뒷 레이어 (전체 텍스트에 적용)
                '0 0 32px rgba(0, 255, 127, 0.4)',
                '0 0 40px rgba(0, 255, 127, 0.3)',
                '0 0 48px rgba(0, 255, 127, 0.2)'
            ].join(', ');
            textPreview.style.textShadow = neonGreenGlow;
            textPreview.style.letterSpacing = '1px';
            // 전체 텍스트에 글로우 효과 적용
            textPreview.style.filter = 'drop-shadow(0 0 8px rgba(0, 255, 127, 0.3))';
        } else if (templateName === '3d-layered') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            textPreview.style.webkitTextFillColor = textColor.value; // 웹킷 브라우저 지원
            // 3D 레이어드 효과 (동적 색상 계산)
            const layerColors = calculate3DLayerColors(outlineColor.value);
            if (layerColors) {
                const threeDLayered = [
                    // 1단계: 가장 가까운 레이어 (사용자 색상)
                    `2px 2px 0px ${layerColors[0]}`,
                    // 2단계: 아웃라인 색상의 밝은 버전
                    `4px 4px 0px ${layerColors[1]}`,
                    // 3단계: 아웃라인 색상 (원본)
                    `6px 6px 0px ${layerColors[2]}`,
                    // 4단계: 아웃라인 색상의 어두운 버전
                    `8px 8px 0px ${layerColors[3]}`,
                    // 5단계: 아웃라인 색상의 더 어두운 버전
                    `10px 10px 0px ${layerColors[4]}`
                ].join(', ');
                textPreview.style.textShadow = threeDLayered;
            }
            textPreview.style.letterSpacing = '1px';
        } else if (templateName === 'royal-metallic') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            
            // 로얄 메탈릭 고급 효과 구현
            // 1. 사용자 색상 기반 메탈릭 그라데이션 배경
            const userColor = textColor.value;
            const userColorRgb = hexToRgb(userColor);
            
            if (userColorRgb) {
                // 사용자 색상을 기반으로 밝기 조정
                const lighter = `rgba(${Math.min(255, userColorRgb.r + 100)}, ${Math.min(255, userColorRgb.g + 100)}, ${Math.min(255, userColorRgb.b + 100)}, 1)`;
                const darker = `rgba(${Math.max(0, userColorRgb.r - 50)}, ${Math.max(0, userColorRgb.g - 50)}, ${Math.max(0, userColorRgb.b - 50)}, 1)`;
                
                textPreview.style.background = `linear-gradient(135deg, ${lighter} 0%, ${userColor} 25%, ${darker} 50%, ${userColor} 75%, ${lighter} 100%)`;
                textPreview.style.webkitBackgroundClip = 'text';
                textPreview.style.webkitTextFillColor = 'transparent';
                textPreview.style.backgroundClip = 'text';
            } else {
                // 기본 메탈릭 그라데이션 (fallback)
                textPreview.style.background = 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 25%, #A8A8A8 50%, #C0C0C0 75%, #E8E8E8 100%)';
                textPreview.style.webkitBackgroundClip = 'text';
                textPreview.style.webkitTextFillColor = 'transparent';
                textPreview.style.backgroundClip = 'text';
            }
            
            // 2. 고급 메탈릭 아웃라인과 글로우 효과 (사용자 색상 기반 동적 조정)
            const royalMetallicEffect = [
                // 메인 아웃라인 (깊이감 - 사용자 색상 기반)
                `2px 2px 3px ${userColor}80`,
                `4px 4px 6px ${userColor}60`,
                // 메탈릭 하이라이트 (위쪽 반사광 - 밝은 사용자 색상)
                `-1px -1px 2px ${userColor}90`,
                `-2px -2px 3px ${userColor}70`,
                // 메탈릭 반사광 (중앙 글로우 - 사용자 색상 기반)
                `0 0 6px ${userColor}50`,
                `0 0 12px ${userColor}30`,
                // 메탈릭 질감 (미세한 하이라이트 - 사용자 색상 기반)
                `-1px -1px 1px ${userColor}80`,
                `1px 1px 1px ${userColor}60`
            ].join(', ');
            
            textPreview.style.textShadow = royalMetallicEffect;
            textPreview.style.letterSpacing = '2px';
        } else if (templateName === 'holographic-3d') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            
            // 홀로그래픽 3D 고급 효과 구현
            // 1. 사용자 색상 우선 적용 (그라데이션 대신)
            textPreview.style.background = 'none';
            textPreview.style.webkitBackgroundClip = 'initial';
            textPreview.style.webkitTextFillColor = 'initial';
            textPreview.style.backgroundClip = 'initial';
            
            // 2. 사용자 선택 색상으로 직접 설정
            textPreview.style.color = textColor.value;
            
            // 2. 홀로그래픽 3D 레이어 효과 (3원색 진함 + 자연스러운 쉐도우 분산)
            const holographicColors = calculateHolographicColors(outlineColor.value);
            
            if (holographicColors) {
                // 홀로그램 색상 계산을 기반으로 3D 레이어 효과 생성 (자연스러운 쉐도우 분산)
                const holographic3DEffect = [
                    // 1단계: 가장 가까운 레이어 (원본 아웃라인 색상)
                    `2px 2px 0px ${holographicColors[0]}`,
                    // 2단계: 진한 빨간색 (R 채널 강화) - 우측하단
                    `4px 4px 0px ${holographicColors[1]}`,
                    // 3단계: 진한 파란색 (B 채널 강화) - 우측
                    `6px 2px 0px ${holographicColors[2]}`,
                    // 4단계: 진한 초록색 (G 채널 강화) - 하단
                    `2px 6px 0px ${holographicColors[3]}`,
                    // 5단계: 진한 노란색 (R+G 채널 강화) - 대각선
                    `8px 8px 0px ${holographicColors[4]}`,
                    // 6단계: 추가 분산 쉐도우들
                    `3px 5px 0px ${holographicColors[1]}`,
                    `5px 3px 0px ${holographicColors[2]}`,
                    `7px 1px 0px ${holographicColors[3]}`,
                    `1px 7px 0px ${holographicColors[4]}`
                ].join(', ');
                
                textPreview.style.textShadow = holographic3DEffect;
            } else {
                // 기본 홀로그래픽 3D 레이어 효과 (3원색 진함 + 자연스러운 쉐도우 분산)
                const defaultHolographic3DEffect = [
                    '2px 2px 0px #87CEEB',    // 원본 하늘색
                    '4px 4px 0px #FF0000',    // 진한 빨간색
                    '6px 2px 0px #0000FF',    // 진한 파란색
                    '2px 6px 0px #00FF00',    // 진한 초록색
                    '8px 8px 0px #FFE135',    // 연한 노란색
                    '3px 5px 0px #FF0000',    // 추가 빨간색
                    '5px 3px 0px #0000FF',    // 추가 파란색
                    '7px 1px 0px #00FF00',    // 추가 초록색
                    '1px 7px 0px #FFE135'     // 추가 연한 노란색
                ].join(', ');
                
                textPreview.style.textShadow = defaultHolographic3DEffect;
            }
            textPreview.style.letterSpacing = '1px';
        } else if (templateName === 'blood-drip') {
            textPreview.style.fontWeight = '900';
            textPreview.style.color = textColor.value; // 사용자 색상 사용
            
            // 호러틱한 피 떨어지는 효과 구현 - 이중 텍스트 레이어로 가독성 향상
            // 1. 사용자 색상 우선 적용 (그라데이션 대신)
            textPreview.style.background = 'none';
            textPreview.style.webkitBackgroundClip = 'initial';
            textPreview.style.webkitTextFillColor = 'initial';
            textPreview.style.backgroundClip = 'initial';
            
            // 2. 사용자 선택 색상으로 직접 설정
            textPreview.style.color = textColor.value;
            
            // 3. 피 떨어지는 효과 (사용자 색상 기반) - 이중 텍스트 레이어
            const userColor = textColor.value;
            const userColorRgb = hexToRgb(userColor);
            
            if (userColorRgb) {
                // 아웃라인 우선순위 강화 + 피 떨어지는 효과 정리
                const bloodDripEffect = [
                    // 1단계: 아웃라인 강조 (가장 위에, 100% 불투명)
                    `0px 0px 0px ${outlineColor.value}`,
                    `0px 0px 1px ${outlineColor.value}`,
                    `0px 0px 2px ${outlineColor.value}`,
                    `0px 0px 3px ${outlineColor.value}`,
                    `0px 0px 4px ${outlineColor.value}`,
                    `0px 0px 5px ${outlineColor.value}`,
                    // 2단계: 메인 텍스트 (아웃라인 위에, 100% 불투명)
                    `0px 0px 0px ${userColor}`,
                    `0px 0px 1px ${userColor}`,
                    `0px 0px 2px ${userColor}`,
                    // 3단계: 메인 그림자 (깊이감)
                    `2px 2px 4px ${userColor}`,
                    `4px 4px 8px ${userColor}`,
                    // 4단계: 피 떨어지는 효과 (깔끔하게 정리, 세로 방향만)
                    `0px 8px 12px rgba(${userColorRgb.r}, ${userColorRgb.g}, ${userColorRgb.b}, 0.8)`,
                    `0px 16px 20px rgba(${userColorRgb.r}, ${userColorRgb.g}, ${userColorRgb.b}, 0.6)`,
                    `0px 24px 28px rgba(${userColorRgb.r}, ${userColorRgb.g}, ${userColorRgb.b}, 0.4)`,
                    `0px 32px 36px rgba(${userColorRgb.r}, ${userColorRgb.g}, ${userColorRgb.b}, 0.3)`,
                    `0px 40px 44px rgba(${userColorRgb.r}, ${userColorRgb.g}, ${userColorRgb.b}, 0.2)`
                ].join(', ');
                
                textPreview.style.textShadow = bloodDripEffect;
            } else {
                // 기본 피 떨어지는 효과 (fallback - 아웃라인 우선순위 강화)
                const defaultBloodDripEffect = [
                    // 1단계: 아웃라인 강조 (가장 위에, 100% 불투명)
                    '0px 0px 0px rgba(0,0,0,1)',
                    '0px 0px 1px rgba(0,0,0,1)',
                    '0px 0px 2px rgba(0,0,0,1)',
                    '0px 0px 3px rgba(0,0,0,1)',
                    '0px 0px 4px rgba(0,0,0,1)',
                    '0px 0px 5px rgba(0,0,0,1)',
                    // 2단계: 메인 텍스트 (아웃라인 위에, 100% 불투명)
                    '0px 0px 0px rgba(139,0,0,1)',
                    '0px 0px 1px rgba(139,0,0,1)',
                    '0px 0px 2px rgba(139,0,0,1)',
                    // 3단계: 메인 그림자 (깊이감)
                    '2px 2px 4px rgba(139,0,0,0.9)',
                    '4px 4px 8px rgba(139,0,0,0.7)',
                    // 4단계: 피 떨어지는 효과 (깔끔하게 정리, 세로 방향만)
                    '0px 8px 12px rgba(139,0,0,0.8)',
                    '0px 16px 20px rgba(139,0,0,0.6)',
                    '0px 24px 28px rgba(139,0,0,0.4)',
                    '0px 32px 36px rgba(139,0,0,0.3)',
                    '0px 40px 44px rgba(139,0,0,0.2)'
                ].join(', ');
                
                textPreview.style.textShadow = defaultBloodDripEffect;
            }
            textPreview.style.letterSpacing = '1px';
        }
        
        // 모든 템플릿에 아웃라인 적용
        if (templateName) {
            applyOutlineToTemplate(templateName);
        }
    }
    
    // 홀로그래픽 3D 템플릿의 홀로그램 색상 계산 함수 (3원색 진함 강조)
    function calculateHolographicColors(outlineColor) {
        // 아웃라인 색상을 RGB로 변환
        const rgb = hexToRgb(outlineColor);
        if (!rgb) return null;
        
        // 홀로그램의 핵심: 3원색의 진함을 강조하면서 불투명한 색상
        // 각 레이어마다 RGB 채널을 독립적으로 강화하여 색상 분리 현상 구현
        
        // 1단계: 가장 가까운 레이어 (원본 아웃라인 색상)
        const layer1 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
        
        // 2단계: 진한 빨간색 (R 채널 강화)
        const layer2 = `rgba(255, 0, 0, 0.95)`;
        
        // 3단계: 진한 파란색 (B 채널 강화)
        const layer3 = `rgba(0, 0, 255, 0.9)`;
        
        // 4단계: 진한 초록색 (G 채널 강화)
        const layer4 = `rgba(0, 255, 0, 0.85)`;
        
        // 5단계: 연한 노란색 (R+G 채널 강화)
        const layer5 = `rgba(255, 225, 53, 0.8)`;
        
        return [layer1, layer2, layer3, layer4, layer5];
    }

    // 3D 레이어드 템플릿의 동적 색상 계산 함수
    function calculate3DLayerColors(outlineColor) {
        // 아웃라인 색상을 RGB로 변환
        const rgb = hexToRgb(outlineColor);
        if (!rgb) return null;
        
        // 1단계: 가장 가까운 레이어 (사용자 텍스트 색상 유지)
        const layer1 = textColor.value;
        
        // 2단계: 아웃라인 색상의 밝은 버전 (1.5배 밝게)
        const layer2 = `rgba(${Math.min(255, rgb.r * 1.5)}, ${Math.min(255, rgb.g * 1.5)}, ${Math.min(255, rgb.b * 1.5)}, 0.8)`;
        
        // 3단계: 아웃라인 색상 (원본)
        const layer3 = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`;
        
        // 4단계: 아웃라인 색상의 어두운 버전 (0.7배 어둡게)
        const layer4 = `rgba(${Math.max(0, rgb.r * 0.7)}, ${Math.max(0, rgb.g * 0.7)}, ${Math.max(0, rgb.b * 0.7)}, 0.8)`;
        
        // 5단계: 아웃라인 색상의 더 어두운 버전 (0.5배 어둡게)
        const layer5 = `rgba(${Math.max(0, rgb.r * 0.5)}, ${Math.max(0, rgb.g * 0.5)}, ${Math.max(0, rgb.b * 0.5)}, 0.6)`;
        
        return [layer1, layer2, layer3, layer4, layer5];
    }

    // 템플릿에 아웃라인을 적용하는 함수
    function applyOutlineToTemplate(templateName) {
        const outlineShadows = [];
          const outlineWidthPx = outlineWidth.value;
          const outlineColorHex = outlineColor.value;
          
        // 아웃라인 두께가 0보다 클 때만 아웃라인 생성
        if (outlineWidthPx > 0) {
            // 부드러운 아웃라인 생성 (계단현상 최소화)
          for (let i = 1; i <= outlineWidthPx; i++) {
                // 16방향으로 더 부드러운 커버리지
                const angle = (Math.PI * 2) / 16;
                for (let j = 0; j < 16; j++) {
                    const x = Math.cos(angle * j) * i;
                    const y = Math.sin(angle * j) * i;
                    outlineShadows.push(`${x.toFixed(1)}px ${y.toFixed(1)}px 0px ${outlineColorHex}`);
                }
                
                // 중간 거리로 추가 부드러움
              if (i > 1) {
                    const mid = i * 0.5;
                    for (let j = 0; j < 8; j++) {
                        const angle = (Math.PI * 2) / 8;
                        const x = Math.cos(angle * j) * mid;
                        const y = Math.sin(angle * j) * mid;
                        outlineShadows.push(`${x.toFixed(1)}px ${y.toFixed(1)}px 0px ${outlineColorHex}`);
                    }
              }
          }
          
          // 블러 효과로 계단현상 완전 제거
            const blurAmount = Math.max(2, Math.ceil(outlineWidthPx * 0.6));
          outlineShadows.push(`0px 0px ${blurAmount}px ${outlineColorHex}`);
          
            // 추가 블러 레이어로 부드러움 향상
            if (outlineWidthPx > 2) {
                outlineShadows.push(`0px 0px ${blurAmount * 1.5}px ${outlineColorHex}40`);
            }
        }
        
        // 기존 textShadow에 아웃라인 추가
        const currentTextShadow = textPreview.style.textShadow;
        if (currentTextShadow && currentTextShadow !== 'none' && outlineShadows.length > 0) {
            textPreview.style.textShadow = currentTextShadow + ', ' + outlineShadows.join(', ');
        } else if (outlineShadows.length > 0) {
          textPreview.style.textShadow = outlineShadows.join(', ');
        }
     }

    // 템플릿 적용 함수
    function applyTemplate(templateName) {
        const template = templates[templateName];
        
        if (template) {
            // 현재 템플릿 저장
            currentTemplate = templateName;
            // 프리뷰 컨테이너의 현재 배경색 저장
            const currentBgColor = previewContainer.style.background;
            
            // 기존 템플릿 클래스 제거
            textPreview.className = 'text-preview';
            
            // 기존 스타일 완전 초기화
            resetTextStyles();
            
            // 추가 스타일 초기화 (템플릿 잔향 효과 완전 제거)
            textPreview.style.textShadow = 'none';
            textPreview.style.filter = 'none';
            textPreview.style.webkitTextFillColor = 'initial';
            textPreview.style.color = textColor.value; // 기본 색상으로 초기화
            
            // 기본 텍스트 스타일 설정
              textPreview.style.fontFamily = fontFamily.value;
              textPreview.style.fontSize = fontSize.value + 'px';
            
            // 템플릿별 고유 색상으로 사용자 설정 변경
            updateTemplateColors(templateName);
            
            // 프리뷰 컨테이너의 배경색 복원
            previewContainer.style.background = currentBgColor;
            
                        // 템플릿 스타일 적용 (아웃라인 포함)
            applyTemplateStyle(templateName);
            
            // 템플릿 클래스 추가
            textPreview.classList.add(`template-${templateName}`);
            
            // 폰트 크기 값 표시 업데이트
            fontSizeValue.textContent = fontSize.value + 'px';
            

        }
    }

                // PNG 다운로드 함수 - 원래 방식으로 복구
    function downloadPNG() {
        // 다운로드 버튼 비활성화
        downloadBtn.disabled = true;
        downloadBtn.textContent = '생성 중...';
        
        try {
            // 1단계: 텍스트 요소를 별도 컨테이너로 복제
            const textClone = textPreview.cloneNode(true);
            textClone.id = 'text-clone-for-download';
            
            // 2단계: 복제된 텍스트를 body에 임시 추가 (레이아웃 제약 없음)
            document.body.appendChild(textClone);
            
            // 3단계: 복제된 텍스트 스타일 설정
            textClone.style.cssText = `
                position: absolute;
                left: -9999px;
                top: -9999px;
                background: transparent;
                border: none;
                border-radius: 0;
                margin: 0;
                padding: 2rem 2.5rem;
                z-index: -9999;
                white-space: nowrap;
                overflow: visible;
                max-width: none;
                min-width: max-content;
            `;
            
            // 4단계: 모든 스타일 복사 (글로우 효과 포함)
            const computedStyle = window.getComputedStyle(textPreview);
            
            // 템플릿 클래스 강제 적용
            const currentTemplate = textPreview.className.match(/template-\w+/);
            if (currentTemplate) {
                textClone.className = currentTemplate[0];
            }
            
            // 스타일 속성 복사
            textClone.style.textShadow = computedStyle.textShadow;
            textClone.style.filter = computedStyle.filter;
            textClone.style.color = computedStyle.color;
            textClone.style.fontSize = computedStyle.fontSize;
            textClone.style.fontFamily = computedStyle.fontFamily;
            textClone.style.fontWeight = computedStyle.fontWeight;
            textClone.style.letterSpacing = computedStyle.letterSpacing;
            textClone.style.webkitTextFillColor = computedStyle.webkitTextFillColor;
            
            // 5단계: 글로우 효과를 포함한 실제 크기 계산
            const textRect = textClone.getBoundingClientRect();
            const textWidth = textRect.width;
            const textHeight = textRect.height;
            
            // 글로우 효과 거리 계산
            let maxGlowDistance = 0;
            const textShadow = computedStyle.textShadow;
            if (textShadow && textShadow !== 'none') {
                const shadowValues = textShadow.split(',').map(s => s.trim());
                shadowValues.forEach(shadow => {
                    const parts = shadow.split(' ');
                    if (parts.length >= 4) {
                        const blurRadius = parseInt(parts[2]);
                        if (!isNaN(blurRadius) && blurRadius > maxGlowDistance) {
                            maxGlowDistance = blurRadius;
                        }
                    }
                });
            }
            
                         // 6단계: 캡처할 캔버스 크기 계산 (균형잡힌 크기)
             const padding = Math.max(maxGlowDistance * 2, 200); // 글로우 범위 적절히 설정
             const extraPadding = 100; // 적절한 여백
             const canvasWidth = textWidth + padding + extraPadding;
             const canvasHeight = textHeight + padding + extraPadding;
            
            // 7단계: 복제된 텍스트를 중앙에 배치 (정확한 위치 계산)
            const leftPosition = (padding / 2) + (extraPadding / 2);
            const topPosition = (padding / 2) + (extraPadding / 2);
            
            // 디버깅: Canvas 크기 확인
            
            textClone.style.left = leftPosition + 'px';
            textClone.style.top = topPosition + 'px';
            
                         // 8단계: html2canvas로 텍스트만 캡처 (균형잡힌 크기)
             html2canvas(textClone, {
            backgroundColor: null,
                 scale: 2, // 적절한 해상도
            useCORS: true,
                 allowTaint: true,
                 logging: false,
                 width: canvasWidth,
                 height: canvasHeight,
                onclone: function(clonedDoc) {
                    const clonedText = clonedDoc.querySelector('#text-clone-for-download');
                    if (clonedText) {
                        // 텍스트를 캔버스 중앙에 정확히 배치
                        clonedText.style.position = 'absolute';
                        clonedText.style.left = leftPosition + 'px';
                        clonedText.style.top = topPosition + 'px';
                        clonedText.style.transform = 'none';
                        clonedText.style.background = 'transparent';
                        clonedText.style.border = 'none';
                        clonedText.style.boxShadow = 'none';
                        
                        // 텍스트가 잘리지 않도록 추가 설정
                        clonedText.style.overflow = 'visible';
                        clonedText.style.whiteSpace = 'nowrap';
                        clonedText.style.maxWidth = 'none';
                        clonedText.style.minWidth = 'max-content';
                        
                        // 템플릿 클래스 스타일 보존 확인
                    }
                }
        }).then(canvas => {
                // 9단계: PNG 다운로드
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `thumbnail-text-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                    
                    // 10단계: 정리 작업
                    cleanupDownload();
                    
                    // 버튼 복원
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'PNG 다운로드';
                    
                    // 성공 메시지
                    showNotification(`고품질 PNG 파일이 다운로드되었습니다! (${Math.round(canvas.width)}x${Math.round(canvas.height)}px)`, 'success');
                }, 'image/png', 1.0);
                
            }).catch(error => {
                console.error('이미지 생성 오류:', error);
                showNotification('이미지 생성 중 오류가 발생했습니다.', 'error');
                
                // 오류 발생 시에도 정리 작업
                cleanupDownload();
                
                // 버튼 복원
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'PNG 다운로드';
            });
            
        } catch (error) {
            console.error('Canvas 생성 오류:', error);
            showNotification('이미지 생성 중 오류가 발생했습니다.', 'error');
            
            // 버튼 복원
            downloadBtn.disabled = false;
            downloadBtn.textContent = 'PNG 다운로드';
        }
    }
     
     // 다운로드 후 정리 작업 함수
     function cleanupDownload() {
         const textClone = document.getElementById('text-clone-for-download');
         if (textClone) {
             document.body.removeChild(textClone);
         }
    }

    // 알림 표시 함수
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 스타일 적용
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        if (type === 'success') {
            notification.style.background = '#4caf50';
        } else if (type === 'error') {
            notification.style.background = '#f44336';
        } else {
            notification.style.background = '#2196f3';
        }
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // CSS 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

         // 이벤트 리스너 등록
     textInput.addEventListener('input', updateText);
     
     // Shift+Enter 줄바꿈 처리
     textInput.addEventListener('keydown', function(e) {
         if (e.key === 'Enter' && e.shiftKey) {
             // Shift+Enter: 줄바꿈 허용
             return;
         } else if (e.key === 'Enter') {
             // Enter만: 기본 동작 방지 (줄바꿈 없음)
             e.preventDefault();
         }
     });
     
     fontFamily.addEventListener('input', updateFontStyle);
     fontSize.addEventListener('input', updateFontStyle);
     textColor.addEventListener('input', updateFontStyle);
     outlineColor.addEventListener('input', updateFontStyle);
     outlineWidth.addEventListener('input', updateFontStyle);
     downloadBtn.addEventListener('click', downloadPNG);

         // 템플릿 예시 클릭 이벤트
     document.querySelectorAll('.template-example').forEach(example => {
         example.addEventListener('click', function() {
             const templateName = this.getAttribute('data-template');
             applyTemplate(templateName);
             
             // 템플릿 적용 후 즉시 폰트 스타일 업데이트로 렌더링
             updateFontStyle();
             
             // 선택된 템플릿 하이라이트
             document.querySelectorAll('.template-example').forEach(ex => {
                 ex.classList.remove('selected');
                 ex.style.opacity = '0.7';
             });
             this.classList.add('selected');
             this.style.opacity = '1';
         });
     });

              // 초기 템플릿 적용
     applyTemplate('impact');
     
     // 초기 텍스트 설정
     updateText();
     
     // 초기 텍스트 색상과 아웃라인 적용
     updateFontStyle();
     
     // 초기 템플릿 선택 상태 설정
     const initialTemplate = document.querySelector('.template-example[data-template="impact"]');
     if (initialTemplate) {
         initialTemplate.style.opacity = '1';
         initialTemplate.classList.add('selected');
     }



    // 프리뷰 배경색 변경 이벤트
    previewBgColor.addEventListener('input', updatePreviewBackground);
    
    // 텍스트 색상 변경 시 템플릿 스타일 재적용
    textColor.addEventListener('input', function() {
        if (currentTemplate) {
            applyTemplateStyle(currentTemplate);
        }
    });
    
    // 아웃라인 색상 변경 시 템플릿 스타일 재적용
    outlineColor.addEventListener('input', function() {
        if (currentTemplate) {
            // 3D 레이어드 템플릿의 경우 동적 색상 계산으로 즉시 업데이트
            if (currentTemplate === '3d-layered') {
                const layerColors = calculate3DLayerColors(outlineColor.value);
                if (layerColors) {
                    const threeDLayered = [
                        `2px 2px 0px ${layerColors[0]}`,
                        `4px 4px 0px ${layerColors[1]}`,
                        `6px 6px 0px ${layerColors[2]}`,
                        `8px 8px 0px ${layerColors[3]}`,
                        `10px 10px 0px ${layerColors[4]}`
                    ].join(', ');
                    textPreview.style.textShadow = threeDLayered;
                }
            } else {
                applyTemplateStyle(currentTemplate);
            }
        }
    });

    // 폰트 크기 변경 시 템플릿 스타일 재적용
    fontSize.addEventListener('input', function() {
        if (currentTemplate) {
            applyTemplateStyle(currentTemplate);
        }
    });
    
    // 아웃라인 두께 변경 시 템플릿 스타일 재적용
    outlineWidth.addEventListener('input', function() {
        if (currentTemplate) {
            applyTemplateStyle(currentTemplate);
        }
    });

    // 폰트 미리보기 기능 (폰트 입력 시 실시간 적용)
    fontFamily.addEventListener('blur', function() {
        // 폰트가 로드되었는지 확인
        const testElement = document.createElement('span');
        testElement.style.fontFamily = fontFamily.value;
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        testElement.textContent = 'Test';
        document.body.appendChild(testElement);
        
        const originalFont = testElement.style.fontFamily;
        testElement.style.fontFamily = 'Arial';
        const fallbackFont = testElement.style.fontFamily;
        
        document.body.removeChild(testElement);
        
        if (originalFont !== fallbackFont) {
            showNotification(`폰트 "${fontFamily.value}"가 적용되었습니다!`, 'success');
        } else {
            showNotification(`폰트 "${fontFamily.value}"를 찾을 수 없습니다. 기본 폰트가 사용됩니다.`, 'error');
        }
    });

    // 드래그 앤 드롭으로 텍스트 위치 조정 (선택사항)
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    textPreview.addEventListener('mousedown', function(e) {
        if (e.target === textPreview) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(textPreview.style.left) || 0;
            startTop = parseInt(textPreview.style.top) || 0;
            textPreview.style.cursor = 'grabbing';
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            textPreview.style.left = (startLeft + deltaX) + 'px';
            textPreview.style.top = (startTop + deltaY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            textPreview.style.cursor = 'grab';
        }
    });

    // 초기 설정
    textPreview.style.position = 'relative';
    textPreview.style.cursor = 'grab';
    
    // 초기 폰트 크기 설정 (124px)
    textPreview.style.fontSize = '124px';
    fontSizeValue.textContent = '124px';
    
    // 초기 프리뷰 배경색 설정
    updatePreviewBackground();
});
