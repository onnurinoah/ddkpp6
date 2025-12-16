// js/display.js
// Firebase 및 DOM 요소 참조는 이미 다른 파일(firebaseConfig.js, display.html)에서 설정되었다고 가정합니다.

const activeQuery = keywordsRef.orderByChild('isShown').equalTo(true);

activeQuery.on('value', (snapshot) => {
    const data = snapshot.val();
    const keywords = [];

    if (data) {
        Object.keys(data).forEach(key => {
            // 키워드 ID (key)와 데이터(value)를 함께 배열에 추가
            keywords.push({
                id: key,
                ...data[key]
            });
        });
    }

    // 최종적으로 화면에 표시할 키워드의 최대 개수를 50개로 제한
    const maxKeywords = 50;
    const finalKeywords = keywords.slice(0, maxKeywords); 

    renderPlainDisplay(finalKeywords);
});

// 두 사각형(rect1과 rect2)이 겹치는지 확인하는 헬퍼 함수
function isColliding(rect1, rect2) {
    // 사각형의 경계를 기준으로 겹침 여부 판단
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

function renderPlainDisplay(keywords) {
    const displayArea = document.getElementById('keyword-display-area');
    displayArea.innerHTML = '';

    const areaWidth = displayArea.offsetWidth; // window.innerWidth 대신 컨테이너 크기 사용 권장
    const areaHeight = displayArea.offsetHeight; // window.innerHeight 대신 컨테이너 크기 사용 권장
    
    // 이미 배치된 키워드들의 위치와 크기를 저장할 배열
    const placedRects = []; 
    const maxAttempts = 50; // 위치 탐색 최대 시도 횟수

    keywords.forEach(keyword => {
        const el = document.createElement('div');
        el.classList.add('keyword'); // 'keyword-cloud' 대신 통일된 'keyword' 클래스 사용
        el.textContent = keyword.text;

        // 1. 스타일 및 상태 설정
        if (keyword.isBold) {
            el.classList.add('is-bold');
        }

        // 상태 표시 span 추가 (이전 CSS/JS 버전에서 정의됨)
        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        const currentStatus = keyword.status || 'approved'; 
        statusSpan.textContent = currentStatus.toUpperCase();
        statusSpan.classList.add(currentStatus);
        el.appendChild(statusSpan);


        // 2. 초기 스타일 설정 및 DOM에 잠시 추가 (크기 측정을 위함)
        el.style.position = 'absolute';
        el.style.opacity = 0; // 잠시 숨김
        displayArea.appendChild(el);


        let attempt = 0;
        let foundPosition = false;
        let xPos, yPos;
        let finalRect;

        // 3. 충돌 감지 루프 시작
        while (attempt < maxAttempts && !foundPosition) {
            
            // 화면 안에서 무작위 좌표 생성 (여백 10% 확보)
            xPos = Math.random() * (areaWidth * 0.8) + (areaWidth * 0.1);
            yPos = Math.random() * (areaHeight * 0.8) + (areaHeight * 0.1);

            // 요소에 임시 위치 적용
            el.style.left = `${xPos}px`;
            el.style.top = `${yPos}px`;
            el.style.transform = 'translate(-50%, -50%)'; // 중심점 기준 배치

            // 현재 요소의 크기 및 위치 정보 측정
            // Note: getBoundingClientRect()는 뷰포트 기준이므로,
            // 상대 위치 계산을 위해 left/top 값을 조정하여 컨테이너 기준 위치로 변환해야 합니다.
            const rect = el.getBoundingClientRect();
            const displayRect = displayArea.getBoundingClientRect();

            finalRect = {
                left: rect.left - displayRect.left,
                right: rect.right - displayRect.left,
                top: rect.top - displayRect.top,
                bottom: rect.bottom - displayRect.top,
            };

            // 모든 배치된 요소와 충돌하는지 확인
            let isOverlapping = false;
            for (let placedRect of placedRects) {
                if (isColliding(finalRect, placedRect)) {
                    isOverlapping = true;
                    break; 
                }
            }

            if (!isOverlapping) {
                foundPosition = true; // 충돌 없음, 위치 확정
            }
            
            attempt++;
        }

        // 4. 위치 확정 및 배열에 저장
        if (foundPosition) {
            // 위치 적용은 이미 루프에서 완료됨
            placedRects.push(finalRect); // 배치된 위치와 크기를 목록에 추가
        } else {
            // 위치를 찾지 못하면 해당 키워드는 표시하지 않음
            displayArea.removeChild(el); 
            console.warn(`키워드 '${keyword.text}'는 공간 부족으로 배치되지 않았습니다.`);
            return;
        }

        // 5. 시각화 효과 (부드럽게 나타나기)
        // opacity를 1로 변경하여 CSS transition 효과 발동
        setTimeout(() => {
             el.style.opacity = 1; 
        }, 50);
    });
}