import { auth } from "@clerk/nextjs/server"
import { HeroSection } from "@/modules/home/ui/components/hero-section"
import { RecentProjects } from "@/modules/home/ui/components/recent-projects"
import { TemplatesSection } from "@/modules/home/ui/components/templates-section"
import { DesignSection } from "@/modules/home/ui/components/design-section"
import { FeaturesGrid } from "@/modules/home/ui/components/features-grid"
import { ShowcaseSection } from "@/modules/home/ui/components/showcase-section"
import { TerminalShowcase } from "@/modules/home/ui/components/terminal-showcase"
import { WorkSection } from "@/modules/home/ui/components/work-section"
import { CtaSection } from "@/modules/home/ui/components/cta-section"
import { FooterSection } from "@/modules/home/ui/components/footer-section"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

export default async function Page() {
  const { userId } = await auth()
  const isSignedIn = !!userId

  const queryClient = getQueryClient()
  if (isSignedIn) {
    void queryClient.prefetchQuery(trpc.projects.getMany.queryOptions())
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HeroSection />
      {isSignedIn && <RecentProjects />}
      <TemplatesSection />

      {!isSignedIn && (
        <>
          <FeaturesGrid />
          <ShowcaseSection />
          <TerminalShowcase />
          <WorkSection />
          <DesignSection />
          <CtaSection />
        </>
      )}

      <FooterSection />
    </HydrationBoundary>
  )
}
