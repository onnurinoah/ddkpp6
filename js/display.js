// js/display.js 

/**
 * Firebase 리얼타임 데이터베이스 감시
 * 'isShown'이 true인 데이터만 실시간으로 가져옵니다.
 */
const activeQuery = keywordsRef.orderByChild('isShown').equalTo(true); 

activeQuery.on('value', (snapshot) => { 
    const data = snapshot.val(); 
    const keywords = []; 

    if (data) { 
        Object.keys(data).forEach(key => { 
            keywords.push(data[key]); 
        }); 
    } 
    renderPlainDisplay(keywords); 
}); 

/**
 * 화면에 키워드를 렌더링하는 메인 함수
 * @param {Array} keywords - 표시할 키워드 객체 배열
 */
function renderPlainDisplay(keywords) { 
    const displayArea = document.getElementById('keyword-display-area'); 
    if (!displayArea) return;

    displayArea.innerHTML = ''; // 기존 요소 초기화

    const count = keywords.length;
    if (count === 0) return;

    const areaWidth = window.innerWidth; 
    const areaHeight = window.innerHeight; 

    // 1. 키워드 수에 따른 동적 격자(Grid) 계산
    // 60개일 경우 약 8~9열/행으로 구성되어 칸을 확보함
    const cols = Math.ceil(Math.sqrt(count * 1.3)); 
    const rows = Math.ceil(count / cols); 
    const xStep = areaWidth / cols; 
    const yStep = areaHeight / rows; 

    // 2. 개수에 따른 기본 글자 크기(Base Font Size) 보정
    // 단어가 많아질수록 기본 크기를 줄여 가독성을 확보합니다.
    let baseFontSize = 2.2; // 기본 (rem)
    if (count > 20) baseFontSize = 1.8;
    if (count > 40) baseFontSize = 1.5;
    if (count > 60) baseFontSize = 1.2;

    // 3. 사용 가능한 격자 슬롯 생성 및 셔플
    let slots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            slots.push({ r, c });
        }
    }

    // Fisher-Yates Shuffle로 슬롯 순서를 무작위로 섞음
    for (let i = slots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    // 4. 각 키워드 배치
    keywords.forEach((keyword, index) => { 
        const el = document.createElement('div'); 
        el.classList.add('keyword-cloud'); 
        el.textContent = keyword.text; 

        // 강조 여부에 따른 글자 크기 및 클래스 적용
        if (keyword.isBold) { 
            el.classList.add('is-bold'); 
            // 강조 글씨는 일반 글씨보다 1.8배 크게 (하지만 자동 축소 비율 반영)
            el.style.fontSize = `${baseFontSize * 1.8}rem`;
        } else {
            el.style.fontSize = `${baseFontSize}rem`;
        }

        // 슬롯 할당 (슬롯보다 키워드가 많을 경우를 대비한 나머지 연산)
        const slot = slots[index % slots.length];

        // 격자 중심점 계산
        const centerX = (slot.c * xStep) + (xStep / 2);
        const centerY = (slot.r * yStep) + (yStep / 2);

        // 격자 칸 내부에서의 랜덤 오차 (너무 일렬로 서 있지 않게 함)
        // 칸 크기의 70% 범위 내에서 무작위 이동
        const randomOffsetX = (Math.random() - 0.5) * (xStep * 0.7);
        const randomOffsetY = (Math.random() - 0.5) * (yStep * 0.7);

        const x = centerX + randomOffsetX;
        const y = centerY + randomOffsetY;

        // 최종 좌표 적용
        el.style.left = `${x}px`; 
        el.style.top = `${y}px`; 
        
        // CSS transform과의 충돌 방지를 위해 JS에서 설정
        el.style.transform = 'translate(-50%, -50%)'; 

        displayArea.appendChild(el); 
    }); 
}

// 창 크기가 변경될 때 배치 재계산 (선택 사항)
window.addEventListener('resize', () => {
    // 필요 시 현재 화면에 노출 중인 데이터를 다시 렌더링하도록 설정 가능
});