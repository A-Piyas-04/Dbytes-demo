import type { L } from './data';
import { b, type ToolId } from './data';

/* ---------------- reading paths ---------------- */
export interface ReadingPath { id: string; title: L; desc: L; by: string; papers: string[]; hue: number; learners: number }
export const PATHS: ReadingPath[] = [
  { id: 'path1', title: b('From attention to chat models', 'অ্যাটেনশন থেকে চ্যাট মডেল'), desc: b('Five papers that explain how ChatGPT-style models came to be.', 'চ্যাটজিপিটি-ধরনের মডেল কীভাবে এল, তা বোঝায় এমন পাঁচটি পেপার।'), by: 'farhana', papers: ['p1', 'p7', 'p8', 'p17', 'p2'], hue: 330, learners: 2140 },
  { id: 'path2', title: b('Small but capable models', 'ছোট কিন্তু সক্ষম মডেল'), desc: b('How data, scaling rules and architecture make small models useful.', 'ডেটা, স্কেলিং নিয়ম ও আর্কিটেকচার কীভাবে ছোট মডেলকে কাজের করে।'), by: 'arif', papers: ['p6', 'p11', 'p13', 'p9', 'p10', 'p14'], hue: 140, learners: 960 },
  { id: 'path3', title: b('Fine-tuning on a budget', 'কম খরচে ফাইন-টিউনিং'), desc: b('Adapt big models with a single GPU.', 'একটি জিপিইউ দিয়ে বড় মডেল মানিয়ে নিন।'), by: 'doshomik', papers: ['p8', 'p5', 'p12'], hue: 172, learners: 1480 },
  { id: 'path4', title: b('Agents that use tools', 'যে এজেন্ট টুল ব্যবহার করে'), desc: b('Reasoning, acting, retrieving and calling APIs.', 'যুক্তি, কাজ, তথ্য খোঁজা ও এপিআই কল।'), by: 'rafi', papers: ['p2', 'p4', 'p15', 'p16'], hue: 24, learners: 1120 },
];

/* ---------------- paper clubs ---------------- */
export interface Club { id: string; name: L; host: string; papers: string[]; when: L; next: L; members: number; weeks: number; week: number; lang: L; hue: number; sessions: { title: L; date: L; state: 'done' | 'next' | 'soon' }[] }
export const CLUBS: Club[] = [
  { id: 'club1', name: b('LoRA & QLoRA club', 'লোরা ও কিউলোরা ক্লাব'), host: 'farhana', papers: ['p5', 'p12'], when: b('Thursdays, 9:00 pm', 'বৃহস্পতিবার, রাত ৯টা'), next: b('Thu, Nov 26', 'বৃহঃ, ২৬ নভেম্বর'), members: 186, weeks: 3, week: 2, lang: b('Bangla + English', 'বাংলা + ইংরেজি'), hue: 330,
    sessions: [
      { title: b('LoRA §1–4: why low rank?', 'লোরা §১–৪: লো র‍্যাঙ্ক কেন?'), date: b('Nov 19', '১৯ নভেম্বর'), state: 'done' },
      { title: b('Reproduce Table 5 on a small model', 'ছোট মডেলে টেবিল ৫ রিপ্রোডিউস'), date: b('Nov 26', '২৬ নভেম্বর'), state: 'next' },
      { title: b('QLoRA: 4-bit fine-tuning', 'কিউলোরা: ৪-বিট ফাইন-টিউনিং'), date: b('Dec 3', '৩ ডিসেম্বর'), state: 'soon' },
    ] },
  { id: 'club2', name: b('Read “Attention” in Bangla', 'বাংলায় “অ্যাটেনশন” পড়ি'), host: 'nusrat', papers: ['p1'], when: b('Saturdays, 8:00 pm', 'শনিবার, রাত ৮টা'), next: b('Sat, Nov 28', 'শনি, ২৮ নভেম্বর'), members: 412, weeks: 4, week: 3, lang: b('Bangla', 'বাংলা'), hue: 168,
    sessions: [
      { title: b('The big picture and Figure 1', 'বড় ছবি ও ফিগার ১'), date: b('Nov 7', '৭ নভেম্বর'), state: 'done' },
      { title: b('Scaled dot-product attention', 'স্কেলড ডট-প্রোডাক্ট অ্যাটেনশন'), date: b('Nov 14', '১৪ নভেম্বর'), state: 'done' },
      { title: b('Multi-head and positions', 'মাল্টি-হেড ও পজিশন'), date: b('Nov 28', '২৮ নভেম্বর'), state: 'next' },
      { title: b('Results and limits', 'ফলাফল ও সীমাবদ্ধতা'), date: b('Dec 5', '৫ ডিসেম্বর'), state: 'soon' },
    ] },
  { id: 'club3', name: b('Agents reading group', 'এজেন্ট রিডিং গ্রুপ'), host: 'rafi', papers: ['p4', 'p16'], when: b('Sundays, 7:30 pm', 'রবিবার, সন্ধ্যা ৭:৩০'), next: b('Sun, Nov 29', 'রবি, ২৯ নভেম্বর'), members: 97, weeks: 2, week: 1, lang: b('English', 'ইংরেজি'), hue: 24,
    sessions: [
      { title: b('ReAct: thoughts and actions', 'রিঅ্যাক্ট: চিন্তা ও কাজ'), date: b('Nov 29', '২৯ নভেম্বর'), state: 'next' },
      { title: b('Toolformer', 'টুলফর্মার'), date: b('Dec 6', '৬ ডিসেম্বর'), state: 'soon' },
    ] },
];

