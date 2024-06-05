const crimeTypeFilter = document.getElementById("crime");

export let currentFilters = ["all-crime"];

new Choices(crimeTypeFilter, {
    searchEnabled: false,
    itemSelectText: "",
    removeItemButton: true,
    choices: [
        {
            value: "all-crime",
            label: "All Crime",
            id: 1,
            selected: true,
        },
        {
            value: "anti-social-behaviour",
            label: "Anti-social behaviour",
            id: 2,
        },
        {
            value: "bicycle-theft",
            label: "Bicycle theft",
            id: 3,
        },
        {
            value: "burglary",
            label: "Burglary",
            id: 4,
        },
        {
            value: "criminal-damage-arson",
            label: "Criminal damage and arson",
            id: 5,
        },
        {
            value: "drugs",
            label: "Drugs",
            id: 6,
        },
        {
            value: "other-theft",
            label: "Other theft",
            id: 7,
        },
        {
            value: "possession-of-weapons",
            label: "Possesion of weapons",
            id: 8,
        },
        {
            value: "public-order",
            label: "Public order",
            id: 9,
        },
        {
            value: "robbery",
            label: "Robbery",
            id: 10,
        },
        {
            value: "shoplifting",
            label: "Shoplifting",
            id: 11,
        },
        {
            value: "vehicle-crime",
            label: "Vehicle crime",
            id: 12,
        },
        {
            value: "violent-crime",
            label: "Violent crime",
            id: 13,
        },
        {
            value: "other-crime",
            label: "Other crime",
            id: 14,
        },
    ],
});
