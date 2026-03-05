import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

/* eslint-disable @typescript-eslint/no-unused-vars */

// Verify environment variables are loaded
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

console.log('Connecting to database...');

// Configure Pool with proper timeout settings for Neon
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  keepAlive: true,
  ssl: {
    rejectUnauthorized: false,
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create roles
  const secretary = await prisma.role.upsert({
    where: { slug: 'secretary' },
    update: {},
    create: {
      name: 'Secretary',
      slug: 'secretary',
      description: 'Administrative support and office management',
      isActive: true,
      icon: '📋',
    },
  });

  const adminOfficer = await prisma.role.upsert({
    where: { slug: 'admin-officer' },
    update: {},
    create: {
      name: 'Administrative Officer',
      slug: 'admin-officer',
      description: 'Administrative operations and coordination',
      isActive: false,
      icon: '👔',
    },
  });

  const dataAnalyst = await prisma.role.upsert({
    where: { slug: 'data-analyst' },
    update: {},
    create: {
      name: 'Data Analyst',
      slug: 'data-analyst',
      description: 'Data analysis and reporting',
      isActive: false,
      icon: '📊',
    },
  });

  const hrManager = await prisma.role.upsert({
    where: { slug: 'hr-manager' },
    update: {},
    create: {
      name: 'HR Manager',
      slug: 'hr-manager',
      description: 'Human resources management',
      isActive: false,
      icon: '👥',
    },
  });

  const policyAdvisor = await prisma.role.upsert({
    where: { slug: 'policy-advisor' },
    update: {},
    create: {
      name: 'Policy Advisor',
      slug: 'policy-advisor',
      description: 'Policy development and analysis',
      isActive: false,
      icon: '📜',
    },
  });

  // Create lessons for Secretary role with detailed content
  const lessons = [
    {
      title: 'Introduction to AI Tools',
      description: 'Learn the basics of AI and how it can help in your daily tasks',
      content: `## What is Artificial Intelligence?

Artificial Intelligence (AI) refers to computer systems that can perform tasks that typically require human intelligence. For secretaries and administrative professionals, AI tools can help automate repetitive tasks, improve efficiency, and allow you to focus on more strategic work.

## Why AI Matters for Secretaries

As a secretary, you handle numerous tasks daily:
- Managing correspondence and communications
- Scheduling meetings and appointments
- Organizing files and documents
- Taking meeting notes
- Coordinating with multiple departments

AI tools can help you do all of these tasks faster and more accurately, giving you more time for important work that requires your personal touch.

## Common AI Tools You'll Use

- Email assistants that draft responses and organize your inbox
- Calendar tools that find optimal meeting times automatically
- Document summarizers that extract key points from long reports
- Transcription services that convert speech to text instantly
- Task automation tools that handle repetitive workflows

## Getting Started Safely

When using AI tools, always remember:
- Never share confidential or sensitive information
- Review AI-generated content before sending or sharing
- Use AI as an assistant, not a replacement for your judgment
- Ask questions if you're unsure about a tool's capabilities
- Report any concerns to your IT department

## Key Takeaways

AI is a powerful assistant that can help you work smarter, not harder. In the following lessons, you'll learn specific tools and techniques to apply AI in your daily work. Remember, AI enhances your skills - it doesn't replace them!`,
      order: 1,
      duration: 15,
    },
    {
      title: 'Email Management with AI',
      description: 'Use AI to organize, prioritize, and draft emails efficiently',
      content: `## The Email Challenge

On average, secretaries spend 2-3 hours daily managing emails. AI tools can help you reduce this time by 40-50%, allowing you to focus on more important tasks.

## Smart Email Sorting

AI can automatically categorize your emails:
- Urgent messages that need immediate attention
- FYI emails that can be read later
- Newsletters and subscriptions
- Spam and promotional content

Most modern email systems (like Outlook and Gmail) have built-in AI that learns your preferences over time. Enable these features in your email settings.

## AI-Powered Email Drafting

When drafting emails, AI tools like Grammarly, Microsoft Editor, or Gmail's Smart Compose can:
- Suggest complete sentences as you type
- Correct grammar and spelling errors automatically
- Recommend more professional phrasing
- Adjust tone (formal, casual, friendly) based on the recipient

## Example: Professional Email Writing

Instead of writing from scratch, provide AI with key points:

Input to AI: "Tell department heads about next Friday's budget meeting at 2 PM in Conference Room A. They should bring Q4 expense reports."

AI Output: "Dear Department Heads, This is to inform you of our budget review meeting scheduled for Friday, [date] at 2:00 PM in Conference Room A. Please bring your Q4 expense reports for discussion. Looking forward to your attendance."

## Time-Saving Templates

Create email templates for common scenarios:
- Meeting confirmations
- Document requests
- Out-of-office replies
- Follow-up messages

AI can help you customize these templates quickly based on the specific situation.

## Email Priority Management

Use AI to identify which emails need your immediate attention. Look for:
- Messages from your supervisor or key stakeholders
- Time-sensitive requests
- Meeting confirmations requiring action
- Important updates from other departments

## Best Practices

- Review AI suggestions before sending
- Personalize AI-generated content when appropriate
- Maintain your professional voice
- Use AI to handle routine correspondence, not sensitive matters
- Set aside specific times to process emails (don't check constantly)`,
      order: 2,
      duration: 20,
    },
    {
      title: 'Calendar Optimization',
      description: 'Smart scheduling and meeting management with AI',
      content: `## The Scheduling Dilemma

Coordinating meetings across multiple calendars can take 20-30 minutes per meeting. AI scheduling assistants can reduce this to under 2 minutes.

## AI Calendar Tools

Popular AI scheduling tools include:
- Microsoft Outlook's Scheduling Assistant
- Google Calendar's smart scheduling
- Calendly (for external meetings)
- Microsoft Bookings
- AI assistants like x.ai or Clara

These tools can access multiple calendars, find conflicts, and suggest optimal meeting times automatically.

## How AI Scheduling Works

When you need to schedule a meeting:
- Tell the AI tool who needs to attend
- Specify the meeting duration
- Set any preferences (time of day, location)
- AI checks everyone's availability
- AI suggests 3-5 optimal time slots
- You select the best option
- AI sends invitations automatically

## Smart Time Blocking

AI can help you protect focused work time:
- Automatically block time for lunch breaks
- Reserve morning hours for priority tasks
- Set "no meeting" days or times
- Buffer time between meetings (15-30 minutes)

## Meeting Conflict Resolution

When conflicts arise, AI tools can:
- Identify the least impactful time to reschedule
- Suggest alternative dates based on participant priorities
- Notify all attendees of changes
- Find suitable replacement times instantly

## Managing Multiple Time Zones

For organizations with remote workers or international offices:
- AI automatically converts meeting times to each participant's time zone
- Tools like World Time Buddy or Every Time Zone help find overlaps
- Calendar invitations show the correct local time for each attendee

## Recurring Meetings

AI can optimize recurring meetings by:
- Identifying patterns in cancellations
- Suggesting better times based on attendance history
- Automatically adjusting for holidays and team availability
- Removing unnecessary meetings based on participation data

## Pro Tips for Calendar Management

- Color-code different types of meetings
- Use AI to send reminder notifications
- Set up automatic meeting prep time before important calls
- Let AI suggest meeting durations based on agenda items
- Enable "speedy meetings" (25 or 50 minutes instead of 30 or 60)

## Respecting Work-Life Balance

AI can help protect your boundaries:
- Block personal time from work meetings
- Set working hours limits
- Decline conflicting invitations automatically
- Suggest alternative times outside working hours only when necessary`,
      order: 3,
      duration: 18,
    },
    {
      title: 'Document Summarization',
      description: 'Quickly understand long documents using AI summarization',
      content: `## The Information Overload Problem

Modern secretaries often receive lengthy reports, proposals, and documents that need quick review. Reading everything thoroughly would take hours you don't have.

## What is AI Document Summarization?

AI summarization tools read long documents and extract the most important information, creating concise summaries that capture key points, decisions, and action items.

## Popular Summarization Tools

- Microsoft Word's Editor (built-in summarization)
- ChatGPT or Claude for custom summaries
- Notion AI for note summarization
- Adobe Acrobat's AI summary features
- Browser extensions like TLDR This or Scholarcy

## Types of Summaries

**Extractive Summary**
Pulls exact sentences from the document. Good for maintaining original wording and accuracy.

**Abstractive Summary**
Rewrites information in new words. Better for understanding complex documents in simple terms.

**Bullet Point Summary**
Lists key points. Ideal for quick reference and executive briefings.

## How to Create Effective Summaries

Step 1: Upload or paste your document into an AI tool

Step 2: Specify what you need:
- Overall summary
- Key decisions and action items
- Main arguments or recommendations
- Specific sections or topics

Step 3: Review the AI summary for accuracy

Step 4: Add your own notes or context if needed

## Practical Applications

**Board Meeting Minutes**
- AI extracts decisions made, action items, and responsible parties
- Creates a structured summary for distribution
- Highlights items requiring follow-up

**Long Proposals**
- Summarize 50-page proposals into 2-page briefs
- Extract budget figures and timelines
- Identify key requirements and conditions

**Policy Documents**
- Translate complex legal language into plain English
- Highlight changes from previous versions
- Extract compliance requirements

**Email Threads**
- Summarize long email conversations
- Identify unresolved questions
- List action items and deadlines

## Example: Summarizing a Report

Original Document: 15-page quarterly report

AI Summary Output:
"The Q4 report shows 12% revenue growth, exceeding targets by 3%. Main challenges include supply chain delays (2 weeks average) and staffing shortages in the IT department. Recommended actions: hire 3 developers, explore alternative suppliers, and increase inventory buffer by 15%. Budget impact: $250K. Board approval required by March 15."

## Best Practices

- Always read the full document for critical decisions
- Use summaries for initial review and prioritization
- Verify numbers and dates in AI summaries
- Keep original documents for reference
- Don't share AI summaries of confidential information externally
- Customize summary length based on audience needs

## Quality Check

When reviewing AI summaries, ask:
- Does it capture the main message?
- Are key numbers and dates accurate?
- Are action items clearly identified?
- Does it maintain the document's tone and intent?
- Would someone unfamiliar with the topic understand it?

## Time Savings

Document summarization can save you:
- 15-20 minutes per long report
- 1-2 hours daily on email digests
- 30-45 minutes on meeting prep by summarizing background materials
- Several hours weekly on document review and briefing preparation`,
      order: 4,
      duration: 25,
    },
    {
      title: 'Meeting Transcription Tools',
      description: 'Automate note-taking and action items from meetings',
      content: `## The Note-Taking Challenge

Taking meeting notes while actively participating is difficult. You might miss important discussions while writing, or miss details while listening. AI transcription solves this problem.

## AI Transcription Tools

Popular meeting transcription tools:
- Microsoft Teams (built-in transcription)
- Otter.ai (real-time transcription and notes)
- Zoom's AI Companion
- Google Meet transcription
- Fireflies.ai
- Fathom (for recorded calls)

These tools join your meetings (with permission) and create automatic transcripts.

## How AI Transcription Works

During the meeting:
- AI listens to audio in real-time
- Converts speech to text with 95%+ accuracy
- Identifies different speakers
- Timestamps important moments
- Flags action items and decisions

After the meeting:
- Full transcript is ready within minutes
- AI generates summary of key points
- Action items are listed with owners
- Meeting recording is available for playback

## Setting Up Meeting Transcription

Before your first meeting:
- Enable transcription in your meeting platform settings
- Inform participants recording is active (get consent)
- Test audio quality for best transcription results
- Set up speaker identification if possible

During meetings:
- Speak clearly and at moderate pace
- Minimize background noise
- Mute when not speaking in large meetings
- Use names when assigning action items

## Extracting Action Items

AI can automatically identify action items by listening for phrases like:
- "[Name] will..."
- "We need to..."
- "Please..."
- "The deadline is..."
- "Let's follow up on..."

Example:
Meeting conversation: "Sarah, can you please send the budget report to finance by Wednesday?"

AI extracts: "Action Item: Sarah to send budget report to finance | Due: Wednesday"

## Creating Meeting Summaries

AI-generated meeting summaries typically include:

**Attendees:** [List of participants]

**Key Discussion Points:**
- Topic 1 with brief description
- Topic 2 with brief description
- Topic 3 with brief description

**Decisions Made:**
- Decision 1
- Decision 2

**Action Items:**
- Task | Owner | Deadline

**Next Steps:**
- Follow-up meeting date, parking lot items

## Sharing Meeting Notes

Best practices for distributing AI-generated notes:
- Review transcript for accuracy before sharing
- Remove off-topic or confidential discussions
- Add context where AI might have misunderstood
- Highlight urgent action items
- Include meeting recording link for clarity
- Send within 24 hours while memories are fresh

## Handling Different Meeting Types

**One-on-One Meetings**
- Used for detailed discussion records
- Helpful for tracking commitments over time
- Good for performance review documentation

**Team Meetings**
- Ensure all action items have owner names
- Capture decisions for team members who couldn't attend
- Create searchable archive of team discussions

**Client Meetings**
- Review carefully before sharing with clients
- May need manual editing for professionalism
- Confirm sensitive information is removed

**Board Meetings**
- Formal minutes may still require manual creation
- Use transcripts as backup reference
- Ensure compliance with organizational policies

## Accessibility Benefits

Transcription helps:
- Team members who are hearing impaired
- Non-native speakers following complex discussions
- Remote workers with poor connections
- People reviewing meetings they missed

## Privacy and Confidentiality

Always:
- Announce when meetings are being recorded
- Store transcripts securely
- Follow organization's data retention policies
- Don't share confidential meeting notes outside authorized personnel
- Delete recordings after documented retention period

## Time Savings and Benefits

Meeting transcription saves you:
- 20-30 minutes per meeting on note-taking
- 45-60 minutes weekly on distributing minutes
- Hours of back-and-forth clarifying "who said what"
- Eliminates forgotten action items
- Creates searchable archive of all discussions`,
      order: 5,
      duration: 22,
    },
  ];

  for (const lesson of lessons) {
    await prisma.lesson.upsert({
      where: {
        roleId_order: {
          roleId: secretary.id,
          order: lesson.order,
        },
      },
      update: {},
      create: {
        ...lesson,
        roleId: secretary.id,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  
  // Verify the data was actually written
  const roleCount = await prisma.role.count();
  const lessonCount = await prisma.lesson.count();
  console.log(`Roles created: ${roleCount}`);
  console.log(`Lessons created: ${lessonCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Close the connection pool
  });
