const API_KEY = '57692dbe';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');

searchBtn.addEventListener('click', function() {
    const query = searchInput.value.trim();

    if (query === '') {
        results.innerHTML = '<p style="color: #1dd7b8;">Please enter a movie name.</p>';
        return;
    }

    results.innerHTML = '<p style="color: #1dd7b8;">Searching...</p>';

    fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.Response === 'False') {
                results.innerHTML = '<p style="color: #1dd7b8;">No movies found. Try a different search.</p>';
                return;
            }
            displayMovies(data.Search);
        });
});

function displayMovies(movies) {
    results.innerHTML = '';

    movies.forEach(function(movie) {
        const poster = movie.Poster !== 'N/A' 
            ? movie.Poster 
            : 'https://via.placeholder.com/200x300?text=No+Poster';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;
        card.addEventListener('click', function() {
    openModal(movie.imdbID);
});

        results.appendChild(card);
    });
}
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

function openModal(imdbID) {
    fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`)
        .then(function(response) {
            return response.json();
        })
        .then(function(movie) {
            const poster = movie.Poster !== 'N/A'
                ? movie.Poster
                : 'https://via.placeholder.com/180x270?text=No+Poster';

            document.getElementById('modalPoster').src = poster;
            document.getElementById('modalTitle').textContent = movie.Title;
            document.getElementById('modalGenre').textContent = movie.Genre;
            document.getElementById('modalYear').textContent = '📅 ' + movie.Year;
            document.getElementById('modalRuntime').textContent = '⏱ ' + movie.Runtime;
            document.getElementById('modalRating').textContent = '⭐ ' + movie.imdbRating + '/10';
            document.getElementById('modalPlot').textContent = movie.Plot;
            document.getElementById('modalDirector').textContent = '🎬 Director: ' + movie.Director;
            document.getElementById('modalActors').textContent = '🎭 Cast: ' + movie.Actors;

            modal.classList.add('active');
        });
}

closeModal.addEventListener('click', function() {
    modal.classList.remove('active');
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});