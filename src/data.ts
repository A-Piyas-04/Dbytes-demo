export type Lang = 'en' | 'bn';
export type ContentLang = 'en' | 'bn' | 'mixed';
export type L = string | { en: string; bn: string };

export type TopicId = 'ml' | 'dl' | 'nn' | 'tf' | 'genai' | 'llm' | 'agents' | 'research';

export const TOPICS: { id: TopicId; label: { en: string; bn: string }; tag: string }[] = [
  { id: 'ml', label: { en: 'ML Fundamentals', bn: 'এমএল বেসিক' }, tag: 'MLBasics' },
  { id: 'dl', label: { en: 'Deep Learning', bn: 'ডিপ লার্নিং' }, tag: 'DeepLearning' },
  { id: 'nn', label: { en: 'Neural Networks', bn: 'নিউরাল নেটওয়ার্ক' }, tag: 'NeuralNetworks' },
  { id: 'tf', label: { en: 'Transformers', bn: 'ট্রান্সফর্মার' }, tag: 'Transformers' },
  { id: 'genai', label: { en: 'Generative AI', bn: 'জেনারেটিভ এআই' }, tag: 'GenAI' },
  { id: 'llm', label: { en: 'LLMs', bn: 'এলএলএম' }, tag: 'LLMs' },
  { id: 'agents', label: { en: 'AI Agents', bn: 'এআই এজেন্ট' }, tag: 'AIAgents' },
  { id: 'research', label: { en: 'Emerging Research', bn: 'নতুন গবেষণা' }, tag: 'Research' },
];
export const topicById = (id: TopicId) => TOPICS.find((t) => t.id === id)!;

export interface Creator {
  id: string;
  name: L;
  handle: string;
  bio: L;
  followers: number;
  following: number;
  hue: number;
  initials: string;
  verified?: boolean;
}

export const ME_ID = 'me';

export const CREATORS: Creator[] = [
  { id: 'nusrat', name: { en: 'Nusrat Jahan', bn: 'নুসরাত জাহান' }, handle: 'nusrat.ml', bio: { en: 'ML educator, Dhaka', bn: 'এমএল শিক্ষক, ঢাকা' }, followers: 48200, following: 312, hue: 168, initials: 'NJ', verified: true },
  { id: 'farhana', name: { en: 'Farhana Akter', bn: 'ফারহানা আক্তার' }, handle: 'farhana.ai', bio: { en: 'NLP researcher, BUET', bn: 'এনএলপি গবেষক, বুয়েট' }, followers: 31900, following: 201, hue: 330, initials: 'FA', verified: true },
  { id: 'sadia', name: { en: 'Sadia Rahman', bn: 'সাদিয়া রহমান' }, handle: 'sadia.math', bio: { en: 'Math for ML, in Bangla', bn: 'এমএল-এর গণিত, বাংলায়' }, followers: 26400, following: 158, hue: 260, initials: 'SR' },
  { id: 'tanvir', name: { en: 'Tanvir Hasan', bn: 'তানভীর হাসান' }, handle: 'tanvir.codes', bio: { en: 'Deep learning engineer', bn: 'ডিপ লার্নিং ইঞ্জিনিয়ার' }, followers: 19800, following: 420, hue: 210, initials: 'TH' },
  { id: 'rafi', name: { en: 'Rafiul Islam', bn: 'রাফিউল ইসলাম' }, handle: 'rafi.builds', bio: { en: 'Building AI agents', bn: 'এআই এজেন্ট বিল্ডার' }, followers: 15200, following: 97, hue: 24, initials: 'RI' },
  { id: 'arif', name: { en: 'Dr. Arif Mahmud', bn: 'ড. আরিফ মাহমুদ' }, handle: 'arif.research', bio: { en: 'Weekly paper bytes', bn: 'সাপ্তাহিক পেপার বাইটস' }, followers: 22700, following: 64, hue: 140, initials: 'AM', verified: true },
  { id: 'mehedi', name: { en: 'Mehedi Karim', bn: 'মেহেদী করিম' }, handle: 'mehedi.genai', bio: { en: 'GenAI, art + code', bn: 'জেনএআই, আর্ট + কোড' }, followers: 12100, following: 233, hue: 290, initials: 'MK' },
  { id: 'doshomik', name: { en: 'Doshomik Bytes', bn: 'দশমিক বাইটস' }, handle: 'doshomik', bio: { en: 'Official account', bn: 'অফিশিয়াল অ্যাকাউন্ট' }, followers: 86500, following: 12, hue: 172, initials: 'DB', verified: true },
];

export const ME: Creator = {
  id: ME_ID,
  name: { en: 'Rakib Ahmed', bn: 'রাকিব আহমেদ' },
  handle: 'rakib.learns',
  bio: { en: 'CSE student, learning ML', bn: 'সিএসই ছাত্র, এমএল শিখছি' },
  followers: 142,
  following: 0,
  hue: 45,
  initials: 'RA',
};

export type SceneKind =
  | 'neural' | 'attention' | 'gradient' | 'agent' | 'diffusion' | 'dropout'
  | 'conv' | 'pool' | 'dense' | 'softmax' | 'biasvar' | 'tokens' | 'tokenids' | 'embed'
  | 'scaling' | 'regression' | 'lora' | 'cot' | 'react' | 'loss';

export interface Reel {
  kind: 'reel';
  id: string;
  creatorId: string;
  topic: TopicId;
  caption: L;
  more: L;
  scene: SceneKind;
  subs: L[];
  likes: number;
  comments: number;
  views: number;
  duration: number;
  lang: ContentLang;
  link?: { type: 'course' | 'paper'; id: string };
  time: L;
}

export interface ImagePost {
  kind: 'image';
  id: string;
  creatorId: string;
  topic: TopicId;
  caption: L;
  more: L;
  slides: { scene: SceneKind; title: L }[];
  likes: number;
  comments: number;
  views: number;
  lang: ContentLang;
  time: L;
}

export interface NotePost {
  kind: 'note';
  id: string;
  creatorId: string;
  topic: TopicId;
  title: L;
  excerpt: string;
  body: string;
  readMin: number;
  likes: number;
  comments: number;
  views: number;
  lang: ContentLang;
  time: L;
}

export type Post = Reel | ImagePost | NotePost;

