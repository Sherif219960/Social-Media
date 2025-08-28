if (localStorage.length != 0) {
  toggleLoginSection("toggle", "d-none");
} else {
  toggleLogoutSection("toggle", "d-none");
}
const url = "https://tarmeezacademy.com/api/v1";
let token;
token = localStorage.getItem("token");
const login_logout = document.querySelector(".login-logout");

async function showPosts(url) {
  const post_section = document.querySelector(".post-section");

  const response = await axios
    .get(`${url}/posts?limit=2`)
    .then((response) => {
      post_section.innerHTML = "";
      const posts = response.data.data;

      for (const post of posts) {
        let { created_at, title, image, comments_count } = post;
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
                            This card has supporting text below as a natural lead-in to additional content.
                        </p>
                        <p class="card-text border-top">

                            <small class="text-body-secondary ">
                                <i class="fa-solid fa-pen text-primary"></i> <span>comments(${comments_count})</span>
                            </small>
                        </p>
                    </div>
                </div>
            </div>
            `;
      }
    })
    .catch((error) => {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error Response:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No Response:", error.request);
      } else {
        // Something else happened
        console.error("Error Message:", error.message);
      }
    });
}

showPosts(url);

function login(url) {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  const params = {
    username: username,
    password: password,
  };

  axios
    .post(`${url}/login`, params)
    .then((response) => {
      token = response.data.token;
      const user = response.data.user;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      successMessage(`Hi ${user.username} Login successes`, "success");
      toggleLogoutSection("remove", "d-none");
      toggleLoginSection("add", "d-none");
    })
    .catch((error) => {
      console.log(error);
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
    }, 1000);
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
        console.log("✅ User registered:", res.data);
        successMessage("✅ User registered successfully", "success");
        toggleLogoutSection("remove", "d-none");
        toggleLoginSection("add", "d-none");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  }
  signupForm();
}
