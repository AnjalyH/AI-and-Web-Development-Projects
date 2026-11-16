
import requests
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI


def extract_website_text(url):
    """Fetch a website and extract its readable text."""

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(
        url,
        headers=headers,
        timeout=20
    )

    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    for element in soup([
        "script",
        "style",
        "nav",
        "footer",
        "header",
        "noscript"
    ]):
        element.decompose()

    if soup.title and soup.title.string:
        title = soup.title.string.strip()
    else:
        title = "Untitled Website"

    website_text = soup.get_text(
        separator=" ",
        strip=True
    )

    if not website_text:
        raise ValueError("No readable text found on this website.")

    website_text = website_text[:12000]

    return title, website_text


def summarize_website(url):
    """Extract website content and generate an AI summary."""

    title, content = extract_website_text(url)

    llm = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0.3
    )

    prompt = f"""
    Summarize the following website content in simple language.

    Include:
    1. What the website is about
    2. Its main purpose
    3. Important information or services
    4. Key points a visitor should know

    Website title: {title}

    Website content:
    {content}
    """
    response = llm.invoke(prompt)
    raw_summary = response.content

    if isinstance(raw_summary, str):
        summary = raw_summary

    elif isinstance(raw_summary, list):
        text_parts = []

        for item in raw_summary:
            if isinstance(item, dict) and "text" in item:
                text_parts.append(item["text"])
            elif isinstance(item, str):
                text_parts.append(item)

        summary = "\n".join(text_parts)

    else:
        summary = str(raw_summary)

    return title, summary
