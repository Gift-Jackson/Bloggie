const logout_btn = document.querySelector(".logout-btn");
const dropdown = document.querySelector(".right-nav")
const menu_btn = document.querySelector(".menu-btn")
const theme_btn = document.querySelector(".theme")
const menu_icon = document.querySelector(".menu-icon")
const theme_icon = document.querySelector(".theme-icon")

const posts = document.querySelector(".posts")
const search = document.querySelector(".search-input")
const msg = document.querySelector(".msg")
const loadMoreButton = document.querySelector(".more-btn")
const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal-container");
const closeModalButton = document.querySelector(".close-modal");

const body = document.body

// Load saved theme from local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    theme_icon.textContent = savedTheme === "dark" ? "light_mode" : "dark_mode";
}

// Toggle theme and save to local storage
theme_btn.addEventListener("click", () => {
    body.classList.toggle("dark");
    const currentTheme = body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem('theme', currentTheme);
    theme_icon.textContent = currentTheme === "dark" ? "light_mode" : "dark_mode";
});

menu_btn.addEventListener("click", (event) => {
    dropdown.classList.toggle("open")
    menu_icon.textContent = dropdown.classList.contains("open") ? "close" : "menu";
    event.stopPropagation();
})

// click outside the dropdown to close it
document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target) && dropdown.classList.contains("open")) {
        dropdown.classList.remove("open");
        menu_icon.textContent = "menu";
    }
});

logout_btn.addEventListener('click', () => {
    window.location.href = "/index.html"
})

let allPosts = [];
let displayedPosts = 8;

axios.get("https://jsonplaceholder.org/posts")
    .then((result) => {
        console.log(result.data)
        allPosts = result.data;
        displayPost(allPosts.slice(0, displayedPosts));
        emptyData(allPosts.slice(0, displayedPosts))
    }).catch((err) => {
        console.log(err)
    });

const displayPost = (data) => {
    posts.innerHTML = '';
    const markup = data.map((post) => {
        const { image, title, content, updatedAt, id } = post

        return ` <li class="post" id="${id}">
                    <div class="img-wrap">
                        <img src="${image}" alt="">
                    </div>
                    <div class="post-info">
                        <h4>${title}</h4>
                        <p>${updatedAt}</p>
                    </div>
                    <button class="read-post-btn">Read Post &nbsp; <i class="fa-solid fa-up-right-from-square"></i></button/>
                </li>`
    }).join("")

    posts.insertAdjacentHTML("beforeend", markup)

    // Add event listeners to the "Read Post" buttons
    const readPostButtons = document.querySelectorAll('.read-post-btn');
    readPostButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.closest('.post').id;
            openModal(postId);
        });
    });

    if (allPosts.length > displayedPosts) {
        loadMoreButton.style.display = "block";
    } else {
        loadMoreButton.style.display = "none";
    }
}

// Filter posts based on search input
const filterPosts = (query) => {
    const filteredPosts = allPosts.filter(post => post.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    displayPost(filteredPosts.slice(0, displayedPosts));
    emptyData(filteredPosts.slice(0, displayedPosts));
};

// Event listener for search input
search.addEventListener('input', (e) => {
    const query = e.target.value;
    filterPosts(query);
});

const emptyData = (data) => {
    if (data.length === 0) {
        msg.style.display = "block";
    } else {
        msg.style.display = "none";
    }
};

loadMoreButton.addEventListener('click', () => {
    displayedPosts = allPosts.length;
    displayPost(allPosts);
    checkEmptyData(allPosts);
});

// Open modal and display the post content
const openModal = (postId) => {
    const post = allPosts.find(p => p.id == postId);
    if (post) {
        modal.querySelector('.modal-img img').src = post.image;
        modal.querySelector('.post-title').textContent = post.title;
        modal.querySelector('.post-date').textContent = post.updatedAt;
        modal.querySelector('.post-content').textContent = post.content;

        modalContainer.classList.add('open');
    }
};

// Close modal
closeModalButton.addEventListener('click', () => {
    modalContainer.classList.remove('open');
});

// Close modal when clicking outside of it
modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer || e.target === document.querySelector(".overlay")) {
        modalContainer.classList.remove('open');
    }
});


// Initial check
emptyData(allPosts);
