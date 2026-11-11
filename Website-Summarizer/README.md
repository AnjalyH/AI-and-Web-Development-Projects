
# AI Website Summarizer

A simple AI-powered web application that summarizes website content using Google Gemini.

## Features

- Accepts a website URL as input.
- Extracts readable content from the website.
- Uses Google Gemini to generate a summary.
- Displays the summary through a Streamlit interface.

## Technologies Used

- Python
- Streamlit
- Requests
- BeautifulSoup
- LangChain
- Google Gemini API

## Project Structure

    Website-Summarizer/
    ├── app.py
    ├── requirements.txt
    ├── .gitignore
    └── src/
        └── summarizer.py

## Installation

1. Clone the repository:

   git clone YOUR_REPOSITORY_URL

2. Navigate to the project folder.

3. Create and activate a virtual environment.

4. Install dependencies:

   pip install -r requirements.txt

5. Create a `.env` file and add your Gemini API key:

   GOOGLE_API_KEY=your_api_key

6. Run the application:

   streamlit run app.py

## How It Works

The application fetches website content using Requests, extracts readable text using BeautifulSoup, and sends the extracted content to Google Gemini for summarization.

## Note

The application works with publicly accessible websites that provide readable HTML content.
