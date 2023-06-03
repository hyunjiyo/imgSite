const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = lightBox.querySelector('.uil-times');
const downloadImgBtn = lightBox.querySelector('.uil-import');


// API key, paginations, searchTerm 변수
const apiKey = "RpRC60YCrTmXPyWN4ogyODVsO5Ho9eZOfToYZLySHRRkTBqy4kvJHYiN";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  // 수신된 img를 blob으로 변환하고 다운로드 링크 생성한 뒤 그것을 다운로드
  fetch(imgURL).then(res=> res.blob()).then(file =>{ // blob으로 변환
    const a = document.createElement("a"); // 다운로드 링크 생성
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click(); // 다운로드
  }).catch(()=>alert('Failed to download image!'));
}

const showLightbox = (name, img) => {
  // lightbox를 보여주고 이미지와 이름, 요소의 속성값을 설정
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img); // 요소의 속성값 설정
  lightBox.classList.add("show");
  // body에 scroll 가리기
  document.body.style.overflow = 'hidden';
}

const hideLightbox = () =>{
  lightBox.classList.remove("show");
  document.body.style.overflow = 'auto';
}


const generateHTML = (images) => {
  // 가져온 이미지를 li로 만들어 기존 이미지 wrapper에 추가
  // event.stopPropagation() : event 객체의 버블링 제거 -> 버블링 : 이벤트가 연속하여 발생하는 현상
  imagesWrapper.innerHTML += images.map(img => 
    `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
    <img src="${img.src.large2x}" alt="img" />
    <div class="details">
      <div class="photographer">
        <i class="uil uil-camera"></i>
        <span>${img.photographer}</span>
      </div>
        <button onclick="downloadImg('${img.src.large2x}'); event.stopPropagation();">
          <i class='uil uil-import'></i>
        </button>
    </div>
  </li>`
  ).join("");
}

const getImages = (apiURL) => {
  // API 인증해 header로 호출해서 가져오기기
  loadMoreBtn.innerText = 'Loading...';
  loadMoreBtn.classList.add('disabled');
  fetch(apiURL, {
    headers : {Authorization: apiKey}
  }).then(res => res.json()).then(data => {
    generateHTML(data.photos);
    loadMoreBtn.innerText = 'Load More';
    loadMoreBtn.classList.remove('disabled');
  }).catch(()=> alert ('Failed to load images!'));
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
  if(e.target==='') return searchTerm = null;
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
closeBtn.addEventListener('click', hideLightbox);
// 버튼 img 속성 값을 downloadImg 함수의 인수로 전달
// dataset : data 속성에 접근
downloadImgBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));
