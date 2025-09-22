<?php
$page_title = '랜덤 음식 추천기 - 짭샵 유틸리티';
$page_description = '오늘 뭐 먹을지 고민될 때, 랜덤으로 메뉴를 추천해 드립니다. 한식, 중식, 일식, 양식 등 다양한 음식을 간단하게 추천받아보세요!';
$page_keywords = '음식 추천, 메뉴 추천, 랜덤 음식, 뭐먹을까, 음식 선택, 메뉴 결정, 오늘 메뉴';
$page_css = 'assets/css/food-picker.css';
?>

<?php include_once '../includes/section-headers/tools-header.php'; ?>

<!-- Google AdSense 수평 광고 -->
<?php include_once '../includes/ads/horizontal-ad.php'; ?>

<div class="food-container">
    <div class="food-header">
        <h1>🍽️ 랜덤 음식 추천기</h1>
        <p>오늘 뭐 먹을지 고민될 때, 클릭 한 번으로 맛있는 메뉴를 추천받으세요!</p>
    </div>

    <div class="food-main">
        <div class="food-picker">
            <div class="picker-card">
                <div class="food-display" id="foodDisplay">
                    <div class="food-emoji" id="foodEmoji">🍽️</div>
                    <h2 class="food-name" id="foodName">음식 추천 받기</h2>
                    <p class="food-desc" id="foodDesc">아래 버튼을 눌러서 랜덤 음식을 추천받아보세요!</p>
                    <div class="food-details" id="foodDetails" style="display: none;">
                        <div class="detail-item">
                            <span class="detail-icon">🏷️</span>
                            <span id="foodCategory">카테고리</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-icon">💰</span>
                            <span id="foodPrice">가격대</span>
                        </div>
                    </div>
                </div>
                
                <div class="picker-buttons">
                    <button id="randomPick" class="pick-btn primary">
                        <span class="btn-icon">🎲</span>
                        <span class="btn-text">랜덤 추천!</span>
                    </button>
                    <button id="newPick" class="pick-btn secondary" style="display: none;">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">다시 추천</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="../assets/js/food-picker.js"></script>

<?php include_once '../includes/footer.php'; ?>