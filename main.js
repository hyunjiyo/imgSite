const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');


// API key, paginations, searchTerm 변수
const apiKey = "RpRC60YCrTmXPyWN4ogyODVsO5Ho9eZOfToYZLySHRRkTBqy4kvJHYiN";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;




const generateHTML = (images) => {
  // 가져온 이미지를 li로 만들어 기존 이미지 wrapper에 추가
  loadMoreBtn.innerText = 'Loading...';
  loadMoreBtn.classList.add('disabled');
  imagesWrapper.innerHTML += images.map(img => 
    `<li class="card">
    <img src="${img.src.large2x}" alt="img" />
    <div class="details">
      <div class="photographer">
        <i class="uil uil-camera"></i>
        <span>${img.src.photographer}</span>
      </div>
      <button><i class='uil uil-import'></i></button>
    </div>
  </li>`
  ).join("");
}

const getImages = (apiURL) => {
  // API 인증해 header로 호출해서 가져오기기
  fetch(apiURL, {
    headers : {Authorization: apiKey}
  }).then(res => res.json()).then(data => {
    generateHTML(data.photos);
    loadMoreBtn.innerText = 'Load More';
    loadMoreBtn.classList.remove('disabled');
  }).catch(()=> alert ('Faled to load images!'));
}

const loadMoreImages = () => {
  currentPage++; // 현재 페이지를 1씩 증가


  // 만약 searchTerm에 값이 있으면 검색어를 사용해 api를 호출. 그렇지 않으면 기본 api 호출 
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
}

const loadSearchImages = (e) => {
  // 검색창이 비어 있으면 검색어를 null로 설정하고 여기에서 반환
  if(e.targiet==='') return searchTerm = null;
  // enter를 누르면 현재페이지 업데이트 용어검색하고 이미지를 호출
  if(e.key === 'Enter'){
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
  }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
