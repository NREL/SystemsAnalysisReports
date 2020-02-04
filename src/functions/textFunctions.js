
import React from 'react';

export function formatUnitLabels(label) {
    if (label === "m2") {
        label = <span>m<sup>2</sup></span>
    } else if (label === "m3") {
        label = <span>m<sup>3</sup></span>
    } else if (label === "m3/s") {
        label = <span>m<sup>3</sup>/s</span>
    } else if (label === "m3/s-m2") {
        label = <span>m<sup>3</sup>/s-m<sup>2</sup></span>
    } else if (label === "m3/s-W") {
        label = <span>m<sup>3</sup>/s-W</span>
    } else if (label === "m2/W") {
        label = <span>m<sup>2</sup>/W</span>
    } else if (label === "kg/m3") {
        label = <span>kg/m<sup>3</sup></span>
    } else if (label === "W/m2") {
        label = <span>W/m<sup>2</sup></span>
    }
    return label
}

