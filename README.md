# BlueNode Homepage

인하대학교 기반 블록체인 학회 [BlueNode](https://www.web3bluenode.xyz)의 공식 홈페이지입니다.

## 스택

- Astro 7 (SSG — 모든 페이지를 빌드 시 정적 HTML로 생성)
- Astro 컴포넌트 + TypeScript (페이지 UI는 정적 HTML, 저자 필터만 1KB 미만 인라인 JS로 점진 향상)
- Tailwind CSS v4 (`@tailwindcss/vite` 플러그인, 별도 설정 파일 없음)
- lucide-react (아이콘)

Node 22.12 이상 필요.

## 개발

```bash
npm install     # 의존성 설치
npm run dev     # 개발 서버 (http://localhost:4321)
npm run build   # 프로덕션 빌드 → dist/ (타입체크는 npx tsc --noEmit 별도 실행)
npm run lint    # ESLint
npm run preview # 빌드 결과 로컬 미리보기
```

## 배포 런북 (S3 + CloudFront, 수동)

프로덕션은 S3 정적 호스팅 + CloudFront CDN 구성이다. 배포는 아래 순서를 **반드시** 지킨다.

1. **빌드**: `npm run build`로 `dist/`를 생성한다.
2. **새 에셋 업로드**: `dist/`의 내용을 S3 버킷에 업로드한다.
   - 해시가 붙은 에셋(`assets/*.js`, `assets/*.css`, 이미지)은 immutable이므로
     `Cache-Control: public, max-age=31536000, immutable`로 올린다.
   - `index.html`은 항상 최신이어야 하므로 `Cache-Control: no-cache`로 올린다
     (해시 에셋과 캐시 정책을 분리하는 것이 핵심 — HTML을 캐시하면 구버전이 고착된다).
   - 루트의 **비해시 파일**(`og-image.png`, `robots.txt`, 빌드 시 생성되는
     `sitemap-*.xml`, `favicon.png`, `images/*`)은 파일명이 안 바뀌므로 immutable 금지 —
     `Cache-Control: public, max-age=3600` 수준의 짧은 TTL로 올린다.
3. **구 에셋 삭제**: 새 빌드에 없는 기존 `assets/` 객체를 S3에서 삭제한다
   (파일명 해시가 바뀌므로 청소하지 않으면 버킷이 무한히 커진다).
4. **CloudFront 무효화**: `/*` 경로로 invalidation을 생성한다. HTML을 no-cache로
   올렸더라도, 엣지 캐시를 확실히 비우려면 무효화를 실행한다.

> 순서 요약: 새 dist 업로드 → 구 assets 객체 삭제 → CloudFront `/*` 무효화.
> HTML은 no-cache, 해시 에셋은 장기 immutable TTL로 캐시 정책을 반드시 분리한다.