export const REELS: Reel[] = [
  {
    kind: 'reel', id: 'r1', creatorId: 'nusrat', topic: 'nn', scene: 'neural',
    caption: { en: 'Backprop in 60 seconds', bn: '৬০ সেকেন্ডে ব্যাকপ্রপ' },
    more: { en: 'Chain rule, step by step. Part 3 of Neural Networks Fundamentals.', bn: 'চেইন রুল, ধাপে ধাপে। নিউরাল নেটওয়ার্ক কোর্সের ৩য় পর্ব।' },
    subs: [{ en: 'Forward pass', bn: 'ফরওয়ার্ড পাস' }, { en: 'Compute loss', bn: 'লস হিসাব' }, { en: 'Backward pass', bn: 'ব্যাকওয়ার্ড পাস' }, { en: 'Update weights', bn: 'ওয়েট আপডেট' }],
    likes: 12400, comments: 318, views: 186000, duration: 58, lang: 'mixed', link: { type: 'course', id: 'c1' }, time: { en: '2h', bn: '২ ঘ' },
  },
  {
    kind: 'reel', id: 'r2', creatorId: 'farhana', topic: 'tf', scene: 'attention',
    caption: { en: 'Attention, visualized', bn: 'অ্যাটেনশন, ছবিতে' },
    more: { en: 'Which word looks at which. The core of every Transformer.', bn: 'কোন শব্দ কোন শব্দকে দেখে। প্রতিটি ট্রান্সফর্মারের মূল।' },
    subs: [{ en: 'Query', bn: 'কোয়েরি' }, { en: 'Key', bn: 'কি' }, { en: 'Value', bn: 'ভ্যালু' }, { en: 'Weighted sum', bn: 'ওয়েটেড যোগফল' }],
    likes: 9800, comments: 204, views: 142000, duration: 47, lang: 'en', link: { type: 'paper', id: 'p1' }, time: { en: '5h', bn: '৫ ঘ' },
  },
  {
    kind: 'reel', id: 'r3', creatorId: 'sadia', topic: 'ml', scene: 'gradient',
    caption: { en: 'Gradient descent, simply', bn: 'গ্রেডিয়েন্ট ডিসেন্ট, সহজে' },
    more: { en: 'Downhill, one small step at a time. Learning rate matters.', bn: 'ছোট ছোট ধাপে নিচে নামা। লার্নিং রেট গুরুত্বপূর্ণ।' },
    subs: [{ en: 'Start anywhere', bn: 'যেকোনো জায়গা থেকে শুরু' }, { en: 'Find the slope', bn: 'ঢাল বের করুন' }, { en: 'Step downhill', bn: 'নিচের দিকে ধাপ' }, { en: 'Repeat', bn: 'আবার করুন' }],
    likes: 15100, comments: 412, views: 231000, duration: 52, lang: 'bn', link: { type: 'course', id: 'c2' }, time: { en: '1d', bn: '১ দি' },
  },
  {
    kind: 'reel', id: 'r4', creatorId: 'rafi', topic: 'agents', scene: 'agent',
    caption: { en: 'The agent loop', bn: 'এজেন্ট লুপ' },
    more: { en: 'Think, act, observe, repeat. How tool-using agents work.', bn: 'ভাবো, কাজ করো, দেখো, আবার। টুল-ব্যবহারকারী এজেন্ট যেভাবে কাজ করে।' },
    subs: [{ en: 'Think', bn: 'ভাবো' }, { en: 'Act', bn: 'কাজ করো' }, { en: 'Observe', bn: 'পর্যবেক্ষণ' }, { en: 'Repeat', bn: 'আবার' }],
    likes: 7300, comments: 156, views: 98000, duration: 41, lang: 'mixed', link: { type: 'paper', id: 'p4' }, time: { en: '1d', bn: '১ দি' },
  },
  {
    kind: 'reel', id: 'r5', creatorId: 'mehedi', topic: 'genai', scene: 'diffusion',
    caption: { en: 'Diffusion: noise to image', bn: 'ডিফিউশন: নয়েজ থেকে ছবি' },
    more: { en: 'Add noise, learn to remove it. That is the whole trick.', bn: 'নয়েজ যোগ, তারপর সরাতে শেখা। এটাই মূল কৌশল।' },
    subs: [{ en: 'Pure noise', bn: 'শুধু নয়েজ' }, { en: 'Denoise step', bn: 'ডিনয়েজ ধাপ' }, { en: 'Shape appears', bn: 'আকার দেখা দেয়' }, { en: 'Final image', bn: 'চূড়ান্ত ছবি' }],
    likes: 11200, comments: 267, views: 175000, duration: 55, lang: 'en', link: { type: 'paper', id: 'p3' }, time: { en: '2d', bn: '২ দি' },
  },
  {
    kind: 'reel', id: 'r6', creatorId: 'tanvir', topic: 'dl', scene: 'dropout',
    caption: { en: 'Overfitting? Try dropout', bn: 'ওভারফিটিং? ড্রপআউট দিন' },
    more: { en: 'Randomly switch off neurons while training. Better generalization.', bn: 'ট্রেনিংয়ে এলোমেলোভাবে নিউরন বন্ধ। ভালো জেনারেলাইজেশন।' },
    subs: [{ en: 'Full network', bn: 'পূর্ণ নেটওয়ার্ক' }, { en: 'Drop 50%', bn: '৫০% বাদ' }, { en: 'Train', bn: 'ট্রেইন' }, { en: 'Less overfit', bn: 'কম ওভারফিট' }],
    likes: 6400, comments: 98, views: 77000, duration: 38, lang: 'mixed', time: { en: '3d', bn: '৩ দি' },
  },
];

export const IMAGES: ImagePost[] = [
  {
    kind: 'image', id: 'i1', creatorId: 'tanvir', topic: 'dl',
    caption: { en: 'CNN layers, in 4 slides', bn: '৪ স্লাইডে সিএনএন লেয়ার' },
    more: { en: 'Convolution, pooling, dense, softmax. Save for revision.', bn: 'কনভোলিউশন, পুলিং, ডেন্স, সফটম্যাক্স। রিভিশনের জন্য সেভ করুন।' },
    slides: [
      { scene: 'conv', title: { en: '1. Convolution', bn: '১. কনভোলিউশন' } },
      { scene: 'pool', title: { en: '2. Max pooling', bn: '২. ম্যাক্স পুলিং' } },
      { scene: 'dense', title: { en: '3. Dense layer', bn: '৩. ডেন্স লেয়ার' } },
      { scene: 'softmax', title: { en: '4. Softmax', bn: '৪. সফটম্যাক্স' } },
    ],
    likes: 4200, comments: 87, views: 51000, lang: 'en', time: { en: '3h', bn: '৩ ঘ' },
  },
  {
    kind: 'image', id: 'i2', creatorId: 'sadia', topic: 'ml',
    caption: { en: 'Bias vs variance', bn: 'বায়াস বনাম ভ্যারিয়েন্স' },
    more: { en: 'Four targets, one tradeoff.', bn: 'চারটি টার্গেট, একটি ট্রেডঅফ।' },
    slides: [{ scene: 'biasvar', title: { en: 'Bias vs variance', bn: 'বায়াস বনাম ভ্যারিয়েন্স' } }],
    likes: 5900, comments: 132, views: 64000, lang: 'bn', time: { en: '8h', bn: '৮ ঘ' },
  },
  {
    kind: 'image', id: 'i3', creatorId: 'doshomik', topic: 'llm',
    caption: { en: 'Tokenization 101', bn: 'টোকেনাইজেশন ১০১' },
    more: { en: 'Text, tokens, IDs, embeddings.', bn: 'টেক্সট, টোকেন, আইডি, এমবেডিং।' },
    slides: [
      { scene: 'tokens', title: { en: 'Split into tokens', bn: 'টোকেনে ভাগ' } },
      { scene: 'tokenids', title: { en: 'Map to IDs', bn: 'আইডিতে রূপান্তর' } },
      { scene: 'embed', title: { en: 'Look up vectors', bn: 'ভেক্টর খোঁজা' } },
    ],
    likes: 8800, comments: 176, views: 120000, lang: 'en', time: { en: '1d', bn: '১ দি' },
  },
  {
    kind: 'image', id: 'i4', creatorId: 'arif', topic: 'research',
    caption: { en: 'Scaling laws, one chart', bn: 'স্কেলিং ল, একটি চার্টে' },
    more: { en: 'More compute, lower loss. Predictably.', bn: 'বেশি কম্পিউট, কম লস। অনুমানযোগ্যভাবে।' },
    slides: [{ scene: 'scaling', title: { en: 'Loss vs compute', bn: 'লস বনাম কম্পিউট' } }],
    likes: 3700, comments: 64, views: 39000, lang: 'en', time: { en: '2d', bn: '২ দি' },
  },
];

