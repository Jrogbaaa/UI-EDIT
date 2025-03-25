# Make.com Workflow Setup

This guide explains how to set up your Make.com workflow to update the Google Docs live feed.

## Overview

Since GitHub Pages only supports static files and doesn't allow server-side code execution, we'll use GitHub Gists as our "database" to store document information. Make.com will update a Gist whenever a new Google Doc is created.

## Steps to Set Up Make.com Workflow

### 1. Create a GitHub Gist

1. Go to [https://gist.github.com/](https://gist.github.com/)
2. Create a new Gist with these settings:
   - Filename: `documents.json`
   - Content: `[]` (just an empty array to start)
   - Description: "Google Docs data for live feed"
   - Visibility: Public (so your website can access it without authentication)
3. Click "Create public gist"
4. **Important:** Copy the Gist ID from the URL - it's the alphanumeric string after your username, like: `https://gist.github.com/username/THIS_IS_YOUR_GIST_ID`

### 2. Update your app.js file

Replace `YOUR_GIST_ID_HERE` in the app.js file with your actual Gist ID.

### 3. Set Up Make.com Workflow

1. Create a new scenario in Make.com
2. Add a Google Docs trigger (like "Watch Documents")
3. Add a GitHub module - **GitHub > Update a Gist**
4. Configure the module with these settings:
   ```
   Gist ID: YOUR_GIST_ID
   File Name: documents.json
   File Content: [
     {
       "id": "{{formatDate(now; X)}}-{{random(1000; 9999)}}",
       "title": "{{googleDocs.title}}",
       "url": "{{googleDocs.url}}",
       "author": "{{googleDocs.owner.displayName}}",
       "created_at": "{{formatDate(now; YYYY-MM-DD'T'HH:mm:ss'Z')}}"
     }
     // If you want to keep existing documents, add this:
     // , {{substring(previousGistContent; 1; length(previousGistContent) - 2)}}
   ]
   ```

5. Save and activate your workflow

## Testing

1. Create a new Google Doc that matches your trigger criteria
2. Your Make.com workflow should trigger and update the Gist
3. Visit [https://jrogbaaa.github.io/UI-EDIT/](https://jrogbaaa.github.io/UI-EDIT/) to see the new document appear (it may take up to 30 seconds for the site to refresh)

## Troubleshooting

If documents aren't appearing:

1. Check the Make.com execution history to confirm the workflow ran successfully
2. Check your Gist to confirm the data was updated correctly
3. Open the browser console on your website to look for any errors
4. Make sure the Gist ID in app.js matches your actual Gist ID