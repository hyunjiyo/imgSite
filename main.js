const imagesWrapper = document.querySelector('.images');
const loadMoreBtn = document.querySelector('.load-more');

const apiKey = "RpRC60YCrTmXPyWN4ogyODVsO5Ho9eZOfToYZLySHRRkTBqy4kvJHYiN";
const perPage = 15;
let currentPage = 1;

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
  })
}

const loadMoreImages = () => {
  currentPage++; // 현재 페이지를 1씩 증가
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
  getImages(apiURL);
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreBtn.addEventListener('click', loadMoreImages);