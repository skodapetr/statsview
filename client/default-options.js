export default function createDefaultOptions() {
  return {
    "acgt-cycles": {
      "A": "green",
      "C": "red",
      "G": "brown",
      "T": "blue",
    },
    "indel-cycles": {
      "insertionsFwd": "red",
      "insertionsRev": "black",
      "deletionsFwd": "green",
      "deletionsRev": "blue",
    },
    "insert-size": {
      "pairsTotal": "brown",
      "inwardOrientedPairs": "green",
      "outwardOrientedPairs": "blue",
      "otherPairs": "violet",
    },
    "gc-content": {
      "gcf": "green",
      "gcl": "red",
    },
    "quality-2": {
      "FFQ" : {
        "median": "black",
        "mean": "red",
        "percentile": "gray"
      },
      "LFQ" : {
        "median": "black",
        "mean": "green",
        "percentile": "gray"
      }
    },
    "quality-3": {
      "FFQ" : {
      },
      "LFQ" : {
      }
    }
  };
}
