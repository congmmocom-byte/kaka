const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const contactModal = $("#contactModal");
const mobileNav = $("#mobileNav");
const serviceInput = $("#serviceInput");
const toast = $("#toast");

function show(el){ el.setAttribute("aria-hidden", "false"); }
function hide(el){ el.setAttribute("aria-hidden", "true"); }

function showToast(msg){
  toast.textContent = msg;
  toast.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> toast.style.display = "none", 1800);
}

function openContact(service = ""){
  if (serviceInput) serviceInput.value = service;
  show(contactModal);
}

function closeByAttr(target){
  const t = target?.getAttribute?.("data-close");
  if (t === "modal") hide(contactModal);
  if (t === "sheet") hide(mobileNav);
}

// Open contact buttons
["#openContactTop","#openContactHero","#openContactFooter","#openContactMobile"]
  .forEach(id => {
    const btn = $(id);
    if (btn) btn.addEventListener("click", () => openContact(""));
  });

$$(".contactBtn").forEach(btn => {
  btn.addEventListener("click", () => openContact(btn.dataset.service || ""));
});

// Copy quick message
$$(".copyBtn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const platform = btn.dataset.copy || "Dịch vụ";
    const text =
`Mình quan tâm dịch vụ: ${platform}
Mục tiêu: ...
Ngành hàng: ...
Ngân sách dự kiến: ...
SĐT/Zalo: ...`;
    try{
      await navigator.clipboard.writeText(text);
      showToast("Đã copy nội dung ✅");
    }catch{
      showToast("Không copy được (trình duyệt chặn) 😅");
    }
  });
});

// Mobile nav
$("#openMobileNav")?.addEventListener("click", () => show(mobileNav));
mobileNav?.addEventListener("click", (e) => closeByAttr(e.target));
contactModal?.addEventListener("click", (e) => closeByAttr(e.target));

// ESC to close
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    hide(contactModal);
    hide(mobileNav);
  }
});

// Smooth close sheet when click link
$$("[data-close='sheet']").forEach(el => {
  el.addEventListener("click", () => hide(mobileNav));
});

// Contact form -> create message & copy
$("#contactForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(e.target);

  const msg =
`[TƯ VẤN DỊCH VỤ]
Dịch vụ: ${data.get("service") || ""}
Tên: ${data.get("name") || ""}
SĐT/Zalo: ${data.get("phone") || ""}

Nhu cầu:
${data.get("message") || ""}`.trim();

  try{
    await navigator.clipboard.writeText(msg);
    showToast("Đã tạo & copy tin nhắn ✅");
  }catch{
    showToast("Tạo tin nhắn xong, nhưng không copy được 😅");
  }
  hide(contactModal);
});

// Footer year
$("#year").textContent = new Date().getFullYear();
