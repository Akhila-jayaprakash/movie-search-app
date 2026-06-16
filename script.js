const API_KEY = '57692dbe';
const BASE_URL = 'https://www.omdbapi.com/';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const results = document.getElementById('results');

searchBtn.addEventListener('click', function() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        results.innerHTML = '<p>Please enter a movie name to search.</p>';
        return;
    }
    
    results.innerHTML = '<p>Searching...</p>';
    
    fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            results.innerHTML = '<p>Data received! Check the console.</p>';
        });
});