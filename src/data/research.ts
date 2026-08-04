// 공개 리서치 데이터. authorHandles는 members.ts의 공개 표기와 조인합니다.

export type ResearchArticle = {
  recordId: string;
  slug: string;
  title: string;
  authorHandles: string[];
  publishedAt: string; // YYYY-MM-DD
  tags: string[];
  snippet: string;
  externalUrl: string;
};

export const researchArticles: ResearchArticle[] = [
  {
    recordId: "R/memecoin-guide",
    slug: "memecoin-guide",
    title: "밈코인이란?",
    authorHandles: ["wonpil"],
    publishedAt: "2024-05-06",
    tags: ["research", "memecoin"],
    snippet:
      "2024년 현재 수많은 밈코인이 계속 쏟아져 나오고 있습니다. 장난에서 시작한 밈코인이 이제는 시장의 흐름에 영향을 주는 무시할 수 없는 존재로 성장해 가고 있습니다.",
    externalUrl: "https://medium.com/bluenode/%EB%B0%88%EC%BD%94%EC%9D%B8%EC%9D%B4%EB%9E%80-8ce4ab9e62c2",
  },
  {
    recordId: "R/nft-digital-assets",
    slug: "nft-digital-assets",
    title: "디지털 자산의 혁명: NFT",
    authorHandles: ["jiho"],
    publishedAt: "2024-04-15",
    tags: ["NFT", "ERC-721", "collectibles"],
    snippet:
      "NFT의 개요부터 성공적인 NFT 프로젝트를 위한 조건까지. 대체 불가능한 디지털 자산으로 각각 고유한 정보를 담아 디지털 아트·게임 아이템·개인 인증서에서 소유권과 저작권을 입증합니다.",
    externalUrl: "https://medium.com/bluenode/%EB%94%94%EC%A7%80%ED%84%B8-%EC%9E%90%EC%82%B0%EC%9D%98-%ED%98%81%EB%AA%85-nft-1a11a086dd24",
  },
  {
    recordId: "R/near-growth",
    slug: "near-growth",
    title: "[NEAR] NEAR의 최근 성과와 성장의 원동력",
    authorHandles: ["jaewon"],
    publishedAt: "2024-03-08",
    tags: ["NEAR", "layer1"],
    snippet:
      "NEAR Protocol의 최근 성과와 성장 배경을 사용자 활동과 생태계 관점에서 분석합니다.",
    externalUrl: "https://medium.com/bluenode/near-near%EC%9D%98-%EC%B5%9C%EA%B7%BC-%EC%84%B1%EA%B3%BC%EC%99%80-%EC%84%B1%EC%9E%A5%EC%9D%98-%EC%9B%90%EB%8F%99%EB%A0%A5-aa42a36328a1",
  },
  {
    recordId: "R/near-consumer-dapps",
    slug: "near-consumer-dapps",
    title: "Web2에서 Web3로의 전환: NEAR 기반 Consumer dApp 성공 사례",
    authorHandles: ["jiho"],
    publishedAt: "2024-02-02",
    tags: ["NEAR", "consumer-dApp"],
    snippet:
      "많은 Web2 기업이 블록체인으로 중앙화 시스템의 한계를 넘으려 시도합니다. NEAR 기반 컨슈머 dApp의 실제 성공 사례를 통해 전환의 조건을 연구합니다.",
    externalUrl: "https://medium.com/bluenode/web2%EC%97%90%EC%84%9C-web3-%EB%A1%9C%EC%9D%98-%EC%A0%84%ED%99%98-near-%EA%B8%B0%EB%B0%98-consumer-dapp-%EC%84%B1%EA%B3%B5-%EC%82%AC%EB%A1%80-%EC%97%B0%EA%B5%AC-17bbfc0f7ef1",
  },
  {
    recordId: "R/web3auth-fastauth",
    slug: "web3auth-fastauth",
    title: "Web3Auth & NEAR's FastAuth: UX 개선 월렛 솔루션",
    authorHandles: ["uksang"],
    publishedAt: "2024-01-31",
    tags: ["wallet", "UX", "NEAR"],
    snippet:
      "Web3Auth와 NEAR FastAuth는 Web3 온보딩 장벽을 낮추는 솔루션입니다. 플러그 앤 플레이 지갑 인프라로 온보딩 UX를 어떻게 개선하는지 분석합니다.",
    externalUrl: "https://medium.com/bluenode/web3auth-nears-fastauth-ux-%EA%B0%9C%EC%84%A0-%EC%9B%94%EB%A0%9B-%EC%86%94%EB%A3%A8%EC%85%98-cc2b146c9ada",
  },
  {
    recordId: "R/dydx-derivatives",
    slug: "dydx-derivatives",
    title: "dYdX: Could Be The Dominator Of Decentralized Derivatives Exchange?",
    authorHandles: ["uksang"],
    publishedAt: "2023-11-16",
    tags: ["dYdX", "DeFi", "derivatives"],
    snippet:
      "탈중앙 파생상품 거래소 시장에서 dYdX가 지배자가 될 수 있는지, 구조와 경쟁력을 분석합니다.",
    externalUrl: "https://medium.com/bluenode/dydx-could-be-the-dominator-of-decentralized-derivatives-exchange-9953fd33f063",
  },
  {
    recordId: "R/ethereum-nodes",
    slug: "ethereum-nodes",
    title: "이더리움 노드",
    authorHandles: ["hangil"],
    publishedAt: "2023-10-29",
    tags: ["ethereum", "node"],
    snippet:
      "노드와 클라이언트의 개념부터. 블록체인 네트워크의 구성원으로서 트랜잭션과 블록을 생성·검증·전파·저장하는 노드의 역할을 정리합니다.",
    externalUrl: "https://medium.com/bluenode/%EC%9D%B4%EB%8D%94%EB%A6%AC%EC%9B%80-%EB%85%B8%EB%93%9C-0476f8b2dcf2",
  },
  {
    recordId: "R/byzantine-generals",
    slug: "byzantine-generals",
    title: "비잔틴 장군 문제",
    authorHandles: ["hangil"],
    publishedAt: "2023-10-29",
    tags: ["consensus", "blockchain"],
    snippet:
      "램포트·쇼스탁·피스가 1982년 발표한 논문에서 시작된 분산 네트워크의 합의 난제. 블록체인 합의의 뿌리가 된 비잔틴 장군 문제를 해설합니다.",
    externalUrl: "https://medium.com/bluenode/%EB%B9%84%EC%9E%94%ED%8B%B4-%EC%9E%A5%EA%B5%B0-%EB%AC%B8%EC%A0%9C-f30ca88f3979",
  },
];

export function getResearchArticlesNewestFirst(): ResearchArticle[] {
  return [...researchArticles].sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.recordId.localeCompare(b.recordId),
  );
}

export function formatResearchDate(publishedAt: string): string {
  return publishedAt.replaceAll("-", ".");
}
