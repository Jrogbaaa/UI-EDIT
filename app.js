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
        titleElement.className = 'doc-title';
        titleElement.textContent = data.title;
        contentElement.appendChild(titleElement);
        
        // Add document link if available
        if (data.documentUrl) {
            const docLinkContainer = document.createElement('div');
            docLinkContainer.className = 'doc-link-container';
            
            const docLink = document.createElement('a');
            docLink.href = data.documentUrl;
            docLink.target = '_blank';
            docLink.className = 'doc-link';
            docLink.textContent = 'View Original Document';
            
            docLinkContainer.appendChild(docLink);
            contentElement.appendChild(docLinkContainer);
        }
        
        // Add sections
        data.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'content-section';
            
            const headingElement = document.createElement('h3');
            headingElement.textContent = section.heading;
            
            const paragraphElement = document.createElement('div');
            paragraphElement.className = 'section-content';
            
            // Process content - handle bullet points and numbered lists
            let processedContent = section.content;
            
            // Convert bullet points to HTML
            processedContent = processedContent.replace(/•\s(.*?)(?=\n|$)/g, '<li>$1</li>');
            if (processedContent.includes('<li>')) {
                processedContent = `<ul>${processedContent}</ul>`;
            }
            
            // Convert numbered lists to HTML
            processedContent = processedContent.replace(/(\d+)\.\s(.*?)(?=\n|$)/g, '<li>$2</li>');
            if (processedContent.includes('<li>') && !processedContent.includes('<ul>')) {
                processedContent = `<ol>${processedContent}</ol>`;
            }
            
            // Replace remaining newlines with <br>
            processedContent = processedContent.replace(/\n\n/g, '</p><p>');
            processedContent = processedContent.replace(/\n/g, '<br>');
            
            // If no paragraphs yet, wrap in paragraph tags
            if (!processedContent.includes('<p>')) {
                processedContent = `<p>${processedContent}</p>`;
            }
            
            paragraphElement.innerHTML = processedContent;
            
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