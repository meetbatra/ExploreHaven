const filters = document.querySelectorAll('.filter');
const listingsContainer = document.querySelector('.home-listings');
const listings = JSON.parse(listingsContainer.getAttribute('listings'));

const listingElements = {};
document.querySelectorAll('.card-link').forEach(element => {
    const id = element.getAttribute('href').split('/').pop();
    listingElements[id] = element;
});

const originalListingsHTML = listingsContainer.innerHTML;

filters.forEach(filter => {
    filter.addEventListener('click', function() {
        filters.forEach(f => f.classList.remove('filter-active'));
        
        this.classList.add('filter-active');
        
        const category = this.querySelector('p').textContent;
        
        filterListings(category);
    });
});

function filterListings(category) {

    if (category === 'Trending') {
        listingsContainer.innerHTML = originalListingsHTML;
        return;
    }
    
    const filteredListings = listings.filter(listing => listing.category === category);
    
    if (filteredListings.length === 0) {
        listingsContainer.innerHTML = '<p class="text-danger">No listings available for this category!</p>';
        return;
    }
    
    listingsContainer.innerHTML = '';
    
    filteredListings.forEach(listing => {
        listingsContainer.appendChild(listingElements[listing._id].cloneNode(true));
    });
}