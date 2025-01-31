const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/forms/${process.env.NETLIFY_SIGHTINGS_FORM_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`
      }
    });
    
    const data = await response.json();
    
    // Transform and sort the data
    const sightings = data
      .map(submission => ({
        location: submission.data.location,
        date: submission.data.date,
        reportedAt: submission.data.reportedAt
      }))
      .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sightings)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch sightings' })
    };
  }
}; 