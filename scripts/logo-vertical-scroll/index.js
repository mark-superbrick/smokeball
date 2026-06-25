function initLogoVerticalScroll() {

    gsap.registerPlugin(ScrollTrigger);

    const verticalScrolls = document.querySelectorAll('[data-logo-vertical-scroll-wrap]');
    if(!verticalScrolls.length) return;

    verticalScrolls.forEach((verticalScroll, index) => {
        const leftColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-left]');
        const rightColumn = verticalScroll.querySelector('[data-logo-vertical-scroll-right]');
        const { logoVerticalScrollSpeed: parsedSpeed, logoVerticalScrollSpeedRight: parsedSpeedRight, logoVerticalScrollDuplicate: parsedDuplicate, logoVerticalScrollDuplicateRight: parsedDuplicateRight } = verticalScroll.dataset;
        const marquee = verticalScroll.dataset.logoVerticalMarquee === 'true';
        const speed = parseFloat(parsedSpeed) || .25;
        const speedRight = marquee ? speed : (parseFloat(parsedSpeedRight) || 5);
        const duplicateAmount = parsedDuplicate === undefined ? 1 : parseInt(parsedDuplicate, 10);
        const duplicateRight = marquee ? duplicateAmount : (parsedDuplicateRight === undefined ? duplicateAmount + 1 : parseInt(parsedDuplicateRight, 10));

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
        duplicateContent(rightColumn, duplicateRight);

        if (marquee) {
            const startMarquee = (column, originalCount, multiplier, goingUp) => {
                if (!column || column.children.length <= originalCount) return;
                const loopDistance = column.children[originalCount].offsetTop - column.children[0].offsetTop;
                if (loopDistance <= 0) return;
                gsap.fromTo(
                    column,
                    { y: goingUp ? 0 : -loopDistance },
                    { y: goingUp ? -loopDistance : 0, duration: loopDistance / (50 * multiplier), ease: 'none', repeat: -1 }
                );
            };
            startMarquee(leftColumn, leftOriginalCount, speed, true);
            startMarquee(rightColumn, rightOriginalCount, speedRight, false);
            return;
        }

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
