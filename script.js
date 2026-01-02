// 1. THEME TOGGLE (Dark/Light Mode)

const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;
const body = document.body;

// Load saved theme preference from localStorage
function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Check system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
}

// Apply theme to page
function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark-mode");
    htmlElement.style.colorScheme = "dark";
  } else {
    body.classList.remove("dark-mode");
    htmlElement.style.colorScheme = "light";
  }
  localStorage.setItem("theme", theme);
}

// Toggle theme on button click
themeToggle.addEventListener("click", () => {
  const isDarkMode = body.classList.contains("dark-mode");
  applyTheme(isDarkMode ? "light" : "dark");
});

// Load theme on page load
loadThemePreference();

// 2. MOBILE MENU TOGGLE

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Toggle menu visibility
menuToggle.addEventListener("click", () => {
  const navList = navMenu.querySelector(".nav-list");
  navList.classList.toggle("active");
});

// Close menu when a link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const navList = navMenu.querySelector(".nav-list");
    navList.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-wrapper")) {
    const navList = navMenu.querySelector(".nav-list");
    navList.classList.remove("active");
  }
});

// 3. FORM VALIDATION & SUBMISSION

const contactForm = document.getElementById("contactForm");

// Form validation rules
const formValidation = {
  name: {
    validate: (value) => value.trim().length >= 2,
    error: "Name must be at least 2 characters",
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    error: "Please enter a valid email",
  },
  subject: {
    validate: (value) => value.trim().length >= 3,
    error: "Subject must be at least 3 characters",
  },
  message: {
    validate: (value) => value.trim().length >= 10,
    error: "Message must be at least 10 characters",
  },
};

// Validate individual field
function validateField(fieldName, value) {
  const field = document.getElementById(fieldName);
  const errorElement = document.getElementById(fieldName + "Error");
  const formGroup = field.parentElement;

  if (formValidation[fieldName].validate(value)) {
    formGroup.classList.remove("error");
    if (errorElement) errorElement.textContent = "";
    return true;
  } else {
    formGroup.classList.add("error");
    if (errorElement)
      errorElement.textContent = formValidation[fieldName].error;
    return false;
  }
}

// Real-time validation
Object.keys(formValidation).forEach((fieldName) => {
  const field = document.getElementById(fieldName);
  field.addEventListener("blur", () => {
    validateField(fieldName, field.value);
  });
});

// Form submission
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate all fields
  let isValid = true;
  Object.keys(formValidation).forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    if (!validateField(fieldName, field.value)) {
      isValid = false;
    }
  });

  if (isValid) {
    // Prepare email content
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Create mailto link
    const mailtoLink = `mailto:vanshika.k@adypu.edu.in?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    // Open mail client
    window.location.href = mailtoLink;

    // Reset form
    contactForm.reset();

    // Show success message
    showNotification("Message sent! Opening your email client...", "success");
  } else {
    showNotification("Please fix the errors in the form", "error");
  }
});

// 4. DOWNLOAD RESUME

const resumeBtn = document.getElementById("resumeBtn");

resumeBtn.addEventListener("click", () => {
  showNotification(
    "Resume download would be available here. Add a resume.pdf file to your project!",
    "info"
  );

  // Alternatively, a sample PDF or use a placeholder link
  // window.open('path-to-resume.pdf', '_blank');
});

// 5. SMOOTH SCROLL FOR INTERNAL LINKS

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// 6. SCROLL ANIMATION (Fade in on scroll)

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe project cards and skill items for animation
document
  .querySelectorAll(".project-card, .skill-item, .stat-card")
  .forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(element);
  });

// 7. NOTIFICATION SYSTEM

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
    `;

  // Set color based on type
  const colors = {
    success: { bg: "#10b981", color: "white" },
    error: { bg: "#ef4444", color: "white" },
    info: { bg: "#3b82f6", color: "white" },
  };

  const color = colors[type] || colors.info;
  notification.style.backgroundColor = color.bg;
  notification.style.color = color.color;

  document.body.appendChild(notification);

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Add animation keyframes
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 8. ACTIVE NAVIGATION LINK HIGHLIGHTING

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
      link.style.color = "var(--accent-color)";
    } else {
      link.style.color = "";
    }
  });
}

window.addEventListener("scroll", updateActiveNavLink);

// 9. PAGE INITIALIZATION

document.addEventListener("DOMContentLoaded", () => {
  // Disable form submission for demo
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    });
  }

  console.log("✨ Portfolio loaded successfully!");
  console.log("Theme:", localStorage.getItem("theme") || "system");
});
