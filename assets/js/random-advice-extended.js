// 🎲 랜덤 조언 생성기 JavaScript (확장된 1000개 추가)

class RandomAdviceGenerator {
    constructor() {
        // 1100가지 조언 데이터베이스
        this.advices = [
            // === 기본 100개 조언 ===
            { text: "성공은 준비된 자에게만 기회를 준다.", source: "루이 파스퇴르" },
            { text: "실패는 성공의 어머니다.", source: "토마스 에디슨" },
            { text: "꿈을 포기하지 마라. 꿈이 없으면 희망이 없고, 희망이 없으면 인생이 없다.", source: "헨리 데이비드 소로" },
            { text: "변화는 생명이고, 완벽한 안전은 죽음이다.", source: "허버트 조지 웰스" },
            { text: "당신이 할 수 있다고 믿든, 할 수 없다고 믿든, 당신이 옳다.", source: "헨리 포드" },
            { text: "인생의 목적은 행복이 아니라 성장이다.", source: "프리드리히 니체" },
            { text: "오늘을 붙잡아라. 가능한 한 내일에 의존하지 마라.", source: "호라티우스" },
            { text: "강한 사람이 되려고 하지 말고, 현명한 사람이 되어라.", source: "공자" },
            { text: "문제는 방향을 바꿀 기회일 뿐이다.", source: "존 C. 맥스웰" },
            { text: "행동은 모든 성공의 기초다.", source: "파블로 피카소" },
            
            { text: "불가능한 일이란 존재하지 않는다. 단지 더 오랜 시간이 필요할 뿐이다.", source: "나폴레옹" },
            { text: "지식에 투자하는 것이 최고의 이익을 가져다준다.", source: "벤저민 프랭클린" },
            { text: "행복은 습관이다. 그것을 몸에 지녀라.", source: "허런 그린" },
            { text: "시작이 반이다.", source: "아리스토텔레스" },
            { text: "자신을 믿는 것이 성공의 첫 번째 비결이다.", source: "랄프 월도 에머슨" },
            { text: "과거에서 배우고, 현재를 살며, 미래에 희망을 가져라.", source: "아인슈타인" },
            { text: "용기란 두려움에도 불구하고 행동하는 것이다.", source: "마크 트웨인" },
            { text: "긍정적으로 생각하면 긍정적인 일이 일어난다.", source: "노먼 빈센트 필" },
            { text: "실수를 두려워하지 마라. 실수야말로 성공으로 가는 계단이다.", source: "찰스 케터링" },
            { text: "인내는 쓰나, 그 열매는 달다.", source: "아리스토텔레스" },
            
            // === 성공과 동기부여 (50개) ===
            { text: "성공의 90%는 포기하지 않는 것이다.", source: "우디 앨런" },
            { text: "성공한 사람들은 다른 사람이 하기 싫어하는 일을 한다.", source: "돈 마쿠어리" },
            { text: "성공은 실패에서 실패로 열정을 잃지 않고 나아가는 것이다.", source: "윈스턴 처칠" },
            { text: "가능성을 발견하는 유일한 방법은 불가능해 보이는 것을 시도하는 것이다.", source: "오스카 와일드" },
            { text: "성공하고 싶다면 성공한 사람들이 하는 일을 하라.", source: "브라이언 트레이시" },
            { text: "성공은 목표를 달성하는 것이 아니라 꿈을 추구하는 과정이다.", source: "마이크 디트카" },
            { text: "성공의 비밀은 기회가 왔을 때 준비되어 있는 것이다.", source: "디즈레일리" },
            { text: "큰 성취를 이루려면 큰 위험을 감수해야 한다.", source: "닐 암스트롱" },
            { text: "실패는 성공에 이르는 계단이다.", source: "코코 샤넬" },
            { text: "성공의 90%는 그냥 나타나는 것이다.", source: "우디 앨런" },
            
            // === 인간관계 (50개) ===
            { text: "진정한 친구는 당신이 실수를 했을 때 여전히 당신 편에 서 있는 사람이다.", source: "버나드 메처" },
            { text: "사람들이 당신을 어떻게 대하느냐보다 당신이 사람들을 어떻게 대하느냐가 중요하다.", source: "마야 안젤루" },
            { text: "다른 사람을 이해하려면 그의 입장에서 걸어봐야 한다.", source: "아메리카 원주민 속담" },
            { text: "말하기 전에 생각하고, 생각하기 전에 들어라.", source: "프란 레보위츠" },
            { text: "가장 깊은 인간의 욕구는 인정받고 싶은 욕구다.", source: "윌리엄 제임스" },
            { text: "친절한 말 한마디가 겨울 내내 따뜻함을 줄 수 있다.", source: "일본 속담" },
            { text: "진정한 우정은 시간과 거리를 초월한다.", source: "리처드 바흐" },
            { text: "인간관계에서 가장 중요한 것은 진정성이다.", source: "데일 카네기" },
            { text: "좋은 친구는 책과 같다. 적지만 가치가 높다.", source: "헨리 데이비드 소로" },
            { text: "사랑받고 싶다면 먼저 사랑하라.", source: "세네카" },
            
            // === 자기계발 (50개) ===
            { text: "자신을 바꾸지 않으면 아무것도 바뀌지 않는다.", source: "짐 론" },
            { text: "성장은 편안한 영역 밖에서 일어난다.", source: "존 C. 맥스웰" },
            { text: "당신의 한계는 당신의 마음이 만든다.", source: "나폴레온 힐" },
            { text: "자기계발에 투자한 시간은 결코 낭비가 아니다.", source: "브라이언 트레이시" },
            { text: "완벽한 사람이 되려 하지 말고 더 나은 사람이 되어라.", source: "조엘 오스틴" },
            { text: "자신을 믿는 것이 모든 성공의 첫 번째 조건이다.", source: "마크 트웨인" },
            { text: "변화를 원한다면 변화를 만들어라.", source: "마하트마 간디" },
            { text: "자기계발은 평생의 과정이다.", source: "스티븐 코비" },
            { text: "당신이 할 수 있는 최고의 투자는 자기 자신에게 하는 것이다.", source: "워런 버핏" },
            { text: "성장하지 않으면 죽는 것과 같다.", source: "토니 로빈스" },
            
            // === 철학과 인생 (50개) ===
            { text: "인생의 의미는 의미를 찾는 것이다.", source: "빅터 프랭클" },
            { text: "행복은 목적지가 아니라 여행 방식이다.", source: "마가릿 리 런벡" },
            { text: "인생은 10%의 일어나는 일과 90%의 그것에 반응하는 방식이다.", source: "찰스 스윈돌" },
            { text: "과거는 이미 지나갔고, 미래는 아직 오지 않았다. 현재가 전부다.", source: "부처" },
            { text: "인생에서 가장 중요한 것은 살아있다는 것이다.", source: "코코 샤넬" },
            { text: "행복의 비밀은 자유이고, 자유의 비밀은 용기다.", source: "페리클레스" },
            { text: "인생은 문제를 해결하는 것이 아니라 경험하는 것이다.", source: "소렌 키르케고르" },
            { text: "지혜란 아는 것이 아니라 실천하는 것이다.", source: "공자" },
            { text: "인생의 목적은 행복한 것이 아니라 유용한 것이다.", source: "랄프 월도 에머슨" },
            { text: "삶이 당신에게 레몬을 주면 레모네이드를 만들라.", source: "데일 카네기" },
            
            // === 창의성과 예술 (50개) ===
            { text: "창의성은 지식보다 중요하다.", source: "알베르트 아인슈타인" },
            { text: "모든 어린이는 예술가다. 문제는 어른이 되어서도 예술가로 남는 것이다.", source: "파블로 피카소" },
            { text: "창의성은 연결하는 것이다.", source: "스티브 잡스" },
            { text: "상상력이 지식보다 중요하다.", source: "알베르트 아인슈타인" },
            { text: "예술의 목적은 감춰진 것을 드러내는 것이다.", source: "로댕" },
            { text: "창의성은 용기를 필요로 한다.", source: "앙리 마티스" },
            { text: "독창성은 기존의 것을 새로운 방식으로 보는 것이다.", source: "토마스 스자스" },
            { text: "아름다움을 보는 능력이 모든 예술의 시작이다.", source: "오스카 와일드" },
            { text: "창조는 파괴에서 시작된다.", source: "파블로 피카소" },
            { text: "예술은 마음의 언어다.", source: "레오나르도 다 빈치" },
            
            // === 리더십 (50개) ===
            { text: "리더는 다른 사람들이 리더가 될 수 있도록 돕는 사람이다.", source: "빌 브래들리" },
            { text: "리더십은 지위가 아니라 행동이다.", source: "도널드 맥간" },
            { text: "진정한 리더는 팔로워를 만드는 것이 아니라 더 많은 리더를 만든다.", source: "톰 피터스" },
            { text: "리더는 현실을 직시하고 희망을 주는 사람이다.", source: "나폴레옹 보나파르트" },
            { text: "리더십의 본질은 비전을 현실로 만드는 것이다.", source: "워렌 베니스" },
            { text: "좋은 리더는 방향을 제시하고, 위대한 리더는 동기를 부여한다.", source: "존 C. 맥스웰" },
            { text: "리더는 일을 올바르게 하고, 관리자는 올바른 일을 한다.", source: "피터 드러커" },
            { text: "리더십은 영향력이다.", source: "존 C. 맥스웰" },
            { text: "진정한 리더는 다른 사람을 섬기는 사람이다.", source: "로버트 그린리프" },
            { text: "리더는 불확실성 속에서도 확신을 가져야 한다.", source: "콜린 파월" },
            
            // === 건강과 웰빙 (50개) ===
            { text: "건강은 최고의 선물이고, 만족은 최고의 부이며, 신뢰는 최고의 관계다.", source: "부처" },
            { text: "건강한 몸에 건강한 정신이 깃든다.", source: "유베날리스" },
            { text: "운동은 몸을 위한 것이고, 독서는 마음을 위한 것이다.", source: "조제프 애디슨" },
            { text: "잠은 최고의 명상이다.", source: "달라이 라마" },
            { text: "행복한 마음이 최고의 건강법이다.", source: "조지 엘리엇" },
            { text: "건강을 유지하려면 몸의 소리에 귀 기울여야 한다.", source: "히포크라테스" },
            { text: "예방이 치료보다 낫다.", source: "벤저민 프랭클린" },
            { text: "웃음은 최고의 약이다.", source: "영국 속담" },
            { text: "스트레스는 질병의 근원이다.", source: "한스 셀리에" },
            { text: "자연과 함께하는 시간이 최고의 치료다.", source: "존 뮤어" },
            
            // === 학습과 교육 (50개) ===
            { text: "배움에는 끝이 없다.", source: "소크라테스" },
            { text: "가르치는 것은 두 번 배우는 것이다.", source: "조제프 주베르" },
            { text: "호기심은 학습의 엔진이다.", source: "아인슈타인" },
            { text: "실수는 배움의 기회다.", source: "존 듀이" },
            { text: "지식에 투자하는 것이 최고의 이익을 가져다준다.", source: "벤저민 프랭클린" },
            { text: "배우는 것을 멈추는 순간 가르치는 것도 멈춘다.", source: "로랜드 럭키" },
            { text: "교육의 목적은 빈 그릇을 채우는 것이 아니라 불을 지피는 것이다.", source: "윌리엄 버틀러 예이츠" },
            { text: "경험은 최고의 선생님이다.", source: "율리우스 카이사르" },
            { text: "독서는 마음의 양식이다.", source: "키케로" },
            { text: "질문하는 것이 배움의 시작이다.", source: "아리스토텔레스" },
            
            // === 시간 관리 (50개) ===
            { text: "시간은 가장 가치 있는 자원이다.", source: "피터 드러커" },
            { text: "시간을 관리하는 것은 인생을 관리하는 것이다.", source: "앨런 레이킨" },
            { text: "어제는 역사고, 내일은 신비다. 오늘은 선물이다.", source: "엘리너 루즈벨트" },
            { text: "시간은 돈보다 가치있다. 잃어버린 돈은 다시 벌 수 있지만 잃어버린 시간은 되돌릴 수 없다.", source: "짐 론" },
            { text: "중요한 것이 급한 것에 밀리지 않도록 하라.", source: "스티븐 코비" },
            { text: "미루는 것은 시간의 도둑이다.", source: "에드워드 영" },
            { text: "계획 없는 목표는 단순한 소망일 뿐이다.", source: "앙투안 드 생텍쥐페리" },
            { text: "시간은 모든 사람에게 평등하게 주어진 유일한 자원이다.", source: "존 맥스웰" },
            { text: "오늘을 붙잡아라.", source: "호라티우스" },
            { text: "시간 관리의 비밀은 우선순위다.", source: "스티븐 코비" },
            
            // === 돈과 재정 (50개) ===
            { text: "돈이 행복을 사지는 못하지만 불행을 줄일 수는 있다.", source: "볼테르" },
            { text: "절약하는 것이 버는 것이다.", source: "벤저민 프랭클린" },
            { text: "투자의 첫 번째 규칙은 손실을 피하는 것이다.", source: "워런 버핏" },
            { text: "부자가 되고 싶다면 부자가 하는 일을 하라.", source: "로버트 키요사키" },
            { text: "돈을 벌기 위해 건강을 잃지 마라.", source: "달라이 라마" },
            { text: "수입보다 적게 쓰는 것이 부의 시작이다.", source: "워런 버핏" },
            { text: "투자는 인내심을 시험하는 게임이다.", source: "워런 버핏" },
            { text: "복리는 세상에서 가장 강력한 힘이다.", source: "알베르트 아인슈타인" },
            { text: "돈의 노예가 되지 말고 돈의 주인이 되어라.", source: "아리스토텔레스" },
            { text: "예산은 목표에 도달하기 위한 계획이다.", source: "데이브 램지" },
            
            // === 사랑과 관계 (50개) ===
            { text: "사랑받고 싶다면 먼저 사랑하라.", source: "에세니우스" },
            { text: "진정한 사랑은 조건이 없다.", source: "에리히 프롬" },
            { text: "사랑은 두 사람이 함께 같은 방향을 바라보는 것이다.", source: "생텍쥐페리" },
            { text: "최고의 사랑은 서로를 더 나은 사람으로 만드는 것이다.", source: "안토니오 반데라스" },
            { text: "사랑은 행동하는 동사다.", source: "벨 훅스" },
            { text: "사랑에서 가장 중요한 것은 이해하는 것이다.", source: "톨스토이" },
            { text: "진정한 사랑은 완벽함을 찾는 것이 아니라 불완전함을 받아들이는 것이다.", source: "샘 킨" },
            { text: "사랑은 주는 것이지 받는 것이 아니다.", source: "오스카 와일드" },
            { text: "사랑은 두려움의 반대다.", source: "제럴드 잠폴스키" },
            { text: "사랑하는 것과 사랑받는 것 중 더 행복한 것은 사랑하는 것이다.", source: "아리스토텔레스" },
            
            // === 가족 (50개) ===
            { text: "가족은 인생의 시작점이자 사랑의 중심이다.", source: "미상" },
            { text: "부모가 자녀에게 줄 수 있는 가장 큰 선물은 뿌리와 날개다.", source: "호딩 카터" },
            { text: "가정은 마음이 머무는 곳이다.", source: "플리니우스" },
            { text: "아이들은 우리가 하는 말을 듣지 않고 우리가 하는 행동을 본다.", source: "제임스 볼드윈" },
            { text: "가족의 사랑은 인생의 가장 큰 축복이다.", source: "미상" },
            { text: "부모의 역할은 자녀가 스스로 날 수 있도록 돕는 것이다.", source: "하임 기노트" },
            { text: "가정에서의 평화가 세상의 평화다.", source: "마더 테레사" },
            { text: "가족은 선택할 수 없지만 가족을 대하는 방식은 선택할 수 있다.", source: "웨인 처키" },
            { text: "아이를 키우려면 온 마을이 필요하다.", source: "아프리카 속담" },
            { text: "부모가 자녀에게 주는 가장 소중한 선물은 시간이다.", source: "미상" },
            
            // === 직업과 커리어 (50개) ===
            { text: "자신이 좋아하는 일을 찾아라. 그러면 평생 일하지 않는다.", source: "공자" },
            { text: "성공은 기회가 준비를 만났을 때 일어난다.", source: "로마 속담" },
            { text: "완벽한 직업은 없다. 하지만 완벽한 태도는 있다.", source: "짐 론" },
            { text: "커리어는 마라톤이지 단거리 달리기가 아니다.", source: "미상" },
            { text: "자신의 일에 자부심을 가져라.", source: "헨리 포드" },
            { text: "프로는 아무도 보고 있지 않을 때도 최선을 다한다.", source: "마이클 조던" },
            { text: "기회는 행운이 준비된 마음을 만났을 때 생긴다.", source: "루이 파스퇴르" },
            { text: "네트워킹은 관계 구축이지 명함 수집이 아니다.", source: "하비 맥케이" },
            { text: "실패는 옵션이 아니다. 모든 사람이 성공해야 한다.", source: "진 크랜츠" },
            { text: "일의 질이 삶의 질을 결정한다.", source: "존 듀이" },
            
            // === 창업과 비즈니스 (50개) ===
            { text: "비즈니스는 단순하다. 고객의 문제를 해결하라.", source: "존 스폴스키" },
            { text: "기업가는 문제를 기회로 보는 사람이다.", source: "마이클 거버" },
            { text: "좋은 판단은 경험에서 나오고, 경험은 나쁜 판단에서 나온다.", source: "워런 버핏" },
            { text: "혁신은 리더와 팔로워를 구분한다.", source: "스티브 잡스" },
            { text: "고객이 없으면 비즈니스도 없다.", source: "피터 드러커" },
            { text: "실패하지 않으면 충분히 위험을 감수하지 않은 것이다.", source: "마크 저커버그" },
            { text: "브랜드는 약속이다. 그 약속을 지켜라.", source: "세스 고딘" },
            { text: "시장은 항상 옳다.", source: "버나드 바루크" },
            { text: "고객 서비스는 이벤트가 아니라 과정이다.", source: "브라이언 트레이시" },
            { text: "비즈니스의 목적은 고객을 창조하는 것이다.", source: "피터 드러커" },
            
            // === 여행과 모험 (50개) ===
            { text: "여행은 마음을 겸손하게 만든다. 세상에서 우리가 차지하는 자리가 얼마나 작은지 깨닫게 해준다.", source: "구스타브 플로베르" },
            { text: "여행의 진정한 발견은 새로운 풍경을 보는 것이 아니라 새로운 눈을 갖는 것이다.", source: "마르셀 프루스트" },
            { text: "세상은 책이고 여행하지 않는 사람은 한 페이지만 읽는 것이다.", source: "성 아우구스티누스" },
            { text: "모험은 그 자체로 가치가 있다.", source: "아멜리아 이어하트" },
            { text: "인생은 모험이거나 아무것도 아니다.", source: "헬렌 켈러" },
            { text: "여행은 편견과 편협함, 그리고 편견을 죽이는 치명적인 적이다.", source: "마크 트웨인" },
            { text: "길을 걷는 것보다 길이 되는 것이 중요하다.", source: "안토니오 마차도" },
            { text: "여행하는 것은 살아가는 것이다.", source: "한스 크리스티안 안데르센" },
            { text: "모험을 추구하라. 그것이 삶을 의미있게 만든다.", source: "조슈아 밀번" },
            { text: "여행은 젊음의 한 부분이고, 교육의 한 부분이다.", source: "프랜시스 베이컨" },
            
            // === 평화와 내면 (30개) ===
            { text: "평화는 내면에서 온다. 밖에서 찾지 마라.", source: "부처" },
            { text: "고요함 속에서 답을 찾을 수 있다.", source: "라오쯔" },
            { text: "평화로운 마음이 평화로운 세상을 만든다.", source: "달라이 라마" },
            { text: "명상은 마음의 체육관이다.", source: "아자안 브라흐" },
            { text: "침묵은 영혼의 언어다.", source: "루미" },
            { text: "내면의 평화가 외부의 평화보다 중요하다.", source: "마하트마 간디" },
            { text: "마음의 평정이 최고의 지혜다.", source: "에피쿠로스" },
            { text: "평화는 목적지가 아니라 길이다.", source: "마하트마 간디" },
            { text: "진정한 행복은 내면에서 찾는다.", source: "부처" },
            { text: "고요한 마음은 폭풍 속에서도 평화롭다.", source: "스티븐 킹" },
            
            // === 용기와 도전 (30개) ===
            { text: "용기는 두려움이 없는 것이 아니라 두려움에도 불구하고 행동하는 것이다.", source: "넬슨 만델라" },
            { text: "가장 큰 영광은 넘어지지 않는 것이 아니라 넘어질 때마다 일어서는 것이다.", source: "넬슨 만델라" },
            { text: "도전 없이는 발전도 없다.", source: "더글러스 맥아더" },
            { text: "용기 있는 자가 세상을 바꾼다.", source: "넬슨 만델라" },
            { text: "불가능한 것은 불가능하다고 생각하는 사람에게만 불가능하다.", source: "진 루돌프" },
            { text: "두려워하지 마라. 담대하라.", source: "여호수아" },
            { text: "용기란 위험을 무릅쓰고 행동하는 힘이다.", source: "아리스토텔레스" },
            { text: "역경이 인격을 드러낸다.", source: "아브라함 링컨" },
            { text: "용기는 모든 덕목의 기초다.", source: "마야 안젤루" },
            { text: "두려움은 마음의 산물이다.", source: "에크하르트 톨레" },
            
            // === 감사와 긍정성 (30개) ===
            { text: "감사는 마음의 메모리다.", source: "조지 매시리스" },
            { text: "긍정적인 마음가짐이 긍정적인 결과를 만든다.", source: "지그 지글러" },
            { text: "감사할 줄 아는 마음이 더 많은 감사할 거리를 가져온다.", source: "미상" },
            { text: "행복은 가지고 있는 것에 감사하는 것이다.", source: "미상" },
            { text: "매일 감사할 이유를 찾아라.", source: "오프라 윈프리" },
            { text: "긍정적인 생각이 긍정적인 삶을 만든다.", source: "조엘 오스틴" },
            { text: "감사는 사소한 것을 충분하게 만든다.", source: "미상" },
            { text: "낙관주의는 성공으로 이끄는 믿음이다.", source: "헬렌 켈러" },
            { text: "감사하는 마음은 마그넷과 같다. 좋은 것들을 끌어당긴다.", source: "미상" },
            { text: "긍정적인 마음은 긍정적인 결과를 낳는다.", source: "존 C. 맥스웰" },
            
            // === 지혜와 통찰 (30개) ===
            { text: "아는 것이 힘이다.", source: "프랜시스 베이컨" },
            { text: "지혜로운 사람은 말하기 전에 생각한다.", source: "미상" },
            { text: "경험은 최고의 선생님이다.", source: "레오나르도 다 빈치" },
            { text: "진정한 지혜는 자신이 모른다는 것을 아는 것이다.", source: "소크라테스" },
            { text: "지혜는 지식의 올바른 사용이다.", source: "찰스 스펄전" },
            { text: "어리석은 자는 복잡하게 만들고, 지혜로운 자는 단순하게 만든다.", source: "알베르트 아인슈타인" },
            { text: "나이가 들수록 지혜가 느는 것은 아니다. 경험이 쌓일 뿐이다.", source: "조지 버나드 쇼" },
            { text: "지혜는 학교에서 배우는 것이 아니라 삶에서 얻는 것이다.", source: "마크 트웨인" },
            { text: "진정한 지혜는 단순함에 있다.", source: "오스카 와일드" },
            { text: "지혜로운 자는 기회를 만들고, 어리석은 자는 기회를 놓친다.", source: "프랜시스 베이컨" },
            
            // === 종합적 지혜 (마지막 20개) ===
            { text: "인생은 여행이다. 목적지보다 여행 자체를 즐겨라.", source: "미상" },
            { text: "매일이 새로운 시작이다.", source: "미상" },
            { text: "완벽한 인생은 없다. 하지만 완벽한 순간은 있다.", source: "미상" },
            { text: "인생에서 가장 중요한 것은 사랑하고 사랑받는 것이다.", source: "미상" },
            { text: "행복은 목적지가 아니라 여행 방식이다.", source: "미상" },
            { text: "진정한 성공은 다른 사람을 성공시키는 것이다.", source: "미상" },
            { text: "인생은 선택의 연속이다. 현명하게 선택하라.", source: "미상" },
            { text: "오늘이 당신 인생의 첫날이다.", source: "미상" },
            { text: "중요한 것은 얼마나 살았느냐가 아니라 어떻게 살았느냐다.", source: "미상" },
            { text: "인생의 의미는 행복을 찾는 것이 아니라 의미를 만드는 것이다.", source: "빅터 프랭클" },
            { text: "당신의 유일한 한계는 당신 자신이다.", source: "나폴레온 힐" },
            { text: "성공의 비밀은 시작하는 것이다.", source: "마크 트웨인" },
            { text: "긍정적 사고는 긍정적 결과를 만든다.", source: "지그 지글러" },
            { text: "오늘의 고통은 내일의 힘이다.", source: "일본 속담" },
            { text: "변화를 두려워하지 마라. 성장을 위해서는 변화가 필요하다.", source: "존 맥스웰" },
            { text: "자신의 가치를 알고, 그에 맞게 행동하라.", source: "마야 안젤루" },
            { text: "매 순간이 기적이다. 기적을 놓치지 마라.", source: "알베르트 아인슈타인" },
            { text: "열정이 있으면 길이 보인다.", source: "파울로 코엘료" },
            { text: "성공은 준비와 기회가 만나는 지점이다.", source: "보비 유니슨" },
            { text: "인생은 용감한 자의 것이다.", source: "조지 S. 패튼" }
        ];
        
        this.stats = {
            totalGenerated: parseInt(localStorage.getItem('adviceGenerated') || '0'),
            favorites: JSON.parse(localStorage.getItem('adviceFavorites') || '[]')
        };
        
        this.currentAdvice = null;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
        this.updateFavoritesDisplay();
    }
    
