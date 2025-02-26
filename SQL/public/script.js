async function submitIdea() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert("Please fill in all fields.");
        return;
    }

    const idea = { user_id: 1, title, content };

    console.log("📤 Sending Data:", idea);

    try {
        const response = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(idea)
        });

        const data = await response.json();
        console.log("📩 Server Response:", data);

        if (response.ok) {
            alert("✅ Idea submitted successfully!");
            document.getElementById('title').value = "";
            document.getElementById('content').value = "";
            loadPublishedIdeas();
        } else {
            alert("❌ Error: " + data.error);
        }
    } catch (error) {
        console.error("🚨 Network Error:", error);
        alert("Failed to submit idea.");
    }
}

async function loadPublishedIdeas() {
    try {
        const response = await fetch('http://localhost:5000/published');
        const ideas = await response.json();

        const ideasList = document.getElementById('published-ideas');
        ideasList.innerHTML = "";

        if (ideas.length === 0) {
            ideasList.innerHTML = "<p>No published ideas yet.</p>";
            return;
        }

        ideas.forEach(idea => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${idea.title}</strong><p>${idea.content}</p>`;
            ideasList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching published ideas:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPublishedIdeas);
