const API_KEY = '57692dbe';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');
const loader = document.getElementById('loader');
const favContainer = document.getElementById('favourites');

function getFavourites() {
    return JSON.parse(localStorage.getItem('favourites')) || [];
}

function saveFavourites(favs) {
    localStorage.setItem('favourites', JSON.stringify(favs));
}

function isFavourite(imdbID) {
    return getFavourites().some(function(movie) {
        return movie.imdbID === imdbID;
    });
}
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchBtn.click();
});

searchBtn.addEventListener('click', function() {
    const query = searchInput.value.trim();

    if (query === '') {
        results.innerHTML = '';
        loader.classList.remove('hidden');
        results.innerHTML = '<p style="color: #1dd7b8;">Please enter a movie name.</p>';
        return;
    }

    results.innerHTML = '<p style="color: #1dd7b8;">Searching...</p>';
    loader.classList.remove('hidden');

    fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            loader.classList.add('hidden');
            if (data.Response === 'False') {
                loader.classList.add('hidden');
                results.innerHTML = '<p style="color: #1dd7b8;">No movies found. Try a different search.</p>';
                return;
            }
            loader.classList.add('hidden');
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

        const liked = isFavourite(movie.imdbID);

card.innerHTML = `
    <img src="${poster}" alt="${movie.Title}">
    <button class="heart-btn ${liked ? 'liked' : ''}" data-id="${movie.imdbID}">
        ${liked ? '❤️' : '🤍'}
    </button>
    <div class="movie-info">
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
    </div>

    `;
      const heartBtn = card.querySelector('.heart-btn');

heartBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    
    let favs = getFavourites();
    
    if (isFavourite(movie.imdbID)) {
        favs = favs.filter(function(m) {
            return m.imdbID !== movie.imdbID;
        });
        heartBtn.innerHTML = '🤍';
        heartBtn.classList.remove('liked');
    } else {
        favs.push(movie);
        heartBtn.innerHTML = '❤️';
        heartBtn.classList.add('liked');
    }
    
    saveFavourites(favs);
});

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
function displayFavourites() {
    const favs = getFavourites();
    favContainer.innerHTML = '';

    if (favs.length === 0) {
        favContainer.innerHTML = '<p style="color: rgba(255,255,255,0.5);">No favourites yet. Click ❤️ on any movie to save it.</p>';
        return;
    }

    favs.forEach(function(movie) {
        const poster = movie.Poster !== 'N/A'
            ? movie.Poster
            : 'https://via.placeholder.com/200x300?text=No+Poster';

        const card = document.createElement('div');
        card.classList.add('movie-card');

        card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}">
            <button class="heart-btn liked" data-id="${movie.imdbID}">❤️</button>
            <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
            </div>
        `;

        card.addEventListener('click', function() {
            openModal(movie.imdbID);
        });

        const heartBtn = card.querySelector('.heart-btn');
        heartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            let favs = getFavourites();
            favs = favs.filter(function(m) {
                return m.imdbID !== movie.imdbID;
            });
            saveFavourites(favs);
            displayFavourites();
        });

        favContainer.appendChild(card);
    });
}const searchTab = document.getElementById('searchTab');
const favTab = document.getElementById('favTab');

searchTab.addEventListener('click', function() {
    searchTab.classList.add('active');
    favTab.classList.remove('active');
    
    document.querySelector('.search-container').style.display = 'flex';
    loader.style.display = '';
    results.style.display = 'flex';
    favContainer.style.display = 'none';
    
    results.innerHTML = '';
});

favTab.addEventListener('click', function() {
    favTab.classList.add('active');
    searchTab.classList.remove('active');
    
    document.querySelector('.search-container').style.display = 'none';
    loader.style.display = 'none';
    results.style.display = 'none';
    favContainer.style.display = 'flex';
    
    displayFavourites();
});