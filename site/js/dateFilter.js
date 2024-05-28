const oldestYear = 2017;
const currentYear = new Date().getFullYear();

let lastUpdatedMonth = new Date().getMonth();

const yearInput = document.getElementById("year");
const monthInput = document.getElementById("month");

export let currentDateString = "";

for (let y = oldestYear; y <= currentYear; y++) {
    const option = document.createElement("option");
    option.value = y;
    option.appendChild(document.createTextNode(y.toString()));

    yearInput.appendChild(option);
}

const updateMonthOptions = (toMonth) => {
    monthInput.replaceChildren();

    for (let m = 1; m <= toMonth; m++) {
        const option = document.createElement("option");
        option.value = m;

        let month = `${m >= 10 ? "" : "0"}${m}`;

        option.appendChild(document.createTextNode(month.toString()));

        monthInput.appendChild(option);
    }
};
updateMonthOptions(12);

yearInput.addEventListener("change", (e) => {
    const year = parseInt(e.target.value);

    if (year === currentYear) {
        updateMonthOptions(lastUpdatedMonth);
    } else {
        updateMonthOptions(12);
    }
});

fetch("/api/crime/last-updated")
    .then((resp) => {
        if (!resp.ok) return;
        return resp.json();
    })
    .then((date) => {
        lastUpdatedMonth = date.month;
        updateMonthOptions(date.month);

        const yearOption = document.querySelector(
            `option[value="${date.year}"]`
        );
        const monthOption = document.querySelector(
            `option[value="${date.month}"]`
        );
        yearOption.selected = true;
        monthOption.selected = true;

        currentDateString = date.dateString;
    });
