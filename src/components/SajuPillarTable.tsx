import { StyleSheet, Text, View } from "react-native";

import { elementColors, elementLabels } from "@/lib/sajuEngine";
import type { SajuDetail } from "@/lib/sajuDetail";

type Props = {
  detail: SajuDetail;
};

type RowKey = "stem" | "stemGod" | "branch" | "branchGod" | "hiddenStems" | "twelveLife" | "twelveSpirit";

type RowSpec = {
  key: RowKey;
  label: string;
  height: number;
  compact: boolean;
};

const COLUMN_HEADER_HEIGHT = 28;
const ROW_HEAD_WIDTH = 58;
const BORDER_COLOR = "#D8D0C4";
const ROW_SPECS: RowSpec[] = [
  { key: "stem", label: "천간", height: 58, compact: false },
  { key: "stemGod", label: "십성", height: 30, compact: true },
  { key: "branch", label: "지지", height: 58, compact: false },
  { key: "branchGod", label: "십성", height: 30, compact: true },
  { key: "hiddenStems", label: "지장간", height: 28, compact: true },
  { key: "twelveLife", label: "12운성", height: 28, compact: true },
  { key: "twelveSpirit", label: "12신살", height: 28, compact: true }
];

export function SajuPillarTable({ detail }: Props) {
  return (
    <View style={styles.shell}>
      <View style={styles.table}>
        <View style={[styles.headerRow, { height: COLUMN_HEADER_HEIGHT }]}>
          <View style={[styles.rowHeadSpacer, { height: COLUMN_HEADER_HEIGHT }]} />
          {detail.columns.map((column, index) => {
            const isLast = index === detail.columns.length - 1;

            return (
              <View
                key={column.key}
                style={[
                  styles.columnHeadCell,
                  { height: COLUMN_HEADER_HEIGHT, borderRightWidth: isLast ? 0 : StyleSheet.hairlineWidth }
                ]}
              >
                <Text style={styles.columnHeadText}>{column.label}</Text>
              </View>
            );
          })}
        </View>

        {ROW_SPECS.map((row, rowIndex) => {
          const isLastRow = rowIndex === ROW_SPECS.length - 1;

          return (
            <View
              key={row.key}
              style={[
                styles.bodyRow,
                { height: row.height, borderBottomWidth: isLastRow ? 0 : StyleSheet.hairlineWidth }
              ]}
            >
              <View style={[styles.rowHead, { height: row.height }]}>
                <Text style={styles.rowHeadText}>{row.label}</Text>
              </View>

              {detail.columns.map((column, columnIndex) => {
                const isLastColumn = columnIndex === detail.columns.length - 1;
                const cell = getCellValue(row.key, column);

                return (
                  <View
                    key={`${row.key}-${column.key}`}
                    style={[
                      styles.cell,
                      row.compact ? styles.compactCell : styles.pillarCell,
                      { height: row.height, borderRightWidth: isLastColumn ? 0 : StyleSheet.hairlineWidth }
                    ]}
                  >
                    {renderCellContent(row.key, cell.main, column.pillar.element)}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getCellValue(rowKey: RowKey, column: SajuDetail["columns"][number]): { main: string } {
  switch (rowKey) {
    case "stem":
      return { main: column.pillar.heavenlyStem };
    case "stemGod":
      return { main: column.stemGod };
    case "branch":
      return { main: column.pillar.earthlyBranch };
    case "branchGod":
      return { main: column.branchGod };
    case "hiddenStems":
      return { main: column.hiddenStems };
    case "twelveLife":
      return { main: column.twelveLife };
    case "twelveSpirit":
      return { main: column.twelveSpirit };
  }
}

function renderCellContent(rowKey: RowKey, main: string, element: keyof typeof elementColors) {
  if (rowKey === "stem" || rowKey === "branch") {
    const accent = elementColors[element];
    const suffix = `+${elementLabels[element]}`;

    return (
      <View style={styles.pillarContent}>
        <Text style={[styles.pillarMain, { color: accent }]} numberOfLines={1}>
          {main}
        </Text>
        <Text style={[styles.pillarSub, { color: accent }]} numberOfLines={1}>
          {suffix}
        </Text>
      </View>
    );
  }

  if (rowKey === "stemGod" || rowKey === "branchGod") {
    return (
      <Text style={[styles.tenGodText, { color: toneForTenGod(main) }]} numberOfLines={1}>
        {main}
      </Text>
    );
  }

  if (rowKey === "twelveLife") {
    return (
      <Text style={styles.twelveLifeText} numberOfLines={1}>
        {main}
      </Text>
    );
  }

  if (rowKey === "twelveSpirit") {
    return (
      <Text style={styles.twelveSpiritText} numberOfLines={1}>
        {main}
      </Text>
    );
  }

  return (
    <Text style={styles.hiddenStemText} numberOfLines={1}>
      {main}
    </Text>
  );
}

function toneForTenGod(label: string) {
  if (["비견", "겁재"].includes(label)) return "#E46B78";
  if (["식신", "상관"].includes(label)) return "#D39A49";
  if (["편재", "정재"].includes(label)) return "#5B93D6";
  if (["편관", "정관"].includes(label)) return "#B66AC7";
  if (["편인", "정인"].includes(label)) return "#4E9D96";
  return "#6650CC";
}

const styles = StyleSheet.create({
  shell: {
    gap: 8
  },
  table: {
    width: "100%",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: BORDER_COLOR,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#FFFFFF"
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER_COLOR
  },
  rowHeadSpacer: {
    width: ROW_HEAD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: BORDER_COLOR
  },
  columnHeadCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRightColor: BORDER_COLOR
  },
  columnHeadText: {
    color: "#8A6E54",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  bodyRow: {
    flexDirection: "row",
    borderBottomColor: BORDER_COLOR
  },
  rowHead: {
    width: ROW_HEAD_WIDTH,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 8,
    paddingRight: 6,
    backgroundColor: "#FFFFFF",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: BORDER_COLOR
  },
  rowHeadText: {
    color: "#6E5A46",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800"
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRightColor: BORDER_COLOR,
    paddingHorizontal: 4
  },
  pillarCell: {
    paddingTop: 2,
    paddingBottom: 4
  },
  compactCell: {
    paddingVertical: 0
  },
  pillarContent: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  pillarMain: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
    letterSpacing: 0
  },
  pillarSub: {
    position: "absolute",
    right: 2,
    bottom: 2,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
    letterSpacing: 0
  },
  tenGodText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0
  },
  hiddenStemText: {
    color: "#665C72",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0
  },
  twelveLifeText: {
    color: "#6A57B4",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0
  },
  twelveSpiritText: {
    color: "#8E6B4A",
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    letterSpacing: 0
  }
});
