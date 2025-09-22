<?php 
$page_title = '크리에이터 도구 모음 - 썸네일, OBS, 카카오톡 꾸미기 | 짭샵';
$page_description = '유튜버, 스트리머를 위한 필수 크리에이터 도구들! 썸네일 텍스트 생성기, OBS 브라우저 소스, 카카오톡 채팅방 꾸미기, 커뮤니티, 구인구직까지 모든 것을 무료로 이용하세요.';
$page_keywords = '크리에이터 도구, 유튜버 도구, 스트리머 도구, 썸네일 생성기, OBS 브라우저소스, 카카오톡 꾸미기, 유튜브 커뮤니티, 크리에이터 구인구직, 짭샵, jjap.shop';
$canonical_url = 'https://jjap.shop/creator';
?>

<?php include_once '../includes/section-headers/creator-header.php'; ?>

<div class="creator-container">
    <div class="creator-hero">
        <div class="hero-content">
            <h1 class="hero-title">🎨 크리에이터 도구 모음</h1>
            <p class="hero-subtitle">유튜버, 스트리머, 콘텐츠 크리에이터를 위한 필수 도구</p>
            <p class="hero-description">썸네일부터 커뮤니티까지, 콘텐츠 제작에 필요한 모든 것을 무료로 이용하세요!</p>
        </div>
    </div>

    <div class="creator-content">
        <div class="tools-grid">
            <div class="tool-card" onclick="location.href='/creator/kakao-chat'">
                <div class="tool-icon">💬</div>
                <h3 class="tool-title">카카오톡 대화 만들기</h3>
                <p class="tool-description">실제와 같은 카카오톡 채팅창을 만들어 재미있는 대화를 연출하세요</p>
                <div class="tool-badge">인기</div>
            </div>
            
            <div class="tool-card" onclick="location.href='/creator/thumbnail-text'">
                <div class="tool-icon">🖼️</div>
                <h3 class="tool-title">썸네일 텍스트 편집기</h3>
                <p class="tool-description">유튜브 썸네일에 들어갈 텍스트를 예쁘게 꾸며 PNG로 다운로드하세요</p>
                <div class="tool-badge">필수</div>
            </div>
            
            <div class="tool-card" onclick="location.href='/creator/obs-browser-source'">
                <div class="tool-icon">🖥️</div>
                <h3 class="tool-title">OBS 브라우저 소스</h3>
                <p class="tool-description">스트리밍을 위한 다양한 오버레이와 브라우저 소스를 제공합니다</p>
                <div class="tool-badge">스트리머</div>
            </div>
            
            <div class="tool-card" onclick="location.href='/creator/obs-popup'">
                <div class="tool-icon">🎭</div>
                <h3 class="tool-title">OBS 팝업 도구</h3>
                <p class="tool-description">스트리밍 중 시청자와의 상호작용을 위한 팝업 효과를 만들어보세요</p>
            </div>
            
            <div class="tool-card" onclick="location.href='/creator/community'">
                <div class="tool-icon">👥</div>
                <h3 class="tool-title">크리에이터 커뮤니티</h3>
                <p class="tool-description">크리에이터들과 소통하고 정보를 공유하는 커뮤니티 공간입니다</p>
                <div class="tool-badge">소통</div>
            </div>
            
            <div class="tool-card" onclick="location.href='/creator/job-board'">
                <div class="tool-icon">💼</div>
                <h3 class="tool-title">구인구직 게시판</h3>
                <p class="tool-description">편집자, 섬네일러, 기획자 등 크리에이터 관련 구인구직 정보</p>
                <div class="tool-badge">취업</div>
            </div>
        </div>
    </div>
</div>

<style>
.creator-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 80vh;
}

.creator-hero {
    text-align: center;
    padding: 60px 0 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: -20px -20px 50px;
    color: white;
    border-radius: 0 0 25px 25px;
    position: relative;
    overflow: hidden;
}

.creator-hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="2.5" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="30" cy="40" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
    animation: float 20s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

.hero-title {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 15px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    position: relative;
    z-index: 1;
}

.hero-subtitle {
    font-size: 1.3rem;
    opacity: 0.95;
    margin-bottom: 10px;
    font-weight: 500;
    position: relative;
    z-index: 1;
}

.hero-description {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
    position: relative;
    z-index: 1;
}

.creator-content {
    background: transparent;
}

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    padding: 0;
}

.tool-card {
    background: linear-gradient(145deg, #ffffff, #f8f9fa);
    border-radius: 20px;
    padding: 40px 30px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    position: relative;
    overflow: hidden;
}

.tool-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
}

.tool-card:hover::before {
    left: 100%;
}

.tool-card:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    border-color: rgba(102, 126, 234, 0.3);
}

.tool-icon {
    font-size: 4rem;
    margin-bottom: 25px;
    display: inline-block;
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
}

.tool-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 15px;
    color: #2d3748;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tool-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #4a5568;
    margin: 0;
    font-weight: 400;
}

.tool-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 로딩 애니메이션 효과 */
.tool-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
}

.tool-card:hover::after {
    transform: translateX(0);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    .creator-container {
        padding: 10px;
    }
    
    .creator-hero {
        margin: -10px -10px 40px;
        padding: 40px 0 50px;
    }
    
    .hero-title {
        font-size: 2.2rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-description {
        font-size: 1rem;
    }
    
    .tools-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .tool-card {
        padding: 30px 25px;
    }
    
    .tool-icon {
        font-size: 3.5rem;
        margin-bottom: 20px;
    }
    
    .tool-title {
        font-size: 1.5rem;
        margin-bottom: 12px;
    }
    
    .tool-description {
        font-size: 1rem;
        line-height: 1.6;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 1.9rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .tool-card {
        padding: 25px 20px;
        margin-bottom: 15px;
    }
    
    .tool-icon {
        font-size: 3rem;
        margin-bottom: 15px;
    }
    
    .tool-title {
        font-size: 1.3rem;
    }
    
    .tool-description {
        font-size: 0.95rem;
    }
}

/* 추가 시각적 효과 */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.tool-card:active {
    animation: pulse 0.3s ease-in-out;
}
</style>

<?php include_once '../includes/footer.php'; ?>