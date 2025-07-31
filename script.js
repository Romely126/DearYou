// 전역 변수
let currentPassword = '';
let isUnlocked = false;
let videoPlayed = false;
// 활성화 시간 설정 (한국 시간 기준)
        const UNLOCK_TIME = {
            year: 2025,
            month: 1, 
            day: 9,
            hour: 0,  
            minute: 0
        };
        // 비밀번호 설정
        const SECRET_PASSWORD = "1234";
const letterContent = [
    '사랑하는 당신에게,',
    '오늘은 정말 특별한 날이에요.',
    '당신이 태어나서 이 세상이 더 밝아졌어요.',
    '매일매일이 당신과 함께라서 행복합니다.',
    '앞으로도 함께 많은 추억을 만들어가요.',
    '생일 축하해요! 🎂',
    '사랑을 담아 💕'
];
// DOM 요소들
const lockScreen = document.getElementById('lockScreen');
const passwordScreen = document.getElementById('passwordScreen');
const birthdayPage = document.getElementById('birthdayPage');
const lockIcon = document.getElementById('lockIcon');
const lockMessage = document.getElementById('lockMessage');
const countdown = document.getElementById('countdown');
const passwordDots = document.getElementById('passwordDots');
const backgroundVideo = document.getElementById('backgroundVideo');
const backgroundMusic = document.getElementById('backgroundMusic');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkUnlockTime();
    startCountdown();
    setupScrollAnimations();
});

// 앱 초기화
function initializeApp() {
    // 초기 화면 설정
    lockScreen.classList.remove('hidden');
    passwordScreen.classList.add('hidden');
    birthdayPage.classList.add('hidden');
    
    // 비디오 초기 설정
    backgroundVideo.currentTime = 0;
    backgroundVideo.pause();
    
    // 음악 볼륨 설정
    backgroundMusic.volume = 0.3;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 자물쇠 클릭 이벤트
    lockIcon.addEventListener('click', handleLockClick);
    
    // 키패드 이벤트
    const keyButtons = document.querySelectorAll('.key-btn');
    keyButtons.forEach(button => {
        button.addEventListener('click', handleKeypadClick);
    });
    
    // 특수 버튼 이벤트
    document.getElementById('clearBtn').addEventListener('click', clearPassword);
    document.getElementById('enterBtn').addEventListener('click', checkPassword);
    
    // 스크롤 이벤트
    window.addEventListener('scroll', handleScroll);
    
    // 터치 이벤트 (모바일 최적화)
    setupTouchEvents();
}

// 터치 이벤트 설정 (iPhone 최적화)
function setupTouchEvents() {
    // 터치 피드백 개선
    const touchElements = document.querySelectorAll('.key-btn, .lock-icon');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
    
    // iOS Safari 뷰포트 높이 문제 해결
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// 잠금 해제 시간 확인
function checkUnlockTime() {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
    
    const unlockTime = new Date(
        UNLOCK_TIME.year,
        UNLOCK_TIME.month - 1, // JavaScript는 월이 0부터 시작
        UNLOCK_TIME.day,
        UNLOCK_TIME.hour,
        UNLOCK_TIME.minute
    );
    
    if (koreaTime >= unlockTime) {
        unlockLock();
    }
}

// 카운트다운 시작
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
        
        const unlockTime = new Date(
            UNLOCK_TIME.year,
            UNLOCK_TIME.month - 1,
            UNLOCK_TIME.day,
            UNLOCK_TIME.hour,
            UNLOCK_TIME.minute
        );
        
        const timeDiff = unlockTime - koreaTime;
        
        if (timeDiff <= 0) {
            unlockLock();
            return;
        }
        
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        let countdownText = '';
        if (days > 0) {
            countdownText = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
        } else if (hours > 0) {
            countdownText = `${hours}시간 ${minutes}분 ${seconds}초`;
        } else if (minutes > 0) {
            countdownText = `${minutes}분 ${seconds}초`;
        } else {
            countdownText = `${seconds}초`;
        }
        
        countdown.textContent = countdownText;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// 자물쇠 잠금 해제
function unlockLock() {
    isUnlocked = true;
    lockIcon.classList.add('unlocked');
    lockMessage.textContent = '자물쇠를 클릭해주세요! ✨';
    countdown.style.display = 'none';
    
    // 자물쇠 애니메이션
    setTimeout(() => {
        lockIcon.style.animation = 'pulse 1s infinite';
    }, 500);
}

// 자물쇠 클릭 처리
function handleLockClick() {
    if (!isUnlocked) {
        // 자물쇠가 잠겨있을 때 애니메이션
        lockIcon.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            lockIcon.style.animation = '';
        }, 500);
        return;
    }
    
    // 비밀번호 화면으로 전환
    transitionToPasswordScreen();
}