export const NOTES: NotePost[] = [
  {
    kind: 'note', id: 'n1', creatorId: 'sadia', topic: 'ml', readMin: 4,
    title: { en: 'Linear Regression from Scratch', bn: 'শূন্য থেকে লিনিয়ার রিগ্রেশন' },
    excerpt: 'Model $\\hat{y} = wx + b$, loss MSE, update with `w -= lr * grad`',
    body: `## Model
$$\\hat{y} = wx + b$$

## Loss
Mean squared error
$$L = \\frac{1}{n}\\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2$$

## Gradients
- $\\partial L / \\partial w$
- $\\partial L / \\partial b$

## Code
\`\`\`python
import numpy as np

w, b, lr = 0.0, 0.0, 0.01
for epoch in range(1000):
    y_hat = w * X + b
    grad_w = -2 * np.mean(X * (y - y_hat))
    grad_b = -2 * np.mean(y - y_hat)
    w -= lr * grad_w
    b -= lr * grad_b
\`\`\`

![fit](scene:regression)

## Key points
- Small \`lr\`, slow but stable
- Large \`lr\`, may diverge
- Scale features first`,
    likes: 3200, comments: 71, views: 28000, lang: 'en', time: { en: '6h', bn: '৬ ঘ' },
  },
  {
    kind: 'note', id: 'n2', creatorId: 'farhana', topic: 'tf', readMin: 5,
    title: { en: 'Self-Attention: Q, K, V', bn: 'সেলফ-অ্যাটেনশন: Q, K, V' },
    excerpt: '$\\text{softmax}(QK^T / \\sqrt{d_k})\\,V$ — one line, whole Transformer core',
    body: `## Formula
$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

## Roles
- **Query**: what I look for
- **Key**: what I contain
- **Value**: what I give

![attention](scene:attention)

## PyTorch
\`\`\`python
scores = Q @ K.transpose(-2, -1) / d_k ** 0.5
weights = scores.softmax(dim=-1)
out = weights @ V
\`\`\`

## Why $\\sqrt{d_k}$
- Keeps scores small
- Stable softmax gradients`,
    likes: 4100, comments: 93, views: 36000, lang: 'en', time: { en: '1d', bn: '১ দি' },
  },
  {
    kind: 'note', id: 'n3', creatorId: 'rafi', topic: 'agents', readMin: 3,
    title: { en: 'Tool Calling Basics', bn: 'টুল কলিং বেসিক' },
    excerpt: 'Describe tools as JSON, let the model pick, run `get_weather(city)`',
    body: `## Steps
1. Describe tools
2. Model picks a tool
3. App runs it
4. Result back to model

## Tool schema
\`\`\`json
{
  "name": "get_weather",
  "parameters": { "city": "string" }
}
\`\`\`

![loop](scene:react)

## Tips
- Clear tool names
- Small, focused tools
- Validate every argument`,
    likes: 2600, comments: 48, views: 21000, lang: 'mixed', time: { en: '2d', bn: '২ দি' },
  },
  {
    kind: 'note', id: 'n4', creatorId: 'nusrat', topic: 'nn', readMin: 3,
    title: { en: 'Activation Functions', bn: 'অ্যাক্টিভেশন ফাংশন' },
    excerpt: 'ReLU $f(x)=\\max(0,x)$, সিগময়েড, ট্যানএইচ — কখন কোনটা',
    body: `## ReLU
$$f(x) = \\max(0, x)$$
- দ্রুত
- হিডেন লেয়ারে ডিফল্ট

## Sigmoid
$$\\sigma(x) = \\frac{1}{1 + e^{-x}}$$
- আউটপুট ০ থেকে ১
- বাইনারি ক্লাসিফিকেশন

## Tanh
- আউটপুট −১ থেকে ১

\`\`\`python
import torch.nn as nn
act = nn.ReLU()
\`\`\``,
    likes: 3900, comments: 85, views: 33000, lang: 'bn', time: { en: '3d', bn: '৩ দি' },
  },
];

export const MY_POSTS_SEED: Post[] = [
  {
    kind: 'note', id: 'm1', creatorId: ME_ID, topic: 'ml', readMin: 2,
    title: { en: 'My K-Means Notes', bn: 'আমার কে-মিনস নোট' },
    excerpt: 'Pick $k$, assign, update centroids, repeat',
    body: `## Steps
1. Pick $k$ centroids
2. Assign nearest
3. Update means
4. Repeat until stable

\`\`\`python
from sklearn.cluster import KMeans
KMeans(n_clusters=3).fit(X)
\`\`\``,
    likes: 34, comments: 5, views: 410, lang: 'en', time: { en: '4d', bn: '৪ দি' },
  },
  {
    kind: 'image', id: 'm2', creatorId: ME_ID, topic: 'ml',
    caption: { en: 'Regression fit, my first plot', bn: 'রিগ্রেশন ফিট, আমার প্রথম প্লট' },
    more: { en: 'Homework, week 2', bn: 'হোমওয়ার্ক, সপ্তাহ ২' },
    slides: [{ scene: 'regression', title: { en: 'Fit line', bn: 'ফিট লাইন' } }],
    likes: 21, comments: 3, views: 260, lang: 'en', time: { en: '1w', bn: '১ স' },
  },
];

export const FEED_ORDER = ['r1', 'i1', 'n1', 'r2', 'i2', 'n2', 'r3', 'i3', 'r4', 'n3', 'i4', 'r5', 'n4', 'r6'];

export interface Paper {
  id: string;
  title: string;
  source: string;
  authors: string;
  year: number;
  topic: TopicId;
  creatorId: string;
  problem: L;
  keyIdea: L;
  takeaway: L;
  scene?: SceneKind;
  url: string;
  readMin: number;
  saves: number;
  lang: ContentLang;
}

export const PAPERS: Paper[] = [
  {
    id: 'p1', title: 'Attention Is All You Need', source: 'NeurIPS 2017', authors: 'Vaswani et al.', year: 2017, topic: 'tf', creatorId: 'farhana',
    problem: { en: 'RNNs process words one by one. Slow to train, weak on long text.', bn: 'আরএনএন একটি একটি করে শব্দ পড়ে। ধীর, লম্বা টেক্সটে দুর্বল।' },
    keyIdea: { en: 'Drop recurrence. Use attention only, all positions in parallel.', bn: 'রিকারেন্স বাদ। শুধু অ্যাটেনশন, সব পজিশন একসাথে।' },
    takeaway: { en: 'Faster training, better translation. Base of every modern LLM.', bn: 'দ্রুত ট্রেনিং, ভালো অনুবাদ। আধুনিক সব এলএলএম-এর ভিত্তি।' },
    scene: 'attention', url: 'https://arxiv.org/abs/1706.03762', readMin: 3, saves: 5400, lang: 'en',
  },
  {
    id: 'p2', title: 'Chain-of-Thought Prompting', source: 'NeurIPS 2022', authors: 'Wei et al.', year: 2022, topic: 'llm', creatorId: 'arif',
    problem: { en: 'LLMs fail at multi-step math and logic.', bn: 'বহু-ধাপের গণিত ও যুক্তিতে এলএলএম ব্যর্থ।' },
    keyIdea: { en: 'Show worked reasoning steps in the prompt examples.', bn: 'প্রম্পটের উদাহরণে ধাপে ধাপে সমাধান দেখানো।' },
    takeaway: { en: 'Large gains on reasoning, no extra training.', bn: 'যুক্তিতে বড় উন্নতি, বাড়তি ট্রেনিং ছাড়াই।' },
    scene: 'cot', url: 'https://arxiv.org/abs/2201.11903', readMin: 3, saves: 3100, lang: 'mixed',
  },
  {
    id: 'p3', title: 'Denoising Diffusion Probabilistic Models', source: 'NeurIPS 2020', authors: 'Ho, Jain, Abbeel', year: 2020, topic: 'genai', creatorId: 'mehedi',
    problem: { en: 'GANs are unstable and hard to train.', bn: 'জিএএন অস্থির, ট্রেন করা কঠিন।' },
    keyIdea: { en: 'Add noise step by step, train a model to reverse it.', bn: 'ধাপে ধাপে নয়েজ যোগ, উল্টো পথে ফেরাতে মডেল ট্রেন।' },
    takeaway: { en: 'Stable training, high quality images.', bn: 'স্থির ট্রেনিং, উচ্চমানের ছবি।' },
    scene: 'diffusion', url: 'https://arxiv.org/abs/2006.11239', readMin: 4, saves: 2800, lang: 'en',
  },
  {
    id: 'p4', title: 'ReAct: Reasoning + Acting', source: 'ICLR 2023', authors: 'Yao et al.', year: 2023, topic: 'agents', creatorId: 'rafi',
    problem: { en: 'Reasoning and tool use kept separate. Models hallucinate facts.', bn: 'যুক্তি আর টুল ব্যবহার আলাদা। মডেল ভুল তথ্য বানায়।' },
    keyIdea: { en: 'Interleave thoughts with actions and observations.', bn: 'চিন্তা, কাজ আর পর্যবেক্ষণ পাশাপাশি।' },
    takeaway: { en: 'Fewer hallucinations, stronger agents.', bn: 'কম ভুল তথ্য, শক্তিশালী এজেন্ট।' },
    scene: 'react', url: 'https://arxiv.org/abs/2210.03629', readMin: 3, saves: 2200, lang: 'mixed',
  },
  {
    id: 'p5', title: 'LoRA: Low-Rank Adaptation of LLMs', source: 'ICLR 2022', authors: 'Hu et al.', year: 2022, topic: 'llm', creatorId: 'farhana',
    problem: { en: 'Full fine-tuning of big models is costly.', bn: 'বড় মডেলের পূর্ণ ফাইন-টিউনিং ব্যয়বহুল।' },
    keyIdea: { en: 'Freeze weights, train tiny low-rank matrices.', bn: 'ওয়েট ফ্রিজ, ছোট লো-র‍্যাঙ্ক ম্যাট্রিক্স ট্রেন।' },
    takeaway: { en: '10,000x fewer trainable parameters, same quality.', bn: '১০,০০০ গুণ কম প্যারামিটার, একই মান।' },
    scene: 'lora', url: 'https://arxiv.org/abs/2106.09685', readMin: 3, saves: 3600, lang: 'en',
  },
  {
    id: 'p6', title: 'Scaling Laws for Neural Language Models', source: 'arXiv 2020', authors: 'Kaplan et al.', year: 2020, topic: 'research', creatorId: 'arif',
    problem: { en: 'How big a model, how much data?', bn: 'মডেল কত বড়, ডেটা কত?' },
    keyIdea: { en: 'Loss follows a power law in size, data, compute.', bn: 'আকার, ডেটা, কম্পিউটে লস পাওয়ার ল মেনে চলে।' },
    takeaway: { en: 'Performance is predictable before training.', bn: 'ট্রেনিংয়ের আগেই পারফরম্যান্স অনুমান সম্ভব।' },
    scene: 'scaling', url: 'https://arxiv.org/abs/2001.08361', readMin: 4, saves: 1900, lang: 'en',
  },
];

