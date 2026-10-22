let selectedCategory = "all";
let selectedJob = "";
let savedJobs = new Set();

function allCards() {
    return [...document.querySelectorAll(".job-card")];
}

function filterJobs() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const city = document.getElementById("cityFilter").value;
    let count = 0;

    allCards().forEach(card => {
        const matchesText = card.textContent.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "all" ||
            card.dataset.category === selectedCategory;
        const matchesCity = city === "all" || card.dataset.city === city;
        const visible = matchesText && matchesCategory && matchesCity;

        card.style.display = visible ? "" : "none";
        if (visible) count++;
    });

    document.getElementById("resultMessage").textContent =
        `Нәтиже: ${count} вакансия`;
}

function searchJobs(event) {
    event.preventDefault();
    filterJobs();
    document.getElementById("jobs").scrollIntoView({ behavior: "smooth" });
}

function setCategory(category, button) {
    selectedCategory = category;

    document.querySelectorAll(".filter").forEach(item => {
        item.classList.remove("active");
    });

    button.classList.add("active");
    filterJobs();
}

function saveJob(button) {
    const card = button.closest(".job-card");
    const title = card.querySelector("h3").textContent;

    if (savedJobs.has(title)) {
        savedJobs.delete(title);
        button.classList.remove("saved");
        button.textContent = "♡";
    } else {
        savedJobs.add(title);
        button.classList.add("saved");
        button.textContent = "♥";
    }

    document.getElementById("savedCount").textContent = savedJobs.size;
}

function applyJob(title) {
    selectedJob = title;
    document.getElementById("applyTitle").textContent = title;
    document.getElementById("applyResult").textContent = "";
    document.getElementById("applyModal").hidden = false;
    document.getElementById("applicantName").focus();
}

function closeApply() {
    document.getElementById("applyModal").hidden = true;
}

document.getElementById("applyModal").addEventListener("click", event => {
    if (event.target.id === "applyModal") closeApply();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeApply();
});

function submitApplication(event) {
    event.preventDefault();

    const name = document.getElementById("applicantName").value.trim();
    const email = document.getElementById("applicantEmail").value.trim();

    const application = {
        job: selectedJob,
        name,
        email,
        about: document.getElementById("applicantAbout").value.trim(),
        date: new Date().toLocaleString()
    };

    try {
        const applications = JSON.parse(
            localStorage.getItem("jobfinderApplications") || "[]"
        );
        applications.push(application);
        localStorage.setItem("jobfinderApplications", JSON.stringify(applications));

        document.getElementById("applyResult").textContent =
            "Өтінім осы браузерде сақталды! Серверге жіберілген жоқ.";
    } catch {
        document.getElementById("applyResult").textContent =
            "Сақтау мүмкін болмады. Браузер параметрлерін тексер.";
    }
}

function createResume(event) {
    event.preventDefault();

    const resume = [
        "РЕЗЮМЕ",
        "Аты-жөні: " + document.getElementById("resumeName").value.trim(),
        "Мамандығы: " + document.getElementById("resumeRole").value.trim(),
        "Email: " + document.getElementById("resumeEmail").value.trim(),
        "Дағдылары: " + document.getElementById("resumeSkills").value.trim()
    ].join("\n");

    const output = document.getElementById("resumeOutput");
    output.hidden = false;
    output.textContent = resume;

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "primary-btn";
    copyButton.textContent = "Резюмені көшіру";
    copyButton.onclick = async () => {
        try {
            await navigator.clipboard.writeText(resume);
            copyButton.textContent = "Көшірілді ✓";
        } catch {
            copyButton.textContent = "Мәтінді қолмен белгіле";
        }
    };

    output.appendChild(document.createElement("br"));
    output.appendChild(copyButton);
}

function sendMessage(event) {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    const contactMessage = [
        "JobFinder хабарламасы",
        "Аты: " + name,
        "Email: " + email,
        "Хабарлама: " + message
    ].join("\n");

    const result = document.getElementById("contactResult");
    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "primary-btn";
    copyButton.textContent = "Хабарламаны көшіру";
    copyButton.onclick = async () => {
        try {
            await navigator.clipboard.writeText(contactMessage);
            copyButton.textContent = "Көшірілді ✓";
        } catch {
            result.textContent = "Хабарламаны қолмен көшіріп ал.";
        }
    };

    result.textContent =
        "Хабарлама дайындалды. Ол сайт иесіне автоматты түрде жіберілген жоқ.";
    result.appendChild(document.createElement("br"));
    result.appendChild(copyButton);
}

function toggleTheme() {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");

    try {
        localStorage.setItem("jobfinderTheme", isLight ? "light" : "dark");
    } catch {}
}

try {
    if (localStorage.getItem("jobfinderTheme") === "light") {
        document.body.classList.add("light");
    }
} catch {}

filterJobs();