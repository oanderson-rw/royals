import Color from "./color.min.js";

const notesMap = Object.freeze({
  graphite: "*",
  rnPlatform: "‡",
  nfPlatform: "§",
  mixed: "†",
  brand: "‖",
});

const mixWeights = Object.freeze({
  tints: [0.9, 0.7, 0.5, 0.2],
  shades: [0.2, 0.4, 0.5, 0.6],
});

/**
 * @param {Color} rootColor
 */
function getMixesCollectionFromRoot(rootColor) {
  if (!(rootColor instanceof Color)) {
    rootColor = new Color(rootColor);
  }

  return [
    rootColor.mix("white", mixWeights.tints[0], {
      space: "srgb",
    }),
    rootColor.mix("white", mixWeights.tints[1], {
      space: "srgb",
    }),
    rootColor.mix("white", mixWeights.tints[2], {
      space: "srgb",
    }),
    rootColor.mix("white", mixWeights.tints[3], {
      space: "srgb",
    }),
    rootColor,
    rootColor.mix("black", mixWeights.shades[0], {
      space: "srgb",
    }),
    rootColor.mix("black", mixWeights.shades[1], {
      space: "srgb",
    }),
    rootColor.mix("black", mixWeights.shades[2], {
      space: "srgb",
    }),
    rootColor.mix("black", mixWeights.shades[3], {
      space: "srgb",
    }),
  ];
}

const royalRoot = new Color("#0056ef"); // aka "Circuit"

const colorGroups = {
  royalsGraphite: {
    displayName: "Royals",
    colors: [
      new Color("#ecf2fe"),
      new Color("#bad3fc"),
      new Color("#80acfa"),
      new Color("#387ffa"),
      royalRoot,
      new Color("#0044c2"),
      new Color("#003494"),
      new Color("#002570"),
      new Color("#011a4c"),
    ],
    notes: ["graphite", "brand"],
  },
  royalsMixed: {
    displayName: "Royals",
    colors: getMixesCollectionFromRoot(royalRoot),
    notes: ["mixed", "rnPlatform", "nfPlatform"],
  },
  cobalts: {
    displayName: "Cobalts",
    colors: getMixesCollectionFromRoot("#2a3690"),
    notes: ["mixed", "rnPlatform"],
  },
  midnights: {
    displayName: "Midnights",
    colors: getMixesCollectionFromRoot("#141c44"),
    notes: ["mixed", "rnPlatform"],
  },
  sunsets: {
    displayName: "Sunsets",
    colors: getMixesCollectionFromRoot("#ff5340"),
    notes: ["mixed", "rnPlatform"],
  },
  flames: {
    displayName: "Flames",
    colors: getMixesCollectionFromRoot("#ff634f"),
    notes: ["mixed", "brand"],
  },
  turbos: {
    displayName: "Turbos",
    colors: getMixesCollectionFromRoot("#e1e31c"),
    notes: ["mixed", "rnPlatform"],
  },
  sparks: {
    displayName: "Sparks",
    colors: getMixesCollectionFromRoot("#e4ed57"),
    notes: ["mixed", "brand"],
  },
  graysGraphite: {
    displayName: "Neutrals",
    colors: [
      new Color("#f0f0f0"),
      new Color("#d1d1d1"),
      new Color("#b3b3b3"),
      new Color("#858585"),
      new Color("#666666"),
      new Color("#525252"),
      new Color("#333333"),
      new Color("#1f1f1f"),
      new Color("#0a0a0a"),
    ],
    notes: ["graphite"],
  },
  graysMixed: {
    displayName: "Neutrals",
    colors: getMixesCollectionFromRoot("#666666"),
    notes: ["mixed", "rnPlatform"],
  },
};

/**
 * @param {string} groupName
 * @param {"top" | "bottom"} row
 */
function updateCustomPropsByGroup(groupName, row) {
  if (colorGroups[groupName]) {
    const setProp = document.body.style.setProperty.bind(document.body.style);
    const groupColors = colorGroups[groupName].colors;
    const customPropBase = row === "top" ? "color-top-row" : "color-bottom-row";

    for (let colIdx = 0; colIdx < 9; colIdx++) {
      const propName = `--${customPropBase}--${colIdx * 100 + 100}`;
      setProp(propName, groupColors[colIdx].toString());
    }
  }
}

function populateColorSelects() {
  const groupKeys = Object.keys(colorGroups);
  const selectOptionData = groupKeys.map((key) => [
    key,
    colorGroups[key].displayName,
    colorGroups[key].notes,
  ]);

  Array.from(document.querySelectorAll("select[data-colors-select]")).forEach(
    (selectEl) => {
      selectOptionData.forEach(([key, name, notes]) => {
        const optionEl = document.createElement("option");
        optionEl.value = key;

        let innerText = name;
        Object.keys(notesMap).forEach((noteType) => {
          if (notes.includes(noteType)) {
            innerText += notesMap[noteType];
          }
        });
        optionEl.innerText = innerText;

        selectEl.appendChild(optionEl);
      });
    },
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const bodyStyle = document.body.style;
  document.querySelectorAll("span.color").forEach((el) => {
    const isDarkerColor = el.dataset["darker"] !== undefined;
    el.addEventListener("mouseover", () => {
      bodyStyle.backgroundColor = el.style.getPropertyValue("--color");
      bodyStyle.setProperty(
        "--text-color",
        isDarkerColor ? "var(--text-color__light)" : "var(--text-color__dark)",
      );
    });
    el.addEventListener("mouseout", () => {
      bodyStyle.backgroundColor = "white";
      bodyStyle.setProperty("--text-color", "var(--text-color__dark)");
    });
  });

  populateColorSelects();

  updateCustomPropsByGroup("royalsGraphite", "top");
  updateCustomPropsByGroup("royalsGraphite", "bottom");
});

document.addEventListener("input", ({ target }) => {
  const isTarget = (datasetPropName) =>
    target.dataset[datasetPropName] !== globalThis.undefined;

  if (isTarget("colorsSelectTop")) {
    updateCustomPropsByGroup(target.value, "top");
  }

  if (isTarget("colorsSelectBottom")) {
    updateCustomPropsByGroup(target.value, "bottom");
  }
});