export const MY_PAPERS_SEED: Paper[] = [
  {
    id: 'mp1', title: 'Dropout: Preventing Overfitting', source: 'JMLR 2014', authors: 'Srivastava et al.', year: 2014, topic: 'dl', creatorId: ME_ID,
    problem: { en: 'Big networks overfit small data.', bn: 'বড় নেটওয়ার্ক ছোট ডেটায় ওভারফিট করে।' },
    keyIdea: { en: 'Randomly drop units during training.', bn: 'ট্রেনিংয়ে এলোমেলোভাবে ইউনিট বাদ।' },
    takeaway: { en: 'Simple, strong regularizer.', bn: 'সহজ, শক্তিশালী রেগুলারাইজার।' },
    scene: 'dropout', url: 'https://jmlr.org/papers/v15/srivastava14a.html', readMin: 2, saves: 12, lang: 'en',
  },
];

export type LessonType = 'video' | 'note' | 'mixed';
export interface Lesson {
  id: string;
  title: L;
  type: LessonType;
  min: number;
  quiz?: string;
  scene?: SceneKind;
}

export interface Course {
  id: string;
  title: L;
  creatorId: string;
  topic: TopicId;
  desc: L;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  lessons: Lesson[];
  learners: number;
  rating: number;
  cover: SceneKind;
  lang: ContentLang;
}

const mk = (prefix: string, items: [string, string, LessonType, number, string?, SceneKind?][]): Lesson[] =>
  items.map(([en, bn, type, min, quiz, scene], i) => ({ id: `${prefix}-${i + 1}`, title: { en, bn }, type, min, quiz, scene }));

