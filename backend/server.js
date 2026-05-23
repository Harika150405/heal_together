require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./src/db');

const app = express();
const PORT = process.env.PORT || 3009;

// Enable CORS for localhost, local Wi-Fi network IPs, and sharing tunnels
app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow any origin to facilitate easy local testing across Wi-Fi and tunnels
    callback(null, true);
  },
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing
const authRouter = require('./src/routes/auth');
const storiesRouter = require('./src/routes/stories');
const chatRouter = require('./src/routes/chat');
const adminRouter = require('./src/routes/admin');

app.use('/api/auth', authRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/chat', chatRouter);
app.use('/api/admin', adminRouter);

// Get all community names (helpful for story dropdown)
app.get('/api/communities/list', async (req, res) => {
  try {
    const list = await prisma.communityGroup.findMany({
      select: { groupName: true }
    });
    res.status(200).json(list.map(c => c.groupName));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Base Route
app.get('/', (req, res) => {
  res.send('HealTogether Express API Server is Running!');
});

// Seed function for default community groups
async function seedCommunities() {
  const defaultGroups = [
    { name: 'Diabetes', tagline: 'Stronger every day, one step at a time.', desc: 'A chronic condition that affects how your body turns food into energy. Share tips on management and daily life.' },
    { name: 'Hypertension', tagline: 'Stay calm, stay strong.', desc: 'High blood pressure that can lead to serious health issues. Discuss lifestyle changes and treatments.' },
    { name: 'Depression', tagline: 'Hope is stronger than despair.', desc: 'A mood disorder characterized by persistent sadness and loss of interest. Find support and coping strategies.' },
    { name: 'Anxiety', tagline: 'Breathe. Heal. Grow.', desc: 'A mental health disorder with excessive worry and fear. Connect with others to share experiences and advice.' },
    { name: 'Arthritis', tagline: 'Keep moving, keep shining.', desc: 'Inflammation of the joints causing pain and stiffness. Exchange tips on pain management and daily activities.' },
    { name: 'Breast Cancer', tagline: 'Strength in pink, hope in every step.', desc: 'Support for those affected by breast cancer. Share experiences, treatments, and resources.' },
    { name: 'Blood Cancer', tagline: 'Every drop of courage counts.', desc: 'Community for blood cancer patients. Discuss leukemia, lymphoma, and support options.' },
    { name: 'Lung Cancer', tagline: 'Every breath is a victory, every step is hope.', desc: 'Support group for lung cancer survivors and patients. Share coping strategies.' },
    { name: 'COVID-19', tagline: 'Healing together, stronger tomorrow.', desc: 'Long-term effects and recovery from COVID-19. Connect with others for support.' },
    { name: 'Chronic Kidney Disease', tagline: 'Together through every dialysis and beyond.', desc: 'Management and support for chronic kidney disease. Share dialysis experiences.' },
    { name: 'Epilepsy', tagline: 'Breaking the silence, embracing strength.', desc: 'Support for epilepsy patients. Discuss seizures, medications, and daily life.' },
    { name: 'Down Syndrome', tagline: 'Celebrating abilities, not disabilities.', desc: 'Community for families and individuals with Down Syndrome. Share resources and stories.' },
    { name: 'Cardiovascular Diseases', tagline: 'Healing hearts, inspiring lives.', desc: 'Heart health and cardiovascular support. Discuss prevention and treatments.' },
    { name: 'COPD', tagline: 'Endurance is power.', desc: 'Chronic Obstructive Pulmonary Disease support. Breathing techniques and lifestyle tips.' },
    { name: 'HIV/AIDS', tagline: 'Living with courage, thriving with hope.', desc: 'Support for HIV/AIDS patients. Discuss treatments, stigma, and living positively.' },
    { name: 'PTSD', tagline: 'Healing is not forgetting, it’s learning to live again.', desc: 'Post-Traumatic Stress Disorder support. Share coping mechanisms and therapy experiences.' },
    { name: 'Schizophrenia', tagline: 'Breaking stigma, embracing strength of mind.', desc: 'Support for schizophrenia. Discuss symptoms, medications, and recovery.' },
    { name: 'Lupus', tagline: 'Living with strength, not just survival.', desc: 'Autoimmune disease support for lupus patients. Share flare management tips.' },
    { name: 'Multiple Sclerosis', tagline: 'Strength in motion, hope in every step.', desc: 'MS support group. Discuss symptoms, treatments, and mobility aids.' },
    { name: 'Alzheimer\'s', tagline: 'Compassion in every memory.', desc: 'Support for Alzheimer\'s patients and caregivers. Share care strategies.' },
    { name: 'PCOS/PCOD', tagline: 'Stronger than the struggle.', desc: 'Polycystic Ovary Syndrome support. Discuss symptoms, fertility, and management.' },
    { name: 'Infertility Support', tagline: 'Hope grows here.', desc: 'Support for couples facing infertility. Share experiences and resources.' },
    { name: 'Endometriosis', tagline: 'Pain does not define you.', desc: 'Support for endometriosis patients. Discuss pain management and treatments.' },
    { name: 'Menopause Health', tagline: 'Embracing change with grace.', desc: 'Menopause support. Share hot flashes, mood changes, and health tips.' }
  ];

  try {
    for (const g of defaultGroups) {
      await prisma.communityGroup.upsert({
        where: { groupName: g.name },
        update: {},
        create: {
          groupName: g.name,
          tagline: g.tagline,
          description: g.desc
        }
      });
    }
    console.log('Database community groups seeded successfully!');
  } catch (err) {
    console.error('Failed to seed communities:', err);
  }
}

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Seed the initial communities in DB
  await seedCommunities();
});
// Trigger nodemon reload for port cleanup
