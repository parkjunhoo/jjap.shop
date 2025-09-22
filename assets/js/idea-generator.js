// 💡 랜덤 아이디어 생성기 JavaScript

class IdeaGenerator {
    constructor() {
        this.currentCategory = 'all';
        this.favorites = JSON.parse(localStorage.getItem('ideaFavorites')) || [];
        this.stats = JSON.parse(localStorage.getItem('ideaStats')) || {
            totalGenerated: 0,
            categoryStats: {},
            lastGenerated: null,
            streak: 0
        };
        
        this.ideas = {
            date: [
                { title: "동네 카페 투어", description: "새로운 카페를 찾아 커피와 디저트를 즐기며 대화해보세요", tips: "인스타그램에서 #동네카페 태그를 검색해보세요", difficulty: "easy" },
                { title: "별 보러 가기", description: "도시 외곽이나 공원에서 밤하늘의 별을 관찰해보세요", tips: "별자리 앱을 다운받고 담요를 준비하세요", difficulty: "easy" },
                { title: "요리 교실 함께 듣기", description: "커플 요리 클래스나 베이킹 클래스에 참여해보세요", tips: "미리 예약하고 앞치마를 준비하세요", difficulty: "medium" },
                { title: "야시장 탐방", description: "지역 야시장에서 다양한 길거리 음식을 맛보세요", tips: "현금을 준비하고 배고픈 상태로 가세요", difficulty: "easy" },
                { title: "사진 찍기 데이트", description: "예쁜 장소에서 서로의 사진을 찍어주며 추억을 남겨보세요", tips: "골든타임(일출/일몰) 시간을 노려보세요", difficulty: "easy" },
                { title: "방탈출 카페", description: "함께 문제를 풀며 협동심을 기를 수 있는 방탈출에 도전해보세요", tips: "난이도를 미리 확인하고 예약하세요", difficulty: "medium" },
                { title: "플리마켓 구경", description: "주말 플리마켓에서 특별한 소품들을 구경하고 쇼핑해보세요", tips: "현금과 에코백을 준비하세요", difficulty: "easy" },
                { title: "드라이브와 피크닉", description: "경치 좋은 곳으로 드라이브하며 피크닉을 즐겨보세요", tips: "도시락과 돗자리를 미리 준비하세요", difficulty: "medium" },
            ],
            
            food: [
                { title: "오무라이스 만들기", description: "계란으로 밥을 감싸는 일본식 오므라이스를 도전해보세요", tips: "계란을 젓가락으로 저으며 익히면 부드러워집니다", difficulty: "medium" },
                { title: "홈메이드 피자", description: "도우부터 토핑까지 직접 만드는 수제 피자에 도전해보세요", tips: "도우는 미리 발효시키고 토핑은 간단하게", difficulty: "hard" },
                { title: "김치찌개", description: "한국의 대표 음식인 김치찌개를 끓여보세요", tips: "신 김치를 사용하면 더 맛있어집니다", difficulty: "easy" },
                { title: "마카롱 만들기", description: "프랑스 디저트 마카롱을 집에서 만들어보세요", tips: "습도가 낮은 날에 만드는 것이 좋습니다", difficulty: "hard" },
                { title: "떡볶이와 김말이", description: "분식집 대표 메뉴를 집에서 직접 만들어보세요", tips: "떡은 미리 찬물에 불려두세요", difficulty: "medium" },
                { title: "수제 햄버거", description: "패티부터 번까지 모든 것을 직접 만든 햄버거", tips: "패티는 80:20 비율의 소고기를 사용하세요", difficulty: "medium" },
                { title: "초밥 만들기", description: "신선한 생선으로 집에서 초밥을 만들어보세요", tips: "초밥용 쌀과 와사비, 간장을 준비하세요", difficulty: "hard" },
                { title: "치킨 까라아게", description: "일본식 프라이드 치킨을 바삭하게 튀겨보세요", tips: "두 번 튀기기로 더 바삭하게 만들 수 있습니다", difficulty: "medium" },
            ],
            
            hobby: [
                { title: "미니어처 만들기", description: "작은 세상을 만드는 미니어처 공예에 도전해보세요", tips: "온라인에서 키트를 구매하면 쉽게 시작할 수 있습니다", difficulty: "medium" },
                { title: "캘리그래피 연습", description: "아름다운 손글씨로 감정을 표현해보세요", tips: "붓펜과 연습장을 준비하고 기본 선 긋기부터 시작하세요", difficulty: "medium" },
                { title: "다육식물 키우기", description: "귀여운 다육식물을 키우며 작은 정원을 만들어보세요", tips: "물은 일주일에 한 번, 햇빛이 잘 드는 곳에 두세요", difficulty: "easy" },
                { title: "레진 아트", description: "투명한 레진으로 액세서리나 작품을 만들어보세요", tips: "환기가 잘 되는 곳에서 작업하고 장갑을 착용하세요", difficulty: "hard" },
                { title: "종이접기 (오리가미)", description: "한 장의 종이로 다양한 모양을 만드는 예술", tips: "유튜브 튜토리얼을 보며 천천히 따라해보세요", difficulty: "medium" },
                { title: "뜨개질", description: "털실로 목도리나 모자를 만들어보세요", tips: "초보자는 단순한 패턴부터 시작하세요", difficulty: "medium" },
                { title: "수채화 그리기", description: "물감의 번짐을 이용한 몽환적인 수채화 그리기", tips: "물감을 너무 진하게 쓰지 말고 레이어를 쌓아보세요", difficulty: "medium" },
                { title: "우쿨렐레 배우기", description: "작고 귀여운 우쿨렐레로 음악을 시작해보세요", tips: "기본 코드 4개(C, Am, F, G)만 알면 많은 곡을 연주할 수 있습니다", difficulty: "medium" },
            ],
            
            exercise: [
                { title: "홈트레이닝", description: "집에서 할 수 있는 맨몸운동으로 건강을 챙겨보세요", tips: "운동 전 충분한 스트레칭을 하고 물을 준비하세요", difficulty: "easy" },
                { title: "요가 클래스", description: "몸과 마음의 건강을 위한 요가를 시작해보세요", tips: "요가매트와 편한 복장을 준비하세요", difficulty: "easy" },
                { title: "등산", description: "자연 속에서 체력을 기르고 경치를 감상해보세요", tips: "등산화와 충분한 물, 간식을 준비하세요", difficulty: "medium" },
                { title: "수영", description: "전신운동의 대표주자인 수영으로 체력을 길러보세요", tips: "수영복과 수경, 수모를 준비하고 샤워용품을 챙기세요", difficulty: "medium" },
                { title: "사이클링", description: "자전거를 타고 바람을 가르며 운동해보세요", tips: "헬멧 착용은 필수이고 자전거 점검을 미리 하세요", difficulty: "medium" },
                { title: "런닝", description: "꾸준한 달리기로 지구력과 체력을 기워보세요", tips: "러닝화와 편한 복장, 이어폰을 준비하세요", difficulty: "easy" },
                { title: "복싱", description: "스트레스 해소와 체력 증진에 좋은 복싱을 배워보세요", tips: "복싱 글러브와 손목 보호대를 준비하세요", difficulty: "hard" },
                { title: "클라이밍", description: "실내 암벽등반으로 근력과 집중력을 기워보세요", tips: "클라이밍화 렌탈과 초보자 코스부터 시작하세요", difficulty: "hard" },
            ],
            
            travel: [
                { title: "제주도 한 바퀴", description: "아름다운 제주도의 해안도로를 따라 드라이브 여행", tips: "렌터카를 미리 예약하고 날씨를 확인하세요", difficulty: "medium" },
                { title: "부산 감천문화마을", description: "알록달록한 집들이 모여있는 부산의 마추픽추", tips: "편한 신발을 신고 카메라를 준비하세요", difficulty: "easy" },
                { title: "경주 역사 탐방", description: "신라의 고도 경주에서 역사와 문화를 체험해보세요", tips: "불국사, 석굴암 등 주요 유적지를 미리 찾아보세요", difficulty: "easy" },
                { title: "강원도 펜션", description: "강원도의 자연 속 펜션에서 힐링 시간을 가져보세요", tips: "계절에 맞는 옷과 바비큐 재료를 준비하세요", difficulty: "medium" },
                { title: "전주 한옥마을", description: "전통 한옥과 맛있는 음식이 있는 전주 여행", tips: "한복 대여점을 이용하면 더 특별한 경험이 됩니다", difficulty: "easy" },
                { title: "서울 한강 피크닉", description: "도심 속 자연공간인 한강에서 피크닉을 즐겨보세요", tips: "치킨과 맥주, 돗자리를 준비하세요", difficulty: "easy" },
                { title: "속초 해변", description: "동해안의 푸른 바다와 신선한 해산물을 만끽해보세요", tips: "선크림과 수영복을 준비하고 회를 꼭 드셔보세요", difficulty: "easy" },
                { title: "지리산 둘레길", description: "지리산의 아름다운 자연을 걸으며 감상해보세요", tips: "등산복과 등산화, 충분한 물과 간식을 준비하세요", difficulty: "hard" },
            ],
            
            study: [
                { title: "새로운 언어 배우기", description: "관심 있던 외국어를 온라인이나 학원에서 배워보세요", tips: "매일 30분씩 꾸준히 하는 것이 가장 효과적입니다", difficulty: "medium" },
                { title: "온라인 강의 수강", description: "관심 분야의 온라인 강의를 들으며 새로운 스킬을 익혀보세요", tips: "유데미, 코세라, 인프런 등을 활용해보세요", difficulty: "easy" },
                { title: "독서 모임 참여", description: "같은 책을 읽고 토론하는 독서 모임에 참여해보세요", tips: "지역 도서관이나 온라인 커뮤니티를 찾아보세요", difficulty: "medium" },
                { title: "자격증 취득", description: "업무나 취미와 관련된 자격증을 준비해보세요", tips: "목표 기간을 설정하고 매일 조금씩 공부하세요", difficulty: "hard" },
                { title: "코딩 배우기", description: "프로그래밍 언어를 배워 간단한 프로그램을 만들어보세요", tips: "파이썬이나 자바스크립트부터 시작하는 것을 추천합니다", difficulty: "hard" },
                { title: "역사책 읽기", description: "우리나라나 세계 역사에 대한 책을 읽어보세요", tips: "만화나 소설 형태의 역사책부터 시작해보세요", difficulty: "medium" },
                { title: "TED 강연 시청", description: "세계적인 전문가들의 TED 강연을 시청하며 견식을 넓혀보세요", tips: "관심 분야별로 플레이리스트를 만들어보세요", difficulty: "easy" },
                { title: "블로그 시작하기", description: "자신의 생각이나 경험을 글로 정리하는 블로그를 시작해보세요", tips: "네이버 블로그나 티스토리부터 시작해보세요", difficulty: "medium" },
            ],
            
            creative: [
                { title: "단편소설 쓰기", description: "자신만의 이야기를 담은 단편소설을 써보세요", tips: "처음엔 짧은 분량부터 시작하고 매일 조금씩 써보세요", difficulty: "medium" },
                { title: "유튜브 채널 만들기", description: "자신의 취미나 특기를 소개하는 유튜브 채널을 개설해보세요", tips: "스마트폰으로도 충분히 시작할 수 있습니다", difficulty: "hard" },
                { title: "포토샵 배우기", description: "사진 편집과 그래픽 디자인의 기본인 포토샵을 배워보세요", tips: "온라인 무료 강의를 활용하고 많이 연습해보세요", difficulty: "hard" },
                { title: "시 쓰기", description: "자신의 감정과 생각을 시로 표현해보세요", tips: "일상의 작은 순간들을 관찰하고 메모하는 습관을 기르세요", difficulty: "medium" },
                { title: "인스타그램 일상툰", description: "자신의 일상을 그림으로 그려 인스타그램에 올려보세요", tips: "프로크리에이트나 무료 그림 앱을 활용해보세요", difficulty: "medium" },
                { title: "음악 만들기", description: "간단한 작곡 앱으로 자신만의 멜로디를 만들어보세요", tips: "GarageBand나 FL Studio Mobile 등을 사용해보세요", difficulty: "hard" },
                { title: "사진 에세이", description: "사진과 글을 결합한 나만의 에세이를 만들어보세요", tips: "하나의 주제를 정하고 그에 맞는 사진들을 촬영해보세요", difficulty: "medium" },
                { title: "캐릭터 디자인", description: "자신만의 캐릭터를 디자인하고 스토리를 만들어보세요", tips: "기본적인 형태부터 시작해서 점차 디테일을 추가해보세요", difficulty: "medium" },
            ],
            
            social: [
                { title: "동아리 활동", description: "관심사가 같은 사람들과 함께하는 동아리에 가입해보세요", tips: "지역 커뮤니티 센터나 온라인 모임을 찾아보세요", difficulty: "medium" },
                { title: "봉사활동", description: "지역사회를 위한 봉사활동에 참여해보세요", tips: "1365 자원봉사포털에서 다양한 봉사활동을 찾을 수 있습니다", difficulty: "easy" },
                { title: "언어교환 만남", description: "외국인과 언어를 교환하며 친구를 만들어보세요", tips: "헬로톡이나 탄뎀 같은 앱을 활용해보세요", difficulty: "medium" },
                { title: "쿠킹클래스", description: "새로운 요리를 배우며 사람들과 만나보세요", tips: "지역 문화센터나 요리학원의 원데이 클래스를 확인해보세요", difficulty: "medium" },
                { title: "게임 모임", description: "보드게임이나 비디오게임을 함께 즐길 친구들을 만나보세요", tips: "보드게임 카페나 PC방에서 정기 모임을 찾아보세요", difficulty: "easy" },
                { title: "독서 토론회", description: "책을 읽고 다른 사람들과 생각을 나누는 모임에 참여해보세요", tips: "도서관이나 서점에서 정기적으로 열리는 행사를 찾아보세요", difficulty: "medium" },
                { title: "스포츠 클럽", description: "좋아하는 스포츠를 함께 할 사람들과 클럽을 만들어보세요", tips: "네이버 카페나 모임 앱에서 동네 스포츠 모임을 찾아보세요", difficulty: "medium" },
                { title: "문화 활동 모임", description: "전시회, 공연, 영화 관람을 함께할 문화 애호가들과 만나보세요", tips: "문화가 있는 날이나 할인 혜택을 활용해보세요", difficulty: "easy" },
            ],
            
            relax: [
                { title: "명상하기", description: "마음의 평안을 찾기 위한 명상 시간을 가져보세요", tips: "조용한 곳에서 편안한 자세로 10분부터 시작해보세요", difficulty: "easy" },
                { title: "아로마테라피", description: "향기로운 에센셜 오일로 몸과 마음을 힐링해보세요", tips: "라벤더나 유칼립투스 오일부터 시작해보세요", difficulty: "easy" },
                { title: "반신욕", description: "따뜻한 물에 몸을 담그며 하루의 피로를 풀어보세요", tips: "입욕제나 바스솔트를 넣으면 더욱 효과적입니다", difficulty: "easy" },
                { title: "숲속 산책", description: "자연의 소리를 들으며 천천히 숲길을 걸어보세요", tips: "스마트폰은 잠시 끄고 자연에 집중해보세요", difficulty: "easy" },
                { title: "독서와 차", description: "좋아하는 책과 따뜻한 차 한 잔으로 여유로운 시간을 보내세요", tips: "카모마일이나 루이보스 차를 추천합니다", difficulty: "easy" },
                { title: "스파 체험", description: "전문적인 마사지와 스파로 몸과 마음을 재충전해보세요", tips: "미리 예약하고 충분한 시간을 확보하세요", difficulty: "medium" },
                { title: "별 보기", description: "도심을 벗어나 맑은 밤하늘의 별을 감상해보세요", tips: "별자리 앱을 설치하고 담요를 준비하세요", difficulty: "easy" },
                { title: "온천욕", description: "천연 온천에서 몸을 따뜻하게 데우며 휴식을 취해보세요", tips: "수건과 세면도구를 준비하고 충분한 수분을 섭취하세요", difficulty: "medium" },
            ],
            
            challenge: [
                { title: "마라톤 완주", description: "42.195km의 풀코스 마라톤에 도전해보세요", tips: "최소 3-4개월의 체계적인 훈련이 필요합니다", difficulty: "hard" },
                { title: "새로운 언어로 대화하기", description: "배운 외국어로 원어민과 30분 대화에 도전해보세요", tips: "언어 교환 앱이나 온라인 튜터를 활용해보세요", difficulty: "hard" },
                { title: "30일 연속 운동", description: "한 달 동안 하루도 빠지지 않고 운동을 해보세요", tips: "운동 종류를 다양하게 바꿔가며 지루하지 않게 하세요", difficulty: "medium" },
                { title: "금연/금주 도전", description: "건강을 위해 담배나 술을 끊어보세요", tips: "주변 사람들에게 선언하고 도움을 요청하세요", difficulty: "hard" },
                { title: "한 달 독서 10권", description: "한 달 동안 책 10권을 읽는 도전을 해보세요", tips: "다양한 장르를 섞고 짧은 책부터 시작하세요", difficulty: "medium" },
                { title: "새벽 5시 기상", description: "30일 동안 새벽 5시에 일어나는 습관을 만들어보세요", tips: "점진적으로 기상 시간을 앞당기고 일찍 잠자리에 드세요", difficulty: "medium" },
                { title: "요리 30가지 도전", description: "30일 동안 매일 다른 요리를 만들어보세요", tips: "간단한 요리부터 시작하고 레시피를 미리 계획하세요", difficulty: "hard" },
                { title: "디지털 디톡스", description: "일주일 동안 SNS와 게임을 완전히 끊어보세요", tips: "대신 할 활동을 미리 계획하고 스마트폰을 멀리 두세요", difficulty: "medium" },
            ],
            
            indoor: [
                { title: "홈시네마", description: "집에서 영화관 같은 분위기로 영화를 감상해보세요", tips: "팝콘과 음료를 준비하고 조명을 어둡게 하세요", difficulty: "easy" },
                { title: "집 정리정돈", description: "미니멀 라이프를 위해 불필요한 물건들을 정리해보세요", tips: "한 공간씩 나누어서 천천히 진행하세요", difficulty: "medium" },
                { title: "홈베이킹", description: "집에서 빵이나 쿠키를 구워보세요", tips: "오븐 온도를 정확히 맞추고 계량을 정확히 하세요", difficulty: "medium" },
                { title: "실내 정원 만들기", description: "집 안에서 허브나 채소를 키워보세요", tips: "상추, 바질 같은 키우기 쉬운 식물부터 시작하세요", difficulty: "medium" },
                { title: "DIY 가구", description: "간단한 선반이나 소품을 직접 만들어보세요", tips: "유튜브 튜토리얼을 보고 필요한 도구를 미리 준비하세요", difficulty: "hard" },
                { title: "게임 개발", description: "간단한 모바일 게임을 만들어보세요", tips: "스크래치나 GameMaker Studio 같은 초보자용 툴을 사용하세요", difficulty: "hard" },
                { title: "홈 스튜디오", description: "집에서 음악이나 팟캐스트를 녹음해보세요", tips: "조용한 공간과 기본적인 마이크만 있으면 시작할 수 있습니다", difficulty: "medium" },
                { title: "온라인 전시회", description: "집에서 세계 유명 박물관의 온라인 전시를 관람해보세요", tips: "구글 아트앤컬처나 각 박물관 웹사이트를 활용하세요", difficulty: "easy" },
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
        this.renderFavorites();
        this.showNotification('아이디어 생성기가 준비되었습니다! 💡', 'success');
    }
    
    setupEventListeners() {
        // 카테고리 버튼들
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCategory(e.currentTarget.dataset.category);
            });
        });
        
        // 아이디어 생성 버튼
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateIdeas();
        });
        
        // 즐겨찾기 모두 삭제 버튼
        document.getElementById('clearFavoritesBtn').addEventListener('click', () => {
            this.clearFavorites();
        });
    }
    
    selectCategory(category) {
        // 이전 활성 버튼 제거
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 새 활성 버튼 설정
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.currentCategory = category;
    }
    
    generateIdeas() {
        const generateBtn = document.getElementById('generateBtn');
        const ideaCount = parseInt(document.getElementById('ideaCount').value);
        const difficulty = document.getElementById('difficultyLevel').value;
        
        // 버튼 애니메이션
        generateBtn.classList.add('generating');
        generateBtn.querySelector('.btn-text').textContent = '생성 중...';
        
        setTimeout(() => {
            const ideas = this.getRandomIdeas(this.currentCategory, ideaCount, difficulty);
            this.displayIdeas(ideas);
            
            // 통계 업데이트
            this.updateGenerationStats();
            
            // 버튼 원상복구
            generateBtn.classList.remove('generating');
            generateBtn.querySelector('.btn-text').textContent = '아이디어 생성';
            
            this.showNotification(`${ideas.length}개의 아이디어를 생성했습니다! 🎯`, 'success');
        }, 1000);
    }
    
    getRandomIdeas(category, count, difficulty) {
        let availableIdeas = [];
        
        if (category === 'all') {
            // 모든 카테고리에서 선택
            Object.keys(this.ideas).forEach(cat => {
                availableIdeas.push(...this.ideas[cat].map(idea => ({...idea, category: cat})));
            });
        } else {
            // 선택한 카테고리에서만 선택
            availableIdeas = this.ideas[category].map(idea => ({...idea, category: category}));
        }
        
        // 난이도 필터링
        if (difficulty !== 'all') {
            availableIdeas = availableIdeas.filter(idea => idea.difficulty === difficulty);
        }
        
        // 랜덤 선택
        const shuffled = availableIdeas.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    displayIdeas(ideas) {
        const container = document.getElementById('ideaResults');
        
        if (ideas.length === 0) {
            container.innerHTML = `
                <div class="welcome-state">
                    <div class="welcome-icon">😅</div>
                    <h3>조건에 맞는 아이디어가 없어요</h3>
                    <p>다른 카테고리나 난이도를 선택해보세요!</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = ideas.map((idea, index) => this.createIdeaCard(idea, index)).join('');
        
        // 이벤트 리스너 추가
        ideas.forEach((idea, index) => {
            const card = container.children[index];
            
            // 즐겨찾기 버튼
            card.querySelector('.favorite-btn').addEventListener('click', () => {
                this.toggleFavorite(idea);
            });
            
            // 공유 버튼
            card.querySelector('.share-btn').addEventListener('click', () => {
                this.shareIdea(idea);
            });
            
            // 시도해보기 버튼
            card.querySelector('.try-btn').addEventListener('click', () => {
                this.tryIdea(idea);
            });
        });
    }
    
    createIdeaCard(idea, index) {
        const categoryEmojis = {
            date: '💕', food: '🍽️', hobby: '🎨', exercise: '🏃',
            travel: '✈️', study: '📚', creative: '🎭', social: '👥',
            relax: '🧘', challenge: '🏆', indoor: '🏠'
        };
        
        const categoryNames = {
            date: '데이트', food: '요리', hobby: '취미', exercise: '운동',
            travel: '여행', study: '학습', creative: '창작', social: '사교',
            relax: '휴식', challenge: '도전', indoor: '실내'
        };
        
        const difficultyNames = {
            easy: '쉬움', medium: '보통', hard: '어려움'
        };
        
        const isFavorited = this.favorites.some(fav => fav.title === idea.title);
        
        return `
            <div class="idea-card" style="animation-delay: ${index * 0.1}s">
                <div class="idea-header-section">
                    <div class="idea-info">
                        <div class="idea-title">${idea.title}</div>
                        <div class="idea-meta">
                            <span class="idea-category">
                                ${categoryEmojis[idea.category]} ${categoryNames[idea.category]}
                            </span>
                            <span class="idea-difficulty ${idea.difficulty}">
                                ${difficultyNames[idea.difficulty]}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="idea-description">${idea.description}</div>
                
                <div class="idea-tips">
                    <div class="idea-tips-title">💡 팁</div>
                    <div class="idea-tips-content">${idea.tips}</div>
                </div>
                
                <div class="idea-actions">
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}">
                        <span>${isFavorited ? '⭐' : '☆'}</span>
                        <span>${isFavorited ? '저장됨' : '즐겨찾기'}</span>
                    </button>
                    <button class="share-btn">
                        <span>🔗</span>
                        <span>공유</span>
                    </button>
                    <button class="try-btn">
                        <span>✅</span>
                        <span>해봤어요</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    toggleFavorite(idea) {
        const existingIndex = this.favorites.findIndex(fav => fav.title === idea.title);
        
        if (existingIndex !== -1) {
            this.favorites.splice(existingIndex, 1);
            this.showNotification('즐겨찾기에서 제거되었습니다', 'info');
        } else {
            this.favorites.push({
                ...idea,
                savedAt: new Date().toISOString()
            });
            this.showNotification('즐겨찾기에 추가되었습니다! ⭐', 'success');
        }
        
        this.saveFavorites();
        this.updateStats();
        this.renderFavorites();
        
        // 버튼 업데이트
        this.regenerateCurrentIdeas();
    }
    
    shareIdea(idea) {
        const categoryNames = {
            date: '데이트', food: '요리', hobby: '취미', exercise: '운동',
            travel: '여행', study: '학습', creative: '창작', social: '사교',
            relax: '휴식', challenge: '도전', indoor: '실내'
        };
        
        const shareText = `💡 ${idea.title}

${idea.description}

💡 팁: ${idea.tips}

카테고리: ${categoryNames[idea.category]}

짭샵 아이디어 생성기에서 발견했어요!`;
        
        if (navigator.share) {
            navigator.share({
                title: `💡 ${idea.title}`,
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('아이디어가 클립보드에 복사되었습니다! 📋', 'success');
            });
        }
    }
    
    tryIdea(idea) {
        // 시도한 아이디어 통계에 추가
        const triedIdeas = JSON.parse(localStorage.getItem('triedIdeas') || '[]');
        triedIdeas.push({
            ...idea,
            triedAt: new Date().toISOString()
        });
        localStorage.setItem('triedIdeas', JSON.stringify(triedIdeas));
        
        this.showNotification(`"${idea.title}"를 시도해보셨군요! 👏 어떠셨나요?`, 'success');
    }
    
    regenerateCurrentIdeas() {
        // 현재 표시된 아이디어들을 다시 렌더링 (즐겨찾기 상태 업데이트)
        const currentIdeas = Array.from(document.querySelectorAll('.idea-card')).map(card => {
            const title = card.querySelector('.idea-title').textContent;
            return this.findIdeaByTitle(title);
        }).filter(Boolean);
        
        if (currentIdeas.length > 0) {
            this.displayIdeas(currentIdeas);
        }
    }
    
    findIdeaByTitle(title) {
        for (let category in this.ideas) {
            const found = this.ideas[category].find(idea => idea.title === title);
            if (found) {
                return { ...found, category };
            }
        }
        return null;
    }
    
    updateGenerationStats() {
        this.stats.totalGenerated++;
        this.stats.categoryStats[this.currentCategory] = (this.stats.categoryStats[this.currentCategory] || 0) + 1;
        
        // 연속 생성일 계산
        const today = new Date().toDateString();
        const lastGenerated = this.stats.lastGenerated;
        
        if (lastGenerated) {
            const lastDate = new Date(lastGenerated).toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();
            
            if (lastDate === today) {
                // 오늘 이미 생성함 - 연속일 유지
            } else if (lastDate === yesterdayString) {
                // 어제 생성했음 - 연속일 증가
                this.stats.streak++;
            } else {
                // 연속 끊김 - 새로 시작
                this.stats.streak = 1;
            }
        } else {
            this.stats.streak = 1;
        }
        
        this.stats.lastGenerated = new Date().toISOString();
        this.saveStats();
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('totalGenerated').textContent = this.stats.totalGenerated;
        document.getElementById('favoriteCount').textContent = this.favorites.length;
        document.getElementById('streakCount').textContent = this.stats.streak;
        
        // 가장 많이 생성한 카테고리 찾기
        const categoryStats = this.stats.categoryStats;
        const topCategory = Object.keys(categoryStats).reduce((a, b) => 
            categoryStats[a] > categoryStats[b] ? a : b, Object.keys(categoryStats)[0]);
        
        const categoryNames = {
            all: '전체', date: '데이트', food: '요리', hobby: '취미', exercise: '운동',
            travel: '여행', study: '학습', creative: '창작', social: '사교',
            relax: '휴식', challenge: '도전', indoor: '실내'
        };
        
        document.getElementById('categoryMaster').textContent = 
            topCategory ? categoryNames[topCategory] || '-' : '-';
    }
    
    renderFavorites() {
        const container = document.getElementById('favoritesList');
        
        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <div class="empty-icon">⭐</div>
                    <p>아직 즐겨찾기한 아이디어가 없어요.<br>마음에 드는 아이디어를 ⭐ 버튼으로 저장해보세요!</p>
                </div>
            `;
            return;
        }
        
        const sortedFavorites = [...this.favorites].sort((a, b) => 
            new Date(b.savedAt) - new Date(a.savedAt));
        
        container.innerHTML = sortedFavorites.map(idea => {
            const categoryNames = {
                date: '데이트', food: '요리', hobby: '취미', exercise: '운동',
                travel: '여행', study: '학습', creative: '창작', social: '사교',
                relax: '휴식', challenge: '도전', indoor: '실내'
            };
            
            const savedDate = new Date(idea.savedAt).toLocaleDateString('ko-KR');
            
            return `
                <div class="favorite-item">
                    <div class="favorite-item-title">${idea.title}</div>
                    <div class="favorite-item-category">${categoryNames[idea.category]}</div>
                    <div class="favorite-item-actions">
                        <div class="favorite-item-date">${savedDate}</div>
                        <button class="remove-favorite-btn" onclick="ideaGenerator.removeFavorite('${idea.title}')">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    removeFavorite(title) {
        this.favorites = this.favorites.filter(fav => fav.title !== title);
        this.saveFavorites();
        this.updateStats();
        this.renderFavorites();
        this.regenerateCurrentIdeas();
        this.showNotification('즐겨찾기에서 제거되었습니다', 'info');
    }
    
    clearFavorites() {
        if (this.favorites.length === 0) {
            this.showNotification('삭제할 즐겨찾기가 없습니다', 'info');
            return;
        }
        
        if (confirm('모든 즐겨찾기를 삭제하시겠습니까?')) {
            this.favorites = [];
            this.saveFavorites();
            this.updateStats();
            this.renderFavorites();
            this.regenerateCurrentIdeas();
            this.showNotification('모든 즐겨찾기가 삭제되었습니다', 'info');
        }
    }
    
    saveFavorites() {
        localStorage.setItem('ideaFavorites', JSON.stringify(this.favorites));
    }
    
    saveStats() {
        localStorage.setItem('ideaStats', JSON.stringify(this.stats));
    }
    
    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.idea-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `idea-notification idea-notification-${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#FF6B6B'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">
                    &times;
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.ideaGenerator = new IdeaGenerator();
});
