function createIntialOptions() {
  return {
    "acgt-cycles": {
      "A": "green",
      "C": "red",
      "G": "brown",
      "T": "blue",
      "margin": {},
    },
    "indel-cycles": {
      "insertionsFwd": "red",
      "insertionsRev": "black",
      "deletionsFwd": "green",
      "deletionsRev": "blue",
      "margin": {},
    },
    "insert-size": {
      "pairsTotal": "brown",
      "inwardOrientedPairs": "green",
      "outwardOrientedPairs": "blue",
      "otherPairs": "violet",
      "margin": {},
    },
    "gc-content": {
      "ref": "green",
      "gcf": "green",
      "gcl": "red",
      "margin": {},
    },
    "quality-2": {
      "FFQ": {
        "median": "black",
        "mean": "red",
        "percentile": "gray",
      },
      "LFQ": {
        "median": "black",
        "mean": "green",
        "percentile": "gray",
      },
      "margin": {},
    },
    "quality-3": {
      "FFQ": {},
      "LFQ": {},
      "margin": {},
    },
    "gc-depth": {
      "median": "blue",
      "10-90": "gray",
      "25-75": "lightblue",
    },
  };
}

import "./colors.js"

/*
orangeYelow="#faa300"; 
lightBlue="#00b7ed";
green="#00a077";
darkPurple="#114b5f";
yelow="#f5e636";
blue="#007ab9";
orangeRed="#b54a09";
purple="#e37dac";
gray="#b2b2b2";
black="#000000";
*/

export default function createInitialOptions() {
  return {
    "acgt-cycles": {
      "A": blue,
      "C": purple,
      "G": green,
      "T": orangeRed,
      "margin": {},
    },
    "indel-cycles": {
      "insertionsFwd": blue,
      "insertionsRev": beuge,
      "deletionsFwd": green,
      "deletionsRev": orangeRed,
      "margin": {},
    },
    "insert-size": {
      "pairsTotal": black,
      "inwardOrientedPairs": green,
      "outwardOrientedPairs": blue,
      "otherPairs": purple,
      "margin": {},
    },
    "gc-content": {
      "gcf": green,
      "gcl": darkPurple,
      "gcr": yelow,
      "ref": gray,
      "margin": {},
    },
    "quality-2": {
      "FFQ": {
        "median": black,
        "mean": orangeRed,
        "percentile": gray,
      },
      "LFQ": {
        "median": black,
        "mean": green,
        "percentile": gray,
      },
      "margin": {},
    },
    "quality-3": {
      "FFQ": {},
      "LFQ": {},
      "margin": {},
    },
    "gc-depth": {
      "median": blue,
      "10-90": gray,
      "25-75": lightBlue,
    },
  };
}
