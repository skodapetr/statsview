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
    }
  };
}
