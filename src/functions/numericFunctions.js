export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

export function range(start, stop, step) {
    // This function returns an array of integers beginning at the "start"
    // value,  ending at the "stop" value, and incrementing by the "step" value.

    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};


export function filterPointsLessThan(pointLabel, pointArray, intersectionLabel, intersectionPoint) {
    let newArray = [];

    for (var i = 0; i < pointArray.length; i++) {
        if(pointArray[i][pointLabel] >= intersectionPoint[intersectionLabel]) {
            newArray.push(pointArray[i]);
        }
    }

    return newArray
}

export function filterPointsGreaterThan(pointLabel, pointArray, intersectionLabel, intersectionPoint) {
    let newArray = [];

    for (var i = 0; i < pointArray.length; i++) {
        if(pointArray[i][pointLabel] <= intersectionPoint[intersectionLabel]) {
            newArray.push(pointArray[i]);
        }
    }

    return newArray
}