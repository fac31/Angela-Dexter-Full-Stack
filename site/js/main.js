// there HERE api key doesnt actually have to be hidden
window.HERE_API_KEY = "2jVwbhCihNJP6YbnvpTcYMaUso_xB6YMZWm4UiOjBLQ";

import { showCrimeDefinitions } from "./crimeDefinitions.js";

document.addEventListener("DOMContentLoaded", () => {
    const viewDefinitionsBtn = document.getElementById("viewDefinitions");
    if (viewDefinitionsBtn) {
        viewDefinitionsBtn.addEventListener("click", () => {
            showCrimeDefinitions();
        });
    }
});

// // restrict users from selecting months beyond the current month
// document.addEventListener("DOMContentLoaded", () => {
//     const monthYearInput = document.getElementById("monthYear");

//     // Get the current date
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed

//     // Format the current month and year as "YYYY-MM" for input value
//     const currentMonthValue = `${currentYear}-${currentMonth.toString().padStart(2, "0")}`;

//     // Set the max attribute of the input to the current month
//     monthYearInput.setAttribute("max", currentMonthValue);
//     monthYearInput.value = currentMonthValue; // Set initial value to current month

//     // Event listener for changes in the input value
//     monthYearInput.addEventListener("change", () => {
//         // Parse the selected month and year from the input value
//         const [selectedYear, selectedMonth] = monthYearInput.value.split("-");

//         // Convert to numbers for comparison
//         const selectedYearNum = parseInt(selectedYear);
//         const selectedMonthNum = parseInt(selectedMonth);

//         // If the selected year is greater than the current year, or if it's the current year but the selected month is greater than the current month
//         if (selectedYearNum > currentYear || (selectedYearNum === currentYear && selectedMonthNum > currentMonth)) {
//             // Set the input value back to the current month
//             monthYearInput.value = currentMonthValue;
//         }
//     });
// });

// function updateCrimeStats(crimeData, totalCrimes, date) {
//     // Update the total crime count and date
//     const totalCrimeElement = document.getElementById("crimeStats");
//     totalCrimeElement.textContent = `${totalCrimes} crimes were reported here in ${date}`;

//     // Update individual crime categories
//     const crimeListElement = document.getElementById("crimeList");

//     // Iterate over the crime data and update each category count
//     for (const category in crimeData) {
//         const count = crimeData[category];
//         const categoryElement = document.getElementById(`${category}Count`);
//         if (categoryElement) {
//             categoryElement.textContent = count;
//         } else {
//             // Create new <li> element if category span doesn't exist
//             const listItem = document.createElement("li");
//             listItem.textContent = `${category}: ${count}`;
//             crimeListElement.appendChild(listItem);
//         }
//     }
// }
// export { updateCrimeStats };
