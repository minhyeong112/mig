function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

document.addEventListener("DOMContentLoaded", function() {
  // Handle dark mode toggle
  const homeIconCircle = document.getElementById("home-icon-circle");
  homeIconCircle.addEventListener("click", function() {
      document.body.classList.toggle("dark-mode");
  });

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
});

