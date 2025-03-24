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
        
        // Add sections as collapsible elements
        data.sections.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'content-section';
            
            // Create header with toggle button
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            
            const headingElement = document.createElement('h3');
            headingElement.textContent = section.heading;
            
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button';
            toggleButton.innerHTML = '<span class="icon">+</span>';
            toggleButton.setAttribute('aria-label', 'Toggle section');
            
            sectionHeader.appendChild(headingElement);
            sectionHeader.appendChild(toggleButton);
            sectionDiv.appendChild(sectionHeader);
            
            // Create collapsible content container
            const contentContainer = document.createElement('div');
            contentContainer.className = 'collapsible-content';
            
            const paragraphElement = document.createElement('div');
            paragraphElement.className = 'section-content';
            
            // Process content - handle bullet points, numbered lists, and formatting
            let processedContent = section.content;
            
            // Handle empty content
            if (!processedContent) {
                processedContent = '';
            }
            
            // Handle bold text (text between ** **)
            processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Format Q&A content with better styling
            if (section.heading.includes('Q&A')) {
                // Process Q&A format with special styling
                processedContent = processedContent.replace(/(\d+)\.\s+Q:\s+(.*?)\n\s+A:\s+(.*?)(?=\n\n\d+\.|\n\n|$)/gs, 
                    '<div class="qa-item"><div class="qa-number">$1</div><div class="qa-content"><div class="question">Q: $2</div><div class="answer">A: $3</div></div></div>');
            } else {
                // Convert bullet points to HTML
                processedContent = processedContent.replace(/(?:^|\n)-\s+(.*?)(?=\n|$)/g, '<li>$1</li>');
                if (processedContent.includes('<li>')) {
                    processedContent = `<ul>${processedContent}</ul>`;
                }
                
                // Convert numbered lists to HTML (but not in Q&A section)
                processedContent = processedContent.replace(/(?:^|\n)(\d+)\.\s+(.*?)(?=\n|$)/g, '<li>$2</li>');
                if (processedContent.includes('<li>') && !processedContent.includes('<ul>')) {
                    processedContent = `<ol>${processedContent}</ol>`;
                }
            }
            
            // Handle nested bullet points
            processedContent = processedContent.replace(/(?:^|\n)\s\s-\s+(.*?)(?=\n|$)/g, '<li class="nested">$1</li>');
            
            // Replace multiple newlines with paragraph breaks
            processedContent = processedContent.replace(/\n\n+/g, '</p><p>');
            
            // Replace remaining single newlines with <br>
            processedContent = processedContent.replace(/\n/g, '<br>');
            
            // If no paragraphs yet, wrap in paragraph tags
            if (!processedContent.includes('<p>') && !processedContent.includes('<div class="qa-item">')) {
                processedContent = `<p>${processedContent}</p>`;
            }
            
            paragraphElement.innerHTML = processedContent;
            contentContainer.appendChild(paragraphElement);
            sectionDiv.appendChild(contentContainer);
            
            // Set up toggle functionality
            toggleButton.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                toggleButton.setAttribute('aria-expanded', !isExpanded);
                contentContainer.style.display = isExpanded ? 'none' : 'block';
                toggleButton.querySelector('.icon').textContent = isExpanded ? '+' : '−';
            });
            
            // Set initial state (all collapsed by default)
            toggleButton.setAttribute('aria-expanded', 'false');
            contentContainer.style.display = 'none';
            
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