# Challenge Participation Feature

This document describes how to set up the challenge participation feature for the Build-Compete-AI platform.

## Overview

The feature allows:
- Participants to join challenges (one-time only)
- Companies to view who has joined their challenges
- Tracking submissions against joined challenges

## Database Setup

1. Execute the SQL code in `sql/schema.sql` in your Supabase SQL Editor. This will:
   - Create necessary tables (`profiles`, `challenges`, `challenge_participants`, `submissions`)
   - Set up relationships between tables
   - Configure Row Level Security (RLS) policies
   - Create triggers to maintain participant counts automatically

## Frontend Components

The following components have been implemented:

1. **Challenge Join Button**
   - Located in `src/pages/ChallengeDetails.tsx`
   - Allows participants to join a challenge once
   - Checks if the user is already joined

2. **Challenge Participants View**
   - Located in `src/pages/company/Submissions.tsx`
   - New "Participants" tab to view all users who joined challenges
   - Shows join date and submission status

## How It Works

### Joining a Challenge
1. When a user clicks "Join Challenge", we check if they're authenticated
2. We verify if they've already joined the challenge
3. If not, we insert a record into `challenge_participants` table
4. A trigger automatically updates the `participants` count in the challenges table

### Viewing Participants
1. Company users can access the Submissions page
2. The "Participants" tab shows all users who joined their challenges
3. Companies can see which participants have submitted solutions

## Supabase Table Structure

### `challenge_participants`
- `id`: UUID (primary key)
- `challenge_id`: UUID (foreign key to challenges)  
- `user_id`: UUID (foreign key to auth.users)
- `joined_at`: Timestamp
- Unique constraint on `(challenge_id, user_id)` to prevent duplicate joins

## Next Steps

To complete this feature:

1. Enhance the participant experience:
   - Add a "My Challenges" section to show joined challenges
   - Implement challenge leave functionality

2. Improve the company view:
   - Add filtering/sorting options for participants
   - Create export functionality for participant data

3. Analytics:
   - Add metrics showing conversion from joins to submissions
   - Track engagement over time 