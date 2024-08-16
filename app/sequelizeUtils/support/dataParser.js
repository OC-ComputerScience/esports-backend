const parseValue = (value, dataType) => {
  if (dataType == "Integer") {
    return parseInt(value);
  } else if (dataType == "Float") {
    return parseFloat(value);
  }
  return null;
};

export default parseValue;
