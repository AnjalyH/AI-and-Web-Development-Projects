
import streamlit as st
import tempfile
import os

from src.pdf_loader import load_pdf
from src.text_splitter import split_documents
from src.embeddings import create_embeddings
from src.vector_store import create_vector_store
from src.rag_pipeline import get_answer


st.set_page_config(
    page_title="AI Document Assistant",
    page_icon="📄",
    layout="centered"
)

st.title("📄 AI Document Assistant")
st.write("Upload a PDF and ask questions about its contents.")

# Upload PDF
uploaded_file = st.file_uploader(
    "Choose a PDF file",
    type=["pdf"]
)

# Process uploaded PDF
if uploaded_file is not None:
    if st.button("Process Document"):
        temp_path = None

        try:
            with st.spinner("Processing your document..."):

                # Save uploaded PDF temporarily
                with tempfile.NamedTemporaryFile(
                    delete=False,
                    suffix=".pdf"
                ) as temp_file:
                    temp_file.write(uploaded_file.getvalue())
                    temp_path = temp_file.name

                # Load and split PDF
                documents = load_pdf(temp_path)
                chunks = split_documents(documents)

                # Create embeddings and vector store
                embeddings = create_embeddings()
                vector_store = create_vector_store(
                    chunks,
                    embeddings
                )

                # Save vector store in session
                st.session_state.vector_store = vector_store

            st.success("Document processed successfully!")

        except Exception as e:
            st.error(f"Error processing document: {e}")

        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)


# Ask questions
if "vector_store" in st.session_state:
    st.subheader("Ask a Question")

    question = st.text_input(
        "Enter your question about the document:"
    )

    if st.button("Get Answer"):
        if question.strip():
            try:
                with st.spinner("Generating answer..."):
                    answer = get_answer(
                        question,
                        st.session_state.vector_store
                    )

                st.markdown("### Answer")
                st.write(answer)

            except Exception as e:
                st.error(f"Error generating answer: {e}")
        else:
            st.warning("Please enter a question.")
