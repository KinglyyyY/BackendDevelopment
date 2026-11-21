(() => {
  const repository = "KinglyyyY/BackendDevelopment";
  const branch = "main";
  const treeUrl = "./assets/repository-tree.json";
  const root = document.getElementById("tree-root");
  const search = document.getElementById("tree-search");
  const status = document.getElementById("tree-status");
  const count = document.getElementById("tree-count");
  const error = document.getElementById("tree-error");
  const reportDialog = document.getElementById("report-dialog");
  const reportTitle = document.getElementById("report-title");
  const reportDescription = document.getElementById("report-description");
  const reportList = document.getElementById("report-list");
  const reportContent = document.getElementById("report-content");
  const reportCurrent = document.getElementById("report-current");
  const reportGroups = {
    theory: {
      title: "Theory",
      description: "Course task reports and unit notes. Pick a report to read it here.",
      reports: [
        ["Class task 1 · Node.js and Express", "Theory/Task1/Report.md"],
        ["Class task 2 · Flask and HTTP", "Theory/Task2/Report.md"],
        ["Class task 3 · FastAPI", "Theory/Task3/Report.md"],
        ["Class task 4 · Express APIs", "Theory/Task4/Report.md"],
        ["Class task 5 · Browser storage", "Theory/Task5/Report.md"],
        ["Class task 6 · Server-side rendering", "Theory/Task6/Report.md"],
        ["Unit 2 · Databases", "Theory/Unit2/L13/README.md"],
        ["Unit 2 · SQL normalization", "Theory/Unit2/L14A/README.md"],
        ["Unit 2 · Data modeling", "Theory/Unit2/L15/README.md"],
        ["Unit 2 · Queries", "Theory/Unit2/L16/README.md"],
        ["Unit 3 · API and middleware", "Theory/Unit3/README.md"],
        ["Unit 3 · Student system", "Theory/Unit3/L26/README.md"],
        ["Unit 4 · Docker", "Theory/Unit4/README.md"],
        ["Unit 4 · Compose vs run", "Theory/Unit4/Docker-Compose-vs-Run/README.md"],
        ["Unit 4 · API test automation", "Theory/Unit4/L44-L45/README.md"]
      ]
    },
    labs: {
      title: "Lab experiments",
      description: "Experiment reports and app guides, shown without leaving this portfolio.",
      reports: [
        ["Exam01B · TODO app", "LAB/Exam01B/README.md"],
        ["Experiment 1 · HTML5", "LAB/Exp1/Report.md"],
        ["Experiment 12 · Express and EJS", "LAB/Exp12/Report.md"],
        ["Experiment 12B · Sessions", "LAB/Exp12B/README.md"],
        ["Experiment 13A · User management", "LAB/Exp13A/Report.md"],
        ["Experiment 15 · Django TODO", "LAB/Exp15/Report.md"],
        ["Experiments 7 and 8 · JavaScript", "LAB/Exp7_8/Report.md"]
      ]
    },
    assignments: {
      title: "Assignments",
      description: "Open either assignment brief or its project notes here.",
      reports: [
        ["Assignment 1 · Notes app", "Assignment/Assignment1/README.md"],
        ["Assignment 2 · Brief", "Assignment/Assignment2.md"]
      ]
    },
    pbl: {
      title: "PBL activity",
      description: "The project summary and implementation steps from the main repository.",
      reports: [["PBL assignment summary", "PBL Assignment.md"]]
    },
    workflows: {
      title: "GitHub Actions workflows",
      description: "Read the workflow files here without opening GitHub.",
      reports: [
        ["L44–L45 · FastAPI API test automation", ".github/workflows/backend-api-tests.yml"],
        ["Unit 4 · Compose vs run comparison", ".github/workflows/unit4-docker-comparison.yml"]
      ]
    }
  };
  let tree = { name: "BackendDevelopment", path: "", type: "tree", children: new Map() };

  function makeTree(entries) {
    const top = { name: "BackendDevelopment", path: "", type: "tree", children: new Map() };
    entries.forEach((entry) => {
      const parts = entry.path.split("/");
      let parent = top;
      parts.forEach((part, index) => {
        const path = parts.slice(0, index + 1).join("/");
        const isFile = index === parts.length - 1;
        if (!parent.children.has(part)) {
          parent.children.set(part, isFile
            ? { name: part, path, type: "blob" }
            : { name: part, path, type: "tree", children: new Map() });
        }
        parent = parent.children.get(part);
      });
    });
    return top;
  }

  function childrenOf(node) {
    return [...node.children.values()].sort((a, b) => {
      if (a.type !== b.type) return a.type === "tree" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
    });
  }

  function matches(node, query) {
    if (!query) return true;
    if (node.path.toLowerCase().includes(query)) return true;
    return node.type === "tree" && childrenOf(node).some((child) => matches(child, query));
  }

  function githubPath(path, kind) {
    const encoded = path.split("/").map(encodeURIComponent).join("/");
    return `https://github.com/${repository}/${kind}/${branch}/${encoded}`;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);
  }

  function inlineMarkdown(value) {
    let result = escapeHtml(value);
    const tick = String.fromCharCode(96);
    result = result.replace(new RegExp(tick + "([^" + tick + "]+)" + tick, "g"), "<code>$1</code>");
    result = result.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|[^\s)]+)\)/g, (match, label, href) => {
      const safeHref = href.startsWith("javascript:") ? "#" : href;
      return "<a href=\"" + escapeHtml(safeHref) + "\" target=\"_blank\" rel=\"noreferrer\">" + label + "</a>";
    });
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return result;
  }

  function renderMarkdown(source) {
    const lines = source.replace(/\r/g, "").split("\n");
    const output = [];
    const fence = String.fromCharCode(96).repeat(3);
    let paragraph = [];
    let listType = "";
    let inCode = false;
    let code = [];
    function flushParagraph() {
      if (paragraph.length) output.push("<p>" + inlineMarkdown(paragraph.join(" ")) + "</p>");
      paragraph = [];
    }
    function closeList() {
      if (listType) output.push("</" + listType + ">");
      listType = "";
    }
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trim().startsWith(fence)) {
        flushParagraph(); closeList();
        if (inCode) { output.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>"); code = []; inCode = false; }
        else inCode = true;
        continue;
      }
      if (inCode) { code.push(line); continue; }
      if (!line.trim()) { flushParagraph(); closeList(); continue; }
      const heading = line.match(/^(#{1,4})\s+(.+)$/);
      if (heading) { flushParagraph(); closeList(); const level = heading[1].length; output.push("<h" + level + ">" + inlineMarkdown(heading[2]) + "</h" + level + ">"); continue; }
      if (/^\s*([-*_]\s*){3,}$/.test(line)) { flushParagraph(); closeList(); output.push("<hr>"); continue; }
      const quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) { flushParagraph(); closeList(); output.push("<blockquote><p>" + inlineMarkdown(quote[1]) + "</p></blockquote>"); continue; }
      const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        flushParagraph(); const nextType = unordered ? "ul" : "ol";
        if (listType && listType !== nextType) closeList();
        if (!listType) { listType = nextType; output.push("<" + listType + ">"); }
        output.push("<li>" + inlineMarkdown((unordered || ordered)[1]) + "</li>"); continue;
      }
      closeList(); paragraph.push(line.trim());
    }
    flushParagraph(); closeList();
    if (inCode) output.push("<pre><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
    return output.join("\n");
  }

  async function openReport(report, selectedButton) {
    reportCurrent.textContent = report[0];
    reportContent.innerHTML = '<p class="report-placeholder">Loading report…</p>';
    reportList.querySelectorAll(".report-list-button").forEach((button) => {
      button.setAttribute("aria-current", String(button === selectedButton));
    });
    const encoded = report[1].split("/").map(encodeURIComponent).join("/");
    const url = "./" + encoded;
    try {
      let response = await fetch(url);
      if (!response.ok && report[1].startsWith(".github/")) {
        response = await fetch("https://raw.githubusercontent.com/" + repository + "/" + branch + "/" + encoded);
      }
      if (!response.ok) throw new Error("Could not load this report (" + response.status + ").");
      const source = await response.text();
      reportContent.innerHTML = report[1].toLowerCase().endsWith(".md")
        ? renderMarkdown(source)
        : "<pre><code>" + escapeHtml(source) + "</code></pre>";
    } catch (reason) {
      reportContent.innerHTML = '<p class="report-placeholder">' + escapeHtml(reason.message || "This report could not be loaded.") + "</p>";
    }
  }

  function openReportGroup(key) {
    const group = reportGroups[key];
    if (!group) return;
    document.getElementById("report-kicker").textContent = `COLLECTION ${String(Object.keys(reportGroups).indexOf(key) + 1).padStart(2, "0")}`;
    reportTitle.textContent = group.title;
    reportDescription.textContent = group.description;
    reportList.replaceChildren();
    group.reports.forEach((report, index) => {
      const button = document.createElement("button");
      button.className = "report-list-button";
      button.type = "button";
      button.textContent = report[0];
      const pathHint = document.createElement("small");
      pathHint.textContent = report[1];
      button.append(pathHint);
      button.addEventListener("click", () => openReport(report, button));
      reportList.append(button);
      if (index === 0) openReport(report, button);
    });
    if (!reportDialog.open) reportDialog.showModal();
  }

  document.querySelectorAll("[data-report-group]").forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      openReportGroup(card.dataset.reportGroup);
    });
  });
  document.getElementById("report-close").addEventListener("click", () => reportDialog.close());
  reportDialog.addEventListener("close", () => {
    reportList.replaceChildren();
    reportContent.innerHTML = '<p class="report-placeholder">Choose a report to read it here.</p>';
  });
  reportDialog.addEventListener("click", (event) => {
    if (event.target === reportDialog) reportDialog.close();
  });

  function renderNode(node, query, depth = 0) {
    if (!matches(node, query)) return null;
    const wrapper = document.createElement("div");
    wrapper.className = node.type === "tree" ? "tree-folder tree-node" : "tree-node";
    if (node.type === "tree") {
      const details = document.createElement("details");
      details.open = Boolean(query);
      const summary = document.createElement("summary");
      summary.className = "tree-summary";
      const icon = document.createElement("span");
      icon.className = "folder-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "▰";
      const label = document.createElement("span");
      label.textContent = node.name;
      summary.append(icon, label);
      details.append(summary);
      const children = document.createElement("div");
      children.className = "tree-children";
      childrenOf(node).forEach((child) => {
        const rendered = renderNode(child, query, depth + 1);
        if (rendered) children.append(rendered);
      });
      details.append(children);
      wrapper.append(details);
    } else {
      const link = document.createElement("a");
      link.className = "tree-file";
      link.href = githubPath(node.path, "blob");
      link.target = "_blank";
      link.rel = "noreferrer";
      const icon = document.createElement("span");
      icon.className = "file-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "↗";
      const label = document.createElement("span");
      label.textContent = node.name;
      link.append(icon, label);
      wrapper.append(link);
    }
    return wrapper;
  }

  function render(query = "") {
    root.replaceChildren();
    const normalized = query.trim().toLowerCase();
    const nodes = childrenOf(tree).filter((node) => matches(node, normalized));
    if (nodes.length === 0) {
      const empty = document.createElement("p");
      empty.className = "tree-empty";
      empty.textContent = "No files match that search. Try another word or folder name.";
      root.append(empty);
      return;
    }
    nodes.forEach((node) => root.append(renderNode(node, normalized)));
  }

  async function loadTree() {
    try {
      const response = await fetch(treeUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error(`Repository index returned ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.files)) throw new Error("The repository index has an invalid format.");
      tree = makeTree(data.files.map((path) => ({ path, type: "blob" })));
      const folders = countFolders(tree) - 1;
      count.textContent = `${data.files.length} files · ${folders} folders`;
      status.textContent = "Main branch snapshot";
      error.hidden = true;
      render(search.value);
    } catch (reason) {
      status.textContent = "File index unavailable";
      root.replaceChildren();
      error.hidden = false;
      console.error("Could not load the GitHub repository tree:", reason);
    }
  }

  function countFolders(node) {
    if (node.type !== "tree") return 0;
    return 1 + [...node.children.values()].reduce((sum, child) => sum + countFolders(child), 0);
  }

  search.addEventListener("input", () => render(search.value));
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) {
      search.value = "";
      render();
      search.blur();
    }
  });
  loadTree();
})();
