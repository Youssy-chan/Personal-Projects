import { HeroSection } from '@/components/sections/HeroSection'
import { AboutSection } from '@/components/sections/AboutSection'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { ProjectsPreview } from '@/components/sections/ProjectsPreview'
import { CtaSection } from '@/components/sections/CtaSection'
import { getDictionary, Locale } from '@/lib/dictionary'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang = (langParam as Locale) ?? 'it'
  const dict = getDictionary(lang)
  return {
    title: `Portfolio — ${dict.hero.role}`,
    description: dict.hero.description,
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params
  const lang = (langParam as Locale) ?? 'it'
  const dict = getDictionary(lang)

  return (
    <>
      <HeroSection lang={lang} dict={dict} />
      <AboutSection lang={lang} dict={dict} />
      <SkillsSection lang={lang} dict={dict} />
      <ProjectsPreview lang={lang} dict={dict} />
      <CtaSection lang={lang} dict={dict} />
    </>
  )
}
