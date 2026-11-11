# AI Document Assistant

An AI-powered PDF question-answering application built using Python, LangChain, Google Gemini, and FAISS.

The application allows users to upload a PDF document and ask questions about its content. It uses Retrieval-Augmented Generation (RAG) to retrieve relevant information from the document and generate answers using Google Gemini.

## Features

- Upload PDF documents through a simple web interface.
- Extract text from PDF files.
- Split extracted text into smaller chunks.
- Generate text embeddings using Google Gemini.
- Store and retrieve document vectors using FAISS.
- Ask questions about the uploaded document.
- Generate answers based on the retrieved document context.

## Technologies Used

- **Python** – Main programming language
- **Streamlit** – User interface
- **LangChain** – RAG pipeline and document processing
- **Google Gemini API** – Text embeddings and answer generation
- **FAISS** – Vector storage and similarity search
- **PyPDF** – PDF document loading

## How It Works

The application follows a Retrieval-Augmented Generation (RAG) workflow:

1. **PDF Loading:** Extracts text from the uploaded PDF.
2. **Text Splitting:** Divides the extracted content into smaller chunks.
3. **Embedding Generation:** Converts text chunks into numerical vector representations using Google Gemini.
4. **Vector Storage:** Stores the embeddings in a FAISS vector store.
5. **Retrieval:** Finds relevant document chunks based on the user's question.
6. **Answer Generation:** Sends the retrieved context and question to Gemini to generate an answer.

## Project Structure

```text
AI-Document-Assistant/
│
├── src/
│   ├── pdf_loader.py
│   ├── text_splitter.py
│   ├── embeddings.py
│   ├── vector_store.py
│   └── rag_pipeline.py
│
├── app.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Document-Assistant
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the environment

For Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure the Google API key

Create a `.env` file in the project root directory:

```env
GOOGLE_API_KEY=your_google_api_key
```

Replace `your_google_api_key` with your own Google AI Studio API key.

**Important:** Never upload your `.env` file or share your API key publicly.

### 6. Run the application

```bash
streamlit run app.py
```

Open the local URL displayed in your terminal to use the application.

## Usage

1. Open the application in your browser.
2. Upload a PDF document.
3. Click **Process Document**.
4. Enter a question related to the document.
5. Click **Get Answer** to view the generated response.

## Note

- A valid Google Gemini API key is required.
- API usage is subject to Google Gemini rate limits and quotas.
- The application is designed for PDF-based question answering.
