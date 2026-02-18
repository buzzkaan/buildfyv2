import { notFound } from "next/navigation"
import { SaasLanding } from "./templates/saas-landing"
import { AdminDashboard } from "./templates/admin-dashboard"
import { EcommerceStore } from "./templates/ecommerce-store"
import { Portfolio } from "./templates/portfolio"
import { BlogPlatform } from "./templates/blog-platform"
import { AiChat } from "./templates/ai-chat"
import { DocsSite } from "./templates/docs-site"
import { SocialFeed } from "./templates/social-feed"

const templateMap: Record<string, React.ComponentType> = {
  "saas-landing": SaasLanding,
  "admin-dashboard": AdminDashboard,
  "ecommerce-store": EcommerceStore,
  "portfolio": Portfolio,
  "blog-platform": BlogPlatform,
  "ai-chat": AiChat,
  "docs-site": DocsSite,
  "social-feed": SocialFeed,
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params
  const Template = templateMap[slug]
  if (!Template) notFound()
  return <Template />
}

export function generateStaticParams() {
  return Object.keys(templateMap).map((slug) => ({ slug }))
}
