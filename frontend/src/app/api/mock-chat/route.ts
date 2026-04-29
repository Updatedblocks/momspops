import { type NextRequest } from 'next/server';

import type { Message, Persona, SoulState } from '@/types/soul';

// ── Hardcoded mock persona ──────────────────────────────────────────────
const MOM_PERSONA: Persona = {
  id: 'mom-001',
  name: 'Margaret',
  relation: 'Mother',
  tone: 'warm, caring, slightly worried',
};

const CORE_MEMORIES: string[] = [
  'You always loved her chicken soup when you were sick.',
  'She taught you to ride a bike at age 6.',
  'You call her every Sunday — or at least try to.',
];

const CONTEXT: Message[] = [
  {
    id: 'ctx-1',
    sender: 'user',
    content: 'Hey Mom, just checking in!',
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

// ── Route handler ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Parse the incoming message
  let userContent: string;
  try {
    const body = (await request.json()) as { message?: string };
    userContent = body.message ?? '';
  } catch {
    return Response.json(
      { error: 'Invalid JSON body. Expected { message: string }.' },
      { status: 400 },
    );
  }

  if (!userContent.trim()) {
    return Response.json(
      { error: 'Message must be a non-empty string.' },
      { status: 422 },
    );
  }

  // Simulate AI generation delay (1.5s as specified)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Build the hardcoded response
  const userMessage: Message = {
    id: `msg-${Date.now()}-user`,
    sender: 'user',
    content: userContent,
    timestamp: new Date().toISOString(),
  };

  const personaMessage: Message = {
    id: `msg-${Date.now()}-persona`,
    sender: 'persona',
    content: "I saw this and thought of you! Did you eat today?",
    timestamp: new Date().toISOString(),
  };

  const soulState: SoulState = {
    persona: MOM_PERSONA,
    core_memories: CORE_MEMORIES,
    recent_context: [...CONTEXT, userMessage, personaMessage],
  };

  return Response.json(soulState, { status: 200 });
}
