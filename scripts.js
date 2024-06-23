document.addEventListener("DOMContentLoaded", function() {
  // Handle collapsible sections
  var coll = document.getElementsByClassName("collapsible");

  // Reset all content display to none initially (optional)
  for (var i = 0; i < coll.length; i++) {
    coll[i].nextElementSibling.style.display = "none";
  }

  for (var i = 0; i < coll.length; i++) {
    coll[i].addEventListener("focus", function() {
      this.classList.add("hover"); // Add hover class on focus
    });
    coll[i].addEventListener("blur", function() {
      this.classList.remove("hover"); // Remove hover class on blur
    });
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  }

  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Check if dark mode preference is saved in localStorage
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Save the dark mode preference in localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
});

let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.querySelectorAll(".slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex - 1].style.display = "block";
  setTimeout(showSlides, 10000); // Change image every 10 seconds
}