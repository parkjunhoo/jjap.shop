<?php
$page_title = '오늘의 운세 - 짭샵 유틸리티';
$page_description = '별자리와 띠(12지신) 기반의 상세한 운세를 확인하세요! 사랑, 돈, 건강, 직업 운세와 행운 포인트를 제공합니다.';
$page_keywords = '오늘의 운세, 별자리 운세, 12지신, 띠별 운세, 점술, 사주, 행운, 연애운, 금전운';
$page_css = 'assets/css/daily-fortune.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="fortune-container">
    <div class="fortune-header">
        <h1>🔮 오늘의 운세</h1>
        <p>별자리와 띠로 알아보는 나만의 특별한 하루 운세</p>
    </div>

    <div class="fortune-main">
        <div class="input-section">
            <div class="zodiac-card">
                <h3>✨ 별자리 선택</h3>
                <div class="zodiac-grid">
                    <button class="zodiac-btn" data-sign="aries">♈ 양자리<small>3.21-4.19</small></button>
                    <button class="zodiac-btn" data-sign="taurus">♉ 황소자리<small>4.20-5.20</small></button>
                    <button class="zodiac-btn" data-sign="gemini">♊ 쌍둥이자리<small>5.21-6.21</small></button>
                    <button class="zodiac-btn" data-sign="cancer">♋ 게자리<small>6.22-7.22</small></button>
                    <button class="zodiac-btn" data-sign="leo">♌ 사자자리<small>7.23-8.22</small></button>
                    <button class="zodiac-btn" data-sign="virgo">♍ 처녀자리<small>8.23-9.22</small></button>
                    <button class="zodiac-btn" data-sign="libra">♎ 천칭자리<small>9.23-10.22</small></button>
                    <button class="zodiac-btn" data-sign="scorpio">♏ 전갈자리<small>10.23-11.22</small></button>
                    <button class="zodiac-btn" data-sign="sagittarius">♐ 사수자리<small>11.23-12.21</small></button>
                    <button class="zodiac-btn" data-sign="capricorn">♑ 염소자리<small>12.22-1.19</small></button>
                    <button class="zodiac-btn" data-sign="aquarius">♒ 물병자리<small>1.20-2.18</small></button>
                    <button class="zodiac-btn" data-sign="pisces">♓ 물고기자리<small>2.19-3.20</small></button>
                </div>
            </div>

            <div class="chinese-zodiac-card">
                <h3>🐉 띠별 운세 (12지신)</h3>
                <div class="chinese-zodiac-grid">
                    <button class="chinese-zodiac-btn" data-animal="rat">🐭 쥐띠<small>자(子)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="ox">🐂 소띠<small>축(丑)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="tiger">🐅 호랑이띠<small>인(寅)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="rabbit">🐰 토끼띠<small>묘(卯)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="dragon">🐲 용띠<small>진(辰)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="snake">🐍 뱀띠<small>사(巳)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="horse">🐴 말띠<small>오(午)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="goat">🐐 양띠<small>미(未)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="monkey">🐵 원숭이띠<small>신(申)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="rooster">🐓 닭띠<small>유(酉)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="dog">🐶 개띠<small>술(戌)</small></button>
                    <button class="chinese-zodiac-btn" data-animal="pig">🐷 돼지띠<small>해(亥)</small></button>
                </div>
            </div>

        </div>

        <div class="result-section">
            <div id="fortuneResult" class="fortune-result" style="display: none;">
                <div class="result-header">
                    <h3 id="fortuneTitle">✨ 오늘의 운세</h3>
                    <div class="result-actions">
                        <button id="shareFortune" class="action-btn">📤 공유</button>
                    </div>
                </div>

                <div class="today-info">
                    <div class="today-date" id="todayDate"></div>
                    <div class="user-info" id="userInfo"></div>
                </div>

                <div class="fortune-cards">
                    <div class="fortune-card main-fortune">
                        <div class="card-header">
                            <span class="card-icon">🎯</span>
                            <h4>종합 운세</h4>
                            <div class="fortune-score" id="generalScore">★★★☆☆</div>
                        </div>
                        <div class="card-content">
                            <p id="generalFortune" class="fortune-text"></p>
                        </div>
                    </div>

                    <div class="fortune-categories">
                        <div class="fortune-card">
                            <div class="card-header">
                                <span class="card-icon">💕</span>
                                <h4>연애/인간관계</h4>
                                <div class="fortune-score" id="loveScore">★★☆☆☆</div>
                            </div>
                            <div class="card-content">
                                <p id="loveFortune" class="fortune-text"></p>
                            </div>
                        </div>

                        <div class="fortune-card">
                            <div class="card-header">
                                <span class="card-icon">💰</span>
                                <h4>금전/재물</h4>
                                <div class="fortune-score" id="moneyScore">★★★★☆</div>
                            </div>
                            <div class="card-content">
                                <p id="moneyFortune" class="fortune-text"></p>
                            </div>
                        </div>

                        <div class="fortune-card">
                            <div class="card-header">
                                <span class="card-icon">🏥</span>
                                <h4>건강</h4>
                                <div class="fortune-score" id="healthScore">★★★☆☆</div>
                            </div>
                            <div class="card-content">
                                <p id="healthFortune" class="fortune-text"></p>
                            </div>
                        </div>

                        <div class="fortune-card">
                            <div class="card-header">
                                <span class="card-icon">💼</span>
                                <h4>직업/학업</h4>
                                <div class="fortune-score" id="workScore">★★★★★</div>
                            </div>
                            <div class="card-content">
                                <p id="workFortune" class="fortune-text"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="fortune-extras">
                    <div class="lucky-section">
                        <h4>🍀 오늘의 행운 포인트</h4>
                        <div class="lucky-grid">
                            <div class="lucky-item">
                                <span class="lucky-label">행운 숫자</span>
                                <span class="lucky-value" id="luckyNumber">7</span>
                            </div>
                            <div class="lucky-item">
                                <span class="lucky-label">행운 색상</span>
                                <span class="lucky-value lucky-color" id="luckyColor">빨간색</span>
                            </div>
                            <div class="lucky-item">
                                <span class="lucky-label">행운 방향</span>
                                <span class="lucky-value" id="luckyDirection">동쪽</span>
                            </div>
                            <div class="lucky-item">
                                <span class="lucky-label">행운 시간</span>
                                <span class="lucky-value" id="luckyTime">오후 2시</span>
                            </div>
                            <div class="lucky-item">
                                <span class="lucky-label">행운 아이템</span>
                                <span class="lucky-value" id="luckyItem">반지</span>
                            </div>
                            <div class="lucky-item">
                                <span class="lucky-label">행운 음식</span>
                                <span class="lucky-value" id="luckyFood">딸기</span>
                            </div>
                        </div>
                    </div>

                    <div class="advice-section">
                        <h4>💡 오늘의 조언</h4>
                        <div class="advice-content">
                            <p id="dailyAdvice" class="advice-text"></p>
                        </div>
                    </div>

                    <div class="warning-section">
                        <h4>⚠️ 주의사항</h4>
                        <div class="warning-content">
                            <p id="dailyWarning" class="warning-text"></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="welcome-card" id="welcomeCard">
                <div class="welcome-content">
                    <div class="welcome-icon">🔮</div>
                    <h3>별자리와 띠로 알아보는 오늘의 운세!</h3>
                    <p>자신의 별자리와 띠를 선택하거나<br>빠른 운세를 통해 오늘의 운을 확인해보세요.</p>
                    <div class="welcome-tips">
                        <div class="tip-item">
                            <span class="tip-icon">✨</span>
                            <span>별자리와 띠를 모두 선택하면 더욱 정확한 운세를 제공합니다</span>
                        </div>
                        <div class="tip-item">
                            <span class="tip-icon">⚡</span>
                            <span>빠른 운세로 원하는 분야만 골라볼 수 있어요</span>
                        </div>
                        <div class="tip-item">
                            <span class="tip-icon">🍀</span>
                            <span>행운의 아이템과 주의사항까지 상세하게 알려드립니다</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="../assets/js/daily-fortune.js"></script>

<?php include_once '../includes/footer.php'; ?>