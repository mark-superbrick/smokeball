function initLogoVerticalScroll() {

    gsap.registerPlugin(ScrollTrigger);

    const verticalScrolls = document.querySelectorAll('[data-logo-vertical-scroll-wrap]');
    if(!verticalScrolls.length) return;

    const marqueeRefreshers = [];

    verticalScrolls.forEach((verticalScroll, index) => {
        if (verticalScroll.dataset.logoVerticalScrollInit === 'true') return;
        verticalScroll.dataset.logoVerticalScrollInit = 'true';

        const leftColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-left]');
        const rightColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-right]');
        const { logoVerticalScrollDuplicate: parsedDuplicate, logoVerticalMarquee: parsedMarquee } = verticalScroll.dataset;
        const marquee = parsedMarquee === 'true';
        const duplicateAmount = parsedDuplicate === undefined ? 2 : parseInt(parsedDuplicate, 10);

        const duplicateContent = (column, amount) => {
            if (!column || !(amount > 0)) return;
            const content = Array.from(column.children);
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < amount; i++) {
                content.forEach((node) => fragment.appendChild(node.cloneNode(true)));
            }
            column.appendChild(fragment);
        };
        const leftOriginalCount = leftColumn ? leftColumn.children.length : 0;
        const rightOriginalCount = rightColumn ? rightColumn.children.length : 0;
        duplicateContent(leftColumn, duplicateAmount);
        duplicateContent(rightColumn, duplicateAmount);

        if (marquee) {
            const startMarquee = (column, originalCount, goingUp) => {
                if (!column || column.children.length <= originalCount) return;
                gsap.killTweensOf(column);
                gsap.set(column, { y: 0 });
                const loopDistance = column.children[originalCount].offsetTop - column.children[0].offsetTop;
                if (loopDistance <= 0) return;
                gsap.fromTo(
                    column,
                    { y: goingUp ? 0 : -loopDistance },
                    { y: goingUp ? -loopDistance : 0, duration: loopDistance / 50, ease: 'none', repeat: -1 }
                );
            };
            const runMarquee = () => {
                startMarquee(leftColumn, leftOriginalCount, true);
                startMarquee(rightColumn, rightOriginalCount, false);
            };
            runMarquee();
            marqueeRefreshers.push(runMarquee);
            return;
        }

        const getTravel = (column) => Math.max(1, column.offsetHeight - verticalScroll.offsetHeight);

        gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
                trigger: verticalScroll,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                invalidateOnRefresh: true,
            }
        })
        .fromTo(
            leftColumn,
            { y: 0 },
            { y: () => -getTravel(leftColumn) },
            0
        )
        .fromTo(
            rightColumn,
            { y: () => -getTravel(rightColumn) },
            { y: 0 },
            0
        );
    });

    if (marqueeRefreshers.length) {
        let lastWidth = window.innerWidth;
        let resizeTimer;
        window.addEventListener('resize', () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                marqueeRefreshers.forEach((refresh) => refresh());
            }, 250);
        });
    }
}

// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
    initLogoVerticalScroll();
});
