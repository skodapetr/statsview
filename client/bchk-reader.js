import { min, max, schemePurples } from "d3";

export function loadBchkFile(content) {
  let line;
  nextLine(content, 0, (li) => {
    line = li;
  });
  if(line == "gc-cont-ref"){
    return loadGCcontRef(content);
  }else{
    return loadWholeData(content);
  }
}

function loadGCcontRef(content){
  let x = [];
  let vals = [];
  let file;
  enumerateLines(content, (line) => {
    if(line != "gc-cont-ref"){
      if(line.startsWith("°")){
        file = line.substr(1, line.length -1);
        return;
      }else if(line.startsWith("#")){
        return;
      }else{
        let both = line.split("\t");
        x.push(both[0])
        vals.push(both[1]);
      }
    }
  });
  return {
    "val":{
      "ref-x": x,
      "ref-y": vals,
      "count": x.length,
    },
    "file": file,
    "name": "gc-content-ref",
  };
}

function loadWholeData(content){
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
      ]),
    };
    if(raw["GCR"]){
      gcContent = {
        ...gcContent,
        ...transposeMatrix(raw["GCR"], [
          {"index": 0, "name": "gcr-x"},
          {"index": 1, "name": "gcr-y"},
        ])
      };
    }
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

  // GCD
  let gcDepth = null;
  if (raw["GCD"]) {
    gcDepth  = transposeMatrix(raw["GCD"], [
      {"index": 1, "name": "x"},
      {"index": 2, "name": "10"},
      {"index": 3, "name": "25"},
      {"index": 4, "name": "50"},
      {"index": 5, "name": "75"},
      {"index": 6, "name": "90"},
    ]);
    gcDepth = supressArr(gcDepth, "x", ["x", "10", "25", "50", "75", "90"]);
  }

  return {
    "summary": summary,
    "insert-size": insertSize,
    "gc-content": gcContent,
    "acgt-cycles": acgtCycles,
    "quality-2": quality2,
    "quality-3": quality3,
    "indel-cycles": indelCycles,
    "gc-depth": gcDepth,
  };
}

function enumerateLines(content, callback) {
  let index = 0;
  while(index < content.length){
    index = nextLine(content, index, callback)
  }
}

function nextLine(content, startIndex, callback){
  let line = "";
  for (let i = startIndex; i < content.length; i++){
    if (content[i] === "\n" || content[i] === "\r") {
      if (line != ""){
        callback(line);
      }
      return i + 1;
    } else {
      line += content[i];
    }
  }
  callback(line);
  return content.length;
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

function supressArr(arr, ref, innerArrays){
  let result = {};
  let first = 0;
  while(arr[ref][first] < 1){
    first++;
  }
  let last = arr[ref].length - 1;
  while(arr[ref][last] > 99){
    last--;
  }
  for(let i = 0; i < innerArrays.length; i++){
    result[innerArrays[i]] = arr[innerArrays[i]].slice(first, last);
  }
  return result;
}

export function loadThresholds(content){
  let processing = false;
  nextLine(content, 0, (line) => {
    if(line == "autoQC-thresholds"){
      processing = true;
    }
  });
  if(processing){
    let result = {};
    let file = undefined;
    enumerateLines(content, (line) => {
      if(line != "autoQC-thresholds"){
        if(line.startsWith("°")){
          file = line.substr(1, line.length -1);
          return;
        }else if(line.startsWith("#")){
          return;
        }else{
          let values = line.split("\t");
          result[values[0]] = {
            "Ok": values[1],
            "Bad": values[2],
            "legend": values[3],
          };
        }
      }
    });
    console.log(result);
    return {
      "thresholds": result,
      "file": file,
    };
  }
}

export function saveThresholds(thresholds) {
  console.log("saving thresholds...");
  let data = thresholdsString(thresholds);
  let date = new Date();
  let sep = "_";
  let dateInFile = date.getFullYear() + sep + (date.getMonth() + 1) + sep + date.getDate() + sep + date.getHours() + sep + date.getMinutes();
  let filename = "rmme-viewer-autoQC-" + dateInFile + ".txt";
  var file = new Blob([data], {type: "text/strings"});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
      var a = document.createElement("a"),
              url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);  
      }, 0); 
  }
}

function thresholdsString(thresholds){
  let result = "autoQC-thresholds\n";
  for(let i = 0; i < thresholds.length; i++){
    let name = thresholds[i]["name"];
    let ok = thresholds[i]["thresholds"]["Ok"];
    let bad = thresholds[i]["thresholds"]["Bad"];
    let legend = thresholds[i]["thresholds"]["legend"] ? thresholds[i]["thresholds"]["legend"] : ""
    result += name + "\t" + ok + "\t" + bad + "\t" + legend + "\n";
  }
  return result;
}

/*
export function loadBchkFileExtremeSuression(content, supression=3) {
  let loaded = loadBchkFile(content);
  loaded["acgt-cycles"] = supressWholeArray(loaded["acgt-cycles"], 
    ["A","C","G","T","cycle"], supression);
  loaded["insert-size"] = supressWholeArray(loaded["insert-size"], 
    ["insertSize","pairsTotal","inwardOrientedPairs","outwardOrientedPairs","otherPairs"], supression);
  loaded["gc-content"] = supressWholeArray(loaded["gc-content"], 
    ["gcf-x","gcl-x","gcf-y","gcl-y"], supression);
  loaded["quality-2"]["FFQ"] = supressWholeArray(loaded["quality-2"]["FFQ"], 
    ["bins","mean","median","percentile-25","percentile-75"], supression);
  loaded["quality-2"]["LFQ"] = supressWholeArray(loaded["quality-2"]["LFQ"], 
    ["bins","mean","median","percentile-25","percentile-75"], supression);
  loaded["quality-3"] = supressWholeArray(loaded["quality-3"], 
    ["FFQ","LFQ"], supression);
  loaded["indel-cycles"] = supressWholeArray(loaded["indel-cycles"], 
    ["deletionsFwd","deletionsRev","insertionsFwd","insertionsRev"], supression);
  loaded["gc-depth"] = supressWholeArray(loaded["gc-depth"], 
    ["10","25","50","75","90","x"], supression);
  return loaded;
}

function supressWholeArray(array, innerArrays, supression){
  let result = {};
  for(let i = 0; i < innerArrays.length; i++){
    result[innerArrays[i]] = arrayWithSupression(array, innerArrays[i], supression);
  }
  if (array["count"]){
    result["count"] = result[innerArrays[0]].length;
  }
  return result;
}

function arrayWithSupression(array, dim, supression){
  let lowerB = Math.round(array[dim].length * supression/100 + 0.5);
  let higherB = Math.round(array[dim].length*(1-supression/100) - 0.5);
  return array[dim].slice(lowerB, higherB);
}
*/