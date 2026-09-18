"use client";

import { minHeightLvh } from "@/styles/utils";
import styled from "styled-components";

import { rm } from "@/styles";
import { _colors, colors } from "@/styles/colors";

import { Hero } from "./screens/Hero/Hero";
import { Achievements } from "./screens/Achievements/Achievements";
import { Packages } from "./screens/Packages/Packages";
import { Benefits } from "./screens/Benefits/Benefits";
import { About } from "./screens/About/About";
import { Globe } from "./screens/Globe/Globe";
import { LatestNews } from "./screens/LatestNews/LatestNews";
import { Lines } from "./screens/Lines/Lines";
import { useWindowWidth } from "@react-hook/window-size";
import { useMounted } from "@/hooks/useMounted"
import { PackagesMobile } from "./screens/Packages/PackagedMobile";

const StyledHomeView = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  ${minHeightLvh(150)}
`;


export const HomeView = ({ homeData, footerData }: { homeData: any, footerData: any }) => {
  const heroData = homeData?.hero;
  const achievementsData = homeData?.achievements;
  const packagesData = homeData?.packages;
  const benefitsData = homeData?.benefits;
  const aboutData = homeData?.about;
  const globeData = homeData?.globe;
  const latestNewsData = homeData?.latestNews;
  const linesData = homeData?.linesBlock;

  const width = useWindowWidth()

  // Width-conditional markup must agree with the server on the first render,

  // or React tears the tree down and rebuilds it (hydration mismatch). Until

  // mounted we render as if wide, which is what the server assumed.

  const mounted = useMounted()

  // The globe is NOT gated on the curtain. It sits seven sections down, so
  // holding a full-screen curtain for it delays the hero for every visitor —
  // and it is the Largest Contentful Paint, so that delay is measured. The
  // scene still mounts at page load and prewarms in the background (see
  // `useLazyScene`), which is what keeps the scroll smooth; it simply finishes
  // after the reveal rather than before it. Hero scenes — product, package,
  // distribution — still gate, because there the scene *is* the hero.

  return (
    <StyledHomeView>
      <Hero heroData={heroData} />
      <Achievements achievementsData={achievementsData} />
      {(!mounted || width > 576) ? <Packages packagesData={packagesData} /> : <PackagesMobile packagesData={packagesData} />}
      <Lines linesData={linesData} isHome={true} exploreLineText={linesData?.overviewText}/>
      <Benefits benefitsData={benefitsData} />
      <About aboutData={aboutData} />
      <Globe globeData={globeData} />
      <LatestNews latestNewsData={latestNewsData} />
    </StyledHomeView>
  );
};
