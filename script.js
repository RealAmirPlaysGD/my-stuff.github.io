/* =========================================================
   My Stuff — Program configuration
   =========================================================

   THIS IS THE MAIN PLACE YOU EDIT.

   To add a program, create another object inside the
   "programs" array.

   Example:

   {
       name: "My Program",
       version: "1.0.0",
       description: "Description of my program.",
       platform: "Windows",
       size: "25 MB",
       date: "2026-09-13",
       file: "downloads/my-program.exe",
       icon: "assets/my-program.png"
   }

   Put the actual downloadable file inside:

   downloads/

   Example:

   downloads/my-program.exe

   Then use:

   file: "downloads/my-program.exe"

   Icons go inside:

   assets/

   Example:

   assets/my-program.png

   Then use:

   icon: "assets/my-program.png"

   The "downloads" property is OPTIONAL.
   Only add it when you have manually verified a count.

   Example:

   downloads: 125

   GitHub Pages cannot provide real download statistics,
   so this value is purely a manually entered display value.
   ========================================================= */


/* =========================================================
   PROGRAMS
   ========================================================= */

const programs = [
    /*
    ---------------------------------------------------------
    EXAMPLE PROGRAM

    Replace this object with your own program information.

    The download file should physically exist at:

        downloads/my-program.zip

    ---------------------------------------------------------
    */

    {
        name: "Desktop Goose But With Some Mods",
        version: "0.3.1",
        description:
            "its just Desktop Goose But With Some Mods",
        platform: "Windows",
        size: "4,242 KB",
        date: "2026-09-13",
        file: "downloads/Desktop Goose But With Some Mods.zip",
        icon: "downloads/Screenshot 2026-09-13 151829.png",
        downloads: null
    }

    /*
    ---------------------------------------------------------
    Add another program like this:

    ,{
        name: "Another Program",
        version: "2.4.1",
        description:
            "A useful tool that does something awesome.",
        platform: "macOS",
        size: "18 MB",
        date: "2026-09-10",
        file: "downloads/another-program.zip",
        icon: "assets/another-program.png",
        downloads: 42
    }

    IMPORTANT:
    The comma before the object above is required.

    ---------------------------------------------------------
    */
];


/* =========================================================
   Application state
   ========================================================= */

let activePlatform = "All";
let searchQuery = "";
let activeProgramForModal = null;


/* =========================================================
   DOM elements
   ========================================================= */

const programGrid = document.getElementById("programGrid");
const emptyState = document.getElementById("emptyState");
const programCount = document.getElementById("programCount");

const searchInput = document.getElementById("searchInput");
const filterBar = document.getElementById("filterBar");

const detailsModal = document.getElementById("detailsModal");
const modalClose = document.getElementById("modalClose");
const modalCancel = document.getElementById("modalCancel");
const modalDownload = document.getElementById("modalDownload");

const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPlatform = document.getElementById("modalPlatform");
const modalVersion = document.getElementById("modalVersion");
const modalPlatformValue = document.getElementById("modalPlatformValue");
const modalSize = document.getElementById("modalSize");
const modalDate = document.getElementById("modalDate");
const modalDownloads = document.getElementById("modalDownloads");
const modalDownloadsWrapper =
    document.getElementById("modalDownloadsWrapper");

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const navLinks =
    document.getElementById("navLinks");


/* =========================================================
   Utility functions
   ========================================================= */

/**
 * Escapes a path one URL segment at a time.
 *
 * This lets paths containing spaces or special characters
 * work correctly while preserving "/" directory separators.
 *
 * Example:
 * "downloads/My Program 1.0.zip"
 *
 * becomes a browser-safe relative URL.
 */
function encodeFilePath(filePath) {
    if (!filePath || typeof filePath !== "string") {
        return "#";
    }

    return filePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}


/**
 * Creates a readable date.
 *
 * "2026-09-13" becomes something such as:
 * "September 13, 2026"
 */
function formatDate(dateString) {
    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(date);
}


/**
 * Converts a program name into initials.
 *
 * Used when the program does not have an icon.
 */
