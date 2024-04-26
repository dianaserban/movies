// Initial page and movies per page
let currentPage = 1; // Keeps track of the current page
const moviesPerPage = 12; // Number of movies to display per page
const apiKey = "d03f1159e9244ad782c7302c82e8c682"; // TMDb API key
let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${currentPage}`;

// Function to fetch and display movies
function fetchMovies(page) {
    // If there's a search query, modify apiUrl for searching
    const searchQuery = document.getElementById("searchInput").value.trim();
    let apiUrl;
    if (searchQuery !== "") {
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;
    } else {
        apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
    }

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                // Display the first 'moviesPerPage' movies
                const movies = data.results.slice(0, moviesPerPage);
                displayMovies(movies);
                // Display pagination
                displayPagination(data.total_pages);
            } else {
                // Display message when no movies are found
                document.getElementById("movies").innerHTML = "<p>No movies found!</p>";
            }
        })
        .catch(error => {
            // Display error message if there's an issue fetching data
            console.error("Error fetching data:", error);
            document.getElementById("movies").innerHTML = "<p>Error fetching data. Please try again later.</p>";
        });
}
// Function to display fetched movies
function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = "";
    // Iterate through each movie and create HTML elements for display
    movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title} Poster">
            <div class="movie-details">
                <h2>${movie.title}</h2>
                <p>Release Date: ${movie.release_date}</p>
            </div>
        `;
        moviesContainer.appendChild(movieElement);
    });
}

// Function to display pagination buttons
function displayPagination(totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    // Create pagination buttons for all available pages
    for (let i = 1; i <= 3; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add("active"); // Highlight the current page button
        }
        button.addEventListener("click", () => {
            currentPage = i; // Update current page on button click
            fetchMovies(currentPage); // Fetch movies for the new page
            updateActiveButton(); // Update active button styles
        });
        paginationContainer.appendChild(button);
    }
}

// Function to update active pagination button
function updateActiveButton() {
    const buttons = document.querySelectorAll(".pagination button");
    buttons.forEach((button) => {
        button.classList.remove("active");
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add("active"); // Highlight the current page button
        }
    });
}

// Attach event listener to search button
document.getElementById("searchButton").addEventListener("click", () => {
    const searchInput = document.getElementById("searchInput").value;
    if (searchInput.trim() !== "") {
        fetchMovies(currentPage); // Start fetching from current page for search
    }
});






document.addEventListener("DOMContentLoaded", function () {
    // Function to fetch and display movies
    function fetchMovies(page, genre, releaseYear, sortBy) {
        // If there's a search query, modify apiUrl for searching
        const searchQuery = document.getElementById("searchInput").value.trim();
        let apiUrl;
        if (searchQuery !== "") {
            apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}&page=${page}`;
        } else {
            apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;
            if (genre) {
                apiUrl += `&with_genres=${genre}`;
            }
            if (releaseYear) {
                apiUrl += `&primary_release_year=${releaseYear}`;
            }
            if (sortBy) {
                apiUrl += `&sort_by=${sortBy}`;
            }
        }

        // Fetch data from the API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results) {
                    // Display the first 'moviesPerPage' movies
                    const movies = data.results.slice(0, moviesPerPage);
                    displayMovies(movies);
                    // Display pagination
                    displayPagination(data.total_pages);
                } else {
                    // Display message when no movies are found
                    document.getElementById("movies").innerHTML = "<p>No movies found!</p>";
                }
            })
            .catch(error => {
                // Display error message if there's an issue fetching data
                console.error("Error fetching data:", error);
                document.getElementById("movies").innerHTML = "<p>Error fetching data. Please try again later.</p>";
            });
    }

    // Attach event listener to filter and sort options
    document.getElementById("filterButton").addEventListener("click", () => {
        const genre = document.getElementById("genreSelect").value;
        const releaseYear = document.getElementById("releaseYearInput").value;
        const sortBy = document.getElementById("sortSelect").value;
        fetchMovies(currentPage, genre, releaseYear, sortBy);
    });
});





// Call the fetchMovies function with initial page on page load
window.onload = () => fetchMovies(currentPage);



