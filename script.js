/* =========================================================
   GITHUB GUIDE - script.js
   Interactive JavaScript for the GitHub Beginner Guide
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const menuToggle =
        document.querySelector(".menu-toggle") ||
        document.querySelector("#menu-toggle") ||
        document.querySelector(".mobile-menu-btn");

    const nav =
        document.querySelector(".nav-links") ||
        document.querySelector(".navbar-links") ||
        document.querySelector("nav ul");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuToggle.classList.toggle("active");

            const expanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            menuToggle.setAttribute("aria-expanded", String(!expanded));
        });

        // Close mobile menu after clicking a link
        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    /* =====================================================
       2. SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                const header = document.querySelector("header");
                const headerHeight = header
                    ? header.offsetHeight
                    : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    /* =====================================================
       3. READING PROGRESS BAR
       ===================================================== */

    let progressBar = document.querySelector(".reading-progress");

    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.className = "reading-progress";

        progressBar.style.position = "fixed";
        progressBar.style.top = "0";
        progressBar.style.left = "0";
        progressBar.style.width = "0%";
        progressBar.style.height = "4px";
        progressBar.style.zIndex = "99999";
        progressBar.style.background = "linear-gradient(90deg, #238636, #58a6ff)";
        progressBar.style.transition = "width 0.1s ease";

        document.body.appendChild(progressBar);
    }

    function updateReadingProgress() {
        const scrollTop = window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const progress =
            documentHeight > 0
                ? (scrollTop / documentHeight) * 100
                : 0;

        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", updateReadingProgress);
    updateReadingProgress();


    /* =====================================================
       4. ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(
        '.nav-links a[href^="#"], nav a[href^="#"]'
    );

    function updateActiveNavigation() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation);
    updateActiveNavigation();


    /* =====================================================
       5. COPY COMMAND BUTTONS
       ===================================================== */

    function showCopyMessage(button, originalText) {
        button.textContent = "✓ Copied!";
        button.classList.add("copied");

        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
        }, 1800);
    }

    async function copyText(text, button) {
        try {
            await navigator.clipboard.writeText(text);

            const originalText =
                button.dataset.originalText ||
                button.textContent;

            button.dataset.originalText = originalText;

            showCopyMessage(button, originalText);

        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement("textarea");

            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.select();

            try {
                document.execCommand("copy");

                const originalText =
                    button.dataset.originalText ||
                    button.textContent;

                button.dataset.originalText = originalText;

                showCopyMessage(button, originalText);

            } catch (fallbackError) {
                console.error("Copy failed:", fallbackError);
                button.textContent = "Copy failed";

                setTimeout(() => {
                    button.textContent =
                        button.dataset.originalText || "Copy";
                }, 1500);
            }

            textarea.remove();
        }
    }

    // Buttons such as:
    // <button class="copy-btn">Copy</button>
    document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", () => {
            let command = "";

            const parent = button.parentElement;

            if (parent) {
                const code =
                    parent.querySelector("code") ||
                    parent.querySelector("pre");

                if (code) {
                    command = code.innerText.trim();
                }
            }

            // Look for explicit data-copy attribute
            if (button.dataset.copy) {
                command = button.dataset.copy;
            }

            if (command) {
                copyText(command, button);
            }
        });
    });


    /* =====================================================
       6. AUTOMATIC COPY BUTTONS FOR CODE BLOCKS
       ===================================================== */

    document.querySelectorAll("pre").forEach((pre) => {
        // Don't add duplicate button
        if (pre.querySelector(".auto-copy-btn")) return;

        const code = pre.querySelector("code");

        if (!code) return;

        const copyButton = document.createElement("button");

        copyButton.className = "auto-copy-btn";
        copyButton.type = "button";
        copyButton.textContent = "Copy";

        copyButton.style.position = "absolute";
        copyButton.style.top = "10px";
        copyButton.style.right = "10px";
        copyButton.style.padding = "6px 12px";
        copyButton.style.borderRadius = "6px";
        copyButton.style.border = "1px solid rgba(255,255,255,0.15)";
        copyButton.style.background = "rgba(255,255,255,0.08)";
        copyButton.style.color = "inherit";
        copyButton.style.cursor = "pointer";

        const currentPosition =
            window.getComputedStyle(pre).position;

        if (currentPosition === "static") {
            pre.style.position = "relative";
        }

        copyButton.addEventListener("click", () => {
            copyText(code.innerText.trim(), copyButton);
        });

        pre.appendChild(copyButton);
    });


    /* =====================================================
       7. COMMAND SEARCH
       ===================================================== */

    const searchInput =
        document.querySelector("#commandSearch") ||
        document.querySelector(".command-search") ||
        document.querySelector('input[placeholder*="Search"]');

    const commandItems = document.querySelectorAll(
        ".command-card, .command-item, .command-box, .command-grid > *"
    );

    if (searchInput && commandItems.length > 0) {
        searchInput.addEventListener("input", () => {
            const searchTerm =
                searchInput.value.toLowerCase().trim();

            commandItems.forEach((item) => {
                const text =
                    item.textContent.toLowerCase();

                if (text.includes(searchTerm)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }


    /* =====================================================
       8. SCROLL REVEAL ANIMATION
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".content-card, " +
        ".feature-card, " +
        ".command-card, " +
        ".roadmap-item, " +
        ".tutorial-step, " +
        ".mistake-card, " +
        ".security-card, " +
        ".faq-item"
    );

    revealElements.forEach((element) => {
        element.classList.add("scroll-reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =====================================================
       9. CHECKLIST PROGRESS
       ===================================================== */

    const checkboxes = document.querySelectorAll(
        'input[type="checkbox"]'
    );

    const checklistProgress =
        document.querySelector(".checklist-progress");

    const checklistPercentage =
        document.querySelector(".checklist-percentage");

    function updateChecklist() {
        if (checkboxes.length === 0) return;

        const checked = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        ).length;

        const percentage =
            Math.round((checked / checkboxes.length) * 100);

        if (checklistProgress) {
            checklistProgress.style.width =
                `${percentage}%`;
        }

        if (checklistPercentage) {
            checklistPercentage.textContent =
                `${percentage}%`;
        }

        // Save checklist state
        checkboxes.forEach((checkbox, index) => {
            localStorage.setItem(
                `github-guide-check-${index}`,
                checkbox.checked
            );
        });
    }

    // Restore checklist
    checkboxes.forEach((checkbox, index) => {
        const saved =
            localStorage.getItem(
                `github-guide-check-${index}`
            );

        if (saved === "true") {
            checkbox.checked = true;
        }

        checkbox.addEventListener(
            "change",
            updateChecklist
        );
    });

    updateChecklist();


    /* =====================================================
       10. FAQ ACCORDION
       ===================================================== */

    const faqItems = document.querySelectorAll(
        ".faq-item"
    );

    faqItems.forEach((item) => {
        const question =
            item.querySelector(".faq-question") ||
            item.querySelector(".question");

        const answer =
            item.querySelector(".faq-answer") ||
            item.querySelector(".answer");

        if (!question || !answer) return;

        question.addEventListener("click", () => {
            const isOpen =
                item.classList.contains("active");

            // Close all FAQs
            faqItems.forEach((otherItem) => {
                otherItem.classList.remove("active");

                const otherAnswer =
                    otherItem.querySelector(
                        ".faq-answer, .answer"
                    );

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            // Open selected FAQ
            if (!isOpen) {
                item.classList.add("active");

                answer.style.maxHeight =
                    `${answer.scrollHeight}px`;
            }
        });
    });


    /* =====================================================
       11. TERMINAL TYPING EFFECT
       ===================================================== */

    const terminalText =
        document.querySelector(".terminal-typing");

    if (terminalText) {
        const originalText =
            terminalText.textContent;

        terminalText.textContent = "";

        let characterIndex = 0;

        function typeTerminalText() {
            if (characterIndex < originalText.length) {
                terminalText.textContent +=
                    originalText.charAt(characterIndex);

                characterIndex++;

                setTimeout(
                    typeTerminalText,
                    35
                );
            }
        }

        setTimeout(
            typeTerminalText,
            500
        );
    }


    /* =====================================================
       12. GITHUB WORKFLOW INTERACTION
       ===================================================== */

    const workflowSteps = document.querySelectorAll(
        ".workflow-step"
    );

    workflowSteps.forEach((step, index) => {
        step.addEventListener("click", () => {
            workflowSteps.forEach((item) => {
                item.classList.remove("active");
            });

            step.classList.add("active");

            // Highlight previous steps
            workflowSteps.forEach((item, itemIndex) => {
                if (itemIndex <= index) {
                    item.classList.add("completed");
                } else {
                    item.classList.remove("completed");
                }
            });
        });
    });


    /* =====================================================
       13. GIT COMMAND INTERACTIVE TERMINAL
       ===================================================== */

    const terminalInput =
        document.querySelector("#terminalInput");

    const terminalOutput =
        document.querySelector("#terminalOutput");

    if (terminalInput && terminalOutput) {

        const commands = {
            "git --version":
                "git version 2.x.x",

            "git status":
                "On branch main\nYour branch is up to date with 'origin/main'.",

            "git branch":
                "* main",

            "git remote -v":
                "origin  https://github.com/username/repository.git (fetch)\norigin  https://github.com/username/repository.git (push)",

            "git log":
                "commit abc1234 (HEAD -> main)\nAuthor: You\nMessage: Initial commit",

            "pwd":
                "/home/user/project",

            "ls":
                "README.md  index.html  style.css  script.js",

            "clear":
                ""
        };

        terminalInput.addEventListener(
            "keydown",
            (event) => {
                if (event.key !== "Enter") return;

                const command =
                    terminalInput.value
                        .trim()
                        .toLowerCase();

                if (command === "clear") {
                    terminalOutput.innerHTML = "";
                    terminalInput.value = "";
                    return;
                }

                const result =
                    commands[command] ||
                    `Command not found: ${command}`;

                const outputLine =
                    document.createElement("div");

                outputLine.className =
                    "terminal-result";

                outputLine.innerHTML = `
                    <div class="terminal-command">
                        <span>$</span> ${escapeHTML(command)}
                    </div>
                    <pre>${escapeHTML(result)}</pre>
                `;

                terminalOutput.appendChild(
                    outputLine
                );

                terminalInput.value = "";

                terminalOutput.scrollTop =
                    terminalOutput.scrollHeight;
            }
        );
    }


    /* =====================================================
       14. HELPER - ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       15. BACK TO TOP BUTTON
       ===================================================== */

    let backToTop =
        document.querySelector(".back-to-top");

    if (!backToTop) {
        backToTop = document.createElement("button");

        backToTop.className =
            "back-to-top";

        backToTop.setAttribute(
            "aria-label",
            "Back to top"
        );

        backToTop.innerHTML = "↑";

        backToTop.style.position = "fixed";
        backToTop.style.right = "25px";
        backToTop.style.bottom = "25px";
        backToTop.style.width = "45px";
        backToTop.style.height = "45px";
        backToTop.style.borderRadius = "50%";
        backToTop.style.border = "1px solid rgba(255,255,255,0.15)";
        backToTop.style.background = "#161b22";
        backToTop.style.color = "#ffffff";
        backToTop.style.fontSize = "22px";
        backToTop.style.cursor = "pointer";
        backToTop.style.opacity = "0";
        backToTop.style.visibility = "hidden";
        backToTop.style.transition =
            "all 0.3s ease";
        backToTop.style.zIndex = "9999";

        document.body.appendChild(
            backToTop
        );
    }

    function updateBackToTop() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = "1";
            backToTop.style.visibility = "visible";
        } else {
            backToTop.style.opacity = "0";
            backToTop.style.visibility = "hidden";
        }
    }

    window.addEventListener(
        "scroll",
        updateBackToTop
    );

    backToTop.addEventListener(
        "click",
        () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    /* =====================================================
       16. DARK/LIGHT MODE
       ===================================================== */

    const themeToggle =
        document.querySelector("#themeToggle") ||
        document.querySelector(".theme-toggle");

    if (themeToggle) {
        const savedTheme =
            localStorage.getItem("github-guide-theme");

        if (savedTheme === "light") {
            document.body.classList.add(
                "light-theme"
            );
        }

        themeToggle.addEventListener(
            "click",
            () => {
                document.body.classList.toggle(
                    "light-theme"
                );

                const isLight =
                    document.body.classList.contains(
                        "light-theme"
                    );

                localStorage.setItem(
                    "github-guide-theme",
                    isLight
                        ? "light"
                        : "dark"
                );
            }
        );
    }


    /* =====================================================
       17. IMAGE LAZY LOADING
       ===================================================== */

    document.querySelectorAll("img").forEach((img) => {
        if (!img.hasAttribute("loading")) {
            img.setAttribute(
                "loading",
                "lazy"
            );
        }
    });


    /* =====================================================
       18. KEYBOARD SHORTCUT
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            // "/" focuses search
            if (
                event.key === "/" &&
                !["INPUT", "TEXTAREA"].includes(
                    document.activeElement.tagName
                )
            ) {
                event.preventDefault();

                if (searchInput) {
                    searchInput.focus();
                }
            }

            // ESC closes mobile menu
            if (event.key === "Escape") {
                if (nav) {
                    nav.classList.remove(
                        "active"
                    );
                }

                if (menuToggle) {
                    menuToggle.classList.remove(
                        "active"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        }
    );


    /* =====================================================
       19. PRINT GUIDE
       ===================================================== */

    const printButton =
        document.querySelector(".print-guide");

    if (printButton) {
        printButton.addEventListener(
            "click",
            () => {
                window.print();
            }
        );
    }


    /* =====================================================
       20. CURRENT YEAR
       ===================================================== */

    document.querySelectorAll(
        ".current-year"
    ).forEach((element) => {
        element.textContent =
            new Date().getFullYear();
    });


    /* =====================================================
       21. TOOLTIP SUPPORT
       ===================================================== */

    document
        .querySelectorAll("[data-tooltip]")
        .forEach((element) => {

            element.addEventListener(
                "mouseenter",
                () => {
                    const tooltip =
                        document.createElement("div");

                    tooltip.className =
                        "custom-tooltip";

                    tooltip.textContent =
                        element.dataset.tooltip;

                    document.body.appendChild(
                        tooltip
                    );

                    const rect =
                        element.getBoundingClientRect();

                    tooltip.style.position =
                        "fixed";

                    tooltip.style.left =
                        `${rect.left + rect.width / 2}px`;

                    tooltip.style.top =
                        `${rect.top - 10}px`;

                    tooltip.style.transform =
                        "translate(-50%, -100%)";

                    tooltip.style.padding =
                        "7px 10px";

                    tooltip.style.borderRadius =
                        "6px";

                    tooltip.style.background =
                        "#161b22";

                    tooltip.style.color =
                        "#ffffff";

                    tooltip.style.fontSize =
                        "12px";

                    tooltip.style.zIndex =
                        "99999";

                    element._tooltip =
                        tooltip;
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {
                    if (element._tooltip) {
                        element._tooltip.remove();
                        element._tooltip = null;
                    }
                }
            );
        });


    /* =====================================================
       22. REPOSITORY NAME GENERATOR
       ===================================================== */

    const repoInput =
        document.querySelector("#repoName");

    const repoPreview =
        document.querySelector("#repoPreview");

    if (repoInput && repoPreview) {
        repoInput.addEventListener(
            "input",
            () => {
                let value =
                    repoInput.value
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-_]/g, "");

                repoPreview.textContent =
                    value || "my-project";
            }
        );
    }


    /* =====================================================
       23. GIT COMMAND QUICK ACTIONS
       ===================================================== */

    document
        .querySelectorAll("[data-command]")
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {
                    const command =
                        button.dataset.command;

                    if (!command) return;

                    copyText(
                        command,
                        button
                    );
                }
            );
        });


    /* =====================================================
       24. SECTION COMPLETION BUTTONS
       ===================================================== */

    document
        .querySelectorAll(
            ".complete-section, [data-complete]"
        )
        .forEach((button) => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.closest(
                            "section"
                        );

                    if (section) {
                        section.classList.add(
                            "section-completed"
                        );
                    }

                    button.textContent =
                        "✓ Completed";

                    button.classList.add(
                        "completed"
                    );

                    const sectionId =
                        section?.id;

                    if (sectionId) {
                        localStorage.setItem(
                            `section-${sectionId}`,
                            "completed"
                        );
                    }
                }
            );
        });


    /* =====================================================
       25. RESTORE COMPLETED SECTIONS
       ===================================================== */

    document
        .querySelectorAll("section[id]")
        .forEach((section) => {

            const saved =
                localStorage.getItem(
                    `section-${section.id}`
                );

            if (
                saved === "completed"
            ) {
                section.classList.add(
                    "section-completed"
                );

                const button =
                    section.querySelector(
                        ".complete-section, [data-complete]"
                    );

                if (button) {
                    button.textContent =
                        "✓ Completed";

                    button.classList.add(
                        "completed"
                    );
                }
            }
        });


    /* =====================================================
       26. STARTUP MESSAGE
       ===================================================== */

    console.log(
        "%c GitHub Guide Loaded Successfully 🚀 ",
        "background:#238636;color:white;padding:8px;border-radius:5px;font-weight:bold;"
    );

    console.log(
        "Beginner → Git → GitHub → Collaboration → Advanced"
    );
});