/* ---------------- tools ---------------- */
export const TOOL_META: Record<ToolId, { name: L; short: L; desc: L; unit: L; units: L; hue: number }> = {
  landscape: { name: b('Research landscape map', 'রিসার্চ ল্যান্ডস্কেপ ম্যাপ'), short: b('Landscape map', 'ল্যান্ডস্কেপ ম্যাপ'), desc: b('Pick a topic. Get the main approaches, key papers, how they connect, and open questions.', 'একটি টপিক বাছুন। পাবেন মূল পদ্ধতি, প্রধান পেপার, সংযোগ ও খোলা প্রশ্ন।'), unit: b('map', 'ম্যাপ'), units: b('maps', 'ম্যাপ'), hue: 172 },
  compare: { name: b('Paper comparison matrix', 'পেপার তুলনা ম্যাট্রিক্স'), short: b('Compare papers', 'পেপার তুলনা'), desc: b('Methods, datasets, results, strengths and weaknesses side by side, with source references.', 'পদ্ধতি, ডেটাসেট, ফল, শক্তি ও দুর্বলতা পাশাপাশি, সূত্রসহ।'), unit: b('comparison', 'তুলনা'), units: b('comparisons', 'তুলনা'), hue: 210 },
  claim: { name: b('Claim & evidence check', 'দাবি ও প্রমাণ যাচাই'), short: b('Claim check', 'দাবি যাচাই'), desc: b('See which experiment supports a claim, what it assumes, and what it does not show.', 'কোন পরীক্ষা দাবিকে সমর্থন করে, কী ধরে নেয়, আর কী দেখায় না।'), unit: b('check', 'যাচাই'), units: b('checks', 'যাচাই'), hue: 36 },
  roadmap: { name: b('Reproduction roadmap', 'রিপ্রোডাকশন রোডম্যাপ'), short: b('Reproduction roadmap', 'রিপ্রোডাকশন রোডম্যাপ'), desc: b('Turn a paper into an implementation checklist: code, data, steps, evaluation and blockers.', 'পেপারকে বাস্তবায়নের চেকলিস্টে রূপ দিন: কোড, ডেটা, ধাপ, মূল্যায়ন ও বাধা।'), unit: b('roadmap', 'রোডম্যাপ'), units: b('roadmaps', 'রোডম্যাপ'), hue: 140 },
};

/* ---------------- landscape maps ---------------- */
export interface Theme { id: string; name: L; summary: L; papers: string[]; external: { title: string; year: number }[] }
export interface LandscapeMap { id: string; topic: L; keywords: string[]; candidates: number; themes: Theme[]; links: { a: string; b: string; label: L }[]; questions: L[]; extraQuestions: L[] }

