    </main>
    
    <!-- 공용 푸터 -->
    <footer class="common-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-links-wrapper">
                    <a href="#" onclick="showContact()">연락처</a>
                    <a href="/terms">이용약관</a>
                    <a href="/privacy">개인정보처리방침</a>
                    <a href="https://www.youtube.com/@%ED%95%B5%EB%8F%8C%ED%95%80" target="_blank">
                        <img src="<?php echo basename($_SERVER['PHP_SELF']) == 'index.php' ? 'assets/images/Youtube_logo.webp' : '../assets/images/Youtube_logo.webp'; ?>" alt="YouTube" class="footer-icon">
                        핵돌핀 Youtube
                    </a>
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