function getProgramInitials(name) {
    if (!name || typeof name !== "string") {
        return "?";
    }

    const words = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 1) {
        return words[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}


/**
 * Safely checks whether an optional download count exists.
 */
function hasDownloadCount(program) {
    return (
        program.downloads !== null &&
        program.downloads !== undefined &&
        program.downloads !== ""
    );
}


/* =========================================================
   Create icon element
   ========================================================= */

function createIconElement(program, className) {
    const container = document.createElement("div");

    container.className = className;

    if (program.icon) {
        const image = document.createElement("img");

        image.src = encodeFilePath(program.icon);
        image.alt = `${program.name} icon`;
        image.loading = "lazy";

        /*
         * If an icon fails to load, show the program initials
         * instead of displaying a broken-image indicator.
         */
        image.addEventListener("error", () => {
            container.replaceChildren(
                document.createTextNode(
                    getProgramInitials(program.name)
                )
            );
        });

        container.appendChild(image);

        return container;
    }

    container.textContent =
        getProgramInitials(program.name);

    return container;
}


/* =========================================================
   Create a single program card
   ========================================================= */

function createProgramCard(program, index) {
    const card = document.createElement("article");

    card.className = "program-card";

    card.dataset.index = String(index);

    /* Top row */
    const top = document.createElement("div");

    top.className = "program-card-top";

    top.appendChild(
        createIconElement(
            program,
            "program-icon"
        )
    );

    const platform = document.createElement("span");

    platform.className = "program-platform";
    platform.textContent =
        program.platform || "Other";

    top.appendChild(platform);

    card.appendChild(top);


    /* Name */
    const title = document.createElement("h3");

    title.textContent =
        program.name || "Unnamed Program";

    card.appendChild(title);


    /* Version */
    const version = document.createElement("div");

    version.className = "program-version";

    version.textContent =
        `Version ${program.version || "Unknown"}`;

    card.appendChild(version);


    /* Description */
    const description =
        document.createElement("p");

    description.className =
        "program-description";

    description.textContent =
        program.description ||
        "No description provided.";

    card.appendChild(description);


    /* Metadata */
    const metadata =
        document.createElement("div");

    metadata.className = "program-meta";

    addMetaText(
        metadata,
        program.platform || "Other"
    );

    addSeparator(metadata);

    addMetaText(
        metadata,
        program.size || "Size unknown"
    );

    addSeparator(metadata);

    addMetaText(
        metadata,
        formatDate(program.date)
    );

    card.appendChild(metadata);


    /* Optional manually entered download count */
    if (hasDownloadCount(program)) {
        addSeparator(metadata);

        addMetaText(
            metadata,
            `${program.downloads} downloads`
        );
    }


    /* Actions */
    const footer =
        document.createElement("div");

    footer.className =
        "program-card-footer";


    const downloadButton =
        document.createElement("a");

    downloadButton.className =
        "button button-primary";

    downloadButton.href =
        encodeFilePath(program.file);

    downloadButton.download = "";

    downloadButton.setAttribute(
        "aria-label",
        `Download ${program.name}`
    );

    downloadButton.append(
        document.createTextNode("Download"),
        document.createTextNode(" ↓")
    );

    footer.appendChild(downloadButton);


    const detailsButton =
        document.createElement("button");

    detailsButton.className =
        "button button-secondary details-button";

    detailsButton.type = "button";

    detailsButton.textContent = "Details";

    detailsButton.addEventListener(
        "click",
        () => openModal(program)
    );

    footer.appendChild(detailsButton);

    card.appendChild(footer);

    return card;
}


/**
 * Adds normal text to the metadata line.
 */
function addMetaText(parent, text) {
    const element =
        document.createElement("span");

    element.className =
        "program-meta-item";

    element.textContent = text;

    parent.appendChild(element);
}


/**
 * Adds a metadata separator.
 */
function addSeparator(parent) {
    const separator =
        document.createElement("span");

    separator.className =
        "meta-separator";

    separator.setAttribute(
        "aria-hidden",
        "true"
    );

    separator.textContent = "•";

    parent.appendChild(separator);
}


/* =========================================================
   Filtering
   ========================================================= */

function getFilteredPrograms() {
    const normalizedSearch =
        searchQuery
            .trim()
            .toLowerCase();

    return programs
        .map((program, index) => ({
            program,
            index
        }))
        .filter(({ program }) => {

            /* Platform filter */
            const platformMatches =
                activePlatform === "All" ||
                (
                    program.platform &&
                    program.platform.toLowerCase() ===
                    activePlatform.toLowerCase()
                );

            if (!platformMatches) {
                return false;
            }


            /* Search filter */
            if (!normalizedSearch) {
                return true;
            }

            const searchableText = [
                program.name,
                program.description,
                program.platform
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalizedSearch
            );
        });
}


/* =========================================================
   Render program list
   ========================================================= */

function renderPrograms() {
    const filteredPrograms =
        getFilteredPrograms();

    programGrid.replaceChildren();

    filteredPrograms.forEach(
        ({ program, index }) => {
            const card =
                createProgramCard(
                    program,
                    index
                );

            programGrid.appendChild(card);
        }
    );


    /* Count label */
    const count =
        filteredPrograms.length;

    if (count === 1) {
        programCount.textContent =
            "1 program";
    } else {
        programCount.textContent =
            `${count} programs`;
    }


    /* Empty state */
    const nothingFound =
        count === 0;

    emptyState.classList.toggle(
        "hidden",
        !nothingFound
    );

    programGrid.classList.toggle(
        "hidden",
        nothingFound
    );
}


/* =========================================================
   Modal
   ========================================================= */

function openModal(program) {
    activeProgramForModal = program;

    /* Basic text */
    modalTitle.textContent =
        program.name || "Program";

    modalDescription.textContent =
        program.description ||
        "No description provided.";

    modalPlatform.textContent =
        program.platform || "Other";

    modalVersion.textContent =
        `Version ${program.version || "Unknown"}`;

    modalPlatformValue.textContent =
        program.platform || "Other";

    modalSize.textContent =
        program.size || "Unknown";

    modalDate.textContent =
        formatDate(program.date);


    /* Optional download count */
    if (hasDownloadCount(program)) {
        modalDownloads.textContent =
            String(program.downloads);

        modalDownloadsWrapper.classList.remove(
            "hidden"
        );
    } else {
        modalDownloadsWrapper.classList.add(
            "hidden"
        );
    }


    /* Icon */
    modalIcon.replaceChildren();

    if (program.icon) {
        const image =
            document.createElement("img");

        image.src =
            encodeFilePath(program.icon);

        image.alt =
            `${program.name} icon`;

        image.addEventListener(
            "error",
            () => {
                modalIcon.textContent =
                    getProgramInitials(
                        program.name
                    );
            }
        );

        modalIcon.appendChild(image);
    } else {
        modalIcon.textContent =
            getProgramInitials(
                program.name
            );
    }


    /* Download link */
    modalDownload.href =
        encodeFilePath(program.file);

    modalDownload.download = "";

    modalDownload.setAttribute(
        "aria-label",
        `Download ${program.name}`
    );


    /* Show */
    detailsModal.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "modal-open"
    );

    modalClose.focus();
}


