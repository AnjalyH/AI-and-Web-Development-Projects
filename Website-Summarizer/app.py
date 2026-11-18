
import streamlit as st
import re
from urllib.parse import urlparse
from dotenv import load_dotenv
from src.summarizer import summarize_website


load_dotenv()


st.set_page_config(
    page_title="AI Website Summarizer",
    page_icon="🌐",
    layout="centered"
)


st.title("🌐 AI Website Summarizer")

st.write(
    "Enter a website URL and let AI explain "
    "what the website is about."
)

st.divider()


url = st.text_input(
    "Enter Website URL",
    placeholder="https://example.com"
)


def is_valid_url(url):
    """Check whether the entered URL is valid."""

    try:
        parsed_url = urlparse(url)

        return (
            parsed_url.scheme in ["http", "https"]
            and bool(parsed_url.netloc)
            and "." in parsed_url.netloc
            and not any(char.isspace() for char in url)
        )

    except Exception:
        return False


if st.button("Summarize Website", type="primary"):

    cleaned_url = url.strip()

    if not cleaned_url:
        st.warning("Please enter a website URL.")

    elif not is_valid_url(cleaned_url):
        st.error(
            "Invalid URL. Please enter a valid website address "
            "starting with http:// or https://"
        )

    else:

        with st.spinner(
            "Reading website and generating AI summary..."
        ):

            try:

                title, summary = summarize_website(cleaned_url)

                st.success("Summary generated successfully!")

                st.subheader(title)

                st.markdown(summary)

            except ValueError as e:

                st.error(str(e))

            except Exception as e:

                error_message = str(e)

                if "API key" in error_message:
                    st.error(
                        "Gemini API key is missing or invalid. "
                        "Please check your .env configuration."
                    )

                elif "timeout" in error_message.lower():
                    st.error(
                        "The website took too long to respond. "
                        "Please try again."
                    )

                else:
                    st.error(
                        "Unable to summarize this website. "
                        "Please check the URL or try another website."
                    )

                    st.caption(f"Technical details: {error_message}")


st.divider()

st.caption(
    "Built using Python, Streamlit, BeautifulSoup "
    "and Google Gemini."
)
