// Braidz'n Tips · versión clásica: cabecera, menú móvil, apariciones al bajar, pestañas de precios y galería ampliable.
document.documentElement.classList.add('js');

// Cabecera: con fondo en cuanto se deja la portada.
const kopf = document.querySelector('[data-kopf]');
const fest = () => kopf.classList.toggle('is-fest', window.scrollY > 40);
fest();
window.addEventListener('scroll', fest, { passive: true });

// Menú móvil.
const menuBtn = document.querySelector('[data-menu]');
const setMenu = (offen) => {
    kopf.classList.toggle('menu-offen', offen);
    menuBtn.setAttribute('aria-expanded', String(offen));
    menuBtn.setAttribute('aria-label', offen ? 'Menü schliessen' : 'Menü öffnen');
    document.body.style.overflow = offen ? 'hidden' : '';
};
menuBtn.addEventListener('click', () => setMenu(!kopf.classList.contains('menu-offen')));
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// Aparición suave de los bloques al entrar en pantalla.
if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                e.target.classList.add('is-in');
                io.unobserve(e.target);
            });
        },
        { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
} else {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

// Pestañas de precios (también con las flechas del teclado).
const tabs = [...document.querySelectorAll('[role="tab"]')];
const zeigen = (tab) => {
    tabs.forEach((t) => {
        const aktiv = t === tab;
        t.setAttribute('aria-selected', String(aktiv));
        t.tabIndex = aktiv ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !aktiv;
    });
};
tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => zeigen(tab));
    tab.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        zeigen(next);
        next.focus();
    });
});

// Galería: cada diseño se abre en grande.
const lightbox = document.querySelector('[data-lightbox]');
const lbBild = lightbox.querySelector('[data-lightbox-bild]');
const lbTitel = lightbox.querySelector('[data-lightbox-titel]');
const lbZu = lightbox.querySelector('[data-lightbox-zu]');
let vorher = null;
const schliessen = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (vorher) vorher.focus();
};
document.querySelectorAll('[data-gross]').forEach((item) => {
    item.addEventListener('click', () => {
        vorher = item;
        lbBild.src = item.dataset.gross;
        lbBild.alt = item.querySelector('img').alt;
        lbTitel.textContent = item.dataset.titel;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lbZu.focus();
    });
});
lbZu.addEventListener('click', schliessen);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) schliessen();
});
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!lightbox.hidden) schliessen();
    else if (kopf.classList.contains('menu-offen')) setMenu(false);
});