export const COURSES: Course[] = [
  {
    id: 'c1', title: { en: 'Neural Networks Fundamentals', bn: 'নিউরাল নেটওয়ার্কের মূলনীতি' }, creatorId: 'nusrat', topic: 'nn',
    desc: { en: 'Neurons to training loops, with PyTorch', bn: 'নিউরন থেকে ট্রেনিং লুপ, পাইটর্চসহ' }, level: 'beginner', learners: 12800, rating: 4.9, cover: 'neural', lang: 'mixed',
    lessons: mk('c1', [
      ['What is a neuron?', 'নিউরন কী?', 'video', 8, 'q-nn1', 'neural'],
      ['Activation functions', 'অ্যাক্টিভেশন ফাংশন', 'note', 6, 'q-nn1'],
      ['The forward pass', 'ফরওয়ার্ড পাস', 'video', 10, undefined, 'dense'],
      ['Loss functions', 'লস ফাংশন', 'mixed', 12, undefined, 'loss'],
      ['Backpropagation', 'ব্যাকপ্রপাগেশন', 'video', 14, 'q-nn2', 'neural'],
      ['Gradient descent', 'গ্রেডিয়েন্ট ডিসেন্ট', 'video', 11, 'q-ml1', 'gradient'],
      ['Training loop in PyTorch', 'পাইটর্চে ট্রেনিং লুপ', 'note', 15],
      ['Overfitting and dropout', 'ওভারফিটিং ও ড্রপআউট', 'video', 9, 'q-ml2', 'dropout'],
      ['Batch norm', 'ব্যাচ নর্ম', 'mixed', 10],
      ['Final project: digit classifier', 'ফাইনাল প্রজেক্ট: ডিজিট ক্লাসিফায়ার', 'mixed', 20, undefined, 'conv'],
    ]),
  },
  {
    id: 'c2', title: { en: 'ML Basics in Bangla', bn: 'বাংলায় এমএল বেসিক' }, creatorId: 'sadia', topic: 'ml',
    desc: { en: 'Regression, classification, evaluation', bn: 'রিগ্রেশন, ক্লাসিফিকেশন, মূল্যায়ন' }, level: 'beginner', learners: 21400, rating: 4.8, cover: 'regression', lang: 'bn',
    lessons: mk('c2', [
      ['What is ML?', 'এমএল কী?', 'video', 7, undefined, 'regression'],
      ['Linear regression', 'লিনিয়ার রিগ্রেশন', 'mixed', 12, 'q-ml1', 'regression'],
      ['Gradient descent', 'গ্রেডিয়েন্ট ডিসেন্ট', 'video', 10, 'q-ml1', 'gradient'],
      ['Logistic regression', 'লজিস্টিক রিগ্রেশন', 'video', 11],
      ['Train / test split', 'ট্রেইন / টেস্ট ভাগ', 'note', 6],
      ['Bias vs variance', 'বায়াস বনাম ভ্যারিয়েন্স', 'mixed', 9, 'q-ml2', 'biasvar'],
      ['Decision trees', 'ডিসিশন ট্রি', 'video', 13],
      ['Metrics: accuracy, F1', 'মেট্রিক: অ্যাকুরেসি, এফ১', 'note', 8],
    ]),
  },
  {
    id: 'c3', title: { en: 'Transformers Deep Dive', bn: 'ট্রান্সফর্মার গভীরে' }, creatorId: 'farhana', topic: 'tf',
    desc: { en: 'Attention, positional encoding, full model', bn: 'অ্যাটেনশন, পজিশনাল এনকোডিং, পূর্ণ মডেল' }, level: 'intermediate', learners: 8400, rating: 4.9, cover: 'attention', lang: 'en',
    lessons: mk('c3', [
      ['Why not RNNs?', 'আরএনএন কেন নয়?', 'video', 8],
      ['Self-attention', 'সেলফ-অ্যাটেনশন', 'mixed', 15, 'q-tf1', 'attention'],
      ['Multi-head attention', 'মাল্টি-হেড অ্যাটেনশন', 'video', 12, 'q-tf1', 'attention'],
      ['Positional encoding', 'পজিশনাল এনকোডিং', 'note', 9],
      ['Encoder and decoder', 'এনকোডার ও ডিকোডার', 'video', 14],
      ['Build a mini Transformer', 'মিনি ট্রান্সফর্মার তৈরি', 'mixed', 25],
    ]),
  },
  {
    id: 'c4', title: { en: 'Build Your First AI Agent', bn: 'প্রথম এআই এজেন্ট তৈরি' }, creatorId: 'rafi', topic: 'agents',
    desc: { en: 'Tools, memory, planning loops', bn: 'টুল, মেমরি, প্ল্যানিং লুপ' }, level: 'intermediate', learners: 6100, rating: 4.7, cover: 'agent', lang: 'mixed',
    lessons: mk('c4', [
      ['What is an agent?', 'এজেন্ট কী?', 'video', 7, undefined, 'agent'],
      ['Tool calling', 'টুল কলিং', 'mixed', 14, 'q-ag1', 'react'],
      ['The ReAct loop', 'রিঅ্যাক্ট লুপ', 'video', 12, 'q-ag1', 'react'],
      ['Memory', 'মেমরি', 'note', 9],
      ['Planning', 'প্ল্যানিং', 'video', 11],
      ['Ship a research agent', 'রিসার্চ এজেন্ট বানাই', 'mixed', 22],
    ]),
  },
  {
    id: 'c5', title: { en: 'Generative AI Essentials', bn: 'জেনারেটিভ এআই এসেনশিয়াল' }, creatorId: 'mehedi', topic: 'genai',
    desc: { en: 'VAEs, GANs, diffusion, prompts', bn: 'ভিএই, জিএএন, ডিফিউশন, প্রম্পট' }, level: 'beginner', learners: 9700, rating: 4.6, cover: 'diffusion', lang: 'en',
    lessons: mk('c5', [
      ['What is GenAI?', 'জেনএআই কী?', 'video', 6],
      ['Autoencoders', 'অটোএনকোডার', 'video', 11],
      ['GANs', 'জিএএন', 'mixed', 13],
      ['Diffusion models', 'ডিফিউশন মডেল', 'video', 15, 'q-gen1', 'diffusion'],
      ['Prompting images', 'ছবির প্রম্পট', 'note', 8],
    ]),
  },
  {
    id: 'c6', title: { en: 'LLMs: Tokens to Chat', bn: 'এলএলএম: টোকেন থেকে চ্যাট' }, creatorId: 'doshomik', topic: 'llm',
    desc: { en: 'Tokenizers, pretraining, fine-tuning, RLHF', bn: 'টোকেনাইজার, প্রিট্রেনিং, ফাইন-টিউনিং, আরএলএইচএফ' }, level: 'advanced', learners: 7300, rating: 4.8, cover: 'tokens', lang: 'mixed',
    lessons: mk('c6', [
      ['Tokenization', 'টোকেনাইজেশন', 'mixed', 10, 'q-llm1', 'tokens'],
      ['Embeddings', 'এমবেডিং', 'video', 9, undefined, 'embed'],
      ['Pretraining', 'প্রিট্রেনিং', 'video', 14],
      ['Fine-tuning with LoRA', 'লোরা দিয়ে ফাইন-টিউনিং', 'mixed', 16, undefined, 'lora'],
      ['RLHF', 'আরএলএইচএফ', 'video', 12],
      ['Prompting patterns', 'প্রম্পটিং প্যাটার্ন', 'note', 8, 'q-llm1', 'cot'],
    ]),
  },
  {
    id: 'c7', title: { en: 'Deep Learning with PyTorch', bn: 'পাইটর্চে ডিপ লার্নিং' }, creatorId: 'tanvir', topic: 'dl',
    desc: { en: 'Tensors, CNNs, training at scale', bn: 'টেনসর, সিএনএন, বড় পরিসরে ট্রেনিং' }, level: 'intermediate', learners: 10900, rating: 4.7, cover: 'conv', lang: 'en',
    lessons: mk('c7', [
      ['Tensors', 'টেনসর', 'video', 9],
      ['Autograd', 'অটোগ্রাড', 'mixed', 11],
      ['CNNs', 'সিএনএন', 'video', 15, 'q-dl1', 'conv'],
      ['Pooling', 'পুলিং', 'note', 6, undefined, 'pool'],
      ['Data loaders', 'ডেটা লোডার', 'note', 8],
      ['GPU training', 'জিপিইউ ট্রেনিং', 'video', 13],
      ['Transfer learning', 'ট্রান্সফার লার্নিং', 'mixed', 14],
    ]),
  },
  {
    id: 'c8', title: { en: 'How to Read a Paper', bn: 'পেপার পড়ার কৌশল' }, creatorId: 'arif', topic: 'research',
    desc: { en: 'Three-pass method, notes, replication', bn: 'থ্রি-পাস পদ্ধতি, নোট, রেপ্লিকেশন' }, level: 'all', learners: 5200, rating: 4.9, cover: 'scaling', lang: 'mixed',
    lessons: mk('c8', [
      ['The three-pass method', 'থ্রি-পাস পদ্ধতি', 'video', 9, 'q-res1'],
      ['Finding good papers', 'ভালো পেপার খোঁজা', 'note', 6],
      ['Reading the math', 'গণিত পড়া', 'mixed', 12],
      ['Writing a Paper Byte', 'পেপার বাইট লেখা', 'video', 10],
    ]),
  },
];

export interface Question {
  q: L;
  options: L[];
  answer: number;
  why: L;
}
export interface QuizSet {
  id: string;
  topic: TopicId;
  title: L;
  level: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
}

