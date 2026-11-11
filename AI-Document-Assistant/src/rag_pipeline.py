
from langchain_google_genai import ChatGoogleGenerativeAI


def get_answer(question, vector_store):
    retriever = vector_store.as_retriever(
        search_kwargs={"k": 3}
    )

    relevant_docs = retriever.invoke(question)

    context = "\n\n".join(
        doc.page_content for doc in relevant_docs
    )

    llm = ChatGoogleGenerativeAI(
        model="gemini-3.8-flash",
        temperature=0
    )

    prompt = f"""
Answer the question using only the following context.

If the answer is not available in the context,
say that you don't know based on the document.

Context:
{context}

Question:
{question}

Answer:
"""

    response = llm.invoke(prompt)
    content = response.content

    if isinstance(content, list):
        return "\n".join(
            item["text"]
            for item in content
            if isinstance(item, dict) and item.get("type") == "text"
        )

    return content
