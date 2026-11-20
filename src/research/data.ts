/* Research v2 — simulated data. Real AI/ML papers; citation counts, licenses,
   reviews, upvotes and AI outputs are illustrative only. */
import type { Comment, Paper, SceneKind, TopicId } from '../data';

/** Bilingual string (always both languages). */
export type L = { en: string; bn: string };

export const b = (en: string, bn: string): L => ({ en, bn });

export type SourceId = 'openalex' | 's2' | 'hf' | 'openreview';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ToolId = 'readmap' | 'landscape' | 'compare' | 'claim' | 'roadmap';
export type Plan = 'free' | 'premium';

export const SOURCE_LABEL: Record<SourceId, string> = {
  openalex: 'OpenAlex', s2: 'Semantic Scholar', hf: 'Hugging Face', openreview: 'OpenReview',
};

/* ---------------- extra papers in the curated collection ---------------- */

const P = (id: string, title: string, source: string, authors: string, year: number, topic: TopicId, scene: SceneKind | undefined, arxiv: string, problem: L, keyIdea: L, takeaway: L, readMin = 4, saves = 900): Paper => ({
  id, title, source, authors, year, topic, creatorId: 'doshomik', problem, keyIdea, takeaway, scene, url: `https://arxiv.org/abs/${arxiv}`, readMin, saves, lang: 'mixed',
});

export const NEW_PAPERS: Paper[] = [
  P('p7', 'BERT: Pre-training of Deep Bidirectional Transformers', 'NAACL 2019', 'Devlin et al.', 2019, 'tf', 'tokens', '1810.04805',
    b('Language models read text in one direction only.', 'ল্যাঙ্গুয়েজ মডেল শুধু এক দিকে টেক্সট পড়ে।'),
    b('Hide random words and train the model to guess them from both sides.', 'এলোমেলো শব্দ লুকিয়ে দুই দিকের প্রসঙ্গ দেখে অনুমান করতে শেখানো।'),
    b('One pretrained model, fine-tuned for many tasks.', 'একটি প্রিট্রেইনড মডেল, অনেক কাজে ফাইন-টিউন।')),
  P('p8', 'Language Models are Few-Shot Learners (GPT-3)', 'NeurIPS 2020', 'Brown et al.', 2020, 'llm', 'tokens', '2005.14165',
    b('Every new task needs its own labeled dataset and fine-tuning.', 'প্রতিটি নতুন কাজে আলাদা লেবেল করা ডেটা ও ফাইন-টিউনিং লাগে।'),
    b('Scale a language model to 175B parameters and give examples in the prompt.', 'মডেলকে ১৭৫বি প্যারামিটারে বড় করে প্রম্পটেই উদাহরণ দেওয়া।'),
    b('Large models can learn a task from a few examples, with no weight updates.', 'বড় মডেল কয়েকটি উদাহরণ দেখেই কাজ শিখতে পারে, ওয়েট না বদলিয়ে।'), 5, 2400),
  P('p9', 'TinyStories: How Small Can Language Models Be?', 'arXiv 2023', 'Eldan, Li', 2023, 'llm', 'tokens', '2305.07759',
    b('Small models write incoherent text. Is size the only fix?', 'ছোট মডেল অসংলগ্ন লেখে। আকারই কি একমাত্র সমাধান?'),
    b('Train tiny models on simple stories that a 3–4 year old could understand.', '৩–৪ বছরের শিশু বোঝে এমন সহজ গল্পে ছোট মডেল ট্রেন করা।'),
    b('Models under 10M parameters can write fluent, consistent stories.', '১০ মিলিয়নের কম প্যারামিটারের মডেলও সাবলীল গল্প লিখতে পারে।'), 3, 1300),
  P('p10', 'Textbooks Are All You Need (phi-1)', 'arXiv 2023', 'Gunasekar et al.', 2023, 'llm', 'scaling', '2306.11644',
    b('Code models get better mostly by getting bigger.', 'কোড মডেল মূলত বড় হয়েই ভালো হয়।'),
    b('Train a 1.3B model on filtered, textbook-quality code and synthetic exercises.', 'বাছাই করা “পাঠ্যবই মানের” কোড ও সিনথেটিক অনুশীলনে ১.৩বি মডেল ট্রেন।'),
    b('Data quality can substitute for a lot of scale.', 'ভালো ডেটা অনেকখানি আকারের বিকল্প হতে পারে।'), 4, 1100),
  P('p11', 'Training Compute-Optimal Large Language Models (Chinchilla)', 'NeurIPS 2022', 'Hoffmann et al.', 2022, 'research', 'scaling', '2203.15556',
    b('For a fixed compute budget, how big should the model be?', 'নির্দিষ্ট কম্পিউট বাজেটে মডেল কত বড় হওয়া উচিত?'),
    b('Grow parameters and training tokens at the same rate.', 'প্যারামিটার আর ট্রেনিং টোকেন সমান হারে বাড়ানো।'),
    b('A 70B model on 1.4T tokens beats much larger models.', '১.৪ট্রিলিয়ন টোকেনে ৭০বি মডেল অনেক বড় মডেলকে হারায়।'), 4, 1500),
  P('p12', 'QLoRA: Efficient Finetuning of Quantized LLMs', 'NeurIPS 2023', 'Dettmers et al.', 2023, 'llm', 'lora', '2305.14314',
    b('Fine-tuning a 65B model needs many expensive GPUs.', '৬৫বি মডেল ফাইন-টিউনে অনেক দামি জিপিইউ লাগে।'),
    b('Freeze a 4-bit quantized model and train LoRA adapters on top.', '৪-বিট কোয়ান্টাইজড মডেল ফ্রিজ করে উপরে লোরা অ্যাডাপ্টার ট্রেন।'),
    b('65B fine-tuning on a single 48GB GPU.', 'একটি ৪৮জিবি জিপিইউতে ৬৫বি ফাইন-টিউনিং।'), 4, 2100),
  P('p13', 'DistilBERT: A Distilled Version of BERT', 'arXiv 2019', 'Sanh et al.', 2019, 'tf', 'dense', '1910.01108',
    b('BERT is too large and slow for phones and small servers.', 'বার্ট ফোন ও ছোট সার্ভারের জন্য বড় ও ধীর।'),
    b('Train a smaller student model to imitate BERT during pretraining.', 'প্রিট্রেনিংয়ে ছোট “ছাত্র” মডেলকে বার্টের অনুকরণ করতে শেখানো।'),
    b('40% smaller, 60% faster, keeps 97% of the performance.', '৪০% ছোট, ৬০% দ্রুত, ৯৭% পারফরম্যান্স বজায়।'), 3, 800),
  P('p14', 'MobileLLM: Sub-billion Parameter Models for On-Device Use', 'ICML 2024', 'Liu et al.', 2024, 'llm', 'neural', '2402.14905',
    b('Phones cannot run multi-billion parameter models well.', 'ফোনে বহু-বিলিয়ন প্যারামিটারের মডেল ভালো চলে না।'),
    b('For tiny models, architecture matters: go deep and thin, share weights.', 'ছোট মডেলে আর্কিটেকচারই মূল: গভীর ও সরু, ওয়েট শেয়ার।'),
    b('125M and 350M models beat earlier models of the same size.', '১২৫এম ও ৩৫০এম মডেল একই আকারের আগের মডেলকে হারায়।'), 4, 600),
  P('p15', 'Retrieval-Augmented Generation for Knowledge-Intensive NLP', 'NeurIPS 2020', 'Lewis et al.', 2020, 'llm', 'embed', '2005.11401',
    b('Models store facts in weights. Hard to update, easy to hallucinate.', 'মডেল ওয়েটে তথ্য রাখে। আপডেট কঠিন, ভুল তথ্য সহজ।'),
    b('Retrieve relevant Wikipedia passages, then generate an answer from them.', 'প্রাসঙ্গিক উইকিপিডিয়া অংশ খুঁজে, তা থেকে উত্তর তৈরি।'),
    b('Better open-domain QA, and knowledge you can swap out.', 'ভালো ওপেন-ডোমেইন প্রশ্নোত্তর, বদলানো যায় এমন জ্ঞান।'), 4, 1900),
  P('p16', 'Toolformer: Language Models Can Teach Themselves to Use Tools', 'NeurIPS 2023', 'Schick et al.', 2023, 'agents', 'agent', '2302.04761',
    b('LLMs are weak at arithmetic and fresh facts, which simple tools solve.', 'এলএলএম গণিত ও নতুন তথ্যে দুর্বল, যা সহজ টুল সমাধান করে।'),
    b('The model labels its own data with API calls and keeps only the helpful ones.', 'মডেল নিজেই ডেটায় এপিআই কল যোগ করে, শুধু উপকারীগুলো রাখে।'),
    b('A 6.7B model learns when to call a calculator, search, or translator.', '৬.৭বি মডেল শেখে কখন ক্যালকুলেটর, সার্চ বা অনুবাদক ডাকতে হয়।'), 4, 1200),
  P('p17', 'Training Language Models to Follow Instructions (InstructGPT)', 'NeurIPS 2022', 'Ouyang et al.', 2022, 'llm', 'cot', '2203.02155',
    b('Bigger models are not automatically more helpful or truthful.', 'বড় মডেল আপনা থেকেই বেশি সহায়ক বা সত্যবাদী হয় না।'),
    b('Fine-tune with human demonstrations, then with a reward model (RLHF).', 'মানুষের উদাহরণে ফাইন-টিউন, তারপর রিওয়ার্ড মডেল দিয়ে (আরএলএইচএফ)।'),
    b('People preferred a 1.3B InstructGPT over 175B GPT-3.', 'মানুষ ১৭৫বি জিপিটি-৩-এর চেয়ে ১.৩বি ইনস্ট্রাক্টজিপিটি পছন্দ করেছে।'), 5, 2000),
  P('p18', 'An Image is Worth 16x16 Words (ViT)', 'ICLR 2021', 'Dosovitskiy et al.', 2021, 'dl', 'conv', '2010.11929',
    b('Vision relied on CNNs. Do images need convolutions?', 'ভিশন সিএনএন-নির্ভর। ছবিতে কি কনভোলিউশন লাগবেই?'),
    b('Cut an image into 16×16 patches and feed them to a plain Transformer.', 'ছবিকে ১৬×১৬ টুকরো করে সাধারণ ট্রান্সফর্মারে দেওয়া।'),
    b('With enough pretraining data, Transformers match or beat CNNs.', 'যথেষ্ট প্রিট্রেনিং ডেটায় ট্রান্সফর্মার সিএনএন-এর সমান বা ভালো।'), 4, 1700),
];

/* ---------------- per-paper research extras ---------------- */

export interface Figure { n: number; scene: SceneKind; caption: L; q: L; options: L[]; answer: number; explain: L }
export type PrereqLink =
  | { kind: 'lesson'; course: string; lesson: string; min: number }
  | { kind: 'reel'; id: string; sec: number }
  | { kind: 'quiz'; id: string; n: number }
  | { kind: 'note'; id: string; min: number };
