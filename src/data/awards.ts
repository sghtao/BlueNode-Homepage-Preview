export type AwardRecord = {
  rank: string;
  title: string;
  displayTitle: string;
  xsLines?: readonly [string, string];
};

export type AwardItem = {
  year: number;
  records: AwardRecord[];
};

export const awardItems: AwardItem[] = [
  {
    year: 2026,
    records: [
      {
        rank: "1위",
        title: "아비트럼 미니 해커톤",
        displayTitle: "Arbitrum Mini Hackathon — 1st Place",
      },
      {
        rank: "1위",
        title: "BuidlHack 2026 · BNB Chain 트랙",
        displayTitle: "BUIDL Hack · BNB Chain Track — 1st Place",
      },
    ],
  },
  {
    year: 2025,
    records: [
      {
        rank: "수상",
        title: "KOBAC",
        displayTitle: "KOBAC (Korea Blockchain Society Conference) — Winner",
        xsLines: [
          "KOBAC (Korea Blockchain Society",
          "Conference) — Winner",
        ],
      },
      { rank: "3위", title: "ideaTON", displayTitle: "IdeaTON — 3rd Place" },
      {
        rank: "트랙 특별상",
        title: "XRPL × Biconomy",
        displayTitle: "XRP Ledger x Biconomy Track — Winner",
      },
      {
        rank: "2위",
        title: "BUIDL AI · Upstage",
        displayTitle: "BUIDL AI Hackathon Upstage — 2nd Place",
      },
      {
        rank: "3위",
        title: "BUIDL AI · Upstage",
        displayTitle: "BUIDL AI Hackathon Upstage — 3rd Place",
      },
      {
        rank: "우수상",
        title: "인하대 블록체인·AI 해커톤",
        displayTitle: "Blockchain AI Hackathon — Excellence Award",
      },
      {
        rank: "Top Brainrot 트랙",
        title: "Surreal World Assets Buildathon",
        displayTitle: "Surreal World Assets Buildathon — Top Brainrot Track",
        xsLines: [
          "Surreal World Assets Buildathon",
          "— Top Brainrot Track",
        ],
      },
    ],
  },
  {
    year: 2024,
    records: [
      {
        rank: "4위",
        title: "비트코인 서울",
        displayTitle: "Bitcoin Seoul Hackathon — 4th Place",
      },
      {
        rank: "ENS Prize",
        title: "ETH Tokyo",
        displayTitle: "ETH Tokyo — ENS Prize Winner",
      },
      {
        rank: "장려상",
        title: "BEST 경진대회",
        displayTitle: "BEST Blockchain Competition",
      },
      {
        rank: "1위",
        title: "QuickNode PYUSD 트랙",
        displayTitle: "Build on QuickNode · PYUSD Track — 1st Place",
      },
    ],
  },
  {
    year: 2023,
    records: [
      {
        rank: "최우수상",
        title: "GBIC",
        displayTitle: "GBIC Hackathon — Grand Prize",
      },
      {
        rank: "우수상",
        title: "GBIC",
        displayTitle: "GBIC Hackathon — Excellence Award",
      },
    ],
  },
];

export const totalAwardCount = awardItems.reduce(
  (sum, item) => sum + item.records.length,
  0,
);
