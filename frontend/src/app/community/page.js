"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

const defaultGroups = [
  { name: 'Diabetes', tagline: 'Stronger every day, one step at a time.', desc: 'A chronic condition that affects how your body turns food into energy. Share tips on management and daily life.', logo: 'diabetes' },
  { name: 'Hypertension', tagline: 'Stay calm, stay strong.', desc: 'High blood pressure that can lead to serious health issues. Discuss lifestyle changes and treatments.', logo: 'hypertension' },
  { name: 'Depression', tagline: 'Hope is stronger than despair.', desc: 'A mood disorder characterized by persistent sadness and loss of interest. Find support and coping strategies.', logo: 'depression' },
  { name: 'Anxiety', tagline: 'Breathe. Heal. Grow.', desc: 'A mental health disorder with excessive worry and fear. Connect with others to share experiences and advice.', logo: 'anxiety' },
  { name: 'Arthritis', tagline: 'Keep moving, keep shining.', desc: 'Inflammation of the joints causing pain and stiffness. Exchange tips on pain management and daily activities.', logo: 'arthritis' },
  { name: 'Breast Cancer', tagline: 'Strength in pink, hope in every step.', desc: 'Support for those affected by breast cancer. Share experiences, treatments, and resources.', logo: 'breast cancer.jpg' },
  { name: 'Blood Cancer', tagline: 'Every drop of courage counts.', desc: 'Community for blood cancer patients. Discuss leukemia, lymphoma, and support options.', logo: 'blood cancer.jpg' },
  { name: 'Lung Cancer', tagline: 'Every breath is a victory, every step is hope.', desc: 'Support group for lung cancer survivors and patients. Share coping strategies.', logo: 'lung cancer.jpg' },
  { name: 'COVID-19', tagline: 'Healing together, stronger tomorrow.', desc: 'Long-term effects and recovery from COVID-19. Connect with others for support.', logo: 'covid-19.png' },
  { name: 'Chronic Kidney Disease', tagline: 'Together through every dialysis and beyond.', desc: 'Management and support for chronic kidney disease. Share dialysis experiences.', logo: 'chronic kidney disease.jpg' },
  { name: 'Epilepsy', tagline: 'Breaking the silence, embracing strength.', desc: 'Support for epilepsy patients. Discuss seizures, medications, and daily life.', logo: 'epilepsy.png' },
  { name: 'Down Syndrome', tagline: 'Celebrating abilities, not disabilities.', desc: 'Community for families and individuals with Down Syndrome. Share resources and stories.', logo: 'down syndrome.png' },
  { name: 'Cardiovascular Diseases', tagline: 'Healing hearts, inspiring lives.', desc: 'Heart health and cardiovascular support. Discuss prevention and treatments.', logo: 'cardiovascular disease.jpg' },
  { name: 'COPD', tagline: 'Endurance is power.', desc: 'Chronic Obstructive Pulmonary Disease support. Breathing techniques and lifestyle tips.', logo: 'copd.jpg' },
  { name: 'HIV/AIDS', tagline: 'Living with courage, thriving with hope.', desc: 'Support for HIV/AIDS patients. Discuss treatments, stigma, and living positively.', logo: 'hiv.jpg' },
  { name: 'PTSD', tagline: 'Healing is not forgetting, it’s learning to live again.', desc: 'Post-Traumatic Stress Disorder support. Share coping mechanisms and therapy experiences.', logo: 'ptsd.jpg' },
  { name: 'Schizophrenia', tagline: 'Breaking stigma, embracing strength of mind.', desc: 'Support for schizophrenia. Discuss symptoms, medications, and recovery.', logo: 'schizophernia.png' },
  { name: 'Lupus', tagline: 'Living with strength, not just survival.', desc: 'Autoimmune disease support for lupus patients. Share flare management tips.', logo: 'lupus.png' },
  { name: 'Multiple Sclerosis', tagline: 'Strength in motion, hope in every step.', desc: 'MS support group. Discuss symptoms, treatments, and mobility aids.', logo: 'multiple sclerosis.png' },
  { name: 'Alzheimer\'s', tagline: 'Compassion in every memory.', desc: 'Support for Alzheimer\'s patients and caregivers. Share care strategies.', logo: 'alzheimer.png' },
  { name: 'PCOS/PCOD', tagline: 'Stronger than the struggle.', desc: 'Polycystic Ovary Syndrome support. Discuss symptoms, fertility, and management.', logo: 'pcos.jpg' },
  { name: 'Infertility Support', tagline: 'Hope grows here.', desc: 'Support for couples facing infertility. Share experiences and resources.', logo: 'infertility.png' },
  { name: 'Endometriosis', tagline: 'Pain does not define you.', desc: 'Support for endometriosis patients. Discuss pain management and treatments.', logo: 'endometriosis.png' },
  { name: 'Menopause Health', tagline: 'Embracing change with grace.', desc: 'Menopause support. Share hot flashes, mood changes, and health tips.', logo: 'menopause.jpg' }
];

export default function CommunityPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedList, setJoinedList] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/");
      return;
    }
    setToken(t);

    // Fetch joined communities
    const fetchJoined = async () => {
      try {
        const res = await fetch("http://192.168.39.157:3009/api/chat/my-communities", {
          headers: { Authorization: `Bearer ${t}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJoinedList(data.map(item => item.communityName));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchJoined();
  }, [router]);

  const handleJoin = async (groupName) => {
    try {
      const res = await fetch("http://192.168.39.157:3009/api/chat/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ communityName: groupName })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.message === "success") {
          alert("Successfully Joined Group!");
        } else if (data.message === "already") {
          alert("Already joined this group.");
        }
        // Redirect to chat
        router.push(`/chat/${encodeURIComponent(groupName)}`);
      } else {
        alert(data.error || "Could not join group.");
      }
    } catch (err) {
      console.error(err);
      alert("Error joining group. Please try again.");
    }
  };

  const filteredGroups = defaultGroups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) return null;

  return (
    <div className="community-theme" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      
      <main className="container-fluid py-5">
        <h1 style={{ color: "#2c3e50", fontWeight: "700" }}>Support Communities</h1>
        <p className="fs-5 text-muted">Select a community below to connect, chat, and share your experiences.</p>

        <div className="d-flex justify-content-center mb-5 gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "400px", padding: "12px 18px", borderRadius: "25px", fontSize: "16px", border: "1px solid #ced4da" }}
          />
          <button 
            onClick={() => router.push("/my-communities")} 
            className="btn btn-outline-secondary px-4" 
            style={{ borderRadius: "25px" }}
          >
            My Joined Groups
          </button>
        </div>

        <div className="groups-container">
          {filteredGroups.map((group, idx) => (
            <div key={idx} className="group-card">
              <img
                src={`/logos/${group.logo}`}
                alt={group.name}
                onError={(e) => {
                  e.target.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9JusyOxrmJsgeLDHppsCKAF17Cpdf5kFnbQ&s";
                }}
              />
              <h3>{group.name}</h3>
              <p className="tagline">{group.tagline}</p>
              <p className="text-muted" style={{ fontSize: "14px" }}>{group.desc}</p>
              <button onClick={() => handleJoin(group.name)} className="join-btn w-100 mt-2">
                {joinedList.includes(group.name) ? "Open Chat" : "Join Chat"}
              </button>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <div className="w-100 text-center py-5 text-muted">
              <h4>No communities found matching your search.</h4>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
