const storageSessions = getStorageSessions();

const fadeOut = (element) => {
    // Enable the element's hidden attribute so that it can be targeted in CSS
    // Wait for the CSS removal animation and then actually remove it from the DOM
    element.hidden = true;
    setTimeout(() => {
        element.remove();
    }, 1000);    
}

const deleteSession = (target) => {
    const confirm = window.confirm("Are you sure you want to delete this session?");
    if (confirm) {
        delete storageSessions[target.dataset.session];
        localStorage.setItem(SAVED_SESSIONS, JSON.stringify(storageSessions));
        fadeOut(target.parentElement);
        if (Object.keys(storageSessions).length === 0) {
            document.getElementById("resumeTitle").remove();
        }
    }
}

const renderSessions = () => {
    let links = "";
    const sortedSessions = Object.entries(storageSessions).sort((a, b) => {
        return Date.parse(b[1].lastAccess) - Date.parse(a[1].lastAccess)
    });
    for (let [url, { course, lastAccess, startedOn }] of sortedSessions) {
        links += `
            <div class="savedSession block">
                <a href="${url}">
                    <p><strong>Course:</strong> ${course}</p>
                    <p><strong>Started on:</strong> ${startedOn}</p>
                    <p><strong>Last access:</strong> ${lastAccess}</p>
                </a>
                <button data-session="${url}" class="deleteSession">Delete session</button>
            </div>
        `;
    }
    if (links) {
        const html = `
            <p id="resumeTitle">Resume a previous session:</p>
            ${links}
        `;
        document.getElementById(SAVED_SESSIONS).innerHTML = html;
    }
}

const start = () => {
    const src = document.getElementById('quiz').value;
    const quick = document.getElementById('fastmode').checked ? 1 : 0;
    const url = `quiz-engine.html?src=${src}&quick=${quick}`;
    window.location = url;
}

document.addEventListener("DOMContentLoaded", () => {
    renderSessions();
});

document.addEventListener("click", ({ target }) => {
    if (!target) return;
    if (target.id === "startButton") {
        return start();
    }
    if (target.className === "deleteSession") {
        return deleteSession(target);
    }
});