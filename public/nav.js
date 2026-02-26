(function () {
  const nav = document.createElement("nav");
  nav.id = "platform-nav";

  const current = window.location.pathname;
  const links = [
    { href: "/", label: "Home" },
    { href: "/files/", label: "Files" },
    { href: "/collab/", label: "Collab" },
  ];

  nav.innerHTML = links
    .map((l) => {
      const active =
        l.href === "/"
          ? current === "/"
          : current.startsWith(l.href);
      return `<a href="${l.href}" class="${active ? "active" : ""}">${l.label}</a>`;
    })
    .join("");

  const style = document.createElement("style");
  style.textContent = `
    #platform-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: #1a1a2e;
      display: flex;
      align-items: center;
      padding: 0 16px;
      gap: 4px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #platform-nav a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    #platform-nav a:hover {
      color: #e2e8f0;
      background: rgba(255,255,255,0.08);
    }
    #platform-nav a.active {
      color: #fff;
      background: rgba(255,255,255,0.12);
    }
    body { padding-top: 40px !important; }
  `;

  document.head.appendChild(style);
  document.body.prepend(nav);
})();