export const MAPS: LandscapeMap[] = [
  {
    id: 'slm', topic: b('Small language models', 'ছোট ভাষা মডেল'), keywords: ['small', 'tiny', 'slm', 'efficient', 'distil', 'compact', 'on-device', 'mobile', 'quantiz', 'ছোট'], candidates: 214,
    themes: [
      { id: 'scale', name: b('Compute-optimal scaling', 'কম্পিউট-সর্বোত্তম স্কেলিং'), summary: b('Rules for how big a model should be for a given budget. They showed many models were under-trained, which made smaller models trained longer competitive.', 'নির্দিষ্ট বাজেটে মডেল কত বড় হবে, তার নিয়ম। দেখা গেছে অনেক মডেল কম ট্রেন হয়েছিল, ফলে বেশি ট্রেন করা ছোট মডেল প্রতিযোগিতামূলক।'), papers: ['p6', 'p11'], external: [{ title: 'LLaMA: Open and Efficient Foundation Language Models', year: 2023 }] },
      { id: 'data', name: b('Data quality over size', 'আকারের চেয়ে ডেটার মান'), summary: b('Carefully chosen or synthetic data lets small models punch above their weight.', 'বাছাই করা বা সিনথেটিক ডেটা ছোট মডেলকে আকারের চেয়ে বেশি সক্ষম করে।'), papers: ['p9', 'p10'], external: [{ title: 'Phi-3 Technical Report', year: 2024 }, { title: 'TinyLlama: An Open-Source Small Language Model', year: 2024 }] },
      { id: 'distill', name: b('Distillation', 'ডিস্টিলেশন'), summary: b('A small student learns to imitate a large teacher, keeping most of its skill.', 'ছোট ছাত্র-মডেল বড় শিক্ষককে অনুকরণ করে বেশিরভাগ দক্ষতা রাখে।'), papers: ['p13'], external: [{ title: 'MiniLM: Deep Self-Attention Distillation', year: 2020 }] },
      { id: 'arch', name: b('Architectures for tiny models', 'ছোট মডেলের আর্কিটেকচার'), summary: b('At sub-billion scale, depth, weight sharing and attention variants matter more than at large scale.', 'বিলিয়নের নিচে গভীরতা, ওয়েট শেয়ার ও অ্যাটেনশনের ধরন বেশি গুরুত্বপূর্ণ।'), papers: ['p14'], external: [] },
      { id: 'compress', name: b('Compression and efficient tuning', 'সংকোচন ও সাশ্রয়ী টিউনিং'), summary: b('Quantization and low-rank adapters cut memory so models run and adapt on cheap hardware.', 'কোয়ান্টাইজেশন ও লো-র‍্যাঙ্ক অ্যাডাপ্টার মেমরি কমায়, ফলে সস্তা হার্ডওয়্যারে চলে ও মানিয়ে নেয়।'), papers: ['p5', 'p12'], external: [{ title: 'GPTQ: Accurate Post-Training Quantization', year: 2023 }, { title: 'LLM.int8(): 8-bit Matrix Multiplication', year: 2022 }] },
    ],
    links: [
      { a: 'scale', b: 'data', label: b('Scaling rules raised the value of each token', 'স্কেলিং নিয়মে প্রতিটি টোকেনের মূল্য বাড়ে') },
      { a: 'data', b: 'arch', label: b('Both target the same sub-billion regime', 'দুটোই বিলিয়নের নিচের মডেল নিয়ে') },
      { a: 'distill', b: 'compress', label: b('Both shrink an existing large model', 'দুটোই বড় মডেলকে ছোট করে') },
      { a: 'scale', b: 'arch', label: b('MobileLLM revisits scaling for tiny models', 'মোবাইলএলএলএম ছোট মডেলে স্কেলিং পুনর্বিবেচনা করে') },
    ],
    questions: [
      b('Do data-quality gains hold for low-resource languages like Bangla?', 'ডেটা-মানের সুবিধা কি বাংলার মতো কম-রিসোর্সের ভাষায় টেকে?'),
      b('How should we evaluate small models without relying on a large model as the grader?', 'বড় মডেলকে গ্রেডার না বানিয়ে ছোট মডেল কীভাবে মূল্যায়ন করব?'),
      b('Where is the break-even point between distilling and training small from scratch?', 'ডিস্টিল করা আর শূন্য থেকে ছোট মডেল ট্রেনের মধ্যে লাভের সীমা কোথায়?'),
    ],
    extraQuestions: [
      b('Can 4-bit quantization and deep-thin architectures be combined without accuracy loss?', '৪-বিট কোয়ান্টাইজেশন ও গভীর-সরু আর্কিটেকচার কি মান না হারিয়ে মেশানো যায়?'),
      b('How much synthetic data is too much before models collapse to narrow styles?', 'কতটা সিনথেটিক ডেটায় মডেল সংকীর্ণ ধরনে আটকে যায়?'),
    ],
  },
  {
    id: 'rag', topic: b('Retrieval-augmented generation', 'রিট্রিভাল-অগমেন্টেড জেনারেশন'), keywords: ['rag', 'retriev', 'search', 'knowledge', 'grounding', 'রিট্রিভ'], candidates: 388,
    themes: [
      { id: 'enc', name: b('Encoders for search', 'সার্চের জন্য এনকোডার'), summary: b('Pretrained encoders turn questions and passages into vectors you can compare.', 'প্রিট্রেইনড এনকোডার প্রশ্ন ও অনুচ্ছেদকে তুলনাযোগ্য ভেক্টরে রূপ দেয়।'), papers: ['p7', 'p13'], external: [{ title: 'Dense Passage Retrieval for Open-Domain QA', year: 2020 }] },
      { id: 'rag', name: b('Retrieve, then generate', 'খুঁজে, তারপর তৈরি'), summary: b('Fetch relevant passages and condition the generator on them.', 'প্রাসঙ্গিক অংশ এনে সেগুলোর ভিত্তিতে উত্তর তৈরি।'), papers: ['p15'], external: [{ title: 'REALM: Retrieval-Augmented LM Pre-Training', year: 2020 }, { title: 'Improving LMs by Retrieving from Trillions of Tokens (RETRO)', year: 2022 }] },
      { id: 'tools', name: b('Search as a tool', 'টুল হিসেবে সার্চ'), summary: b('Instead of a fixed retriever, the model decides when to search.', 'নির্দিষ্ট রিট্রিভারের বদলে মডেল নিজে ঠিক করে কখন খুঁজবে।'), papers: ['p4', 'p16'], external: [{ title: 'WebGPT: Browser-assisted QA', year: 2021 }] },
      { id: 'reason', name: b('Reasoning over evidence', 'প্রমাণের উপর যুক্তি'), summary: b('Step-by-step reasoning combines several retrieved facts.', 'ধাপে ধাপে যুক্তি একাধিক খুঁজে পাওয়া তথ্য একত্র করে।'), papers: ['p2', 'p8'], external: [{ title: 'Self-RAG: Learning to Retrieve, Generate, and Critique', year: 2023 }] },
    ],
    links: [
      { a: 'enc', b: 'rag', label: b('Retrievers are built on these encoders', 'এই এনকোডারেই রিট্রিভার তৈরি') },
      { a: 'rag', b: 'tools', label: b('From always-retrieve to retrieve-when-needed', 'সবসময় খোঁজা থেকে প্রয়োজনে খোঁজা') },
      { a: 'tools', b: 'reason', label: b('ReAct mixes both', 'রিঅ্যাক্ট দুটোই মেশায়') },
    ],
    questions: [
      b('How do we measure whether an answer is actually supported by the retrieved text?', 'উত্তর সত্যিই খুঁজে পাওয়া টেক্সট দ্বারা সমর্থিত কিনা কীভাবে মাপব?'),
      b('What works best for Bangla documents with little labeled data?', 'কম লেবেল ডেটার বাংলা নথিতে কী সবচেয়ে ভালো কাজ করে?'),
      b('When does a long context window make retrieval unnecessary?', 'কখন লম্বা কনটেক্সট উইন্ডো রিট্রিভালকে অপ্রয়োজনীয় করে?'),
    ],
    extraQuestions: [b('How should retrieval systems handle conflicting sources?', 'পরস্পরবিরোধী উৎস রিট্রিভাল কীভাবে সামলাবে?')],
  },
  {
    id: 'agents', topic: b('AI agents with tools', 'টুলসহ এআই এজেন্ট'), keywords: ['agent', 'tool', 'react', 'planning', 'এজেন্ট'], candidates: 302,
    themes: [
      { id: 'prompt', name: b('Prompted reasoning', 'প্রম্পটেড যুক্তি'), summary: b('Writing out steps makes multi-step tasks possible.', 'ধাপ লিখে ফেললে বহু-ধাপের কাজ সম্ভব হয়।'), papers: ['p2'], external: [{ title: 'Tree of Thoughts', year: 2023 }] },
      { id: 'loop', name: b('Think–act loops', 'ভাবো–কাজ করো লুপ'), summary: b('Alternate reasoning with actions and observations.', 'যুক্তির সাথে কাজ ও পর্যবেক্ষণ পালাক্রমে।'), papers: ['p4'], external: [{ title: 'Reflexion: Language Agents with Verbal RL', year: 2023 }] },
      { id: 'learn', name: b('Learning to use tools', 'টুল ব্যবহার শেখা'), summary: b('Train the model to decide when and how to call APIs.', 'কখন ও কীভাবে এপিআই ডাকবে, তা মডেলকে শেখানো।'), papers: ['p16'], external: [{ title: 'Gorilla: LLM Connected with Massive APIs', year: 2023 }] },
      { id: 'align', name: b('Instruction following', 'নির্দেশনা মানা'), summary: b('Agents rely on models that follow instructions reliably.', 'এজেন্ট নির্ভরযোগ্যভাবে নির্দেশনা মানে এমন মডেলের উপর নির্ভর করে।'), papers: ['p17'], external: [] },
    ],
    links: [
      { a: 'prompt', b: 'loop', label: b('ReAct adds actions to chain-of-thought', 'রিঅ্যাক্ট চেইন-অফ-থটে কাজ যোগ করে') },
      { a: 'loop', b: 'learn', label: b('Prompting vs training for tool use', 'টুল ব্যবহারে প্রম্পট বনাম ট্রেনিং') },
      { a: 'align', b: 'loop', label: b('Better instruction following, steadier loops', 'ভালো নির্দেশনা মানা, স্থির লুপ') },
    ],
    questions: [
      b('How do we evaluate agents fairly when environments change?', 'পরিবেশ বদলালে এজেন্টকে ন্যায্যভাবে কীভাবে মূল্যায়ন করব?'),
      b('When should an agent stop and ask the user?', 'কখন এজেন্টের থেমে ব্যবহারকারীকে জিজ্ঞেস করা উচিত?'),
    ],
    extraQuestions: [b('Can small models run reliable agent loops on a phone?', 'ছোট মডেল কি ফোনে নির্ভরযোগ্য এজেন্ট লুপ চালাতে পারে?')],
  },
];
export const matchMap = (q: string) => {
  const n = q.trim().toLowerCase();
  if (!n) return null;
  return MAPS.find((m) => m.topic.en.toLowerCase() === n || m.topic.bn === q.trim() || m.keywords.some((k) => n.includes(k))) || null;
};

