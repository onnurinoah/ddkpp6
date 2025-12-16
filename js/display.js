// js/display.js

// Firebase keywordsRef는 firebaseConfig.js에서 가져옴
// isShown이 true인 것만 가져오기
const activeQuery = keywordsRef.orderByChild('isShown').equalTo(true);

activeQuery.on('value', (snapshot) => {
    const data = snapshot.val();
    const keywords = [];

    if (data) {
        Object.keys(data).forEach(key => {
            keywords.push(data[key]);
        });
    }

    // 화면 렌더링
    renderTreeDisplay(keywords);
});

function renderTreeDisplay(keywords) {
    const displayArea = document.getElementById('keyword-display-area');
    
    // 기존 키워드 모두 지우기 (초기화)
    displayArea.innerHTML = '';

    const areaWidth = displayArea.offsetWidth;
    const areaHeight = displayArea.offsetHeight;
    const centerX = areaWidth / 2;

    keywords.forEach(keyword => {
        const el = document.createElement('div');
        el.classList.add('keyword-cloud');
        el.textContent = keyword.text;

        // 볼드체 체크
        if (keyword.isBold) {
            el.classList.add('is-bold');
        }

        // --- 위치 계산 (트리 모양) ---
        // Y축: 화면의 10% ~ 80% 높이 사이에 랜덤 배치
        const randomY = Math.random() * (areaHeight * 0.7) + (areaHeight * 0.1);
        
        // X축: 트리의 아래쪽일수록 넓게 퍼지고, 위쪽일수록 좁아지게 (삼각형 모양)
        // 화면 높이 대비 현재 높이 비율 (0 = 위, 1 = 아래)
        const heightRatio = randomY / areaHeight; 
        
        // 퍼짐 정도 (아래쪽은 최대 ±300px, 위쪽은 ±50px)
        const spread = 50 + (heightRatio * 300); 
        
        // 중앙 기준 랜덤 좌우 배치
        const randomX = centerX + (Math.random() - 0.5) * 2 * spread;

        // 경계선 넘지 않도록 보정
        const safeX = Math.max(50, Math.min(areaWidth - 100, randomX));

        el.style.top = `${randomY}px`;
        el.style.left = `${safeX}px`;

        displayArea.appendChild(el);
    });
}