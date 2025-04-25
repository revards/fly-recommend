document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetPage}-page`) {
                    page.classList.add('active');
                }
            });
        });
    });

    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultsContainer = document.getElementById('recommendation-results');

    searchBtn.addEventListener('click', async function() {
        const query = document.getElementById('search-input').value.toLowerCase().trim();
        if (!query) return;
        
        try {
            const response = await fetch('travel_recommendation_api.json');
            const data = await response.json();
            
            resultsContainer.innerHTML = '';
            
            
            if (query.includes('beach')) {
                showRecommendations(data.beaches);
            }
            
            else if (query.includes('temple')) {
                showRecommendations(data.temples);
            }
            
            else if (query.includes('country') || query.includes('countries')) {
                data.countries.forEach(country => {
                    if (country.cities) {
                        showRecommendations(country.cities);
                    }
                });
            }
            else {
                const matchedCountry = data.countries.find(country => 
                    country.name.toLowerCase().includes(query)
                );
                if (matchedCountry && matchedCountry.cities) {
                    showRecommendations(matchedCountry.cities);
                } else {
                    showNoResults();
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            resultsContainer.innerHTML = '<p class="no-results">Error loading recommendations</p>';
        }
    });

    clearBtn.addEventListener('click', function() {
        resultsContainer.innerHTML = '';
        document.getElementById('search-input').value = '';
    });

    function showRecommendations(items) {
        if (!items || items.length === 0) {
            showNoResults();
            return;
        }
        
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function showNoResults() {
        resultsContainer.innerHTML = '<p class="no-results">No matching destinations found.</p>';
    }
});