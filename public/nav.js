(function () {
  const nav = document.createElement("nav");
  nav.id = "platform-nav";

  const current = window.location.pathname;
  const links = [
    { href: "/", label: "Home" },
    { href: "/files/", label: "Files" },
    { href: "/collab/", label: "Collab" },
  ];

  const linksHtml = links
    .map((l) => {
      const active =
        l.href === "/"
          ? current === "/"
          : current.startsWith(l.href);
      return `<a href="${l.href}" class="${active ? "active" : ""}">${l.label}</a>`;
    })
    .join("");

  nav.innerHTML = `
    <div class="nav-links">${linksHtml}</div>
    <form method="POST" action="/logout" class="nav-logout">
      <button type="submit">Logout</button>
    </form>
  `;

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
      justify-content: space-between;
      padding: 0 16px;
      z-index: 99999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-logout button {
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      color: #94a3b8;
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }
    .nav-logout button:hover {
      color: #e2e8f0;
      border-color: rgba(255,255,255,0.4);
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
