const url = "https://tarmeezacademy.com/api/v1";
let token;
token = localStorage.getItem("token");
const login_logout = document.querySelector(".login-logout");

// const btn_SignIn = document.querySelector(".signIn");
// const btn_SignUp = document.querySelector(".signUp");
// const btn_LogOut = document.querySelector(".logOut");
// const user_Image = document.querySelector(".user-image");

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
      successLogin(`Hi ${user.username} Login successes`, "success");
      showLogoutBtn();
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

function successLogin(message, type) {
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
        alertPlaceholder.querySelector(".alert")
      );
      alert.close();
    }, 1000);
  };

  appendAlert(message, type);
}

// Accessibility improvements
const loginModalEl = document.getElementById("loginModal");

// Focus username field when modal opens
loginModalEl.addEventListener("shown.bs.modal", () => {
  document.getElementById("username").focus();
});

// Restore focus to trigger button when modal closes
loginModalEl.addEventListener("hidden.bs.modal", () => {
  const triggerBtn = document.querySelector('[data-bs-target="#loginModal"]');
  if (triggerBtn) {
    triggerBtn.focus();
  } else {
    document.body.focus();
  }
});

function showLoginBtn() {
  login_logout.innerHTML = `
      <!-- Button to Open Modal -->
    <button class="btn btn-outline-primary signIn me-2 btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">
        Login
    </button>

    <!-- Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content shadow-lg rounded-3">
              <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Login</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"
                    aria-label="Close"></button>
              </div>
              <div class="modal-body">

                <!-- Login Form -->
                <form onsubmit="myForm(event)">
                    <div class="mb-3 text-start">
                      <label for="username" class="form-label">User Name</label>
                      <input type="text" class="form-control" value='sherif' id="username"
                          placeholder="Enter your username">
                    </div>
                    <div class="mb-3 text-start">
                      <label for="password" class="form-label">Password</label>
                      <input type="text" class="form-control" value='123456' id="password"
                          placeholder="Enter your password">
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Login</button>
                </form>
              </div>
              <div class="modal-footer">
                <p class="m-0">Don’t have an account? <a href="#">Sign up</a></p>
              </div>
          </div>
        </div>
    </div>

    <button class="btn btn-outline-success  btn-sm me-2 signUp" type="button">Sign Up</button>
  `;
}
function showLogoutBtn() {
  login_logout.innerHTML = `
    <button type="button" class="btn btn-outline-danger logOut me-2 btn-sm" onclick="logOut()">
        logOut
    </button>

    <img
        src="https://thf.bing.com/th/id/OIP.2BWBErGDX8VTx-S_lag_BQAAAA?r=0&cb=thfc1&rs=1&pid=ImgDetMain&o=7&rm=3"
        alt="user" class="rounded-circle user-image " width="30" height="30">
  `;
}

function logOut() {
  localStorage.clear();
  if (localStorage.length <= 0) {
    console.log("not item in localStorage");
    showLoginBtn();
  }
  successLogin("Done Logout success", "danger");
}

if (token == null) {
  console.log("The Token Is Empty");
  showLoginBtn();
} else {
  console.log(token);
  console.log(JSON.parse(localStorage.getItem("user")));
  showLogoutBtn();
}
