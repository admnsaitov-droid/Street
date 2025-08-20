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

const StyledHomeView = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  ${minHeightLvh(150)}
`;


export const HomeView = ({ homeData, footerData }: { homeData: any, footerData: any }) => {
  console.log('homeData', homeData);
  const heroData = homeData?.hero;
  const achievementsData = homeData?.achievements;
  const packagesData = homeData?.packages;
  const benefitsData = homeData?.benefits;
  const aboutData = homeData?.about;
  const globeData = homeData?.globe;
  const latestNewsData = homeData?.latestNews;
  const linesData = homeData?.linesBlock;

  return (
    <StyledHomeView>
      <Hero heroData={heroData} />
      <Achievements achievementsData={achievementsData} />
      <Packages packagesData={packagesData} />
      <Lines linesData={linesData} />
      <Benefits benefitsData={benefitsData} />
      <About aboutData={aboutData} />
      <Globe globeData={globeData} />
      <LatestNews latestNewsData={latestNewsData} />
    </StyledHomeView>
  );
};
