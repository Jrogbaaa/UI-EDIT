document.addEventListener('DOMContentLoaded', () => {
    // Sample marketing content - in a real app, this would be loaded from Google Docs API
    const marketingContent = {
        title: "Q4 Marketing Campaign Results",
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

    // In a production app, you would fetch the data from Google Docs API
    // For this demo, we'll use the sample data
    setTimeout(() => {
        displayContent(marketingContent);
    }, 1000); // Simulate loading delay
}); 