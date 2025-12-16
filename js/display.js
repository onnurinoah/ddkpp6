function renderPlainDisplay(keywords) {
  const displayArea = document.getElementById('keyword-display-area');
  displayArea.innerHTML = '';

  const areaWidth = window.innerWidth;
  const areaHeight = window.innerHeight;
  
  // 이미 배치된 요소들의 위치 정보를 저장할 배열
  const placedElements = []; 

  keywords.forEach(keyword => {
    const el = document.createElement('div');
    el.classList.add('keyword-cloud');
    el.textContent = keyword.text;

    if (keyword.isBold) {
      el.classList.add('is-bold');
    }

    // 1. 먼저 DOM에 추가하여 너비와 높이를 계산할 수 있게 함 (보이지 않더라도 크기는 잡힘)
    // 위치를 잡기 전에는 화면 밖이나 투명하게 두는 것이 좋을 수 있으나, 
    // JS 실행 중에는 렌더링이 차단되므로 바로 위치를 잡아주면 깜빡임은 거의 없습니다.
    displayArea.appendChild(el);

    const width = el.offsetWidth;
    const height = el.offsetHeight;
    
    // 2. 겹치지 않는 위치 찾기 (최대 50번 시도)
    let bestX = 0;
    let bestY = 0;
    let isColliding = true;
    let tryCount = 0;
    const maxTries = 50; 

    while (isColliding && tryCount < maxTries) {
      // 여백 10% 확보 (기존 로직 유지)
      const x = Math.random() * (areaWidth * 0.8) + (areaWidth * 0.1);
      const y = Math.random() * (areaHeight * 0.8) + (areaHeight * 0.1);
      
      // 현재 좌표(중심점)를 기준으로 사각형 영역 계산
      // transform: translate(-50%, -50%)를 고려하여 좌,우,상,하 계산
      const currentRect = {
        left: x - width / 2,
        right: x + width / 2,
        top: y - height / 2,
        bottom: y + height / 2
      };

      // 기존에 배치된 모든 요소와 충돌 체크
      let overlapFound = false;
      for (const placed of placedElements) {
        if (checkCollision(currentRect, placed)) {
          overlapFound = true;
          break; 
        }
      }

      if (!overlapFound) {
        bestX = x;
        bestY = y;
        isColliding = false;
        // 배치 확정된 영역 저장
        placedElements.push(currentRect);
      }
      
      tryCount++;
    }

    // 3. 찾은 위치(혹은 실패 시 마지막 시도 위치) 적용
    // 만약 50번 시도해도 자리가 없으면 그냥 겹치더라도 배치됩니다 (무한 루프 방지)
    if (isColliding) {
       // 자리를 못 찾았을 때의 처리가 필요하다면 여기서 로직 추가 (예: el.remove()로 삭제)
       // 여기서는 그냥 마지막 랜덤 좌표에 배치합니다.
       bestX = Math.random() * (areaWidth * 0.8) + (areaWidth * 0.1);
       bestY = Math.random() * (areaHeight * 0.8) + (areaHeight * 0.1);
    }

    el.style.left = `${bestX}px`;
    el.style.top = `${bestY}px`;
    el.style.transform = 'translate(-50%, -50%)';
  });
}

// 두 사각형(rect1, rect2)이 겹치는지 확인하는 헬퍼 함수
function checkCollision(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||  // 1이 2보다 왼쪽에 있음
    rect1.left > rect2.right ||  // 1이 2보다 오른쪽에 있음
    rect1.bottom < rect2.top ||  // 1이 2보다 위에 있음
    rect1.top > rect2.bottom     // 1이 2보다 아래에 있음
  );
}