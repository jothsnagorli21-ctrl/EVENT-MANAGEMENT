const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini client with the API key from environment variables.
// The key is NEVER sent to the frontend — all calls happen here on the server.
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Helper: send a prompt to Gemini and return the text response
const callGemini = async (prompt) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// Helper: safely parse JSON from a Gemini response string.
// Gemini sometimes wraps JSON in markdown code fences — this strips them.
const parseJsonFromText = (text) => {
  // Remove ```json ... ``` or ``` ... ``` wrappers if present
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  return JSON.parse(cleaned);
};

// -------------------------------------------------------
// Generate a structured event plan using Gemini AI
// -------------------------------------------------------
const generateEventPlan = async (eventDetails) => {
  const {
    eventType,
    eventTopic,
    duration,
    numberOfParticipants,
    targetAudience,
    specialRequirements,
  } = eventDetails;

  const prompt = `
You are an expert event planner. Generate a detailed and structured event plan in JSON format only.

Event Details:
- Event Type: ${eventType}
- Event Topic: ${eventTopic}
- Duration: ${duration}
- Number of Participants: ${numberOfParticipants}
- Target Audience: ${targetAudience}
- Special Requirements: ${specialRequirements || 'None'}

Return ONLY a valid JSON object with exactly this structure (no extra text, no markdown):
{
  "schedule": [
    { "time": "09:00 AM", "activity": "Registration & Welcome", "duration": "30 minutes" }
  ],
  "activities": [
    { "name": "Activity Name", "description": "Brief description", "duration": "1 hour" }
  ],
  "tasks": [
    { "task": "Task description", "responsible": "Organizer/Volunteer", "deadline": "1 week before event" }
  ],
  "checklist": [
    { "item": "Checklist item", "category": "Logistics/Tech/Catering/etc" }
  ],
  "resources": [
    { "resource": "Resource name", "quantity": "Estimated quantity/amount", "notes": "Optional notes" }
  ]
}
`;

  try {
    const responseText = await callGemini(prompt);
    const plan = parseJsonFromText(responseText);

    // Validate that the response has the expected structure
    const requiredKeys = ['schedule', 'activities', 'tasks', 'checklist', 'resources'];
    for (const key of requiredKeys) {
      if (!Array.isArray(plan[key])) {
        plan[key] = [];
      }
    }

    return plan;
  } catch (error) {
    console.error('[Gemini] generateEventPlan error:', error.message);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

// -------------------------------------------------------
// Generate a professional event announcement using Gemini AI
// -------------------------------------------------------
const generateAnnouncement = async (eventDetails) => {
  const {
    title,
    description,
    category,
    date,
    startTime,
    endTime,
    venue,
  } = eventDetails;

  const formattedDate = new Date(date).toDateString();

  const prompt = `
You are a professional event communications writer. Write an engaging and professional event announcement for the following event.

Event Details:
- Event Name: ${title}
- Category: ${category}
- Description: ${description}
- Date: ${formattedDate}
- Time: ${startTime} to ${endTime}
- Venue: ${venue}

Write a compelling announcement (150-250 words) that:
1. Grabs attention with an engaging opening line
2. Clearly states what the event is about
3. Mentions the date, time, and venue
4. Encourages people to register
5. Has a professional and enthusiastic tone

Return ONLY the announcement text, no extra labels or formatting.
`;

  try {
    const announcement = await callGemini(prompt);
    return announcement.trim();
  } catch (error) {
    console.error('[Gemini] generateAnnouncement error:', error.message);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

// -------------------------------------------------------
// Analyze event feedback using Gemini AI
// -------------------------------------------------------
const analyzeFeedback = async (feedbackData) => {
  // Build a concise summary of feedback to send to Gemini
  const feedbackSummary = feedbackData.map((fb, index) => (
    `${index + 1}. Rating: ${fb.rating}/5 | Comment: "${fb.comment}"${fb.suggestions ? ` | Suggestions: "${fb.suggestions}"` : ''}`
  )).join('\n');

  const prompt = `
You are an expert at analyzing event feedback. Analyze the following feedback from event attendees and return a structured analysis in JSON format only.

Feedback Data:
${feedbackSummary}

Return ONLY a valid JSON object with exactly this structure (no extra text, no markdown):
{
  "overallSentiment": "Positive",
  "averageRating": 4.2,
  "commonPositivePoints": [
    "Clear description of a positive point"
  ],
  "commonIssues": [
    "Clear description of an issue raised"
  ],
  "improvementSuggestions": [
    "Specific actionable improvement suggestion"
  ],
  "summary": "A 2-3 sentence overall summary of the feedback."
}

Rules:
- "overallSentiment" must be exactly one of: "Positive", "Neutral", or "Negative"
- "averageRating" must be a number (1-5)
- All arrays should have 2-5 items based on the feedback
- Be concise and actionable
`;

  try {
    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromText(responseText);

    // Validate sentiment value
    const validSentiments = ['Positive', 'Neutral', 'Negative'];
    if (!validSentiments.includes(analysis.overallSentiment)) {
      analysis.overallSentiment = 'Neutral';
    }

    // Ensure arrays exist
    if (!Array.isArray(analysis.commonPositivePoints)) analysis.commonPositivePoints = [];
    if (!Array.isArray(analysis.commonIssues)) analysis.commonIssues = [];
    if (!Array.isArray(analysis.improvementSuggestions)) analysis.improvementSuggestions = [];

    return analysis;
  } catch (error) {
    console.error('[Gemini] analyzeFeedback error:', error.message);
    throw new Error('AI service is temporarily unavailable. Please try again later.');
  }
};

module.exports = { generateEventPlan, generateAnnouncement, analyzeFeedback };
