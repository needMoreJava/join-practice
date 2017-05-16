const oneToMany = (one, many, newKey, foreignKey) => {
console.log('one', one);
console.log('many',many);
console.log('newKey',newKey);
console.log('foreignKey',foreignKey);

let answer =  many.reduce((acc, country, currindex, array) => {
  let innerObj = new Object
  innerObj.id = country.id
  innerObj.name = country.name
  innerObj[newKey] = []
  one.forEach( wine => {
    if(wine.country_id === country.id) {
      innerObj[newKey].push(wine)
    }
  })
  acc.push(innerObj)
  return acc
},[])
console.dir(answer, { depth: null });
return answer

}

const belongsTo = (one, many, newKey, foreignKey) => {

}

module.exports = { oneToMany, belongsTo }
