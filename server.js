import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Trust first proxy for rate limiter
app.set('trust proxy', 1);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://ai-paraphrasing-tool-pro-vite.vercel.app/'] 
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.1.104:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
  optionsSuccessStatus: 200
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

    if (!text || !targetLanguage || !tone || !lengthPreference) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional paraphrasing assistant. Follow these guidelines:
              - Ensure the result is grammatically correct. Improve it by correcting any spelling and grammar mistakes and enhancing the    sentence structure as needed
              - Simplify Language: Replace complex words with simpler alternatives that maintain the original meaning.
              - Vary Sentence Structure: Use a mix of short and long sentences, and incorporate varied sentence beginnings to enhance flow
              - Keep the tone ${tone}
              - Make the text ${lengthPreference} than the original
              - Translate to ${targetLanguage} if different from source
              - Review for Coherence: After rewriting, ensure that the text flows logically and retains the original message.
              - Maintain technical accuracy
              - Use Active Voice: Favor active voice over passive voice to create a more direct and dynamic writing style.
              - Remove redundancies`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

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
  console.error('Error:', err);
  res.status(500).json({ 
    error: err instanceof Error ? err.message : 'Internal Server Error' 
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
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
