const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (formNote) {
    formNote.textContent = "Sending your enquiry...";
  }

  const submitButton = contactForm.querySelector("button[type='submit']");
  submitButton?.setAttribute("disabled", "disabled");

  try {
    const formData = new FormData(contactForm);
    const enquiry = {
      fullName: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      service: formData.get("service")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
    };

    // Determine the API endpoint
    const apiUrl = window.location.hostname === "localhost" 
      ? "http://localhost:10000/api/enquiries"
      : "/api/enquiries";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enquiry),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save enquiry");
    }

    contactForm.reset();
    if (formNote) {
      formNote.textContent = "Thank you. Your enquiry has been sent successfully.";
    }
  } catch (error) {
    console.error(error);
    if (formNote) {
      formNote.textContent = "Could not send right now. Please check the Supabase table setup or contact us by phone/email.";
    }
  } finally {
    submitButton?.removeAttribute("disabled");
  }
});
