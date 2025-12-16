// js/display.js

// ... (activeQuery 및 activeQuery.on('value', ...) 로직은 이전과 동일) ...

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

    const areaWidth = displayArea.offsetWidth;
    const areaHeight = displayArea.offsetHeight;
    
    // 이미 배치된 키워드들의 위치와 크기를 저장할 배열
    const placedRects = []; 
    const maxAttempts = 50; 
    const padding = 10; // 키워드 사이의 최소 여백 (픽셀)

    keywords.forEach(keyword => {
        const el = document.createElement('div');
        el.classList.add('keyword'); 
        el.textContent = keyword.text;

        // 1. 스타일 및 상태 설정
        if (keyword.isBold) {
            el.classList.add('is-bold');
        }

        const statusSpan = document.createElement('span');
        statusSpan.classList.add('status');
        const currentStatus = keyword.status || 'approved'; 
        statusSpan.textContent = currentStatus.toUpperCase();
        statusSpan.classList.add(currentStatus);
        el.appendChild(statusSpan);


        // 2. 초기 스타일 설정 및 DOM에 잠시 추가 (크기 측정을 위함)
        el.style.position = 'absolute';
        el.style.opacity = 0; 
        el.style.left = '0'; // 초기 위치를 화면 밖으로 설정하여 측정 오류 방지
        el.style.top = '0';
        displayArea.appendChild(el);


        let attempt = 0;
        let foundPosition = false;
        let xPos, yPos;
        let finalRect;

        // **요소의 크기를 측정** (DOM에 추가된 후에만 가능)
        const elWidth = el.offsetWidth;
        const elHeight = el.offsetHeight;

        // 3. 충돌 감지 루프 시작
        while (attempt < maxAttempts && !foundPosition) {
            
            // 화면 안에서 무작위 좌표 생성 (중심점 기준)
            // 화면 영역 (0.1 ~ 0.9) 범위 내에서 중앙 좌표 생성
            xPos = Math.random() * (areaWidth * 0.8) + (areaWidth * 0.1);
            yPos = Math.random() * (areaHeight * 0.8) + (areaHeight * 0.1);

            // 최종 배치될 예상 사각형 영역 (컨테이너 기준)
            finalRect = {
                // translate(-50%, -50%)를 고려하여 사각형 경계를 계산합니다.
                left: xPos - elWidth / 2 - padding,
                right: xPos + elWidth / 2 + padding,
                top: yPos - elHeight / 2 - padding,
                bottom: yPos + elHeight / 2 + padding,
            };
            
            // 화면 경계를 벗어나는지 1차 확인
            if (finalRect.left < 0 || finalRect.right > areaWidth ||
                finalRect.top < 0 || finalRect.bottom > areaHeight) {
                attempt++;
                continue; // 경계를 벗어남
            }

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
            // 위치 적용
            el.style.left = `${xPos}px`;
            el.style.top = `${yPos}px`;
            el.style.transform = 'translate(-50%, -50%)'; // CSS 중심점 배치

            placedRects.push(finalRect); // 배치된 위치와 크기를 목록에 추가
        } else {
            // 위치를 찾지 못하면 해당 키워드는 제거
            displayArea.removeChild(el); 
            console.warn(`키워드 '${keyword.text}'는 공간 부족으로 배치되지 않았습니다.`);
            return;
        }

        // 5. 시각화 효과 (부드럽게 나타나기)
        setTimeout(() => {
             el.style.opacity = 1; 
        }, 50);
    });
}