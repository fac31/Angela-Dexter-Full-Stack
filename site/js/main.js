window.HERE_API_KEY = "2jVwbhCihNJP6YbnvpTcYMaUso_xB6YMZWm4UiOjBLQ";
window.MAPTILER_API_KEY = "U6dlVfFVUNQwiAyFYJpp";
import { showCrimeDefinitions } from "./crimeDefinitions.js";

document.addEventListener("DOMContentLoaded", () => {
    const viewDefinitionsBtn = document.getElementById("viewDefinitions");
    if (viewDefinitionsBtn) {
        viewDefinitionsBtn.addEventListener("click", () => {
            showCrimeDefinitions();
        });
    }
});

function getMonthName(month) {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return months[parseInt(month) - 1] || "Invalid Month";
}

export function updateStats(data) {
    const yearInput = document.getElementById("year");
    const monthInput = document.getElementById("month");
    const year = yearInput.value;
    const month = monthInput.value;
    const statsContainer = document.getElementById("crimeStats");
    statsContainer.innerHTML = "";

    if (!Array.isArray(data)) {
        console.error("Data format is not as expected:", data);
        return;
    }

    const monthName = getMonthName(month);

    const totalCount = data.length;
    const totalCrimesText = document.createElement("div");
    totalCrimesText.textContent = `${totalCount} crimes occurred in ${monthName} ${year}.`;
    statsContainer.appendChild(totalCrimesText);

    const crimeCountsByCategory = {};

    data.forEach((crime) => {
        const category = crime.category;
        if (!crimeCountsByCategory[category]) {
            crimeCountsByCategory[category] = 0;
        }
        crimeCountsByCategory[category]++;
    });

    for (const category in crimeCountsByCategory) {
        const count = crimeCountsByCategory[category];
        const statElement = document.createElement("li");
        statElement.textContent = `${category}: ${count}`;
        statsContainer.appendChild(statElement);
    }
}
