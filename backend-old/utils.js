module.exports.setDifference = function setDifference(setA, setB){

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

module.exports.setUnion = function setUnion(setA, setB){

  const sumSet = new Set([]);

  Array.from(setA).map(item => {
    sumSet.add(item);
  });

  Array.from(setB).map(item => {
    sumSet.add(item);
  });

  return sumSet;
}
