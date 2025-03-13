const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("vedio-container").classList.add("hidden");
};

const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("vedio-container").classList.remove("hidden");
};

function removeActiceClass(){
    const activeBtn = document.getElementsByClassName('active');
    for(let btn of activeBtn){
        btn.classList.remove("active");
    }
}

function loadCategories(){
    //1 fetch data
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
};

function displayCategories(categories){
    const categoryContainer = document.getElementById("category-container");
    for(let cat of categories){
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `
            <button id="${cat.category_id}" onclick="loadCategoryVedio(${cat.category_id})" class="btn btn-sm px-4 hover:text-white hover:bg-[#FF1F3D]">${cat.category}</button>
        `;
        categoryContainer.appendChild(categoryDiv);
    }
};

function loadVedio(searchText = ""){
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then(res => res.json())
        .then(data => {
            removeActiceClass();
            document.getElementById("btn-all").classList.add("active")
            displayVedios(data.videos)
        })
};

const loadCategoryVedio = (id) => {
    showLoader();
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActiceClass();
            const clickedBtn = document.getElementById(`${id}`);
            clickedBtn.classList.add("active");
            displayVedios(data.category)
        })
}

const loadVedioDeatails = (vedioId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${vedioId}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayVedioDeatails(data.video)
        })
};

const displayVedioDeatails = (video) => {
    // console.log(video);
    document.getElementById("vedio_deatails").showModal();
    const deatailsContainer = document.getElementById("deatails-container");
    deatailsContainer.innerHTML = `
    <div class="card bg-base-100 image-full w-96 shadow-sm mx-auto">
        <figure>
            <img
            src="${video.thumbnail}"
            alt="Shoes" />
        </figure>
        <div class="card-body">
            <h1 class="flex gap-1">
                ${video.authors[0].profile_name}
                ${video.authors[0].verified == true ? `<img width="20" height="20" src="https://img.icons8.com/skeuomorphism/32/verified-badge.png" alt="verified-badge"/> ` : '' }
            </h1>
            <h2 class="card-title">${video.title}</h2>
            <p>${video.description}</p>
        </div>
    </div>
    `;
}

const displayVedios = (vedios) => {
    const vedioContainer = document.getElementById("vedio-container");
    vedioContainer.innerHTML = "";
    if(vedios.length == 0){
        vedioContainer.innerHTML = `
            <div class="py-20 col-span-full flex flex-col justify-center items-center text-center gap-5">
                <img class="w-[200px]" src="./Icon.png" alt="">
                <h1 class="font-bold text-3xl">Oops!! Sorry, There is no content here</h1>
            </div>
        `;
        hideLoader();
        return;
    }
    vedios.forEach(vedio => {
        // console.log(vedio);
        const vedioCart = document.createElement("div");
        vedioCart.innerHTML = `
        <div class="card bg-base-100">
            <figure class="relative">
                <img class="rounded-lg w-full h-[250px] object-cover"
                src="${vedio.thumbnail}"
                alt="Shoes" />
                <span class="absolute text-white bg-black rounded px-1 bottom-2 right-2 text-sm">3hrs 56 min ago</span>
            </figure>
            <div class="flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary w-10 rounded-full">
                            <img src="${vedio.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <h2 class="text-xl font-semibold">${vedio.title}</h2>
                    <h3 class="text-sm text-gray-400 flex gap-1">
                        ${vedio.authors[0].profile_name}
                        ${vedio.authors[0].verified == true ? 
                            `<img width="20" height="20" src="https://img.icons8.com/skeuomorphism/32/verified-badge.png" alt="verified-badge"/>`
                            : '' }
                    </h3>
                    <p class="text-sm text-gray-400">${vedio.others.views} views</p>
                </div>
            </div>
            <button onclick = loadVedioDeatails("${vedio.video_id}") class="btn btn-block">Show Deatails</button>
        </div>
        `;
        vedioContainer.appendChild(vedioCart);
    });
    hideLoader();
}

document.getElementById("search-input")
    .addEventListener("keyup",
        (event) => {
            const input = event.target.value;
            loadVedio(input);
            showLoader();
        }
    )

loadCategories()
loadVedio();