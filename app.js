document.addEventListener('DOMContentLoaded', () => {
    // Add a last updated element to the HTML
    const contentElement = document.getElementById('content');
    const loadingElement = document.querySelector('.loading');
    
    // Function to display content
    function displayContent(data) {
        // Clear loading message
        contentElement.innerHTML = '';
        
        // Add last updated info
        const lastUpdatedElement = document.createElement('div');
        lastUpdatedElement.className = 'last-updated';
        const formattedDate = new Date(data.lastUpdated).toLocaleString();
        lastUpdatedElement.textContent = `Last updated: ${formattedDate}`;
        contentElement.appendChild(lastUpdatedElement);
        
        // Add title
        const titleElement = document.createElement('h2');
        titleElement.textContent = data.title;
        contentElement.appendChild(titleElement);
        
        // Add sections
        data.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'content-section';
            
            const headingElement = document.createElement('h3');
            headingElement.textContent = section.heading;
            
            const paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = section.content.replace(/\n/g, '<br>');
            
            sectionDiv.appendChild(headingElement);
            sectionDiv.appendChild(paragraphElement);
            
            contentElement.appendChild(sectionDiv);
        });
    }

    // Fetch the data from data.json
    function fetchData() {
        loadingElement.style.display = 'block';
        
        // Add cache-busting parameter to prevent caching
        const cacheBuster = `?cb=${new Date().getTime()}`;
        
        fetch(`data.json${cacheBuster}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayContent(data);
                loadingElement.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                loadingElement.textContent = 'Error loading data. Please try again later.';
            });
    }

    // Initial data fetch
    fetchData();
    
    // Refresh data every 5 minutes
    setInterval(fetchData, 5 * 60 * 1000);
}); 