export interface Prereq { id: string; label: L; why: L; link: PrereqLink }
export interface Review { id: string; rating: number; label: L; confidence: number; summary: L; strengths: L[]; weaknesses: L[] }
export interface Extract { t: L; ref: string }
export interface PaperX {
  question: L;
  findings: L[];
  limitations: L[];
  glossary: { term: string; def: L }[];
  difficulty: Difficulty;
  citations: number;
  hf?: number;
  trend?: number;
  isNew?: boolean;
  sources: SourceId[];
  license: { label: string; reuse: boolean };
  generated: string;
  checkedBy?: string;
  figures: Figure[];
  prereqs: Prereq[];
  buildsOn: string[];
  builtBy: string[];
  review?: { venue: string; decision: L; reviews: Review[] };
  discussion: Comment[];
  claims?: Claim[];
  roadmap?: boolean;
  code?: { repo: string; official: boolean };
  extract: { method: Extract; data: Extract; result: (Extract & { bench: string }) | null; strengths: L; weaknesses: L };
}
export interface Claim {
  id: string;
  text: L;
  where: string;
  evidence: { ref: string; what: L; strength: 'strong' | 'partial' }[];
  assumptions: L[];
  notShown: L[];
  reviewer?: L;
}

const CC = { label: 'CC BY 4.0', reuse: true };
const ARX = { label: 'arXiv non-exclusive licence', reuse: false };

const pre = {
  neuron: { id: 'neuron', label: b('What a neuron computes', 'নিউরন কী হিসাব করে'), why: b('Every layer in the paper is built from these.', 'পেপারের প্রতিটি লেয়ার এ দিয়েই তৈরি।'), link: { kind: 'lesson', course: 'c1', lesson: 'c1-1', min: 8 } },
  backprop: { id: 'backprop', label: b('Backpropagation', 'ব্যাকপ্রপাগেশন'), why: b('Needed to follow how the model is trained.', 'মডেল কীভাবে ট্রেন হয় বুঝতে লাগবে।'), link: { kind: 'reel', id: 'r1', sec: 58 } },
  embed: { id: 'embed', label: b('Embeddings', 'এমবেডিং'), why: b('Words enter the model as vectors.', 'শব্দ ভেক্টর হিসেবে মডেলে ঢোকে।'), link: { kind: 'lesson', course: 'c6', lesson: 'c6-2', min: 9 } },
  selfatt: { id: 'selfatt', label: b('Self-attention: Q, K, V', 'সেলফ-অ্যাটেনশন: Q, K, V'), why: b('The core equation of the paper.', 'পেপারের মূল সমীকরণ।'), link: { kind: 'lesson', course: 'c3', lesson: 'c3-2', min: 15 } },
  attquiz: { id: 'attquiz', label: b('Check yourself: attention', 'নিজেকে যাচাই: অ্যাটেনশন'), why: b('Four quick questions before you start.', 'শুরুর আগে চারটি ছোট প্রশ্ন।'), link: { kind: 'quiz', id: 'q-tf1', n: 4 } },
  tokens: { id: 'tokens', label: b('Tokenization', 'টোকেনাইজেশন'), why: b('Model size and data are counted in tokens.', 'মডেল ও ডেটার হিসাব টোকেনে।'), link: { kind: 'lesson', course: 'c6', lesson: 'c6-1', min: 10 } },
  pretrain: { id: 'pretrain', label: b('Pretraining', 'প্রিট্রেনিং'), why: b('LoRA adapts an already pretrained model.', 'লোরা আগে থেকে প্রিট্রেইনড মডেলকে মানিয়ে নেয়।'), link: { kind: 'lesson', course: 'c6', lesson: 'c6-3', min: 14 } },
  finetune: { id: 'finetune', label: b('Fine-tuning with LoRA (lesson)', 'লোরা দিয়ে ফাইন-টিউনিং (লেসন)'), why: b('A gentle walkthrough of the same idea.', 'একই ধারণার সহজ ব্যাখ্যা।'), link: { kind: 'lesson', course: 'c6', lesson: 'c6-4', min: 16 } },
  llmquiz: { id: 'llmquiz', label: b('Check yourself: tokens and prompts', 'নিজেকে যাচাই: টোকেন ও প্রম্পট'), why: b('Three quick questions.', 'তিনটি ছোট প্রশ্ন।'), link: { kind: 'quiz', id: 'q-llm1', n: 3 } },
  prompting: { id: 'prompting', label: b('Prompting patterns', 'প্রম্পটিং প্যাটার্ন'), why: b('Chain-of-thought is a prompting technique.', 'চেইন-অফ-থট একটি প্রম্পটিং কৌশল।'), link: { kind: 'lesson', course: 'c6', lesson: 'c6-6', min: 8 } },
  agent: { id: 'agent', label: b('The agent loop', 'এজেন্ট লুপ'), why: b('ReAct is a version of this loop.', 'রিঅ্যাক্ট এই লুপেরই একটি রূপ।'), link: { kind: 'reel', id: 'r4', sec: 41 } },
  tools: { id: 'tools', label: b('Tool calling basics', 'টুল কলিং বেসিক'), why: b('How a model asks the app to run a tool.', 'মডেল কীভাবে অ্যাপকে টুল চালাতে বলে।'), link: { kind: 'note', id: 'n3', min: 3 } },
  diffusion: { id: 'diffusion', label: b('Diffusion models', 'ডিফিউশন মডেল'), why: b('Background for the noise schedule.', 'নয়েজ শিডিউলের পটভূমি।'), link: { kind: 'lesson', course: 'c5', lesson: 'c5-4', min: 15 } },
  gd: { id: 'gd', label: b('Gradient descent', 'গ্রেডিয়েন্ট ডিসেন্ট'), why: b('Loss curves only make sense with this.', 'এটা ছাড়া লস কার্ভ বোঝা কঠিন।'), link: { kind: 'reel', id: 'r3', sec: 52 } },
  cnn: { id: 'cnn', label: b('CNNs', 'সিএনএন'), why: b('ViT is compared against CNNs throughout.', 'পুরো পেপারে ভিআইটিকে সিএনএন-এর সাথে তুলনা করা হয়।'), link: { kind: 'lesson', course: 'c7', lesson: 'c7-3', min: 15 } },
} satisfies Record<string, Prereq>;

const disc = (...items: [string, string, string, string, number][]): Comment[] =>
  items.map(([who, en, bn, time, likes], i) => ({ id: `d${i}-${who}`, who, text: b(en, bn), time: b(time, time.replace(/\d+/g, (d) => d.replace(/[0-9]/g, (x) => '০১২৩৪৫৬৭৮৯'[+x])).replace('h', ' ঘ').replace('d', ' দি')), likes }));