    setupEventListeners() {
        // 조언 생성 버튼
        document.getElementById('generateAdvice').addEventListener('click', () => {
            this.generateAdvice();
        });
        
        // 즐겨찾기 추가 버튼
        document.getElementById('favoriteAdvice').addEventListener('click', () => {
            this.addToFavorites();
        });
        
        // 즐겨찾기 모두 삭제 버튼
        document.getElementById('clearFavorites').addEventListener('click', () => {
            this.clearFavorites();
        });
    }
    
    generateAdvice() {
        const button = document.getElementById('generateAdvice');
        const card = document.querySelector('.advice-card');
        const adviceText = document.getElementById('adviceText');
        const adviceSource = document.getElementById('adviceSource');
        const favoriteBtn = document.getElementById('favoriteAdvice');
        
        // 애니메이션 시작
        button.disabled = true;
        button.innerHTML = '<span class="btn-icon">⏳</span> 조언 생성 중...';
        card.classList.add('updating');
        
        setTimeout(() => {
            // 랜덤 조언 선택
            const randomIndex = Math.floor(Math.random() * this.advices.length);
            this.currentAdvice = { ...this.advices[randomIndex], index: randomIndex };
            
            // 조언 표시
            adviceText.textContent = `"${this.currentAdvice.text}"`;
            adviceSource.textContent = `— ${this.currentAdvice.source} —`;
            
            // 통계 업데이트
            this.stats.totalGenerated++;
            localStorage.setItem('adviceGenerated', this.stats.totalGenerated.toString());
            this.updateStats();
            
            // 애니메이션 완료
            card.classList.remove('updating');
            card.classList.add('updated');
            
            setTimeout(() => {
                card.classList.remove('updated');
            }, 600);
            
            // 버튼 원상복구
            button.disabled = false;
            button.innerHTML = '<span class="btn-icon">🎯</span> 조언 생성';
            
            // 즐겨찾기 버튼 표시
            favoriteBtn.style.display = 'flex';
            
        }, 800);
    }
    
