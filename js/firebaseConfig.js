// js/firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyDACx4rGRM4_KY1vu3koq38kZeivk1vu2E",
  authDomain: "ddkpp6.firebaseapp.com",
  databaseURL: "https://ddkpp6-default-rtdb.firebaseio.com",
  projectId: "ddkpp6",
  appId: "1:838759220678:web:4b3c020482c374b2961ec7"
};

// Firebase 초기화
// (HTML에서 로드한 firebase 객체를 사용합니다)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const keywordsRef = db.ref('keywords');
