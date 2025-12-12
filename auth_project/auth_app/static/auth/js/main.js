console.log("✅ main.js connected successfully");

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Hide loader
  // -------------------------
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
  });

  // -------------------------
  // Dark Mode
  // -------------------------
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    if (themeToggle) themeToggle.textContent = "☀️ ";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      themeToggle.textContent = isDark ? "☀️" : "🌙";
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  // -------------------------
  // Side Menu
  // -------------------------
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (menuToggle && sideMenu && closeMenu) {
    menuToggle.addEventListener("click", () => sideMenu.classList.add("active"));
    closeMenu.addEventListener("click", () => sideMenu.classList.remove("active"));

    window.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && e.target !== menuToggle) {
        sideMenu.classList.remove("active");
      }
    });
  }
/* login section */


  // -------------------------
  // Gallery logic
  // -------------------------
  const gallery = document.getElementById("gallerySection");
  const view = document.getElementById("photoView");
  const title = document.getElementById("photoTitle");
  const img = document.getElementById("photoImg");
  const desc = document.getElementById("photoDesc");
  const searchInput = document.getElementById("searchInput");
  let currentDownloadUrl = "";

  if (gallery) {
    // Home / Movies photos
    const homePhotos = [
      { id: 1, src: "https://i.ibb.co/sd1QZwyf/https-youtu-be-Gu-S6fq-L-Hf-Q-si-SPb-Ei-Tolf-Xe2-ZF1.jpg", title: "Mrs.", desc: "A Hindi drama directed by Arati Kadav...", downloadUrl: "https://mega.nz/file/gHFC1KxS#PBVuEATA8w0eOlorWjJgcUbjJZq8Q_OClX3_h85vrrc" },
      { id: 2, src: "https://i.ibb.co/p6SY8x0T/Maharaja.jpg", title: "Maharaja ", desc: "A Tamil thriller starring Vijay Sethupathi...", downloadUrl: "https://mega.nz/file/xSEQlZKI#mFdgN9WFMfnRMzdLvdXzlzoU_lR6sdg_y7ULmrfWAJs" },
      { id: 3, src: "https://i.ibb.co/Lzj0BjcM/3-5-5-2-States-Boy-meets-girl-boy-loves-girl.jpg", title: "2 States", desc: "2 States is a 2014 Hindi romantic comedy...", downloadUrl: "#" },
      { id: 4, src: "https://i.ibb.co/vxdfg2ny/Super-Deluxe-quite-different-with-very-unique.jpg", title: "Super Deluxe", desc: "Super Deluxe is a critically acclaimed 2019 Tamil-language film...", downloadUrl: "https://mega.nz/file/cTkVlL5Q#xsVf_XKaHphVA0Tr4Fq4qx9R9e1M-6QWrvHHTCNwbFk" },
      { id: 5, src: "https://i.ibb.co/1f3VJdJx/Vanilla-Sky-is-my-favorite-movie-of-all-time.jpg", title: "Vanilla Sky", desc: "Vanilla Sky is a 2001 American science fiction thriller...", downloadUrl: "https://vcloud.cx/bb9247" },
      { id: 6, src: "https://i.ibb.co/Hf4dLYhd/The-Gangster-the-Cop-the-Devil.jpg", title: "The Gangster, the Cop, the Devil", desc: "A strange murder after a car accident compels a police officer to think that it is the work of a serial killer. When a gangster falls prey to a similar incident, he joins forces with the officer.", downloadUrl: "https://new2.sdshare.cfd/s/67297537" },
      { id: 7, src: "https://i.ibb.co/s9zP14Vz/download-5.jpg", title: "highschool return of a gangster (jaatu rohit fav)",desc:"High School Return of a Gangster is a 2024 South Korean fantasy teen action television series starring Yoon Chan-young, Bong Jae-hyun and Lee Seo-jin.", downloadUrl:"https://xcloud.christmas/3b2beacda5b250c"},
      { id: 8, src: "https://i.ibb.co/BHWD4L7j/download-6.jpg", title: "family matters (jaatu rohit fav)",desc:"The series depicts about a woman who received harsh training in an unknown facility as a child, escapes the facility, and lives as an ordinary family member..", downloadUrl:"https://gofile.io/d/bnhWS2"},
      { id: 9, src: "https://i.ibb.co/ksY0zLKs/Srikant-Tiwari-Srikant-TFM-on-X.jpg", title: "family man season 3 (jaatu rohit fav)",desc:"On a personal mission to avenge an assassination, Srikant Tiwari unravels a devious conspiracy that threatens to send India to the brink of war.", downloadUrl:"https://new1.movcloud.click/s/3a121a73e07d958b/"},
    ];

    // Anime photos
    const animePhotos = [
      { id: 1, src: "https://i.ibb.co/QFSd8ctR/Your-Name-2016-directed-by-Makoto-Shinkai-is-a.jpg", title: "Your Name", desc: "Your Name (Kimi no Na wa.) is a 2016 Japanese animated romantic fantasy film.", downloadUrl: "https://drive.google.com/file/d/1yXZi0hpHRqgb3VE9TiVh83HSu5eFne7Q/view?usp=drivesdk" },
      { id: 2, src: "https://i.ibb.co/k69vZvy3/18c52712622697f117bac115693d77fe.jpg", title: "A Silent Voice", desc: "A Silent Voice is a 2016 Japanese animated film about bullying, disability, and redemption.", downloadUrl: "https://vcloud.cx/1a548b" },
      { id: 3, src: "https://i.ibb.co/kVsc2XK2/c4056701ab8477751a82643b4416a933.jpg", title: "Heavenly Delusion", desc: "Heavenly Delusion is a sci-fi mystery anime adapted from Masakazu Ishiguro's manga.", downloadUrl: "#" }
    ];

    // -------------------------
    // Page detection (works on Netlify)
 // Detect current page robustly
let pathParts = window.location.pathname.split("/").filter(Boolean);
let pageName = pathParts.pop()?.toLowerCase() || "index";

// Normalize page name
if (pageName === "" || pageName === "index.html" || pageName === "index") pageName = "home";
else if (pageName === "movies" || pageName === "movies.html") pageName = "movies";
else if (pageName === "anime" || pageName === "anime.html") pageName = "anime";
else if (pageName === "about" || pageName === "about.html") pageName = "about";
else if (pageName === "contact" || pageName === "contact.html") pageName = "contact";

// Assign gallery photos based on page
let galleryPhotos;
if (pageName === "home") {
  galleryPhotos = [...homePhotos, ...animePhotos]; // both movies + anime
} else if (pageName === "movies") {
  galleryPhotos = homePhotos; // only movies
} else if (pageName === "anime") {
  galleryPhotos = animePhotos; // only anime
} else {
  galleryPhotos = []; // fallback empty
}

    // -------------------------
    // Render gallery
    // -------------------------
    function renderGallery(list) {
      gallery.innerHTML = "";
      list.forEach(photo => {
        const div = document.createElement("div");
        div.className = "photo";
        div.innerHTML = `
          <img loading="lazy" src="${photo.src}" alt="${photo.title}">
          <div class="caption">${photo.title}</div>
        `;
        div.onclick = () => openPhoto(photo);
        gallery.appendChild(div);
      });
    }
   
  

    function openPhoto(photo) {
      gallery.style.display = "none";
      view.classList.add("active");
      title.textContent = photo.title;
      desc.textContent = photo.desc;
      img.src = photo.src;
      currentDownloadUrl = photo.downloadUrl;
      window.scrollTo(0, 0);
    }

    window.goBack = () => {
      view.classList.remove("active");
      gallery.style.display = "grid";
    };

    window.downloadPhoto = () => {
      const link = document.createElement("a");
      link.href = currentDownloadUrl;
      link.download = `${title.textContent.replace(/\s+/g, "_")}.jpg`;
      link.target = "_blank";
      link.click();
    };

    // -------------------------
    // Search filter
    // -------------------------
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        const filtered = galleryPhotos.filter(photo =>
          photo.title.toLowerCase().includes(value) ||
          photo.desc.toLowerCase().includes(value)
        );
        renderGallery(filtered);
      });
    }

    renderGallery(galleryPhotos);
  }
const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
})

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
})
  // -------------------------
  // Page logging
  // -------------------------
  switch (pageName) {
    case "movies":
      console.log("🎬 Movies page loaded");
      break;
    case "anime":
      console.log("🎞️ Anime page loaded");
      break;
    case "about.html":
      console.log("ℹ️ About page loaded");
      break;
    case "contact.html":
      console.log("📞 Contact page loaded");
      break;
    default:
      console.log("🏠 Home page loaded");
  }
});
