import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Trust first proxy for rate limiter (useful if behind a proxy like Vercel)
app.set('trust proxy', 1);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' },
  keyGenerator: (req) => req.ip || 'unknown', // Use req.ip as the key
});

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://ai-paraphrasing-tool-pro-vite.vercel.app',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://192.168.1.104:5173',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', limiter);

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Paraphrase endpoint
app.post('/api/paraphrase', async (req, res) => {
  try {
    const { text, targetLanguage, tone, lengthPreference } = req.body;

    // Input validation
    if (!text || !targetLanguage || !tone || !lengthPreference) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, targetLanguage, tone, lengthPreference' 
      });
    }

    // Retrieve the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured.');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured.' 
      });
    }

    // Prepare the request to OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional paraphrasing assistant. Follow these guidelines:
              - Ensure the result is grammatically correct. Improve it by correcting any spelling and grammar mistakes and enhancing the sentence structure as needed.
              - Simplify Language: Replace complex words with simpler alternatives that maintain the original meaning.
              - Vary Sentence Structure: Use a mix of short and long sentences, and incorporate varied sentence beginnings to enhance flow.
              - Keep the tone ${tone}.
              - Make the text ${lengthPreference} than the original.
              - Translate to ${targetLanguage} if different from source.
              - Review for Coherence: After rewriting, ensure that the text flows logically and retains the original message.
              - Maintain technical accuracy.
              - Use Active Voice: Favor active voice over passive voice to create a more direct and dynamic writing style.
              - Remove redundancies.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    // Handle non-OK responses
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API Error:', errorData);
      return res.status(openAIResponse.status).json({ 
        error: errorData.error?.message || 'OpenAI API request failed' 
      });
    }

    const data = await openAIResponse.json();

    // Validate response format
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format from OpenAI API:', data);
      return res.status(500).json({ error: 'Invalid response format from OpenAI API' });
    }

    const data = JSON.parse(rawData);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid or empty response from OpenAI API');
    }
    

    // Send the paraphrased text back to the frontend
    res.json({ 
      paraphrasedText: data.choices[0].message.content.trim() 
    });
  } catch (error) {
    console.error('Paraphrase Error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to paraphrase text' 
    });
  }
});

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
