document.querySelectorAll(".form").forEach(form => {
    const passInput = form.querySelector("input[type='password']");
    const icon = form.querySelector(".bx");

    icon.addEventListener("click", () => {
        if (passInput.type === "password") {
            passInput.type = "text";
            icon.classList.remove('bx-show-alt');
            icon.classList.add('bx-hide');
        } else {
            passInput.type = "password";
            icon.classList.add('bx-show-alt');
            icon.classList.remove('bx-hide');
        }
    });
});

