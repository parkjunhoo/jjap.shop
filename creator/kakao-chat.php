<?php
$page_title = '짭카오톡 - 카카오톡 대화 만들기 툴 | 무료 채팅방 시뮬레이터 | jjap.shop';
$page_description = '카카오톡 대화 내용을 자유롭게 만들고 수정할 수 있는 무료 툴입니다. 가상 채팅방, 메시지 편집, 참가자 관리, 채팅 시뮬레이터 기능을 제공합니다.';
$page_keywords = '카카오톡, 대화만들기, 채팅방, 메시지편집, 가상채팅, 카톡시뮬레이터, 채팅도구, 메신저툴, 무료, 온라인, 웹툴';
$page_url = 'https://jjap.shop/kakao-chat';
$page_image = 'https://jjap.shop/assets/images/jjapshoplogo.webp';
$page_css = '../assets/css/kakao-chat.css';
$page_js = '../assets/js/kakao-chat.js';
$body_class = 'kakao-chat-page';
include_once '../includes/section-headers/creator-header.php';

// SweetAlert2 추가
echo '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>';

// html2canvas 추가
echo '<script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>';



// 구조화된 데이터 (JSON-LD) 추가
$structured_data = array(
    "@context" => "https://schema.org",
    "@type" => "WebApplication",
    "name" => "짭카오톡 - 카카오톡 대화 만들기 툴",
    "description" => "카카오톡 대화 내용을 자유롭게 만들고 수정할 수 있는 무료 웹 툴",
    "url" => "https://jjap.shop/kakao-chat",
    "applicationCategory" => "EntertainmentApplication",
    "operatingSystem" => "Web Browser",
    "offers" => array(
        "@type" => "Offer",
        "price" => "0",
        "priceCurrency" => "KRW"
    ),
    "author" => array(
        "@type" => "Organization",
        "name" => "jjap.shop",
        "url" => "https://jjap.shop"
    ),
    "publisher" => array(
        "@type" => "Organization",
        "name" => "jjap.shop",
        "url" => "https://jjap.shop"
    ),
    "datePublished" => "2024-01-01",
    "dateModified" => date('Y-m-d'),
            "screenshot" => "https://jjap.shop/assets/images/jjapshoplogo.webp",
    "featureList" => array(
        "가상 채팅방 생성",
        "메시지 편집 및 수정",
        "참가자 관리",
        "프로필 사진 설정",
        "채팅 내역 내보내기",
        "무료 사용"
    )
);

