const listContainer = document.getElementById('adminList');

// 데이터 실시간 감지
keywordsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const keywords = [];

    // 데이터를 배열로 변환
    for (let key in data) {
        keywords.push({ id: key, ...data[key] });
    }

    renderList(keywords);
});

function renderList(keywords) {
    listContainer.innerHTML = '';

    // 정렬: 노출된 것(isShown=true)을 위로, 그 다음 최신순
    keywords.sort((a, b) => {
        if (a.isShown === b.isShown) {
            return b.timestamp - a.timestamp; // 최신순
        }
        return a.isShown ? -1 : 1; // 노출된게 위로
    });

    keywords.forEach(k => {
        const li = document.createElement('li');
        if (k.isShown) li.classList.add('active'); // 초록색 배경

        // 1. 체크박스 (볼드체)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bold-check';
        checkbox.checked = k.isBold;
        
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation(); // 부모 클릭 방지
            db.ref('keywords/' + k.id).update({ isBold: !k.isBold });
        });

        // 2. 텍스트 (클릭 시 노출 토글)
        const span = document.createElement('span');
        span.className = 'text-area';
        span.textContent = k.text;
        if (k.isBold) span.style.fontWeight = 'bold';

        // 3. 상태 메시지
        const status = document.createElement('span');
        status.className = 'status';
        status.textContent = k.isShown ? '[노출중]' : '[대기]';

        // 리스트 클릭 이벤트 (노출/숨김 토글)
        li.addEventListener('click', () => {
            db.ref('keywords/' + k.id).update({ isShown: !k.isShown });
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(status);
        listContainer.appendChild(li);
    });
}