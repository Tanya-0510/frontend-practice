// =====================
// TASK 2: VIDEO CAROUSEL + CHAPTERS
// =====================

const videos = [
  "RJTCAL1DRro",
  "jj_aUFX8SV8",
  "xmmxkmVSiq0"
];

let currentIndex = 0;

const chaptersData = {
  "RJTCAL1DRro": [
    { time: 0,   label: "Intro" },
    { time: 30,  label: "Overview" },
    { time: 90,  label: "Core Concept" },
    { time: 180, label: "Examples" },
    { time: 300, label: "Wrap Up" }
  ],
  "jj_aUFX8SV8": [
    { time: 0,  label: "Start" },
    { time: 40, label: "Explanation" },
    { time: 120, label: "Deep Dive" },
    { time: 240, label: "Conclusion" }
  ],
  "xmmxkmVSiq0": [
    { time: 0,   label: "Opening" },
    { time: 50,  label: "Main Topic" },
    { time: 150, label: "Case Study" },
    { time: 280, label: "Summary" }
  ]
};

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function loadVideo() {
  const id = videos[currentIndex];
  const iframe = document.getElementById("videoPlayer");
  iframe.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
  showChapters(id);
  updateIndicators();
}

function nextVideo() {
  currentIndex = (currentIndex + 1) % videos.length;
  loadVideo();
}

function prevVideo() {
  currentIndex = (currentIndex - 1 + videos.length) % videos.length;
  loadVideo();
}

function goToVideo(index) {
  currentIndex = index;
  loadVideo();
}

function showChapters(videoId) {
  const list = document.getElementById("chapters");
  list.innerHTML = "";

  chaptersData[videoId].forEach(ch => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="ch-time">${formatTime(ch.time)}</span><span class="ch-label">${ch.label}</span>`;
    li.onclick = () => {
      document.getElementById("videoPlayer").src =
        `https://www.youtube.com/embed/${videoId}?start=${ch.time}&autoplay=1`;
    };
    list.appendChild(li);
  });
}

function updateIndicators() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === currentIndex);
  });
}

// =====================
// TASK 2: AUTOMATED CHAPTER GENERATOR
// =====================

function generateAutomatedChapters() {
  const url = document.getElementById("youtubeUrl").value.trim();
  let videoId = "";

  try {
    const urlObj = new URL(url);
    videoId = urlObj.searchParams.get("v");
  } catch (e) {
    alert("Please enter a valid YouTube URL.");
    return;
  }

  if (!videoId) {
    alert("Could not extract video ID. Make sure the URL contains ?v=...");
    return;
  }

  const list = document.getElementById("autoChapters");
  list.innerHTML = "";

  const auto = [
    { time: 0,   label: "Intro" },
    { time: 60,  label: "Background & Context" },
    { time: 120, label: "Main Topic" },
    { time: 240, label: "Deep Dive" },
    { time: 360, label: "Key Takeaways" },
    { time: 480, label: "Conclusion" }
  ];

  // Show the iframe with the entered video
  const previewIframe = document.getElementById("autoPreview");
  if (previewIframe) {
    previewIframe.src = `https://www.youtube.com/embed/${videoId}`;
    previewIframe.style.display = "block";
  }

  auto.forEach(ch => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="ch-time">${formatTime(ch.time)}</span><span class="ch-label">${ch.label}</span>`;
    li.onclick = () => {
      if (previewIframe) {
        previewIframe.src = `https://www.youtube.com/embed/${videoId}?start=${ch.time}&autoplay=1`;
      }
    };
    list.appendChild(li);
  });
}

// =====================
// TASK 3: YOUTUBE PLAYER + FORM OVERLAY (6 SEC DELAY)
// =====================

let task3Player;
let formShown = false;
let watchInterval = null;

function onYouTubeIframeAPIReady() {
  task3Player = new YT.Player("ytPlayer", {
    height: "360",
    width: "640",
    videoId: "RJTCAL1DRro",
    playerVars: { rel: 0, modestbranding: 1 },
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  // Only trigger once when video starts playing
  if (event.data === YT.PlayerState.PLAYING && !formShown) {
    formShown = true;
    setTimeout(() => {
      const box = document.getElementById("formBox");
      if (box) {
        box.style.display = "block";
        // Re-trigger animation by resetting it
        box.style.animation = "none";
        box.offsetHeight; // force reflow
        box.style.animation = "fadeInUp 0.5s ease forwards";
      }
    }, 6000); // 6 seconds delay
  }
}

function closeForm() {
  const box = document.getElementById("formBox");
  if (box) box.style.display = "none";
}

// Init on page load
window.addEventListener("DOMContentLoaded", () => {
  loadVideo();
});