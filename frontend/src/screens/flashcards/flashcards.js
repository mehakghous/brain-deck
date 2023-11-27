const fetcher = async ({ endpoint, body, method, query }) => {
    try {
        const res = await fetch(`http://localhost:4000${endpoint}${query ? `?${Object.entries(query).map(([key, value]) => `${key}=${value}&`)}` : ""}`, {
            body: body ? JSON.stringify(body) : undefined,
            method,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        return await res.json()
    } catch (error) {
        console.error("🚀 ~ Fetcher error:", error)
    }
}

const flashcardList = document.getElementById('flashcard_list');
let topic_id = null;

const getFlashCards = async () => {
    const flashCards = await fetcher({
        endpoint: "/flashcard",
        method: "GET",
        query: { topic_id }
    })
    if (flashCards) {
        flashcardList.innerHTML = ""
        flashCards.map((flashcard, index) => {
            flashcardList.innerHTML += `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">${flashcard.question}</h5>
                        <p class="card-text blur-text" id="answer-${index}">${flashcard.answer}</p>
                        <button class="btn btn-primary" onclick="toggleBlurText(this,${index})">Show Answer</button>
                        <button class="btn btn-outline-danger" onclick="deleteFlashcard(${flashcard.flashcard_id})">Delete</button>
                    </div>
                </div>
            </div>
            `
        })
    }
}

const toggleBlurText = (e, index) => {
    e.innerHTML = e.innerHTML === "Show Answer" ? "Hide Answer" : "Show Answer";
    const text = document.getElementById(`answer-${index}`);
    text.classList.toggle("blur-text")
}

const deleteFlashcard = (flashcard_id) => {
    fetcher({
        endpoint: `/flashcard/${flashcard_id}`,
        method: "DELETE",
    }).then(() => {
        getFlashCards()
    })
}

const addFlashCard = () => {
    const question = prompt("Please add question:")
    const answer = prompt("Please add answer:")
    if (!question || !answer) {
        alert("Please add question and answer!")
        return;
    }
    fetcher({
        endpoint: "/flashcard",
        method: "POST",
        body: { question, answer, topic_id }
    }).then(() => {
        getFlashCards()
    })
}

(() => {
    const _topic_id = localStorage.getItem("topicId");
    if (!_topic_id) {
        window.location.href = '../home/home.html'
    } else {
        topic_id = _topic_id;
        getFlashCards()
        localStorage.removeItem("topicId")
    }
})()