export const QUIZZES: QuizSet[] = [
  {
    id: 'q-ml1', topic: 'ml', level: 'beginner', title: { en: 'Regression basics', bn: 'রিগ্রেশন বেসিক' },
    questions: [
      { q: { en: 'Loss for linear regression?', bn: 'লিনিয়ার রিগ্রেশনের লস?' }, options: [{ en: 'Cross-entropy', bn: 'ক্রস-এনট্রপি' }, { en: 'Mean squared error', bn: 'মিন স্কয়ার্ড এরর' }, { en: 'Hinge loss', bn: 'হিঞ্জ লস' }, { en: 'KL divergence', bn: 'কেএল ডাইভারজেন্স' }], answer: 1, why: { en: 'MSE: average squared gap', bn: 'এমএসই: বর্গ পার্থক্যের গড়' } },
      { q: { en: 'Learning rate too high?', bn: 'লার্নিং রেট খুব বেশি হলে?' }, options: [{ en: 'Slow progress', bn: 'ধীর অগ্রগতি' }, { en: 'Loss may diverge', bn: 'লস বেড়ে যেতে পারে' }, { en: 'No effect', bn: 'কোনো প্রভাব নেই' }, { en: 'Model gets smaller', bn: 'মডেল ছোট হয়' }], answer: 1, why: { en: 'Big steps overshoot the minimum', bn: 'বড় ধাপ মিনিমাম পেরিয়ে যায়' } },
      { q: { en: 'Gradient points toward?', bn: 'গ্রেডিয়েন্ট কোন দিকে নির্দেশ করে?' }, options: [{ en: 'Steepest increase', bn: 'সবচেয়ে দ্রুত বৃদ্ধি' }, { en: 'Steepest decrease', bn: 'সবচেয়ে দ্রুত হ্রাস' }, { en: 'Zero', bn: 'শূন্য' }, { en: 'Random', bn: 'এলোমেলো' }], answer: 0, why: { en: 'So we step the opposite way', bn: 'তাই উল্টো দিকে ধাপ নিই' } },
      { q: { en: 'In $\\hat{y}=wx+b$, $b$ is?', bn: '$\\hat{y}=wx+b$-এ $b$ কী?' }, options: [{ en: 'Weight', bn: 'ওয়েট' }, { en: 'Bias', bn: 'বায়াস' }, { en: 'Input', bn: 'ইনপুট' }, { en: 'Loss', bn: 'লস' }], answer: 1, why: { en: 'Intercept term', bn: 'ইন্টারসেপ্ট টার্ম' } },
      { q: { en: 'Before gradient descent, scale features?', bn: 'গ্রেডিয়েন্ট ডিসেন্টের আগে ফিচার স্কেল?' }, options: [{ en: 'Yes, faster convergence', bn: 'হ্যাঁ, দ্রুত কনভার্জেন্স' }, { en: 'No, never', bn: 'না, কখনো না' }, { en: 'Only for images', bn: 'শুধু ছবির জন্য' }, { en: 'Only for text', bn: 'শুধু টেক্সটের জন্য' }], answer: 0, why: { en: 'Even scales, smoother path', bn: 'সমান স্কেল, মসৃণ পথ' } },
    ],
  },
  {
    id: 'q-ml2', topic: 'ml', level: 'beginner', title: { en: 'Overfitting', bn: 'ওভারফিটিং' },
    questions: [
      { q: { en: 'Train 99%, test 60%. Problem?', bn: 'ট্রেইন ৯৯%, টেস্ট ৬০%। সমস্যা?' }, options: [{ en: 'Underfitting', bn: 'আন্ডারফিটিং' }, { en: 'Overfitting', bn: 'ওভারফিটিং' }, { en: 'Data leak', bn: 'ডেটা লিক' }, { en: 'None', bn: 'কিছু না' }], answer: 1, why: { en: 'Memorized train, fails to generalize', bn: 'ট্রেইন মুখস্থ, জেনারেলাইজ করে না' } },
      { q: { en: 'Which reduces overfitting?', bn: 'কোনটি ওভারফিটিং কমায়?' }, options: [{ en: 'More layers', bn: 'আরও লেয়ার' }, { en: 'Dropout', bn: 'ড্রপআউট' }, { en: 'Fewer samples', bn: 'কম ডেটা' }, { en: 'Higher LR', bn: 'বেশি এলআর' }], answer: 1, why: { en: 'Random drops act as regularizer', bn: 'এলোমেলো বাদ রেগুলারাইজারের কাজ করে' } },
      { q: { en: 'High bias means?', bn: 'হাই বায়াস মানে?' }, options: [{ en: 'Too simple model', bn: 'খুব সরল মডেল' }, { en: 'Too complex model', bn: 'খুব জটিল মডেল' }, { en: 'Perfect fit', bn: 'নিখুঁত ফিট' }, { en: 'Noisy labels', bn: 'নয়েজি লেবেল' }], answer: 0, why: { en: 'Misses the real pattern', bn: 'আসল প্যাটার্ন ধরতে পারে না' } },
      { q: { en: 'Early stopping watches?', bn: 'আর্লি স্টপিং কী দেখে?' }, options: [{ en: 'Train loss', bn: 'ট্রেইন লস' }, { en: 'Validation loss', bn: 'ভ্যালিডেশন লস' }, { en: 'GPU memory', bn: 'জিপিইউ মেমরি' }, { en: 'Epoch count', bn: 'ইপক সংখ্যা' }], answer: 1, why: { en: 'Stop when validation stops improving', bn: 'ভ্যালিডেশন উন্নতি থামলে থামুন' } },
    ],
  },
  {
    id: 'q-nn1', topic: 'nn', level: 'beginner', title: { en: 'Neurons and activations', bn: 'নিউরন ও অ্যাক্টিভেশন' },
    questions: [
      { q: { en: 'ReLU of −3?', bn: '−৩-এর ReLU?' }, options: [{ en: '−3', bn: '−৩' }, { en: '0', bn: '০' }, { en: '3', bn: '৩' }, { en: '1', bn: '১' }], answer: 1, why: { en: 'ReLU = max(0, x)', bn: 'ReLU = max(0, x)' } },
      { q: { en: 'Sigmoid output range?', bn: 'সিগময়েড আউটপুটের পরিসর?' }, options: [{ en: '−1 to 1', bn: '−১ থেকে ১' }, { en: '0 to 1', bn: '০ থেকে ১' }, { en: '0 to ∞', bn: '০ থেকে ∞' }, { en: 'Any value', bn: 'যেকোনো মান' }], answer: 1, why: { en: 'Squashes into a probability', bn: 'সম্ভাবনায় রূপান্তর করে' } },
      { q: { en: 'Why non-linear activations?', bn: 'নন-লিনিয়ার অ্যাক্টিভেশন কেন?' }, options: [{ en: 'Faster code', bn: 'দ্রুত কোড' }, { en: 'Learn complex patterns', bn: 'জটিল প্যাটার্ন শেখা' }, { en: 'Less memory', bn: 'কম মেমরি' }, { en: 'No reason', bn: 'কোনো কারণ নেই' }], answer: 1, why: { en: 'Stacked linear layers stay linear', bn: 'লিনিয়ার লেয়ার জুড়লেও লিনিয়ারই থাকে' } },
      { q: { en: 'A neuron computes?', bn: 'একটি নিউরন কী হিসাব করে?' }, options: [{ en: 'Weighted sum + activation', bn: 'ওয়েটেড যোগফল + অ্যাক্টিভেশন' }, { en: 'Only a sum', bn: 'শুধু যোগফল' }, { en: 'Sorting', bn: 'সাজানো' }, { en: 'A random number', bn: 'এলোমেলো সংখ্যা' }], answer: 0, why: { en: '$f(w \\cdot x + b)$', bn: '$f(w \\cdot x + b)$' } },
    ],
  },
  {
    id: 'q-nn2', topic: 'nn', level: 'intermediate', title: { en: 'Backpropagation', bn: 'ব্যাকপ্রপাগেশন' },
    questions: [
      { q: { en: 'Backprop relies on?', bn: 'ব্যাকপ্রপ কিসের উপর নির্ভর করে?' }, options: [{ en: 'Chain rule', bn: 'চেইন রুল' }, { en: 'Bayes rule', bn: 'বেইজ রুল' }, { en: 'Sorting', bn: 'সর্টিং' }, { en: 'Fourier', bn: 'ফুরিয়ার' }], answer: 0, why: { en: 'Gradients flow layer by layer', bn: 'গ্রেডিয়েন্ট লেয়ার ধরে প্রবাহিত হয়' } },
      { q: { en: 'Vanishing gradients common with?', bn: 'ভ্যানিশিং গ্রেডিয়েন্ট বেশি হয়?' }, options: [{ en: 'ReLU', bn: 'ReLU' }, { en: 'Deep sigmoid nets', bn: 'গভীর সিগময়েড নেট' }, { en: 'Linear models', bn: 'লিনিয়ার মডেল' }, { en: 'Trees', bn: 'ট্রি' }], answer: 1, why: { en: 'Sigmoid slopes shrink to near zero', bn: 'সিগময়েডের ঢাল প্রায় শূন্যে নামে' } },
      { q: { en: 'optimizer.zero_grad() does?', bn: 'optimizer.zero_grad() কী করে?' }, options: [{ en: 'Resets gradients', bn: 'গ্রেডিয়েন্ট রিসেট' }, { en: 'Deletes model', bn: 'মডেল মুছে' }, { en: 'Sets LR to 0', bn: 'এলআর ০ করে' }, { en: 'Saves weights', bn: 'ওয়েট সেভ' }], answer: 0, why: { en: 'PyTorch accumulates by default', bn: 'পাইটর্চ ডিফল্টে জমা করে' } },
    ],
  },
  {
    id: 'q-tf1', topic: 'tf', level: 'intermediate', title: { en: 'Attention', bn: 'অ্যাটেনশন' },
    questions: [
      { q: { en: 'Why divide by $\\sqrt{d_k}$?', bn: '$\\sqrt{d_k}$ দিয়ে ভাগ কেন?' }, options: [{ en: 'Stable softmax', bn: 'স্থির সফটম্যাক্স' }, { en: 'Faster GPU', bn: 'দ্রুত জিপিইউ' }, { en: 'Fewer params', bn: 'কম প্যারামিটার' }, { en: 'Tradition', bn: 'প্রথা' }], answer: 0, why: { en: 'Large scores saturate softmax', bn: 'বড় স্কোর সফটম্যাক্সকে স্যাচুরেট করে' } },
      { q: { en: 'Attention weights sum to?', bn: 'অ্যাটেনশন ওয়েটের যোগফল?' }, options: [{ en: '0', bn: '০' }, { en: '1', bn: '১' }, { en: '$d_k$', bn: '$d_k$' }, { en: 'Any', bn: 'যেকোনো' }], answer: 1, why: { en: 'Softmax output per row', bn: 'প্রতি সারিতে সফটম্যাক্স আউটপুট' } },
      { q: { en: 'Multi-head attention gives?', bn: 'মাল্টি-হেড অ্যাটেনশন দেয়?' }, options: [{ en: 'Several views at once', bn: 'একসাথে কয়েকটি দৃষ্টিভঙ্গি' }, { en: 'Smaller model', bn: 'ছোট মডেল' }, { en: 'No softmax', bn: 'সফটম্যাক্স ছাড়া' }, { en: 'Recurrence', bn: 'রিকারেন্স' }], answer: 0, why: { en: 'Each head learns a different relation', bn: 'প্রতিটি হেড ভিন্ন সম্পর্ক শেখে' } },
      { q: { en: 'Positional encoding adds?', bn: 'পজিশনাল এনকোডিং যোগ করে?' }, options: [{ en: 'Word order info', bn: 'শব্দের ক্রম' }, { en: 'Grammar rules', bn: 'ব্যাকরণ' }, { en: 'Noise', bn: 'নয়েজ' }, { en: 'Labels', bn: 'লেবেল' }], answer: 0, why: { en: 'Attention alone ignores order', bn: 'শুধু অ্যাটেনশন ক্রম বোঝে না' } },
    ],
  },
  {
    id: 'q-llm1', topic: 'llm', level: 'intermediate', title: { en: 'Tokens and prompts', bn: 'টোকেন ও প্রম্পট' },
    questions: [
      { q: { en: 'A token is usually?', bn: 'টোকেন সাধারণত?' }, options: [{ en: 'A sub-word piece', bn: 'শব্দের অংশ' }, { en: 'A sentence', bn: 'একটি বাক্য' }, { en: 'A page', bn: 'একটি পৃষ্ঠা' }, { en: 'A pixel', bn: 'একটি পিক্সেল' }], answer: 0, why: { en: 'BPE splits rare words', bn: 'বিপিই বিরল শব্দ ভাগ করে' } },
      { q: { en: 'Chain-of-thought helps with?', bn: 'চেইন-অফ-থট কোথায় সাহায্য করে?' }, options: [{ en: 'Multi-step reasoning', bn: 'বহু-ধাপের যুক্তি' }, { en: 'Image quality', bn: 'ছবির মান' }, { en: 'Speed', bn: 'গতি' }, { en: 'Tokenizing', bn: 'টোকেনাইজিং' }], answer: 0, why: { en: 'Explicit steps, fewer slips', bn: 'স্পষ্ট ধাপ, কম ভুল' } },
      { q: { en: 'Temperature 0 means?', bn: 'টেম্পারেচার ০ মানে?' }, options: [{ en: 'Most likely token', bn: 'সবচেয়ে সম্ভাব্য টোকেন' }, { en: 'Random output', bn: 'এলোমেলো আউটপুট' }, { en: 'No output', bn: 'আউটপুট নেই' }, { en: 'Longer output', bn: 'লম্বা আউটপুট' }], answer: 0, why: { en: 'Greedy, deterministic', bn: 'গ্রিডি, নির্ধারিত' } },
    ],
  },
  {
    id: 'q-ag1', topic: 'agents', level: 'intermediate', title: { en: 'Agent loop', bn: 'এজেন্ট লুপ' },
    questions: [
      { q: { en: 'ReAct interleaves?', bn: 'রিঅ্যাক্ট কী মেশায়?' }, options: [{ en: 'Thoughts and actions', bn: 'চিন্তা ও কাজ' }, { en: 'GPUs and CPUs', bn: 'জিপিইউ ও সিপিইউ' }, { en: 'Images and audio', bn: 'ছবি ও অডিও' }, { en: 'Train and test', bn: 'ট্রেইন ও টেস্ট' }], answer: 0, why: { en: 'Reason, act, observe', bn: 'যুক্তি, কাজ, পর্যবেক্ষণ' } },
      { q: { en: 'Who runs the tool?', bn: 'টুল কে চালায়?' }, options: [{ en: 'The app', bn: 'অ্যাপ' }, { en: 'The model weights', bn: 'মডেলের ওয়েট' }, { en: 'The tokenizer', bn: 'টোকেনাইজার' }, { en: 'Nobody', bn: 'কেউ না' }], answer: 0, why: { en: 'Model only picks and fills args', bn: 'মডেল শুধু বাছাই করে ও আর্গুমেন্ট দেয়' } },
      { q: { en: 'Best tool design?', bn: 'সেরা টুল ডিজাইন?' }, options: [{ en: 'Small and focused', bn: 'ছোট ও নির্দিষ্ট' }, { en: 'One giant tool', bn: 'একটি বিশাল টুল' }, { en: 'No descriptions', bn: 'বিবরণ ছাড়া' }, { en: 'Random names', bn: 'এলোমেলো নাম' }], answer: 0, why: { en: 'Easier to choose correctly', bn: 'সঠিকভাবে বাছাই সহজ' } },
    ],
  },
  {
    id: 'q-gen1', topic: 'genai', level: 'beginner', title: { en: 'Diffusion', bn: 'ডিফিউশন' },
    questions: [
      { q: { en: 'Diffusion model learns to?', bn: 'ডিফিউশন মডেল কী শেখে?' }, options: [{ en: 'Remove noise', bn: 'নয়েজ সরাতে' }, { en: 'Add labels', bn: 'লেবেল যোগ' }, { en: 'Compress text', bn: 'টেক্সট সংকোচন' }, { en: 'Sort pixels', bn: 'পিক্সেল সাজানো' }], answer: 0, why: { en: 'Reverse the noising process', bn: 'নয়েজিং প্রক্রিয়া উল্টানো' } },
      { q: { en: 'Generation starts from?', bn: 'জেনারেশন শুরু হয়?' }, options: [{ en: 'Pure noise', bn: 'শুধু নয়েজ' }, { en: 'A blank canvas', bn: 'ফাঁকা ক্যানভাস' }, { en: 'A real photo', bn: 'আসল ছবি' }, { en: 'Text only', bn: 'শুধু টেক্সট' }], answer: 0, why: { en: 'Denoise step by step', bn: 'ধাপে ধাপে ডিনয়েজ' } },
      { q: { en: 'More steps usually give?', bn: 'বেশি ধাপে সাধারণত?' }, options: [{ en: 'Higher quality, slower', bn: 'ভালো মান, ধীর' }, { en: 'Lower quality', bn: 'খারাপ মান' }, { en: 'No change', bn: 'পরিবর্তন নেই' }, { en: 'Smaller images', bn: 'ছোট ছবি' }], answer: 0, why: { en: 'Quality vs speed tradeoff', bn: 'মান বনাম গতির ট্রেডঅফ' } },
    ],
  },
  {
    id: 'q-dl1', topic: 'dl', level: 'intermediate', title: { en: 'CNNs', bn: 'সিএনএন' },
    questions: [
      { q: { en: 'Convolution kernel does?', bn: 'কনভোলিউশন কার্নেল কী করে?' }, options: [{ en: 'Detects local patterns', bn: 'স্থানীয় প্যাটার্ন খোঁজে' }, { en: 'Sorts pixels', bn: 'পিক্সেল সাজায়' }, { en: 'Adds labels', bn: 'লেবেল যোগ করে' }, { en: 'Resizes dataset', bn: 'ডেটাসেট ছোট করে' }], answer: 0, why: { en: 'Edges, textures, shapes', bn: 'এজ, টেক্সচার, আকার' } },
      { q: { en: 'Max pooling 2×2 on 4×4 gives?', bn: '৪×৪-এ ২×২ ম্যাক্স পুলিং দেয়?' }, options: [{ en: '2×2', bn: '২×২' }, { en: '4×4', bn: '৪×৪' }, { en: '8×8', bn: '৮×৮' }, { en: '1×1', bn: '১×১' }], answer: 0, why: { en: 'Halves each dimension', bn: 'প্রতিটি মাত্রা অর্ধেক' } },
      { q: { en: 'Softmax output?', bn: 'সফটম্যাক্স আউটপুট?' }, options: [{ en: 'Class probabilities', bn: 'ক্লাসের সম্ভাবনা' }, { en: 'Raw pixels', bn: 'কাঁচা পিক্সেল' }, { en: 'Loss value', bn: 'লসের মান' }, { en: 'Learning rate', bn: 'লার্নিং রেট' }], answer: 0, why: { en: 'Positive, sums to 1', bn: 'ধনাত্মক, যোগফল ১' } },
    ],
  },
  {
    id: 'q-res1', topic: 'research', level: 'beginner', title: { en: 'Reading papers', bn: 'পেপার পড়া' },
    questions: [
      { q: { en: 'First pass of a paper?', bn: 'পেপারের প্রথম পাস?' }, options: [{ en: 'Title, abstract, figures', bn: 'শিরোনাম, অ্যাবস্ট্রাক্ট, ফিগার' }, { en: 'Every proof', bn: 'প্রতিটি প্রমাণ' }, { en: 'References only', bn: 'শুধু রেফারেন্স' }, { en: 'Appendix', bn: 'পরিশিষ্ট' }], answer: 0, why: { en: 'Big picture first', bn: 'আগে বড় ছবি' } },
      { q: { en: 'A good Paper Byte has?', bn: 'ভালো পেপার বাইটে থাকে?' }, options: [{ en: 'Problem, key idea, takeaway', bn: 'সমস্যা, মূল আইডিয়া, শিক্ষা' }, { en: 'Only the title', bn: 'শুধু শিরোনাম' }, { en: 'Full PDF copy', bn: 'পুরো পিডিএফ' }, { en: 'Author bios', bn: 'লেখক পরিচিতি' }], answer: 0, why: { en: 'Three fields, one minute', bn: 'তিনটি অংশ, এক মিনিট' } },
      { q: { en: 'arXiv papers are?', bn: 'আরক্সিভ পেপার?' }, options: [{ en: 'Preprints', bn: 'প্রিপ্রিন্ট' }, { en: 'Always peer reviewed', bn: 'সবসময় পিয়ার রিভিউড' }, { en: 'Textbooks', bn: 'পাঠ্যবই' }, { en: 'Blog posts', bn: 'ব্লগ পোস্ট' }], answer: 0, why: { en: 'Check for later publication', bn: 'পরবর্তী প্রকাশনা যাচাই করুন' } },
    ],
  },
];

