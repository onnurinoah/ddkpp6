const form = document.getElementById('keywordForm');
const input = document.getElementById('keywordInput');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();

    if (text) {
        // Firebase에 데이터 추가 (기본값: 숨김, 볼드 아님)
        keywordsRef.push({
            text: text,
            isShown: false,
            isBold: false,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            alert("전송되었습니다! 관리자 승인 대기 중.");
            input.value = '';
        }).catch((error) => {
            console.error("Error:", error);
            alert("전송 실패.");
        });
    }
});