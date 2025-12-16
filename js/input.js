// js/input.js

// 1. HTML 요소 가져오기
const inputField = document.getElementById('keyword-input');
const submitBtn = document.getElementById('submit-btn');

// 2. 버튼 클릭 이벤트
submitBtn.addEventListener('click', () => {
    const text = inputField.value.trim();

    if (text) {
        // 3. Firebase에 데이터 전송
        // keywordsRef는 firebaseConfig.js에서 이미 정의되어 있어야 합니다.
        keywordsRef.push({
            text: text,
            isShown: false,    // 관리자 승인 전
            isBold: false,     // 기본은 일반체
            status: 'pending', // 대기 상태
            timestamp: Date.now()
        })
        .then(() => {
            alert('성공적으로 전송되었습니다!');
            inputField.value = ''; // 입력창 초기화
        })
        .catch((error) => {
            console.error("Firebase 전송 에러:", error);
            alert('전송에 실패했습니다: ' + error.message);
        });
    } else {
        alert('내용을 입력해주세요.');
    }
});

// 엔터키 지원 (선택 사항이지만 편리합니다)
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});