export type ActivityKind = 'like' | 'follow' | 'comment' | 'reply' | 'course';
export interface Activity {
  id: string;
  kind: ActivityKind;
  who: string;
  text?: L;
  target: { screen: string; params?: Record<string, unknown> };
  thumb?: SceneKind;
  time: L;
  unread: boolean;
}

export const ACTIVITY: Activity[] = [
  { id: 'a1', kind: 'like', who: 'nusrat', target: { screen: 'note', params: { id: 'm1' } }, thumb: 'regression', time: { en: '5m', bn: '৫ মি' }, unread: true },
  { id: 'a2', kind: 'follow', who: 'farhana', target: { screen: 'creator', params: { id: 'farhana' } }, time: { en: '20m', bn: '২০ মি' }, unread: true },
  { id: 'a3', kind: 'comment', who: 'tanvir', text: { en: 'Clean plot! Try a log scale', bn: 'চমৎকার প্লট! লগ স্কেল দেখুন' }, target: { screen: 'post', params: { id: 'm2' } }, thumb: 'regression', time: { en: '1h', bn: '১ ঘ' }, unread: true },
  { id: 'a4', kind: 'reply', who: 'sadia', text: { en: 'Yes, scale features first', bn: 'হ্যাঁ, আগে ফিচার স্কেল' }, target: { screen: 'note', params: { id: 'n1' } }, thumb: 'regression', time: { en: '3h', bn: '৩ ঘ' }, unread: false },
  { id: 'a5', kind: 'course', who: 'nusrat', text: { en: 'New lesson: Batch norm', bn: 'নতুন লেসন: ব্যাচ নর্ম' }, target: { screen: 'course', params: { id: 'c1' } }, thumb: 'neural', time: { en: '5h', bn: '৫ ঘ' }, unread: false },
  { id: 'a6', kind: 'like', who: 'rafi', target: { screen: 'post', params: { id: 'm2' } }, thumb: 'regression', time: { en: '1d', bn: '১ দি' }, unread: false },
  { id: 'a7', kind: 'follow', who: 'mehedi', target: { screen: 'creator', params: { id: 'mehedi' } }, time: { en: '2d', bn: '২ দি' }, unread: false },
  { id: 'a8', kind: 'comment', who: 'arif', text: { en: 'Great summary', bn: 'দারুণ সামারি' }, target: { screen: 'paper', params: { id: 'mp1' } }, thumb: 'dropout', time: { en: '3d', bn: '৩ দি' }, unread: false },
];

