export function showCrimeDefinitions() {
    // Create a popup container
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup');

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');

    // Add crime definitions to the popup content
    popupContent.innerHTML = `
        <h2>Crime Definitions</h2>
        <ul>
            <li><strong>Antisocial behaviour</strong>: someone acting in a manner that causes or is likely to cause harassment, alarm or distress to one or more people not living in the same household as the perpetrator.</li>
            <li><strong>Burglary</strong>: is the theft, or attempted theft, from a premises where access is not authorised.</li>
            <li><strong>Criminal Damage</strong>: Where property is intentionally destroyed or damaged, not necessarily to gain entry to premises or a vehicle.</li>
            <li><strong>Drugs</strong>: Possession, consumption, supply of or the intent to supply illegal drugs.</li>
            <li><strong>Fraud and forgery</strong>: an intentional deception in most occasions for monetary gain; whereas forgery is the action of creating an exact replica of an object with the intention of deception. </li>
            <li><strong>Other notifiable offences</strong>: This is a broad category containing offences that are notifiable to the Home Office.</li>
            <li><strong>Robbery</strong>: Theft with the use of force or a threat of force. Both personal and commercial robbery are included. Snatch theft is not included. </li>
            <li><strong>Sexual offences</strong>: A broad category of sexual offences, including Indecent Assault and Unlawful (under age) Sexual Intercourse.</li>
            <li><strong>Theft and handling</strong>: Theft from a person, motor vehicle, bikes, residential or non-residential property and more. Plus the storage, transport or attempted resale of property after a theft has occurred. </li>
            <li><strong>Violence against the person</strong>: Includes a range of offences from minor offences such as harassment and common assault, to serious offences such as murder, actual bodily harm and grievous bodily harm.</li>
            <li><strong>Additional crime types</strong>: This is a broad category of types not covered in other categories. They range from weapon-related crimes to hate crimes and robbery.</li>
        </ul>
    `;

    // Close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = 'x';
    closeButton.addEventListener('click', () => {
        popupContainer.remove();
    });

    // Append content and close button to the container
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(popupContent);

    // Append the popup container to the body
    document.body.appendChild(popupContainer); 

    // Function to handle outside click
    function handleOutsideClick(event) {
        if (!popupContent.contains(event.target)) {
            popupContainer.remove();
            document.removeEventListener('click', handleOutsideClick);
        }
    }

    // Add event listener for clicks outside the popup content
    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick);
    }, 0);
}