import { cloneDeep } from 'lodash';
export default function getMakerIndex() {
  let index = 'A,B,C,D,E,F,G,H,I,G,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(
    ','
  );
  let arr = cloneDeep(index);
  let a = cloneDeep(index);
  let b = cloneDeep(index);
  a.forEach(v1 => {
    b.forEach(v2 => {
      arr.push(`${v1}${v2}`);
    });
  });
  return arr;
}