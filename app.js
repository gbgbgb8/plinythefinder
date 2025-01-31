// Initialize data storage
let sightings = JSON.parse(localStorage.getItem('sightings')) || [];
let rumors = JSON.parse(localStorage.getItem('rumors')) || [];

// Form elements
const sightingForm = document.getElementById('sightingForm');
const rumorForm = document.getElementById('rumorForm');
const sightingsList = document.getElementById('sightingsList');
const rumorsList = document.getElementById('rumorsList');

// Handle sighting form submission
sightingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const location = document.getElementById('sightingLocation').value;
    const date = document.getElementById('sightingDate').value;
    
    const sighting = {
        location,
        date,
        reportedAt: new Date().toISOString()
    };
    
    // Submit to Netlify
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            "form-name": "pliny-sighting",
            location: location,
            date: date,
            reportedAt: new Date().toISOString()
        }).toString()
    })
    .then(() => {
        // Store locally for display
        sightings.unshift(sighting);
        localStorage.setItem('sightings', JSON.stringify(sightings));
        displaySightings();
        sightingForm.reset();
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        alert("There was an error submitting your sighting. Please try again.");
    });
});

// Handle rumor form submission
rumorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const location = document.getElementById('rumorLocation').value;
    const startDate = document.getElementById('rumorStartDate').value;
    const endDate = document.getElementById('rumorEndDate').value;
    
    const rumor = {
        location,
        startDate,
        endDate,
        reportedAt: new Date().toISOString()
    };
    
    // Submit to Netlify
    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            "form-name": "pliny-rumor",
            location: location,
            startDate: startDate,
            endDate: endDate,
            reportedAt: new Date().toISOString()
        }).toString()
    })
    .then(() => {
        // Store locally for display
        rumors.unshift(rumor);
        localStorage.setItem('rumors', JSON.stringify(rumors));
        displayRumors();
        rumorForm.reset();
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        alert("There was an error submitting your rumor. Please try again.");
    });
});

// Display sightings
function displaySightings() {
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
function displayRumors() {
    rumorsList.innerHTML = '';
    
    // Filter out expired rumors
    rumors = rumors.filter(rumor => new Date(rumor.endDate) >= new Date());
    localStorage.setItem('rumors', JSON.stringify(rumors));
    
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

// Initial display
displaySightings();
displayRumors();

// Validate date inputs
document.getElementById('rumorStartDate').addEventListener('change', function() {
    document.getElementById('rumorEndDate').min = this.value;
});

document.getElementById('rumorEndDate').addEventListener('change', function() {
    document.getElementById('rumorStartDate').max = this.value;
}); 