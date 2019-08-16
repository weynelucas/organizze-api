function filterKeys(obj, only=[], except=[], filter) {
  return Object.keys(obj)
    .filter(key => {
      if (filter !== undefined) {
        return filter(key);
      }

      return (
        !(only.length || except.length)
        || (only.length && only.includes(key))
        || (except.length && !except.includes(key))
      ); 
    })
    .reduce((filtered, key) => {
      return { ...filtered, [key]: obj[key] };
    }, {});
}


module.exports = { filterKeys };