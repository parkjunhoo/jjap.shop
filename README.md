# 짭샵 (Jjap Shop)

크리에이터들을 위한 무료 온라인 도구 모음 사이트입니다.

## 🚀 주요 기능

### 현재 제공 도구
- **카카오톡 대화 만들기**: 가상의 카카오톡 대화를 만들고 편집할 수 있는 도구
  - 가상 채팅방 생성
  - 메시지 내용 편집 및 수정
  - 참가자 관리 및 프로필 설정
  - 대화 스크립트 관리
  - 글꼴 및 스타일 커스터마이징
  - 영상 생성 기능

### 향후 추가 예정 도구
- 이미지 편집 도구
- 영상 편집 도구
- 텍스트 생성 도구

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP
- **데이터베이스**: LocalStorage (클라이언트 사이드)
- **라이브러리**: html2canvas (영상 생성용)
- **폰트**: Noto Sans KR (Google Fonts)

## 📁 프로젝트 구조

```
tools/
├── index.php                 # 메인 페이지 (짭샵 홈)
├── .htaccess                # URL 리라이팅 설정
├── pages/
│   └── kakao-chat.php      # 카카오톡 대화 만들기 페이지
├── assets/
│   ├── css/
│   │   ├── main.css        # 메인 페이지 스타일
│   │   └── kakao-chat.css  # 카카오톡 도구 스타일
│   ├── js/
│   │   ├── main.js         # 메인 페이지 스크립트
│   │   └── kakao-chat.js   # 카카오톡 도구 스크립트
│   └── images/             # 이미지 파일들
├── includes/                # 공통 포함 파일들
├── sitemap.xml             # 사이트맵
├── robots.txt              # 검색엔진 크롤링 설정
└── ads.txt                 # 광고 설정
```

## 🌐 URL 구조

- **메인 페이지**: `https://jjap.shop/` 또는 `https://jjap.shop/index.php`
- **카카오톡 대화 만들기**: `https://jjap.shop/kakao-chat` 또는 `https://jjap.shop/pages/kakao-chat.php`

## ✨ 주요 특징

- **완전 무료**: 모든 도구를 무료로 사용 가능
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **사용자 친화적**: 직관적이고 쉬운 인터페이스
- **SEO 최적화**: 메타 태그 및 구조화된 데이터 포함
- **성능 최적화**: 이미지 캐싱, Gzip 압축 등

## 🚀 설치 및 실행

### 요구사항
- PHP 7.0 이상
- Apache 웹서버 (mod_rewrite 활성화)
- 모던 브라우저 지원

### 설치 방법
1. 프로젝트 파일을 웹서버 루트 디렉토리에 업로드
2. `.htaccess` 파일이 제대로 작동하는지 확인
3. 브라우저에서 사이트 접속

### 로컬 개발 환경
```bash
# PHP 내장 서버로 실행
php -S localhost:8000

# 또는 XAMPP, WAMP 등 사용
```

## 📱 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 커스터마이징

### 스타일 수정
- `assets/css/main.css`: 메인 페이지 스타일
- `assets/css/kakao-chat.css`: 카카오톡 도구 스타일

### 기능 수정
- `assets/js/main.js`: 메인 페이지 기능
- `assets/js/kakao-chat.js`: 카카오톡 도구 기능

### 새로운 도구 추가
1. `pages/` 폴더에 새 PHP 파일 생성
2. `assets/css/`에 스타일 파일 추가
3. `assets/js/`에 스크립트 파일 추가
4. 메인 페이지에 도구 카드 추가

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👨‍💻 개발자

- **짭샵 팀**

## 🤝 기여하기

버그 리포트, 기능 제안, 코드 기여 등 모든 기여를 환영합니다!

## 📞 문의

- **이메일**: 문의사항이나 제안사항이 있으시면 연락주세요

---

**짭샵**으로 더 나은 콘텐츠를 만들어보세요! 🎉
