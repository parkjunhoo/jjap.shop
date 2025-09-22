    </main>
    
    <!-- 공용 푸터 -->
    <footer class="common-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-links-wrapper">
                    <a href="#" onclick="showContact()">연락처</a>
                    <a href="/creator/terms">이용약관</a>
                    <a href="/creator/privacy">개인정보처리방침</a>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; <script>document.write(new Date().getFullYear());</script> 짭샵. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- 공용 JavaScript -->
    <script src="/assets/js/common.js"></script>
    
    <!-- 페이지별 추가 스크립트 -->
    <?php if (isset($page_js)): ?>
        <script src="/<?php echo $page_js; ?>"></script>
    <?php endif; ?>
</body>
</html>
