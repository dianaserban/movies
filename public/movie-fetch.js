// Initial page and movies per page
let currentPage = 1; // Keeps track of the current page
const moviesPerPage = 12; // Number of movies to display per page
const apiKey = "d03f1159e9244ad782c7302c82e8c682"; // TMDb API key
let genreMap = {};


// Function to fetch genre list from TMDb API
function fetchGenreList() {
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

    fetch(genreUrl)
        .then(response => response.json())
        .then(data => {
            if (data.genres) {
                // Populate genreMap with genre IDs and names
                data.genres.forEach(genre => {
                    genreMap[genre.id] = genre.name;
                });
            } else {
                console.error("Failed to fetch genre list.");
            }
        })
        .catch(error => {
            console.error("Error fetching genre list:", error);
        });
}

// Call fetchGenreList to populate genreMap
fetchGenreList();


// Function to open modal with movie details
function openModal(movie) {
    // Fetch movie ID and genre IDs from data attributes
    const movieId = movie.dataset.movieId;
    const genreIds = movie.dataset.genreIds.split(","); // Convert genre IDs from string to array

    // Retrieve other movie details from the movie element
    const title = movie.querySelector(".movie-details h2").textContent;
    const thumbnailSrc = movie.querySelector("img").src;
    const releaseDate = movie.querySelector(".release-date")?.textContent?.replace("Release Date: ", "") || '';

    // Convert genre IDs to genre names
    const genreNames = genreIds.map(id => genreMap[id.trim()]).join(", ");

    // Populate modal with movie details
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalThumbnail").src = thumbnailSrc;

    // Use innerHTML with <strong> tags to make the text bold
    document.getElementById("modalGenre").innerHTML = `<strong>Genre:</strong> ${genreNames}`;
    document.getElementById("modalYear").innerHTML = `<strong>Release Date:</strong> ${releaseDate}`;

    // Fetch movie details using the movie ID and display the overview
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.overview) {
                document.getElementById("overview").textContent = data.overview;
            }
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
        });

    // Show the modal
    document.getElementById("modal").style.display = "block";
}


// Function to fetch and display movies
function fetchMovies(page, genre = '', releaseYear = '', sortBy = '') {
    const searchQuery = document.getElementById("searchInput").value.trim();
    let apiUrl;

    if (searchQuery) {
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

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                const movies = data.results.slice(0, moviesPerPage);
                displayMovies(movies);
                displayPagination(data.total_pages);
            } else {
                document.getElementById("movies").innerHTML = "<p>No movies found!</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("movies").innerHTML = "<p>Error fetching data. Please try again later.</p>";
        });
}


// Function to display fetched movies
function displayMovies(movies) {
    const moviesContainer = document.getElementById("movies");
    moviesContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        // Set the movie ID as a data attribute
        movieElement.dataset.movieId = movie.id;
        movieElement.dataset.genreIds = movie.genre_ids.join(","); // Save genre IDs as a data attribute

        const anchorTag = document.createElement("a");
        anchorTag.href = "#";
        anchorTag.addEventListener("click", event => {
            event.preventDefault();
            openModal(movieElement);
        });

        anchorTag.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title} Poster">
            <div class="movie-details">
                <h2>${movie.title}</h2>
                <p class="release-date">Release Date: ${movie.release_date}</p>
               
            </div>
        `;

        movieElement.appendChild(anchorTag);
        moviesContainer.appendChild(movieElement);
    });
}

// Function to display pagination buttons
function displayPagination(totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = "";

    // Display up to 3 pages of pagination buttons
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
        const button = document.createElement("button");
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            currentPage = i;
            fetchMovies(currentPage);
            updateActiveButton();
        });
        paginationContainer.appendChild(button);
    }
}

// Function to update active pagination button
function updateActiveButton() {
    const buttons = document.querySelectorAll(".pagination button");
    buttons.forEach(button => {
        button.classList.remove("active");
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add("active");
        }
    });
}



// Event listener for closing the modal
// Attach event listener to the close icon (span element with class 'close')
document.querySelector(".modal-content .close").addEventListener("click", () => {
    // Hide the modal when the close icon is clicked
    document.getElementById("modal").style.display = "none";
});




// Attach event listener to filter and sort options
document.getElementById("filterButton").addEventListener("click", () => {
    const genre = document.getElementById("genreSelect").value;
    const releaseYear = document.getElementById("releaseYearInput").value;
    const sortBy = document.getElementById("sortSelect").value;
    fetchMovies(currentPage, genre, releaseYear, sortBy);
});

// Attach event listener to search button
document.getElementById("searchButton").addEventListener("click", () => {
    fetchMovies(currentPage);
});

// Initial function call on page load
window.onload = () => fetchMovies(currentPage);



// Handle form submission for login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    // Get the user's credentials
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Send the credentials to the server for authentication
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            // User is authenticated
            // Handle successful login here
            console.log('Logged in successfully');
            
            // Hide the login form after successful login
            document.getElementById("loginContainer").style.display = "none";
            
            // You can now make authenticated requests or change the UI based on the user's logged-in state
        } else {
            // Invalid credentials
            console.error('Invalid credentials');
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
    });
});






