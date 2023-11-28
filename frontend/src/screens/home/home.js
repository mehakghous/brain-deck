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

let user = null;
const subjectsList = document.getElementById("subjects_list");
const topicsList = document.getElementById("topics_list");

const addSubject = async (e) => {
    const formData = new FormData(e);
    const formProps = Object.fromEntries(formData);
    if (!formProps.subjectName) {
        alert("Please add subject name!")
        return;
    }
    fetcher({
        endpoint: "/subject",
        method: "POST",
        body: { subjectName: formProps.subjectName, user_id: user.user_id }
    }).then(() => {
        getSubjects()
    })
}

const getSubjects = async () => {
    const subjects = await fetcher({
        endpoint: "/subject",
        method: "GET",
        query: { user_id: user.user_id }
    })
    if (subjects) {
        subjectsList.innerHTML = ""
        subjects.map(subject => {
            subjectsList.innerHTML += `
            <li class="nav-item"  data-bs-dismiss="offcanvas" aria-label="Close" onclick="showTopics(${subject.subject_id})">   
                <span class="nav-link active fw-semibold text-capitalize"><i class="bi bi-journal"></i> ${subject.subject_name}</span>
                <div>
                    <button type="button" onclick="createTopic(${subject.subject_id})" class="btn btn-primary btn-sm">Add Topic</button>
                    <button type="button" onclick="deleteSubject(${subject.subject_id})" class="btn btn-outline-danger btn-sm">Delete</button>
                </div>
            </li>
        `
        })
    }
}

const deleteSubject = (subject_id) => {
    fetcher({
        endpoint: `/subject/${subject_id}`,
        method: "DELETE",
    }).then(() => {
        getSubjects()
    })
}

const createTopic = async (subject_id) => {
    var topicName = prompt("Enter topic name:");
    if (!topicName) {
        alert("Please add topic name!")
        return;
    }
    fetcher({
        endpoint: "/topic",
        method: "POST",
        body: { topicName, subject_id }
    }).then(() => {
        showTopics(subject_id)
    })
}

const showTopics = async (subject_id) => {
    const topics = await fetcher({
        endpoint: "/topic",
        method: "GET",
        query: { subject_id }
    })
    if (topics) {
        topicsList.innerHTML = ""
        topics.map(topic => {
            topicsList.innerHTML += `
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title text-capitalize">${topic.topic_name}</h5>
                        <button class="btn btn-primary" onclick='showDeck(${topic.topic_id})'>Show Deck</button>
                        <button class="btn btn-outline-danger" onclick='deleteTopic(${topic.topic_id},${subject_id})'>Delete</button>
                    </div>
                </div>
            </div>
            `
        })
    }
}

const deleteTopic = (topic_id, subject_id) => {
    fetcher({
        endpoint: `/topic/${topic_id}`,
        method: "DELETE",
    }).then(() => {
        showTopics(subject_id)
    })
}

const showDeck = (topic_id) => {
    localStorage.setItem("topicId", topic_id);
    window.location.href = '../flashcards/flashcards.html'
}

const logOut = () => {
    localStorage.removeItem("user");
    window.location.href = `../auth/auth.html`
}

(() => {
    const _user = JSON.parse(localStorage.getItem("user") || `{}`)
    if (!_user.email) {
        window.location.href = `../auth/auth.html`
    } else {
        user = _user;
        getSubjects()
    }
})()