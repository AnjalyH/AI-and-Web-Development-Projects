
import streamlit as st
import re
from dotenv import load_dotenv
from src.summarizer import summarize_website

# Load API key from .env
load_dotenv()

st.set_page_config(
    page_title="Website Summarizer",
    page_icon="🌐",
    layout="centered"
)

st.title("🌐 AI Website Summarizer")

st.write(
    "Enter a website URL and let AI explain "
    "what the website is about."
)

url = st.text_input(
    "Enter Website URL",
    placeholder="https://example.com"
)

if st.button("Summarize Website"):
    if not url.strip():
        st.warning("Please enter a website URL.")

    else:
        if not re.match(r"^https?://", url.strip(), re.IGNORECASE):
            st.error("Please enter a valid URL starting with http:// or https://")

        else:
            with st.spinner("Reading website and generating summary..."):
                try:
                    title, summary = summarize_website(url.strip())

                    st.success("Summary generated successfully!")

                    st.subheader(title)
                    st.markdown(summary)

                except Exception as e:
                    st.error(f"Unable to summarize this website: {e}")

st.divider()

st.caption("Built using Python, Streamlit, BeautifulSoup and Google Gemini.")
