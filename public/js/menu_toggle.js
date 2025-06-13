document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");

  if (toggle && navbar) {
    toggle.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }
});