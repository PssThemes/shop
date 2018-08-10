const utils = require("./../backend/utils.js");

function SetDifference(setA, setB){

  const inAButNotInB = Array.from(setA).reduce((acc, item) => {
    if(setB.has(item)){
      return acc;
    }else{
      acc.push(item);
    }

    return acc;
  }, []);

  return new Set(inAButNotInB);
}

// const stuff = utils.SetDifference(new Set([ 1316463509571 ]), new Set([ 1330928549955, 1330928877635 ]));
const union = utils.setUnion(new Set([ 1316463509571, 0, "m" ]), new Set([ 1330928549955, 1330928877635 , 24]));
console.log("union: ", union);
