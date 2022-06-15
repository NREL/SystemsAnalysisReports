export function lineSegmentIntersection(p11, p12, p21, p22) {
  const s1_x = p12.x - p11.x
  const s1_y = p12.y - p11.y
  const s2_x = p22.x - p21.x
  const s2_y = p22.y - p21.y

  const s = (-s1_y * (p11.x - p21.x) + s1_x * (p11.y - p21.y)) / (-s2_x * s1_y + s1_x * s2_y)
  const t = ( s2_x * (p11.y - p21.y) - s2_y * (p11.x - p21.x)) / (-s2_x * s1_y + s1_x * s2_y)

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Point of intersection
    return {x: p11.x + (t * s1_x), y: p11.y + (t * s1_y)}
  } else {
    return null
  }
}

export function lineIntersection(xLabel, yLabel, line1, line2) {
    for (var i  = 0; i < line1.length-1; i++) {
        for (var j = 0; j < line2.length-1; j++) {
            const intersectPoint = lineSegmentIntersection(
                {x: line1[i][xLabel], y: line1[i][yLabel]},
                {x: line1[i+1][xLabel], y: line1[i+1][yLabel]},
                {x: line2[i][xLabel], y: line2[i][yLabel]},
                {x: line2[i+1][xLabel], y: line2[i+1][yLabel]},
                );
            if (intersectPoint) {
                return intersectPoint;
            }
        }
    }

}
