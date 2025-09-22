// 🍽️ 랜덤 음식 추천기 JavaScript

class SimpleFoodPicker {
    constructor() {
        // 음식 데이터베이스
        this.foods = [
            // 한식
            { name: '김치찌개', emoji: '🍲', category: '한식', price: '8,000원 ~ 12,000원', desc: '매콤한 김치와 돼지고기가 어우러진 한국의 대표 찌개' },
            { name: '불고기', emoji: '🥩', category: '한식', price: '15,000원 ~ 25,000원', desc: '달콤 짭짤한 양념에 재운 소고기 구이' },
            { name: '비빔밥', emoji: '🍚', category: '한식', price: '10,000원 ~ 15,000원', desc: '각종 나물과 고추장이 어우러진 건강한 한식' },
            { name: '삼계탕', emoji: '🍗', category: '한식', price: '12,000원 ~ 18,000원', desc: '인삼과 닭고기가 들어간 보양 음식' },
            { name: '냉면', emoji: '🍜', category: '한식', price: '8,000원 ~ 12,000원', desc: '시원한 육수와 면발이 일품인 여름 음식' },
            { name: '떡볶이', emoji: '🍢', category: '한식', price: '3,000원 ~ 6,000원', desc: '매콤달콤한 고추장 떡볶이' },
            { name: '갈비탕', emoji: '🍲', category: '한식', price: '12,000원 ~ 18,000원', desc: '진한 사골 국물과 갈비가 들어간 보양 음식' },
            { name: '김밥', emoji: '🍙', category: '한식', price: '2,500원 ~ 5,000원', desc: '간편하고 맛있는 한국식 롤' },

            // 중식
            { name: '짜장면', emoji: '🍝', category: '중식', price: '6,000원 ~ 10,000원', desc: '중국식 춘장 소스 면 요리' },
            { name: '짬뽕', emoji: '🍜', category: '중식', price: '8,000원 ~ 12,000원', desc: '매콤한 해물 국물 면 요리' },
            { name: '탕수육', emoji: '🍖', category: '중식', price: '15,000원 ~ 25,000원', desc: '바삭한 튀김옷과 새콤달콤한 소스의 조화' },
            { name: '깐풍기', emoji: '🍗', category: '중식', price: '18,000원 ~ 25,000원', desc: '바삭하고 매콤달콤한 닭강정' },
            { name: '볶음밥', emoji: '🍚', category: '중식', price: '7,000원 ~ 10,000원', desc: '고슬고슬한 중국식 볶음밥' },

            // 일식
            { name: '초밥', emoji: '🍣', category: '일식', price: '20,000원 ~ 40,000원', desc: '신선한 생선과 초밥의 완벽한 조화' },
            { name: '라멘', emoji: '🍜', category: '일식', price: '8,000원 ~ 15,000원', desc: '진한 육수와 면의 조화로운 일본 면 요리' },
            { name: '돈카츠', emoji: '🍖', category: '일식', price: '10,000원 ~ 18,000원', desc: '바삭한 튀김옷의 돼지고기 카츠' },
            { name: '우동', emoji: '🍜', category: '일식', price: '7,000원 ~ 12,000원', desc: '쫄깃한 면발과 담백한 국물' },
            { name: '카레라이스', emoji: '🍛', category: '일식', price: '8,000원 ~ 12,000원', desc: '일본식 카레와 밥의 조합' },

            // 양식
            { name: '스테이크', emoji: '🥩', category: '양식', price: '25,000원 ~ 50,000원', desc: '고급 소고기를 완벽하게 구운 요리' },
            { name: '파스타', emoji: '🍝', category: '양식', price: '12,000원 ~ 20,000원', desc: '이탈리아 전통 면 요리' },
            { name: '피자', emoji: '🍕', category: '양식', price: '15,000원 ~ 30,000원', desc: '치즈와 토핑이 올라간 이탈리아 전통 요리' },
            { name: '햄버거', emoji: '🍔', category: '양식', price: '8,000원 ~ 18,000원', desc: '패티와 야채가 들어간 미국식 샌드위치' },
            { name: '샐러드', emoji: '🥗', category: '양식', price: '10,000원 ~ 18,000원', desc: '신선한 야채와 드레싱의 조화' },
            { name: '치킨', emoji: '🍗', category: '양식', price: '15,000원 ~ 25,000원', desc: '바삭한 튀김옷과 부드러운 치킨의 조화' },

            // 아시아
            { name: '쌀국수', emoji: '🍜', category: '아시아', price: '8,000원 ~ 12,000원', desc: '베트남 전통 쌀면 요리' },
            { name: '팟타이', emoji: '🍝', category: '아시아', price: '10,000원 ~ 15,000원', desc: '태국식 볶음 쌀국수' },
            { name: '카레', emoji: '🍛', category: '아시아', price: '10,000원 ~ 18,000원', desc: '향신료가 풍부한 인도식 카레' },
            { name: '똠양꿍', emoji: '🍲', category: '아시아', price: '12,000원 ~ 18,000원', desc: '매콤새콤한 태국 전통 수프' },

            // 간편식
            { name: '라면', emoji: '🍜', category: '간편식', price: '1,000원 ~ 3,000원', desc: '간단하고 맛있는 인스턴트 면' },
            { name: '도시락', emoji: '🍱', category: '간편식', price: '3,000원 ~ 8,000원', desc: '균형 잡힌 한 끼 식사' },
            { name: '토스트', emoji: '🍞', category: '간편식', price: '2,000원 ~ 5,000원', desc: '바삭하고 고소한 빵 요리' }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('randomPick').addEventListener('click', () => {
            this.getRandomFood();
        });

        document.getElementById('newPick').addEventListener('click', () => {
            this.getRandomFood();
        });
    }

    getRandomFood() {
        this.showLoading();
        
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * this.foods.length);
            const selectedFood = this.foods[randomIndex];
            this.displayFood(selectedFood);
        }, 1000);
    }

    showLoading() {
        document.querySelector('.picker-card').classList.add('loading');
        document.getElementById('foodEmoji').textContent = '🎲';
        document.getElementById('foodName').textContent = '추천 중...';
        document.getElementById('foodDesc').textContent = '맛있는 음식을 찾고 있습니다!';
        document.getElementById('foodDetails').style.display = 'none';
        document.getElementById('newPick').style.display = 'none';
    }

    displayFood(food) {
        const pickerCard = document.querySelector('.picker-card');
        pickerCard.classList.remove('loading');
        pickerCard.classList.add('result-appear');
        
        const emojiEl = document.getElementById('foodEmoji');
        emojiEl.textContent = food.emoji;
        emojiEl.classList.add('animate');
        
        document.getElementById('foodName').textContent = food.name;
        document.getElementById('foodDesc').textContent = food.desc;
        document.getElementById('foodCategory').textContent = food.category;
        document.getElementById('foodPrice').textContent = food.price;
        
        document.getElementById('foodDetails').style.display = 'flex';
        document.getElementById('newPick').style.display = 'block';
        
        setTimeout(() => {
            emojiEl.classList.remove('animate');
            pickerCard.classList.remove('result-appear');
        }, 600);
        
        this.showToast(`${food.emoji} ${food.name} 추천!`);
    }

    showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            color: white; padding: 12px 20px; border-radius: 25px;
            box-shadow: 0 4px 20px rgba(255, 107, 53, 0.3);
            z-index: 10000; transform: translateX(100%);
            transition: transform 0.3s ease; font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleFoodPicker();
});
