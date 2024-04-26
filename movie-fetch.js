// Initial page and movies per page
let currentPage = 1; // Keeps track of the current page
const moviesPerPage = 12; // Number of movies to display per page

// Function to fetch and display movies
function fetchMovies(page) {
    // API endpoint (TMDb API)
    const apiKey = "d03f1159e9244ad782c7302c82e8c682"; // TMDb API key
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.results) {
                // Display the first 'moviesPerPage' movies
                const movies = data.results.slice(0, moviesPerPage);
                displayMovies(movies);
                // Display pagination
                displayPagination(data.total_pages);
            } else {
                // Display message when no movies are found
                document.getElementById("movies").innerHTML =
                    "<p>No movies found!</p>";
            }
        })
        .catch((error) => {
            // Display error message if there's an issue fetching data
            console.error("Error fetching data:", error);
            document.getElementById("movies").innerHTML =
                "<p>Error fetching data. Please try again later.</p>";
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

    // Create pagination buttons
    for (let i = 1; i <= 3; i++) { // Hardcoded to show 3 pages for demonstration
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

// Call the fetchMovies function with initial page on page load
window.onload = () => fetchMovies(currentPage);
