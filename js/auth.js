const form = document.querySelector("form");
const toast = document.querySelector(".toast");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const eyeBtn = document.querySelector(".eye-icon");
const eyeIcon = document.querySelector(".eye-icon span");


const url = "https://jsonplaceholder.org/users"

function showToast(message, duration = 3000) {
    toast.classList.add("is-active");
    toast.textContent = message;

    setTimeout(() => {
        toast.classList.remove("is-active");
    }, duration);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const uname = username.value;
    const pwd = password.value;

    if (!uname && !pwd) {
        console.log("something happened");
        showToast("All fields are required");
    } else if (!uname) {
        showToast("Username is required");
    } else if (!pwd) {
        showToast("Password is required");
    } else if (pwd.length <= 5) {
        showToast("Password should be at least 6 characters!");
    } else {
        console.log("Success");
        loginUser(uname, pwd)
        // window.location.href = "/blog.html"
    }
});

eyeBtn.addEventListener("click", () => {
    password.type = password.type === "password" ? "text" : "password"
    eyeIcon.textContent = password.type === "password" ? "visibility_off" : "visibility";

})

const loginUser = (uname, pwd) => {
    axios.get(url)
        .then(response => {
            if (response.status === 200) {
                const users = response.data;
                const userExists = users.some(user =>
                    user.login.username === uname && user.login.password === pwd
                );

                if (userExists) {
                    toast.classList.add("success")
                    showToast("Login successful");
                    localStorage.setItem('username', uname);
                    window.location.href = "/blog.html";
                } else {
                    throw new Error("User does not exist or wrong credentials");
                }
            } else {
                throw new Error(`Failed to fetch users: ${response.status}`);
            }
        })
        .catch(error => {
            console.error(error);
            showToast(error.message || "An error occurred");
        });
};

logout_btn.addEventListener('click', () => {
    window.location.href = "/index.html"
})