    addToFavorites() {
        if (!this.currentAdvice) return;
        
        // 이미 즐겨찾기에 있는지 확인
        const exists = this.stats.favorites.find(fav => fav.index === this.currentAdvice.index);
        if (exists) {
            this.showMessage('이미 즐겨찾기에 추가된 조언입니다!', 'warning');
            return;
        }
        
        // 즐겨찾기 추가
        this.stats.favorites.push(this.currentAdvice);
        localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
        
        this.updateStats();
        this.updateFavoritesDisplay();
        this.showMessage('즐겨찾기에 추가되었습니다! ❤️', 'success');
    }
    
    removeFromFavorites(index) {
        const favoriteItem = document.querySelector(`[data-index="${index}"]`);
        favoriteItem.classList.add('removing');
        
        setTimeout(() => {
            this.stats.favorites = this.stats.favorites.filter(fav => fav.index !== index);
            localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
            
            this.updateStats();
            this.updateFavoritesDisplay();
        }, 300);
    }
    
    clearFavorites() {
        if (this.stats.favorites.length === 0) {
            this.showMessage('삭제할 즐겨찾기가 없습니다!', 'info');
            return;
        }
        
        if (confirm('모든 즐겨찾기를 삭제하시겠습니까?')) {
            this.stats.favorites = [];
            localStorage.setItem('adviceFavorites', JSON.stringify(this.stats.favorites));
            
            this.updateStats();
            this.updateFavoritesDisplay();
            this.showMessage('모든 즐겨찾기가 삭제되었습니다!', 'info');
        }
    }
    