function closeModal() {
    detailsModal.classList.add(
        "hidden"
    );

    document.body.classList.remove(
        "modal-open"
    );

    activeProgramForModal = null;
}


/* =========================================================
   Search
   ========================================================= */

searchInput.addEventListener(
    "input",
    (event) => {
        searchQuery =
            event.target.value;

        renderPrograms();
    }
);


/* =========================================================
   Platform filters
   ========================================================= */

filterBar.addEventListener(
    "click",
    (event) => {
        const button =
            event.target.closest(
                "[data-platform]"
            );

        if (!button) {
            return;
        }

        activePlatform =
            button.dataset.platform ||
            "All";


        document
            .querySelectorAll(
                ".filter-button"
            )
            .forEach((filterButton) => {
                filterButton.classList.toggle(
                    "active",
                    filterButton === button
                );
            });

        renderPrograms();
    }
);


/* =========================================================
   Modal event handlers
   ========================================================= */

modalClose.addEventListener(
    "click",
    closeModal
);

modalCancel.addEventListener(
    "click",
    closeModal
);

detailsModal.addEventListener(
    "click",
    (event) => {
        if (
            event.target.matches(
                "[data-close-modal]"
            )
        ) {
            closeModal();
        }
    }
);


/* Close modal with Escape */
document.addEventListener(
    "keydown",
    (event) => {
        if (
            event.key === "Escape" &&
            !detailsModal.classList.contains(
                "hidden"
            )
        ) {
            closeModal();
        }
    }
);


/* =========================================================
   Keyboard shortcut
   =========================================================

   Press "/" anywhere outside another input/textarea
   to focus the search bar.
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {
        const target =
            event.target;

        const isTyping =
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target instanceof HTMLSelectElement ||
            target.isContentEditable;

        if (
            event.key === "/" &&
            !isTyping &&
            detailsModal.classList.contains(
                "hidden"
            )
        ) {
            event.preventDefault();

            searchInput.focus();
        }
    }
);


/* =========================================================
   Mobile navigation
   ========================================================= */

mobileMenuButton.addEventListener(
    "click",
    () => {
        const isOpen =
            navLinks.classList.toggle(
                "open"
            );

        mobileMenuButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileMenuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );
    }
);


/*
 * Close mobile navigation after
 * clicking one of its links.
 */
navLinks.addEventListener(
    "click",
    (event) => {
        if (
            event.target.closest("a")
        ) {
            navLinks.classList.remove(
                "open"
            );

            mobileMenuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                "Open navigation menu"
            );
        }
    }
);


/* =========================================================
   Initial render
   ========================================================= */

renderPrograms();
