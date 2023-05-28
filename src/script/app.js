import { baseUrl, posterImageUrl, apiKey } from "./config.js";
const appElm = document.querySelector('#app');

const app = () => {

    const showMovieList = (movies) => {
        let template = `
        <div class="row row-cols-1 row-cols-md-3 g-4">
        `;

        movies.forEach(movieItem => {
            template += `
            <div class="col">
                <div class="card h-100">
                    <img src="${posterImageUrl}${movieItem.poster_path}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${movieItem.original_title}</h5>
                        <p class="card-text">${movieItem.overview}</p>
                    </div>
                    <div class="card-footer">
                        <a href="#" class="card-link detail-btn" data-id="${movieItem.id}" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">Detail....</a>      
                    </div>
                </div>
            </div>
            `;
        })
        template += `</div>`;
        return template;
    }

    const showAlert = msg => `
            <div class="alert alert-warning" role="alert">
                ${msg}
            </div>
        `;

    const showLoading = state => {
        if (state) {
            // appElm.innerHTML = '';
            let loadingElm = `
            <div class="col text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `;
            appElm.innerHTML = loadingElm;
        }

    }
    const searchMovie = async (keyword) => {
        showLoading(true);
        try {
            const response = await fetch(`${baseUrl}search/movie?api_key=${apiKey}&query=${keyword}`);
            const responseJson = await response.json();
            if (responseJson.results.length > 0) {
                appElm.innerHTML = showMovieList(responseJson.results);
            } else {
                console.log('show alert');
                appElm.innerHTML = showAlert('film yang anda cari tidak ditemukan');
            }
        } catch (error) {
            appElm.innerHTML = showAlert(error);

        }
    }
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODlkMzJmMjMwYjllMDQzM2ZlODIwMTY5M2NkMzU2YyIsInN1YiI6IjY0NzE0ZTA5ODgxM2U0MDBjM2FkZjU1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nRZayFfirEdDAVWOGMMpKS-a4xV0LghY_Asj3tO9qRU'
        }
        };
    const getNowPlaying = () => {
        fetch(`${baseUrl}movie/now_playing?api_key=${apiKey}`)
            .then(response => {
                return response.json();
            })
            .then(responseJson => {
                console.log(responseJson.results);
                if (responseJson.results.length > 0) {
                    appElm.innerHTML = showMovieList(responseJson.results);
                } else {
                    appElm.innerHTML = showAlert('data tidak ditemukan');
                }
            })
            .catch(error => {
                appElm.innerHTML = showAlert(error);
            })
    }

    document.addEventListener('DOMContentLoaded', getNowPlaying);

    const searchText = document.querySelector('.search-text');
    document.querySelector('.search-btn').addEventListener('click', function (e) {
        if (searchText.value.length > 0)
            searchMovie(searchText.value);
    });

    searchText.addEventListener('input', function () {
        if (this.value === '')
            getNowPlaying();

    });

    appElm.addEventListener('click', function (e) {
        if (e.target.classList.contains('detail-btn')) {
            const detailBtn = e.target;
            const id = detailBtn.dataset.id;
            let name = '';
            console.log(id);
            // panggil fungsi untuk menampilkan detail dari movie berdasarkan id dengan fetch ke url https://api.themoviedb.org/3/movie/movie_id?api_key=YOUR_API_KEY
            fetch(`${baseUrl}movie/${id}?api_key=${apiKey}`)
                .then(response => response.json())
                .then(responseJSON => {
                    console.log(responseJSON);
                    document.querySelector('#exampleModalToggleLabel').innerHTML = responseJSON.title;
                    document.querySelector('#desc-movie').innerHTML = 'Description = ' + responseJSON.overview;
                    responseJSON.genres.forEach(genre => {
                        name += genre.name + ',';
                    });
                    document.querySelector('#genre').innerHTML = 'Genre = ' + name;
                    document.querySelector('#budget').innerHTML = 'Budget = ' + responseJSON.budget;
                    document.querySelector('#tagLine').innerHTML = 'Tag Line = ' + responseJSON.tagline;
                    document.querySelector('#statusMovie').innerHTML = 'Status = ' + responseJSON.status;
                    document.querySelector('#release').innerHTML = 'Status = ' + responseJSON.release_date;
                })

                .catch(err => console.error(err));
            }
    })

};
export default app;
