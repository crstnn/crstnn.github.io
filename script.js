// Background: fade the full image in over the blurred placeholder once it has loaded.
const background = document.querySelector('.bg-full');
const backgroundImage = new Image();
backgroundImage.onload = () => background.classList.add('loaded');
backgroundImage.onerror = () => {
    backgroundImage.onerror = null;
    background.style.backgroundImage = "url('assets/background.jpg')";
    backgroundImage.src = 'assets/background.jpg';
};
backgroundImage.src = 'assets/background.webp';

// Project cards: fade in as they scroll into view. Cards entering together are
// staggered in the order they appear, so it works for any number of columns.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, i) => {
            const card = entry.target;
            card.style.transitionDelay = `${Math.min(i, 4) * 90}ms`;
            card.classList.add('visible');
            card.addEventListener('transitionend', () => {
                card.style.transitionDelay = '';
            }, {once: true});
            revealObserver.unobserve(card);
        });
    }, {threshold: 0.15});
    document.querySelectorAll('.project').forEach((card) => revealObserver.observe(card));
}

// Scroll hint: hidden while the projects are on screen.
const hint = document.querySelector('.scrollHint');
new IntersectionObserver(([entry]) => {
    hint.classList.toggle('hidden', entry.isIntersecting);
}).observe(document.getElementById('projects'));

// Email: the address is stored reversed and base64-encoded, and only decoded on click.
const emailButton = document.querySelector('.links .email');
const emailPanel = document.getElementById('emailPanel');
const addressEl = emailPanel.querySelector('.emailAddress');
const copyButton = emailPanel.querySelector('.copyEmail');
const openMail = emailPanel.querySelector('.openMail');
const emailStatus = document.getElementById('emailStatus');
let address = '';
let resetTimer;

emailButton.addEventListener('click', () => {
    if (!address) {
        address = [...atob(emailButton.dataset.contact)].reverse().join('');
        addressEl.textContent = address;
        openMail.href = `mailto:${address}`;
    }
    const open = emailButton.getAttribute('aria-expanded') !== 'true';
    emailButton.setAttribute('aria-expanded', String(open));
    emailPanel.classList.toggle('open', open);
});

function showFeedback(message) {
    copyButton.textContent = message;
    emailStatus.textContent = message;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
        copyButton.textContent = 'Copy';
        emailStatus.textContent = '';
    }, 2000);
}

// Without clipboard access, select the address so it can be copied by hand.
function selectAddress() {
    getSelection().selectAllChildren(addressEl);
    showFeedback('Selected');
}

copyButton.addEventListener('click', () => {
    if (!navigator.clipboard) {
        selectAddress();
        return;
    }
    navigator.clipboard.writeText(address).then(() => showFeedback('Copied ✓'), selectAddress);
});
