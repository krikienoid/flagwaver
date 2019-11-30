import Stats from 'stats.js';

export default function initStats() {
    const statsList = [new Stats(), new Stats(), new Stats()];

    statsList.map((s, i) => {
        s.showPanel(i);
        s.dom.style.left = 'auto';
        s.dom.style.right = `${i * 80}px`;
        document.body.appendChild(s.dom);
    });

    return {
        begin() {
            statsList.map(s => void s.begin());
        },
        end() {
            statsList.map(s => void s.end());
        }
    };
}
