const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/forms/${process.env.NETLIFY_RUMORS_FORM_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${process.env.NETLIFY_ACCESS_TOKEN}`
      }
    });
    
    const data = await response.json();
    
    // Transform and sort the data, filter out expired rumors
    const rumors = data
      .map(submission => ({
        location: submission.data.location,
        startDate: submission.data.startDate,
        endDate: submission.data.endDate,
        reportedAt: submission.data.reportedAt
      }))
      .filter(rumor => new Date(rumor.endDate) >= new Date())
      .sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rumors)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch rumors' })
    };
  }
}; 