/* ---------------- reproduction roadmaps ---------------- */
export type Avail = 'yes' | 'partial' | 'no';
export interface Roadmap {
  paper: string;
  summary: L;
  compute: L;
  availability: { label: L; status: Avail; note: L }[];
  steps: L[];
  evaluation: L[];
  blockers: { label: L; fix: L }[];
  prereqs: string[];
}
export const ROADMAPS: Record<string, Roadmap> = {
  p5: {
    paper: 'p5',
    summary: b('Reproduce the core LoRA result on a small model first, then scale up.', 'প্রথমে ছোট মডেলে মূল লোরা ফল রিপ্রোডিউস করুন, তারপর বড় করুন।'),
    compute: b('Small version: ~1 hour on a free Colab T4. Paper scale (GPT-3 175B) is not feasible.', 'ছোট সংস্করণ: ফ্রি কোলাব T4-এ ~১ ঘণ্টা। পেপারের স্কেল (GPT-3 175B) সম্ভব নয়।'),
    availability: [
      { label: b('Official code', 'অফিশিয়াল কোড'), status: 'yes', note: b('github.com/microsoft/LoRA (loralib)', 'github.com/microsoft/LoRA (loralib)') },
      { label: b('Datasets', 'ডেটাসেট'), status: 'yes', note: b('GLUE tasks on Hugging Face Datasets', 'হাগিং ফেস ডেটাসেটে GLUE') },
      { label: b('Pretrained weights', 'প্রিট্রেইনড ওয়েট'), status: 'partial', note: b('RoBERTa yes; GPT-3 not public', 'RoBERTa আছে; GPT-3 পাবলিক নয়') },
    ],
    steps: [
      b('Fine-tune RoBERTa-base on SST-2 normally to get a baseline.', 'বেসলাইনের জন্য SST-2-এ সাধারণভাবে RoBERTa-base ফাইন-টিউন।'),
      b('Freeze the model; add LoRA to the query and value projections (r = 8).', 'মডেল ফ্রিজ; কোয়েরি ও ভ্যালু প্রজেকশনে লোরা যোগ (r = ৮)।'),
      b('Train only the LoRA parameters; count and log them.', 'শুধু লোরা প্যারামিটার ট্রেন; সংখ্যা গুনে লগ করুন।'),
      b('Repeat with r = 1, 2, 4, 64 to recreate the rank ablation.', 'র‍্যাঙ্ক অ্যাবলেশনের জন্য r = ১, ২, ৪, ৬৪ দিয়ে আবার চালান।'),
      b('Merge B·A into W and confirm inference speed is unchanged.', 'B·A-কে W-তে মিশিয়ে দেখুন ইনফারেন্স গতি একই।'),
    ],
    evaluation: [
      b('Compare SST-2 accuracy: full fine-tuning vs LoRA (paper: within ~0.5%).', 'SST-2 অ্যাকুরেসি তুলনা: পূর্ণ ফাইন-টিউন বনাম লোরা (পেপার: ~০.৫%-এর মধ্যে)।'),
      b('Report trainable parameters and peak GPU memory for both.', 'দুটোর ট্রেনযোগ্য প্যারামিটার ও সর্বোচ্চ জিপিইউ মেমরি জানান।'),
      b('Run 3 seeds; report mean and spread.', '৩টি সিডে চালিয়ে গড় ও বিস্তার জানান।'),
    ],
    blockers: [
      { label: b('GPT-3 results cannot be reproduced', 'GPT-3-এর ফল রিপ্রোডিউস সম্ভব নয়'), fix: b('Use an open model (e.g. a 1B Llama-family model) and say so in your write-up.', 'খোলা মডেল (যেমন ১বি লামা-পরিবার) ব্যবহার করে লেখায় তা উল্লেখ করুন।') },
      { label: b('Learning rate is sensitive', 'লার্নিং রেট সংবেদনশীল'), fix: b('LoRA usually needs a higher LR than full fine-tuning; sweep 1e-4 to 1e-3.', 'লোরায় সাধারণত বেশি LR লাগে; ১e-৪ থেকে ১e-৩ পর্যন্ত দেখুন।') },
    ],
    prereqs: ['selfatt', 'finetune'],
  },
  p1: {
    paper: 'p1',
    summary: b('Implement a small Transformer and train it on a toy translation task before attempting WMT.', 'WMT-এর আগে খেলনা অনুবাদ কাজে ছোট ট্রান্সফর্মার বানিয়ে ট্রেন করুন।'),
    compute: b('Toy task: minutes on a laptop CPU. Base model on WMT14: ~12 hours on 8 GPUs.', 'খেলনা কাজ: ল্যাপটপ সিপিইউতে কয়েক মিনিট। WMT14-এ বেস মডেল: ৮ জিপিইউতে ~১২ ঘণ্টা।'),
    availability: [
      { label: b('Official code', 'অফিশিয়াল কোড'), status: 'yes', note: b('tensor2tensor (archived)', 'tensor2tensor (আর্কাইভড)') },
      { label: b('Community reference', 'কমিউনিটি রেফারেন্স'), status: 'yes', note: b('The Annotated Transformer (PyTorch)', 'The Annotated Transformer (পাইটর্চ)') },
      { label: b('Datasets', 'ডেটাসেট'), status: 'yes', note: b('WMT14 En–De via Hugging Face', 'হাগিং ফেসে WMT14 En–De') },
    ],
    steps: [
      b('Implement scaled dot-product attention and test it on random tensors.', 'স্কেলড ডট-প্রোডাক্ট অ্যাটেনশন লিখে র‍্যান্ডম টেনসরে পরীক্ষা।'),
      b('Add multi-head attention, feed-forward block, residuals and layer norm.', 'মাল্টি-হেড, ফিড-ফরওয়ার্ড, রেসিডুয়াল ও লেয়ার নর্ম যোগ।'),
      b('Add sinusoidal positional encoding.', 'সাইনুসয়েডাল পজিশনাল এনকোডিং যোগ।'),
      b('Train on a copy/reverse toy task to check the model can learn.', 'কপি/উল্টো খেলনা কাজে ট্রেন করে দেখুন মডেল শিখছে।'),
      b('Train a small model on a subset of WMT14 with the warmup learning-rate schedule.', 'ওয়ার্মআপ LR শিডিউলসহ WMT14-এর অংশে ছোট মডেল ট্রেন।'),
    ],
    evaluation: [
      b('Toy task: near 100% accuracy.', 'খেলনা কাজ: প্রায় ১০০% অ্যাকুরেসি।'),
      b('WMT subset: report BLEU with sacreBLEU; do not expect 28.4 at small scale.', 'WMT অংশ: sacreBLEU দিয়ে BLEU; ছোট স্কেলে ২৮.৪ আশা করবেন না।'),
    ],
    blockers: [
      { label: b('Training diverges early', 'শুরুতেই ট্রেনিং বিগড়ে যায়'), fix: b('Use the paper’s warmup schedule and label smoothing 0.1.', 'পেপারের ওয়ার্মআপ শিডিউল ও লেবেল স্মুথিং ০.১ ব্যবহার করুন।') },
      { label: b('Masking bugs', 'মাস্কিং বাগ'), fix: b('Unit-test that the decoder cannot see future tokens.', 'ডিকোডার ভবিষ্যৎ টোকেন দেখছে না, তা ইউনিট টেস্ট করুন।') },
    ],
    prereqs: ['selfatt', 'embed'],
  },
  p9: {
    paper: 'p9',
    summary: b('Train a ~5M-parameter model on TinyStories and grade its stories.', 'টাইনিস্টোরিজে ~৫এম প্যারামিটারের মডেল ট্রেন করে গল্প যাচাই করুন।'),
    compute: b('~2–3 hours on a free Colab T4 for a 5M model.', '৫এম মডেলে ফ্রি কোলাব T4-এ ~২–৩ ঘণ্টা।'),
    availability: [
      { label: b('Dataset', 'ডেটাসেট'), status: 'yes', note: b('roneneldan/TinyStories on Hugging Face', 'হাগিং ফেসে roneneldan/TinyStories') },
      { label: b('Official training code', 'অফিশিয়াল ট্রেনিং কোড'), status: 'partial', note: b('Model weights released; training script not', 'মডেল ওয়েট প্রকাশিত; ট্রেনিং স্ক্রিপ্ট নয়') },
      { label: b('Evaluation prompts', 'মূল্যায়ন প্রম্পট'), status: 'partial', note: b('Described in the paper; not as a package', 'পেপারে বর্ণিত; প্যাকেজ হিসেবে নয়') },
    ],
    steps: [
      b('Download TinyStories and train a byte-level BPE tokenizer (vocab ~10K).', 'টাইনিস্টোরিজ নামিয়ে বাইট-লেভেল BPE টোকেনাইজার (~১০কে) ট্রেন।'),
      b('Configure a GPT-style model with 8 layers, width 256.', '৮ লেয়ার, প্রস্থ ২৫৬-এর জিপিটি-ধরনের মডেল সাজান।'),
      b('Train for 1–2 epochs; save checkpoints every 1,000 steps.', '১–২ ইপক ট্রেন; প্রতি ১,০০০ ধাপে চেকপয়েন্ট।'),
      b('Generate stories from the paper’s example prompts.', 'পেপারের উদাহরণ প্রম্পট থেকে গল্প তৈরি।'),
    ],
    evaluation: [
      b('Grade grammar, consistency and creativity with a rubric (human or model).', 'রুব্রিক দিয়ে ব্যাকরণ, সামঞ্জস্য ও সৃজনশীলতা যাচাই (মানুষ বা মডেল)।'),
      b('Compare against the released 8M checkpoint.', 'প্রকাশিত ৮এম চেকপয়েন্টের সাথে তুলনা।'),
    ],
    blockers: [
      { label: b('Model-graded evaluation costs money', 'মডেল দিয়ে গ্রেডিংয়ে খরচ আছে'), fix: b('Grade 50 stories by hand with two classmates instead.', 'বদলে দুজন সহপাঠীর সাথে ৫০টি গল্প হাতে যাচাই করুন।') },
    ],
    prereqs: ['tokens', 'pretrain'],
  },
};