export const PX: Record<string, PaperX> = {
  p1: {
    question: b('Can a model translate well without reading words one by one?', 'শব্দ একটি একটি করে না পড়েও কি মডেল ভালো অনুবাদ করতে পারে?'),
    findings: [
      b('Attention alone, with no recurrence, reached state-of-the-art translation quality.', 'রিকারেন্স ছাড়া শুধু অ্যাটেনশন দিয়েই সেরা অনুবাদ মান পাওয়া গেছে।'),
      b('Training was much faster because all positions are processed in parallel.', 'সব পজিশন একসাথে প্রসেস হওয়ায় ট্রেনিং অনেক দ্রুত।'),
      b('Multiple attention heads learn different relationships between words.', 'একাধিক অ্যাটেনশন হেড শব্দের ভিন্ন ভিন্ন সম্পর্ক শেখে।'),
    ],
    limitations: [
      b('Attention cost grows with the square of sequence length.', 'সিকোয়েন্স লম্বা হলে অ্যাটেনশনের খরচ বর্গ হারে বাড়ে।'),
      b('Tested mainly on translation (plus one parsing task).', 'মূলত অনুবাদে যাচাই করা (সাথে একটি পার্সিং কাজ)।'),
    ],
    glossary: [
      { term: 'Self-attention', def: b('Each word scores how much to look at every other word.', 'প্রতিটি শব্দ হিসাব করে অন্য প্রতিটি শব্দকে কতটা দেখবে।') },
      { term: 'Multi-head', def: b('Several attention layers run side by side, each with its own focus.', 'কয়েকটি অ্যাটেনশন পাশাপাশি চলে, প্রতিটির আলাদা মনোযোগ।') },
      { term: 'Positional encoding', def: b('Extra signal that tells the model word order.', 'বাড়তি সংকেত যা মডেলকে শব্দের ক্রম জানায়।') },
      { term: 'BLEU', def: b('A score for how close a translation is to human references.', 'অনুবাদ মানুষের অনুবাদের কত কাছাকাছি, তার স্কোর।') },
    ],
    difficulty: 'intermediate', citations: 152000, hf: 412, trend: 3, sources: ['openalex', 's2', 'hf'], license: CC, generated: 'Nov 2', checkedBy: 'farhana',
    figures: [
      { n: 1, scene: 'attention', caption: b('Attention weights between words in one sentence', 'একটি বাক্যে শব্দগুলোর মধ্যে অ্যাটেনশন ওয়েট'),
        q: b('A darker cell means the row word…', 'গাঢ় ঘর মানে সারির শব্দটি…'),
        options: [b('looks more at the column word', 'কলামের শব্দকে বেশি দেখে'), b('appears more often', 'বেশিবার আসে'), b('is longer', 'বেশি লম্বা')], answer: 0,
        explain: b('Each row is a word asking “who should I attend to?”. Darker cells get more weight. Notice “sat” looks strongly at “cat”: the verb finds its subject.', 'প্রতিটি সারি একটি শব্দ, যে জানতে চায় “কাকে দেখব?”। গাঢ় ঘরের ওয়েট বেশি। দেখুন “sat” শব্দটি “cat”-কে বেশি দেখে: ক্রিয়া তার কর্তাকে খুঁজে পায়।') },
      { n: 2, scene: 'softmax', caption: b('Softmax turns raw scores into weights', 'সফটম্যাক্স কাঁচা স্কোরকে ওয়েটে রূপ দেয়'),
        q: b('After softmax, the weights in one row add up to…', 'সফটম্যাক্সের পর এক সারির ওয়েটের যোগফল…'),
        options: [b('0', '০'), b('1', '১'), b('the number of words', 'শব্দের সংখ্যা')], answer: 1,
        explain: b('Softmax makes every weight positive and the row sum exactly 1, so attention is a weighted average. The paper divides scores by √dₖ first so softmax does not saturate.', 'সফটম্যাক্স প্রতিটি ওয়েট ধনাত্মক করে এবং সারির যোগফল ঠিক ১ করে, তাই অ্যাটেনশন একটি ওয়েটেড গড়। স্যাচুরেশন এড়াতে পেপারে আগে √dₖ দিয়ে ভাগ করা হয়।') },
      { n: 3, scene: 'embed', caption: b('Tokens become vectors before attention', 'অ্যাটেনশনের আগে টোকেন ভেক্টর হয়'),
        q: b('Why add positional encodings to these vectors?', 'এই ভেক্টরে পজিশনাল এনকোডিং কেন যোগ করা হয়?'),
        options: [b('To make them shorter', 'ছোট করতে'), b('Attention alone ignores word order', 'শুধু অ্যাটেনশন শব্দের ক্রম বোঝে না'), b('To remove noise', 'নয়েজ সরাতে')], answer: 1,
        explain: b('Attention treats input as a set. Without position signals “dog bites man” and “man bites dog” look identical. Sine and cosine waves of different frequencies encode each position.', 'অ্যাটেনশন ইনপুটকে একটি সেট হিসেবে দেখে। পজিশন ছাড়া “dog bites man” আর “man bites dog” একই দেখায়। ভিন্ন ফ্রিকোয়েন্সির সাইন-কোসাইন তরঙ্গ প্রতিটি অবস্থান চিহ্নিত করে।') },
    ],
    prereqs: [pre.neuron, pre.embed, pre.selfatt, pre.attquiz],
    buildsOn: [], builtBy: ['p7', 'p8', 'p18', 'p5'],
    discussion: disc(
      ['tanvir', 'Figure 2 finally made multi-head click for me. Each head is its own small attention.', 'ফিগার ২ দেখে মাল্টি-হেড বুঝলাম। প্রতিটি হেড আলাদা ছোট অ্যাটেনশন।', '3h', 42],
      ['sadia', 'Tip: read §3.2 with the Q, K, V note open side by side.', 'টিপস: §৩.২ পড়ার সময় Q, K, V নোট পাশে খোলা রাখুন।', '1d', 31],
      ['rafi', 'Why did they pick sinusoids instead of learned positions?', 'শেখা পজিশনের বদলে সাইনুসয়েড কেন বেছে নিল?', '2d', 12],
    ),
    claims: [
      { id: 'p1c1', where: 'Abstract, §6.1', text: b('The Transformer achieves better translation quality than previous models while requiring significantly less training time.', 'ট্রান্সফর্মার আগের মডেলের চেয়ে ভালো অনুবাদ দেয় এবং অনেক কম ট্রেনিং সময় লাগে।'),
        evidence: [
          { ref: 'Table 2', what: b('28.4 BLEU on WMT14 English–German and 41.8 on English–French, above the best previous single models and ensembles.', 'WMT14 ইংরেজি–জার্মানে ২৮.৪ ও ইংরেজি–ফরাসিতে ৪১.৮ BLEU, আগের সেরা একক মডেল ও এনসেম্বলের চেয়ে বেশি।'), strength: 'strong' },
          { ref: 'Table 2, cost column', what: b('Training cost in FLOPs is a fraction of the compared models.', 'তুলনাকৃত মডেলের তুলনায় FLOPs-এ ট্রেনিং খরচ অনেক কম।'), strength: 'strong' },
          { ref: '§5.2', what: b('Big model trained 3.5 days on 8 P100 GPUs.', 'বড় মডেল ৮টি P100 জিপিইউতে ৩.৫ দিন ট্রেন করা।'), strength: 'partial' },
        ],
        assumptions: [
          b('BLEU is a fair proxy for translation quality.', 'BLEU অনুবাদ মানের ন্যায্য মাপকাঠি।'),
          b('FLOP estimates for older models are comparable to the authors’ own estimates.', 'পুরনো মডেলের FLOP অনুমান লেখকদের নিজস্ব অনুমানের সাথে তুলনীয়।'),
        ],
        notShown: [
          b('No human evaluation of translation quality.', 'অনুবাদ মানের কোনো মানব মূল্যায়ন নেই।'),
          b('Only two language pairs; low-resource languages such as Bangla were not tested.', 'মাত্র দুটি ভাষা-জোড়া; বাংলার মতো কম-রিসোর্সের ভাষা যাচাই হয়নি।'),
        ] },
      { id: 'p1c2', where: '§6.2, Table 3', text: b('Multi-head attention is better than a single attention head.', 'একক অ্যাটেনশন হেডের চেয়ে মাল্টি-হেড ভালো।'),
        evidence: [
          { ref: 'Table 3, rows (A)', what: b('Single-head is 0.9 BLEU worse than the best setting; too many heads also hurts.', 'একক হেড সেরা সেটিংয়ের চেয়ে ০.৯ BLEU কম; বেশি হেডও ক্ষতি করে।'), strength: 'partial' },
        ],
        assumptions: [b('Results on the development set generalize to the test set.', 'ডেভেলপমেন্ট সেটের ফল টেস্ট সেটেও প্রযোজ্য।')],
        notShown: [b('Single runs per setting; no variance across random seeds is reported.', 'প্রতি সেটিংয়ে একটি রান; র‍্যান্ডম সিড ভেদে পার্থক্য দেখানো হয়নি।')] },
    ],
    roadmap: true, code: { repo: 'github.com/tensorflow/tensor2tensor', official: true },
    extract: {
      method: { t: b('Encoder–decoder built only from multi-head self-attention and feed-forward layers.', 'শুধু মাল্টি-হেড সেলফ-অ্যাটেনশন ও ফিড-ফরওয়ার্ড লেয়ারে এনকোডার–ডিকোডার।'), ref: '§3' },
      data: { t: b('WMT 2014 English–German (4.5M pairs) and English–French (36M).', 'WMT 2014 ইংরেজি–জার্মান (৪৫ লাখ জোড়া) ও ইংরেজি–ফরাসি (৩.৬ কোটি)।'), ref: '§5.1' },
      result: { t: b('28.4 BLEU on WMT14 En–De', 'WMT14 En–De-তে ২৮.৪ BLEU'), ref: 'Table 2', bench: 'wmt14' },
      strengths: b('Highly parallel, fast to train, simple building blocks.', 'অত্যন্ত প্যারালেল, দ্রুত ট্রেন, সরল উপাদান।'),
      weaknesses: b('Quadratic memory in sequence length.', 'সিকোয়েন্সের দৈর্ঘ্যে বর্গাকার মেমরি।'),
    },
  },
  p5: {
    question: b('Can we adapt a huge model by training only a tiny number of new weights?', 'খুব অল্প নতুন ওয়েট ট্রেন করে কি বিশাল মডেলকে মানিয়ে নেওয়া যায়?'),
    findings: [
      b('Training small low-rank matrices matches full fine-tuning on GPT-3 175B.', 'ছোট লো-র‍্যাঙ্ক ম্যাট্রিক্স ট্রেন করেই জিপিটি-৩ ১৭৫বি-তে পূর্ণ ফাইন-টিউনিংয়ের সমান ফল।'),
      b('Up to 10,000× fewer trainable parameters and 3× less GPU memory.', '১০,০০০ গুণ পর্যন্ত কম ট্রেনযোগ্য প্যারামিটার, ৩ গুণ কম জিপিইউ মেমরি।'),
      b('No extra inference latency: the update can be merged into the weights.', 'ইনফারেন্সে বাড়তি দেরি নেই: আপডেট ওয়েটে মিশিয়ে দেওয়া যায়।'),
    ],
    limitations: [
      b('Which layers and which rank to use is still chosen by trial.', 'কোন লেয়ার ও কোন র‍্যাঙ্ক, তা এখনো পরীক্ষা করে বাছতে হয়।'),
      b('Mixing different tasks’ adapters in one batch is not straightforward.', 'এক ব্যাচে ভিন্ন কাজের অ্যাডাপ্টার মেশানো সহজ নয়।'),
    ],
    glossary: [
      { term: 'Rank', def: b('How many independent directions a matrix can express.', 'একটি ম্যাট্রিক্স কতগুলো স্বাধীন দিক প্রকাশ করতে পারে।') },
      { term: 'Adapter', def: b('A small trainable add-on to a frozen model.', 'ফ্রিজ করা মডেলে ছোট ট্রেনযোগ্য সংযোজন।') },
      { term: 'Frozen weights', def: b('Pretrained weights that are not updated during training.', 'প্রিট্রেইনড ওয়েট যা ট্রেনিংয়ে বদলানো হয় না।') },
    ],
    difficulty: 'intermediate', citations: 15400, hf: 286, trend: 2, sources: ['openalex', 's2', 'hf', 'openreview'], license: CC, generated: 'Oct 28', checkedBy: 'farhana',
    figures: [
      { n: 1, scene: 'lora', caption: b('The frozen weight W plus a low-rank update B·A', 'ফ্রিজ করা ওয়েট W ও লো-র‍্যাঙ্ক আপডেট B·A'),
        q: b('During LoRA training, which part changes?', 'লোরা ট্রেনিংয়ে কোন অংশ বদলায়?'),
        options: [b('W only', 'শুধু W'), b('A and B only', 'শুধু A ও B'), b('All of them', 'সবগুলো')], answer: 1,
        explain: b('W stays frozen. Only A (d×r) and B (r×d) learn. With r = 8 and d = 4096 that is about 65K numbers instead of 16.7M per matrix.', 'W ফ্রিজ থাকে। শুধু A (d×r) ও B (r×d) শেখে। r = ৮ ও d = ৪০৯৬ হলে প্রতি ম্যাট্রিক্সে ১ কোটি ৬৭ লাখের বদলে প্রায় ৬৫ হাজার সংখ্যা।') },
      { n: 2, scene: 'dense', caption: b('Where adapters are inserted in a Transformer layer', 'ট্রান্সফর্মার লেয়ারে অ্যাডাপ্টার কোথায় বসে'),
        q: b('The paper found the best results when adapting…', 'পেপারে সেরা ফল এসেছে যখন মানিয়ে নেওয়া হয়…'),
        options: [b('only the feed-forward layers', 'শুধু ফিড-ফরওয়ার্ড লেয়ার'), b('the query and value projections', 'কোয়েরি ও ভ্যালু প্রজেকশন'), b('the embeddings', 'এমবেডিং')], answer: 1,
        explain: b('Spreading a small budget across Wq and Wv beat putting a larger rank on one matrix (Table 5). Rank as low as 1–4 already worked well.', 'ছোট বাজেট Wq ও Wv-তে ভাগ করা, একটিতে বড় র‍্যাঙ্ক দেওয়ার চেয়ে ভালো (টেবিল ৫)। র‍্যাঙ্ক ১–৪ দিয়েই ভালো ফল।') },
    ],
    prereqs: [pre.selfatt, pre.pretrain, pre.finetune, pre.llmquiz],
    buildsOn: ['p1', 'p8'], builtBy: ['p12'],
    review: { venue: 'ICLR 2022', decision: b('Accepted', 'গৃহীত'), reviews: [
      { id: 'r1', rating: 8, label: b('Accept, good paper', 'গ্রহণযোগ্য, ভালো পেপার'), confidence: 4,
        summary: b('A simple, practical method for parameter-efficient adaptation with strong results at GPT-3 scale.', 'জিপিটি-৩ স্কেলে শক্তিশালী ফলসহ প্যারামিটার-সাশ্রয়ী মানিয়ে নেওয়ার সহজ, কার্যকর পদ্ধতি।'),
        strengths: [b('Clear motivation from intrinsic rank of updates.', 'আপডেটের অন্তর্নিহিত র‍্যাঙ্ক থেকে স্পষ্ট যুক্তি।'), b('No added inference latency.', 'ইনফারেন্সে বাড়তি দেরি নেই।')],
        weaknesses: [b('Limited theory for why low rank suffices.', 'লো র‍্যাঙ্ক কেন যথেষ্ট, তার তত্ত্ব সীমিত।')] },
      { id: 'r2', rating: 6, label: b('Marginally above threshold', 'সীমারেখার কিছুটা উপরে'), confidence: 3,
        summary: b('Useful contribution, but comparisons to adapter baselines could be broader.', 'উপকারী অবদান, তবে অ্যাডাপ্টার বেসলাইনের সাথে তুলনা আরও বিস্তৃত হতে পারত।'),
        strengths: [b('Thorough experiments across model sizes.', 'বিভিন্ন আকারের মডেলে বিস্তৃত পরীক্ষা।')],
        weaknesses: [b('Rank selection guidance is mostly empirical.', 'র‍্যাঙ্ক বাছাইয়ের নির্দেশনা মূলত পরীক্ষানির্ভর।'), b('Few results outside NLP.', 'এনএলপির বাইরে ফল কম।')] },
      { id: 'r3', rating: 8, label: b('Accept, good paper', 'গ্রহণযোগ্য, ভালো পেপার'), confidence: 4,
        summary: b('Well-executed and likely to be widely adopted.', 'ভালোভাবে করা, ব্যাপকভাবে ব্যবহৃত হওয়ার সম্ভাবনা।'),
        strengths: [b('Analysis of the learned update subspace is insightful.', 'শেখা আপডেট সাবস্পেসের বিশ্লেষণ অন্তর্দৃষ্টিপূর্ণ।')],
        weaknesses: [b('Memory savings depend on optimizer details.', 'মেমরি সাশ্রয় অপটিমাইজারের খুঁটিনাটির উপর নির্ভর করে।')] },
    ] },
    discussion: disc(
      ['farhana', 'Club this week: we reproduce Table 5 with a tiny model. Join if you have Colab.', 'এই সপ্তাহের ক্লাবে টেবিল ৫ ছোট মডেলে রিপ্রোডিউস করব। কোলাব থাকলে যোগ দিন।', '5h', 58],
      ['tanvir', 'r = 8 on a 125M model trains in ~10 min on a free T4.', '১২৫এম মডেলে r = ৮ ফ্রি T4-এ ~১০ মিনিটে ট্রেন হয়।', '1d', 37],
    ),
    claims: [
      { id: 'p5c1', where: 'Abstract, §5.5', text: b('LoRA performs on par or better than full fine-tuning on GPT-3 175B.', 'জিপিটি-৩ ১৭৫বি-তে লোরা পূর্ণ ফাইন-টিউনিংয়ের সমান বা ভালো।'),
        evidence: [
          { ref: 'Table 4', what: b('Matches or beats full fine-tuning on WikiSQL, MNLI-m and SAMSum.', 'WikiSQL, MNLI-m ও SAMSum-এ পূর্ণ ফাইন-টিউনিংয়ের সমান বা ভালো।'), strength: 'strong' },
          { ref: 'Figure 2', what: b('Accuracy stays stable as trainable parameters shrink, unlike prefix tuning.', 'ট্রেনযোগ্য প্যারামিটার কমলেও অ্যাকুরেসি স্থির, প্রিফিক্স টিউনিংয়ের মতো নয়।'), strength: 'partial' },
        ],
        assumptions: [
          b('Three tasks represent “fine-tuning” in general.', 'তিনটি কাজ সাধারণ ফাইন-টিউনিংয়ের প্রতিনিধি।'),
          b('Hyperparameters were tuned equally well for each method.', 'প্রতিটি পদ্ধতির হাইপারপ্যারামিটার সমানভাবে টিউন করা।'),
        ],
        notShown: [
          b('No variance across seeds for the 175B runs (too expensive).', '১৭৫বি রানে সিড ভেদে পার্থক্য দেখানো নেই (অতি ব্যয়বহুল)।'),
          b('Behaviour on tasks that need new knowledge, not just new format.', 'যে কাজে নতুন জ্ঞান লাগে, শুধু নতুন ফরম্যাট নয়, সেখানে আচরণ।'),
        ],
        reviewer: b('Reviewer 2 asked for broader adapter baselines; the authors added comparisons in the camera-ready.', 'রিভিউয়ার ২ আরও অ্যাডাপ্টার বেসলাইন চেয়েছিলেন; লেখকরা চূড়ান্ত সংস্করণে তুলনা যোগ করেন।') },
      { id: 'p5c2', where: '§7', text: b('The weight update needed for adaptation has a very low intrinsic rank.', 'মানিয়ে নিতে প্রয়োজনীয় ওয়েট আপডেটের অন্তর্নিহিত র‍্যাঙ্ক খুব কম।'),
        evidence: [
          { ref: 'Table 6', what: b('Rank 1–2 already performs close to rank 64 on WikiSQL and MNLI.', 'WikiSQL ও MNLI-তে র‍্যাঙ্ক ১–২ প্রায় র‍্যাঙ্ক ৬৪-এর কাছাকাছি।'), strength: 'strong' },
          { ref: 'Figure 3', what: b('Top singular directions of r = 8 and r = 64 updates overlap strongly.', 'r = ৮ ও r = ৬৪ আপডেটের প্রধান দিকগুলো অনেকটা মিলে যায়।'), strength: 'partial' },
        ],
        assumptions: [b('Findings on GPT-3 transfer to other model families.', 'জিপিটি-৩-এর ফল অন্য মডেল পরিবারেও প্রযোজ্য।')],
        notShown: [b('Why the rank is low (no theoretical proof).', 'র‍্যাঙ্ক কেন কম (তাত্ত্বিক প্রমাণ নেই)।')],
        reviewer: b('Reviewer 1 noted the theory is limited; the claim is empirical.', 'রিভিউয়ার ১ জানান তত্ত্ব সীমিত; দাবিটি পরীক্ষানির্ভর।') },
    ],
    roadmap: true, code: { repo: 'github.com/microsoft/LoRA', official: true },
    extract: {
      method: { t: b('Freeze pretrained weights; learn low-rank matrices B·A added to attention projections.', 'প্রিট্রেইনড ওয়েট ফ্রিজ; অ্যাটেনশন প্রজেকশনে যুক্ত লো-র‍্যাঙ্ক B·A শেখা।'), ref: '§4' },
      data: { t: b('GLUE with RoBERTa/DeBERTa; WikiSQL, MNLI, SAMSum with GPT-3.', 'RoBERTa/DeBERTa দিয়ে GLUE; GPT-3 দিয়ে WikiSQL, MNLI, SAMSum।'), ref: '§5' },
      result: { t: b('Matches full fine-tuning with 10,000× fewer trainable parameters', '১০,০০০ গুণ কম ট্রেনযোগ্য প্যারামিটারে পূর্ণ ফাইন-টিউনিংয়ের সমান'), ref: 'Table 4', bench: 'gpt3-tasks' },
      strengths: b('Tiny checkpoints per task; no inference overhead.', 'প্রতি কাজে ছোট চেকপয়েন্ট; ইনফারেন্সে বাড়তি খরচ নেই।'),
      weaknesses: b('Still needs the full model in GPU memory.', 'পুরো মডেল এখনো জিপিইউ মেমরিতে লাগে।'),
    },
  },
  p2: {
    question: b('Can showing worked steps in a prompt make an LLM reason better?', 'প্রম্পটে ধাপে ধাপে সমাধান দেখালে কি এলএলএম ভালো যুক্তি করে?'),
    findings: [
      b('Chain-of-thought exemplars boost math word problems by a large margin.', 'চেইন-অফ-থট উদাহরণ গণিতের শব্দ-সমস্যায় বড় উন্নতি আনে।'),
      b('The benefit appears only in very large models (about 100B parameters).', 'সুবিধা কেবল খুব বড় মডেলে (প্রায় ১০০বি প্যারামিটার) দেখা যায়।'),
    ],
    limitations: [
      b('Reasoning chains can look right but still reach wrong answers.', 'যুক্তির ধাপ সঠিক দেখালেও উত্তর ভুল হতে পারে।'),
      b('Gains at small scale are minimal or negative.', 'ছোট মডেলে উন্নতি প্রায় নেই বা নেতিবাচক।'),
    ],
    glossary: [
      { term: 'Exemplar', def: b('A worked example placed in the prompt.', 'প্রম্পটে রাখা একটি সমাধানসহ উদাহরণ।') },
      { term: 'GSM8K', def: b('A benchmark of grade-school math word problems.', 'প্রাথমিক স্তরের গণিত শব্দ-সমস্যার বেঞ্চমার্ক।') },
    ],
    difficulty: 'beginner', citations: 12600, hf: 198, sources: ['openalex', 's2', 'openreview'], license: CC, generated: 'Oct 30', checkedBy: 'arif',
    figures: [
      { n: 1, scene: 'cot', caption: b('Standard prompting vs chain-of-thought prompting', 'সাধারণ প্রম্পটিং বনাম চেইন-অফ-থট প্রম্পটিং'),
        q: b('What is different in the chain-of-thought prompt?', 'চেইন-অফ-থট প্রম্পটে কী আলাদা?'),
        options: [b('It has more questions', 'বেশি প্রশ্ন আছে'), b('The examples show intermediate steps', 'উদাহরণে মাঝের ধাপ দেখানো'), b('It uses a different model', 'অন্য মডেল ব্যবহার')], answer: 1,
        explain: b('Same model, same question. Only the few-shot examples change: they include the steps before the answer, so the model imitates that format.', 'একই মডেল, একই প্রশ্ন। শুধু উদাহরণ বদলায়: উত্তরের আগে ধাপগুলো থাকে, তাই মডেল সেই ধরন অনুকরণ করে।') },
      { n: 2, scene: 'scaling', caption: b('Solve rate vs model size', 'মডেলের আকার বনাম সমাধানের হার'),
        q: b('What does the curve suggest about small models?', 'ছোট মডেল সম্পর্কে কার্ভটি কী বলে?'),
        options: [b('They benefit the most', 'সবচেয়ে বেশি উপকৃত'), b('They benefit little', 'খুব কম উপকৃত'), b('They cannot be prompted', 'প্রম্পট করা যায় না')], answer: 1,
        explain: b('Chain-of-thought is an “emergent” ability here: flat for small models, then a sharp rise at large scale.', 'এখানে চেইন-অফ-থট একটি “উদীয়মান” সক্ষমতা: ছোট মডেলে সমতল, বড় স্কেলে হঠাৎ বৃদ্ধি।') },
    ],
    prereqs: [pre.tokens, pre.prompting, pre.llmquiz],
    buildsOn: ['p8'], builtBy: ['p4', 'p17'],
    review: { venue: 'NeurIPS 2022', decision: b('Accepted', 'গৃহীত'), reviews: [
      { id: 'r1', rating: 7, label: b('Accept', 'গ্রহণযোগ্য'), confidence: 4,
        summary: b('Simple prompting change with striking gains on reasoning benchmarks.', 'সহজ প্রম্পট পরিবর্তনে যুক্তির বেঞ্চমার্কে লক্ষণীয় উন্নতি।'),
        strengths: [b('Broad set of benchmarks and models.', 'বিস্তৃত বেঞ্চমার্ক ও মডেল।')],
        weaknesses: [b('Unclear whether chains reflect the model’s actual computation.', 'ধাপগুলো মডেলের আসল হিসাব প্রতিফলিত করে কিনা অস্পষ্ট।')] },
      { id: 'r2', rating: 6, label: b('Weak accept', 'দুর্বল গ্রহণযোগ্য'), confidence: 3,
        summary: b('Interesting empirical finding; requires very large proprietary models.', 'আকর্ষণীয় পর্যবেক্ষণ; খুব বড় বন্ধ মডেল প্রয়োজন।'),
        strengths: [b('Ablations on exemplar order and annotators.', 'উদাহরণের ক্রম ও অ্যানোটেটর নিয়ে অ্যাবলেশন।')],
        weaknesses: [b('Hard to reproduce without access to the largest models.', 'বড় মডেল ছাড়া রিপ্রোডিউস করা কঠিন।')] },
    ] },
    discussion: disc(['arif', 'Try it yourself: add “let’s think step by step” and compare.', 'নিজে চেষ্টা করুন: “ধাপে ধাপে ভাবি” যোগ করে তুলনা করুন।', '6h', 24]),
    claims: [
      { id: 'p2c1', where: '§3.2, Figure 4', text: b('Chain-of-thought prompting improves arithmetic reasoning only at sufficient model scale.', 'যথেষ্ট বড় মডেলেই কেবল চেইন-অফ-থট গাণিতিক যুক্তি উন্নত করে।'),
        evidence: [
          { ref: 'Figure 4', what: b('GSM8K solve rate rises sharply above ~100B parameters for LaMDA, GPT-3 and PaLM.', 'LaMDA, GPT-3 ও PaLM-এ ~১০০বি প্যারামিটারের উপরে GSM8K সমাধানের হার দ্রুত বাড়ে।'), strength: 'strong' },
        ],
        assumptions: [b('Model families are comparable across sizes.', 'বিভিন্ন আকারে মডেল পরিবারগুলো তুলনীয়।')],
        notShown: [b('Whether smaller models trained differently could also benefit.', 'ভিন্নভাবে ট্রেন করা ছোট মডেলও উপকৃত হতে পারে কিনা।')],
        reviewer: b('A reviewer flagged that only very large proprietary models show the effect.', 'একজন রিভিউয়ার জানান শুধু খুব বড় বন্ধ মডেলে প্রভাব দেখা যায়।') },
    ],
    extract: {
      method: { t: b('Few-shot prompts whose exemplars include step-by-step reasoning.', 'যে ফিউ-শট প্রম্পটের উদাহরণে ধাপে ধাপে যুক্তি থাকে।'), ref: '§2' },
      data: { t: b('GSM8K, SVAMP, AQuA, CSQA, StrategyQA and others.', 'GSM8K, SVAMP, AQuA, CSQA, StrategyQA ইত্যাদি।'), ref: '§3.1' },
      result: { t: b('PaLM 540B: ~57% on GSM8K, then state of the art', 'PaLM 540B: GSM8K-এ ~৫৭%, তখনকার সেরা'), ref: 'Figure 4', bench: 'gsm8k' },
      strengths: b('No training needed; works across tasks.', 'ট্রেনিং লাগে না; বিভিন্ন কাজে চলে।'),
      weaknesses: b('Needs very large models; chains may be unfaithful.', 'খুব বড় মডেল লাগে; ধাপ বিশ্বস্ত নাও হতে পারে।'),
    },
  },
  p3: {
    question: b('Can a model learn to create images by learning to remove noise?', 'নয়েজ সরাতে শিখে কি মডেল ছবি তৈরি করতে পারে?'),
    findings: [
      b('Image quality on CIFAR-10 reached FID 3.17, competitive with GANs.', 'CIFAR-10-এ FID ৩.১৭, জিএএন-এর সাথে প্রতিযোগিতামূলক।'),
      b('Training is a simple, stable regression loss.', 'ট্রেনিং একটি সহজ, স্থির রিগ্রেশন লস।'),
    ],
    limitations: [b('Sampling needs about 1,000 steps, so it is slow.', 'স্যাম্পলিংয়ে প্রায় ১,০০০ ধাপ লাগে, তাই ধীর।')],
    glossary: [
      { term: 'FID', def: b('Distance between generated and real image statistics. Lower is better.', 'তৈরি ও আসল ছবির পরিসংখ্যানের দূরত্ব। কম হলে ভালো।') },
      { term: 'Noise schedule', def: b('How much noise is added at each step.', 'প্রতি ধাপে কতটা নয়েজ যোগ হয়।') },
    ],
    difficulty: 'advanced', citations: 21000, hf: 154, sources: ['openalex', 's2', 'hf'], license: CC, generated: 'Oct 25',
    figures: [
      { n: 1, scene: 'diffusion', caption: b('From pure noise to an image, step by step', 'শুধু নয়েজ থেকে ধাপে ধাপে ছবি'),
        q: b('At generation time, the model starts from…', 'জেনারেশনের সময় মডেল শুরু করে…'),
        options: [b('a real photo', 'একটি আসল ছবি'), b('pure Gaussian noise', 'শুধু গাউসিয়ান নয়েজ'), b('a blank image', 'ফাঁকা ছবি')], answer: 1,
        explain: b('It samples random noise and repeatedly predicts and removes a little of it, about 1,000 times.', 'এটি এলোমেলো নয়েজ নিয়ে বারবার একটু একটু করে নয়েজ অনুমান ও সরায়, প্রায় ১,০০০ বার।') },
      { n: 2, scene: 'loss', caption: b('Training loss: predict the added noise', 'ট্রেনিং লস: যোগ করা নয়েজ অনুমান'),
        q: b('What does the network predict during training?', 'ট্রেনিংয়ে নেটওয়ার্ক কী অনুমান করে?'),
        options: [b('The noise that was added', 'যে নয়েজ যোগ করা হয়েছিল'), b('The image label', 'ছবির লেবেল'), b('The next pixel', 'পরের পিক্সেল')], answer: 0,
        explain: b('A simple mean-squared error between true and predicted noise. That simplicity is a big reason it trains stably.', 'আসল ও অনুমিত নয়েজের মিন স্কয়ার্ড এরর। এই সরলতাই স্থির ট্রেনিংয়ের বড় কারণ।') },
    ],
    prereqs: [pre.gd, pre.diffusion, pre.neuron],
    buildsOn: [], builtBy: [],
    discussion: disc(['mehedi', 'The appendix has the full U-Net details. Worth it.', 'পরিশিষ্টে পুরো ইউ-নেটের বিস্তারিত আছে। পড়ার মতো।', '2d', 19]),
    extract: {
      method: { t: b('Learn to reverse a fixed noising process with a U-Net that predicts noise.', 'নয়েজ অনুমানকারী ইউ-নেট দিয়ে নির্দিষ্ট নয়েজিং প্রক্রিয়া উল্টাতে শেখা।'), ref: '§3' },
      data: { t: b('CIFAR-10, CelebA-HQ, LSUN.', 'CIFAR-10, CelebA-HQ, LSUN।'), ref: '§4' },
      result: { t: b('FID 3.17 on CIFAR-10', 'CIFAR-10-এ FID ৩.১৭'), ref: 'Table 1', bench: 'cifar10' },
      strengths: b('Stable training, high sample quality.', 'স্থির ট্রেনিং, উচ্চমানের ছবি।'),
      weaknesses: b('Slow sampling.', 'ধীর স্যাম্পলিং।'),
    },
  },
  p4: {
    question: b('What if an LLM could think and act, alternating between them?', 'এলএলএম যদি ভাবা আর কাজ পালাক্রমে করতে পারে?'),
    findings: [
      b('Interleaving thoughts with search actions reduced hallucinated facts.', 'চিন্তার সাথে সার্চ পালাক্রমে করায় বানানো তথ্য কমেছে।'),
      b('Large gains on interactive tasks: +34% success on ALFWorld.', 'ইন্টার‍্যাক্টিভ কাজে বড় উন্নতি: ALFWorld-এ +৩৪% সাফল্য।'),
    ],
    limitations: [b('Relies on prompt examples; long tasks can loop or drift.', 'প্রম্পট উদাহরণের উপর নির্ভরশীল; লম্বা কাজে ঘুরপাক খেতে পারে।')],
    glossary: [
      { term: 'Trajectory', def: b('The sequence of thoughts, actions and observations.', 'চিন্তা, কাজ ও পর্যবেক্ষণের ধারাবাহিকতা।') },
      { term: 'HotpotQA', def: b('Questions that need facts from two Wikipedia pages.', 'যে প্রশ্নে দুটি উইকিপিডিয়া পাতার তথ্য লাগে।') },
    ],
    difficulty: 'beginner', citations: 3100, hf: 233, trend: 5, sources: ['openalex', 's2', 'hf', 'openreview'], license: CC, generated: 'Nov 5', checkedBy: 'rafi',
    figures: [
      { n: 1, scene: 'react', caption: b('A ReAct trajectory: thought, action, observation', 'রিঅ্যাক্ট ধারাবাহিকতা: চিন্তা, কাজ, পর্যবেক্ষণ'),
        q: b('Where does the model get new facts from?', 'মডেল নতুন তথ্য কোথা থেকে পায়?'),
        options: [b('Its own thoughts', 'নিজের চিন্তা'), b('Observations returned by actions', 'কাজের ফলে আসা পর্যবেক্ষণ'), b('The question', 'প্রশ্ন থেকে')], answer: 1,
        explain: b('Thoughts plan, actions query Wikipedia, and observations bring real text back. Facts come from observations, not from memory.', 'চিন্তা পরিকল্পনা করে, কাজ উইকিপিডিয়ায় খোঁজে, পর্যবেক্ষণ আসল টেক্সট আনে। তথ্য আসে পর্যবেক্ষণ থেকে, মেমরি থেকে নয়।') },
      { n: 2, scene: 'agent', caption: b('The loop repeats until the task is done', 'কাজ শেষ না হওয়া পর্যন্ত লুপ চলে'),
        q: b('Which step is skipped in “act-only” prompting?', '“শুধু কাজ” প্রম্পটিংয়ে কোন ধাপ বাদ পড়ে?'),
        options: [b('Thought', 'চিন্তা'), b('Action', 'কাজ'), b('Observation', 'পর্যবেক্ষণ')], answer: 0,
        explain: b('Act-only agents never write down a plan. The paper shows adding thoughts helps them recover from mistakes.', 'শুধু-কাজ এজেন্ট কখনো পরিকল্পনা লেখে না। পেপারে দেখানো হয়, চিন্তা যোগ করলে ভুল থেকে ফিরে আসা সহজ হয়।') },
    ],
    prereqs: [pre.agent, pre.tools, pre.prompting],
    buildsOn: ['p2'], builtBy: ['p16'],
    review: { venue: 'ICLR 2023', decision: b('Accepted', 'গৃহীত'), reviews: [
      { id: 'r1', rating: 8, label: b('Accept, good paper', 'গ্রহণযোগ্য, ভালো পেপার'), confidence: 4,
        summary: b('A general recipe that unifies reasoning and acting, with clear gains.', 'যুক্তি ও কাজকে একত্র করার সাধারণ পদ্ধতি, স্পষ্ট উন্নতিসহ।'),
        strengths: [b('Human-readable trajectories help debugging.', 'মানুষ-পাঠযোগ্য ধারাবাহিকতা ডিবাগে সাহায্য করে।')],
        weaknesses: [b('Sensitive to the choice of prompt examples.', 'প্রম্পট উদাহরণ বাছাইয়ে সংবেদনশীল।')] },
      { id: 'r2', rating: 6, label: b('Marginally above threshold', 'সীমারেখার কিছুটা উপরে'), confidence: 3,
        summary: b('Strong empirical paper; novelty relative to prior prompting work is moderate.', 'শক্তিশালী পরীক্ষামূলক পেপার; আগের কাজের তুলনায় নতুনত্ব মাঝারি।'),
        strengths: [b('Covers both QA and decision-making tasks.', 'প্রশ্নোত্তর ও সিদ্ধান্ত নেওয়ার কাজ দুটোই আছে।')],
        weaknesses: [b('Limited analysis of failure cases.', 'ব্যর্থতার বিশ্লেষণ সীমিত।')] },
    ] },
    discussion: disc(['rafi', 'Build it in 40 lines: see my Tool Calling note.', '৪০ লাইনে বানান: আমার টুল কলিং নোট দেখুন।', '4h', 33]),
    extract: {
      method: { t: b('Prompt the LLM to alternate reasoning traces and tool actions (Wikipedia API).', 'এলএলএম-কে যুক্তি ও টুল কাজ (উইকিপিডিয়া এপিআই) পালাক্রমে করতে প্রম্পট।'), ref: '§2' },
      data: { t: b('HotpotQA, FEVER, ALFWorld, WebShop.', 'HotpotQA, FEVER, ALFWorld, WebShop।'), ref: '§3–4' },
      result: { t: b('+34% absolute success on ALFWorld', 'ALFWorld-এ +৩৪% সাফল্য'), ref: 'Table 3', bench: 'alfworld' },
      strengths: b('Interpretable; fewer hallucinations.', 'ব্যাখ্যাযোগ্য; কম বানানো তথ্য।'),
      weaknesses: b('Prompt-sensitive; long horizons drift.', 'প্রম্পটে সংবেদনশীল; লম্বা কাজে বিচ্যুতি।'),
    },
  },
  p6: {
    question: b('Can we predict how good a language model will be before training it?', 'ট্রেনিংয়ের আগেই কি মডেল কতটা ভালো হবে অনুমান করা যায়?'),
    findings: [
      b('Loss follows smooth power laws in model size, data and compute.', 'মডেলের আকার, ডেটা ও কম্পিউটে লস মসৃণ পাওয়ার ল মেনে চলে।'),
      b('Larger models are more sample-efficient.', 'বড় মডেল কম ডেটায় বেশি শেখে।'),
    ],
    limitations: [b('Later work (Chinchilla) revised the data-vs-size balance.', 'পরের কাজ (চিনচিলা) ডেটা-বনাম-আকারের ভারসাম্য সংশোধন করে।')],
    glossary: [{ term: 'Power law', def: b('A straight line on a log–log plot.', 'লগ–লগ গ্রাফে একটি সরলরেখা।') }],
    difficulty: 'intermediate', citations: 6200, sources: ['openalex', 's2'], license: CC, generated: 'Oct 20', checkedBy: 'arif',
    figures: [
      { n: 1, scene: 'scaling', caption: b('Test loss vs compute (log–log)', 'টেস্ট লস বনাম কম্পিউট (লগ–লগ)'),
        q: b('On a log–log plot, a power law looks like…', 'লগ–লগ গ্রাফে পাওয়ার ল দেখতে…'),
        options: [b('a straight line', 'সরলরেখা'), b('a circle', 'বৃত্ত'), b('random dots', 'এলোমেলো বিন্দু')], answer: 0,
        explain: b('That straight line is why you can extrapolate: fit small runs, predict big ones.', 'এই সরলরেখার কারণেই অনুমান করা যায়: ছোট রানে ফিট করে বড় রানের ফল আন্দাজ।') },
    ],
    prereqs: [pre.tokens, pre.gd],
    buildsOn: ['p1'], builtBy: ['p11', 'p8'],
    discussion: [],
    extract: {
      method: { t: b('Train many Transformer sizes; fit power laws to test loss.', 'বিভিন্ন আকারের ট্রান্সফর্মার ট্রেন; টেস্ট লসে পাওয়ার ল ফিট।'), ref: '§3' },
      data: { t: b('WebText2.', 'WebText2।'), ref: '§2' },
      result: null,
      strengths: b('Predictive guidance for planning compute.', 'কম্পিউট পরিকল্পনায় অনুমানযোগ্য নির্দেশনা।'),
      weaknesses: b('Reports loss, not task accuracy.', 'লস দেখায়, কাজের অ্যাকুরেসি নয়।'),
    },
  },
  p9: {
    question: b('How small can a language model be and still write coherent English?', 'ভাষা মডেল কত ছোট হলেও সুসংগত ইংরেজি লিখতে পারে?'),
    findings: [
      b('Models with under 10M parameters wrote fluent, grammatical stories.', '১০ মিলিয়নের কম প্যারামিটারের মডেল সাবলীল, ব্যাকরণসম্মত গল্প লিখেছে।'),
      b('Simple, focused data made small models much more capable.', 'সহজ, কেন্দ্রিক ডেটা ছোট মডেলকে অনেক সক্ষম করেছে।'),
    ],
    limitations: [
      b('Narrow domain: simple children’s stories only.', 'সংকীর্ণ ক্ষেত্র: শুধু শিশুদের সহজ গল্প।'),
      b('Quality was graded by GPT-4, which has its own biases.', 'মান জিপিটি-৪ দিয়ে যাচাই, যার নিজস্ব পক্ষপাত আছে।'),
    ],
    glossary: [
      { term: 'Synthetic data', def: b('Training text generated by another model.', 'অন্য মডেলের তৈরি ট্রেনিং টেক্সট।') },
      { term: 'Coherence', def: b('Whether the story stays consistent from start to end.', 'গল্প শুরু থেকে শেষ পর্যন্ত সামঞ্জস্যপূর্ণ কিনা।') },
    ],
    difficulty: 'beginner', citations: 720, hf: 341, trend: 1, isNew: true, sources: ['openalex', 's2', 'hf'], license: CC, generated: 'Nov 14', checkedBy: 'arif',
    figures: [
      { n: 1, scene: 'tokens', caption: b('Stories use a vocabulary a 3–4 year old knows', 'গল্পে ৩–৪ বছরের শিশুর জানা শব্দভান্ডার'),
        q: b('Why restrict the vocabulary?', 'শব্দভান্ডার সীমিত কেন?'),
        options: [b('To save disk space', 'ডিস্ক বাঁচাতে'), b('So a small model can learn grammar and reasoning, not rare words', 'যাতে ছোট মডেল বিরল শব্দ নয়, ব্যাকরণ ও যুক্তি শেখে'), b('For copyright', 'কপিরাইটের জন্য')], answer: 1,
        explain: b('With fewer rare words to memorize, capacity goes to structure: grammar, consistency, simple cause and effect.', 'বিরল শব্দ মুখস্থ কম লাগায় সক্ষমতা যায় কাঠামোয়: ব্যাকরণ, সামঞ্জস্য, সহজ কার্যকারণ।') },
      { n: 2, scene: 'scaling', caption: b('GPT-4 grades vs model size', 'মডেলের আকার বনাম জিপিটি-৪ গ্রেড'),
        q: b('What happens to grammar scores as models grow from 1M to 30M?', '১এম থেকে ৩০এম হলে ব্যাকরণ স্কোরে কী হয়?'),
        options: [b('They rise early, then flatten', 'আগে বাড়ে, পরে সমতল'), b('They fall', 'কমে'), b('No change', 'পরিবর্তন নেই')], answer: 0,
        explain: b('Grammar is learned first, at very small sizes. Consistency and creativity keep improving longer.', 'ব্যাকরণ খুব ছোট আকারেই আগে শেখা হয়। সামঞ্জস্য ও সৃজনশীলতা আরও পরে পর্যন্ত বাড়ে।') },
    ],
    prereqs: [pre.tokens, pre.pretrain],
    buildsOn: ['p6', 'p8'], builtBy: ['p10'],
    discussion: disc(['sadia', 'Could we build a Bangla TinyStories? Simple vocabulary lists exist for class 1–2 books.', 'বাংলা টাইনিস্টোরিজ কি বানানো যায়? ১ম–২য় শ্রেণির বইয়ের শব্দতালিকা আছে।', '8h', 64]),
    claims: [
      { id: 'p9c1', where: 'Abstract, §4', text: b('Models with fewer than 10 million parameters can generate fluent and consistent stories.', '১ কোটির কম প্যারামিটারের মডেল সাবলীল ও সামঞ্জস্যপূর্ণ গল্প লিখতে পারে।'),
        evidence: [
          { ref: 'Figure 4', what: b('GPT-4 grades for grammar and consistency across model sizes.', 'বিভিন্ন আকারে ব্যাকরণ ও সামঞ্জস্যের জিপিটি-৪ গ্রেড।'), strength: 'partial' },
          { ref: '§4.2 examples', what: b('Sample completions from 1M–33M models.', '১এম–৩৩এম মডেলের নমুনা লেখা।'), strength: 'partial' },
        ],
        assumptions: [b('GPT-4 grading agrees with human judgement.', 'জিপিটি-৪ গ্রেডিং মানুষের বিচারের সাথে মেলে।'), b('Generated stories are not copied from training data.', 'তৈরি গল্প ট্রেনিং ডেটা থেকে কপি নয়।')],
        notShown: [b('Fluency outside the children’s-story domain.', 'শিশু-গল্পের বাইরে সাবলীলতা।'), b('A large human evaluation.', 'বড় পরিসরে মানব মূল্যায়ন।')] },
    ],
    roadmap: true, code: { repo: 'huggingface.co/datasets/roneneldan/TinyStories', official: true },
    extract: {
      method: { t: b('Synthetic dataset of simple stories; train tiny GPT-style models; grade with GPT-4.', 'সহজ গল্পের সিনথেটিক ডেটাসেট; ছোট জিপিটি-ধরনের মডেল; জিপিটি-৪ দিয়ে গ্রেড।'), ref: '§2–3' },
      data: { t: b('TinyStories, generated with GPT-3.5 and GPT-4.', 'জিপিটি-৩.৫ ও জিপিটি-৪ দিয়ে তৈরি টাইনিস্টোরিজ।'), ref: '§2' },
      result: { t: b('<10M-parameter models write coherent stories (GPT-4 graded)', '<১০এম প্যারামিটারের মডেল সুসংগত গল্প লেখে (জিপিটি-৪ গ্রেড)'), ref: 'Figure 4', bench: 'tinystories' },
      strengths: b('Runs on a laptop; great for learning.', 'ল্যাপটপে চলে; শেখার জন্য দারুণ।'),
      weaknesses: b('Very narrow domain; model-graded evaluation.', 'খুব সংকীর্ণ ক্ষেত্র; মডেল-গ্রেডেড মূল্যায়ন।'),
    },
  },
};

