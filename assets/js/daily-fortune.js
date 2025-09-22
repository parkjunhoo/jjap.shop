// 🔮 오늘의 운세 JavaScript (별자리 + 12지신 기반)

class DailyFortune {
    constructor() {
        this.selectedZodiac = null;
        this.selectedAnimal = null;
        this.currentFortune = null;
        
        // 대폭 확장된 운세 데이터 (웹 검색 기반)
        this.fortuneData = {
            general: [
                "오늘은 새로운 기회가 찾아올 것 같은 좋은 날입니다. 평소 꺼려했던 일에도 도전해보세요.",
                "주변 사람들과의 관계가 더욱 깊어질 수 있는 날입니다. 진솔한 대화를 나눠보세요.",
                "창의적인 아이디어가 샘솟는 하루가 될 것 같습니다. 새로운 프로젝트를 시작해보세요.",
                "오늘은 내적 성찰의 시간이 필요한 날입니다. 조용한 곳에서 자신을 돌아보세요.",
                "예상치 못한 좋은 소식이 들려올 수 있는 날입니다. 마음을 열고 기다려보세요.",
                "작은 변화가 큰 결과를 가져다줄 수 있는 날입니다. 사소한 것부터 개선해보세요.",
                "오늘은 배움의 욕구가 강해질 것 같습니다. 새로운 지식을 습득해보세요.",
                "인내심이 시험받는 하루가 될 수 있습니다. 차분함을 유지하는 것이 중요합니다.",
                "오늘은 직감이 특히 뛰어날 것 같습니다. 첫 번째 생각을 믿어보세요.",
                "과거의 인연이 다시 이어질 수 있는 특별한 날입니다. 연락을 해보세요.",
                "긍정적인 에너지가 넘치는 하루입니다. 주변에 좋은 영향을 미치세요.",
                "중요한 결정을 내려야 할 시점이 다가오고 있습니다. 신중하게 생각해보세요.",
                "협력과 팀워크가 성공의 열쇠가 되는 날입니다. 혼자보다는 함께 하세요.",
                "예술적 감각이 발달하는 시기입니다. 창작 활동에 몰두해보세요.",
                "건강과 안전에 특별히 신경 써야 할 날입니다. 무리하지 마세요.",
                "오늘은 감사한 마음을 표현하기 좋은 날입니다. 고마운 분들께 인사드리세요.",
                "새로운 환경이나 변화에 적응하는 능력이 빛나는 하루입니다.",
                "리더십을 발휘할 기회가 찾아올 수 있습니다. 자신감을 가지세요.",
                "완벽함보다는 진정성이 더 중요한 날입니다. 있는 그대로의 모습을 보여주세요.",
                "오늘은 특별히 운이 좋은 날입니다. 평소 망설였던 일에 도전해보세요.",
                "세심한 관찰력이 필요한 하루입니다. 놓치기 쉬운 디테일에 주목하세요.",
                "자신만의 독특한 매력이 빛나는 날입니다. 개성을 살려보세요.",
                "과거의 경험이 오늘의 지혜가 되어 도움이 될 것입니다.",
                "균형감각이 중요한 하루입니다. 일과 휴식, 감정과 이성의 조화를 찾아보세요.",
                "새로운 만남이나 인연이 시작될 수 있는 특별한 날입니다.",
                "목표 달성을 위한 구체적인 계획을 세우기 좋은 시점입니다.",
                "오늘은 용기와 결단력이 필요한 순간이 올 수 있습니다.",
                "남을 돕는 일이 결국 자신에게도 좋은 결과를 가져다줄 것입니다.",
                "신비로운 직감이나 영감이 찾아올 수 있는 하루입니다.",
                "오늘은 자신의 한계를 뛰어넘을 수 있는 기회의 날입니다."
            ],
            love: [
                "사랑하는 사람과의 관계가 한층 더 깊어질 수 있는 날입니다.",
                "새로운 인연이 시작될 수 있는 특별한 하루입니다.",
                "연인과의 소소한 갈등이 해결될 수 있는 날입니다.",
                "진정한 사랑에 대해 깊이 생각해볼 수 있는 시간입니다.",
                "가족과의 유대감이 더욱 강화될 수 있는 날입니다.",
                "첫눈에 반할 수 있는 운명적인 만남이 기다릴지도 모릅니다.",
                "과거의 상처가 치유되고 새로운 시작을 할 수 있는 날입니다.",
                "솔직한 마음을 표현하면 좋은 결과가 있을 것 같습니다.",
                "오늘은 사랑보다는 자신에게 집중하는 것이 좋겠습니다.",
                "멀리 있는 사람과의 연락이 특별한 의미를 가질 수 있습니다.",
                "연인과의 데이트에서 특별한 추억을 만들 수 있는 날입니다.",
                "친구의 소개로 좋은 인연을 만날 가능성이 높습니다.",
                "상대방의 마음을 이해하려고 노력하면 관계가 개선될 것입니다.",
                "로맨틱한 분위기 속에서 고백이나 프러포즈가 성공할 수 있습니다.",
                "부모님이나 가족의 승인을 받을 수 있는 좋은 기회입니다.",
                "오해가 풀리고 화해할 수 있는 절호의 찬스가 올 것입니다.",
                "사랑하는 사람을 위해 작은 선물이나 깜짝 이벤트를 준비해보세요.",
                "연애에 있어서 적극적인 모습을 보이면 좋은 결과가 따를 것입니다.",
                "SNS나 온라인을 통한 새로운 만남이 기대됩니다.",
                "이별한 연인과 재회할 가능성이 보이는 날입니다.",
                "결혼이나 동거 등 중요한 결정을 내리기 좋은 시점입니다.",
                "상대방의 진심을 확인할 수 있는 계기가 마련될 것입니다.",
                "질투나 의심보다는 신뢰를 바탕으로 한 사랑이 필요한 때입니다.",
                "연인과의 여행이나 나들이가 관계 발전에 도움이 될 것입니다.",
                "혼자만의 시간도 소중하다는 것을 깨닫게 되는 하루입니다.",
                "사랑에 대한 새로운 관점이나 가치관을 정립하게 될 것입니다.",
                "상대방에게 먼저 다가가는 용기가 좋은 결과를 만들어낼 것입니다.",
                "플라토닉한 사랑이나 정신적 교감을 중시하게 되는 시기입니다.",
                "사랑보다는 우정이 더욱 값진 의미를 가지게 될 날입니다.",
                "마음의 상처를 치유하고 새로운 사랑을 준비할 수 있는 시간입니다."
            ],
            money: [
                "예상치 못한 수입이 생길 수 있는 행운의 날입니다.",
                "투자에 대한 좋은 정보를 얻을 수 있는 날입니다.",
                "절약의 중요성을 깨닫게 되는 하루가 될 것 같습니다.",
                "금전 관리에 대해 새로운 아이디어가 떠오를 수 있습니다.",
                "오늘은 큰 지출보다는 저축에 집중하는 것이 좋겠습니다.",
                "부업이나 부수입에 관한 기회가 찾아올 수 있습니다.",
                "과거에 빌려준 돈이 돌아올 가능성이 높은 날입니다.",
                "재정 계획을 다시 세워볼 필요가 있는 날입니다.",
                "돈보다는 인간관계가 더 소중함을 느끼게 될 것 같습니다.",
                "장기적인 투자 관점에서 생각해보면 좋은 하루입니다.",
                "적금이나 보험 가입을 고려해볼 만한 시점입니다.",
                "가계부 작성이나 가계 정리가 도움이 될 날입니다.",
                "새로운 수익 모델이나 사업 아이템을 발견할 수 있습니다.",
                "부동산이나 주식 투자에 대해 공부해볼 좋은 기회입니다.",
                "용돈이나 보너스 등 깜짝 수입이 들어올 가능성이 있습니다.",
                "구매를 미뤄둔 물건을 사기에 좋은 타이밍입니다.",
                "할인이나 혜택을 받을 수 있는 기회가 많은 하루입니다.",
                "재테크 세미나나 경제 관련 강의를 들어보세요.",
                "비트코인이나 암호화폐에 관심을 가져볼 만합니다.",
                "친구나 지인으로부터 돈 관련 조언을 받을 수 있습니다.",
                "온라인 쇼핑이나 중고 거래에서 좋은 딜을 만날 수 있습니다.",
                "카드 포인트나 적립금을 활용하기 좋은 날입니다.",
                "세금이나 공과금 납부일을 미리 체크해보세요.",
                "가족과 돈 문제에 대해 진솔한 대화를 나누어보세요.",
                "금융 상품 비교 검토를 통해 더 나은 조건을 찾을 수 있습니다.",
                "수익성보다는 안정성을 중시하는 것이 좋은 시기입니다.",
                "현금 흐름 관리와 예산 계획이 중요한 하루입니다.",
                "상속이나 증여에 관한 문제가 해결될 수 있습니다.",
                "창업이나 독립에 필요한 자금 계획을 세워볼 때입니다.",
                "보험이나 연금 상품에 대해 알아보기 좋은 시점입니다."
            ],
            health: [
                "규칙적인 운동을 시작하기에 좋은 날입니다.",
                "건강한 식단에 대해 관심을 가져보세요.",
                "충분한 휴식과 수면이 특히 중요한 날입니다.",
                "스트레스 해소를 위한 취미 활동을 해보세요.",
                "정기 검진을 받아볼 필요가 있는 시기입니다.",
                "자연과 함께하는 시간이 건강에 도움이 될 것 같습니다.",
                "금연이나 금주 등 건강한 습관을 시작해보세요.",
                "마음의 건강도 신체 건강만큼 중요합니다.",
                "가벼운 산책이나 스트레칭으로 몸을 풀어보세요.",
                "수분 섭취를 늘리고 균형 잡힌 영양 섭취에 신경써보세요.",
                "요가나 명상을 통해 몸과 마음의 안정을 찾아보세요.",
                "면역력 강화를 위한 비타민 섭취를 고려해보세요.",
                "만성피로나 스트레스에 주의가 필요한 날입니다.",
                "새로운 운동 종목에 도전해보는 것도 좋겠습니다.",
                "건강 관련 책이나 정보를 찾아보기 좋은 시기입니다.",
                "체중 관리나 다이어트를 시작하기에 적절한 때입니다.",
                "온천이나 사우나에서 피로를 풀어보세요.",
                "건강기능식품이나 보조제에 대해 알아보세요.",
                "병원 예약이나 치료 계획을 세워볼 필요가 있습니다.",
                "알레르기나 만성질환 관리에 더욱 신경써야 합니다.",
                "마사지나 추나요법 등 대체의학을 시도해볼 만합니다.",
                "건강한 취미생활로 스트레스를 관리해보세요.",
                "가족력이나 유전적 요인을 고려한 건강 관리가 필요합니다.",
                "소화기 건강에 특별히 주의를 기울여야 할 날입니다.",
                "수면의 질을 개선하기 위한 환경 조성이 중요합니다.",
                "과도한 업무나 학업으로 인한 피로에 주의하세요.",
                "건강한 간식이나 음료를 선택하는 습관을 기르세요.",
                "정신건강을 위한 상담이나 치료를 고려해볼 시기입니다.",
                "계절성 질병이나 감기 예방에 특별히 신경써야 합니다.",
                "건강 검진 결과에 따른 적절한 조치를 취해야 할 때입니다."
            ],
            work: [
                "새로운 프로젝트에서 실력을 발휘할 수 있는 기회가 올 것입니다.",
                "동료와의 협력이 좋은 결과를 가져다줄 수 있는 날입니다.",
                "창의적인 아이디어로 문제를 해결할 수 있을 것 같습니다.",
                "상사나 클라이언트로부터 좋은 평가를 받을 수 있습니다.",
                "업무 효율성을 높일 수 있는 새로운 방법을 찾게 될 것입니다.",
                "커리어 발전을 위한 학습이나 자기계발에 집중해보세요.",
                "인맥 확장에 도움이 되는 만남이 있을 수 있습니다.",
                "오늘은 신중함이 특히 필요한 업무가 있을 것 같습니다.",
                "팀워크의 중요성을 다시 한번 느끼게 되는 하루입니다.",
                "장기적인 비전을 가지고 계획을 세워보는 것이 좋겠습니다.",
                "승진이나 이직에 관한 좋은 소식이 들려올 수 있습니다.",
                "새로운 기술이나 스킬을 습득할 기회가 찾아올 것입니다.",
                "회의나 프레젠테이션에서 주목받을 가능성이 높습니다.",
                "업무상 중요한 결정을 내려야 할 시점이 다가오고 있습니다.",
                "멘토나 선배로부터 값진 조언을 들을 수 있는 날입니다.",
                "새로운 부서나 팀으로의 이동이 고려될 수 있습니다.",
                "업무 스트레스 관리와 워라밸이 중요한 시기입니다.",
                "클라이언트나 고객과의 관계 개선이 필요한 날입니다.",
                "자격증이나 면허 취득을 위한 공부를 시작해보세요.",
                "해외 업무나 출장 기회가 생길 가능성이 있습니다.",
                "창업이나 독립에 대한 구체적인 계획을 세워볼 때입니다.",
                "네트워킹 이벤트나 세미나 참석이 도움이 될 것입니다.",
                "업무 자동화나 디지털화에 대해 고민해볼 필요가 있습니다.",
                "동료들과의 소통과 협업이 성공의 열쇠가 될 것입니다.",
                "새로운 비즈니스 모델이나 아이디어를 검토해보세요.",
                "퇴직 준비나 노후 계획에 대해 생각해볼 시기입니다.",
                "업무 관련 분쟁이나 갈등이 해결될 수 있는 날입니다.",
                "리더십 발휘나 후배 지도에 관심을 가져보세요.",
                "업무 환경 개선이나 복지 혜택에 대해 논의할 기회입니다.",
                "성과 평가나 보상에 대한 긍정적인 결과가 기대됩니다."
            ]
        };

        this.adviceData = [
            "오늘 하루는 긍정적인 마음가짐으로 시작하세요. 작은 미소가 큰 변화를 만들어낼 수 있습니다.",
            "주변 사람들에게 감사의 마음을 표현해보세요. 따뜻한 말 한마디가 관계를 더욱 깊게 만들 것입니다.",
            "새로운 도전을 두려워하지 마세요. 실패도 성장의 한 과정입니다.",
            "오늘은 자신만의 시간을 가져보세요. 내면의 소리에 귀 기울여보는 것이 중요합니다.",
            "작은 목표부터 차근차근 달성해나가세요. 큰 성취는 작은 단계들의 합입니다.",
            "건강이 가장 소중한 자산입니다. 규칙적인 생활과 적절한 운동을 잊지 마세요.",
            "인내심을 가지고 기다려보세요. 좋은 일은 때가 되면 자연스럽게 찾아옵니다.",
            "다른 사람의 의견에도 귀 기울여보세요. 다양한 관점이 새로운 해답을 줄 수 있습니다.",
            "오늘 하루도 최선을 다했다면 그것만으로도 충분합니다. 자신을 격려해주세요.",
            "변화를 받아들이는 유연함을 가져보세요. 변화는 새로운 기회의 시작일 수 있습니다.",
            "완벽함보다는 진정성을 추구하세요. 있는 그대로의 모습이 가장 아름답습니다.",
            "오늘 하루 동안 배운 것들을 정리해보는 시간을 가져보세요.",
            "주변의 소중한 사람들과 더 많은 시간을 보내려고 노력하세요.",
            "자신의 장점과 특별함을 인정하고 자신감을 가져보세요.",
            "때로는 휴식도 생산성의 일부입니다. 충분한 쉼을 취하세요.",
            "새로운 취미나 관심사를 찾아보는 것도 좋은 자극이 될 것입니다.",
            "과거에 얽매이지 말고 현재에 집중하며 미래를 준비하세요.",
            "어려운 상황일수록 희망을 잃지 마세요. 반드시 길은 열릴 것입니다.",
            "남과 비교하기보다는 어제의 자신과 비교하며 성장하세요.",
            "용서와 화해의 마음을 가지면 더 가벼운 마음으로 살 수 있습니다.",
            "새로운 사람들과의 만남을 통해 시야를 넓혀보세요.",
            "작은 행복들을 놓치지 말고 소중히 여기는 하루가 되세요.",
            "자신의 가치관과 신념을 다시 한번 정리해보는 시간을 가져보세요.",
            "도움이 필요할 때는 주저하지 말고 도움을 요청하세요.",
            "오늘의 경험들이 내일의 지혜가 된다는 것을 기억하세요."
        ];

        this.warningData = [
            "성급한 결정은 후회를 남길 수 있습니다. 신중하게 생각해보세요.",
            "감정적인 대화는 피하고 차분한 마음으로 소통하세요.",
            "금전 관련 거래나 계약서 작성 시 세심한 주의가 필요합니다.",
            "과로나 스트레스로 인한 건강 악화에 주의하세요.",
            "SNS 게시물이나 메시지 전송 시 신중함이 필요합니다.",
            "교통사고나 안전사고에 각별히 주의하세요.",
            "타인의 말을 곧이곧대로 믿기보다는 확인하는 습관을 가지세요.",
            "중요한 물건이나 서류 분실에 주의하세요.",
            "음주나 야식은 건강에 해로울 수 있으니 절제하세요.",
            "개인정보 유출이나 보안에 각별히 신경쓰세요.",
            "약속 시간이나 스케줄 관리에 더욱 꼼꼼함이 필요합니다.",
            "가족이나 연인과의 사소한 갈등이 커지지 않도록 주의하세요.",
            "투자나 도박성 행위는 신중하게 접근하세요.",
            "날씨 변화에 따른 감기나 몸살에 주의하세요.",
            "온라인 쇼핑이나 충동구매를 자제하는 것이 좋겠습니다.",
            "험담이나 뒷담화에 참여하지 않는 것이 현명합니다.",
            "새로운 사람과의 만남에서 너무 개인적인 정보 공개는 피하세요.",
            "화가 날 때는 즉시 반응하지 말고 시간을 두고 생각해보세요.",
            "과한 약속이나 커미트먼트는 나중에 부담이 될 수 있습니다.",
            "오래된 친구나 지인과의 금전 거래는 신중하게 결정하세요.",
            "건강 이상 신호를 무시하지 말고 적절한 조치를 취하세요.",
            "익숙하지 않은 길이나 장소에서는 안전에 더욱 주의하세요.",
            "중요한 업무나 약속을 놓치지 않도록 미리 확인하세요.",
            "타인의 부탁이나 제안을 무조건 수락하기보다는 신중히 판단하세요.",
            "피로나 스트레스가 누적되지 않도록 적절한 휴식을 취하세요."
        ];

        this.luckyElements = {
            numbers: [1, 3, 7, 8, 9, 13, 17, 21, 25, 33, 42, 77, 88, 99],
            colors: ['빨간색', '파란색', '노란색', '초록색', '보라색', '분홍색', '흰색', '검정색', '주황색', '금색', '은색', '갈색'],
            directions: ['동쪽', '서쪽', '남쪽', '북쪽', '북동쪽', '북서쪽', '남동쪽', '남서쪽'],
            times: ['오전 6시', '오전 9시', '정오 12시', '오후 2시', '오후 3시', '오후 6시', '오후 8시', '밤 10시'],
            items: ['반지', '목걸이', '시계', '지갑', '열쇠고리', '향수', '모자', '선글라스', '가방', '신발', '책', '펜', '수첩', '휴대폰 케이스', '스카프'],
            foods: ['사과', '바나나', '딸기', '포도', '오렌지', '키위', '망고', '체리', '블루베리', '파인애플', '수박', '멜론', '복숭아', '자두', '라즈베리']
        };

        this.zodiacSigns = {
            aries: { name: '양자리', dates: '3.21-4.19', element: '불', color: '#FF6B6B' },
            taurus: { name: '황소자리', dates: '4.20-5.20', element: '땅', color: '#4ECDC4' },
            gemini: { name: '쌍둥이자리', dates: '5.21-6.21', element: '공기', color: '#45B7D1' },
            cancer: { name: '게자리', dates: '6.22-7.22', element: '물', color: '#96CEB4' },
            leo: { name: '사자자리', dates: '7.23-8.22', element: '불', color: '#FFEAA7' },
            virgo: { name: '처녀자리', dates: '8.23-9.22', element: '땅', color: '#DDA0DD' },
            libra: { name: '천칭자리', dates: '9.23-10.22', element: '공기', color: '#98D8C8' },
            scorpio: { name: '전갈자리', dates: '10.23-11.22', element: '물', color: '#F7DC6F' },
            sagittarius: { name: '사수자리', dates: '11.23-12.21', element: '불', color: '#BB8FCE' },
            capricorn: { name: '염소자리', dates: '12.22-1.19', element: '땅', color: '#85C1E9' },
            aquarius: { name: '물병자리', dates: '1.20-2.18', element: '공기', color: '#F8C471' },
            pisces: { name: '물고기자리', dates: '2.19-3.20', element: '물', color: '#82E0AA' }
        };

        this.chineseZodiac = {
            rat: { name: '쥐띠', hanja: '자(子)', years: [1984, 1996, 2008, 2020], element: '물', color: '#6c5ce7' },
            ox: { name: '소띠', hanja: '축(丑)', years: [1985, 1997, 2009, 2021], element: '땅', color: '#a29bfe' },
            tiger: { name: '호랑이띠', hanja: '인(寅)', years: [1986, 1998, 2010, 2022], element: '나무', color: '#fd79a8' },
            rabbit: { name: '토끼띠', hanja: '묘(卯)', years: [1987, 1999, 2011, 2023], element: '나무', color: '#e84393' },
            dragon: { name: '용띠', hanja: '진(辰)', years: [1988, 2000, 2012, 2024], element: '땅', color: '#00b894' },
            snake: { name: '뱀띠', hanja: '사(巳)', years: [1989, 2001, 2013, 2025], element: '불', color: '#00cec9' },
            horse: { name: '말띠', hanja: '오(午)', years: [1990, 2002, 2014, 2026], element: '불', color: '#55a3ff' },
            goat: { name: '양띠', hanja: '미(未)', years: [1991, 2003, 2015, 2027], element: '땅', color: '#a4b0be' },
            monkey: { name: '원숭이띠', hanja: '신(申)', years: [1992, 2004, 2016, 2028], element: '금속', color: '#ffeaa7' },
            rooster: { name: '닭띠', hanja: '유(酉)', years: [1993, 2005, 2017, 2029], element: '금속', color: '#fab1a0' },
            dog: { name: '개띠', hanja: '술(戌)', years: [1994, 2006, 2018, 2030], element: '땅', color: '#fd79a8' },
            pig: { name: '돼지띠', hanja: '해(亥)', years: [1995, 2007, 2019, 2031], element: '물', color: '#e17055' }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 별자리 선택 (토글 기능 포함)
        document.querySelectorAll('.zodiac-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const currentBtn = e.currentTarget;
                const wasSelected = currentBtn.classList.contains('selected');
                
                // 모든 별자리 버튼 선택 해제
                document.querySelectorAll('.zodiac-btn').forEach(b => b.classList.remove('selected'));
                
                if (wasSelected) {
                    // 이미 선택된 버튼을 다시 클릭하면 선택 해제
                    this.selectedZodiac = null;
                } else {
                    // 새로운 버튼 선택
                    currentBtn.classList.add('selected');
                    this.selectedZodiac = currentBtn.dataset.sign;
                }
                this.checkAndGenerateFortune();
            });
        });

        // 12지신 선택 (토글 기능 포함)
        document.querySelectorAll('.chinese-zodiac-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const currentBtn = e.currentTarget;
                const wasSelected = currentBtn.classList.contains('selected');
                
                // 모든 12지신 버튼 선택 해제
                document.querySelectorAll('.chinese-zodiac-btn').forEach(b => b.classList.remove('selected'));
                
                if (wasSelected) {
                    // 이미 선택된 버튼을 다시 클릭하면 선택 해제
                    this.selectedAnimal = null;
                } else {
                    // 새로운 버튼 선택
                    currentBtn.classList.add('selected');
                    this.selectedAnimal = currentBtn.dataset.animal;
                }
                this.checkAndGenerateFortune();
            });
        });


        // 결과 액션 버튼들
        document.getElementById('shareFortune').addEventListener('click', () => {
            this.shareFortune();
        });
    }

    checkAndGenerateFortune() {
        // 별자리와 12지신이 모두 선택되면 자동으로 운세 생성
        if (this.selectedZodiac && this.selectedAnimal) {
            this.generateCompleteFortune();
        } else if (this.selectedZodiac) {
            this.generateZodiacFortune();
        } else if (this.selectedAnimal) {
            this.generateAnimalFortune();
        } else {
            // 아무것도 선택되지 않으면 결과 숨기기
            document.getElementById('fortuneResult').style.display = 'none';
        }
    }

    generateCompleteFortune() {
        const zodiacInfo = this.zodiacSigns[this.selectedZodiac];
        const animalInfo = this.chineseZodiac[this.selectedAnimal];
        const seed = this.getTodaySeed() + this.selectedZodiac.length + this.selectedAnimal.length;
        
        const fortune = {
            title: `${zodiacInfo.name} × ${animalInfo.name} 운세`,
            general: this.getRandomWithSeed(this.fortuneData.general, seed),
            love: this.getRandomWithSeed(this.fortuneData.love, seed + 1),
            money: this.getRandomWithSeed(this.fortuneData.money, seed + 2),
            health: this.getRandomWithSeed(this.fortuneData.health, seed + 3),
            work: this.getRandomWithSeed(this.fortuneData.work, seed + 4),
            advice: this.getRandomWithSeed(this.adviceData, seed + 5),
            warning: this.getRandomWithSeed(this.warningData, seed + 6),
            lucky: this.generateLuckyElements(seed),
            scores: this.generateScores(seed),
            userInfo: `${zodiacInfo.name} (${zodiacInfo.dates}) × ${animalInfo.name} (${animalInfo.hanja})`
        };
        
        this.displayFortune(fortune, 'complete');
    }

    generateZodiacFortune() {
        const zodiacInfo = this.zodiacSigns[this.selectedZodiac];
        const seed = this.getTodaySeed() + this.selectedZodiac.length;
        
        const fortune = {
            title: `${zodiacInfo.name} 운세`,
            general: this.getRandomWithSeed(this.fortuneData.general, seed),
            love: this.getRandomWithSeed(this.fortuneData.love, seed + 1),
            money: this.getRandomWithSeed(this.fortuneData.money, seed + 2),
            health: this.getRandomWithSeed(this.fortuneData.health, seed + 3),
            work: this.getRandomWithSeed(this.fortuneData.work, seed + 4),
            advice: this.getRandomWithSeed(this.adviceData, seed + 5),
            warning: this.getRandomWithSeed(this.warningData, seed + 6),
            lucky: this.generateLuckyElements(seed),
            scores: this.generateScores(seed),
            userInfo: `${zodiacInfo.name} (${zodiacInfo.dates})`
        };
        
        this.displayFortune(fortune, 'zodiac');
    }

    generateAnimalFortune() {
        const animalInfo = this.chineseZodiac[this.selectedAnimal];
        const seed = this.getTodaySeed() + this.selectedAnimal.length;
        
        const fortune = {
            title: `${animalInfo.name} 운세`,
            general: this.getRandomWithSeed(this.fortuneData.general, seed),
            love: this.getRandomWithSeed(this.fortuneData.love, seed + 1),
            money: this.getRandomWithSeed(this.fortuneData.money, seed + 2),
            health: this.getRandomWithSeed(this.fortuneData.health, seed + 3),
            work: this.getRandomWithSeed(this.fortuneData.work, seed + 4),
            advice: this.getRandomWithSeed(this.adviceData, seed + 5),
            warning: this.getRandomWithSeed(this.warningData, seed + 6),
            lucky: this.generateLuckyElements(seed),
            scores: this.generateScores(seed),
            userInfo: `${animalInfo.name} (${animalInfo.hanja})`
        };
        
        this.displayFortune(fortune, 'animal');
    }


    getTodaySeed() {
        const today = new Date();
        return today.getDate() + today.getMonth() * 31 + today.getFullYear();
    }

    getRandomWithSeed(array, seed) {
        const index = Math.abs(Math.sin(seed) * 10000) % array.length;
        return array[Math.floor(index)];
    }

    generateScores(seed) {
        return {
            general: this.generateSingleScore(seed),
            love: this.generateSingleScore(seed + 1),
            money: this.generateSingleScore(seed + 2),
            health: this.generateSingleScore(seed + 3),
            work: this.generateSingleScore(seed + 4)
        };
    }

    generateSingleScore(seed) {
        const score = Math.abs(Math.sin(seed) * 5) + 1;
        return Math.min(5, Math.max(1, Math.floor(score)));
    }

    generateLuckyElements(seed) {
        return {
            number: this.getRandomWithSeed(this.luckyElements.numbers, seed),
            color: this.getRandomWithSeed(this.luckyElements.colors, seed + 1),
            direction: this.getRandomWithSeed(this.luckyElements.directions, seed + 2),
            time: this.getRandomWithSeed(this.luckyElements.times, seed + 3),
            item: this.getRandomWithSeed(this.luckyElements.items, seed + 4),
            food: this.getRandomWithSeed(this.luckyElements.foods, seed + 5)
        };
    }

    displayFortune(fortune, type, extra = '') {
        this.currentFortune = { ...fortune, type, extra };
        
        // 환영 카드 숨기기
        document.getElementById('welcomeCard').style.display = 'none';
        
        // 제목 설정
        document.getElementById('fortuneTitle').textContent = fortune.title;
        
        // 오늘 날짜 표시
        const today = new Date();
        document.getElementById('todayDate').textContent = 
            `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 ${this.getKoreanDay(today.getDay())}`;
        
        // 사용자 정보 표시
        const userInfoElement = document.getElementById('userInfo');
        if (fortune.userInfo) {
            userInfoElement.textContent = fortune.userInfo;
            userInfoElement.style.display = 'block';
        } else {
            userInfoElement.style.display = 'none';
        }

        // 운세 텍스트 업데이트
        document.getElementById('generalFortune').textContent = fortune.general;
        
        if (fortune.love && !fortune.category) {
            document.getElementById('loveFortune').textContent = fortune.love;
        }
        if (fortune.money && !fortune.category) {
            document.getElementById('moneyFortune').textContent = fortune.money;
        }
        if (fortune.health && !fortune.category) {
            document.getElementById('healthFortune').textContent = fortune.health;
        }
        if (fortune.work && !fortune.category) {
            document.getElementById('workFortune').textContent = fortune.work;
        }

        // 카테고리별 운세인 경우 해당 카테고리만 표시
        if (fortune.category && fortune.category !== 'today') {
            document.querySelectorAll('.fortune-categories .fortune-card').forEach(card => {
                card.style.display = 'none';
            });
            
            const categoryCards = {
                love: document.getElementById('loveFortune').closest('.fortune-card'),
                money: document.getElementById('moneyFortune').closest('.fortune-card'),
                health: document.getElementById('healthFortune').closest('.fortune-card'),
                work: document.getElementById('workFortune').closest('.fortune-card')
            };
            
            if (categoryCards[fortune.category]) {
                categoryCards[fortune.category].style.display = 'block';
                document.getElementById(fortune.category + 'Fortune').textContent = fortune[fortune.category];
            }
        } else {
            // 모든 카테고리 표시
            document.querySelectorAll('.fortune-categories .fortune-card').forEach(card => {
                card.style.display = 'block';
            });
        }

        // 점수 업데이트
        this.updateScores(fortune.scores);
        
        // 행운 요소 업데이트
        if (fortune.lucky) {
            document.getElementById('luckyNumber').textContent = fortune.lucky.number;
            document.getElementById('luckyColor').textContent = fortune.lucky.color;
            document.getElementById('luckyDirection').textContent = fortune.lucky.direction;
            document.getElementById('luckyTime').textContent = fortune.lucky.time;
            document.getElementById('luckyItem').textContent = fortune.lucky.item;
            document.getElementById('luckyFood').textContent = fortune.lucky.food;
        }
        
        // 조언 업데이트
        if (fortune.advice) {
            document.getElementById('dailyAdvice').textContent = fortune.advice;
        }
        
        // 주의사항 업데이트
        if (fortune.warning) {
            document.getElementById('dailyWarning').textContent = fortune.warning;
        }
        
        // 결과 섹션 표시
        document.getElementById('fortuneResult').style.display = 'block';
        
        // 부드러운 스크롤
        document.getElementById('fortuneResult').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    updateScores(scores) {
        const getStars = (score) => {
            return '★'.repeat(score) + '☆'.repeat(5 - score);
        };

        if (scores.general !== undefined) {
            document.getElementById('generalScore').textContent = getStars(scores.general);
        }
        if (scores.love !== undefined) {
            document.getElementById('loveScore').textContent = getStars(scores.love);
        }
        if (scores.money !== undefined) {
            document.getElementById('moneyScore').textContent = getStars(scores.money);
        }
        if (scores.health !== undefined) {
            document.getElementById('healthScore').textContent = getStars(scores.health);
        }
        if (scores.work !== undefined) {
            document.getElementById('workScore').textContent = getStars(scores.work);
        }
    }

    getKoreanDay(day) {
        const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
        return days[day];
    }


    shareFortune() {
        if (!this.currentFortune) return;

        // 현재 페이지 URL 복사
        const currentUrl = window.location.href;
        
        navigator.clipboard.writeText(currentUrl).then(() => {
            Swal.fire({
                icon: 'success',
                title: '링크 복사 완료!',
                text: '오늘의 운세 페이지 링크가 클립보드에 복사되었습니다.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }).catch((err) => {
            Swal.fire({
                icon: 'error',
                title: '복사 실패',
                text: '링크 복사에 실패했습니다. 다시 시도해주세요.',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : 'linear-gradient(135deg, #9C27B0, #673AB7)'};
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(156, 39, 176, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
const dailyFortune = new DailyFortune();

// 페이지 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
});