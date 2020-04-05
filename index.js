const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

// Form event listener
searchForm.addEventListener('submit', (e) => {
    // Get search term
    const searchTerm = searchInput.value;
    
    // Get sort
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;
    
    // Get limit
    const searchLimit = document.getElementById('limit').value;

    // Check input for empty fields
    if(searchTerm == ''){
        // Show message
        showMessage('Please add a search term', 'danger');
    } else {
        // Clear input
        searchInput.value = '';
        
        // Search Reddit
        searchReddit(searchTerm, searchLimit, sortBy)
            .then(results => {
                console.log(results);

                
                let output = '<div class="card-columns">';
                
                // Loop through posts
                results.forEach(post => {
                    // Check for image
                    const image = post.preview ? post.preview.images[0].source.url : 'https://cdn.vox-cdn.com/thumbor/M1fYATqxBK6LcUu5x1W3RXyeCUg=/0x0:640x427/1200x800/filters:focal(0x0:640x427)/cdn.vox-cdn.com/uploads/chorus_image/image/46668166/reddit_logo_640.0.jpg';

                    output += `
                    <div class="card">
                    <img src="${image}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${post.title}</h5>
                      <p class="card-text">${truncateText(post.selftext, 100)}</p>
                      <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                      <hr>
                      <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                      <span class="badge badge-dark">Score: ${post.score}</span>
                    </div>
                  </div>`;
                });
                output += '</div>';

                document.getElementById('results').innerHTML = output;
            });
    }

    e.preventDefault();
});

// Show Message
function showMessage(message, class_name){
    // Create div
    const div = document.createElement('div');
    // Add classes
    div.className = `alert alert-${class_name}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get the parent container
    const searchContainer = document.getElementById('search-container');
    // Get search
    const search = document.getElementById('search');

    // Insert the message before 'search' div
    searchContainer.insertBefore(div, search);

    // Remove alert after 3 seconds
    setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

// Truncate Text
function truncateText(text, limit){
    const shortened = text.indexOf(' ', limit);
    if(shortened == -1) return text;
    return text.substring(0, shortened);
}

function searchReddit(searchTerm, searchLimit, sortBy){
    return fetch(`http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
        .then(res => res.json())
        .then(data => data.data.children.map(data => data.data))
        .catch(err => console.log(err));
}