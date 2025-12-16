const displayArea = document.getElementById('displayArea');

keywordsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const keywords = [];
    for (let key in data) {
        keywords.push({ id: key, ...data[key] });
    }
    renderDisplay(keywords);
});

function renderDisplay(keywords) {
    displayArea.innerHTML = ''; 

    // 승인된(isShown === true) 키워드만 필터링
    const activeKeywords = keywords.filter(k => k.isShown);

    activeKeywords.forEach(k => {
        const div = document.createElement('div');
        div.textContent = k.text;
        div.className = 'keyword-item';

        // 볼드체 스타일 적용
        if (k.isBold) {
            div.style.fontWeight = 'bold';
            div.style.color = '#000'; // 진한 검정 (원하는 색으로 변경 가능)
            div.style.transform = 'scale(1.2)'; // 약간 더 크게
        } else {
            div.style.color = '#555';
        }

        // 랜덤 위치 계산 (화면 10% ~ 90% 사이)
        // seed를 id로 써서 위치를 고정할 수도 있지만, 여기선 매번 랜덤으로 둡니다.
        const top = Math.floor(Math.random() * 80) + 10; 
        const left = Math.floor(Math.random() * 80) + 10;

        div.style.top = top + '%';
        div.style.left = left + '%';

        displayArea.appendChild(div);
    });
}