
const url = 'https://tarmeezacademy.com/api/v1'

async function showPosts(url) {
    const post_section = document.querySelector('.post-section')

    const response = await axios.get(`${url}/posts?limit=2`)
        .then(response => {
            post_section.innerHTML = ''
            const posts = response.data.data

            console.log(posts);
            for (const post of posts) {
                let { created_at, title, image, comments_count } = post
                let { username, profile_image } = post.author
                if (typeof image === 'object') {
                    image = profile_image
                } else {
                    image = image
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
            `
            }



        })
        .catch(error => {
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error Response:', error.response.data);
                console.error('Status Code:', error.response.status);
            } else if (error.request) {
                // Request was made but no response received
                console.error('No Response:', error.request);
            } else {
                // Something else happened
                console.error('Error Message:', error.message);
            }
        });


}

showPosts(url)





function myForm(e) {
    e.preventDefault(); // stop form from refreshing the page
    login()
}

function login() {
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const params = {
        "username": username,
        "password": password
    }
    const baseUrl = 'https://tarmeezacademy.com/api/v1'
    const model = bootstrap.Modal.getInstance(document.getElementById('loginModal'))
    axios.post(`${baseUrl}/login`, params)
        .then((response) => {
            console.log(response.data);
            model.hide()

        }).catch((error) => {
            console.log(error.message);

        })

}