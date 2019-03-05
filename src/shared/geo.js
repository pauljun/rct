export default {
  computedCircleCenter(pos1, pos2, r) {
    const x1 = pos1[0],
      y1 = pos1[1],
      x2 = pos2[0],
      y2 = pos2[1];
    let c1 = 0,
      c2 = 0,
      A = 0,
      B = 0,
      C = 0,
      y01 = 0,
      x01 = 0,
      x02 = 0,
      y02 = 0;
    c1 =
      (Math.pow(x2, 2) - Math.pow(x1, 2) + Math.pow(y2, 2) - Math.pow(y1, 2)) /
      2 /
      (x2 - x1);
    c2 = (y2 - y1) / (x2 - x1);

    A = 1.0 + Math.pow(c2, 2);
    B = 2 * (x1 - c1) * c2 - 2 * y1;
    C = Math.pow(x1 - c1, 2) + Math.pow(y1, 2) - Math.pow(r, 2);

    y01 = (-B + Math.sqrt(B * B - 4 * A * C)) / 2 / A;
    x01 = c1 - c2 * y01;

    y02 = (-B - Math.sqrt(B * B - 4 * A * C)) / 2 / A;
    x02 = c1 - c2 * y01;
    return [[x01, y01], [x02, y02]];
  },
  computedPoint(p1, p2, angle) {
    let A = p2[1] - p1[1];
    let B = p1[0] - p2[0];
    let C = (p2[0] - p1[0]) * p1[1] + (p1[1] - p2[1]) * p1[0];
    let a = (p2[0] + p1[0]) / 2;
    let b = (p2[1] + p1[1]) / 2;
    if (A == 0) {
      let x1 = a;
      let y1 = Math.abs(p2[0]) + b;
      let y2 = -Math.abs(p2[0]) + b;
      return [[x1, y1], [x1, y2]];
    }
    if (B == 0) {
      let y1 = b;
      let x1 = Math.abs(p1[1] - b) * Math.tan((angle * Math.PI) / 180) + a;
      let x2 = -Math.abs(p1[1] - b) * Math.tan((angle * Math.PI) / 180) + a;
      return [[x1, y1],[x2, y1]];
    }
    let ly = Math.sqrt(Math.pow(p2[1] - b, 2) + Math.pow(p1[1] - a, 2));
    let le = Math.sqrt(Math.pow(A, 2) + Math.pow(B, 2));
    let x1 = Math.abs(((A * Math.tan((angle * Math.PI) / 180)) / le) * ly) + a;
    let y1 = (B / A) * (x1 - a) + b;
    let x2 = -Math.abs(((A * Math.tan((angle * Math.PI) / 180)) / le) * ly) + a;
    let y2 = (B / A) * (x2 - a) + b;
    return [[x1, y1], [x2, y2]];
  }
};
