const addPostBtn = document.querySelector(".addPost");
if (localStorage.length != 0) {
  toggleLoginSection("toggle", "d-none");
  addPostBtn.classList.remove("d-none");
} else {
  toggleLogoutSection("toggle", "d-none");
}
const url = "https://tarmeezacademy.com/api/v1";
let token;
token = localStorage.getItem("token");
const login_logout = document.querySelector(".login-logout");

// make function to show posts
async function showPosts(url) {
  const post_section = document.querySelector(".post-section");
  post_section.innerHTML = "";
  try {
    const response = await axios.get(`${url}/posts?limit=5`);
    const { data } = response.data;
    console.log(data);
    for (const post of data) {
      let { created_at, title, image, comments_count, body } = post;
      let { username, profile_image } = post.author;
      if (typeof image === "object") {
        image = profile_image;
      } else {
        image = image;
      }
      post_section.innerHTML += `
              <div class="col-md-9 ">
                <div class="card shadow ">
                    <div class="border">
                        <img src="${image}" alt="user" class="rounded-circle m-2" width="40" height="40">
                        <span class="fw-bold">${username}</span>
                    </div>

                    <img src=${image} class="w-100" alt="user">
                    <span class="small m-1">2 ${created_at}</span>
                    <div class="card-body">

                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">
                            ${body}
                        </p>
                        <p class="card-text border-top">

                            <small class="text-body-secondary ">
                                <i class="fa-solid fa-pen text-primary"></i> <span>comments(${
                                  comments_count == 0
                                    ? Math.floor(Math.random() * 10) + 1
                                    : comments_count
                                })</span>
                            </small>
                        </p>
                    </div>
                </div>
            </div>
            `;
    }
  } catch (error) {
    console.log(error);
  }
}

showPosts(url);

function login(url) {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  const user_info_name = document.querySelector(".user-info-name");

  const params = {
    username: username,
    password: password,
  };

  axios
    .post(`${url}/login`, params)
    .then((response) => {
      token = response.data.token;
      const user = response.data.user;
      user_info_name.innerHTML = user.name;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      successMessage(`Hi ${user.username} Login successes`, "success");
      localStorage.length != 0
        ? addPostBtn.classList.remove("d-none")
        : addPostBtn.classList.add("d-none");
      toggleLogoutSection("remove", "d-none");
      toggleLoginSection("add", "d-none");
    })
    .catch((error) => {
      const message = error.response.data.message;
      successMessage(`❌ ${message}`, "danger");
    });
}

function myForm(e) {
  e.preventDefault(); // stop form from refreshing the page
  // hid modal
  const modalEl = document.getElementById("loginModal");
  const Modal = bootstrap.Modal.getInstance(modalEl);
  login(url);

  document.activeElement.blur();
  Modal.hide();
}

function successMessage(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const appendAlert = (message, type) => {
    alertPlaceholder.innerHTML = `
      <div class="alert alert-${type} show fade alert-dismissible" role="alert">
         <strong>${message}</strong>
         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    // Close alert automatically after 1 second
    setTimeout(() => {
      const alert = bootstrap.Alert.getOrCreateInstance(
        document.querySelector(".alert")
      );
      alert.close();
    }, 1500);
  };

  appendAlert(message, type);
}

function toggleLoginSection(atr, value) {
  const sectionLogin = document.querySelector(".hideLoginBtn");
  sectionLogin.classList[atr](`${value}`);
}
function toggleLogoutSection(atr, value) {
  const sectionLogout = document.querySelector(".showLogoutBtn");
  sectionLogout.classList[atr](`${value}`);
}

function logOut() {
  localStorage.clear();
  toggleLogoutSection("add", "d-none");
  toggleLoginSection("remove", "d-none");
  addPostBtn.classList.add("d-none");
  successMessage("! Note You make Logout ....", "danger");
}

function signUpModal() {
  console.clear();
  console.log("true");
}

// Accessibility improvements to make focus on input
function improvements(idModal, idInput) {
  const loginModalEl = document.getElementById(`${idModal}`);

  // Focus username field when modal opens
  loginModalEl.addEventListener("shown.bs.modal", () => {
    document.getElementById(`${idInput}`).focus();
  });

  // Restore focus to trigger button when modal closes
  loginModalEl.addEventListener("hidden.bs.modal", () => {
    const triggerBtn = document.querySelector(`[data-bs-target="#${idModal}"]`);

    if (triggerBtn) {
      triggerBtn.focus();
    } else {
      document.body.focus();
    }
  });
}

improvements("loginModal", "username");
improvements("signupModal", "name");

function myFormSignUp(e) {
  // stop form from refreshing the page
  e.preventDefault();
  const name = document.getElementById("name").value;
  const fullName = document.getElementById("fullName").value;
  // const image = document.getElementById("imageUpload").files[0];
  const email = document.getElementById("email").value;
  const password = document.getElementById("signUp-password").value;

  // hid modal
  const modalEl = document.getElementById("signupModal");
  const Modal = bootstrap.Modal.getInstance(modalEl);
  document.activeElement.blur();
  Modal.hide();

  // using axios to make Signup
  function signupForm() {
    const params = {
      username: fullName,
      email: email,
      name: name,
      password: password,
    };

    axios
      .post(`${url}/register`, params)
      .then((res) => {
        console.log("✅ User registered:", res.data.token, res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        successMessage("✅ User registered successfully", "success");
        toggleLogoutSection("remove", "d-none");
        toggleLoginSection("add", "d-none");
      })
      .catch((error) => {
        const message = error.response.data.message;
        successMessage(`❌ ${message}`, "danger");
      });
  }
  signupForm();
}

function createPost() {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const image = document.getElementById("postImage").files[0];

  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", content);
  formData.append("image", image);

  axios
    .post(`https://tarmeezacademy.com/api/v1/posts`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Example
      },
    })
    .then((response) => {
      console.log(response.data);
      showPosts(url);

      const modalEl = document.getElementById("postModal");
      const Modal = bootstrap.Modal.getInstance(modalEl);
      document.activeElement.blur();
      Modal.hide();
    })
    .catch((error) => {
      console.log(error.response.data.message);
    });
}

// make scroll top function

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  console.log("scrollToTop");
}

window.addEventListener("scroll", () => {
  const scrollBtnTop = document.querySelector(".scroll-to-top");
  if (window.scrollY >= 100) {
    scrollBtnTop.classList.remove("d-none");
  } else {
    scrollBtnTop.classList.add("d-none");
  }
});
