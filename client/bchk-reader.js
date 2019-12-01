export function loadBchkFile(content) {
  const raw = {};
  const summary = {};

  enumerateLines(content, (line) => {
    if (line.startsWith("#")) {
      return;
    }
    const tokens = line.split("\t");
    const key = tokens[0].toUpperCase();
    if (tokens[0] === "SN") {
      const key = tokens[1].substr(0, tokens[1].length - 1);
      summary[key] = Number(tokens[2]);
    } else {
      if (!raw[key]) {
        raw[key] = [];
      }
      raw[key].push(tokens.slice(1));
    }
  });

  let insertSize = null;
  if (raw["IS"]) {
    insertSize = transposeMatrix(raw["IS"], [
      {"index": 0, "name": "insertSize"},
      {"index": 1, "name": "pairsTotal"},
      {"index": 2, "name": "inwardOrientedPairs"},
      {"index": 3, "name": "outwardOrientedPairs"},
      {"index": 4, "name": "otherPairs"},
    ]);
  }

  // Show as a normalized values (Y) for bins (X).
  // We use GCF and GCL
  let gcContent = null;
  if (raw["GCF"] && raw["GCL"]) {
    gcContent = {
      ...transposeMatrix(raw["GCF"], [
        {"index": 0, "name": "gcf-x"},
        {"index": 1, "name": "gcf-y"},
      ]),
      ...transposeMatrix(raw["GCL"], [
        {"index": 0, "name": "gcl-x"},
        {"index": 1, "name": "gcl-y"},
      ])
    };
    gcContent["gcf-y"] = normalize(gcContent["gcf-y"]);
    gcContent["gcl-y"] = normalize(gcContent["gcl-y"]);
  }

  let acgtCycles = null;
  if (raw["GCC"]) {
    acgtCycles = transposeMatrix(raw["GCC"], [
      {"index": 0, "name": "cycle"},
      {"index": 1, "name": "A"},
      {"index": 2, "name": "C"},
      {"index": 3, "name": "G"},
      {"index": 4, "name": "T"},
    ]);
  }

  let indelCycles = null;

  if (raw["IC"]) {
    indelCycles = transposeMatrix(raw["IC"], [
      {"index": 1, "name": "insertionsFwd"},
      {"index": 2, "name": "insertionsRev"},
      {"index": 3, "name": "deletionsFwd"},
      {"index": 4, "name": "deletionsRev"},
    ]);
  }

  // FFQ {quality bin X } {... values = Y}
  // show median, min, percentil for Y
  // LFQ -> kazde jeden obrazek
  // X = 0 - 75 (cycle)
  let quality2 = null;
  if (raw["FFQ"] && raw["LFQ"]) {
    quality2 = {
      "FFQ": createQuality2Graph(raw["FFQ"]),
      "LFQ": createQuality2Graph(raw["LFQ"])
    };
  }

  // FFQ, LFQ
  // Data na radku (krome prvniho) jsou udaje pro krivku
  const quality3Fnc = (values) => values.slice(1).map((value) => Number(value));
  let quality3 = null;
  if (raw["FFQ"] && raw["LFQ"]) {
    quality3 = {
      "FFQ": raw["FFQ"].map(quality3Fnc),
      "LFQ": raw["FFQ"].map(quality3Fnc)
    };
  }
  return {
    "summary": summary,
    "insert-size": insertSize,
    "gc-content": gcContent,
    "acgt-cycles": acgtCycles,
    "quality-2": quality2,
    "quality-3": quality3,
    "indel-cycles": indelCycles
  };
}

function enumerateLines(content, callback) {
  let line = "";
  for (let index = 0; index < content.length; ++index) {
    if (content[index] === "\n") {
      callback(line);
      line = "";
    } else {
      line += content[index];
    }
  }
  callback(line);
}

function transposeMatrix(values, namedRows) {
  const result = {};
  result["count"] = values.length;
  namedRows.forEach(({name}) => {
    result[name] = [];
  });
  values.forEach((item) => {
    namedRows.forEach(({name, index}) => {
      result[name].push(Number(item[index]));
    });
  });
  return result;
}

function normalize(values) {
  const max = Math.max(...values);
  return values.map(value => value / max);
}

function createQuality2Graph(rows) {
  const binsValues = [];
  const medianValues = [];
  const meanValues = [];
  const percentile25Values = [];
  const percentile75Values = [];
  rows.forEach((row) => {
    binsValues.push(Number(row[0]));
    const values = row.slice(1).map(value => Number(value));
    const sum = values.reduce((left, right) => left + right);
    //
    medianValues.push(percentileForQuality(values, sum, 0.5));
    meanValues.push(meanForQuality(values, sum));
    percentile25Values.push(percentileForQuality(values, sum, 0.25));
    percentile75Values.push(percentileForQuality(values, sum, 0.75));
  });
  return {
    "bins": binsValues,
    "median": medianValues,
    "mean": meanValues,
    "percentile-25": percentile25Values,
    "percentile-75": percentile75Values
  };
}

function percentileForQuality(values, sum, percentile) {
  let index = sum * percentile;
  for (let i = 0; i < values.length; ++i) {
    if (index > values[i]) {
      // We just step over these values.
      index -= values[i];
      continue;
    } else if (index <= values[i]) {
      // The required index is in given array.
      return i;
    }
  }
  throw RangeError("Can't get percentile.")
}

function meanForQuality(values, sum) {
  let average = 0;
  values.forEach((count, quality) => {
    average += count * quality;
  });
  return average /= sum;
}

function transposeSubMatrix(values, offsetX) {
  const width = values[0].length - offsetX;
  const output = [];
  for (let index = 0; index < width; ++index) {
    output.push([]);
  }
  values.forEach((row) => {
    for (let index = 0; index < width; ++index) {
      output[index].push(Number(row[index + offsetX]));
    }
  });
  return output;
}