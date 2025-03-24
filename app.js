document.addEventListener('DOMContentLoaded', () => {
    // Sample marketing content - in a real app, this would be loaded from Google Docs API
    const marketingContent = {
        title: "Q4 Marketing Campaign Results",
        lastUpdated: new Date().toISOString(), // Add last updated date
        sections: [
            {
                heading: "Campaign Overview",
                content: "Our Q4 marketing campaign focused on increasing brand awareness and driving conversions through targeted social media advertising and content marketing. The campaign ran from October 1 to December 31."
            },
            {
                heading: "Key Metrics",
                content: "• 250,000 impressions\n• 15,000 website visits\n• 2,500 conversions\n• 16.7% conversion rate\n• 25% increase in social media engagement"
            },
            {
                heading: "Audience Insights",
                content: "The campaign resonated particularly well with our core demographic of professionals aged 25-45. The highest engagement rates came from LinkedIn and Instagram, while Facebook provided the most cost-effective conversions."
            },
            {
                heading: "Recommendations",
                content: "Based on our analysis, we recommend increasing our budget allocation for LinkedIn advertising by 20% and developing more video content for Instagram. We should also refine our messaging to emphasize value proposition and ROI, which resonated strongly with our audience."
            }
        ]
    };

    // Function to display content
    function displayContent(data) {
        const contentElement = document.getElementById('content');
        
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
        titleElement.className = 'doc-title';
        contentElement.appendChild(titleElement);
        
        // Add sections as collapsible elements
        data.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'content-section';
            
            // Create header with toggle button
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'section-header';
            
            // Add icon based on section type
            let iconClass = 'chart-pie';
            if (section.heading.includes('Key Metrics')) {
                iconClass = 'chart-bar';
            } else if (section.heading.includes('Audience')) {
                iconClass = 'users';
            } else if (section.heading.includes('Recommend')) {
                iconClass = 'lightbulb';
            }
            
            const headingElement = document.createElement('h3');
            headingElement.innerHTML = `<i class="fas fa-${iconClass}"></i> ${section.heading}`;
            
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button';
            toggleButton.innerHTML = '<span class="icon">+</span>';
            toggleButton.setAttribute('aria-label', 'Toggle section');
            
            sectionHeader.appendChild(headingElement);
            sectionHeader.appendChild(toggleButton);
            sectionDiv.appendChild(sectionHeader);
            
            // Create collapsible content
            const contentContainer = document.createElement('div');
            contentContainer.className = 'collapsible-content';
            
            const paragraphElement = document.createElement('div');
            paragraphElement.className = 'section-content';
            
            // Format content - convert bullet points to HTML list
            let processedContent = section.content;
            
            // Convert bullet points to HTML
            processedContent = processedContent.replace(/•\s+(.*?)(?=\n|$)/g, '<li>$1</li>');
            if (processedContent.includes('<li>')) {
                processedContent = `<ul>${processedContent}</ul>`;
            } else {
                processedContent = `<p>${processedContent}</p>`;
            }
            
            paragraphElement.innerHTML = processedContent;
            contentContainer.appendChild(paragraphElement);
            sectionDiv.appendChild(contentContainer);
            
            // Set up toggle functionality
            sectionHeader.addEventListener('click', () => {
                const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
                toggleButton.setAttribute('aria-expanded', !isExpanded);
                contentContainer.style.maxHeight = isExpanded ? '0' : `${contentContainer.scrollHeight}px`;
                toggleButton.querySelector('.icon').textContent = isExpanded ? '+' : '−';
                
                if (isExpanded) {
                    contentContainer.classList.remove('expanded');
                } else {
                    contentContainer.classList.add('expanded');
                }
            });
            
            // Set initial state
            toggleButton.setAttribute('aria-expanded', 'false');
            contentContainer.style.maxHeight = '0';
            
            contentElement.appendChild(sectionDiv);
        });
    }

    // In a production app, you would fetch the data from Google Docs API
    // For this demo, we'll use the sample data with a short delay
    const loadingElement = document.querySelector('.loading');
    loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading your marketing data...';
    
    setTimeout(() => {
        displayContent(marketingContent);
        loadingElement.style.display = 'none';
    }, 1000); // Simulate loading delay
}); 