/* ---------------- job pipelines (simulated) ---------------- */
export const JOB_STEPS: Record<ToolId, L[]> = {
  landscape: [
    b('Searching OpenAlex', 'OpenAlex-এ খোঁজা হচ্ছে'),
    b('Ranking by relevance and citations', 'প্রাসঙ্গিকতা ও সাইটেশনে সাজানো'),
    b('Fetching citation links from Semantic Scholar', 'Semantic Scholar থেকে সাইটেশন সংযোগ'),
    b('Grouping papers into themes', 'পেপারগুলোকে থিমে ভাগ'),
    b('Explaining links and open questions', 'সংযোগ ও খোলা প্রশ্ন ব্যাখ্যা'),
    b('Saving your map', 'আপনার ম্যাপ সেভ হচ্ছে'),
  ],
  compare: [
    b('Loading paper details', 'পেপারের তথ্য লোড'),
    b('Reading methods and results sections', 'পদ্ধতি ও ফলাফল অংশ পড়া'),
    b('Extracting comparable fields with a small model', 'ছোট মডেলে তুলনীয় তথ্য বের করা'),
    b('Checking which results are comparable', 'কোন ফলগুলো তুলনীয় যাচাই'),
    b('Saving your matrix', 'আপনার ম্যাট্রিক্স সেভ হচ্ছে'),
  ],
  claim: [
    b('Locating the claim in the paper', 'পেপারে দাবিটি খোঁজা'),
    b('Reading the cited experiments', 'উল্লেখিত পরীক্ষাগুলো পড়া'),
    b('Checking OpenReview for reviewer notes', 'OpenReview-এ রিভিউয়ারের মন্তব্য দেখা'),
    b('Separating evidence, assumptions and gaps', 'প্রমাণ, অনুমান ও ফাঁক আলাদা করা'),
    b('Saving your check', 'আপনার যাচাই সেভ হচ্ছে'),
  ],
  roadmap: [
    b('Reading the method and appendix', 'পদ্ধতি ও পরিশিষ্ট পড়া'),
    b('Checking linked code and datasets', 'সংযুক্ত কোড ও ডেটাসেট যাচাই'),
    b('Estimating compute', 'কম্পিউট অনুমান'),
    b('Drafting steps and evaluation plan', 'ধাপ ও মূল্যায়ন পরিকল্পনা খসড়া'),
    b('Saving your roadmap', 'আপনার রোডম্যাপ সেভ হচ্ছে'),
  ],
};

/* Admin: cost monitoring (simulated, USD) */
export const COSTS = {
  budget: 300,
  spent: 182.4,
  cardsGenerated: 18,
  cardOpens: 48210,
  perTool: [
    { tool: 'landscape' as ToolId, runs: 412, avg: 0.06, max: 0.19, cacheHits: 0.38 },
    { tool: 'compare' as ToolId, runs: 638, avg: 0.09, max: 0.31, cacheHits: 0.21 },
    { tool: 'claim' as ToolId, runs: 529, avg: 0.04, max: 0.12, cacheHits: 0.17 },
    { tool: 'roadmap' as ToolId, runs: 171, avg: 0.11, max: 0.28, cacheHits: 0.44 },
  ],
};