// 비밀번호 화면으로 전환
function transitionToPasswordScreen() {
    lockScreen.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    setTimeout(() => {
        lockScreen.classList.add('hidden');
        passwordScreen.classList.remove('hidden');
        updatePasswordDisplay();
    }, 500);
}

// 키패드 클릭 처리
function handleKeypadClick(event) {
    const button = event.target;
    
    if (button.classList.contains('key-btn') && button.dataset.num) {
        if (currentPassword.length < 4) { // 4자리로 변경
            currentPassword += button.dataset.num;
            updatePasswordDisplay();
            
            // 버튼 애니메이션
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        }
    }
}

// 비밀번호 표시 업데이트 (4개 점으로 수정)
function updatePasswordDisplay() {
    passwordDots.innerHTML = '';
    
    for (let i = 0; i < 4; i++) { // 6개에서 4개로 변경
        const dot = document.createElement('div');
        dot.className = 'password-dot';
        dot.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            background: ${i < currentPassword.length ? '#fff' : 'transparent'};
            transition: all 0.3s ease;
            animation: ${i < currentPassword.length ? 'dotFill 0.3s ease-out' : ''};
        `;
        passwordDots.appendChild(dot);
    }
}

// 비밀번호 지우기
function clearPassword() {
    currentPassword = '';
    updatePasswordDisplay();
    
    // 클리어 버튼 애니메이션
    const clearBtn = document.getElementById('clearBtn');
    clearBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        clearBtn.style.transform = '';
    }, 150);
}

// 비밀번호 확인
function checkPassword() {
    if (currentPassword.length === 0) return;
    
    if (currentPassword === SECRET_PASSWORD) {
        // 정답일 때
        passwordScreen.style.animation = 'celebrationOut 1s ease-out forwards';
        
        setTimeout(() => {
            transitionToBirthdayPage();
        }, 1000);
    } else {
        // 오답일 때
        shakePasswordScreen();
        currentPassword = '';
        updatePasswordDisplay();
    }
}

// 비밀번호 화면 흔들기 애니메이션
function shakePasswordScreen() {
    const container = document.querySelector('.password-container');
    container.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        container.style.animation = '';
    }, 500);
}

// 생일 페이지로 전환
function transitionToBirthdayPage() {
    passwordScreen.classList.add('hidden');
    birthdayPage.classList.remove('hidden');
    
    // 배경 음악 재생
    backgroundMusic.play().catch(e => {
        console.log('음악 자동 재생이 차단되었습니다. 사용자 상호작용 후 재생됩니다.');
        // 사용자 첫 번째 터치/클릭 시 음악 재생
        document.addEventListener('click', playMusicOnce);
        document.addEventListener('touchstart', playMusicOnce);
    });
    
    // 페이지 진입 애니메이션
    birthdayPage.style.animation = 'pageEnter 2s ease-out forwards';
    
    // 배경 영상 재생
    const greetingBgVideo = document.getElementById('greetingBackgroundVideo');
    if (greetingBgVideo) {
        greetingBgVideo.play().catch(e => {
            console.log('배경 영상 자동 재생이 차단되었습니다.');
        });
    }
    
    // 스크롤을 맨 위로
    window.scrollTo(0, 0);
    birthdayPage.scrollTo(0, 0);

    // 생일 페이지 스크롤 설정
    setupBirthdayPageScroll();
}

// 음악 재생 (한 번만)
function playMusicOnce() {
    backgroundMusic.play();
    document.removeEventListener('click', playMusicOnce);
    document.removeEventListener('touchstart', playMusicOnce);
}

// 스크롤 애니메이션 설정
function setupScrollAnimations() {
    // Intersection Observer로 요소들의 가시성 감지
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // 편지 섹션 애니메이션
                if (target.classList.contains('letter-section')) {
                    animateLetterLines();
                }
                
                // 사진 섹션 애니메이션
                if (target.classList.contains('photo-section')) {
                    animatePhotos();
                }
                
                // 비디오 섹션 재생
                if (target.classList.contains('video-section') && !videoPlayed) {
                    playVideo();
                }
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들 등록
    const letterSection = document.querySelector('.letter-section');
    const photoSection = document.querySelector('.photo-section');
    const videoSection = document.querySelector('.video-section');
    
    if (letterSection) observer.observe(letterSection);
    if (photoSection) observer.observe(photoSection);
    if (videoSection) observer.observe(videoSection);
}

// 비디오 재생 함수
function playVideo() {
    backgroundVideo.play().catch(e => {
        console.log('비디오 자동 재생이 차단되었습니다.');
    });
    videoPlayed = true;
}

// 스크롤 처리
function handleScroll() {
    const scrollY = window.scrollY;
    
    // 패럴랙스 효과
    const parallaxElements = document.querySelectorAll('.birthday-decorations, .rilakkuma-gif');
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

// 편지 내용 동적 생성
function createLetterContent() {
    const letterContainer = document.getElementById('letterContent');
    
    letterContent.forEach((line, index) => {
        const p = document.createElement('p');
        p.className = index === letterContent.length - 1 ? 'letter-line signature' : 'letter-line';
        p.textContent = line;
        letterContainer.appendChild(p);
    });
}

// 편지 애니메이션 - 타이핑 효과
function animateLetterLines() {
    const letterContainer = document.getElementById('letterContent');
    if (letterContainer.children.length === 0) {
        createLetterContent();
    }
    
    const lines = document.querySelectorAll('.letter-line');
    let currentLineIndex = 0;
    
    function typeNextLine() {
        if (currentLineIndex >= lines.length) return;
        
        const currentLine = lines[currentLineIndex];
        const text = currentLine.textContent;
        currentLine.textContent = '';
        currentLine.style.opacity = '1';
        
        let charIndex = 0;
        const typeInterval = setInterval(() => {
            currentLine.textContent += text[charIndex];
            charIndex++;
            
            if (charIndex >= text.length) {
                clearInterval(typeInterval);
                currentLineIndex++;
                setTimeout(typeNextLine, 500); // 다음 줄까지 0.5초 대기, 줄간격
            }
        }, 80); // 각 글자마다 80ms 간격, 글간격
    }
    
    typeNextLine();
}

// 사진 애니메이션
function animatePhotos() {
    const photos = document.querySelectorAll('.polaroid');
    photos.forEach((photo, index) => {
        setTimeout(() => {
            photo.style.opacity = '1';
            photo.style.animation = `polaroidAppear 0.8s ease-out forwards`;
        }, index * 300);
    });
}

// 추가 CSS 애니메이션을 JavaScript로 동적 생성
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
        }
        
        @keyframes celebrationOut {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes pageEnter {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes dotFill {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        /* iPhone 14 Safari 뷰포트 높이 보정 */
        .lock-screen, .password-screen {
            height: 100vh;
            height: calc(var(--vh, 1vh) * 100);
        }
        
        /* 터치 피드백 개선 */
        .key-btn:active, .lock-icon:active {
            transform: scale(0.95) !important;
        }
        
        /* 스크롤 최적화 */
        .birthday-page {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        
        /* 성능 최적화 */
        .confetti-piece, .sparkle, .balloon {
            will-change: transform;
        }
        
        .celebration-video {
            will-change: opacity;
        }
    `;
    document.head.appendChild(style);
}

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 디바운스된 스크롤 핸들러
const debouncedScrollHandler = debounce(handleScroll, 16); // 60fps

// 생일 페이지에서만 스크롤 이벤트 적용
function setupBirthdayPageScroll() {
    if (!birthdayPage.classList.contains('hidden')) {
        birthdayPage.addEventListener('scroll', debouncedScrollHandler);
    }
}

// 일반 윈도우 스크롤은 생일 페이지가 아닐 때만
if (birthdayPage.classList.contains('hidden')) {
    window.addEventListener('scroll', debouncedScrollHandler);
}

// 에러 처리
window.addEventListener('error', function(e) {
    console.log('오류가 발생했습니다:', e.error);
});

// 미디어 로드 에러 처리
backgroundVideo.addEventListener('error', function() {
    console.log('비디오 로드에 실패했습니다.');
});

backgroundMusic.addEventListener('error', function() {
    console.log('음악 로드에 실패했습니다.');
});

// PWA 지원을 위한 서비스 워커 등록 (선택사항)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker 등록 성공:', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker 등록 실패:', error);
            });
    });
}

// 동적 스타일 추가
addDynamicStyles();

// 개발자 도구에서 테스트용 함수들
window.birthdayApp = {
    unlockNow: () => unlockLock(),
    setPassword: (pwd) => window.SECRET_PASSWORD = pwd,
    playMusic: () => backgroundMusic.play(),
    skipToSection: (section) => {
        const sections = ['greeting', 'video', 'letter', 'photo'];
        const index = sections.indexOf(section);
        if (index !== -1) {
            window.scrollTo(0, window.innerHeight * index);
        }
    }
};

// 배경 영상 에러 처리
const greetingBgVideo = document.getElementById('greetingBackgroundVideo');
if (greetingBgVideo) {
    greetingBgVideo.addEventListener('error', function() {
        console.log('배경 영상 로드에 실패했습니다.');
    });
}
