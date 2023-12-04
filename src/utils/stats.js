import Stats from "stats.js";

export function getStats(){

    const stats = new Stats();

    document.body.appendChild(stats.dom);

    return stats;
}