// js/admin.js

// 1. HTML의 ID와 정확히 일치시켜야 합니다 (admin-list)
const listContainer = document.getElementById('admin-list');

// 2. 데이터 실시간 감지
keywordsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    const keywords = [];

    for (let key in data) {
        keywords.push({ id: key, ...data[key] });
    }

    renderTable(keywords);
});

function renderTable(keywords) {
    if (!listContainer) return;
    listContainer.innerHTML = '';

    // 정렬: 최신순 (timestamp 기준)
    keywords.sort((a, b) => b.timestamp - a.timestamp);

    keywords.forEach(k => {
        const tr = document.createElement('tr');

        // --- 1. 키워드 텍스트 ---
        const tdText = document.createElement('td');
        tdText.textContent = k.text;
        if (k.isBold) tdText.style.fontWeight = 'bold';
        
        // --- 2. 상태 표시 (뱃지 디자인) ---
        const tdStatus = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = k.isShown ? 'status-badge approved' : 'status-badge pending';
        statusBadge.textContent = k.isShown ? '노출중' : '대기';
        tdStatus.appendChild(statusBadge);

        // --- 3. 강조(Bold) 체크박스 ---
        const tdBold = document.createElement('td');
        const boldCheck = document.createElement('input');
        boldCheck.type = 'checkbox';
        boldCheck.checked = k.isBold;
        boldCheck.addEventListener('change', () => {
            keywordsRef.child(k.id).update({ isBold: boldCheck.checked });
        });
        tdBold.appendChild(boldCheck);

        // --- 4. 관리 버튼 (노출 토글 / 삭제) ---
        const tdAction = document.createElement('td');
        
        // 노출/숨김 버튼
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn-action btn-approve';
        toggleBtn.textContent = k.isShown ? '숨기기' : '노출하기';
        toggleBtn.onclick = () => {
            keywordsRef.child(k.id).update({ isShown: !k.isShown });
        };

        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-action btn-delete';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = () => {
            if(confirm('정말 삭제하시겠습니까?')) {
                keywordsRef.child(k.id).remove();
            }
        };

        tdAction.appendChild(toggleBtn);
        tdAction.appendChild(deleteBtn);

        // 행에 열 추가
        tr.appendChild(tdText);
        tr.appendChild(tdStatus);
        tr.appendChild(tdBold);
        tr.appendChild(tdAction);

        listContainer.appendChild(tr);
    });
}
