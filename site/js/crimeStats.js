import { fetchPoliceCrimeData } from "./crimeData.js";
import { createCrimeFreqPie } from "./charts.js";

export async function updateCrimeStats() {
    const areaInput = document.getElementById("area");
    const latitude = parseFloat(areaInput.dataset.latitude); // Assuming latitude is stored in a data attribute
    const longitude = parseFloat(areaInput.dataset.longitude); // Assuming longitude is stored in a data attribute

    const crimeSelect = document.getElementById("crime");
    const crimeType = crimeSelect.value;
    const date = currentDateString; // Use the currentDateString from your date filter

    try {
        const crimeData = await fetchPoliceCrimeData(
            latitude,
            longitude,
            crimeType,
            date
        ); // Await fetchPoliceCrimeData
        if (!crimeData || crimeData.length === 0) {
            crimeStats.textContent =
                "No crime data found for the selected criteria.";
            return;
        }

        crimeStats.textContent = "Crime data:";

        const crimeCounts = {};
        crimeData.forEach((crime) => {
            const category = crime.category.replace(/-/g, " ");
            crimeCounts[category] = (crimeCounts[category] || 0) + 1;
        });

        createCrimeFreqPie(crimeData.length, crimeCounts); // Call the pie chart creation function
    } catch (error) {
        console.error("Error fetching crime data:", error);
        crimeStats.textContent = "Error fetching crime data.";
    }
}

export function populateYearMonthDropdowns() {
    const yearSelect = document.getElementById("year");
    const monthSelect = document.getElementById("month");

    const currentYear = new Date().getFullYear();
    for (let i = 2020; i <= currentYear; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.value = i.toString().padStart(2, "0");
        option.textContent = new Date(0, i - 1).toLocaleString("default", {
            month: "long",
        });
        monthSelect.appendChild(option);
    }
}
