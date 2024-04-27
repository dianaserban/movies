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

    // Define the openModal function inside the displayMovies function
    function openModal(movie) {
        const title = movie.querySelector(".movie-details h2").textContent;
        const thumbnailSrc = movie.querySelector("img").getAttribute("src");
        const releaseDate = movie.querySelector(".movie-details .release-date").textContent;



        // Populate modal with movie details
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalThumbnail").setAttribute("src", thumbnailSrc);
        document.getElementById("modalYear").textContent = "Release Date: " + releaseDate;



        // Show the modal
        modal.style.display = "block";
    }

    // Iterate through each movie and create HTML elements for display
    movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.classList.add("movie");

        // Create an anchor tag to wrap the movie details
        const anchorTag = document.createElement("a");
        anchorTag.href = "#"; // Set href to "#" to make it clickable
        anchorTag.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            openModal(movieElement); // Open modal when clicked
        });

        // Create HTML elements for movie details
        anchorTag.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" alt="${movie.title} Poster">
            <div class="movie-details">
                <h2>${movie.title}</h2>
                <p class="release-date">Release Date: ${movie.release_date}</p>
                
            </div>
        `;

        // Append the anchor tag to the movie element
        movieElement.appendChild(anchorTag);

        // Append the movie element to the movies container
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






// JavaScript for displaying modal and populating with movie details
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const closeModalButton = document.getElementById("closeModalButton");
    const closeIcon = document.querySelector(".close");

    // Function to open modal with movie details
    function openModal(movie) {
        const title = movie.querySelector(".movie-details h2").textContent;
        const thumbnailSrc = movie.querySelector("img").getAttribute("src");
        const genre = movie.querySelector(".movie-details p.genre").textContent;
        const year = movie.querySelector(".movie-details p.release-date").textContent;


        // Populate modal with movie details
        document.getElementById("modalTitle").textContent = title;
        document.getElementById("modalThumbnail").setAttribute("src", thumbnailSrc);
        document.getElementById("modalGenre").textContent = "Genre: " + genre;
        document.getElementById("modalYear").textContent = "Year: " + year;


        // Show the modal
        modal.style.display = "block";
    }

    // When the user clicks on a movie thumbnail
    document.querySelectorAll(".movie").forEach(movie => {
        movie.addEventListener("click", function () {
            openModal(this);
        });
    });

    // When the user clicks on the close button, close the modal
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // When the user clicks on the close icon, close the modal
    closeIcon.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // When the user clicks outside of the modal, close it
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});








// Call the fetchMovies function with initial page on page load
window.onload = () => fetchMovies(currentPage);



