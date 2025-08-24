    </main>
    
    <!-- 공용 푸터 -->
    <footer class="common-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>짭샵</h3>
                    <p>크리에이터들을 위한 다양한 무료 도구 모음입니다.</p>
                    <div class="social-links">
                        <a href="https://www.youtube.com/@%ED%95%B5%EB%8F%8C%ED%95%80" target="_blank" class="social-link youtube">
                            <img src="../assets/images/Youtube_logo.webp" alt="YouTube">
                            <span>핵돌핀 Youtube</span>
                        </a>
                    </div>
                </div>
                
                <div class="footer-section">
                    <h3>제공 도구</h3>
                    <ul class="footer-links">
                        <li><a href="/kakao-chat">카카오톡 대화 만들기</a></li>
                        <li><a href="/thumbnail-text">썸네일 텍스트 편집기</a></li>
                        <li><a href="/obs-browser-source">OBS 브라우저 소스</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>지원</h3>
                    <ul class="footer-links">
                        <li><a href="#" onclick="showContact()">연락처</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; <script>document.write(new Date().getFullYear());</script> 짭샵. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- 공용 JavaScript -->
    <script src="../assets/js/common.js"></script>
    
    <!-- 페이지별 추가 스크립트 -->
    <?php if (isset($page_js)): ?>
        <script src="<?php echo $page_js; ?>"></script>
    <?php endif; ?>
</body>
</html>
