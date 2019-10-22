// @flow

export type BchkFile = {
  "summary": {},
  "insert-size": {},
  // "gc-content": {},
  "acgt-cycles": {},
  // "quals-percentil": {},
  // "quals": {},
  "indel-cycles": {},
};

export function loadBchkFile(content: string): BchkFile {
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

  const insertSize = transposeMatrix(raw["IS"], [
    {"index": 0, "name": "insertSize"},
    {"index": 1, "name": "pairsTotal"},
    {"index": 2, "name": "inwardOrientedPairs"},
    {"index": 3, "name": "outwardOrientedPairs"},
    {"index": 4, "name": "otherPairs"},
  ]);

  const acgtCycles = transposeMatrix(raw["GCC"], [
    {"index": 0, "name": "cycle"},
    {"index": 1, "name": "A"},
    {"index": 2, "name": "C"},
    {"index": 3, "name": "G"},
    {"index": 4, "name": "T"},
  ]);

  const indelCycles = transposeMatrix(raw["IC"], [
    {"index": 1, "name": "insertionsFwd"},
    {"index": 2, "name": "insertionsRev"},
    {"index": 3, "name": "deletionsFwd"},
    {"index": 4, "name": "deletionsRev"},
  ]);

  return {
    "summary": summary,
    "insert-size": insertSize,
    // "gc-content": null, // gc-content.png
    "acgt-cycles": acgtCycles,
    // "quals-percentil": null, // quals2.png
    // "quals": null, // quals3.gp
    "indel-cycles": indelCycles
  };
}

function enumerateLines(content: string, callback: (string) => void) {
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

function transposeMatrix(
  values: Array<Array<string>>,
  namedRows: Array<{ "index": number, "name": string }>) {
  const result = {};
  result["count"] = values.length;
  result["max"] = 0;
  namedRows.forEach(({name}) => {
    result[name] = [];
  });
  values.forEach((item) => {
    namedRows.forEach(({name, index}) => {
      result[name].push(Number(item[index]));
      result.max = Math.max(result.max, Number(item[index]));
    });
  });
  return result;
}

