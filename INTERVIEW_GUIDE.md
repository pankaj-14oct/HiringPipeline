# Interview Management Guide - HireFlow

## How to Add Interviews to Interview Panels and Assign to Candidates

### Overview
HireFlow has a two-step interview process:
1. **Create Interview Panels** - Groups of interviewers for specific positions
2. **Schedule Interviews** - Assign candidates to panels for specific interview sessions

### Step 1: Create Interview Panels

**Location:** Navigate to `/panels` page

**What are Interview Panels?**
Interview panels are groups of interviewers organized by:
- Job position
- Interview type (technical, HR, final round)
- Department or specialty

**How to Create a Panel:**
1. Go to "Interview Panels" page
2. Click "Create Panel" button
3. Fill in:
   - **Panel Name**: e.g., "Frontend Developer Technical Panel"
   - **Description**: What this panel interviews for
   - **Interviewers**: List of interviewer IDs/names
   - **Job ID**: Which job position this panel is for

**Current Panel Examples:**
- Technical Interview Panel (Software Engineers)
- HR Screening Panel (Initial interviews)
- Executive Final Round Panel (Senior positions)

### Step 2: Schedule Interviews (Assign Candidates to Panels)

**Location:** Navigate to `/interviews` page

**Enhanced Interview Scheduling:**
The new enhanced interview modal provides:

#### Candidate & Application Selection
- **Select Application**: Choose from existing candidate applications
- **Shows Candidate Details**: Name, email, position applied for
- **Job Information**: Position title and department

#### Panel Assignment
- **Interview Panel Selection**: Choose which panel will conduct the interview
- **Panel Details**: Shows panel name and number of interviewers
- **Panel Type**: Technical, HR, Behavioral, etc.

#### Interview Configuration
- **Interview Type Options**:
  - Screening Call
  - Technical Interview
  - Behavioral Interview
  - HR Interview
  - Final Round
  - Culture Fit

- **Duration Options**: 30 min, 45 min, 1 hour, 1.5 hours, 2 hours
- **Date & Time**: Schedule when the interview will take place
- **Notes**: Add instructions or context for the panel

### Step 3: Interview Process Flow

1. **Application Created** → Candidate applies for a job
2. **Panel Assignment** → HR assigns candidate to relevant interview panel
3. **Interview Scheduled** → Specific date/time set with panel
4. **Interview Conducted** → Panel interviews the candidate
5. **Feedback & Scoring** → Panel provides scores and notes
6. **Decision Made** → Based on all interview feedback

### Current System Features

#### For HR/Recruiters:
- View all scheduled interviews
- See candidate details and application status
- Assign different panel types for different interview rounds
- Track interview status (scheduled, completed, cancelled)
- View interview scores and feedback

#### For Interview Panels:
- Access to candidate information before interviews
- Structured feedback collection
- Scoring system (0-100 points)
- Collaborative notes between panel members

#### For Candidates:
- Can see their scheduled interviews in candidate portal
- Receive interview confirmations and details
- Access to interview preparation materials (if provided)

### Database Structure

**Interview Panels Table:**
- `id`: Unique panel identifier
- `name`: Panel name (e.g., "Technical Panel")
- `description`: What the panel interviews for
- `interviewers`: Array of interviewer IDs
- `jobId`: Associated job position

**Interviews Table:**
- `id`: Unique interview identifier
- `applicationId`: Links to candidate application
- `panelId`: Links to interview panel
- `scheduledAt`: Date and time
- `duration`: Interview length in minutes
- `type`: Interview category
- `status`: scheduled/completed/cancelled
- `feedback`: Panel notes
- `score`: Interview score (0-100)
- `interviewerNotes`: Detailed feedback by interviewer

### Best Practices

1. **Create Specialized Panels**: Different panels for different interview types
2. **Consistent Scheduling**: Use standard durations and formats
3. **Clear Documentation**: Add notes for panel preparation
4. **Track Progress**: Monitor interview completion and feedback
5. **Structured Feedback**: Use the scoring system consistently

### API Endpoints

- `GET /api/interview-panels` - List all panels
- `POST /api/interview-panels` - Create new panel
- `GET /api/interviews` - List all interviews
- `POST /api/interviews` - Schedule new interview
- `PUT /api/interviews/:id` - Update interview details

This system ensures proper organization of the interview process, from panel creation to candidate assignment and feedback collection.