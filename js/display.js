// js/display.js

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

function renderPlainDisplay(keywords) {
    const displayArea = document.getElementById('keyword-display-area');
    displayArea.innerHTML = '';

    const areaWidth = window.innerWidth;
    const areaHeight = window.innerHeight;

    keywords.forEach(keyword => {
        const el = document.createElement('div');
        el.classList.add('keyword-cloud');
        el.textContent = keyword.text;

        if (keyword.isBold) {
            el.classList.add('is-bold');
        }

        // 화면 안에서 무작위 좌표 생성 (여백 10% 확보)
        const x = Math.random() * (areaWidth * 0.8) + (areaWidth * 0.1);
        const y = Math.random() * (areaHeight * 0.8) + (areaHeight * 0.1);

        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        
        // 화면 밖으로 나가는 것 방지 (살짝 보정)
        el.style.transform = 'translate(-50%, -50%)';

        displayArea.appendChild(el);
    });
}