/* Lighter extras for the rest of the collection. */
const lite = (d: Partial<PaperX> & Pick<PaperX, 'question' | 'findings' | 'limitations' | 'difficulty' | 'citations' | 'extract'>): PaperX => ({
  glossary: [], sources: ['openalex', 's2'], license: ARX, generated: 'Nov 10', figures: [], prereqs: [], buildsOn: [], builtBy: [], discussion: [], ...d,
});
Object.assign(PX, {
  p7: lite({ question: b('Can one pretrained model, reading in both directions, handle many tasks?', 'দুই দিক পড়া একটি প্রিট্রেইনড মডেল কি অনেক কাজ পারে?'), difficulty: 'intermediate', citations: 112000, sources: ['openalex', 's2', 'hf'],
    findings: [b('New state of the art on 11 NLP tasks, including GLUE and SQuAD.', 'GLUE ও SQuAD-সহ ১১টি এনএলপি কাজে নতুন সেরা ফল।')], limitations: [b('Masked tokens never appear at fine-tuning time, a train–test mismatch.', 'ফাইন-টিউনে মাস্ক টোকেন থাকে না, ট্রেন–টেস্ট অমিল।')],
    prereqs: [pre.selfatt, pre.tokens], buildsOn: ['p1'], builtBy: ['p13'],
    glossary: [{ term: 'Masked LM', def: b('Hide some words; predict them from context.', 'কিছু শব্দ লুকিয়ে প্রসঙ্গ থেকে অনুমান।') }],
    extract: { method: { t: b('Bidirectional Transformer encoder; masked LM + next-sentence prediction.', 'দ্বিমুখী ট্রান্সফর্মার এনকোডার; মাস্কড এলএম + পরের বাক্য অনুমান।'), ref: '§3' }, data: { t: b('BooksCorpus + English Wikipedia.', 'বুকসকর্পাস + ইংরেজি উইকিপিডিয়া।'), ref: '§3.1' }, result: { t: b('GLUE score 80.5 (BERT-large)', 'GLUE স্কোর ৮০.৫ (BERT-large)'), ref: 'Table 1', bench: 'glue' }, strengths: b('Strong general-purpose encoder.', 'শক্তিশালী সাধারণ এনকোডার।'), weaknesses: b('Not designed for text generation.', 'টেক্সট তৈরির জন্য নয়।') } }),
  p8: lite({ question: b('Does scaling up let a model learn tasks from prompt examples alone?', 'বড় করলে কি মডেল শুধু প্রম্পটের উদাহরণ থেকে কাজ শেখে?'), difficulty: 'intermediate', citations: 41000, sources: ['openalex', 's2', 'hf'],
    findings: [b('Few-shot performance improves steadily with size, up to 175B.', '১৭৫বি পর্যন্ত আকার বাড়লে ফিউ-শট পারফরম্যান্স ধারাবাহিকভাবে বাড়ে।')], limitations: [b('Very costly to train; still weak on some reasoning tasks.', 'ট্রেনিং খুব ব্যয়বহুল; কিছু যুক্তির কাজে এখনো দুর্বল।')],
    prereqs: [pre.tokens, pre.pretrain], buildsOn: ['p1', 'p6'], builtBy: ['p2', 'p17', 'p5', 'p9'],
    extract: { method: { t: b('175B decoder-only Transformer, prompted with in-context examples.', '১৭৫বি ডিকোডার ট্রান্সফর্মার, প্রসঙ্গে উদাহরণসহ প্রম্পট।'), ref: '§2' }, data: { t: b('300B tokens: filtered Common Crawl, books, Wikipedia.', '৩০০বি টোকেন: বাছাই করা কমন ক্রল, বই, উইকিপিডিয়া।'), ref: '§2.2' }, result: { t: b('71.2% few-shot on TriviaQA', 'TriviaQA-তে ফিউ-শট ৭১.২%'), ref: 'Table 3.3', bench: 'triviaqa' }, strengths: b('One model, many tasks, no fine-tuning.', 'একটি মডেল, অনেক কাজ, ফাইন-টিউন ছাড়া।'), weaknesses: b('Huge compute; data contamination concerns.', 'বিশাল কম্পিউট; ডেটা দূষণের আশঙ্কা।') } }),
  p10: lite({ question: b('Can better data replace a larger model for coding?', 'কোডিংয়ে কি ভালো ডেটা বড় মডেলের বিকল্প হতে পারে?'), difficulty: 'intermediate', citations: 640, hf: 188, trend: 4, isNew: true, sources: ['openalex', 's2', 'hf'], license: CC,
    findings: [b('A 1.3B model reached 50.6% pass@1 on HumanEval.', '১.৩বি মডেল HumanEval-এ ৫০.৬% pass@1।')], limitations: [b('Python only; contamination checks rely on the authors’ analysis.', 'শুধু পাইথন; দূষণ যাচাই লেখকদের বিশ্লেষণনির্ভর।')],
    buildsOn: ['p9', 'p11'], prereqs: [pre.tokens, pre.pretrain],
    extract: { method: { t: b('Train a small code model on filtered “textbook-quality” data plus synthetic exercises.', 'বাছাই করা “পাঠ্যবই মানের” ডেটা ও সিনথেটিক অনুশীলনে ছোট কোড মডেল।'), ref: '§2' }, data: { t: b('~6B filtered web tokens + ~1B synthetic textbook tokens.', '~৬বি বাছাই করা ওয়েব টোকেন + ~১বি সিনথেটিক টোকেন।'), ref: '§2.1' }, result: { t: b('50.6% pass@1 on HumanEval', 'HumanEval-এ ৫০.৬% pass@1'), ref: 'Table 1', bench: 'humaneval' }, strengths: b('Small, cheap, strong.', 'ছোট, সস্তা, শক্তিশালী।'), weaknesses: b('Narrow: Python functions.', 'সংকীর্ণ: পাইথন ফাংশন।') } }),
  p11: lite({ question: b('Given fixed compute, should we train bigger models or on more data?', 'নির্দিষ্ট কম্পিউটে বড় মডেল নাকি বেশি ডেটা?'), difficulty: 'intermediate', citations: 3600, sources: ['openalex', 's2', 'hf'],
    findings: [b('Models and data should scale equally; many LLMs were under-trained.', 'মডেল ও ডেটা সমানভাবে বাড়ানো উচিত; অনেক এলএলএম কম ট্রেন হয়েছিল।')], limitations: [b('Fits depend on the specific training setup.', 'ফিট নির্দিষ্ট ট্রেনিং সেটআপের উপর নির্ভরশীল।')],
    buildsOn: ['p6'], builtBy: ['p10', 'p14'], prereqs: [pre.tokens],
    extract: { method: { t: b('Train 400+ models; fit compute-optimal size vs tokens.', '৪০০+ মডেল ট্রেন; সর্বোত্তম আকার বনাম টোকেন ফিট।'), ref: '§3' }, data: { t: b('MassiveText.', 'MassiveText।'), ref: '§4' }, result: { t: b('67.5% on MMLU with 70B params', '৭০বি প্যারামিটারে MMLU-তে ৬৭.৫%'), ref: 'Table 6', bench: 'mmlu' }, strengths: b('Clear, actionable scaling rule.', 'স্পষ্ট, কাজে লাগানোর মতো নিয়ম।'), weaknesses: b('Ignores inference cost.', 'ইনফারেন্স খরচ বিবেচনা করে না।') } }),
  p12: lite({ question: b('Can we fine-tune a 65B model on one GPU without losing quality?', 'মান না হারিয়ে কি একটি জিপিইউতে ৬৫বি ফাইন-টিউন সম্ভব?'), difficulty: 'advanced', citations: 3200, hf: 264, trend: 6, sources: ['openalex', 's2', 'hf', 'openreview'], license: CC,
    findings: [b('4-bit base + LoRA matched 16-bit fine-tuning quality.', '৪-বিট বেস + লোরা ১৬-বিট ফাইন-টিউনিংয়ের সমান মান।')], limitations: [b('Chatbot evaluation relies on GPT-4 and human preferences.', 'চ্যাটবট মূল্যায়ন জিপিটি-৪ ও মানুষের পছন্দনির্ভর।')],
    buildsOn: ['p5'], prereqs: [pre.finetune, pre.pretrain], code: { repo: 'github.com/artidoro/qlora', official: true },
    extract: { method: { t: b('Frozen 4-bit NormalFloat base, double quantization, paged optimizers, LoRA adapters.', 'ফ্রিজ ৪-বিট NormalFloat বেস, ডাবল কোয়ান্টাইজেশন, পেজড অপটিমাইজার, লোরা।'), ref: '§3' }, data: { t: b('OASST1 and other instruction datasets.', 'OASST1 ও অন্যান্য নির্দেশনা ডেটাসেট।'), ref: '§5' }, result: { t: b('Guanaco 65B: 99.3% of ChatGPT on Vicuna benchmark', 'Guanaco 65B: Vicuna বেঞ্চমার্কে ChatGPT-র ৯৯.৩%'), ref: 'Table 6', bench: 'vicuna' }, strengths: b('Fine-tune huge models on one GPU.', 'একটি জিপিইউতে বিশাল মডেল ফাইন-টিউন।'), weaknesses: b('Quantization adds training-time overhead.', 'কোয়ান্টাইজেশনে ট্রেনিংয়ে বাড়তি সময়।') } }),
  p13: lite({ question: b('Can a smaller student keep most of BERT’s skill?', 'ছোট ছাত্র-মডেল কি বার্টের বেশিরভাগ দক্ষতা রাখতে পারে?'), difficulty: 'beginner', citations: 7100, sources: ['openalex', 's2', 'hf'],
    findings: [b('Kept 97% of BERT’s GLUE performance with 40% fewer parameters.', '৪০% কম প্যারামিটারে বার্টের GLUE পারফরম্যান্সের ৯৭%।')], limitations: [b('Still needs the large teacher during training.', 'ট্রেনিংয়ে এখনো বড় শিক্ষক-মডেল লাগে।')],
    buildsOn: ['p7'], prereqs: [pre.neuron, pre.selfatt],
    glossary: [{ term: 'Distillation', def: b('A small model learns to copy a large model’s outputs.', 'ছোট মডেল বড় মডেলের আউটপুট অনুকরণ করে শেখে।') }],
    extract: { method: { t: b('Knowledge distillation during pretraining with a triple loss.', 'প্রিট্রেনিংয়ে ট্রিপল লসসহ নলেজ ডিস্টিলেশন।'), ref: '§2' }, data: { t: b('Same corpus as BERT.', 'বার্টের একই কর্পাস।'), ref: '§3' }, result: { t: b('97% of BERT on GLUE, 60% faster', 'GLUE-তে বার্টের ৯৭%, ৬০% দ্রুত'), ref: 'Table 1', bench: 'glue' }, strengths: b('Fast, small, easy to deploy.', 'দ্রুত, ছোট, সহজে চালানো যায়।'), weaknesses: b('Some accuracy loss on harder tasks.', 'কঠিন কাজে কিছু অ্যাকুরেসি কম।') } }),
  p14: lite({ question: b('What is the best architecture for models under one billion parameters?', 'এক বিলিয়নের কম প্যারামিটারের মডেলে সেরা আর্কিটেকচার কী?'), difficulty: 'intermediate', citations: 210, hf: 302, trend: 2, isNew: true, sources: ['openalex', 's2', 'hf'], license: CC,
    findings: [b('Deep-and-thin models beat wide-and-shallow ones at small scale.', 'ছোট স্কেলে গভীর-সরু মডেল চওড়া-অগভীরকে হারায়।'), b('Sharing embeddings and blocks saves parameters for free.', 'এমবেডিং ও ব্লক শেয়ারে বিনা খরচে প্যারামিটার সাশ্রয়।')], limitations: [b('Evaluated mostly on zero-shot reasoning and chat benchmarks.', 'মূলত জিরো-শট যুক্তি ও চ্যাট বেঞ্চমার্কে যাচাই।')],
    buildsOn: ['p11', 'p1'], prereqs: [pre.selfatt, pre.embed],
    extract: { method: { t: b('Deep-thin layout, embedding sharing, grouped-query attention, block-wise weight sharing.', 'গভীর-সরু গঠন, এমবেডিং শেয়ার, গ্রুপড-কোয়েরি অ্যাটেনশন, ব্লক শেয়ার।'), ref: '§2' }, data: { t: b('1T tokens of public pretraining data.', '১ট্রিলিয়ন টোকেন পাবলিক ডেটা।'), ref: '§3' }, result: { t: b('+2.7% (125M) and +4.3% (350M) over prior SOTA on zero-shot commonsense', 'জিরো-শট কমনসেন্সে আগের সেরার চেয়ে +২.৭% (১২৫এম) ও +৪.৩% (৩৫০এম)'), ref: 'Table 3', bench: 'commonsense' }, strengths: b('Designed for phones.', 'ফোনের জন্য তৈরি।'), weaknesses: b('Small models still hallucinate easily.', 'ছোট মডেল সহজেই ভুল তথ্য দেয়।') } }),
  p15: lite({ question: b('Can a model look things up instead of memorizing them?', 'মুখস্থ না করে কি মডেল তথ্য খুঁজে নিতে পারে?'), difficulty: 'intermediate', citations: 6400, hf: 120, sources: ['openalex', 's2', 'hf'],
    findings: [b('State of the art on open-domain QA such as Natural Questions.', 'Natural Questions-এর মতো ওপেন-ডোমেইন প্রশ্নোত্তরে সেরা ফল।')], limitations: [b('Retrieval errors flow straight into the answer.', 'খোঁজার ভুল সরাসরি উত্তরে চলে যায়।')],
    buildsOn: ['p7'], builtBy: ['p16'], prereqs: [pre.embed, pre.selfatt],
    extract: { method: { t: b('Dense retriever over Wikipedia + BART generator, trained end to end.', 'উইকিপিডিয়ায় ডেন্স রিট্রিভার + BART জেনারেটর, একসাথে ট্রেন।'), ref: '§2' }, data: { t: b('21M Wikipedia passages; NQ, TriviaQA, WebQuestions.', '২.১ কোটি উইকিপিডিয়া অংশ; NQ, TriviaQA, WebQuestions।'), ref: '§3' }, result: { t: b('44.5 exact match on Natural Questions', 'Natural Questions-এ ৪৪.৫ এক্স্যাক্ট ম্যাচ'), ref: 'Table 1', bench: 'nq' }, strengths: b('Updatable knowledge; cites sources.', 'আপডেটযোগ্য জ্ঞান; উৎস দেখায়।'), weaknesses: b('Extra retrieval latency.', 'খোঁজার বাড়তি সময়।') } }),
  p16: lite({ question: b('Can a model learn by itself when to call a tool?', 'মডেল কি নিজে শিখতে পারে কখন টুল ডাকতে হবে?'), difficulty: 'intermediate', citations: 1600, hf: 176, sources: ['openalex', 's2', 'hf', 'openreview'], license: CC,
    findings: [b('A 6.7B model with tools beat much larger GPT-3 on several zero-shot tasks.', 'টুলসহ ৬.৭বি মডেল কয়েকটি জিরো-শট কাজে অনেক বড় জিপিটি-৩-কে হারিয়েছে।')], limitations: [b('Tools cannot be chained; each call is independent.', 'টুল পরপর জোড়া যায় না; প্রতিটি কল আলাদা।')],
    buildsOn: ['p4', 'p15'], prereqs: [pre.tools, pre.agent],
    extract: { method: { t: b('Self-supervised: insert API calls, keep those that reduce loss, fine-tune.', 'স্ব-তত্ত্বাবধানে: এপিআই কল যোগ, যেগুলো লস কমায় রাখা, ফাইন-টিউন।'), ref: '§2' }, data: { t: b('Subset of CCNet; tools: calculator, QA, search, translation, calendar.', 'CCNet-এর অংশ; টুল: ক্যালকুলেটর, প্রশ্নোত্তর, সার্চ, অনুবাদ, ক্যালেন্ডার।'), ref: '§3' }, result: null, strengths: b('Needs only a few demos per tool.', 'প্রতি টুলে অল্প উদাহরণ লাগে।'), weaknesses: b('No interactive or multi-step tool use.', 'ইন্টার‍্যাক্টিভ বা বহু-ধাপের টুল ব্যবহার নেই।') } }),
  p17: lite({ question: b('How do we make a language model follow instructions helpfully?', 'ভাষা মডেলকে কীভাবে সহায়কভাবে নির্দেশনা মানাতে হয়?'), difficulty: 'intermediate', citations: 12800, hf: 140, sources: ['openalex', 's2', 'hf'],
    findings: [b('Labelers preferred 1.3B InstructGPT over 175B GPT-3 outputs.', 'লেবেলাররা ১৭৫বি জিপিটি-৩-এর চেয়ে ১.৩বি ইনস্ট্রাক্টজিপিটি পছন্দ করেছে।')], limitations: [b('Aligns to a small group of labelers’ preferences.', 'অল্প সংখ্যক লেবেলারের পছন্দে মানানো।')],
    buildsOn: ['p8', 'p2'], prereqs: [pre.pretrain, pre.prompting],
    extract: { method: { t: b('Supervised fine-tuning, reward model, PPO (RLHF).', 'সুপারভাইজড ফাইন-টিউন, রিওয়ার্ড মডেল, PPO (আরএলএইচএফ)।'), ref: '§3' }, data: { t: b('Prompts from the API plus labeler demonstrations and rankings.', 'এপিআই প্রম্পট, লেবেলারের উদাহরণ ও র‍্যাঙ্কিং।'), ref: '§3.2' }, result: { t: b('Preferred over GPT-3 175B in ~85% of comparisons', 'প্রায় ৮৫% তুলনায় জিপিটি-৩ ১৭৫বি-এর চেয়ে পছন্দ'), ref: 'Figure 1', bench: 'human-pref' }, strengths: b('Large helpfulness gains at small size.', 'ছোট আকারে বড় সহায়কতা।'), weaknesses: b('Can still make up facts.', 'এখনো তথ্য বানাতে পারে।') } }),
  p18: lite({ question: b('Do images really need convolutions?', 'ছবিতে কি সত্যিই কনভোলিউশন লাগে?'), difficulty: 'intermediate', citations: 52000, hf: 96, sources: ['openalex', 's2', 'hf', 'openreview'], license: CC,
    findings: [b('Pretrained on JFT-300M, ViT matches or beats strong CNNs.', 'JFT-300M-এ প্রিট্রেইনড ভিআইটি শক্তিশালী সিএনএন-এর সমান বা ভালো।')], limitations: [b('Needs very large pretraining datasets.', 'খুব বড় প্রিট্রেনিং ডেটাসেট লাগে।')],
    buildsOn: ['p1'], prereqs: [pre.cnn, pre.selfatt],
    extract: { method: { t: b('Split image into 16×16 patches; standard Transformer encoder.', 'ছবিকে ১৬×১৬ টুকরো; সাধারণ ট্রান্সফর্মার এনকোডার।'), ref: '§3' }, data: { t: b('ImageNet-21k, JFT-300M pretraining; ImageNet evaluation.', 'ImageNet-21k, JFT-300M প্রিট্রেনিং; ImageNet মূল্যায়ন।'), ref: '§4.1' }, result: { t: b('88.55% ImageNet top-1 (ViT-H/14)', 'ImageNet top-1 ৮৮.৫৫% (ViT-H/14)'), ref: 'Table 2', bench: 'imagenet' }, strengths: b('Simple, scales well.', 'সহজ, ভালোভাবে বড় হয়।'), weaknesses: b('Data-hungry.', 'অনেক ডেটা লাগে।') } }),
});

export const COLLECTION = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18'];

/* ---------------- plans, quotas, scope ---------------- */

export const LIMITS: Record<Plan, Record<ToolId, number>> = {
  free: { readmap: 1, landscape: 1, compare: 1, claim: 1, roadmap: 1 },
  premium: { readmap: 5, landscape: 4, compare: 8, claim: 10, roadmap: 3 },
};
export const SCOPE: Record<Plan, { mapPapers: number; comparePapers: number; pagesPerPaper: number }> = {
  free: { mapPapers: 8, comparePapers: 3, pagesPerPaper: 30 },
  premium: { mapPapers: 25, comparePapers: 5, pagesPerPaper: 40 },
};
export const PRICE = { bdt: 149 };
export const RESET_DATE = b('Dec 1', '১ ডিসেম্বর');
export const RENEW_DATE = b('Dec 20', '২০ ডিসেম্বর');
