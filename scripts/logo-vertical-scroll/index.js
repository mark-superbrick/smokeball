function initLogoVerticalScroll() {

    gsap.registerPlugin(ScrollTrigger);

    const verticalScrolls = document.querySelectorAll('[data-logo-vertical-scroll-wrap]');
    if(!verticalScrolls.length) return;

    verticalScrolls.forEach((verticalScroll, index) => {
        const leftColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-left]');
        const rightColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-right]');
        const { logoVerticalScrollSpeed: parsedSpeed, logoVerticalScrollSpeedRight: parsedSpeedRight, logoVerticalScrollDuplicate: parsedDuplicate, logoVerticalScrollDuplicateRight: parsedDuplicateRight } = verticalScroll.dataset;
        const speed = parseFloat(parsedSpeed) || .25;
        const speedRight = parseFloat(parsedSpeedRight) || 5;
        const duplicateAmount = parsedDuplicate === undefined ? 1 : parseInt(parsedDuplicate, 10);
        const duplicateRight = parsedDuplicateRight === undefined ? duplicateAmount + 1 : parseInt(parsedDuplicateRight, 10);

        const duplicateContent = (column, amount) => {
            if (!column || !(amount > 0)) return;
            const content = Array.from(column.children);
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < amount; i++) {
                content.forEach((node) => fragment.appendChild(node.cloneNode(true)));
            }
            column.appendChild(fragment);
        };
        duplicateContent(leftColumn, duplicateAmount);
        duplicateContent(rightColumn, duplicateRight);

        const getTravel = (column, multiplier) => {
            const overflow = Math.max(0, column.offsetHeight - verticalScroll.offsetHeight);
            return Math.min(overflow * multiplier, overflow);
        };

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
            { y: () => -getTravel(leftColumn, speed) },
            0
        )
        .fromTo(
            rightColumn,
            { y: () => -getTravel(rightColumn, speedRight) },
            { y: 0 },
            0
        );
    });
}

// Initialize CSS Marquee
document.addEventListener('DOMContentLoaded', function() {
    initLogoVerticalScroll();
});
