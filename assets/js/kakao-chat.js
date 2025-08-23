// 카카오톡 채팅 시뮬레이션 JavaScript

// 전역 플래그로 스크립트 중복 실행 방지
if (window.kakaoChatInitialized) {
    console.warn('KakaoChat script already initialized, skipping...');
} else {
    window.kakaoChatInitialized = true;

    (function() {
        'use strict';

        let participants = [];
        let messages = [];
        let currentParticipant = null;

        // 초기화
        document.addEventListener('DOMContentLoaded', init);

        function init() {
            try {
                loadFromLocalStorage();
                renderParticipants();
                renderMessages();
                bindEvents();
                updateUI();
            } catch (error) {
                console.error('Initialization error:', error);
            }
        }

        function bindEvents() {
            // 메시지 전송
            const sendButton = document.getElementById('send-button');
            const messageInput = document.getElementById('message-input');

            if (sendButton && messageInput) {
                sendButton.addEventListener('click', sendMessage);
                messageInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });

                messageInput.addEventListener('input', () => {
                    sendButton.disabled = !messageInput.value.trim();
                });
            }

            // 사진 전송
            const photoButton = document.getElementById('photo-button');
            const photoInput = document.getElementById('photo-input');

            if (photoButton && photoInput) {
                photoButton.addEventListener('click', () => photoInput.click());
                photoInput.addEventListener('change', handlePhotoUpload);
            }

            // 설정 사이드바 토글
            const menuButton = document.getElementById('menu-button');
            if (menuButton) {
                menuButton.addEventListener('click', function() {
                    console.log('Menu button clicked'); // 디버깅용
                    window.toggleSidebar();
                });
            }

            // 뒤로가기 버튼
            const backButton = document.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', () => {
                    window.location.href = '/';
                });
            }

            // 설정 사이드바 닫기
            const sidebar = document.getElementById('settings-sidebar');
            if (sidebar) {
                sidebar.addEventListener('click', (e) => {
                    if (e.target === sidebar) {
                        toggleSidebar();
                    }
                });
            }

            // 모달 닫기
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal(modal.id);
                    }
                });
            });

            // 설정 변경 이벤트들
            const chatRoomNameInput = document.getElementById('chat-room-name');
            if (chatRoomNameInput) {
                chatRoomNameInput.addEventListener('input', updateChatRoomName);
            }

            const chatWidthSlider = document.getElementById('chat-width');
            if (chatWidthSlider) {
                chatWidthSlider.addEventListener('input', updateChatWidth);
            }

            const messageDelaySlider = document.getElementById('message-delay');
            if (messageDelaySlider) {
                messageDelaySlider.addEventListener('input', updateMessageDelay);
            }

            const timestampToggle = document.getElementById('timestamp-toggle');
            if (timestampToggle) {
                timestampToggle.addEventListener('change', updateTimestampDisplay);
            }

            const themeToggle = document.getElementById('chat-dark-mode-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('change', updateTheme);
            }

            // 글꼴 설정 이벤트들
            const messageFontSizeSlider = document.getElementById('message-font-size');
            if (messageFontSizeSlider) {
                messageFontSizeSlider.addEventListener('input', updateMessageFontSize);
            }

            const messageFontFamilySelect = document.getElementById('message-font-family');
            if (messageFontFamilySelect) {
                messageFontFamilySelect.addEventListener('change', updateMessageFontFamily);
            }

            const senderFontSizeSlider = document.getElementById('sender-font-size');
            if (senderFontSizeSlider) {
                senderFontSizeSlider.addEventListener('input', updateSenderFontSize);
            }

            const timestampFontSizeSlider = document.getElementById('timestamp-font-size');
            if (timestampFontSizeSlider) {
                timestampFontSizeSlider.addEventListener('input', updateTimestampFontSize);
            }

            const profilePicSizeSlider = document.getElementById('profile-pic-size');
            if (profilePicSizeSlider) {
                profilePicSizeSlider.addEventListener('input', updateProfilePicSize);
            }

            const messageFontWeightSelect = document.getElementById('message-font-weight');
            if (messageFontWeightSelect) {
                messageFontWeightSelect.addEventListener('change', updateMessageFontWeight);
            }

            const senderFontWeightSelect = document.getElementById('sender-font-weight');
            if (senderFontWeightSelect) {
                senderFontWeightSelect.addEventListener('change', updateSenderFontWeight);
            }

            // 참가자 선택 드롭다운 변경 이벤트
            const currentParticipantSelect = document.getElementById('current-participant');
            if (currentParticipantSelect) {
                currentParticipantSelect.addEventListener('change', updateCurrentParticipant);
            }

            // 참가자 관리 이벤트들
            const addParticipantBtn = document.getElementById('add-participant-btn');
            if (addParticipantBtn) {
                addParticipantBtn.addEventListener('click', addParticipant);
            }

            const saveParticipantBtn = document.getElementById('save-participant');
            if (saveParticipantBtn) {
                saveParticipantBtn.addEventListener('click', addParticipant);
            }



            const saveMessageBtn = document.getElementById('save-message');
            if (saveMessageBtn) {
                saveMessageBtn.addEventListener('click', saveMessageEdit);
            }

            // 전체 메시지 삭제 버튼
            const clearMessagesBtn = document.getElementById('clear-messages');
            if (clearMessagesBtn) {
                clearMessagesBtn.addEventListener('click', clearMessages);
            }

            // 영상 생성 버튼
            const generateVideoBtn = document.getElementById('generate-video');
            if (generateVideoBtn) {
                generateVideoBtn.addEventListener('click', generateVideo);
            }

            // 프로필 사진 변경 이벤트
            const profilePicInput = document.getElementById('profile-pic-input');
            if (profilePicInput) {
                profilePicInput.addEventListener('change', handleProfilePicChange);
            }

            // 이미지 뷰어 이벤트
            const imageViewer = document.getElementById('image-viewer');
            if (imageViewer) {
                imageViewer.addEventListener('click', (e) => {
                    if (e.target === imageViewer) {
                        closeImageViewer();
                    }
                });
            }

            // 초기 전송 버튼 상태 설정
            if (sendButton) {
                sendButton.disabled = true;
            }
        }

        // 전역 함수들
        window.toggleSidebar = function() {
            try {
                const sidebar = document.getElementById('settings-sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('open');
                } else {
                    console.warn('Settings sidebar not found');
                }
            } catch (error) {
                console.error('Error toggling sidebar:', error);
            }
        };

        window.closeModal = function(modalId) {
            const modal = document.getElementById(modalId);
            const overlay = document.getElementById('overlay');
            if (modal) {
                modal.style.display = 'none';
            }
            if (overlay) {
                overlay.style.display = 'none';
            }
        };

        window.closeAllModals = function() {
            // 모든 모달과 오버레이를 닫기
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        };

        // 시간표시 토글 함수
        function updateTimestampDisplay() {
            const timestampToggle = document.getElementById('timestamp-toggle');
            if (timestampToggle) {
                const showTimestamp = timestampToggle.checked;
                localStorage.setItem('showTimestamp', showTimestamp);
                renderMessages(); // 메시지 다시 렌더링하여 시간표시 업데이트
            }
        }

        // 테마 변경 함수
        function updateTheme() {
            const themeToggle = document.getElementById('chat-dark-mode-toggle');
            if (themeToggle) {
                const isDarkMode = themeToggle.checked;
                console.log('Theme toggle changed:', isDarkMode); // 디버깅용
                localStorage.setItem('kakao-chat-dark-mode', isDarkMode);
                
                const container = document.querySelector('.kakao-chat-container');
                if (container) {
                    if (isDarkMode) {
                        container.classList.add('chat-dark-mode');
                        console.log('Added chat-dark-mode class'); // 디버깅용
                    } else {
                        container.classList.remove('chat-dark-mode');
                        console.log('Removed chat-dark-mode class'); // 디버깅용
                    }
                } else {
                    console.warn('Container not found'); // 디버깅용
                }
                
                // 메시지 다시 렌더링하여 테마 변경사항 적용
                renderMessages();
            } else {
                console.warn('Theme toggle not found'); // 디버깅용
            }
        }

        // 메시지 글꼴 크기 업데이트
        function updateMessageFontSize() {
            const slider = document.getElementById('message-font-size');
            if (slider) {
                const size = slider.value;
                localStorage.setItem('kakao-chat-message-font-size', size);
                renderMessages();
            }
        }

        // 메시지 글꼴 패밀리 업데이트
        function updateMessageFontFamily() {
            const select = document.getElementById('message-font-family');
            if (select) {
                const fontFamily = select.value;
                localStorage.setItem('kakao-chat-message-font-family', fontFamily);
                renderMessages();
            }
        }

        // 참가자 이름 글꼴 크기 업데이트
        function updateSenderFontSize() {
            const slider = document.getElementById('sender-font-size');
            if (slider) {
                const size = slider.value;
                localStorage.setItem('kakao-chat-message-sender-font-size', size);
                renderMessages();
            }
        }

        // 시간표시 글꼴 크기 업데이트
        function updateTimestampFontSize() {
            const slider = document.getElementById('timestamp-font-size');
            if (slider) {
                const size = slider.value;
                localStorage.setItem('kakao-chat-timestamp-font-size', size);
                renderMessages();
            }
        }

        // 프로필 사진 크기 업데이트
        function updateProfilePicSize() {
            const slider = document.getElementById('profile-pic-size');
            if (slider) {
                const size = slider.value;
                localStorage.setItem('kakao-chat-profile-pic-size', size);
                renderMessages();
            }
        }

        // 메시지 글꼴 굵기 업데이트
        function updateMessageFontWeight() {
            const select = document.getElementById('message-font-weight');
            if (select) {
                const weight = select.value;
                localStorage.setItem('kakao-chat-message-font-weight', weight);
                renderMessages();
            }
        }

        // 참가자 이름 글꼴 굵기 업데이트
        function updateSenderFontWeight() {
            const select = document.getElementById('sender-font-weight');
            if (select) {
                const weight = select.value;
                localStorage.setItem('kakao-chat-sender-font-weight', weight);
                renderMessages();
            }
        }

        window.showAddParticipantModal = function() {
            const modal = document.getElementById('add-participant-modal');
            if (modal) {
                modal.style.display = 'flex';
                document.getElementById('new-participant-name').value = '';
                document.getElementById('new-participant-pic').src = '../assets/images/dfp.jpg';
            }
        };

        window.closeImageViewer = function() {
            const imageViewer = document.getElementById('image-viewer');
            if (imageViewer) {
                imageViewer.style.display = 'none';
            }
        };

        // 참가자 관리
        function addParticipant() {
            const nameInput = document.getElementById('new-participant-name');
            const picImg = document.getElementById('new-participant-pic');

            if (!nameInput || !picImg) return;

            const name = nameInput.value.trim();
            const profilePic = picImg.src;

            if (!name) {
                Swal.fire({
                    icon: 'warning',
                    title: '이름을 입력해주세요',
                    text: '참가자 이름을 입력한 후 추가해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const participant = {
                id: Date.now(),
                name: name,
                profilePic: profilePic
            };

            participants.push(participant);
            renderParticipants();
            updateParticipantSelect();

            Swal.fire({
                icon: 'success',
                title: '참가자 추가 완료!',
                text: `${name}님이 참가자 목록에 추가되었습니다.`,
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745'
            }).then(() => {
                nameInput.value = '';
                picImg.src = '../assets/images/dfp.jpg';
            });
        }

        function handleProfilePicChange(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newParticipantPic = document.getElementById('new-participant-pic');
                    if (newParticipantPic) {
                        newParticipantPic.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        }

        // 참가자 수정/삭제
        window.editParticipant = function(id) {
            const participant = participants.find(p => p.id === id);
            if (!participant) return;
            
            if (participant.name === '나') {
                Swal.fire({
                    icon: 'warning',
                    title: '수정 불가',
                    text: '"나"는 수정할 수 없습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }
            
            const editModal = document.getElementById('edit-participant-modal');
            const editNameInput = document.getElementById('edit-participant-name');
            const editProfilePreview = document.getElementById('edit-profile-preview');
            const editPicInput = document.getElementById('edit-participant-pic');
            
            if (editNameInput && editProfilePreview) {
                editNameInput.value = participant.name;
                editProfilePreview.src = participant.profilePic;
                document.getElementById('edit-participant-id').value = id;
                
                editModal.style.display = 'block';
                document.getElementById('overlay').style.display = 'block';
                
                const saveBtn = document.getElementById('save-participant');
                if (saveBtn) {
                    saveBtn.onclick = () => saveParticipantEdit(id);
                }
                
                // 프로필사진 변경 이벤트 리스너 추가
                if (editPicInput) {
                    editPicInput.onchange = function(e) {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                editProfilePreview.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                }
            }
        }

        window.deleteParticipant = function(id) {
            const participant = participants.find(p => p.id === id);
            if (!participant) return;

            if (participant.name === '나') {
                Swal.fire({
                    icon: 'warning',
                    title: '삭제 불가',
                    text: '"나"는 삭제할 수 없습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            Swal.fire({
                title: '참가자 삭제',
                text: `${participant.name}님을 정말 삭제하시겠습니까?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '삭제',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    participants = participants.filter(p => p.id !== id);
                    renderParticipants();
                    updateParticipantSelect();

                    Swal.fire({
                        icon: 'success',
                        title: '삭제 완료',
                        text: `${participant.name}님이 삭제되었습니다.`,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#28a745'
                    });
                }
            });
        }

        function saveParticipantEdit(id) {
            const participant = participants.find(p => p.id === id);
            if (!participant) return;

            const editNameInput = document.getElementById('edit-participant-name');
            const editProfilePreview = document.getElementById('edit-profile-preview');

            if (!editNameInput || !editProfilePreview) return;

            const newName = editNameInput.value.trim();
            if (!newName) {
                Swal.fire({
                    icon: 'warning',
                    title: '이름을 입력해주세요',
                    text: '참가자 이름을 입력해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            participant.name = newName;
            participant.profilePic = editProfilePreview.src;

            renderParticipants();
            updateParticipantSelect();

            closeModal('edit-participant-modal');

            Swal.fire({
                icon: 'success',
                title: '수정 완료',
                text: '참가자 정보가 수정되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745'
            });
        }

        // 참가자 렌더링
        function renderParticipants() {
            const participantList = document.getElementById('participant-list');
            if (!participantList) return;

            participantList.innerHTML = '';

            participants.forEach(participant => {
                const participantItem = document.createElement('div');
                participantItem.className = 'participant-item';

                participantItem.innerHTML = `
                    <img src="${participant.profilePic}" alt="${participant.name}">
                    <div class="participant-info">
                        <p class="participant-name">${participant.name}</p>
                    </div>
                    <div class="participant-actions">
                        ${participant.name !== '나' ? `
                            <button class="edit-btn" onclick="editParticipant(${participant.id})">수정</button>
                            <button class="delete-btn" onclick="deleteParticipant(${participant.id})">삭제</button>
                        ` : ''}
                    </div>
                `;

                participantList.appendChild(participantItem);
            });

            updateParticipantSelect();
        }

        // 참가자 선택 드롭다운 업데이트
        function updateParticipantSelect() {
            const currentParticipantSelect = document.getElementById('current-participant');
            if (!currentParticipantSelect) return;
            
            currentParticipantSelect.innerHTML = '';
            
            participants.forEach(participant => {
                const option = document.createElement('option');
                option.value = participant.id;
                option.textContent = participant.name;
                currentParticipantSelect.appendChild(option);
            });
            
            // 기본적으로 '나' 선택
            if (participants.length > 0) {
                currentParticipantSelect.value = participants[0].id;
                currentParticipant = participants[0];
            }
        }

        // 현재 참가자 업데이트
        function updateCurrentParticipant() {
            const currentParticipantSelect = document.getElementById('current-participant');
            if (!currentParticipantSelect) return;

            const selectedId = currentParticipantSelect.value;
            if (selectedId) {
                currentParticipant = participants.find(p => p.id === parseInt(selectedId));
            } else {
                currentParticipant = null;
            }
        }

        // 메시지 전송
        function sendMessage() {
            if (!currentParticipant) {
                Swal.fire({
                    icon: 'warning',
                    title: '참가자를 선택해주세요',
                    text: '메시지를 보낼 참가자를 선택해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const messageInput = document.getElementById('message-input');
            if (!messageInput) return;

            const content = messageInput.value.trim();
            if (!content) return;

            // 글자 수에 따른 자동 딜레이 계산
            const autoDelay = calculateAutoDelay(content, 'text');

            const message = {
                id: Date.now(),
                sender: currentParticipant,
                content: content,
                timestamp: new Date(),
                type: 'text',
                individualDelay: autoDelay
            };

            messages.push(message);
            renderMessages();
            messageInput.value = '';

            const sendButton = document.getElementById('send-button');
            if (sendButton) {
                sendButton.disabled = true;
            }
        }

        // 사진 업로드 처리
        function handlePhotoUpload(e) {
            if (!currentParticipant) {
                Swal.fire({
                    icon: 'warning',
                    title: '참가자를 선택해주세요',
                    text: '사진을 보낼 참가자를 선택해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const file = e.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: '이미지 파일이 아닙니다',
                    text: '이미지 파일을 선택해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#dc3545'
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // 이미지 메시지용 고정 딜레이 계산
                const autoDelay = calculateAutoDelay('', 'image');

                const message = {
                    id: Date.now(),
                    sender: currentParticipant,
                    content: e.target.result,
                    timestamp: new Date(),
                    type: 'image',
                    individualDelay: autoDelay
                };

                messages.push(message);
                renderMessages();

                const photoInput = document.getElementById('photo-input');
                if (photoInput) {
                    photoInput.value = '';
                }
            };

            reader.readAsDataURL(file);
        }

        // 메시지 렌더링
        function renderMessages() {
            const chatArea = document.getElementById('chat-area');
            if (!chatArea) return;

            chatArea.innerHTML = '';

            messages.forEach(message => {
                const messageElement = createMessageElement(message);
                chatArea.appendChild(messageElement);
            });

            // 스크롤을 맨 아래로
            chatArea.scrollTop = chatArea.scrollHeight;
        }

        // 메시지 요소 생성
        function createMessageElement(message) {
            const messageDiv = document.createElement('div');
            const isMyMessage = message.sender.name === '나';
            
            messageDiv.className = `message ${isMyMessage ? 'my-message' : ''}`;
            messageDiv.onclick = () => editMessage(message.id);
            
            let contentHtml = '';
            if (message.type === 'image') {
                // 사진 크기 설정 적용
                const photoWidth = message.photoWidth || 80;
                contentHtml = `<img src="${message.content}" alt="이미지" class="message-image" style="width: ${photoWidth}%; height: auto; object-fit: contain;">`;
            } else {
                // 텍스트 메시지에서 줄바꿈을 <br> 태그로 변환
                const formattedContent = message.content.replace(/\n/g, '<br>');
                contentHtml = `<div class="message-bubble">${formattedContent}</div>`;
            }
            
            const timeString = message.timestamp.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            const timestampToggle = document.getElementById('timestamp-toggle');
            const showTimestamp = timestampToggle && timestampToggle.checked;
            
            messageDiv.innerHTML = `
                ${!isMyMessage ? `<img src="${message.sender.profilePic}" alt="${message.sender.name}" class="profile-pic">` : ''}
                <div class="message-content">
                    ${!isMyMessage ? `<div class="sender-name">${message.sender.name}</div>` : ''}
                    ${contentHtml}
                    ${showTimestamp ? `<div class="message-time">${timeString}</div>` : ''}
                </div>
            `;
            
            // 현재 설정값들을 적용
            applyCurrentFontSettings(messageDiv);
            
            return messageDiv;
        }

        // 현재 폰트 설정을 적용하는 함수
        function applyCurrentFontSettings(messageElement) {
            console.log('Applying font settings to message element:', messageElement);
            // 메시지 글꼴 크기
            const messageFontSize = localStorage.getItem('kakao-chat-message-font-size');
            if (messageFontSize) {
                const messageBubble = messageElement.querySelector('.message-bubble');
                if (messageBubble) {
                    messageBubble.style.fontSize = messageFontSize + 'px';
                    console.log('Applied message font size:', messageFontSize + 'px');
                }
            }
            
            // 메시지 글꼴 패밀리
            const messageFontFamily = localStorage.getItem('kakao-chat-message-font-family');
            if (messageFontFamily) {
                const messageBubble = messageElement.querySelector('.message-bubble');
                if (messageBubble) {
                    messageBubble.style.fontFamily = messageFontFamily;
                    console.log('Applied message font family:', messageFontFamily);
                }
            }
            
            // 메시지 글꼴 굵기
            const messageFontWeight = localStorage.getItem('kakao-chat-message-font-weight');
            if (messageFontWeight) {
                const messageBubble = messageElement.querySelector('.message-bubble');
                if (messageBubble) {
                    messageBubble.style.fontWeight = messageFontWeight;
                    console.log('Applied message font weight:', messageFontWeight);
                }
            }
            
            // 참가자 이름 글꼴 크기
            const senderFontSize = localStorage.getItem('kakao-chat-sender-font-size');
            if (senderFontSize) {
                const senderName = messageElement.querySelector('.sender-name');
                if (senderName) {
                    senderName.style.fontSize = senderFontSize + 'px';
                    console.log('Applied sender font size:', senderFontSize + 'px');
                }
            }
            
            // 참가자 이름 글꼴 굵기
            const senderFontWeight = localStorage.getItem('kakao-chat-sender-font-weight');
            if (senderFontWeight) {
                const senderName = messageElement.querySelector('.sender-name');
                if (senderName) {
                    senderName.style.fontWeight = senderFontWeight;
                    console.log('Applied sender font weight:', senderFontWeight);
                }
            }
            
            // 타임스탬프 글꼴 크기
            const timestampFontSize = localStorage.getItem('kakao-chat-timestamp-font-size');
            if (timestampFontSize) {
                const messageTime = messageElement.querySelector('.message-time');
                if (messageTime) {
                    messageTime.style.fontSize = timestampFontSize + 'px';
                    console.log('Applied timestamp font size:', timestampFontSize + 'px');
                }
            }
            
            // 프로필 사진 크기
            const profilePicSize = localStorage.getItem('kakao-chat-profile-pic-size');
            if (profilePicSize) {
                const profilePic = messageElement.querySelector('.profile-pic');
                if (profilePic) {
                    profilePic.style.width = profilePicSize + 'px';
                    profilePic.style.height = profilePicSize + 'px';
                    console.log('Applied profile pic size:', profilePicSize + 'px');
                }
            }
        }

        // 이미지 모달 표시
        window.showImageModal = function(imageSrc) {
            const modal = document.getElementById('image-modal');
            const modalImage = document.getElementById('modal-image');

            if (modal && modalImage) {
                modalImage.src = imageSrc;
                modal.style.display = 'block';
                const overlay = document.getElementById('overlay');
                if (overlay) {
                    overlay.style.display = 'block';
                }
            }
        }

        // 메시지 수정
        function editMessage(messageId) {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const editModal = document.getElementById('edit-message-modal');
            const editContent = document.getElementById('edit-message-content');
            const editTime = document.getElementById('edit-message-time');
            const editDelay = document.getElementById('edit-message-delay');
            const editPhotoUploadGroup = document.getElementById('edit-photo-upload-group');
            const editPhotoPreview = document.getElementById('edit-photo-preview');
            const editPhotoWidth = document.getElementById('edit-photo-width');
            const editPhotoWidthValue = document.getElementById('edit-photo-width-value');

            if (!editModal || !editContent || !editTime || !editDelay) return;

            // 메시지 타입에 따라 편집 영역 표시/숨김
            if (message.type === 'text') {
                editContent.style.display = 'block';
                if (editPhotoUploadGroup) {
                    editPhotoUploadGroup.style.display = 'none';
                }
                editContent.value = message.content;
            } else if (message.type === 'image') {
                editContent.style.display = 'none';
                if (editPhotoUploadGroup) {
                    editPhotoUploadGroup.style.display = 'block';
                    
                    // 사진 미리보기 설정
                    if (editPhotoPreview) {
                        editPhotoPreview.src = message.content;
                    }
                    
                    // 기존 사진 크기 설정 불러오기
                    const savedWidth = message.photoWidth || 80;
                    if (editPhotoWidth && editPhotoWidthValue) {
                        editPhotoWidth.value = savedWidth;
                        editPhotoWidthValue.textContent = savedWidth + '%';
                    }
                }
            }

            editTime.value = message.timestamp.toTimeString().slice(0, 5);
            
            // 자동 딜레이 값 표시
            if (message.individualDelay) {
                editDelay.value = message.individualDelay;
            } else {
                // 기존 딜레이가 없으면 자동 계산
                const autoDelay = calculateAutoDelay(message.content, message.type);
                editDelay.value = autoDelay;
            }

            document.getElementById('edit-message-id').value = messageId;
            document.getElementById('edit-message-type').value = message.type;

            editModal.style.display = 'block';
            const overlay = document.getElementById('overlay');
            if (overlay) {
                overlay.style.display = 'block';
            }

            const saveBtn = document.getElementById('save-message');
            if (saveBtn) {
                saveBtn.onclick = () => saveMessageEdit(messageId);
            }
            
            // 사진 크기 조정 슬라이더 이벤트 리스너
            if (editPhotoWidth && editPhotoWidthValue) {
                editPhotoWidth.addEventListener('input', function() {
                    editPhotoWidthValue.textContent = this.value + '%';
                });
            }
            
            // 사진 재업로드 이벤트 리스너
            const editPhotoInput = document.getElementById('edit-message-photo');
            if (editPhotoInput) {
                editPhotoInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file && editPhotoPreview) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            editPhotoPreview.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        }

        // 메시지 수정 저장
        function saveMessageEdit(messageId) {
            const message = messages.find(m => m.id === messageId);
            if (!message) return;

            const editContent = document.getElementById('edit-message-content');
            const editTime = document.getElementById('edit-message-time');
            const editDelay = document.getElementById('edit-message-delay');

            if (!editContent || !editTime || !editDelay) return;

            if (message.type === 'text') {
                message.content = editContent.value.trim();
                // 텍스트 메시지 수정 시 자동 딜레이 재계산
                message.individualDelay = calculateAutoDelay(message.content, 'text');
            } else if (message.type === 'image') {
                // 사진 메시지인 경우 사진 크기 설정 저장
                const editPhotoWidth = document.getElementById('edit-photo-width');
                if (editPhotoWidth) {
                    message.photoWidth = parseInt(editPhotoWidth.value);
                }
                
                // 사진 재업로드가 있는 경우 새 사진으로 교체
                const editPhotoInput = document.getElementById('edit-message-photo');
                if (editPhotoInput && editPhotoInput.files[0]) {
                    const file = editPhotoInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        message.content = e.target.result;
                        renderMessages();
                    };
                    reader.readAsDataURL(file);
                }
            }

            const [hours, minutes] = editTime.value.split(':');
            message.timestamp.setHours(hours, minutes, 0, 0);

            // 개별 딜레이 입력값이 있으면 사용, 없으면 자동 딜레이 사용
            const manualDelay = parseFloat(editDelay.value);
            if (manualDelay > 0) {
                message.individualDelay = manualDelay;
            }

            renderMessages();
            
            // 팝업과 오버레이 모두 닫기
            const editModal = document.getElementById('edit-message-modal');
            const overlay = document.getElementById('overlay');
            if (editModal) editModal.style.display = 'none';
            if (overlay) overlay.style.display = 'none';

            Swal.fire({
                icon: 'success',
                title: '수정 완료',
                text: '메시지가 수정되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745'
            });
        }

        // 채팅방 이름 업데이트
        function updateChatRoomName() {
            const chatRoomNameInput = document.getElementById('chat-room-name');
            if (!chatRoomNameInput) return;

            const newName = chatRoomNameInput.value.trim();
            if (!newName) {
                Swal.fire({
                    icon: 'warning',
                    title: '이름을 입력해주세요',
                    text: '채팅방 이름을 입력해주세요.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            const chatTitle = document.getElementById('chat-title');
            if (chatTitle) {
                chatTitle.textContent = newName;
            }

            Swal.fire({
                icon: 'success',
                title: '이름 변경 완료',
                text: '채팅방 이름이 변경되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#28a745'
            });
        }

        // 채팅방 너비 업데이트
        function updateChatWidth() {
            const chatWidthSlider = document.getElementById('chat-width');
            if (!chatWidthSlider) return;

            const width = chatWidthSlider.value;
            const container = document.querySelector('.kakao-chat-container');

            if (container) {
                container.style.maxWidth = width + 'px';
            }

            const widthValue = document.getElementById('width-value');
            if (widthValue) {
                widthValue.textContent = width + 'px';
            }

            localStorage.setItem('kakao-chat-width', width);
        }

        // 메시지 딜레이 업데이트
        function updateMessageDelay() {
            const messageDelaySlider = document.getElementById('message-delay');
            if (!messageDelaySlider) return;

            const delay = messageDelaySlider.value;

            const delayValue = document.getElementById('delay-value');
            if (delayValue) {
                delayValue.textContent = delay + '초';
            }

            localStorage.setItem('kakao-chat-message-delay', delay);
        }

        // 채팅 다크모드 토글
        function toggleChatDarkMode() {
            const chatDarkModeToggle = document.getElementById('chat-dark-mode-toggle');
            if (!chatDarkModeToggle) return;

            const container = document.querySelector('.kakao-chat-container');
            if (container) {
                if (chatDarkModeToggle.checked) {
                    container.classList.add('chat-dark-mode');
                } else {
                    container.classList.remove('chat-dark-mode');
                }
            }

            localStorage.setItem('kakao-chat-dark-mode', chatDarkModeToggle.checked);
        }

        // 타임스탬프 토글
        function toggleTimestamp() {
            const timestampToggle = document.getElementById('timestamp-toggle');
            if (!timestampToggle) return;

            localStorage.setItem('kakao-chat-timestamp', timestampToggle.checked);
            renderMessages();
        }

        // 글꼴 설정 업데이트 함수들
        function updateMessageFontSize() {
            const messageFontSize = document.getElementById('message-font-size');
            if (!messageFontSize) return;

            const size = messageFontSize.value;
            const messageFontSizeValue = document.getElementById('message-font-size-value');
            if (messageFontSizeValue) {
                messageFontSizeValue.textContent = size + 'px';
            }
            localStorage.setItem('kakao-chat-message-font-size', size);
            renderMessages(); // 기존 메시지에 즉시 적용
        }

        function updateMessageFontWeight() {
            const messageFontWeight = document.getElementById('message-font-weight');
            if (!messageFontWeight) return;

            const weight = messageFontWeight.value;
            localStorage.setItem('kakao-chat-message-font-weight', weight);
            renderMessages(); // 메시지 다시 렌더링하여 글꼴 굵기 업데이트
        }

        function updateSenderFontSize() {
            const senderFontSize = document.getElementById('sender-font-size');
            if (!senderFontSize) return;

            const size = senderFontSize.value;
            const senderFontSizeValue = document.getElementById('sender-font-size-value');
            if (senderFontSizeValue) {
                senderFontSizeValue.textContent = size + 'px';
            }
            localStorage.setItem('kakao-chat-sender-font-size', size);
            renderMessages(); // 메시지 다시 렌더링하여 글꼴 크기 업데이트
        }

        function updateSenderFontWeight() {
            const senderFontWeight = document.getElementById('sender-font-weight');
            if (!senderFontWeight) return;

            const weight = senderFontWeight.value;
            localStorage.setItem('kakao-chat-sender-font-weight', weight);
            renderMessages(); // 메시지 다시 렌더링하여 글꼴 굵기 업데이트
        }

        function updateTimestampFontSize() {
            const timestampFontSize = document.getElementById('timestamp-font-size');
            if (!timestampFontSize) return;

            const size = timestampFontSize.value;
            const timestampFontSizeValue = document.getElementById('timestamp-font-size-value');
            if (timestampFontSizeValue) {
                timestampFontSizeValue.textContent = size + 'px';
            }
            localStorage.setItem('kakao-chat-timestamp-font-size', size);
            renderMessages(); // 메시지 다시 렌더링하여 글꼴 크기 업데이트
        }

        function updateProfilePicSize() {
            const profilePicSize = document.getElementById('profile-pic-size');
            if (!profilePicSize) return;

            const size = profilePicSize.value;
            const profilePicSizeValue = document.getElementById('profile-pic-size-value');
            if (profilePicSizeValue) {
                profilePicSizeValue.textContent = size + 'px';
            }
            localStorage.setItem('kakao-chat-profile-pic-size', size);
            renderMessages(); // 메시지 다시 렌더링하여 프로필 사진 크기 업데이트
        }

        // 자동 딜레이 계산 함수
        function calculateAutoDelay(content, type) {
            if (type === 'image') {
                // 이미지 메시지는 고정 3초 딜레이
                return 3;
            } else if (type === 'text') {
                // 텍스트 메시지는 글자 수에 따라 딜레이 계산
                const charCount = content.length;
                
                // 기본 딜레이: 1.5초
                let baseDelay = 1.5;
                
                // 글자 수에 따른 추가 딜레이
                if (charCount <= 10) {
                    // 10자 이하: 1.5초
                    return baseDelay;
                } else if (charCount <= 30) {
                    // 11-30자: 2.5초
                    return 2.5;
                } else if (charCount <= 50) {
                    // 31-50자: 3.5초
                    return 3.5;
                } else if (charCount <= 100) {
                    // 51-100자: 4.5초
                    return 4.5;
                } else if (charCount <= 200) {
                    // 101-200자: 5.5초
                    return 5.5;
                } else {
                    // 200자 초과: 6.5초
                    return 6.5;
                }
            }
            
            return 1.5; // 기본값
        }

        // 영상 생성
        async function generateVideo() {
            if (messages.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: '메시지가 없습니다',
                    text: '영상을 생성할 메시지가 없습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#007bff'
                });
                return;
            }

            try {
                // 진행률 표시
                const progressContainer = document.getElementById('video-progress');
                const progressFill = document.getElementById('progress-fill');
                const progressText = document.getElementById('progress-text');
                const generateBtn = document.getElementById('generate-video');
                
                progressContainer.style.display = 'block';
                generateBtn.disabled = true;
                generateBtn.textContent = '영상 생성 중...';

                // 현재 다크모드 상태 확인
                const isDarkMode = document.querySelector('.kakao-chat-container')?.classList.contains('chat-dark-mode');
                
                // 임시 채팅 영역 생성 (기존 채팅 영역을 건드리지 않음) - 고해상도
                const tempContainer = document.createElement('div');
                tempContainer.className = 'kakao-chat-container';
                if (isDarkMode) {
                    tempContainer.classList.add('chat-dark-mode');
                }
                tempContainer.style.cssText = `
                    position: fixed;
                    top: -9999px;
                    left: -9999px;
                    width: 400px;
                    height: 600px;
                    background-color: ${isDarkMode ? '#1a1a1a' : '#ffffff'};
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    z-index: -1;
                    transform: scale(1);
                    transform-origin: top left;
                `;

                // 임시 헤더 생성
                const tempHeader = document.createElement('div');
                tempHeader.className = 'chat-header';
                tempHeader.style.cssText = `
                    background-color: ${isDarkMode ? '#2d2d2d' : '#fee500'};
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid ${isDarkMode ? '#444' : '#e6d800'};
                `;
                
                const tempTitle = document.createElement('h1');
                tempTitle.className = 'chat-title';
                tempTitle.textContent = document.getElementById('chat-title')?.textContent || '채팅방 이름';
                tempTitle.style.cssText = `
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: ${isDarkMode ? '#ffffff' : '#000000'};
                `;
                tempHeader.appendChild(tempTitle);

                // 임시 채팅 영역 생성
                const tempChatArea = document.createElement('div');
                tempChatArea.className = 'chat-area';
                tempChatArea.style.cssText = `
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    background-color: ${isDarkMode ? '#2d2d2d' : '#f5f5f5'};
                    height: 500px;
                `;

                tempContainer.appendChild(tempHeader);
                tempContainer.appendChild(tempChatArea);
                document.body.appendChild(tempContainer);

                // MediaRecorder를 위한 스트림 생성
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // 캔버스 크기 설정 - 고해상도로 설정
                const scale = 2; // 2배 해상도
                canvas.width = 400 * scale;
                canvas.height = 600 * scale;
                canvas.style.width = '400px';
                canvas.style.height = '600px';
                
                // MediaRecorder 설정 - 지원되는 형식 확인 (고품질 우선)
                let mimeType = 'video/webm;codecs=vp9';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm;codecs=vp8';
                    if (!MediaRecorder.isTypeSupported(mimeType)) {
                        mimeType = 'video/webm';
                        if (!MediaRecorder.isTypeSupported(mimeType)) {
                            mimeType = 'video/mp4';
                        }
                    }
                }
                
                console.log('사용할 영상 형식:', mimeType);
                
                const stream = canvas.captureStream(60); // 60fps로 증가
                const mediaRecorder = new MediaRecorder(stream, {
                    mimeType: mimeType,
                    videoBitsPerSecond: 20000000 // 20Mbps로 증가
                });
                
                const chunks = [];
                
                mediaRecorder.ondataavailable = (event) => {
                    console.log('MediaRecorder data available:', event.data.size, 'bytes');
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };
                
                mediaRecorder.onstart = () => {
                    console.log('MediaRecorder 녹화 시작됨');
                };
                
                mediaRecorder.onerror = (event) => {
                    console.error('MediaRecorder 오류:', event.error);
                };
                
                mediaRecorder.onstop = () => {
                    if (chunks.length === 0) {
                        Swal.fire({
                            icon: 'error',
                            title: '영상 생성 실패',
                            text: '영상 데이터가 생성되지 않았습니다.',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#dc3545'
                        });
                        return;
                    }
                    
                    const blob = new Blob(chunks, { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    
                    // 다운로드 링크 생성
                    const a = document.createElement('a');
                    a.href = url;
                    const extension = mimeType.includes('webm') ? 'webm' : 'mp4';
                    a.download = `kakao-chat-${Date.now()}.${extension}`;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    
                    // 정리
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 1000);
                    
                    // 임시 컨테이너 제거
                    if (document.body.contains(tempContainer)) {
                        document.body.removeChild(tempContainer);
                    }
                    
                    // 성공 메시지
                    Swal.fire({
                        icon: 'success',
                        title: '영상 생성 완료!',
                        text: `채팅 영상이 다운로드되었습니다. (${extension.toUpperCase()})`,
                        confirmButtonText: '확인',
                        confirmButtonColor: '#28a745'
                    });
                };
                
                // 영상 녹화 시작
                mediaRecorder.start(1000); // 1초마다 데이터 수집
                
                let currentIndex = 0;
                const totalMessages = messages.length;
                
                // 메시지를 순차적으로 표시하고 캡쳐
                async function captureNextFrame() {
                    if (currentIndex >= totalMessages) {
                        // 모든 프레임 캡쳐 완료, 영상 녹화 종료
                        setTimeout(() => {
                            mediaRecorder.stop();
                        }, 1000); // 마지막 프레임을 1초간 보여줌
                        return;
                    }
                    
                    // 현재 메시지 표시
                    const currentMessage = messages[currentIndex];
                    const messageElement = createMessageElement(currentMessage);
                    
                    // 다크모드일 때 메시지 스타일 적용
                    if (isDarkMode) {
                        const messageBubble = messageElement.querySelector('.message-bubble');
                        if (messageBubble) {
                            messageBubble.style.backgroundColor = '#3a3a3a';
                            messageBubble.style.borderColor = '#555';
                            messageBubble.style.color = '#ffffff';
                        }
                        
                        const senderName = messageElement.querySelector('.sender-name');
                        if (senderName) {
                            senderName.style.color = '#cccccc';
                        }
                        
                        const messageTime = messageElement.querySelector('.message-time');
                        if (messageTime) {
                            messageTime.style.color = '#888';
                        }
                        
                        // 내 메시지는 노란색 유지
                        if (currentMessage.sender.name === '나') {
                            if (messageBubble) {
                                messageBubble.style.backgroundColor = '#fee500';
                                messageBubble.style.color = '#000000';
                            }
                        }
                    }
                    
                    // 임시 채팅 영역에 메시지 추가
                    tempChatArea.appendChild(messageElement);
                    
                    // 스크롤을 해당 메시지로 이동
                    tempChatArea.scrollTop = tempChatArea.scrollHeight;
                    
                    // 진행률 업데이트
                    const progress = ((currentIndex + 1) / totalMessages) * 100;
                    progressFill.style.width = progress + '%';
                    progressText.textContent = Math.round(progress) + '%';
                    
                    // 메시지가 완전히 렌더링될 때까지 잠시 대기
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // 현재 상태를 캔버스에 그리기
                    try {
                        // html2canvas를 직접 사용 (이미 로드됨) - 고해상도로 설정
                        const canvasResult = await html2canvas(tempContainer, {
                            width: 400,
                            height: 600,
                            scale: 2, // 2배 해상도
                            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                            logging: false,
                            useCORS: true,
                            allowTaint: true,
                            removeContainer: false,
                            imageTimeout: 0,
                            allowTaint: true,
                            useCORS: true
                        });
                        
                        // 캔버스 내용을 스트림용 캔버스에 복사 (고해상도)
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(canvasResult, 0, 0, canvas.width, canvas.height);
                        
                        console.log(`프레임 ${currentIndex + 1}/${totalMessages} 캡쳐 완료 (${isDarkMode ? '다크' : '라이트'}모드)`);
                        
                    } catch (error) {
                        console.error('프레임 캡쳐 오류:', error);
                    }
                    
                    currentIndex++;
                    
                    // 다음 프레임 캡쳐까지 대기 (딜레이 고려)
                    const nextDelay = currentIndex < totalMessages ? 
                        (messages[currentIndex].individualDelay || 1) * 1000 : 1000;
                    setTimeout(captureNextFrame, nextDelay);
                }
                
                // 첫 번째 프레임부터 시작
                await captureNextFrame();
                
            } catch (error) {
                console.error('영상 생성 오류:', error);
                
                // UI 복원
                const progressContainer = document.getElementById('video-progress');
                const generateBtn = document.getElementById('generate-video');
                
                progressContainer.style.display = 'none';
                generateBtn.disabled = false;
                generateBtn.textContent = '영상 생성';
                
                // 임시 컨테이너 제거
                const tempContainer = document.querySelector('.kakao-chat-container[style*="position: fixed"]');
                if (tempContainer && document.body.contains(tempContainer)) {
                    document.body.removeChild(tempContainer);
                }
                
                Swal.fire({
                    icon: 'error',
                    title: '영상 생성 실패',
                    text: '영상 생성 중 오류가 발생했습니다.',
                    confirmButtonText: '확인',
                    confirmButtonColor: '#dc3545'
                });
            }
        }

        // 메시지 전체 삭제
        function clearMessages() {
            Swal.fire({
                title: '모든 메시지 삭제',
                text: '정말로 모든 메시지를 삭제하시겠습니까?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: '삭제',
                cancelButtonText: '취소'
            }).then((result) => {
                if (result.isConfirmed) {
                    messages = [];
                    renderMessages();

                    Swal.fire({
                        icon: 'success',
                        title: '삭제 완료',
                        text: '모든 메시지가 삭제되었습니다.',
                        confirmButtonText: '확인',
                        confirmButtonColor: '#28a745'
                    });
                }
            });
        }

        // 로컬스토리지에서 로드
        function loadFromLocalStorage() {
            try {
                // 기본 참가자 '나' 추가
                participants = [{
                    id: 1,
                    name: '나',
                    profilePic: '../assets/images/dfp.jpg'
                }];

            } catch (error) {
                console.error('로컬스토리지 로드 오류:', error);
            }
        }

        // UI 업데이트
        function updateUI() {
            // 채팅방 이름 설정
            const chatRoomNameInput = document.getElementById('chat-room-name');
            const chatTitle = document.getElementById('chat-title');
            if (chatRoomNameInput && chatTitle) {
                chatRoomNameInput.value = chatTitle.textContent;
            }

            // 채팅방 너비 설정
            const savedWidth = localStorage.getItem('kakao-chat-width');
            if (savedWidth) {
                const container = document.querySelector('.kakao-chat-container');
                if (container) {
                    container.style.maxWidth = savedWidth + 'px';
                }
                const chatWidthSlider = document.getElementById('chat-width');
                if (chatWidthSlider) {
                    chatWidthSlider.value = savedWidth;
                }
                const widthValue = document.getElementById('width-value');
                if (widthValue) {
                    widthValue.textContent = savedWidth + 'px';
                }
            }

            // 다크모드 설정
            const savedDarkMode = localStorage.getItem('kakao-chat-dark-mode');
            const container = document.querySelector('.kakao-chat-container');
            const themeToggle = document.getElementById('chat-dark-mode-toggle');
            
            console.log('Loading dark mode setting:', savedDarkMode); // 디버깅용
            console.log('Container found:', !!container); // 디버깅용
            console.log('Theme toggle found:', !!themeToggle); // 디버깅용
            
            if (container && themeToggle) {
                if (savedDarkMode === 'true') {
                    container.classList.add('chat-dark-mode');
                    themeToggle.checked = true;
                    console.log('Applied dark mode on load'); // 디버깅용
                } else {
                    container.classList.remove('chat-dark-mode');
                    themeToggle.checked = false;
                    console.log('Applied light mode on load'); // 디버깅용
                }
            } else {
                console.warn('Container or theme toggle not found during UI update'); // 디버깅용
            }

            // 메시지 글꼴 크기 설정
            const savedMessageFontSize = localStorage.getItem('kakao-chat-message-font-size');
            if (savedMessageFontSize) {
                const messageFontSize = document.getElementById('message-font-size');
                if (messageFontSize) {
                    messageFontSize.value = savedMessageFontSize;
                }
                const messageFontSizeValue = document.getElementById('message-font-size-value');
                if (messageFontSizeValue) {
                    messageFontSizeValue.textContent = savedMessageFontSize + 'px';
                }
            }

            // 메시지 글꼴 패밀리 설정
            const savedMessageFontFamily = localStorage.getItem('kakao-chat-message-font-family');
            if (savedMessageFontFamily) {
                const messageFontFamily = document.getElementById('message-font-family');
                if (messageFontFamily) {
                    messageFontFamily.value = savedMessageFontFamily;
                }
            }

            // 메시지 글꼴 굵기 설정
            const savedMessageFontWeight = localStorage.getItem('kakao-chat-message-font-weight');
            if (savedMessageFontWeight) {
                const messageFontWeight = document.getElementById('message-font-weight');
                if (messageFontWeight) {
                    messageFontWeight.value = savedMessageFontWeight;
                }
            }

            // 참가자 이름 글꼴 크기 설정
            const savedSenderFontSize = localStorage.getItem('kakao-chat-sender-font-size');
            if (savedSenderFontSize) {
                const senderFontSize = document.getElementById('sender-font-size');
                if (senderFontSize) {
                    senderFontSize.value = savedSenderFontSize;
                }
                const senderFontSizeValue = document.getElementById('sender-font-size-value');
                if (senderFontSizeValue) {
                    senderFontSizeValue.textContent = savedSenderFontSize + 'px';
                }
            }

            // 참가자 이름 글꼴 굵기 설정
            const savedSenderFontWeight = localStorage.getItem('kakao-chat-sender-font-weight');
            if (savedSenderFontWeight) {
                const senderFontWeight = document.getElementById('sender-font-weight');
                if (senderFontWeight) {
                    senderFontWeight.value = savedSenderFontWeight;
                }
            }

            // 타임스탬프 글꼴 크기 설정
            const savedTimestampFontSize = localStorage.getItem('kakao-chat-timestamp-font-size');
            if (savedTimestampFontSize) {
                const timestampFontSize = document.getElementById('timestamp-font-size');
                if (timestampFontSize) {
                    timestampFontSize.value = savedTimestampFontSize;
                }
                const timestampFontSizeValue = document.getElementById('timestamp-font-size-value');
                if (timestampFontSizeValue) {
                    timestampFontSizeValue.textContent = savedTimestampFontSize + 'px';
                }
            }

            // 프로필 사진 크기 설정
            const savedProfilePicSize = localStorage.getItem('kakao-chat-profile-pic-size');
            if (savedProfilePicSize) {
                const profilePicSize = document.getElementById('profile-pic-size');
                if (profilePicSize) {
                    profilePicSize.value = savedProfilePicSize;
                }
                const profilePicSizeValue = document.getElementById('profile-pic-size-value');
                if (profilePicSizeValue) {
                    profilePicSizeValue.textContent = savedProfilePicSize + 'px';
                }
            }

            // 타임스탬프 표시 설정
            const savedTimestamp = localStorage.getItem('kakao-chat-timestamp');
            if (savedTimestamp !== null) {
                const timestampToggle = document.getElementById('timestamp-toggle');
                if (timestampToggle) {
                    timestampToggle.checked = savedTimestamp === 'true';
                }
            }

            // 메시지 딜레이 설정
            const savedDelay = localStorage.getItem('kakao-chat-message-delay');
            if (savedDelay) {
                const messageDelaySlider = document.getElementById('message-delay');
                if (messageDelaySlider) {
                    messageDelaySlider.value = savedDelay;
                }
                const delayValue = document.getElementById('delay-value');
                if (delayValue) {
                    delayValue.textContent = savedDelay + '초';
                }
            }
        }
    })();
}
