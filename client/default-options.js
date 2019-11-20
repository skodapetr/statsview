export default function createDefaultOptions() {
  return {
    "acgt-cycles": {
      "A": "green",
      "C": "red",
      "G": "brown",
      "T": "blue",
      "margin": {
      },
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
    }
  };
}