echo '<script type="application/ld+json">' . json_encode($structured_data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>';


?>

<!-- 카카오톡 채팅 인터페이스 -->
<div class="kakao-chat-container">
    <!-- 채팅방 헤더 -->
    <div class="chat-header">
        <div class="chat-header-left">
            <button class="back-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="chat-header-center">
            <h1 class="chat-title" id="chat-title">채팅방 이름</h1>
        </div>
        <div class="chat-header-right">
            <button class="header-button menu-button" title="메뉴" id="menu-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>

    <!-- 채팅 영역 -->
    <div class="chat-area" id="chat-area">
        <!-- 채팅 메시지들이 여기에 동적으로 추가됩니다 -->
        <div class="message-overlay" style="display: none;"></div>
    </div>

    <!-- 메시지 입력 영역 -->
    <div class="message-input-area">
        <!-- 참가자 선택 드롭다운 -->
        <div class="participant-selector">
            <select id="current-participant" class="participant-select">
                <!-- 참가자들이 여기에 동적으로 추가됩니다 -->
            </select>
        </div>
        
        <div class="input-container">
            <textarea 
                class="message-input" 
                id="message-input"
                placeholder="메시지를 입력하세요" 
                rows="1"
                maxlength="1000"
            ></textarea>
        </div>
        
        <button class="input-button photo-button" title="사진 보내기" id="photo-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        
        <button class="input-button send-button" id="send-button" title="전송" disabled>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        
        <!-- 사진 업로드 입력 (숨김) -->
        <input type="file" id="photo-input" accept="image/*" style="display: none;">
    </div>
</div>

<!-- 설정 사이드바 -->
<div class="settings-sidebar" id="settings-sidebar">
    <div class="sidebar-header">
        <h2>설정</h2>
        <button class="close-sidebar" onclick="toggleSidebar()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div>
    
    <div class="sidebar-content">
        <!-- 영상 생성 -->
        <div class="sidebar-section">
            <h3>🎬 영상 생성</h3>
            <div class="button-group">
                <button id="generate-video" class="action-btn play-btn">영상 생성</button>
            </div>
            <div class="video-progress" id="video-progress" style="display: none;">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <div class="progress-text" id="progress-text">0%</div>
            </div>
        </div>

        <!-- 참가자 관리 -->
        <div class="sidebar-section">
            <h3>참가자 관리</h3>
            <div class="participant-list" id="participant-list">
                <!-- 참가자들이 여기에 동적으로 추가됩니다 -->
            </div>
            
            <div class="add-participant-section">
                <h4>새 참가자 추가</h4>
                <div class="participant-preview">
                    <div class="profile-pic-container">
                        <img id="new-participant-pic" src="../assets/images/dfp.webp" alt="프로필 미리보기" onclick="document.getElementById('profile-pic-input').click()" style="cursor: pointer;">
                        <button class="change-pic-btn" onclick="document.getElementById('profile-pic-input').click()">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21 15V19A2 2 0 0119 21H5A2 2 0 013 19V15M7 10L12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <input type="file" id="profile-pic-input" accept="image/*" style="display: none;">
                    </div>
                    <div class="name-input-container">
                        <input type="text" id="new-participant-name" placeholder="이름을 입력하세요" class="name-input">
                        <button id="add-participant-btn" class="add-btn">추가</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 채팅방 설정 -->
        <div class="sidebar-section">
            <h3>채팅방 설정</h3>
            <div class="setting-item">
                <label for="chat-room-name">채팅방 이름</label>
                <div class="chat-name-container">
                    <input type="text" id="chat-room-name" placeholder="채팅방 이름을 입력하세요" value="채팅방 이름">
                    <button id="update-chat-name" class="update-btn">변경</button>
                </div>
            </div>
            
            <div class="setting-item">
                <label for="chat-width">채팅방 너비</label>
                <div class="range-container">
                    <input type="range" id="chat-width" min="300" max="800" value="400" step="50">
                    <span id="width-value">400px</span>
                </div>
            </div>
            

            

        </div>

        <!-- 메시지 관리 -->
        <div class="sidebar-section">
            <h3>메시지 관리</h3>
            <div class="button-group">
                <button id="export-script" class="action-btn">스크립트 내보내기</button>
                <button id="import-script" class="action-btn">스크립트 불러오기</button>
                <button id="play-conversation" class="action-btn play-btn">대화 재생</button>
                <button id="clear-messages" class="action-btn danger-btn">전체 메시지 삭제</button>
            </div>
            
            <div class="script-area" style="display: none;">
                <textarea id="script-textarea" placeholder="여기에 스크립트를 붙여넣으세요"></textarea>
            </div>
        </div>

        <!-- 채팅 화면 테마 설정 -->
        <div class="sidebar-section">
            <h3>🎨 채팅 화면 설정</h3>
            <div class="setting-item">
                <label class="toggle-label" for="chat-dark-mode-toggle">
                    <span>다크 모드</span>
                    <input type="checkbox" id="chat-dark-mode-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="setting-item">
                <label class="toggle-label" for="timestamp-toggle">
                    <span>시간 표시</span>
                    <input type="checkbox" id="timestamp-toggle" checked>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>

        <!-- 글꼴 설정 -->
        <div class="sidebar-section">
            <h3>🔤 글꼴 설정</h3>
            <div class="font-settings">
                <div class="setting-item">
                    <label for="message-font-size">메시지 글꼴 크기</label>
                    <div class="range-container">
                        <input type="range" id="message-font-size" min="12" max="124" value="14" step="1">
                        <span id="message-font-size-value">14px</span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="message-font-family">메시지 글꼴</label>
                    <select id="message-font-family" class="font-select">
                        <option value="'Noto Sans KR', sans-serif">Noto Sans KR</option>
                        <option value="'Malgun Gothic', sans-serif">맑은 고딕</option>
                        <option value="'Nanum Gothic', sans-serif">나눔고딕</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                    </select>
                </div>
                
                <!-- 글꼴 미리보기 -->
                <div class="font-preview">
                    <p class="font-preview-text" id="font-preview-text">안녕하세요! 이곳에 설정된 글꼴이 적용됩니다.</p>
                </div>
                
                <div class="setting-item">
                    <label for="sender-font-size">참가자 이름 글꼴 크기</label>
                    <div class="range-container">
                        <input type="range" id="sender-font-size" min="10" max="24" value="12" step="1">
                        <span id="sender-font-size-value">12px</span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="timestamp-font-size">타임스탬프 글꼴 크기</label>
                    <div class="range-container">
                        <input type="range" id="timestamp-font-size" min="8" max="16" value="10" step="1">
                        <span id="timestamp-font-size-value">10px</span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="profile-pic-size">프로필 사진 크기</label>
                    <div class="range-container">
                        <input type="range" id="profile-pic-size" min="20" max="60" value="40" step="2">
                        <span id="profile-pic-size-value">40px</span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label for="message-font-weight">메시지 글꼴 굵기</label>
                    <select id="message-font-weight" class="font-select">
                        <option value="300">얇게 (300)</option>
                        <option value="400" selected>보통 (400)</option>
                        <option value="500">중간 (500)</option>
                        <option value="600">약간 굵게 (600)</option>
                        <option value="700">굵게 (700)</option>
                    </select>
                </div>
                
                <div class="setting-item">
                    <label for="sender-font-weight">참가자 이름 글꼴 굵기</label>
                    <select id="sender-font-weight" class="font-select">
                        <option value="300">얇게 (300)</option>
                        <option value="400" selected>보통 (400)</option>
                        <option value="500">중간 (500)</option>
                        <option value="600">약간 굵게 (600)</option>
                        <option value="700">굵게 (700)</option>
                    </select>
                </div>
            </div>
        </div>

    </div>
</div>

<!-- 참가자 수정 모달 -->
<div class="modal" id="edit-participant-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>참가자 수정</h3>
            <button class="modal-close" onclick="closeModal('edit-participant-modal')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="edit-participant-id">
            <div class="form-group">
                <label for="edit-participant-name">이름</label>
                <input type="text" id="edit-participant-name" placeholder="이름을 입력하세요">
            </div>
            <div class="form-group">
                <label for="edit-participant-pic">프로필 사진</label>
                <input type="file" id="edit-participant-pic" accept="image/*">
                <div class="profile-preview">
                    <img id="edit-profile-preview" src="" alt="프로필 미리보기">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="save-participant" class="save-btn">저장</button>
            <button onclick="closeModal('edit-participant-modal')" class="cancel-btn">취소</button>
        </div>
    </div>
</div>

<!-- 메시지 수정 모달 -->
<div class="modal" id="edit-message-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>메시지 수정</h3>
            <button class="modal-close" onclick="closeAllModals()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="edit-message-id">
            <input type="hidden" id="edit-message-type">
            <div class="form-group">
                <label for="edit-message-content">메시지 내용</label>
                <textarea id="edit-message-content" rows="4" placeholder="메시지를 입력하세요"></textarea>
            </div>
            <div class="form-group" id="edit-photo-upload-group" style="display: none;">
                <label for="edit-message-photo">사진 재업로드</label>
                <input type="file" id="edit-message-photo" accept="image/*">
                <div class="photo-preview">
                    <img id="edit-photo-preview" src="" alt="사진 미리보기">
                </div>
                
                <!-- 사진 크기 조정 -->
                <div class="photo-size-controls">
                    <div class="form-group">
                        <label for="edit-photo-width">사진 크기 비율 (%)</label>
                        <input type="range" id="edit-photo-width" min="20" max="100" value="80" step="5">
                        <span id="edit-photo-width-value">80%</span>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="edit-message-time">시간</label>
                <input type="time" id="edit-message-time">
            </div>
            <div class="form-group">
                <label for="edit-message-delay">개별 딜레이 (초)</label>
                <input type="number" id="edit-message-delay" min="0" step="0.1" value="0" placeholder="0">
                <small>0으로 설정하면 기본 딜레이를 사용합니다</small>
            </div>
        </div>
        <div class="modal-footer">
            <button id="save-message" class="save-btn">저장</button>
            <button onclick="closeAllModals()" class="cancel-btn">취소</button>
        </div>
    </div>
</div>

<!-- 이미지 확대 모달 -->
<div class="modal" id="image-modal">
    <div class="modal-content image-modal-content">
        <div class="modal-header">
            <button class="modal-close" onclick="closeModal('image-modal')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <img id="modal-image" src="" alt="확대된 이미지">
        </div>
    </div>
</div>

<!-- 도움말 모달 -->
<div class="modal" id="help-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>사용법</h3>
            <button class="modal-close" onclick="closeModal('help-modal')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="modal-body">
            <div class="help-content">
                <h4>기본 사용법</h4>
                <ol>
                    <li>오른쪽 상단의 메뉴 버튼을 클릭하여 설정을 엽니다</li>
                    <li>참가자를 추가하고 프로필 사진을 설정합니다</li>
                    <li>메시지를 입력하고 전송합니다</li>
                    <li>메시지를 클릭하여 수정할 수 있습니다</li>
                </ol>
                
                <h4>단축키</h4>
                <ul>
                    <li><strong>Enter</strong>: 메시지 전송</li>
                    <li><strong>Shift + Enter</strong>: 줄바꿈</li>
                    <li><strong>Ctrl + S</strong>: 스크립트 내보내기</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<!-- 오버레이 -->
<div class="overlay" id="overlay" onclick="closeAllModals()"></div>

<?php include_once '../includes/footer.php'; ?>
