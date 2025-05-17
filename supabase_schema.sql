CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT,
    company_logo_url TEXT,
    description TEXT,
    long_description TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    participants INTEGER DEFAULT 0,
    deadline TIMESTAMPTZ,
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    prizes JSONB, -- Example: '[{"position": "1st Place", "reward": "$5,000"}]'
    requirements JSONB, -- Example: '{"submission": ["GitHub repo"], "evaluation": ["Expert review"]}'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Indexes for frequently queried columns
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);
CREATE INDEX idx_challenges_featured ON challenges(featured);
CREATE INDEX idx_challenges_tags ON challenges USING GIN(tags);

-- Function to update updated_at timestamp automatically on update
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_challenges
BEFORE UPDATE ON challenges
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Example Insert (for testing)
INSERT INTO challenges (title, company, company_logo_url, description, long_description, difficulty, participants, deadline, tags, featured, prizes, requirements) VALUES 
(
    'LLM-based Summarization Engine',
    'AI Research Labs',
    '/placeholder.svg',
    'Build an LLM-powered engine that can summarize technical documents with high accuracy and low hallucination rates.',
    '<p class="mb-4">Your task is to build a summarization engine...</p>',
    'Intermediate',
    128,
    '2025-06-05T00:00:00Z',
    ARRAY['NLP', 'LLM', 'Summarization'],
    TRUE,
    '[{"position": "1st Place", "reward": "$5,000 + Job Interview"}, {"position": "2nd Place", "reward": "$2,500"}, {"position": "3rd Place", "reward": "$1,000"}]',
    '{"submission": ["GitHub repository link", "2-minute demo video", "5-page presentation deck"], "evaluation": ["Automated LLM scoring (40%)", "Human expert review (60%)"]}'
);