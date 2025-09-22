<?php
/**
 * 공통 수평 광고 컴포넌트
 * Google AdSense 수평 광고
 */
?>

<!-- Google AdSense 수평 광고 -->
<div class="horizontal-ad-container">
    <div class="ad-wrapper">
        <!-- 수평광고반응형 -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-6901124389391205"
             data-ad-slot="9910389150"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
            // AdSense 강력한 안전 로딩
            (function() {
                const loadAd = () => {
                    const adContainer = document.querySelector('.horizontal-ad-container');
                    const adElement = document.querySelector('.adsbygoogle');
                    
                    if (!adContainer || !adElement) {
                        console.log('AdSense: 컨테이너를 찾을 수 없습니다.');
                        return;
                    }
                    
                    // 컨테이너 크기 확인 및 강제 설정
                    const containerRect = adContainer.getBoundingClientRect();
                    console.log('AdSense 컨테이너 크기:', containerRect);
                    
                    if (containerRect.width === 0) {
                        console.log('AdSense: 컨테이너 너비가 0입니다. 강제 크기 설정...');
                        adContainer.style.width = '100%';
                        adContainer.style.minWidth = '320px';
                        adContainer.style.display = 'block';
                        adContainer.style.visibility = 'visible';
                    }
                    
                    // AdSense 로드 시도
                    if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
                        try {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                            console.log('AdSense: 광고 로드 성공');
                        } catch (e) {
                            console.error('AdSense 로드 실패:', e);
                            // 실패 시 대체 처리
                            adContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.5); font-size: 0.9rem;">광고 로드 중...</div>';
                        }
                    } else {
                        console.log('AdSense: adsbygoogle 라이브러리가 준비되지 않았습니다.');
                        setTimeout(loadAd, 1000); // 1초 후 재시도
                    }
                };
                
                // 더 늦은 타이밍에 로드 (레이아웃 완전히 준비 후)
                if (document.readyState === 'complete') {
                    setTimeout(loadAd, 500);
                } else {
                    window.addEventListener('load', () => {
                        setTimeout(loadAd, 500);
                    });
                }
            })();
        </script>
    </div>
</div>

<style>
/* 수평 광고 스타일 - 강화 버전 */
.horizontal-ad-container {
    width: 100% !important;
    min-width: 320px !important; /* 최소 너비 보장 */
    max-width: 1200px !important;
    height: auto !important;
    margin: 2rem auto !important;
    padding: 1rem !important;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.05));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    display: block !important; /* 확실히 표시되도록 */
    visibility: visible !important;
    opacity: 1 !important;
    position: relative !important;
}

.horizontal-ad-container .ad-wrapper {
    width: 100% !important;
    max-width: 1200px !important;
    min-width: 320px !important; /* 최소 너비 보장 */
    margin: 0 auto !important;
    padding: 0 1rem !important;
    display: block !important; /* 확실히 표시되도록 */
    position: relative !important;
}

.horizontal-ad-container .adsbygoogle {
    width: 100% !important;
    min-width: 320px !important; /* AdSense 최소 권장 너비 */
    min-height: 100px !important; /* 최소 높이 설정 */
    max-height: 300px !important;
    border-radius: 8px;
    overflow: hidden;
    display: block !important; /* 인라인 블록 대신 블록 */
    visibility: visible !important;
    position: relative !important;
    background: rgba(255, 255, 255, 0.02) !important; /* 디버그용 배경 */
}

/* 반응형 */
@media (max-width: 768px) {
    .horizontal-ad-container {
        margin: 1rem 0;
        padding: 0.8rem 0;
    }
    
    .horizontal-ad-container .ad-wrapper {
        padding: 0 0.5rem;
    }
}
</style>
