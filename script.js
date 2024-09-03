const accessKey = "otCUNLPrrJYAHNGCCghx-Nm1hz1VWq0lw3HLSk0nfng";

const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const errorMessage = document.createElement("div"); // Create error message element
errorMessage.id = "error-message";
errorMessage.style.display = "none"; // Hide it initially
searchResult.parentElement.insertBefore(errorMessage, searchResult); // Insert it above the search results

const spinner = document.getElementById("loading-spinner");

let keyWord = "";
let page = 1;

async function searchImage() {
    keyWord = searchBox.value.trim();
    if (!keyWord) {
        displayError("Please enter a search term.");
        return;
    }

    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyWord}&client_id=${accessKey}&per_page=12`;

    try {
        // Show the spinner
        spinner.style.display = "block";
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length === 0) {
            displayError("No images found. Please try a different search term.");
            hideSpinner(); // Hide the spinner when no results are found
            return;
        }

        if (page == 1) {
            searchResult.innerHTML = "";
        }

        const results = data.results;

        results.forEach((result) => {
            const image = document.createElement("img");
            image.src = result.urls.small;
            image.classList.add("fade-in");
            image.onload = () => image.classList.add("loaded");
            const imageLink = document.createElement("a");
            imageLink.href = result.links.html;
            imageLink.target = "_blank";

            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
        });

        setTimeout(() => {
            searchResult.classList.add("fade-in");
        }, 10);

        showMoreBtn.style.display = "block";
        hideError(); // Hide error message if search is successful
    } catch (error) {
        displayError("An error occurred while fetching the images. Please try again.");
    } finally {
        // Hide the spinner after the operation
        hideSpinner();
    }
};

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImage();
});

showMoreBtn.addEventListener("click", () => {
    page++;
    searchImage();
});

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

function hideError() {
    errorMessage.style.display = "none";
}

function hideSpinner() {
    spinner.style.display = "none";
}
