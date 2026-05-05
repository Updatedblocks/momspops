// 50-question interview bank for soul calibration
// 5 randomly selected per distillation session

export interface InterviewQuestion {
  id: number;
  text: string;
  group: string;
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // GROUP 1: Lexicon & Syntax
  { id: 1, group: "lexicon", text: "When they pick up the phone or text you first thing in the morning, what are their exact words?" },
  { id: 2, group: "lexicon", text: "How do they usually say goodbye or sign off at the end of a long conversation?" },
  { id: 3, group: "lexicon", text: "What is a catchphrase, idiom, or weird slang word they use constantly?" },
  { id: 4, group: "lexicon", text: "If they stub their toe or drop their phone, what exact curse words (or substitute words) fly out of their mouth?" },
  { id: 5, group: "lexicon", text: "Do they use emojis, or are they strictly a text-only, proper punctuation kind of person? Which emojis do they abuse?" },
  { id: 6, group: "lexicon", text: "When they are absolutely shocked or surprised by news, what is their go-to reaction phrase?" },
  { id: 7, group: "lexicon", text: "How do they refer to you? Do they use your real name, a specific nickname, or an insult-as-a-term-of-endearment?" },
  { id: 8, group: "lexicon", text: "If they are running 10 minutes late, what text do they send you?" },
  { id: 9, group: "lexicon", text: "When they agree with you, do they say 'Yes,' 'Absolutely,' 'For sure,' or something else?" },
  { id: 10, group: "lexicon", text: "What is a movie quote, TV line, or song lyric they quote way too often?" },

  // GROUP 2: Humor & Joy
  { id: 11, group: "humor", text: "When they make a joke, are they usually making fun of themselves, making fun of you, or pointing out something absurd in the room?" },
  { id: 12, group: "humor", text: "What is the fastest way to make them laugh until they can't breathe?" },
  { id: 13, group: "humor", text: "Describe their 'Dad joke' or 'Mom joke' style. Do they love terrible puns?" },
  { id: 14, group: "humor", text: "If someone trips and falls (but isn't hurt), do they gasp and help, or laugh hysterically?" },
  { id: 15, group: "humor", text: "How do they react to heavy sarcasm? Do they dish it back, or do they take it literally?" },
  { id: 16, group: "humor", text: "If they try to pull a prank or be mischievous, what is their usual tactic?" },
  { id: 17, group: "humor", text: "What is a topic they find inexplicably hilarious that no one else really gets?" },
  { id: 18, group: "humor", text: "When they are in an incredibly good mood, how does their behavior change?" },
  { id: 19, group: "humor", text: "Do they ever use self-deprecation to defuse a tense situation? Give an example." },
  { id: 20, group: "humor", text: "How do they tease the people they love the most?" },

  // GROUP 3: Friction & Stress
  { id: 21, group: "friction", text: "If you cancel plans on them at the last minute, exactly what text message do they send back?" },
  { id: 22, group: "friction", text: "When they are secretly mad at you, how do you know? (What is their passive-aggressive tell?)" },
  { id: 23, group: "friction", text: "In a heated argument, do they yell and explode, or go ice-cold and silent?" },
  { id: 24, group: "friction", text: "If they are stressed about money or work, what is the phrase they repeat to themselves (or you)?" },
  { id: 25, group: "friction", text: "How do they tell you that you are doing something wrong or making a mistake?" },
  { id: 26, group: "friction", text: "When they know they are wrong, how do they apologize? (Or do they just act like nothing happened?)" },
  { id: 27, group: "friction", text: "What is a minor, petty inconvenience that completely ruins their day?" },
  { id: 28, group: "friction", text: "If you give them a compliment they don't know how to handle, how do they deflect it?" },
  { id: 29, group: "friction", text: "When they are worried about your safety or health, how does it manifest? (Nagging, hovering, silence?)" },
  { id: 30, group: "friction", text: "How quickly do they forgive and forget after a fight?" },

  // GROUP 4: Affection & Empathy
  { id: 31, group: "affection", text: "When you are going through a terrible breakup or job loss, what is their exact method of comforting you?" },
  { id: 32, group: "affection", text: "Do they say 'I love you' out loud, or do they show it by fixing your car / cooking you food?" },
  { id: 33, group: "affection", text: "When you tell them a crazy story about your day, how do they actively listen? (e.g., 'No way!', 'Uh huh', giving instant advice)" },
  { id: 34, group: "affection", text: "If you have a problem, do they immediately try to solve it with advice, or just listen to you vent?" },
  { id: 35, group: "affection", text: "How do they express pride in your accomplishments without sounding cheesy?" },
  { id: 36, group: "affection", text: "What is the most thoughtful, specific gift they have ever given you or someone else?" },
  { id: 37, group: "affection", text: "Do they randomly check in on you? What does that text usually look like?" },
  { id: 38, group: "affection", text: "How do they act around strangers or service workers compared to how they act around you?" },
  { id: 39, group: "affection", text: "If someone else is crying in the room, what is their immediate physical reaction?" },
  { id: 40, group: "affection", text: "What is a piece of life advice they have given you more than three times?" },

  // GROUP 5: Quirks & Fixations
  { id: 41, group: "quirks", text: "If you are sitting in silence, what random topic will they inevitably bring up?" },
  { id: 42, group: "quirks", text: "What specific object, song, or smell instantly launches them into a story about their past?" },
  { id: 43, group: "quirks", text: "Are they the kind of person who plans a vacation itinerary down to the minute, or do they just 'wing it'?" },
  { id: 44, group: "quirks", text: "When they tell a story, do they get bogged down in useless details (like what color a car was), or rush to the punchline?" },
  { id: 45, group: "quirks", text: "What is a conspiracy theory, political opinion, or wild belief they will debate anyone on?" },
  { id: 46, group: "quirks", text: "Do they talk more about 'the good old days' or what they plan to do five years from now?" },
  { id: 47, group: "quirks", text: "What is their absolute favorite hobby or obsession that they will talk your ear off about if you let them?" },
  { id: 48, group: "quirks", text: "If they had $1,000 to waste right now, what highly specific thing would they buy?" },
  { id: 49, group: "quirks", text: "What is a routine or habit they refuse to break, no matter what?" },
  { id: 50, group: "quirks", text: "If you had to summarize their entire worldview in one sentence, what would it be?" },
];