export interface Comment {
  id: string;
  who: string;
  text: L;
  time: L;
  likes: number;
}

export const COMMENT_POOL: Comment[] = [
  { id: 'k1', who: 'tanvir', text: { en: 'Best backprop visual so far', bn: 'এখন পর্যন্ত সেরা ব্যাকপ্রপ ভিজ্যুয়াল' }, time: { en: '1h', bn: '১ ঘ' }, likes: 214 },
  { id: 'k2', who: 'sadia', text: { en: 'Part 4 please!', bn: 'পার্ট ৪ চাই!' }, time: { en: '2h', bn: '২ ঘ' }, likes: 96 },
  { id: 'k3', who: 'rafi', text: { en: 'Saved for exam week', bn: 'পরীক্ষার জন্য সেভ করলাম' }, time: { en: '3h', bn: '৩ ঘ' }, likes: 41 },
  { id: 'k4', who: 'mehedi', text: { en: 'Bangla version?', bn: 'বাংলা ভার্সন?' }, time: { en: '5h', bn: '৫ ঘ' }, likes: 18 },
  { id: 'k5', who: 'arif', text: { en: 'Clear and accurate', bn: 'স্পষ্ট ও নির্ভুল' }, time: { en: '1d', bn: '১ দি' }, likes: 12 },
];

export const RECENT_SEARCHES = ['backprop', 'LoRA', 'attention'];
export const SUGGESTED_TOPICS: TopicId[] = ['tf', 'agents', 'genai', 'llm'];

export const findCreator = (id: string): Creator => (id === ME_ID ? ME : CREATORS.find((c) => c.id === id) || CREATORS[0]);

export const allBasePosts: Post[] = [...REELS, ...IMAGES, ...NOTES];