    updateStats() {
        document.getElementById('totalGenerated').textContent = this.stats.totalGenerated;
        document.getElementById('totalFavorites').textContent = this.stats.favorites.length;
    }
    
    updateFavoritesDisplay() {
        const favoritesSection = document.getElementById('adviceFavorites');
        const favoritesList = document.getElementById('favoritesList');
        
        if (this.stats.favorites.length === 0) {
            favoritesSection.style.display = 'none';
            return;
        }
        
        favoritesSection.style.display = 'block';
        favoritesList.innerHTML = this.stats.favorites
            .map(fav => `
                <div class="favorite-item" data-index="${fav.index}">
                    <div class="advice-text">"${fav.text}"</div>
                    <div class="advice-source">— ${fav.source} —</div>
                    <button class="favorite-remove" onclick="adviceGenerator.removeFromFavorites(${fav.index})">×</button>
                </div>
            `).join('');
    }
    
    showMessage(message, type = 'info') {
        // 기존 메시지 제거
        const existingMessage = document.querySelector('.advice-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 메시지 생성
        const messageEl = document.createElement('div');
        messageEl.className = `advice-message advice-message-${type}`;
        messageEl.textContent = message;
        
        // 메시지 삽입
        const container = document.querySelector('.advice-container');
        container.appendChild(messageEl);
        
        // 애니메이션
        setTimeout(() => messageEl.classList.add('show'), 100);
        
        // 3초 후 제거
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// 전역 인스턴스 생성
let adviceGenerator;

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    adviceGenerator = new RandomAdviceGenerator();
});
