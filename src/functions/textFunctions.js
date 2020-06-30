
import React from 'react';

export function formatUnitLabels(label) {
    // Format unit labels with superscripts using HTML <sup> blocks.
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
    } else if (label === "ft2") {
        label = <span>ft<sup>2</sup></span>
    } else if (label === "ft3") {
        label = <span>ft<sup>2</sup></span>
    } else if (label === "ft3/min") {
        label = <span>ft<sup>3</sup>/min</span>
    } else if (label === "Btu/hr-ft2") {
        label = <span>Btu/hr-ft<sup>2</sup></span>
    } else if (label === "ft2/ton") {
        label = <span>ft<sup>2</sup>/ton</span>
    } else if (label === "ft3/min-ft2") {
        label = <span>ft<sup>3</sup>/min-ft<sup>2</sup></span>
    } else if (label === "ft3/min-ton") {
        label = <span>ft<sup>3</sup>/min-ton</span>
    } else if (label === "lb/ft3") {
        label = <span>lb/ft<sup>3</sup></span>
    }
    return label
}

