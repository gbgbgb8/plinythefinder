// Form elements
const sightingForm = document.getElementById('sightingForm');
const rumorForm = document.getElementById('rumorForm');
const sightingsList = document.getElementById('sightingsList');
const rumorsList = document.getElementById('rumorsList');

// Fetch and display sightings
async function fetchAndDisplaySightings() {
    try {
        const response = await fetch('/.netlify/functions/getSightings');
        const sightings = await response.json();
        displaySightings(sightings);
    } catch (error) {
        console.error('Error fetching sightings:', error);
        sightingsList.innerHTML = '<div class="list-group-item text-danger">Error loading sightings</div>';
    }
}

// Fetch and display rumors
async function fetchAndDisplayRumors() {
    try {
        const response = await fetch('/.netlify/functions/getRumors');
        const rumors = await response.json();
        displayRumors(rumors);
    } catch (error) {
        console.error('Error fetching rumors:', error);
        rumorsList.innerHTML = '<div class="list-group-item text-danger">Error loading rumors</div>';
    }
}

// Handle sighting form submission
sightingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const location = document.getElementById('sightingLocation').value;
    const date = document.getElementById('sightingDate').value;
    
    try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                "form-name": "pliny-sighting",
                location: location,
                date: date,
                reportedAt: new Date().toISOString()
            }).toString()
        });
        
        sightingForm.reset();
        await fetchAndDisplaySightings();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting your sighting. Please try again.");
    }
});

// Handle rumor form submission
rumorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const location = document.getElementById('rumorLocation').value;
    const startDate = document.getElementById('rumorStartDate').value;
    const endDate = document.getElementById('rumorEndDate').value;
    
    try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                "form-name": "pliny-rumor",
                location: location,
                startDate: startDate,
                endDate: endDate,
                reportedAt: new Date().toISOString()
            }).toString()
        });
        
        rumorForm.reset();
        await fetchAndDisplayRumors();
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting your rumor. Please try again.");
    }
});

// Display sightings
function displaySightings(sightings) {
    sightingsList.innerHTML = '';
    
    sightings.forEach((sighting, index) => {
        if (index >= 10) return; // Only show last 10 sightings
        
        const formattedDate = new Date(sighting.date).toLocaleDateString();
        const reportedDate = new Date(sighting.reportedAt).toLocaleDateString();
        
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <h5 class="mb-1">${sighting.location}</h5>
            <p class="mb-1">Seen on: ${formattedDate}</p>
            <small class="text-muted">Reported: ${reportedDate}</small>
        `;
        
        sightingsList.appendChild(item);
    });
    
    if (sightings.length === 0) {
        sightingsList.innerHTML = '<div class="list-group-item">No sightings reported yet</div>';
    }
}

// Display rumors
function displayRumors(rumors) {
    rumorsList.innerHTML = '';
    
    rumors.forEach((rumor, index) => {
        if (index >= 10) return; // Only show last 10 active rumors
        
        const startDate = new Date(rumor.startDate).toLocaleDateString();
        const endDate = new Date(rumor.endDate).toLocaleDateString();
        const reportedDate = new Date(rumor.reportedAt).toLocaleDateString();
        
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <h5 class="mb-1">${rumor.location}</h5>
            <p class="mb-1">Expected: ${startDate} to ${endDate}</p>
            <small class="text-muted">Reported: ${reportedDate}</small>
        `;
        
        rumorsList.appendChild(item);
    });
    
    if (rumors.length === 0) {
        rumorsList.innerHTML = '<div class="list-group-item">No active rumors</div>';
    }
}

// Validate date inputs
document.getElementById('rumorStartDate').addEventListener('change', function() {
    document.getElementById('rumorEndDate').min = this.value;
});

document.getElementById('rumorEndDate').addEventListener('change', function() {
    document.getElementById('rumorStartDate').max = this.value;
});

// Initial fetch and display
fetchAndDisplaySightings();
fetchAndDisplayRumors();

// Refresh data every 5 minutes
setInterval(() => {
    fetchAndDisplaySightings();
    fetchAndDisplayRumors();
}, 5 * 60 * 1000); 